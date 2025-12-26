import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // For better compatibility with static exports if needed
  },
  // PWA configuration will be handled via service worker
};

export default nextConfig;
