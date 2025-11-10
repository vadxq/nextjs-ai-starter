# HTTP Client Utilities

This module provides a comprehensive set of HTTP client utilities for data fetching and manipulation in Next.js applications. It supports both client components and server components, offering a unified API interface and error handling mechanism.

## Features

- 🔄 SWR-based data fetching and caching
- 🛠 Type-safe API calls
- 🚨 Unified error handling
- 🔍 Automatic error toasts (optional)
- 🧩 Modular design, easy to extend
- ⚡️ Support for Server Components and Server Actions
- 📦 Data caching and revalidation

## Usage

### 1. Client Components

#### Basic Usage

```tsx
import { useQuery, useMutation } from '~/lib/http';

function UserList() {
  // Fetch data
  const {
    data: users,
    error,
    isLoading,
  } = useQuery<User[]>('/api/users', {
    showErrorToast: true,
  });

  // Submit data
  const { trigger, isMutating } = useMutation<User, Partial<User>>('/api/users', {
    showErrorToast: true,
  });

  const handleSubmit = (userData: Partial<User>) => {
    trigger({
      method: 'POST',
      body: userData,
    });
  };

  // Render UI
}
```

#### Recommended: API Client

```tsx
import { createApiClient } from '~/lib/http';

// Create API client
const api = createApiClient();

// Create resource-specific API
const usersApi = api.createResourceApi<User, Partial<User>>('/users');

function UserComponent() {
  // Get user list
  const { data: users } = usersApi.useApiQuery();

  // Get specific user
  const { data: user } = usersApi.useApiQuery('/123');

  // Create user
  const { trigger: createUser } = usersApi.useApiMutation('/create');

  // Submit form
  const handleSubmit = (userData: Partial<User>) => {
    createUser({ body: userData });
  };
}
```

### 2. Server Components and Server Actions

```tsx
import { createServerApi, createCachedQuery, invalidateData } from '~/lib/http/server';

// Create server API client
const serverApi = createServerApi();
const usersApi = serverApi.createResourceApi<User>('/users');

// Create cached query
const getUsersQuery = createCachedQuery(() => usersApi.get(), {
  key: ['users-list'],
  tags: ['users'],
  revalidate: 3600, // 1 hour cache
});

// In server component
export async function UsersServerComponent() {
  // Get user list (with cache)
  const users = await getUsersQuery();

  // Render UI
}

// In Server Action
export async function createUser(formData: FormData) {
  'use server';

  try {
    // Create user
    await usersApi.post('/create', {
      name: formData.get('name'),
      email: formData.get('email'),
    });

    // Revalidate data
    invalidateData('users');

    return { success: true };
  } catch (error) {
    return { error: 'Failed to create user' };
  }
}
```

## API Reference

### Client API

- `useQuery<T>(url, options)` - Fetch data
- `useMutation<T, D>(url, options)` - Submit data
- `createApiHook<R, D>(baseUrl)` - Create API Hook
- `createApiClient(baseUrl)` - Create API client

### Server API

- `fetchAPI<T>(url, options)` - Fetch or submit data
- `createCachedQuery<T>(queryFn, options)` - Create cached query
- `invalidateData(tagOrPath, options?)` - Revalidate cache tags or paths. `options` accepts `{ isPath?: boolean; profile?: string | { expire?: number } }` with a default tag profile of `'mutation'` (configured in `next.config.ts`). A deprecated boolean is still supported for backwards compatibility.
- `createServerApi(baseUrl)` - Create server API client

## Error Handling

All API calls return a unified `ApiError` type with status code and error message. You can use the `showErrorToast` option to automatically display error toasts.

```tsx
try {
  const data = await api.get('/users');
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Error ${error.status}: ${error.message}`);
  }
}
```

## Design Philosophy

- **Unified Interface**: Similar API interfaces for client and server, reducing learning curve
- **Type Safety**: Complete TypeScript type support for code completion and type checking
- **Separation of Concerns**: Data fetching logic separated from UI logic
- **Extensibility**: Modular design that can be extended as needed
- **Error Handling**: Unified error handling mechanism for better user experience

## Best Practices

1. Use `createApiClient` and `createServerApi` to create API clients instead of using base hooks directly
2. Create dedicated API clients for each resource type
3. Leverage TypeScript's type system to ensure type safety
4. Use `createCachedQuery` in server components to improve performance
5. Use `invalidateData` (with optional `profile` / `isPath`) to revalidate cache after data changes, leveraging the shared `cacheLife` profiles
