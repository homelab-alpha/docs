// A small static file server for the built site, with gzip, so Lighthouse
// measures it like a real host.

import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { createGzip } from "node:zlib";

import { PORT, SITE_DIR } from "./config.mjs";

const TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

const COMPRESS = new Set([".css", ".html", ".js", ".json", ".svg", ".txt", ".webmanifest", ".xml"]);

// Map a URL path to a file in the site, or null.
export function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  const file = path.join(SITE_DIR, p);
  if (!file.startsWith(SITE_DIR)) return null;
  if (existsSync(file) && statSync(file).isDirectory()) {
    const index = path.join(file, "index.html");
    return existsSync(index) ? index : null;
  }
  return existsSync(file) ? file : null;
}

// Start the server. Resolves to the server; close it with server.close().
export function startServer() {
  if (!existsSync(SITE_DIR)) {
    throw new Error(`Built site not found: ${SITE_DIR}. Build it first or set SITE_DIR.`);
  }
  const server = http.createServer((req, res) => {
    let file = resolveFile(req.url);
    let status = 200;
    if (!file) {
      // A directory path without a trailing slash: redirect, like a real host.
      const dir = path.join(SITE_DIR, decodeURIComponent(req.url.split(/[?#]/)[0]));
      if (!req.url.endsWith("/") && existsSync(path.join(dir, "index.html"))) {
        res.writeHead(301, { Location: req.url + "/" });
        res.end();
        return;
      }
      file = path.join(SITE_DIR, "404.html");
      status = 404;
    }
    const ext = path.extname(file);
    const headers = { "Content-Type": TYPES[ext] || "application/octet-stream", "Cache-Control": "max-age=3600" };
    const gzip = COMPRESS.has(ext) && /\bgzip\b/.test(req.headers["accept-encoding"] || "");
    if (gzip) headers["Content-Encoding"] = "gzip";
    res.writeHead(status, headers);
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    const stream = createReadStream(file);
    (gzip ? stream.pipe(createGzip()) : stream).pipe(res);
  });
  return new Promise((resolve) => server.listen(PORT, "localhost", () => resolve(server)));
}

// Whether the build has the landing page at / (development build).
export function buildHasLanding() {
  const index = path.join(SITE_DIR, "index.html");
  return existsSync(index) && /landing-hero/.test(readFileSync(index, "utf8"));
}

export const origin = `http://localhost:${PORT}`;
