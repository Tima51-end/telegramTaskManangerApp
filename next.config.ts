import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "*.telegram.org",
      },
      {
        protocol: "https",
        hostname: "*.telegram-desktop.com", 
      },
      {
        protocol: "https",
        hostname: "t.me",
      },
    ],
  },
};

export default nextConfig;
