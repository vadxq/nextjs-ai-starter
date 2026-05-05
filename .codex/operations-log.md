# Operations Log

## 2026-05-06

- 时间：会话内
  工具：`rg` / `sed`
  参数摘要：扫描 `serwist`、`turbopack`、`PWA`、`sw.ts`、`manifest.ts`
  输出摘要：确认 `@serwist/turbopack` 的接入点位于 `next.config.ts`、`app/serwist/[path]/route.ts`、`components/provider/pwaProvider.tsx` 与 `app/[locale]/layout.tsx`

- 时间：会话内
  工具：`./node_modules/.bin/tsc --noEmit`
  参数摘要：执行全量类型检查
  输出摘要：发现 `app/serwist/[path]/route.ts` 存在 `cacheOnNavigation` 非法字段；同时 `lucide-react` 1.x 移除了 `Github/Twitter/Linkedin`

- 时间：会话内
  工具：`sed` / 本地包源码阅读
  参数摘要：阅读 `node_modules/@serwist/turbopack/src/index.ts`
  输出摘要：确认 `withSerwist` 仅扩展 `serverExternalPackages`；`createSerwistRoute` 负责 SW 路由构建；route 输出要求 deterministic

- 时间：会话内
  工具：`apply_patch`
  参数摘要：修复 `app/serwist/[path]/route.ts` 非确定性输入与非法字段；同步修复 `lucide-react` 图标命名升级问题
  输出摘要：PWA 路由配置收敛为 `swSrc/swDest/additionalPrecacheEntries`；社交图标改为当前版本可用图标

- 时间：会话内
  工具：`./node_modules/.bin/next build --webpack`
  参数摘要：绕过 Turbopack 做对照构建验证
  输出摘要：构建不再命中 `serwist` 类型错误，继续执行到外部网络访问阶段；随后因沙箱无法连接 `127.0.0.1:7897` 失败，说明当前剩余阻塞不在 `serwist` 路由配置本身

- 时间：会话内
  工具：`apply_patch` / `./node_modules/.bin/tsc --noEmit`
  参数摘要：将 `app/[locale]/layout.tsx` 中的原生 `<script>` 替换为 `next/script` 的 `beforeInteractive` 注入
  输出摘要：消除 React 对组件内 `script` 标签的告警，同时保留主题防闪烁初始化逻辑；类型检查通过
