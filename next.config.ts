
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Let LAN clients fetch image URLs directly instead of using the server-side
    // optimizer, which cannot reliably proxy remote images during development.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
    ],
  },

  experimental: {
    agentFeedback: true,
  },

  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
