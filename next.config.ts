import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Next.js's default trailing-slash handling. The /edc → /edc/ redirect
  // is performed in src/middleware.ts with strict path equality so it cannot
  // self-match /edc/ and create a redirect loop.
  skipTrailingSlashRedirect: true,

  async rewrites() {
    return [
      {
        source: "/edc/",
        destination: "https://edc-vegas-2026.vercel.app/index.html",
      },
      {
        source: "/edc/:path*",
        destination: "https://edc-vegas-2026.vercel.app/:path*",
      },
    ];
  },
};

export default nextConfig;
