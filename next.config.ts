import { withEve } from "eve/next"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Avoid advertising the framework in responses.
  poweredByHeader: false,

  // Browser source maps for production debugging (Sentry / DevTools).
  productionBrowserSourceMaps: true,

  // Modularize barrel imports. lucide-react / recharts / effect are already
  // optimized by Next defaults; these are the heavy ones we actually use.
  experimental: {
    optimizePackageImports: [
      "radix-ui",
      "@clerk/nextjs",
      "@clerk/ui",
      "motion",
      "lucide-react",
      "@tiptap/react",
      "@tiptap/starter-kit",
      "recharts",
      "sonner",
      "cmdk",
      "next-themes",
      "@embedpdf/react-pdf-viewer",
    ],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "images.clerk.dev" },
    ],
  },

  async headers() {
    return [
      {
        // Hashed Docusaurus assets under /docs — long-lived cache.
        source: "/docs/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },

  async redirects() {
    return [
      {
        source: "/docs",
        destination: "/docs/index.html",
        permanent: false,
      },
    ]
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          // SPA routes only — skip static files (e.g. search-index.json, sitemap.xml)
          source: "/docs/:path((?!assets|img|index.html)(?!.*\\..*).*)",
          destination: "/docs/:path/index.html",
        },
      ],
    }
  },
}

export default withEve(nextConfig)
