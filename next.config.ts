import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Next.js's default behavior of auto-stripping trailing slashes
  // (e.g. /edc/ → /edc). Without this, our explicit /edc → /edc/ redirect
  // below would create an infinite redirect loop.
  skipTrailingSlashRedirect: true,

  async redirects() {
    return [
      {
        source: "/edc",
        destination: "/edc/",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/edc",
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
