# Next.js AI Starter 项目技术文档

## 📋 项目概览

**Next.js AI Starter** 是一个现代化的 Web 开发模板，集成了 AI 功能、国际化支持、PWA 能力和前沿 UI 设计。专为追求高效开发和现代化体验的开发者设计。

### 🎯 项目特色

- 🚀 **生产就绪**: 基于最新技术栈，开箱即用
- 🎨 **液态玻璃设计**: iOS26 风格的现代化 UI 效果
- 🌍 **国际化支持**: 完整的多语言解决方案
- 🔧 **类型安全**: 100% TypeScript 支持
- ⚡ **性能优化**: 服务器组件、边缘运行时、智能缓存
- 📱 **PWA 支持**: 离线功能和原生应用体验
- ♻️ **缓存体系**: 基于 Next.js 16 Cache Components 与新版缓存 API（updateTag / revalidateTag profiles）

---

## 🛠 核心技术栈

### 前端框架

- **Next.js 16** - 最新的 React 全栈框架（App Router、Cache Components、Turbopack 默认开启、`proxy.ts` 路由）
- **React 19.2** - 支持 View Transitions、`useEffectEvent` 等新特性
- **TypeScript 5.9** - 满足 Next.js 16（≥5.1）的类型要求

### 样式和 UI

- **Tailwind CSS 4.1** - 原子化 CSS 框架
- **Shadcn UI** - 基于 Radix UI 的组件库
- **Radix UI** - 无样式、可访问的 UI 组件
- **Lucide React** - 现代化图标库
- **CVA (Class Variance Authority)** - 组件样式变体管理

### 状态管理和数据获取

- **SWR 2.3** - 数据获取和缓存
- **Zustand 5.0** - 轻量级状态管理
- **自定义 HTTP 客户端** - 基于 SWR 的类型安全 API 调用

### 国际化和主题

- **Next-intl 4.3** - 国际化解决方案
- **Next-themes 0.4** - 主题切换支持
- **支持语言**: 英语(en)、简体中文(zh-CN)

### PWA 和性能

- **Serwist 9.2** - 下一代 Service Worker 库
- **Cache Components + 新缓存 API** - 细粒度失效、`updateTag`/`revalidateTag(profile)`
- **Turbopack + optimizePackageImports** - Next.js 16 默认构建体验
- **Web Vitals 监控** - 性能指标收集
- **图像优化** - 支持 AVIF/WebP 格式

### 开发工具

- **ESLint + Prettier** - 代码质量和格式化
- **Husky + Lint-staged** - Git Hooks 和预提交检查
- **Commitlint** - 提交信息规范
- **Conventional Changelog** - 自动生成变更日志

---

## 📁 项目结构

```bash
nextjs-ai-starter/
├── app/                          # Next.js App Router
│   ├── [locale]/                # 国际化路由
│   │   ├── layout.tsx           # 全局布局
│   │   ├── page.tsx             # 首页
│   │   └── ~offline/            # PWA 离线页面
│   ├── api/                     # API 路由
│   ├── manifest.ts              # PWA 清单
│   ├── robots.ts                # SEO robots.txt
│   └── sw.ts                    # Service Worker
├── components/                   # React 组件
│   ├── ui/                      # Shadcn UI 组件
│   ├── layout/                  # 布局组件
│   │   ├── header.tsx           # 导航头部
│   │   ├── footer.tsx           # 页脚
│   │   └── pageLayout.tsx       # 页面布局
│   ├── provider/                # Context 提供者
│   ├── langSelect/              # 语言切换
│   ├── metrics/                 # 性能监控
│   └── themeToggle.tsx          # 主题切换
├── lib/                         # 工具库
│   ├── http/                    # HTTP 客户端
│   ├── i18n/                    # 国际化配置
│   └── utils.ts                 # 通用工具
├── locales/                     # 语言文件
│   ├── en.json                  # 英文
│   └── zh-CN.json               # 中文
├── styles/                      # 样式文件
│   └── globals.css              # 全局样式（含液态玻璃效果）
├── public/                      # 静态资源
└── 配置文件                      # 各种配置文件
```

---

## ✨ 核心特性详解

### 1. 🎨 液态玻璃 UI 设计

- **iOS26 风格效果**: 模糊背景、渐变边框、动态光效
- **响应式交互**: 悬停、点击、滚动状态变化
- **无障碍支持**: 完整的键盘导航和屏幕阅读器支持

```css
/* 核心液态玻璃类 */
.liquid-glass-header
.liquid-glass-button
.liquid-glass-card
.liquid-glass-dropdown
```

### 2. 🌍 国际化系统

- **服务端渲染**: SEO 友好的多语言支持
- **动态语言切换**: 无页面刷新的语言切换
- **类型安全**: TypeScript 支持的翻译键检查

```tsx
import { getTranslations } from 'next-intl/server';

export default async function Example() {
  const t = await getTranslations('homePage');
  return <h1>{t('title')}</h1>;
}
```

### 3. 📱 PWA 功能

- **离线支持**: 使用 Serwist 实现的离线功能
- **缓存策略**: 智能的资源缓存和更新
- **安装提示**: 原生应用安装体验

### 4. 🔄 HTTP 客户端

- **SWR 集成**: 自动缓存、重新验证、错误重试
- **类型安全**: 完整的 TypeScript 支持
- **服务端支持**: SSR 和 Server Actions 兼容

```tsx
// 客户端使用
const { data, error, isLoading } = useQuery<User[]>('/api/users');

// 服务端使用
const users = await createCachedQuery(() => api.get('/users'), {
  key: ['users'],
  revalidate: 3600,
});
```

### 5. 🎨 主题系统

- **多主题支持**: 明亮、暗黑、系统主题
- **无闪烁切换**: 预防主题切换时的闪烁
- **本地存储**: 主题偏好持久化

### 6. 📊 性能监控

- **Web Vitals**: LCP、FID、CLS 等核心指标
- **自动上报**: 性能数据自动收集
- **分析端点**: `/api/metrics` 数据接收

---

## 🚀 快速开始

### 1. 环境要求

- Node.js 20.9+（Next.js 16 官方最低版本，建议使用 LTS 20/22）
- Git

### 2. 安装和启动

```bash
# 克隆项目
git clone https://github.com/vadxq/nextjs-ai-starter.git
cd nextjs-ai-starter

# 安装依赖
npm run install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

### 3. 开发脚本

```bash
# 代码检查和格式化
npm run lint              # 运行 ESLint + Prettier
npm run lint:lint-staged  # 仅检查暂存文件
npm run lint:pretty       # 快速格式化

# 生成变更日志
npm run log               # 基于 Git 提交生成 CHANGELOG
```

---

## 🔧 开发指南

### 1. 添加新语言

1. 在 `lib/i18n/routing.ts` 中添加语言代码：

```typescript
export const routing = defineRouting({
  locales: ['en', 'zh-CN', 'ja'], // 添加 'ja'
  defaultLocale: 'en',
});
```

2. 创建语言文件 `locales/ja.json`
3. 在 `proxy.ts`（Next.js 16 新命名）中更新路由匹配规则
4. 在 `app/[locale]/layout.tsx` 的 `generateStaticParams` 中加入新的语言代码，保证静态预渲染与缓存策略一致

### 2. 创建新组件

使用 Shadcn UI 添加组件：

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
```

### 3. 添加液态玻璃效果

在 `styles/globals.css` 中使用预定义类：

```tsx
<div className="liquid-glass-card">
  <button className="liquid-glass-button">按钮</button>
</div>
```

### 4. API 路由开发

```typescript
// app/api/example/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello API' });
}
```

### 5. 环境变量

创建 `.env.local` 文件：

```env
# API 配置
NEXT_PUBLIC_API_URL=https://api.example.com

# 数据库配置
DATABASE_URL=postgresql://...

# AI 服务配置
OPENAI_API_KEY=sk-...

# Next.js 渲染优化
NEXT_CACHE_COMPONENTS=true
# 允许的远程图片域名，逗号分隔
NEXT_IMAGE_HOSTS=assets.vercel.com,images.unsplash.com
```

---

## 📋 TODO 清单

### 🎯 高优先级

- [ ] **AI 功能集成**
  - [ ] OpenAI API 集成
  - [ ] 聊天机器人组件
  - [ ] AI 文本生成功能
  - [ ] 智能代码补全

- [ ] **数据库集成**
  - [ ] Prisma ORM 配置
  - [ ] 数据库 Schema 设计
  - [ ] 用户认证系统
  - [ ] 数据迁移脚本

- [ ] **认证系统**
  - [ ] NextAuth.js 集成
  - [ ] OAuth 登录 (Google, GitHub)
  - [ ] JWT Token 管理
  - [ ] 用户权限系统

### 🛠 中优先级

- [ ] **组件库扩展**
  - [ ] 表单验证组件
  - [ ] 数据表格组件
  - [ ] 图表组件集成
  - [ ] 文件上传组件

- [ ] **开发体验**
  - [ ] Storybook 集成
  - [ ] 组件测试 (Jest + Testing Library)
  - [ ] E2E 测试 (Playwright)
  - [ ] 代码覆盖率报告

- [ ] **部署优化**
  - [ ] Docker 配置
  - [ ] CI/CD Pipeline (GitHub Actions)
  - [ ] 自动化部署脚本
  - [ ] 性能监控 Dashboard

### 🔍 低优先级

- [ ] **功能增强**
  - [ ] 搜索功能
  - [ ] 通知系统
  - [ ] 实时消息 (WebSocket)
  - [ ] 文档站点 (Nextra)

- [ ] **多语言扩展**
  - [ ] 日语支持
  - [ ] 韩语支持
  - [ ] 阿拉伯语支持
  - [ ] RTL 布局支持

---

## 🔧 自定义配置

### 修改主题颜色

在 `styles/globals.css` 中修改 CSS 变量：

```css
:root {
  --primary: oklch(0.21 0.006 285.885); /* 主色调 */
  --secondary: oklch(0.967 0.001 286.375); /* 次要色调 */
  --accent: oklch(0.967 0.001 286.375); /* 强调色 */
}
```

### 修改 Tailwind 配置

在 `tailwind.config.ts` 中自定义：

```typescript
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
};
```

### PWA 配置

在 `app/manifest.ts` 中修改 PWA 设置：

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '您的应用名称',
    short_name: '短名称',
    description: '应用描述',
    // ... 其他配置
  };
}
```

---

## 📈 性能优化建议

### 1. 图像优化

- 使用 Next.js Image 组件
- 启用 AVIF/WebP 格式
- 配置适当的图像尺寸

### 2. 代码分割

- 使用动态导入
- 按路由分割代码
- 懒加载非关键组件

### 3. 缓存策略

- API 响应缓存
- 静态资源缓存
- Service Worker 缓存

### 4. 性能监控

- Web Vitals 追踪
- 用户体验指标
- 错误监控集成

---

## 🤝 贡献指南

### 1. 提交规范

使用 Conventional Commits 格式：

```bash
feat: 添加新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建过程或辅助工具的变动
```

### 2. 分支策略

- `main`: 生产分支
- `develop`: 开发分支
- `feature/*`: 功能分支
- `hotfix/*`: 热修复分支

### 3. Pull Request 流程

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 创建 Pull Request
5. 代码审查
6. 合并代码

---

## 📚 相关资源

### 官方文档

- [Next.js 16 文档](https://nextjs.org/docs)
- [React 19.2 文档](https://react.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Shadcn UI 文档](https://ui.shadcn.com)

### 社区资源

- [GitHub Repository](https://github.com/vadxq/nextjs-ai-starter)
- [讨论区](https://github.com/vadxq/nextjs-ai-starter/discussions)
- [问题反馈](https://github.com/vadxq/nextjs-ai-starter/issues)

---

## 📄 许可证

本项目基于 [ApacheV2 许可证](https://github.com/vadxq/nextjs-ai-starter/blob/main/LICENSE) 开源。

---

## 💬 联系方式

- **GitHub**: [@vadxq](https://github.com/vadxq)

---

**祝您开发愉快！🚀**
