import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'x02.me' },
      { protocol: 'https', hostname: '*.x02.me' },
    ] as any,
  },
};

export default nextConfig;
