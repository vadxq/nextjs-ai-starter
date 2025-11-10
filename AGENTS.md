# Repository Guidelines

## Project Structure & Module Organization

`app/` hosts the App Router; locale-specific pages live under `app/[locale]/` with the offline shell in `~offline`, while API handlers stay in `app/api` and the SW/manifest roots sit beside them. UI primitives reside in `components/` (`ui`, `layout`, `provider`, `metrics`), and shared logic belongs in `lib/` (HTTP, i18n, utilities). Copy lives in the paired `locales/en.json` and `locales/zh-CN.json`, global Tailwind layers live in `styles/globals.css`, and reusable assets go to `public/`.

## Build, Test & Development Commands

- `pnpm dev` – Next.js dev server with locale routing, PWA hooks, and hot reload.
- `pnpm build` – Production compile that also prepares `app/sw.ts` and `app/manifest.ts` artifacts.
- `pnpm start` – Serves the `.next` output for pre-release smoke tests.
- `pnpm lint` – Runs `lint-staged` plus `pretty-quick` (ESLint, Prettier, Tailwind class ordering) on staged files.
- `pnpm log` – Rebuilds `CHANGELOG.md` from the conventional commit history.

## Coding Style & Naming Conventions

TypeScript + React 19 are mandatory throughout `app`, `components`, and `lib`. Use PascalCase for component files, camelCase for helpers, and kebab-case for route folders. Favor Tailwind 4 utilities over custom CSS; only place handcrafted effects in `styles/globals.css`. Formatting is dictated by `prettier.config.js` with the Tailwind plugin—run `pnpm lint` (or `pnpm lint:pretty`) before committing. Keep translation keys descriptive and mirrored across both locale JSON files.

## Testing Guidelines

An automated runner is not bundled yet, so every change must: (1) pass `pnpm lint`, (2) be exercised manually in both locales via `pnpm dev`, and (3) ship screenshots or recordings for UI updates. If you introduce automated coverage, scaffold `next/jest` plus Testing Library under `__tests__/` adjacent to the feature and document the new script in `package.json`. Complex hooks or Zustand stores should include reproduction steps or targeted unit tests.

## Commit & Pull Request Guidelines

Commitlint enforces Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `test`, `build`, `ci`, `chore`, `revert`, etc.) with non-empty bodies and ≤108-character subjects. Keep commits focused so Husky hooks stay fast. Pull requests must summarize the change, call out affected routes/components, note locale or asset updates, list manual QA steps, link the relevant issue, and attach UI evidence when applicable. Rebase your feature branch onto `main` before requesting review and wait for at least one approval prior to merge.

## 回复

- 使用中文交流和回复
- 文档使用中文 markdown 格式
