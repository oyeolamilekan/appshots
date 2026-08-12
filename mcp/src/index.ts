/**
 * CLI Entry
 *
 * Defaults to stdio (local MCP clients). `--http [port]` exposes the same tools
 * over streamable HTTP for remote use.
 */

import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Renderer } from "./renderer";
import { createFsGuard } from "./paths";
import { SERVER_NAME, SERVER_VERSION, createServer } from "./server";

interface Options {
  http: boolean;
  port: number;
  host: string;
  distDir: string;
  fsRoot: string;
  timeoutMs: number;
  headful: boolean;
  chromiumArgs: string[];
}

const HELP = `${SERVER_NAME} ${SERVER_VERSION} - MCP server for App Store / Play Store screenshots

Usage: appshots-mcp [options]

  --http [port]        Serve streamable HTTP instead of stdio (default port 3579)
  --host <host>        HTTP bind address (default 127.0.0.1)
  --dist <dir>         Render bundle directory (default <repo>/dist-mcp)
  --fs-root <dir>      Root for reading input images and writing PNGs (default cwd)
  --timeout <ms>       Ceiling for one render batch (default 120000)
  --headful            Show the Chromium window (debugging)
  --no-sandbox         Pass --no-sandbox to Chromium (containers)
  -h, --help           This message

Environment:
  APPSHOTS_RENDER_DIST, APPSHOTS_FS_ROOT, APPSHOTS_PORT
`;

const parseArgs = (argv: string[]): Options => {
  // dist/index.js -> <repo>/dist-mcp
  const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const repoRoot = path.resolve(packageRoot, "..");

  const options: Options = {
    http: false,
    port: Number(process.env.APPSHOTS_PORT ?? 3579),
    host: "127.0.0.1",
    distDir: process.env.APPSHOTS_RENDER_DIST ?? path.join(repoRoot, "dist-mcp"),
    fsRoot: process.env.APPSHOTS_FS_ROOT ?? process.cwd(),
    timeoutMs: 120_000,
    headful: false,
    chromiumArgs: [],
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];

    switch (arg) {
      case "-h":
      case "--help":
        process.stdout.write(HELP);
        process.exit(0);
        break;
      case "--http":
        options.http = true;
        if (next && /^\d+$/.test(next)) {
          options.port = Number(next);
          i++;
        }
        break;
      case "--host":
        options.host = next;
        i++;
        break;
      case "--dist":
        options.distDir = path.resolve(next);
        i++;
        break;
      case "--fs-root":
        options.fsRoot = path.resolve(next);
        i++;
        break;
      case "--timeout":
        options.timeoutMs = Number(next);
        i++;
        break;
      case "--headful":
        options.headful = true;
        break;
      case "--no-sandbox":
        options.chromiumArgs.push("--no-sandbox", "--disable-dev-shm-usage");
        break;
      default:
        throw new Error(`Unknown argument: ${arg}\n\n${HELP}`);
    }
  }

  return options;
};

const readJsonBody = (req: http.IncomingMessage): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;

    req.on("data", (chunk: Buffer) => {
      size += chunk.byteLength;
      // Specs carry base64 images; keep the ceiling generous but bounded
      if (size > 200 * 1024 * 1024) {
        reject(new Error("Request body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve(undefined);
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });

const main = async () => {
  const options = parseArgs(process.argv.slice(2));

  const renderer = new Renderer({
    distDir: options.distDir,
    timeoutMs: options.timeoutMs,
    headful: options.headful,
    chromiumArgs: options.chromiumArgs,
  });
  const guard = createFsGuard(options.fsRoot);

  let shuttingDown = false;
  const shutdown = async (code = 0) => {
    if (shuttingDown) return;
    shuttingDown = true;
    await renderer.close();
    process.exit(code);
  };

  process.on("SIGINT", () => void shutdown(0));
  process.on("SIGTERM", () => void shutdown(0));

  if (!options.http) {
    const server = createServer({ renderer, guard });
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // stdio clients signal shutdown by closing stdin
    process.stdin.on("close", () => void shutdown(0));
    return;
  }

  // Stateless HTTP: a fresh server + transport per request, so there is no
  // cross-request session state to leak between agents.
  const httpServer = http.createServer((req, res) => {
    void (async () => {
      const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "127.0.0.1"}`);

      if (req.method === "GET" && url.pathname === "/health") {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ ok: true, name: SERVER_NAME, version: SERVER_VERSION }));
        return;
      }

      if (req.method !== "POST" || url.pathname !== "/mcp") {
        res.writeHead(405, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            jsonrpc: "2.0",
            error: { code: -32000, message: "Use POST /mcp" },
            id: null,
          }),
        );
        return;
      }

      const server = createServer({ renderer, guard });
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });

      res.on("close", () => {
        void transport.close();
        void server.close();
      });

      try {
        const body = await readJsonBody(req);
        await server.connect(transport);
        await transport.handleRequest(req, res, body);
      } catch (error) {
        if (!res.headersSent) {
          res.writeHead(400, { "content-type": "application/json" });
          res.end(
            JSON.stringify({
              jsonrpc: "2.0",
              error: { code: -32700, message: (error as Error).message },
              id: null,
            }),
          );
        }
      }
    })();
  });

  httpServer.listen(options.port, options.host, () => {
    process.stderr.write(
      `${SERVER_NAME} listening on http://${options.host}:${options.port}/mcp\n` +
        `fs root: ${guard.root}\nrender bundle: ${options.distDir}\n`,
    );
  });
};

main().catch((error) => {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exit(1);
});
