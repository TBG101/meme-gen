import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: false,
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/mimi-images/images/**",
      },
      {
        protocol: "https",
        hostname: "supinfo-demo.s3.eu-north-1.amazonaws.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
