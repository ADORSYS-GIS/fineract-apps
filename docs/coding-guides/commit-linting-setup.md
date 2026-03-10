# Automated Commit Linting Setup Guide

This guide explains how to set up the tools that automatically enforce our project's commit message conventions. Following this setup is crucial for maintaining a clean, readable, and automated project history.

## 1. Why We Do This

A consistent commit history is incredibly valuable. It allows us to:
- **Automatically generate changelogs** for new releases.
- Easily understand the history of changes in the project.
- Pinpoint when features or fixes were introduced.

To achieve this, we use the [Conventional Commits](https://www.conventionalcommits.org/) standard, as defined in our `git-workflow.md`. This setup automates the enforcement of that standard.

## 2. Tools Overview

We use two main tools to make this work:

- **Husky**: The enforcer. Husky is a tool that makes it easy to manage Git hooks. Git hooks are scripts that Git runs automatically at certain points (e.g., before a commit). Husky ensures that every developer on the project has these hooks active.
- **Commitlint**: The validator. This is a linter that checks if your commit message follows the Conventional Commits rules.

## 3. Step-by-Step Setup

### Step 1: Install Dependencies

First, we need to add the necessary development dependencies to the project.

```bash
pnpm add -D husky @commitlint/cli @commitlint/config-conventional
```

- **Why?**
  - `husky`: The core tool for managing Git hooks.
  - `@commitlint/cli`: The command-line tool that can check a commit message.
  - `@commitlint/config-conventional`: The pre-built set of rules for `commitlint` that defines the Conventional Commits standard.

### Step 2: Configure `package.json` and Enable Husky

Husky needs a `prepare` script in `package.json` to automatically install the hooks for every developer after they run `pnpm install`.

Add the following script to your `package.json`:
```json
"scripts": {
  // ... other scripts
  "prepare": "husky"
}
```

Then, run the script once to complete the initial setup:
```bash
pnpm prepare
```
- **Why?** The `prepare` script is a special script that `pnpm` (and `npm`) runs automatically after an installation. By telling it to run `husky`, we ensure that the Git hooks defined in the `.husky/` directory are properly installed in every developer's local `.git/hooks` folder, making the setup work seamlessly for everyone.

### Step 3: Create the Commitlint Configuration

`commitlint` needs to know which ruleset to use. We create a configuration file for this.

**File:** `commitlint.config.js` (in the project root)
```javascript
export default {
  extends: ['@commitlint/config-conventional'],
};
```

- **Why?** This file is the **rulebook**. When `commitlint` runs, it looks for this file. The `extends` property tells it to use the standard `@commitlint/config-conventional` ruleset we installed earlier. This is what enforces the `<type>(<scope>): <subject>` format.

### Step 4: Create the `commit-msg` Hook

This hook will trigger `commitlint` every time you make a commit.

**File:** `.husky/commit-msg`
```sh
npx --no -- commitlint --edit "$1"
```

- **Why?** This is the script that Husky runs right after you write your commit message. It executes `commitlint`, which then uses `commitlint.config.js` to validate your message. If the message is invalid, `commitlint` will exit with an error, and Husky will stop the commit from being created.

### Step 5: (Recommended) Create a `pre-commit` Hook

It's also good practice to lint your code *before* you commit it.

**File:** `.husky/pre-commit`
```sh
pnpm lint
```

- **Why?** This is an additional quality gate. It runs the project's linter (`eslint`) on your code before you commit. This prevents code with syntax errors or style issues from ever entering the codebase.

---

## How It All Works Together

1.  You run `git commit -m "a message"`.
2.  The `pre-commit` hook fires first, running `pnpm lint` to check your code.
3.  If the code is clean, Git proceeds and captures your commit message.
4.  The `commit-msg` hook fires, running `commitlint` on your message.
5.  `commitlint` uses the rules from `commitlint.config.js` to validate the message.
6.  If the message is valid, the commit is successfully created. If not, the commit is aborted with an error explaining what was wrong.
