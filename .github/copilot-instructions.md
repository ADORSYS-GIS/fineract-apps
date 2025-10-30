<!--
  Short, actionable guidance for AI coding agents working in this monorepo.
  Keep suggestions concrete and reference files that show the patterns.
-->
# Copilot instructions — fineract-apps

Purpose: give an AI coding assistant the minimum, high-value context so it can be productive quickly in this monorepo.

- Monorepo layout (high level)
  - Root contains workspace orchestration: `package.json`, `pnpm-workspace.yaml`, root `README.md`.
  - Frontend apps live under `frontend/` (each app like `account-manager-app`, `branchmanager-app`, `cashier-app`).
  - Shared UI and utilities live under `packages/` (notably `packages/ui`, `packages/i18n`, `packages/fineract-api`, `packages/config`).

- Key files to read first
  - `README.md` (root) — project goals, Biome and basic scripts.
  - `package.json` (root) — workspace scripts (dev, build, lint, codegen hooks).
  - `pnpm-workspace.yaml` — workspace scope and linking behavior.
  - `packages/ui/package.json` — how the UI library is built and exported (note `./styles.css` export).
  - `packages/fineract-api/` — codegen configuration; `postinstall` triggers `pnpm codegen` at root.
  - `docs/` — design and workflow guides (internationalization, testing, layout/routing, component docs).

- Important workflows / commands
  - Install & link local packages: `pnpm install` (uses workspace protocol `workspace:*`).
  - Dev all frontends in parallel: `pnpm dev` (root script runs `pnpm --parallel --filter "./frontend/*" dev`).
  - Build (root): `pnpm build` — builds `packages/ui` first then all `frontend/*` apps (see root `package.json`).
  - Generate API client: `pnpm codegen` (root) -> runs `@fineract-apps/fineract-api`'s codegen. This runs automatically on `postinstall`.
  - Lint / format: `pnpm lint` (Biome check), `pnpm format` (Biome format).
  - Tests: `pnpm test` (Jest, configured at repo root via `jest.config.js`).

- Conventions and patterns to follow (discoverable in code)
  - Component structure: many components use separate files like `Component.view.tsx` + `Component.types.ts` + `Component.context.ts`.
    - Example: `packages/ui/src/components/AppLayout/AppLayout.view.tsx` uses `forwardRef`, a contextual `SidebarProvider`, and `Navbar` cloning via `React.cloneElement` to inject `onToggleMenu` and `isMenuOpen` props.
  - CSS/styling: Tailwind is used throughout. `packages/ui` exports `styles.css` and components rely on utility classes.
  - Local workspace deps: packages frequently reference each other using `workspace:*` in `package.json`. When changing APIs, update consumers and run `pnpm install`.
  - TypeScript: there are shared base configs (`packages/config/tsconfig.base.json`, root `tsconfig.json`). Prefer adding types to `src/index.ts` exports for library packages.

- Codegen & generated code
  - API client code is generated under `packages/fineract-api/src/generated` (check `fineract.json` and `scripts/add-ts-nocheck.mjs`).
  - Avoid editing generated files directly; instead update the OpenAPI/spec or codegen config and re-run `pnpm codegen`.

- CI / commit rules
  - Husky is enabled; `prepare` and `postinstall` hooks are present. Commit hooks run `pnpm lint` and `commitlint`.
  - Commit messages must follow Conventional Commits (root `commitlint.config.js`). Example: `feat(ui): add compact button variant`.

- Common pitfalls and gotchas
  - Watch for unresolved merge conflicts (<<<<<<<, >>>>>>>). Example: `packages/ui/src/components/AppLayout/AppLayout.view.tsx` currently contains conflict markers — do not assume such files are valid until conflicts are resolved.
  - Many UI components check `typeof window !== 'undefined'` for SSR-safe behavior. Preserve those guards when extracting logic.
  - When changing build outputs for `packages/ui`, bump exports in `packages/ui/package.json` if you add new entry points (the `exports` field controls package consumers).

- How to make small changes safely (recommended dev loop)
  1. Run `pnpm install` once after switching branches to ensure workspace linking.
 2. Work inside the package you're changing (e.g., `packages/ui` or `frontend/cashier-app`). You can run its dev server: `cd packages/ui && pnpm dev` or `cd frontend/account-manager-app && pnpm dev`.
 3. Run `pnpm lint` and `pnpm test` locally before opening a PR.
 4. Use conventional commits in your message; CI enforces linting and build.

- Where to look for examples
  - UI component patterns: `packages/ui/src/components/*` (look for `.view.tsx`, `.types.ts`, `*.context.ts` files).
  - App router & entry points: `frontend/*/src/main.tsx` and `routeTree.gen.ts`.
  - Config patterns: `packages/config/vite.config.base.js`, `tsconfig.*.json`.

If anything above is unclear or you'd like me to expand a section (for example, provide explicit code-review rules, or a checklist for PRs that touch multiple packages), tell me which part to expand and I will update this file.
