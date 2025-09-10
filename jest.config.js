// jest.config.ts
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  // Load extra matchers like "toBeInTheDocument"
  setupFilesAfterEnv: ["@testing-library/jest-dom"],

  // Resolve imports like @repo/ui/Button → packages/ui/src/Button
  moduleNameMapper: {
    "^@repo/ui/(.*)$": "<rootDir>/packages/ui/src/$1",
  },

  // Let ts-jest handle .ts/.tsx files, using the shared base tsconfig
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.base.json",
      },
    ],
  },

  // Match both `.test.ts[x]` and `.spec.ts[x]` inside packages
  testMatch: ["<rootDir>/packages/**/?(*.)+(spec|test).[jt]s?(x)"],

  // Coverage configuration
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/"],
};
