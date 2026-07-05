import type { NextConfig } from "next";
import { withEve } from "eve/next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/docs",
        destination: "/docs/index.html",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/docs/:path((?!assets|img|index.html).*)",
          destination: "/docs/:path/index.html",
        },
      ],
    };
  },
};

export default withEve(nextConfig);
