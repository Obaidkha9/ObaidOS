import type { NextConfig } from "next";

// Sub-path the site is served from (e.g. "/ObaidOS" on GitHub Pages project
// pages). Set via NEXT_PUBLIC_BASE_PATH at build time; empty for local dev and
// root-domain deploys. Kept in sync with the `asset()` helper in lib/asset.ts.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Emit a fully static site into `out/` so it can be hosted on GitHub Pages.
  output: "export",
  basePath,
  // GitHub Pages serves each route as a directory index, so emit trailing-slash
  // folders (`/about/` -> `/about/index.html`).
  trailingSlash: true,
  // The default Image Optimization loader needs a server; disable it for export.
  images: { unoptimized: true },
  devIndicators: false,
  // tree-shake barrel imports so only used modules ship
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
