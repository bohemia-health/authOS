import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @asclepius/ui ships TypeScript source; Next compiles it with the app.
  transpilePackages: ["@asclepius/ui"],
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    // Locally @asclepius/ui may be a symlink to the sibling folder, which
    // Turbopack can only read if its root is the workspace. On Vercel the
    // package is a real copy inside node_modules; keep the default root there.
    ...(process.env.VERCEL ? {} : { root: path.join(__dirname, "..") }),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
