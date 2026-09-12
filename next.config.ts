import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deja estos paquetes fuera del bundle de Next.js: así el paso de
  // "code patches" de OpenNext (que sabe resolverlos para el runtime de
  // Cloudflare Workers) los procesa en vez del bundler normal de Next.
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
