import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @asclepius/ui ships TypeScript source; Next compiles it with the app.
  transpilePackages: ["@asclepius/ui"],
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    // @asclepius/ui is a sibling folder linked into node_modules; Turbopack
    // only reads files under its root, so the root is the workspace.
    root: path.join(__dirname, ".."),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
