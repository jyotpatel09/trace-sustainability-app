import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/demo",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/batches",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/reports",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
