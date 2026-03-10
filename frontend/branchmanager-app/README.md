# Branch Manager App

This app implements the Branch Manager experience using the shared UI library and TanStack Router.

## Available routes

- `/login` — simple login screen (navigates to dashboard)
- `/dashboard` — main dashboard with alerts, summary cards, tabs, and a filterable approvals table
- `/funds/allocate` — Allocate funds to tellers (Form)
- `/funds/settle` — Settle funds from tellers (Form)
- `/staff/assign` — Manage staff assignments (initial static view)
- `/branches` — Placeholder
- `/reports` — Placeholder
- `/settings` — Placeholder

## Run locally

```sh
pnpm --dir ../../ dev # from monorepo root: pnpm --dir fineract-apps --filter ./frontend/branchmanager-app... dev
# or from this folder
pnpm dev
```

Then open the local URL printed in the terminal (e.g., http://localhost:5173/).

## Notes

- Styles come from `@fineract-apps/ui/styles.css`.
- Routes are file-based in `src/routes` and generated into `routeTree.gen.ts` by the TanStack Router plugin.
- Forms use the shared `Form` and `Input` components for consistent UX.
