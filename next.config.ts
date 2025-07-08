import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ allows build despite ESLint issues
  },
};

export default nextConfig;
