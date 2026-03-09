import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  experimental: {
    turbo: {
      resolveAlias: {},
    },
  },
};

export default nextConfig;
