import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 rejects any `quality` not listed here. The logo is fine script
    // lettering on a transparent ground, which 75 visibly softens.
    qualities: [75, 90],
  },
};

export default nextConfig;
