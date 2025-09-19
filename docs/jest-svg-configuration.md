# Jest SVG Configuration and Testing Setup

## Problem

When testing React components that import SVG files, Jest encounters two issues:

1. **Runtime Error**: Jest tries to parse SVG files as JavaScript, causing syntax errors
2. **TypeScript Error**: TypeScript compiler cannot find type declarations for SVG modules

## Solution

Our solution addresses both issues through a multi-layered approach:

```
Jest Configuration
├── Runtime Mock (__mocks__/svgMock.js)
├── Type Declarations (__mocks__/svg.d.ts)
├── Jest-specific TypeScript Config (tsconfig.jest.json)
└── Module Name Mapping (jest.config.js)
```

## File Structure

```
fineract-apps/
├── __mocks__/
│   ├── svgMock.js          # Runtime mock for SVG imports
│   └── svg.d.ts            # TypeScript declarations for SVG modules
├── packages/config/
│   └── tsconfig.jest.json  # Jest-specific TypeScript configuration
└── jest.config.js          # Main Jest configuration
```

## Configuration Files

### 1. Runtime Mock (`__mocks__/svgMock.js`)

```javascript
// Mock for SVG imports in Jest tests
module.exports = "svg-mock";
```

**Purpose**: Provides a mock implementation for SVG imports during test execution.

### 2. Type Declarations (`__mocks__/svg.d.ts`)

```typescript
// Global type declarations for Jest tests
declare module "*.svg" {
  const content: string;
  export default content;
}
```

**Purpose**: Provides TypeScript type information for SVG module imports.

### 3. Jest-Specific TypeScript Config (`packages/config/tsconfig.jest.json`)

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "types": ["jest", "@testing-library/jest-dom", "node"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  },
  "include": [
    "../ui/src/**/*",
    "../ui/src/vite-env.d.ts",
    "../../__mocks__/svg.d.ts"
  ]
}
```

**Purpose**: Extends the base TypeScript configuration with Jest-specific settings.

### 4. Main Jest Configuration (`jest.config.js`)

```javascript
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/packages/config/tsconfig.jest.json",
      },
    ],
  },
  moduleNameMapper: {
    "^@fineract-apps/(.*)$": "<rootDir>/packages/$1/src",
    "\\.(svg)$": "<rootDir>/__mocks__/svgMock.js",
  },
  // ... other configurations
};
```

**Purpose**: Configures Jest to use the custom TypeScript configuration and SVG mocks.

## How It Works

1. **Component imports SVG**: `import WarningIcon from "../icons/warning.svg";`
2. **Jest intercepts import**: `moduleNameMapper` redirects `.svg` imports to `svgMock.js`
3. **TypeScript compilation**: `tsconfig.jest.json` includes SVG type declarations
4. **Test execution**: Component receives mock string value, tests run normally

### Example Usage

```typescript
// Component under test
import WarningIcon from "../icons/warning.svg";

export const FormWarning = () => (
  <img src={WarningIcon} alt="Warning" />
);

// Test file
test("renders warning icon", () => {
  render(<FormWarning />);
  const img = screen.getByAltText("Warning");
  expect(img).toHaveAttribute("src", "svg-mock");
});
```

## Why This Setup?

### `__mocks__` Directory
- **Runtime Mock**: Jest cannot parse SVG files as JavaScript modules
- **Type Declarations**: TypeScript compiler needs to know the shape of SVG imports
- **Separation**: Keeps test-specific configurations separate from production code

### TypeScript Config Modifications
- **Environment Differences**: Jest runs in Node.js, not browser
- **Module Resolution**: Requires different settings than Vite/browser builds
- **Type Safety**: Ensures all necessary type declarations are available during testing

## Troubleshooting

### Common Issues

1. **"Cannot find module '*.svg'"**
   - Ensure `__mocks__/svg.d.ts` is included in `tsconfig.jest.json`
   - Check that `moduleNameMapper` is correctly configured

2. **"Support for the experimental syntax 'jsx' isn't currently enabled"**
   - Verify Jest is using the correct TypeScript configuration
   - Ensure `tsconfig.jest.json` extends the base configuration properly

3. **Tests pass locally but fail in CI**
   - Check that all mock files are committed to version control
   - Verify Jest configuration paths are correct for CI environment

### Debugging Steps

```bash
# Check Jest configuration
npx jest --showConfig

# Verify TypeScript compilation
npx tsc --noEmit --project packages/config/tsconfig.jest.json

# Test SVG import directly
import testSvg from "./test.svg";
console.log(testSvg); // Should log "svg-mock"
```

## Benefits

- **Type Safety**: Full TypeScript support for SVG imports in tests
- **Performance**: No actual SVG parsing during tests
- **Maintainability**: Centralized mock configuration
- **Reliability**: Tests run consistently across all environments
