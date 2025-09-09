# Biome Setup and Migration Guide

This guide provides a detailed walkthrough for setting up Biome in this project, including migrating from ESLint. Biome is an all-in-one toolchain that handles linting, formatting, and more, helping us maintain consistent code quality with a single, fast tool.

## 1. Why Biome?

- **Simplicity**: It replaces multiple tools (ESLint for linting, Prettier for formatting) with a single dependency.
- **Performance**: Biome is written in Rust and is significantly faster than JavaScript-based tools.
- **Integration**: It's designed to work as a single, cohesive system.

## 2. Step-by-Step Setup and Migration

This process assumes you are starting with a project that already uses ESLint.

### Step 1: Install Biome

First, we add Biome to the project as a development dependency.

```bash
pnpm add -D @biomejs/biome
```

- **Why?** Adding this to `devDependencies` in `package.json` ensures that every developer who runs `pnpm install` will receive the exact same version of Biome, guaranteeing consistent checks for everyone.

### Step 2: Initialize Biome

Next, create a default configuration file.

```bash
pnpm biome init
```

- **Why?** This command creates the `biome.json` file in your project root. This file is the heart of Biome's configuration, where all rules for formatting and linting will be defined.

### Step 3: Migrate from ESLint

Biome can automatically read your existing ESLint configuration and translate it. This makes the transition much smoother.

```bash
pnpm biome migrate eslint --write
```

- **Why?** The `migrate` command intelligently converts the rules it finds in your `eslint.config.js` into the equivalent `biome.json` format. The `--write` flag tells Biome to apply these changes directly to your `biome.json` file. This saves a lot of manual configuration work.

### Step 4: Update `package.json` Scripts

Now, we need to tell your project to use Biome instead of ESLint.

1.  Open `package.json`.
2.  Find the `"scripts"` section.
3.  Replace the old `"lint"` script with a new one for Biome, and add a `"format"` script.

**Before:**
```json
"scripts": {
  "lint": "eslint ."
}
```

**After:**
```json
"scripts": {
  "lint": "biome check .",
  "format": "biome format --write ."
}
```

- **Why?**
  - `"lint": "biome check ."`: We are redirecting the main `lint` command to use Biome. `biome check` analyzes your code for both linting and formatting violations.
  - `"format": "biome format --write ."`: We add a dedicated script for auto-formatting. The `--write` flag tells Biome to modify the files directly to fix any formatting issues.

### Step 5: Apply Fixes to the Codebase

After migrating the rules, your existing code is likely not compliant. We need to run Biome to fix everything.

1.  **Apply safe linting fixes:**
    ```bash
    pnpm biome check --write .
    ```
    - **Why?** This command finds all linting violations and applies any fixes that are considered "safe" (non-breaking), such as sorting `import` statements.

2.  **Apply formatting fixes:**
    ```bash
    pnpm format
    ```
    - **Why?** This runs our new `format` script, which is dedicated to fixing all formatting issues (indentation, spacing, quotes, etc.) across the entire project.

3.  **Final Verification:**
    ```bash
    pnpm lint
    ```
    - **Why?** After applying all fixes, run the `lint` command one last time. It should now pass with no errors, confirming your project is fully compliant with the new Biome ruleset.

### Step 6: Clean Up Old ESLint Dependencies

Now that Biome is fully integrated, you can safely remove the old ESLint packages and configuration files.

1.  **Uninstall packages:**
    ```bash
    pnpm remove @eslint/js eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals typescript-eslint
    ```
2.  **Delete the configuration file:**
    ```bash
    rm eslint.config.js
    ```
- **Why?** This keeps your project clean, reduces the number of dependencies, and prevents confusion about which tool is being used.

## 3. Husky Integration

No changes are needed for your Husky hooks. Because our `.husky/pre-commit` hook was already configured to run the `pnpm lint` script, it automatically started using Biome the moment we updated the script in `package.json`. This demonstrates the power of abstracting your commands into `package.json` scripts.
