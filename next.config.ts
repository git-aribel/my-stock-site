import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Lets you open the dev server from your phone on the same Wi-Fi
  // (e.g. http://192.168.1.244:3000). Only affects `npm run dev`.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  async redirects() {
    return [
      // The content agent used to live at /tools/assistant
      { source: "/tools/assistant", destination: "/tools/ary", permanent: true },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
