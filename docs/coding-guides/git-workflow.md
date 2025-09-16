# Git Workflow & Contribution Guide

This document defines the Git workflow, branching strategy, and standards for contributing to the codebase. Adhering to this guide is essential for maintaining a clean, readable, and manageable project history.

## 1. Branching Strategy

We follow a simple **Feature Branch Workflow**.

- **`main` branch**: This is the primary branch. It represents the official project history and should always be stable and deployable. Direct commits to `main` are strictly forbidden.
- **Feature Branches**: All new work, including features, bug fixes, and refactors, must be done on a separate branch. 
  - Branch names should be descriptive and prefixed with a type, followed by a short description in `kebab-case`.
  - **Prefixes**: `feat/`, `fix/`, `refactor/`, `docs/`, `chore/`
  - **Example**: `feat/user-login-form`, `fix/incorrect-calculation-in-reports`

To start new work, always create a new branch from the latest version of `main`:

```bash
git checkout main
git pull origin main
git checkout -b feat/new-cool-feature
```

## 2. Commit Message Convention

We enforce the **Conventional Commits** specification. This format creates an explicit and easily readable commit history, which helps in automating changelog generation and understanding the impact of changes.

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

- **Type**: Must be one of the following:
  - `feat`: A new feature.
  - `fix`: A bug fix.
  - `docs`: Documentation only changes.
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc).
  - `refactor`: A code change that neither fixes a bug nor adds a feature.
  - `perf`: A code change that improves performance.
  - `test`: Adding missing tests or correcting existing tests.
  - `chore`: Changes to the build process or auxiliary tools and libraries.

- **Scope (optional)**: A noun describing the section of the codebase affected (e.g., `ui`, `auth`, `reports`).

- **Subject**: A short, imperative-tense description of the change (e.g., "add login form component").

**Example Commit:**
```
feat(auth): add password strength indicator

Adds a new visual component to the registration form that provides real-time feedback on password strength to the user.

Resolves: TICKET-123
```

## 3. Pull Request (PR) Process

1.  **Create a PR**: When your feature branch is ready, push it to the remote and open a Pull Request against the `main` branch.

2.  **Title & Description**: 
    - The PR title should follow the Conventional Commits format.
    - The description must clearly explain the **"what"** and **"why"** of the change. Link to any relevant issue or ticket number.

3.  **CI Checks**: All automated checks (linting, testing, building) configured in the CI pipeline must pass. A PR with failing checks cannot be merged.

4.  **Code Review**:
    - At least **one approval** from another developer is required before merging.
    - The author of the PR **must not** merge their own changes.
    - Reviews should be constructive and focus on improving code quality, correctness, and adherence to the coding guides.

5.  **Merging**: 
    - Use the **"Squash and Merge"** option in GitHub/GitLab.
    - This combines all commits from the feature branch into a single, clean commit on the `main` branch.
    - Ensure the final commit message is well-formatted according to the Conventional Commits standard before merging.
