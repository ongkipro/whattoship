import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  outputFileTracingIncludes: {
    '/api/**/*': ['./data/what_to_ship.db'],
    '/**/*': ['./data/what_to_ship.db'],
  },
  async rewrites() {
    return [
      {
        source: '/sitemap-:id.xml',
        destination: '/api/sitemaps/:id',
      },
    ];
  },
};

export default nextConfig;
