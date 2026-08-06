import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // tree-shake barrel imports so only used modules ship
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
