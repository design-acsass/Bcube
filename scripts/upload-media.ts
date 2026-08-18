/**
 * Copies every image and video the site uses into your own Supabase Storage.
 *
 * Usage (from the project root, after `bun install`):
 *
 *   SUPABASE_URL="https://YOUR-PROJECT.supabase.co" \
 *   SUPABASE_SERVICE_ROLE_KEY="service-role-key" \
 *   SOURCE_BASE="https://your-current-live-site.com" \
 *   bun scripts/upload-media.ts
 *
 * SOURCE_BASE is where the files are downloaded from — the currently running
 * site. Alternatively point SOURCE_DIR at a local folder that already contains
 * the files (named exactly as listed in src/data/media-map.ts):
 *
 *   SOURCE_DIR=./media bun scripts/upload-media.ts
 *
 * The bucket `site-media` must already exist (01_schema.sql creates it).
 */
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { mediaFallback } from "../src/data/media-map";

const BUCKET = "site-media";
const url = process.env["SUPABASE_URL"];
const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
const sourceBase = process.env["SOURCE_BASE"]?.replace(/\/$/, "");
const sourceDir = process.env["SOURCE_DIR"]?.replace(/\/$/, "");

if (!url || !key) throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
if (!sourceBase && !sourceDir) throw new Error("Set SOURCE_BASE (a URL) or SOURCE_DIR (a folder)");

const supabase = createClient(url, key, { auth: { persistSession: false } });

const contentTypes: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  ttf: "font/ttf",
  woff2: "font/woff2",
};

let ok = 0;
let failed = 0;

for (const [filename, fallbackUrl] of Object.entries(mediaFallback)) {
  try {
    let body: Uint8Array;
    if (sourceDir) {
      const path = `${sourceDir}/${filename}`;
      if (!existsSync(path)) throw new Error(`missing local file ${path}`);
      body = new Uint8Array(readFileSync(path));
    } else {
      const res = await fetch(`${sourceBase}${fallbackUrl}`);
      if (!res.ok) throw new Error(`download failed (${res.status})`);
      body = new Uint8Array(await res.arrayBuffer());
    }

    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    const { error } = await supabase.storage.from(BUCKET).upload(filename, body, {
      contentType: contentTypes[ext] ?? "application/octet-stream",
      cacheControl: "31536000",
      upsert: true,
    });
    if (error) throw error;

    ok++;
    console.log(`uploaded ${filename}`);
  } catch (error) {
    failed++;
    console.error(`FAILED  ${filename}:`, error instanceof Error ? error.message : error);
  }
}

console.log(`\nDone. ${ok} uploaded, ${failed} failed.`);
console.log(
  `Public base URL for .env:\n  VITE_MEDIA_BASE_URL=${url.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}`,
);
