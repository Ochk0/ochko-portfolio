import { execSync } from "node:child_process"

let commit = "deadbee"
try {
  commit = execSync("git rev-parse --short HEAD").toString().trim()
} catch {
  // not a git checkout (e.g. some CI) — keep the placeholder
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_COMMIT: commit,
    NEXT_PUBLIC_BUILD_DATE: new Date().toISOString().slice(0, 10),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            // flag part 2/3 — robots.txt points here
            key: "X-Flag-Part",
            value: "DAT_NEVER (2/3 - first is in the source, last is on the missing page)",
          },
        ],
      },
    ]
  },
}

export default nextConfig
