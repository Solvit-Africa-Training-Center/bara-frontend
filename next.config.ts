import type { NextConfig } from "next"

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://bara-backend-5g84.onrender.com"
).replace(/\/+$/, "")

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*/`,
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/signup',
        destination: '/register',
        permanent: true, // Returns a 308 permanent redirect
      },
    ];
  },
}

export default nextConfig
