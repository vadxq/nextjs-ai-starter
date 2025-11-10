// lib/http/server.ts - server-side functions
import { revalidateTag, revalidatePath, unstable_cache } from 'next/cache';
import { fetchAPI, FetchOptions } from './fetch';

// cache query options
export interface CacheOptions {
  key: string[];
  tags?: string[];
  revalidate?: number | false;
}

type CacheProfile = string | { expire?: number };

interface InvalidateOptions {
  isPath?: boolean;
  profile?: CacheProfile;
}

const DEFAULT_CACHE_PROFILE: CacheProfile = 'mutation';

// cache utility function - create reusable cached data fetching function
export function createCachedQuery<T>(queryFn: () => Promise<T>, options: CacheOptions) {
  return unstable_cache(queryFn, options.key, {
    revalidate: options.revalidate,
    tags: options.tags,
  });
}

// revalidate data
export async function invalidateData(tagOrPath: string, options: InvalidateOptions | boolean = {}) {
  const normalizedOptions: InvalidateOptions = typeof options === 'boolean' ? { isPath: options } : options;

  const { isPath = false, profile = DEFAULT_CACHE_PROFILE } = normalizedOptions;

  if (isPath) {
    revalidatePath(tagOrPath);
  } else {
    revalidateTag(tagOrPath, profile);
  }
}

// create API resource client
export async function createServerApi(baseUrl: string = '/api') {
  async function createResourceApi<T = unknown>(resourcePath: string) {
    const resourceUrl = `${baseUrl}${resourcePath}`;

    return {
      // GET method
      get: async <R = T>(endpoint?: string, options: Omit<FetchOptions, 'method' | 'body'> = {}) => {
        const url = endpoint ? `${resourceUrl}${endpoint}` : resourceUrl;
        return fetchAPI<R>(url, {
          ...options,
          method: 'GET',
        });
      },

      // POST method
      post: async <R = T, D = unknown>(endpoint: string, data?: D, options: Omit<FetchOptions, 'method'> = {}) => {
        const url = `${resourceUrl}${endpoint}`;
        return fetchAPI<R>(url, {
          ...options,
          method: 'POST',
          body: data,
        });
      },

      // PUT method
      put: async <R = T, D = unknown>(endpoint: string, data?: D, options: Omit<FetchOptions, 'method'> = {}) => {
        const url = `${resourceUrl}${endpoint}`;
        return fetchAPI<R>(url, {
          ...options,
          method: 'PUT',
          body: data,
        });
      },

      // DELETE method
      remove: async <R = T>(endpoint: string, options: Omit<FetchOptions, 'method'> = {}) => {
        const url = `${resourceUrl}${endpoint}`;
        return fetchAPI<R>(url, {
          ...options,
          method: 'DELETE',
        });
      },

      // PATCH method
      patch: async <R = T, D = unknown>(endpoint: string, data?: D, options: Omit<FetchOptions, 'method'> = {}) => {
        const url = `${resourceUrl}${endpoint}`;
        return fetchAPI<R>(url, {
          ...options,
          method: 'PATCH',
          body: data,
        });
      },
    };
  }

  return { createResourceApi };
}
