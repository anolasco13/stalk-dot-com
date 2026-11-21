import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Where Letterboxd posters and Pinterest pins are served from.
    remotePatterns: [
      { protocol: "https", hostname: "a.ltrbxd.com" },
      { protocol: "https", hostname: "i.pinimg.com" },
    ],
  },
};

export default nextConfig;
