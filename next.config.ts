import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';
import createNextIntlPlugin from 'next-intl/plugin';

const isProd = process.env.NODE_ENV === 'production';
const cacheComponentsFlag = process.env.NEXT_CACHE_COMPONENTS;
const enableCacheComponents = cacheComponentsFlag === 'true';
const revision = crypto.randomUUID();

const cacheLifeProfiles: NonNullable<NextConfig['cacheLife']> = {
  default: {
    stale: 60 * 5,
    revalidate: 60 * 15,
    expire: 60 * 60 * 24 * 30,
  },
  seconds: {
    stale: 30,
    revalidate: 1,
    expire: 60,
  },
  minutes: {
    stale: 60 * 5,
    revalidate: 60,
    expire: 60 * 60,
  },
  hours: {
    stale: 60 * 5,
    revalidate: 60 * 60,
    expire: 60 * 60 * 24,
  },
  days: {
    stale: 60 * 5,
    revalidate: 60 * 60 * 24,
    expire: 60 * 60 * 24 * 7,
  },
  weeks: {
    stale: 60 * 5,
    revalidate: 60 * 60 * 24 * 7,
    expire: 60 * 60 * 24 * 30,
  },
  max: {
    stale: 60 * 5,
    revalidate: 60 * 60 * 24 * 30,
    expire: 60 * 60 * 24 * 365,
  },
  mutation: {
    expire: 0,
  },
};

const remoteImageHosts = (process.env.NEXT_IMAGE_HOSTS ?? 'assets.vercel.com,images.unsplash.com')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

const remoteImagePatterns: NonNullable<NextConfig['images']>['remotePatterns'] =
  remoteImageHosts.length > 0
    ? remoteImageHosts.map((hostname) => ({
        protocol: 'https',
        hostname,
        pathname: '/**',
      }))
    : [];

const withSerwist = withSerwistInit({
  cacheOnNavigation: isProd,
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  additionalPrecacheEntries: [{ url: '/~offline', revision }],
  disable: !isProd,
});

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  cacheComponents: enableCacheComponents,
  cacheLife: cacheLifeProfiles,
  // experimental features
  experimental: {
    // enable progressive page rendering (PPR) - requires canary version
    // ppr: 'incremental',
    // enable React compiler
    // reactCompiler: true,
    // enable LightningCSS
    // useLightningcss: true,  // can not work with postcss
    // enable view transition
    viewTransition: true,
    // enable CSS code splitting
    cssChunking: true,
    // optimize common package imports
    optimizePackageImports: [
      'react',
      'react-dom',
      'lucide-react',
      'next-intl',
      'zustand',
      'sonner',
      'tailwind-merge',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-slot',
      'class-variance-authority',
    ],
  },
  // configure image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: remoteImagePatterns,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
  // configure security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
};

export default withSerwist(withNextIntl(nextConfig));
