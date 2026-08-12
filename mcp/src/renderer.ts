/**
 * Renderer
 *
 * Owns the headless side: a loopback static server for the built render bundle
 * and a reused Chromium instance. Rendering itself is delegated to
 * `window.__APPSHOTS_RENDER__.render` inside the page, which calls the same
 * `renderScreenshotsToDataURLs` the editor's Export button uses.
 */

import http from "node:http";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import type { AddressInfo } from "node:net";
import { chromium, type Browser } from "playwright";
import type { RenderRequest, RenderResult } from "../../src/render-entry";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

export class RenderError extends Error {}

export interface RendererOptions {
  /** Directory containing the built render.html (default: <repo>/dist-mcp) */
  distDir: string;
  /** Hard ceiling for one render batch */
  timeoutMs?: number;
  /** Run Chromium with a visible window (debugging) */
  headful?: boolean;
  /** Extra Chromium flags, e.g. --no-sandbox in containers */
  chromiumArgs?: string[];
}

const startStaticServer = (distDir: string): Promise<http.Server> =>
  new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url ?? "/", "http://127.0.0.1");
        const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
        const target = path.resolve(distDir, relative || "render.html");

        if (
          path.relative(distDir, target).startsWith("..") ||
          path.isAbsolute(path.relative(distDir, target))
        ) {
          res.writeHead(403).end("Forbidden");
          return;
        }

        const body = await fsp.readFile(target);
        res.writeHead(200, {
          "content-type": MIME_TYPES[path.extname(target)] ?? "application/octet-stream",
          "cache-control": "no-store",
        });
        res.end(body);
      } catch {
        res.writeHead(404).end("Not found");
      }
    });

    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server));
  });

export class Renderer {
  private readonly distDir: string;
  private readonly timeoutMs: number;
  private readonly headful: boolean;
  private readonly chromiumArgs: string[];

  private server: http.Server | null = null;
  private browser: Browser | null = null;
  private startup: Promise<void> | null = null;

  constructor(options: RendererOptions) {
    this.distDir = path.resolve(options.distDir);
    this.timeoutMs = options.timeoutMs ?? 120_000;
    this.headful = options.headful ?? false;
    this.chromiumArgs = options.chromiumArgs ?? [];
  }

  /** Absolute path of the render bundle entry point */
  private get entryPath() {
    return path.join(this.distDir, "render.html");
  }

  private async start(): Promise<void> {
    if (!fs.existsSync(this.entryPath)) {
      throw new RenderError(
        `Render bundle not found at ${this.entryPath}. Build it first:\n` +
          `  bun run build:render        # from the repo root\n` +
          `Or point the server at an existing build with --dist <dir>.`,
      );
    }

    this.server = await startStaticServer(this.distDir);

    try {
      this.browser = await chromium.launch({
        headless: !this.headful,
        args: this.chromiumArgs,
      });
    } catch (error) {
      const message = (error as Error).message;
      if (/Executable doesn't exist|browserType.launch/i.test(message)) {
        throw new RenderError(
          `Chromium is not installed for Playwright. Install it with:\n` +
            `  cd mcp && bunx playwright install chromium\n\nOriginal error: ${message}`,
        );
      }
      throw new RenderError(`Could not launch Chromium: ${message}`);
    }
  }

  private async ensureStarted(): Promise<void> {
    if (this.browser?.isConnected() && this.server) return;

    // Chromium died between calls: reset and relaunch
    if (this.browser && !this.browser.isConnected()) {
      this.browser = null;
      this.startup = null;
    }

    if (!this.startup) {
      this.startup = this.start().catch((error) => {
        this.startup = null;
        throw error;
      });
    }

    await this.startup;
  }

  private get baseUrl(): string {
    const address = this.server?.address() as AddressInfo | null;
    if (!address) throw new RenderError("Static server is not listening");
    return `http://127.0.0.1:${address.port}/render.html`;
  }

  /**
   * Renders a batch of screenshots in a fresh page.
   */
  async render(request: RenderRequest): Promise<RenderResult> {
    await this.ensureStarted();

    const page = await this.browser!.newPage({
      viewport: { width: 1280, height: 900 },
    });

    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") pageErrors.push(message.text());
    });

    let timer: NodeJS.Timeout | undefined;

    try {
      await page.goto(this.baseUrl, { waitUntil: "load", timeout: 30_000 });
      await page.waitForFunction(
        () => Boolean(window.__APPSHOTS_RENDER__),
        undefined,
        { timeout: 30_000 },
      );

      const evaluation = page.evaluate(
        (payload) => window.__APPSHOTS_RENDER__!.render(payload),
        request,
      );

      const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(
          () =>
            reject(
              new RenderError(
                `Rendering exceeded ${this.timeoutMs}ms. Reduce the number of screens, ` +
                  `lower the export size, or raise the limit with --timeout.`,
              ),
            ),
          this.timeoutMs,
        );
      });

      const result = await Promise.race([evaluation, timeout]);

      if (!result?.files?.length) {
        throw new RenderError(
          `Renderer returned no images.${pageErrors.length ? ` Page errors: ${pageErrors.join(" | ")}` : ""}`,
        );
      }

      return {
        ...result,
        warnings: [...result.warnings, ...pageErrors.map((e) => `page error: ${e}`)],
      };
    } catch (error) {
      if (error instanceof RenderError) throw error;
      const detail = pageErrors.length ? ` Page errors: ${pageErrors.join(" | ")}` : "";
      throw new RenderError(`${(error as Error).message}${detail}`);
    } finally {
      if (timer) clearTimeout(timer);
      await page.close().catch(() => undefined);
    }
  }

  async close(): Promise<void> {
    await this.browser?.close().catch(() => undefined);
    this.browser = null;
    this.startup = null;

    await new Promise<void>((resolve) => {
      if (!this.server) return resolve();
      this.server.close(() => resolve());
      this.server = null;
    });
  }
}
