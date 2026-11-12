import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    // Most visitors are Tigrigna speakers, so the site opens in Tigrigna.
    return [{ source: "/", destination: "/ti", permanent: false }];
  },
};

export default nextConfig;
