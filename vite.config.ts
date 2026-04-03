import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cpSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import path from "path";

function familiaPhotosPlugin(): Plugin {
  return {
    name: "familia-photos",
    closeBundle() {
      const src = path.resolve(__dirname, "Familia");
      const dest = path.resolve(__dirname, "dist", "familia");
      mkdirSync(dest, { recursive: true });

      const photos = readdirSync(src).filter((f) => /\.webp$/i.test(f));

      for (const f of photos) {
        cpSync(path.join(src, f), path.join(dest, f));
      }

      writeFileSync(
        path.resolve(__dirname, "dist", "photos.json"),
        JSON.stringify(photos),
      );

      console.log(`📸 Copied ${photos.length} photos → dist/familia/`);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), familiaPhotosPlugin()],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
