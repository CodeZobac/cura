import { serve } from "bun";
import { readdir } from "fs/promises";
import path from "path";
import index from "./index.html";

const FAMILIA_DIR = path.resolve(import.meta.dir, "../Familia");

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

const server = serve({
  routes: {
    "/*": index,

    "/api/photos": {
      async GET() {
        const files = await readdir(FAMILIA_DIR);
        const photos = files.filter(f => {
          const ext = path.extname(f).toLowerCase();
          return ext === ".jpg" || ext === ".jpeg";
        });
        return Response.json(photos);
      },
    },

    "/familia/*": async req => {
      const url = new URL(req.url);
      const filename = decodeURIComponent(url.pathname.replace("/familia/", ""));

      // Prevent path traversal
      if (filename.includes("..") || filename.includes("/")) {
        return new Response("Not found", { status: 404 });
      }

      const filePath = path.join(FAMILIA_DIR, filename);
      const file = Bun.file(filePath);

      if (!(await file.exists())) {
        return new Response("Not found", { status: 404 });
      }

      const ext = path.extname(filename).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";

      return new Response(file, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400",
        },
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
