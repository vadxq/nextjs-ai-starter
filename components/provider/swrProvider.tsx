// components/provider/swrProvider.tsx
'use client';

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';
import { fetchAPI } from '~/lib/http/fetch';

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        // Global SWR configuration
        fetcher: fetchAPI,
        revalidateOnFocus: false,
        revalidateIfStale: true,
        revalidateOnReconnect: true,
        errorRetryCount: 3,
        dedupingInterval: 5000,
        focusThrottleInterval: 5000,
        errorRetryInterval: 5000,
        suspense: false, // Set to true to enable Suspense mode
        onError: (error, key) => {
          console.error(`SWR request error: ${key}`, error);
          // Global error handling is implemented inside each hook
          // Toaster.error(`SWR request error: ${key}`, error.message);
        },
      }}>
      {children}
    </SWRConfig>
  );
}
