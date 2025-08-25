// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // wildcard: allow all https hosts
      },
      {
        protocol: "http",
        hostname: "**", // allow all http hosts too (optional)
      },
    ],
  },
};

module.exports = nextConfig;