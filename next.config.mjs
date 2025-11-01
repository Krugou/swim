// Next.js configuration for static export and GitHub Pages under /swim
import createNextIntlPlugin from 'next-intl/plugin';
// Use named-exports based i18n config at project root
const withNextIntl = createNextIntlPlugin('./i18n.ts');
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Serve under /swim on GitHub Pages; no basePath in dev for simpler local URLs
  basePath: isProd ? '/swim' : '',
  assetPrefix: isProd ? '/swim/' : undefined,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default withNextIntl(nextConfig);
