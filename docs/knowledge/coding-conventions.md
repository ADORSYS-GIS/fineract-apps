# Coding Conventions — fineract-apps

## Naming Standards
Follow these naming conventions to maintain consistency across the codebase.

**Frontend (TypeScript/React):**
| Element | Convention | Example |
|-----------|------------------|-------------------------|
| Variables | `camelCase` | `const customerId = 1;` |
| Functions | `camelCase` | `function getCustomer() {}` |
| React Components | `PascalCase` | `function CustomerProfile() {}` |
| React Hooks | `use` + `PascalCase` | `function useCustomer() {}` |
| Types/Interfaces | `PascalCase` | `interface Customer {}` |
| Files (Components) | `PascalCase.tsx` | `CustomerProfile.tsx` |
| Files (Other) | `camelCase.ts` | `useCustomer.ts` |

**Backend (Java):**
| Element | Convention | Example |
|-----------|------------------|------------------------------|
| Variables | `camelCase` | `String customerId = "1";` |
| Methods | `camelCase` | `public Customer getCustomer() {}` |
| Classes | `PascalCase` | `public class CustomerService {}` |
| Constants | `UPPER_CASE` | `public static final int MAX_RETRIES = 3;` |
| Files | `PascalCase.java`| `CustomerService.java` |

**General:**
| Element | Convention | Example |
|------------------|------------------|----------------------------|
| API endpoints | `kebab-case` | `/api/v1/asset-catalog` |
| Database tables | `snake_case` | `customer_orders` |

## File Organization
This is a monorepo with the following top-level directory structure:

```
.
├── backend/         # All backend microservices
├── docs/            # Project documentation
├── frontend/        # All frontend applications
├── observability/   # Monitoring and tracing configurations (e.g., Grafana, Prometheus)
├── packages/        # Shared packages used by frontend applications
├── public/          # Public assets
├── scripts/         # Utility scripts
└── .github/         # GitHub Actions workflows and issue templates
```

**Backend:**
Each subdirectory in `backend/` is a separate microservice (e.g., `asset-service`, `payment-gateway-service`). Each service is a self-contained Spring Boot application with its own `pom.xml` and `src/` directory.

**Frontend:**
Each subdirectory in `frontend/` is a separate React application (e.g., `self-service-app`, `admin-app`). They are all managed by `pnpm` workspaces.

**Packages:**
The `packages/` directory contains shared libraries used across the frontend applications. For example, a UI component library or a shared API client.

## Code Formatting
**Frontend:**
The frontend code is formatted using [Biome](https://biomejs.dev/). The configuration is in `biome.json`.
- Indentation: Tabs
- Quote Style: Double quotes

To format the code, run:
```bash
pnpm format
```

**Backend:**
There is no automated code formatter enforced for the backend. Please follow standard Java code conventions, which are generally the default in modern IDEs like IntelliJ IDEA or VS Code with Java extensions.

## Import Ordering
**Frontend:**
Imports are automatically sorted by Biome when you run the formatter.

**Backend:**
There is no automated import sorter enforced for the backend. Please follow standard Java conventions:
1. `java` and `javax` packages
2. Third-party packages (e.g., `org.springframework`)
3. Project packages (e.g., `com.adorsys.fineract`)

## Comment Standards
**Frontend:**
Use JSDoc-style comments for hooks and complex functions. Explain the *why*, not the *what*.
```typescript
/**
 * Hook to get the authenticated customer's details.
 *
 * This hook now sources customer data directly from the OIDC token's
 * claims, avoiding a separate API call. It provides a consistent
 * `Customer` object to the rest of the application.
 */
export function useCustomer() {
  // ...
}
```

**Backend:**
Use Javadoc-style comments for all public classes and methods.
```java
/**
 * Service for asset catalog browsing, search, and discovery.
 */
@Service
public class AssetCatalogService {
    /**
     * List active assets with optional category filter and search.
     */
    public Page<AssetResponse> listAssets(...) {
        // ...
    }
}
```

**TODOs:**
Use a consistent format for TODO comments:
`// TODO(username): Description of what needs to be done`

## Commit Message Format
This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. This is enforced by `commitlint` with the `@commitlint/config-conventional` configuration.

The format is:
`type(scope): description`

- **type**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, etc.
- **scope**: Optional, e.g., `asset-service`, `self-service-app`.
- **description**: A short, imperative-tense description of the change.

## Code Review Checklist
When reviewing pull requests, please check for the following:

- [ ] **Clarity:** Is the code easy to understand? Are variable and function names descriptive?
- [ ] **Correctness:** Does the code do what it's supposed to do? Does it handle edge cases?
- [ ] **Testing:** Are there new tests for new features? Do existing tests pass?
- [ ] **Security:** Are there any potential security vulnerabilities (e.g., XSS, SQL injection)? Are secrets handled properly?
- [ ] **Documentation:** Is the code well-commented? Has the public API been documented? Have any relevant documents (e.g., `README.md`) been updated?
- [ ] **Consistency:** Does the code follow the conventions in this document?
