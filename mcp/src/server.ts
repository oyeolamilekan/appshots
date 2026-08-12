/**
 * MCP Server
 *
 * Three tools:
 *   get_catalog        - valid device models, colors, sizes, gradients, presets, fonts
 *   validate_spec      - dry run: id checks + planned output paths, no browser launch
 *   render_screenshots - renders the spec and writes PNGs to disk
 */

import fsp from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { catalogSections, getCatalog, type CatalogSection } from "./catalog";
import { createImageResolver } from "./images";
import {
  buildRenderRequest,
  renderInputSchema,
  resolveExportSize,
  validateInputSchema,
} from "./spec";
import {
  SpecError,
  ensureDirectory,
  sanitizeFileStem,
  type FsGuard,
} from "./paths";
import { RenderError, type Renderer } from "./renderer";

export const SERVER_NAME = "appshots";
export const SERVER_VERSION = "0.1.0";

export interface ServerDependencies {
  renderer: Renderer;
  guard: FsGuard;
}

const asText = (payload: unknown) => ({
  content: [
    {
      type: "text" as const,
      text: typeof payload === "string" ? payload : JSON.stringify(payload, null, 2),
    },
  ],
});

const asError = (error: unknown) => ({
  isError: true,
  content: [
    {
      type: "text" as const,
      text:
        error instanceof SpecError || error instanceof RenderError
          ? error.message
          : `Unexpected failure: ${(error as Error).message}`,
    },
  ],
});

/** Makes file stems unique so two screens never overwrite each other */
const uniqueStems = (stems: string[]): string[] => {
  const seen = new Map<string, number>();
  return stems.map((stem) => {
    const safe = sanitizeFileStem(stem);
    const count = seen.get(safe) ?? 0;
    seen.set(safe, count + 1);
    return count === 0 ? safe : `${safe}-${count + 1}`;
  });
};

const dataUrlToBuffer = (dataUrl: string): Buffer =>
  Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");

export const createServer = ({ renderer, guard }: ServerDependencies) => {
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });

  server.registerTool(
    "get_catalog",
    {
      title: "List available devices, sizes and styles",
      description:
        "Returns every id a screenshot spec can reference: device models with their frame " +
        "colors, export sizes, gradient presets, position presets, Google Fonts and the " +
        "numeric ranges the editor uses. Call this before render_screenshots when unsure of an id.",
      inputSchema: {
        section: z
          .enum(catalogSections as [CatalogSection, ...CatalogSection[]])
          .optional()
          .describe("Return only one section instead of the full catalog"),
      },
    },
    async ({ section }) => asText(getCatalog(section)),
  );

  server.registerTool(
    "validate_spec",
    {
      title: "Dry-run a screenshot spec",
      description:
        "Validates a spec without launching a browser: checks device/color/gradient/preset ids, " +
        "resolves every image reference (reading local files and fetching URLs), and reports the " +
        "output paths that render_screenshots would write. Use it to fix a spec cheaply.",
      inputSchema: validateInputSchema.shape,
    },
    async (input) => {
      try {
        const resolver = createImageResolver(guard);
        const built = await buildRenderRequest(input, resolver);
        const exportSize = resolveExportSize(input.exportSize);
        const stems = uniqueStems(built.fileStems);
        const outDir = input.outDir
          ? guard.resolve(input.outDir, "outDir")
          : null;

        return asText({
          ok: true,
          exportSize,
          screens: built.request.screenshots.length,
          devices: built.request.screenshots.reduce(
            (total, screen) => total + screen.devices.length,
            0,
          ),
          imagesResolved: resolver.sources.length,
          imageBytes: resolver.bytes,
          plannedFiles: stems.map((stem) =>
            outDir ? path.join(outDir, `${stem}.png`) : `${stem}.png`,
          ),
          warnings: built.warnings,
        });
      } catch (error) {
        return asError(error);
      }
    },
  );

  server.registerTool(
    "render_screenshots",
    {
      title: "Render App Store / Play Store screenshots",
      description:
        "Renders a declarative spec into store-ready PNGs and writes them to outDir, returning " +
        "the file paths. Each screen is a background plus one or more device frames (flat or 3D), " +
        "a rich-text headline and subheadline, and optional overlay images. Rendering uses the same " +
        "pipeline as the AppShots editor's Export button, so output matches the editor exactly. " +
        "Tip: a device x beyond 0-100 continues it into the neighboring screen for panorama layouts.",
      inputSchema: renderInputSchema.shape,
    },
    async (input) => {
      try {
        const resolver = createImageResolver(guard);
        const built = await buildRenderRequest(input, resolver);
        const outDir = guard.resolve(input.outDir, "outDir");
        await ensureDirectory(outDir, "outDir");

        const result = await renderer.render(built.request);
        const stems = uniqueStems(built.fileStems);

        const files: { path: string; bytes: number }[] = [];
        for (const [index, file] of result.files.entries()) {
          const target = path.join(outDir, `${stems[index] ?? `screenshot-${index + 1}`}.png`);
          const buffer = dataUrlToBuffer(file.data);
          await fsp.writeFile(target, buffer);
          files.push({ path: target, bytes: buffer.byteLength });
        }

        const fallbackFonts = result.fonts
          .filter((font) => !font.loaded)
          .map((font) => font.family);

        const warnings = [...built.warnings, ...result.warnings];
        if (fallbackFonts.length) {
          warnings.push(
            `font not loaded (rendered with the fallback face): ${fallbackFonts.join(", ")}. ` +
              `Check network access to fonts.googleapis.com, or pick a family from get_catalog.`,
          );
        }

        return asText({
          ok: true,
          outDir,
          exportSize: built.request.exportSize,
          files,
          warnings,
        });
      } catch (error) {
        return asError(error);
      }
    },
  );

  return server;
};
