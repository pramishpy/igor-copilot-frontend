import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker production builds.
  // This creates a self-contained build at .next/standalone.
  output: "standalone",
};

export default nextConfig;
