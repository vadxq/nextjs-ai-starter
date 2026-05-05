'use client';

import { SerwistProvider } from '@serwist/turbopack/react';
import type { ReactNode } from 'react';

export function PWAProvider({ children }: { children: ReactNode }) {
  return (
    <SerwistProvider
      swUrl="/serwist/sw.js"
      disable={process.env.NODE_ENV !== 'production'}
      cacheOnNavigation={process.env.NODE_ENV === 'production'}
      reloadOnOnline
      register
      options={{ scope: '/' }}>
      {children}
    </SerwistProvider>
  );
}
