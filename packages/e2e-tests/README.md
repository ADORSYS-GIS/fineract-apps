# E2E Testing Setup

This package contains the end-to-end tests for the Fineract Apps project, using Playwright and playwright-bdd.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (version 20 or higher)
- [pnpm](https://pnpm.io/) (version 8 or higher)

## Installation

1. Install the project dependencies from the root of the monorepo:

   ```bash
   pnpm install
   ```

   **Note:** You must run this command whenever you add a new dependency to any of the packages in the monorepo.

2. The Playwright browsers will be installed automatically. If you need to install them manually, run the following command:

   ```bash
   pnpm playwright install
   ```

## Environment Variables

Before running the tests, you need to create a `.env` file in the `packages/e2e-tests` directory with the following variables:

`E2E_USERNAME="your_username"`
`E2E_PASSWORD="your_password"`

You can use the `.env.example` file as a template.

## Running the Tests

To run the E2E tests, run the following command from the root of the monorepo:

```bash
pnpm test:e2e
```

This will run the Playwright tests in headless mode. The test results will be displayed in the console, and a detailed HTML report will be generated in the `playwright-report` directory.

## Directory Structure

- `packages/e2e-tests/tests/<app-name>/features`: This directory contains the feature files that describe the application's behavior in Gherkin syntax.
- `packages/e2e-tests/tests/shared/steps`: This directory contains shared step definitions that can be used across multiple feature files.
- `playwright.config.ts`: This file contains the Playwright configuration.

## Writing Tests

To write a new test, you need to:

1. Create a new `.feature` file in the `features` directory.
2. Write the test scenarios in Gherkin syntax.
3. If the steps are not already defined in the shared steps, create a new step definition file in the `steps` directory within the app's test folder.
4. Implement the steps in the feature file using the Playwright API.

You can also reuse existing step definitions from `packages/e2e-tests/tests/shared/steps`.

For more information on how to write tests with Playwright and playwright-bdd, refer to the following documentation:

- [Playwright](https://playwright.dev/)
- [playwright-bdd](https://github.com/vital-lunin/playwright-bdd)
