# Review Report

## 任务

排查升级 `serwist` 后 `Next.js 16.2.4` 在 Turbopack 下卡在 `Compiling /[locale] ...` 并触发 panic 的问题。

## 评分

- 技术质量：88/100
- 需求匹配：90/100
- 综合结论：审阅后通过

## 关键发现

1. `app/serwist/[path]/route.ts` 将 `cacheOnNavigation`、`disable`、`swDest` 一类旧认知混入 `createSerwistRoute(...)`，其中至少前两项已被 TypeScript 明确判定为非法字段。
2. 顶层 `crypto.randomUUID()` 使 precache `revision` 非确定化，结合 Turbopack 的文件追踪与缓存机制，存在持续失效和重编译风险。
3. 这次升级同时引入 `lucide-react` 1.x，旧的 `Github/Twitter/Linkedin` 导出已不存在，直接阻塞构建验证。
4. 本地对照验证显示：
   - `tsc --noEmit` 已通过。
   - `next build --webpack` 能进入正式构建阶段，随后因沙箱网络限制访问 `127.0.0.1:7897` 失败。
   - `next build` 仍可能卡在 Turbopack 的 compile 阶段，符合 Next.js 社区已有的 Turbopack 卡编译现象。

## 风险与边界

- 由于当前会话无法正常监听开发端口，也无法完整访问你本机代理环境，无法在此处完全复现你 IDE 内的 panic 结束态。
- `app/sw.ts` 目前只对 `/en/~offline` 做 fallback，如果你预期 `zh-CN` 也有独立离线页，后续仍需补齐。

## 建议

1. 先用当前补丁在你本机重新启动 `next dev` 观察 panic 是否消失。
2. 若 Turbopack 仍卡住，优先以 `next dev --webpack` / `next build --webpack` 作为临时规避方案。
3. 若必须继续使用 Turbopack，再做一次最小回退验证：只回退 `next` 到升级前可工作的版本，保留 `serwist` 改造，判断问题是否属于 Next.js Turbopack 回归。
