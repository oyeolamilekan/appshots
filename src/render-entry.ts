/**
 * Headless Render Entry
 *
 * Bundled by `vite.render.config.ts` into `dist-mcp/render.html` and loaded by
 * the MCP server in a headless Chromium page. It exposes exactly one thing on
 * `window` — a render function that hands a fully-formed `Screenshot[]` to the
 * same `renderScreenshotsToDataURLs` used by the editor's Export button, so
 * MCP output and editor output come from one code path.
 *
 * Deliberately imports no React, no editor state, no localStorage.
 */

import { renderScreenshotsToDataURLs } from "./lib/export-utils";
import type { RenderedScreenshot } from "./lib/export-utils";
import { generateGoogleFontsUrl, googleFonts } from "./lib/google-fonts";
import type { ExportSize, Screenshot } from "./types";

/** Font weights the canvas exporter can ask for (700 headline, 600 subheadline) */
const REQUIRED_WEIGHTS = ["400", "600", "700"] as const;

export interface RenderRequest {
  /** Fully normalized screenshots, built by the MCP server */
  screenshots: Screenshot[];
  /** Target export dimensions */
  exportSize: ExportSize;
  /**
   * Text-scale reference width in CSS px. Mirrors the editor's measured
   * preview width; every font size is scaled by exportSize.width / previewWidth.
   */
  previewWidth: number;
  /** Headline size in editor slider units (32-120) */
  headlineFontSize: number;
  /** Subheadline size in editor slider units (20-72) */
  subheadlineFontSize: number;
}

export interface RenderResult {
  files: RenderedScreenshot[];
  /** Which requested font families actually resolved to a web font */
  fonts: { family: string; loaded: boolean }[];
  /** Non-fatal problems, e.g. images that failed to decode */
  warnings: string[];
}

let fontsLinkPromise: Promise<void> | null = null;

/**
 * Injects the Google Fonts stylesheet once and resolves when it has loaded.
 */
const ensureFontStylesheet = (): Promise<void> => {
  if (fontsLinkPromise) return fontsLinkPromise;

  fontsLinkPromise = new Promise<void>((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = generateGoogleFontsUrl();
    // Resolve either way: offline renders fall back to system fonts
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });

  return fontsLinkPromise;
};

/**
 * Forces the requested families to download.
 *
 * `document.fonts.ready` alone is not enough here: the editor triggers webfont
 * loading by rendering text in the DOM, but this page renders only to canvas,
 * so nothing would request the font and `ctx.font` would silently fall back.
 */
const ensureFontsLoaded = async (
  families: string[],
): Promise<{ family: string; loaded: boolean }[]> => {
  await ensureFontStylesheet();

  const known = new Set(googleFonts.map((font) => font.family));

  await Promise.all(
    families.flatMap((family) =>
      REQUIRED_WEIGHTS.map((weight) =>
        document.fonts
          .load(`${weight} 100px '${family}'`)
          .catch(() => undefined),
      ),
    ),
  );

  await document.fonts.ready;

  return families.map((family) => ({
    family,
    loaded: known.has(family) && document.fonts.check(`700 100px '${family}'`),
  }));
};

/** Loads an image and resolves its natural size, or null when it fails */
const measureImage = (
  src: string,
): Promise<{ width: number; height: number } | null> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = src;
  });

/**
 * Resolves overlay heights and reports undecodable images.
 *
 * The MCP server sends `height: 0` to mean "derive from the image's aspect
 * ratio", matching how the editor sizes a freshly uploaded overlay
 * (height% = width% / imageAspect).
 */
const prepareImages = async (
  screenshots: Screenshot[],
): Promise<string[]> => {
  const warnings: string[] = [];

  for (const [screenIndex, screenshot] of screenshots.entries()) {
    for (const device of screenshot.devices) {
      if (!device.screenshotSrc) continue;
      const size = await measureImage(device.screenshotSrc);
      if (!size) {
        warnings.push(
          `screen ${screenIndex + 1}: device screen image could not be decoded and was skipped`,
        );
      }
    }

    for (const [overlayIndex, overlay] of screenshot.overlayImages.entries()) {
      const size = await measureImage(overlay.src);
      if (!size) {
        warnings.push(
          `screen ${screenIndex + 1}: overlay ${overlayIndex + 1} could not be decoded and was skipped`,
        );
        continue;
      }
      if (overlay.height <= 0) {
        overlay.height = overlay.width / (size.width / size.height);
      }
    }
  }

  return warnings;
};

/**
 * Renders a batch of screenshots to PNG data URLs.
 */
const render = async (request: RenderRequest): Promise<RenderResult> => {
  const { screenshots, exportSize, previewWidth } = request;

  const families = Array.from(
    new Set(screenshots.map((screenshot) => screenshot.fontFamily)),
  );
  const fonts = await ensureFontsLoaded(families);
  const warnings = await prepareImages(screenshots);

  const previewDimensions = {
    width: previewWidth,
    height: previewWidth * (exportSize.height / exportSize.width),
  };

  const files = await renderScreenshotsToDataURLs({
    screenshots,
    exportSize,
    previewDimensions,
    headlineFontSize: request.headlineFontSize,
    subheadlineFontSize: request.subheadlineFontSize,
  });

  return { files, fonts, warnings };
};

export interface AppshotsRenderApi {
  /** Bumped when the request/result contract changes */
  version: number;
  render: (request: RenderRequest) => Promise<RenderResult>;
}

declare global {
  interface Window {
    __APPSHOTS_RENDER__?: AppshotsRenderApi;
  }
}

window.__APPSHOTS_RENDER__ = { version: 1, render };
