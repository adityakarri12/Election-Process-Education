import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopack: {
      resolveExternalDependencies: true,
    },
  },
};

export default nextConfig;
