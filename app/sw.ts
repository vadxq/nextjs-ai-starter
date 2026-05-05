import { defaultCache } from '@serwist/turbopack/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Change this attribute's name to your `injectionPoint`.
    // `injectionPoint` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    ...defaultCache,
    // {
    //   urlPattern: /^https:\/\/api\.yourdomain\.com\/.*$/i,
    //   handler: 'NetworkFirst' as RouteHandler<"network">,
    //   options: {
    //     cacheName: 'api-cache',
    //     expiration: {
    //       maxEntries: 50,
    //       maxAgeSeconds: 60 * 60 * 24 // 24小时
    //     }
    //   }
    // },
    // {
    //   // cache images
    //   urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
    //   handler: 'CacheFirst',
    //   options: {
    //     cacheName: 'images-cache',
    //     expiration: {
    //       maxEntries: 200,
    //       maxAgeSeconds: 60 * 60 * 24 * 30, // 30天
    //     },
    //   },
    // },
    // {
    //   // cache font resources
    //   urlPattern: /\.(?:woff|woff2|ttf|otf|eot)$/i,
    //   handler: 'CacheFirst',
    //   options: {
    //     cacheName: 'fonts-cache',
    //     expiration: {
    //       maxEntries: 50,
    //       maxAgeSeconds: 60 * 60 * 24 * 365, // 1年
    //     },
    //   },
    // }
  ],
  fallbacks: {
    entries: [
      {
        url: '/en/~offline',
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

// // add specific network listener
// self.addEventListener('fetch', (event) => {
//   // 特定处理逻辑...
// });

// // add PUSH notification support
// self.addEventListener('push', (event) => {
//   const data = event.data?.json() ?? {};
//   const title = data.title || 'Default Title';
//   const options = {
//     body: data.body || 'You have a new notification',
//     icon: '/icons/push-notification.png',
//     badge: '/icons/badge.png',
//     data
//   };

//   event.waitUntil(
//     self.registration.showNotification(title, options)
//   );
// });

// // notification click handler
// self.addEventListener('notificationclick', (event) => {
//   event.notification.close();

//   event.waitUntil(
//     clients.openWindow(event.notification.data.url || '/')
//   );
// });

serwist.addEventListeners();
