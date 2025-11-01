import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '',
  images: {
    unoptimized: true,
  },
  // Disable i18n routing for static export
  trailingSlash: true,
};

export default withNextIntl(nextConfig);
