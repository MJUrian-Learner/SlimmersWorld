import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Ensure the workspace root is the Next.js app directory
    root: __dirname,
  },
};

export default nextConfig;
