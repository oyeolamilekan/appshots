import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

/**
 * Build config for the headless renderer used by the MCP server.
 *
 * Kept separate from `vite.config.ts` so `render.html` never ships with the
 * public site and the render bundle stays free of React, Tailwind and devtools.
 * Output: `dist-mcp/render.html`.
 */
export default defineConfig({
  // Relative asset URLs so the bundle works from any served path
  base: "./",
  build: {
    outDir: "dist-mcp",
    emptyOutDir: true,
    // No hashing needed: the MCP server always serves the whole directory
    rollupOptions: {
      input: fileURLToPath(new URL("./render.html", import.meta.url)),
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
