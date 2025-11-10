# HTTP 客户端工具

这个模块提供了一套完整的HTTP客户端工具，用于在Next.js应用中进行数据获取和操作。它同时支持客户端组件和服务端组件，提供了统一的API接口和错误处理机制。

## 特性

- 🔄 基于SWR的数据获取和缓存
- 🛠 类型安全的API调用
- 🚨 统一的错误处理
- 🔍 自动错误提示（可选）
- 🧩 模块化设计，易于扩展
- ⚡️ 支持服务端组件和Server Actions
- 📦 支持数据缓存和重新验证

## 使用方法

### 1. 客户端组件

#### 基础用法

```tsx
import { useQuery, useMutation } from '~/lib/http';

function UserList() {
  // 获取数据
  const {
    data: users,
    error,
    isLoading,
  } = useQuery<User[]>('/api/users', {
    showErrorToast: true,
  });

  // 提交数据
  const { trigger, isMutating } = useMutation<User, Partial<User>>('/api/users', {
    showErrorToast: true,
  });

  const handleSubmit = (userData: Partial<User>) => {
    trigger({
      method: 'POST',
      body: userData,
    });
  };

  // 渲染UI
}
```

#### 推荐用法：API客户端

```tsx
import { createApiClient } from '~/lib/http';

// 创建API客户端
const api = createApiClient();

// 创建特定资源的API
const usersApi = api.createResourceApi<User, Partial<User>>('/users');

function UserComponent() {
  // 获取用户列表
  const { data: users } = usersApi.useApiQuery();

  // 获取特定用户
  const { data: user } = usersApi.useApiQuery('/123');

  // 创建用户
  const { trigger: createUser } = usersApi.useApiMutation('/create');

  // 提交表单
  const handleSubmit = (userData: Partial<User>) => {
    createUser({ body: userData });
  };
}
```

### 2. 服务端组件和Server Actions

```tsx
import { createServerApi, createCachedQuery, invalidateData } from '~/lib/http/server';

// 创建服务端API客户端
const serverApi = createServerApi();
const usersApi = serverApi.createResourceApi<User>('/users');

// 创建缓存查询
const getUsersQuery = createCachedQuery(() => usersApi.get(), {
  key: ['users-list'],
  tags: ['users'],
  revalidate: 3600, // 1小时缓存
});

// 在服务器组件中使用
export async function UsersServerComponent() {
  // 获取用户列表（带缓存）
  const users = await getUsersQuery();

  // 渲染UI
}

// 在Server Action中使用
export async function createUser(formData: FormData) {
  'use server';

  try {
    // 创建用户
    await usersApi.post('/create', {
      name: formData.get('name'),
      email: formData.get('email'),
    });

    // 重新验证数据
    invalidateData('users');

    return { success: true };
  } catch (error) {
    return { error: '创建用户失败' };
  }
}
```

## API参考

### 客户端API

- `useQuery<T>(url, options)` - 获取数据
- `useMutation<T, D>(url, options)` - 提交数据
- `createApiHook<R, D>(baseUrl)` - 创建API Hook
- `createApiClient(baseUrl)` - 创建API客户端

### 服务端API

- `fetchAPI<T>(url, options)` - 获取或提交数据
- `createCachedQuery<T>(queryFn, options)` - 创建缓存查询
- `invalidateData(tagOrPath, options?)` - 重新验证标签或路径缓存。`options` 接受 `{ isPath?: boolean; profile?: string | { expire?: number } }`，默认使用在 `next.config.ts` 中配置的 `'mutation'` 缓存策略，仍兼容旧的布尔写法。
- `createServerApi(baseUrl)` - 创建服务端API客户端

## 错误处理

所有API调用都会返回统一的`ApiError`类型的错误，包含状态码和错误信息。可以通过`showErrorToast`选项自动显示错误提示。

```tsx
try {
  const data = await api.get('/users');
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`错误 ${error.status}: ${error.message}`);
  }
}
```

## 设计理念

- **统一接口**：客户端和服务端使用相似的API接口，减少学习成本
- **类型安全**：完整的TypeScript类型支持，提供代码补全和类型检查
- **关注点分离**：数据获取逻辑与UI逻辑分离
- **易于扩展**：模块化设计，可以根据需要扩展功能
- **错误处理**：统一的错误处理机制，提高用户体验

## 最佳实践

1. 使用`createApiClient`和`createServerApi`创建API客户端，而不是直接使用基础hooks
2. 为每个资源类型创建专用的API客户端
3. 利用TypeScript类型系统确保类型安全
4. 在服务端组件中使用`createCachedQuery`提高性能
5. 使用带有 `profile` / `isPath` 选项的 `invalidateData` 在数据变更后重新验证缓存，并复用全局 `cacheLife` 策略
