import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://195.35.36.122:1991/api/:path*",
      },
    ];
  },
};

export default nextConfig;
