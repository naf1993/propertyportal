import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    // Add any other environment variables here
  },
  // Add any other Next.js configuration options here
};

export default nextConfig;
