import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/edc", destination: "/edc/", permanent: true },
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
