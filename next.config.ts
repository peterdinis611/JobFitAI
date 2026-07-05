import type { NextConfig } from "next";
import { withEve } from "eve/next";

const nextConfig: NextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];
    return [
      {
        source: "/docs",
        destination: "http://localhost:3001/docs",
      },
      {
        source: "/docs/:path*",
        destination: "http://localhost:3001/docs/:path*",
      },
    ];
  },
};

export default withEve(nextConfig);
