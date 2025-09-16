# Modern Frontend Project Starter

This repository serves as a template for initializing new projects with a robust, modern, and efficient toolchain. The goal is to provide a production-ready setup out-of-the-box, allowing developers to focus on building features rather than on configuration.

## Core Technologies

- **Vite**: A next-generation frontend build tool.
- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

## Quality Assurance & Automation

This template is pre-configured with a suite of tools to enforce code quality, consistency, and best practices automatically.

### Biome

An all-in-one toolchain that handles formatting and linting. It is extremely fast and replaces the need for separate tools like ESLint and Prettier.

- **Check code for errors**: `pnpm lint`
- **Format the entire project**: `pnpm format`

### Husky & Git Hooks

Husky is used to manage Git hooks, which are scripts that run automatically at certain points in the Git lifecycle.

- **`pre-commit`**: Before each commit, a hook automatically runs `pnpm lint`. This ensures that no code with linting or formatting errors can be committed to the repository.
- **`commit-msg`**: Before each commit is finalized, a hook runs `commitlint` to ensure the commit message follows the [Conventional Commits](https://www.conventionalcommits.org/) standard. This is crucial for a clean and readable version history.

### Continuous Integration

A GitHub Actions workflow is configured at `.github/workflows/node.js.yml`.

- This CI pipeline automatically runs on every push and pull request to the `main` branch.
- It performs the following checks:
  1.  Installs all dependencies using `pnpm`.
  2.  Builds the project to ensure it compiles correctly.
  3.  Runs `pnpm lint` to verify that all code adheres to the project's quality standards.

## Available Scripts

- `pnpm dev`: Starts the Vite development server.
- `pnpm build`: Builds the application for production.
- `pnpm lint`: Checks the entire project for linting and formatting errors with Biome.
- `pnpm format`: Automatically formats the entire project with Biome.