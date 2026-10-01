/**
 * Image Resolution
 *
 * The renderer runs inside a headless page with no filesystem access, so every
 * image reference in a spec is converted to a data URL before it is handed to
 * the page. Accepts local paths (inside the fs root), http(s) URLs and
 * pre-built data URLs.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { SpecError, type FsGuard } from "./paths";

/** Per-image ceiling; data URLs are ~33% larger than the source bytes */
const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
/** Ceiling for one render request, guards against page.evaluate blowups */
const MAX_TOTAL_BYTES = 150 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 20_000;

const MIME_BY_EXTENSION: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

export interface ImageResolver {
  resolve: (ref: string, label: string) => Promise<string>;
  /** Human-readable list of what was read, for validate/dry-run output */
  readonly sources: string[];
  readonly bytes: number;
}

const formatBytes = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)}MB`;

/**
 * Creates a per-request resolver so byte accounting is scoped to one render.
 */
export const createImageResolver = (guard: FsGuard): ImageResolver => {
  const sources: string[] = [];
  let bytes = 0;

  const track = (source: string, size: number, label: string) => {
    if (size > MAX_IMAGE_BYTES) {
      throw new SpecError(
        `${label}: image is ${formatBytes(size)}, over the ${formatBytes(MAX_IMAGE_BYTES)} per-image limit`,
      );
    }
    bytes += size;
    if (bytes > MAX_TOTAL_BYTES) {
      throw new SpecError(
        `request exceeds the ${formatBytes(MAX_TOTAL_BYTES)} total image budget`,
      );
    }
    sources.push(source);
  };

  const resolve = async (ref: string, label: string): Promise<string> => {
    if (!ref || typeof ref !== "string") {
      throw new SpecError(`${label}: expected an image path, URL or data URL`);
    }

    if (ref.startsWith("data:")) {
      if (!/^data:image\/[a-z0-9.+-]+;base64,/i.test(ref)) {
        throw new SpecError(
          `${label}: data URLs must be base64-encoded images (data:image/...;base64,...)`,
        );
      }
      track("<inline data URL>", Math.floor((ref.length * 3) / 4), label);
      return ref;
    }

    if (/^https?:\/\//i.test(ref)) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      try {
        const response = await fetch(ref, { signal: controller.signal });
        if (!response.ok) {
          throw new SpecError(
            `${label}: fetching ${ref} failed with HTTP ${response.status}`,
          );
        }
        const contentType = response.headers.get("content-type") ?? "";
        if (!contentType.startsWith("image/")) {
          throw new SpecError(
            `${label}: ${ref} returned content-type "${contentType || "unknown"}", expected image/*`,
          );
        }
        const buffer = Buffer.from(await response.arrayBuffer());
        track(ref, buffer.byteLength, label);
        return `data:${contentType.split(";")[0]};base64,${buffer.toString("base64")}`;
      } catch (error) {
        if (error instanceof SpecError) throw error;
        const reason =
          (error as Error).name === "AbortError"
            ? `timed out after ${FETCH_TIMEOUT_MS}ms`
            : (error as Error).message;
        throw new SpecError(`${label}: could not fetch ${ref} (${reason})`);
      } finally {
        clearTimeout(timer);
      }
    }

    const absolute = guard.resolve(ref, label);
    const extension = path.extname(absolute).toLowerCase();
    const mime = MIME_BY_EXTENSION[extension];

    if (!mime) {
      throw new SpecError(
        `${label}: unsupported image extension "${extension || "(none)"}". ` +
          `Supported: ${Object.keys(MIME_BY_EXTENSION).join(", ")}`,
      );
    }

    let buffer: Buffer;
    try {
      buffer = await fs.readFile(absolute);
    } catch (error) {
      throw new SpecError(
        `${label}: could not read "${ref}" (${(error as Error).message})`,
      );
    }

    track(absolute, buffer.byteLength, label);
    return `data:${mime};base64,${buffer.toString("base64")}`;
  };

  return {
    resolve,
    get sources() {
      return sources;
    },
    get bytes() {
      return bytes;
    },
  };
};
