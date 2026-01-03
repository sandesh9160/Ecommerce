import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '3n70dpsk-8000.inc1.devtunnels.ms',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
