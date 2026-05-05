import { createSerwistRoute } from '@serwist/turbopack';

const OFFLINE_REVISION = 'offline-shell-v1';

export const { GET, dynamic, dynamicParams, revalidate, generateStaticParams } = createSerwistRoute({
  swSrc: 'app/sw.ts',
  additionalPrecacheEntries: [{ url: '/en/~offline', revision: OFFLINE_REVISION }],
});
