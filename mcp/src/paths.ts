/**
 * Filesystem Guard
 *
 * Every path the agent supplies — input images and the output directory — is
 * resolved through here. Reads and writes are confined to a single root
 * (default: the server's working directory) so a remote agent cannot walk the
 * filesystem via a crafted spec.
 */

import path from "node:path";
import fs from "node:fs/promises";

export class SpecError extends Error {}

export interface FsGuard {
  /** Absolute root that all paths must stay inside */
  root: string;
  /** Resolves a user path and throws if it escapes the root */
  resolve: (input: string, label: string) => string;
}

export const createFsGuard = (root: string): FsGuard => {
  const absoluteRoot = path.resolve(root);

  return {
    root: absoluteRoot,
    resolve: (input: string, label: string) => {
      if (!input || typeof input !== "string") {
        throw new SpecError(`${label}: expected a filesystem path`);
      }

      const resolved = path.resolve(absoluteRoot, input);
      const relative = path.relative(absoluteRoot, resolved);

      if (relative.startsWith("..") || path.isAbsolute(relative)) {
        throw new SpecError(
          `${label}: "${input}" resolves outside the allowed root (${absoluteRoot}). ` +
            `Start the server with --fs-root to widen access.`,
        );
      }

      return resolved;
    },
  };
};

/** Creates a directory, surfacing a spec-level error on failure */
export const ensureDirectory = async (dir: string, label: string) => {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    throw new SpecError(
      `${label}: could not create directory "${dir}" (${(error as Error).message})`,
    );
  }
};

/** Turns a screen name into a safe file stem */
export const sanitizeFileStem = (input: string): string =>
  input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "screenshot";
