import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@sinlungtech/chat-widget'],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
