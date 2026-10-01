# @appshots/mcp

MCP server that renders App Store / Google Play screenshots from a declarative spec. An agent describes the screens; the server returns finished PNGs.

Rendering runs the editor's own export pipeline (`renderScreenshotsToDataURLs`) inside a headless Chromium page, so MCP output is identical to clicking Export in the web editor — same 3D frames, rich-text highlights, shadows and cross-screen device overflow.

## Setup

```bash
# from the repo root: build the render bundle, install deps, get Chromium, build the server
bun run mcp:setup
```

Or step by step:

```bash
bun run build:render          # -> dist-mcp/render.html
cd mcp
bun install
bunx playwright install chromium
bun run build                 # -> mcp/dist/index.js
```

Rebuild the render bundle (`bun run build:render`) whenever anything under `src/` that affects rendering changes — the server loads the built bundle, not your source tree.

## Running

```bash
node mcp/dist/index.js                       # stdio (default)
node mcp/dist/index.js --http 3579           # streamable HTTP at POST /mcp
node mcp/dist/index.js --fs-root ~/shots     # confine reads/writes to a directory
node mcp/dist/index.js --headful             # watch Chromium render (debugging)
```

| Flag | Default | Purpose |
|---|---|---|
| `--http [port]` | off, `3579` | Serve streamable HTTP instead of stdio |
| `--host <host>` | `127.0.0.1` | HTTP bind address |
| `--dist <dir>` | `<repo>/dist-mcp` | Render bundle location |
| `--fs-root <dir>` | `cwd` | Root for input images and output PNGs; paths outside are rejected |
| `--timeout <ms>` | `120000` | Ceiling for one render batch |
| `--no-sandbox` | off | Adds `--no-sandbox --disable-dev-shm-usage` for containers |

Environment equivalents: `APPSHOTS_RENDER_DIST`, `APPSHOTS_FS_ROOT`, `APPSHOTS_PORT`.

### Claude Code / desktop client config

```json
{
  "mcpServers": {
    "appshots": {
      "command": "node",
      "args": ["/absolute/path/to/appshots/mcp/dist/index.js", "--fs-root", "/absolute/path/to/work-dir"]
    }
  }
}
```

## Tools

### `get_catalog`

Valid ids for everything a spec references: device models with their frame colors, export sizes, gradient presets, position presets, fonts, and the editor's numeric ranges. Optional `section` narrows the response.

### `validate_spec`

Dry run — no browser. Checks ids, resolves and reads every image reference, and returns the paths `render_screenshots` would write. Cheap way for an agent to fix a bad spec.

### `render_screenshots`

Renders and writes PNGs, returning `{ ok, outDir, exportSize, files: [{ path, bytes }], warnings }`.

```json
{
  "outDir": "./out",
  "exportSize": "6.7",
  "headlineFontSize": 84,
  "screens": [
    {
      "headline": "Track <mark style=\"background-color:#fde047\">everything</mark>",
      "subheadline": "One tap. Every account.",
      "fontFamily": "Poppins",
      "background": { "gradient": "sunset" },
      "devices": [
        {
          "model": "iphone-15-pro-max",
          "color": "black",
          "screen": "./shots/home.png",
          "preset": "perspective"
        }
      ]
    },
    {
      "headline": "Built for <b>speed</b>",
      "background": { "color": "#0f172a" },
      "textColor": "#f8fafc",
      "devices": [
        { "model": "iphone-15-pro-max", "screen": "./shots/stats.png", "preset": "centered", "scale": 72 }
      ],
      "overlays": [
        { "image": "./badges/app-store.png", "x": 50, "y": 88, "width": 34 }
      ]
    }
  ]
}
```

## Things worth knowing

**`previewWidth` controls text scale.** The editor's export multiplies font sizes by `exportSize.width / previewWidth`, where `previewWidth` is the measured on-screen card width — meaning the editor's own output varies with window size. The server pins it to `320` by default so renders are deterministic. Lower it to make text bigger, raise it to make text smaller.

**Text is HTML, and only some tags survive.** The canvas parser understands `<b> <strong> <i> <em> <u> <br> <mark> <font color> <span style="color|background-color|font-weight|font-style|text-decoration">`. Line breaks must be `<br>` — `<div>` and `<p>` do not break lines in the export.

**Device `x` beyond 0–100 spills into the next screen.** Positions are percentages of one screenshot; a device at `x: 125` on screen 1 continues onto screen 2, which is how panorama sets are built. Devices stay owned by the screen that declares them.

**Fonts need network access.** Families load from `fonts.googleapis.com` at render time and only the list in `src/lib/google-fonts.ts` is available. Anything else renders with the fallback sans-serif face; the response's `warnings` names families that failed to load, so check it rather than trusting the pixels.

**Images arrive as data URLs.** Local paths (inside `--fs-root`), `http(s)` URLs and `data:` URLs all work; each is capped at 25MB, with a 150MB budget per request. Undecodable images are skipped and reported in `warnings` — they do not fail the render.

**Overlay height is derived.** Omit `height` and it is computed from the image's aspect ratio, matching how the editor sizes a newly uploaded overlay.

**Text blocks do not push each other apart.** Headline and subheadline are absolutely positioned (defaults: headline `y: 10`, subheadline `y: 18`), so a two-line headline or a large `headlineFontSize` will overlap the subheadline. Raise `subheadlineLayout.y` when the headline wraps — roughly `10 + 4 × lines` for the default size.
