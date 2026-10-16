import type { NextConfig } from "next"

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://shirt-shady-daisy.ngrok-free.dev"
).replace(/\/+$/, "")

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
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
