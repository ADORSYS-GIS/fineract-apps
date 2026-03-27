# fineract-apps

## Tech Stack
- **Languages:** typescript,javascript,python,java
- **Frameworks:** react,django,flask,fastapi,spring
- **Package Managers:** pnpm,pip,maven
- **Test Frameworks:** playwright,pytest,junit5,testng

## Repository Structure
```
monorepo
```

## Core Principles

- Write clean, readable code. Favor clarity over cleverness.
- Every change must leave the codebase better than you found it.
- Security is non-negotiable. Follow OWASP guidelines for all user-facing code.
- Never commit secrets, API keys, tokens, or credentials. Use environment variables and secret managers.
- All public APIs must have input validation and proper error handling.
- Prefer composition over inheritance. Favor small, focused functions.

## Git Conventions

### Commits
- Use Conventional Commits: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`
- Scope is optional but encouraged (e.g., `feat(auth): add OAuth2 flow`)
- Subject line: imperative mood, lowercase, no period, max 72 characters
- Body: explain *why* the change was made, not *what* changed (the diff shows that)

### Branches
- Feature: `feat/short-description` or `feat/TICKET-123-short-description`
- Bugfix: `fix/short-description`
- Hotfix: `hotfix/short-description`
- Release: `release/vX.Y.Z`

### Pull Requests
- PRs must have a clear description of changes and motivation
- All CI checks must pass before merge
- Require at least one approving review
- Keep PRs small and focused; split large changes into stacked PRs
- Link related issues using `Closes #123` or `Fixes #123`

## Code Review Standards

- Review for correctness, security, performance, and readability in that order
- Check for proper error handling and edge cases
- Verify test coverage for new and changed code
- Flag any hardcoded values that should be configurable
- Ensure naming is clear and consistent with the codebase
- Look for potential race conditions in concurrent code

## Error Handling Philosophy

- Fail fast and fail loudly in development; fail gracefully in production
- Use typed/structured errors, not raw strings
- Always log errors with sufficient context for debugging (timestamp, request ID, stack trace)
- Never swallow exceptions silently
- Distinguish between recoverable and unrecoverable errors
- Return meaningful error messages to API consumers (without leaking internals)

## Documentation Expectations

- Public functions and APIs must have doc comments explaining purpose, parameters, return values, and thrown errors
- Complex business logic must have inline comments explaining *why*, not *what*
- Keep README up to date when adding features, changing setup steps, or modifying architecture
- Document breaking changes prominently in changelogs
- Architecture decisions should be recorded in ADRs (Architecture Decision Records) when significant

## TypeScript Conventions

### Naming
- Variables and functions: `camelCase`
- Classes, interfaces, types, enums: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE` for true constants, `camelCase` for derived values
- Files: `kebab-case.ts` for modules, `PascalCase.ts` for classes/components
- Interfaces: do NOT prefix with `I` (use `UserService`, not `IUserService`)
- Type parameters: single uppercase letter (`T`, `K`, `V`) or descriptive (`TResult`, `TInput`)

### Type Safety
- Enable `strict: true` in tsconfig.json — never disable it per-file
- Avoid `any`; use `unknown` when the type is truly unknown, then narrow with type guards
- Prefer `interface` for object shapes that may be extended; use `type` for unions, intersections, and mapped types
- Use discriminated unions over optional fields for state modeling
- Leverage `as const` for literal types and `satisfies` for type-checked assignments
- Never use non-null assertions (`!`) unless you have a provable guarantee; prefer optional chaining (`?.`) and nullish coalescing (`??`)

### Imports and Modules
- Use ES module syntax (`import`/`export`), never CommonJS (`require`) in `.ts` files
- Order imports: (1) node built-ins, (2) external packages, (3) internal aliases, (4) relative imports — separated by blank lines
- Use path aliases (e.g., `@/`) instead of deep relative imports (`../../../`)
- Prefer named exports over default exports for better refactoring and tree-shaking
- Co-locate types with the module that owns them; shared types go in a `types/` directory

### Error Handling
- Use custom error classes that extend `Error` with a `code` property for programmatic handling
- Prefer `Result<T, E>` patterns or discriminated unions for expected failure paths
- Use try/catch only for truly exceptional situations
- Always type catch variables as `unknown` and narrow before use

### Patterns and Idioms
- Use `readonly` for properties and arrays that should not be mutated
- Prefer `Map`/`Set` over plain objects for dynamic key collections
- Use `enum` sparingly; prefer `as const` objects with derived union types
- Leverage template literal types for string validation where applicable
- Use generics to avoid code duplication, but keep them simple — no more than 2-3 type parameters

### Common Pitfalls
- Do not use `==`; always use `===`
- Avoid floating promises — always `await` or explicitly handle with `.catch()`
- Never mutate function parameters; return new values
- Avoid `Object.assign` for cloning; use spread or `structuredClone`
- Beware of `this` context loss in callbacks — use arrow functions or explicit binding
- Do not use `@ts-ignore`; use `@ts-expect-error` with a comment explaining why

## JavaScript Conventions

### Naming
- Variables and functions: `camelCase`
- Classes: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE` for true compile-time constants, `camelCase` otherwise
- Files: `kebab-case.js` for modules, `PascalCase.js` for classes/components
- Private methods/properties: prefix with `#` (native private fields), not `_`
- Boolean variables: prefix with `is`, `has`, `should`, `can` (e.g., `isActive`, `hasPermission`)

### Module Organization
- Use ES modules (`import`/`export`) over CommonJS (`require`/`module.exports`) in new code
- Order imports: (1) node built-ins, (2) external packages, (3) internal modules, (4) relative — separated by blank lines
- Prefer named exports for discoverability; use default exports only for main module entry points
- Keep files under 300 lines; extract when a file handles multiple responsibilities

### Error Handling
- Always handle promise rejections — unhandled rejections crash Node.js
- Use `try/catch` around `await` calls or attach `.catch()` handlers
- Throw `Error` objects (or subclasses), never strings or plain objects
- Validate function inputs early and throw descriptive errors (fail fast)
- Use custom error classes with `name` and `code` properties for programmatic handling

### Patterns and Idioms
- Use `const` by default; use `let` only when reassignment is necessary; never use `var`
- Prefer arrow functions for callbacks and anonymous functions
- Use destructuring for function parameters and return values
- Prefer `Array.prototype` methods (`map`, `filter`, `reduce`) over `for` loops for transformations
- Use optional chaining (`?.`) and nullish coalescing (`??`) instead of manual null checks
- Prefer template literals over string concatenation
- Use `Object.freeze()` for configuration objects that must not be mutated

### Async Patterns
- Prefer `async/await` over `.then()` chains for readability
- Use `Promise.all()` for parallel independent operations; `Promise.allSettled()` when partial failure is acceptable
- Never mix callbacks and promises in the same API
- Use `AbortController` for cancellable async operations

### Common Pitfalls
- Always use `===` and `!==`; never `==` or `!=`
- Beware of `this` binding in callbacks — arrow functions inherit `this` from the enclosing scope
- Do not mutate function arguments; clone objects with spread or `structuredClone()`
- Never use dynamic code execution functions — they are security risks
- Beware of floating-point arithmetic: use libraries for financial calculations
- Never rely on object key order for logic (use `Map` for ordered key-value pairs)
- Guard against prototype pollution: validate object keys from user input

## Python Conventions

### Naming
- Variables, functions, methods: `snake_case`
- Classes: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Modules and packages: `snake_case`, short, lowercase
- Private attributes/methods: single leading underscore `_private_method`
- Name-mangled attributes: double leading underscore `__internal` (use sparingly)
- Files: `snake_case.py` — never use hyphens in module names

### Type Safety
- Use type hints for all function signatures (parameters and return types)
- Use `from __future__ import annotations` for forward references (Python 3.7-3.9)
- Prefer `str | None` over `Optional[str]` (Python 3.10+)
- Use `TypedDict` for dictionary shapes, `dataclass` or `Pydantic` models for structured data
- Run `mypy` or `pyright` in CI with strict mode enabled
- Use `Protocol` for structural subtyping instead of ABC when possible

### Import Organization
- Order: (1) standard library, (2) third-party, (3) local — separated by blank lines
- Use `isort` to enforce import ordering automatically
- Prefer absolute imports over relative imports
- Never use wildcard imports (`from module import *`)
- Import modules, not individual names, when the module is well-known (e.g., `import os`, not `from os import path`)

### Error Handling
- Catch specific exceptions, never bare `except:` or `except Exception:`
- Use custom exception classes inheriting from a project-level base exception
- Use `raise ... from err` to preserve exception chains
- Context managers (`with`) for all resource management (files, connections, locks)
- Validate inputs at function boundaries; raise `ValueError`/`TypeError` early

### Patterns and Idioms
- Use f-strings for string formatting (not `%` or `.format()`)
- Use list/dict/set comprehensions over `map()`/`filter()` for readability
- Prefer `pathlib.Path` over `os.path` for file system operations
- Use `dataclasses` or `attrs` for data containers; `Pydantic` for validation
- Use `enum.Enum` for fixed sets of values
- Prefer `collections.defaultdict` and `collections.Counter` over manual dict manipulation
- Use generators and `yield` for large data processing to conserve memory

### Common Pitfalls
- Never use mutable default arguments (`def f(items=[])`); use `None` and initialize inside
- Beware of late binding in closures and lambdas
- Do not modify a list while iterating over it; create a new list or use a copy
- Avoid circular imports by restructuring modules or using deferred imports
- Use `is` for `None` checks (`if x is None`), not `==`
- Remember that `dict.keys()` returns a view, not a list, in Python 3

## Java Conventions

### Naming
- Variables, methods, parameters: `camelCase`
- Classes, interfaces, enums, records: `PascalCase`
- Constants (`static final`): `SCREAMING_SNAKE_CASE`
- Packages: `lowercase.dotted` (reverse domain, e.g., `com.company.project.module`)
- Files: one public class per file, filename matches class name exactly
- Test classes: `ClassNameTest.java`; test methods: `shouldDoSomething_whenCondition`

### Type Safety
- Use generics everywhere; never use raw types (`List` without `<T>`)
- Prefer `Optional<T>` for return types that may be absent; never return `null` from public methods
- Use `sealed` classes/interfaces (Java 17+) for exhaustive type hierarchies
- Prefer records for immutable data carriers
- Use `@Nullable`/`@NonNull` annotations from your chosen library (JSR-305 or JetBrains)
- Avoid autoboxing in performance-sensitive code; prefer primitive types where possible

### Import Organization
- Order: (1) `java.*`, (2) `javax.*`, (3) third-party, (4) project-internal — separated by blank lines
- Never use wildcard imports (`import java.util.*`); import specific classes
- Remove unused imports (configure IDE/CI to enforce)
- Static imports only for constants and assertion methods in tests

### Error Handling
- Use checked exceptions for recoverable conditions; unchecked for programming errors
- Never catch `Throwable` or `Error` unless you are in a top-level handler
- Always include the original exception as the cause when wrapping: `throw new AppException("msg", e)`
- Use try-with-resources for all `AutoCloseable` resources
- Define a project-level exception hierarchy (e.g., `AppException -> NotFoundException, ValidationException`)
- Never use exceptions for control flow

### Patterns and Idioms
- Prefer immutability: `final` fields, unmodifiable collections, records
- Use the Builder pattern for objects with many optional parameters
- Prefer dependency injection over static factory methods for testability
- Use `Stream` API for collection transformations, but avoid deeply nested streams
- Use `var` (Java 10+) for local variables when the type is obvious from the right-hand side
- Prefer `java.time` API over `Date`/`Calendar`
- Use `EnumSet`/`EnumMap` instead of `HashSet`/`HashMap` for enum keys

### Common Pitfalls
- Always override `hashCode()` when overriding `equals()`
- Do not compare strings with `==`; always use `.equals()`
- Beware of `ConcurrentModificationException` — do not modify collections during iteration
- Do not swallow exceptions in catch blocks; at minimum, log them
- Avoid `synchronized` blocks with broad scope; use `java.util.concurrent` utilities
- Close database connections, HTTP clients, and I/O streams explicitly in `finally` or try-with-resources

## React Conventions

### Project Structure
- Group by feature: `features/auth/`, `features/dashboard/` — each containing components, hooks, utils, and tests
- Shared UI primitives go in `components/ui/`; shared hooks in `hooks/`
- Co-locate tests, styles, and types with their component

### Component Patterns
- Use functional components exclusively; no class components in new code
- Prefer named exports: `export function UserCard()` over `export default`
- Keep components under 150 lines; extract sub-components when complexity grows
- Use `React.memo()` only when profiling shows unnecessary re-renders, not preemptively
- Props interfaces: define with `interface Props` in the same file, not inline

### State Management
- Local state: `useState` for simple values, `useReducer` for complex state logic
- Server state: use React Query / TanStack Query — never store API responses in global state
- Global client state: use Zustand or Context for truly global UI state (theme, auth, toasts)
- Avoid prop drilling beyond 2 levels; extract a context or use composition instead

### Hooks
- Custom hooks must start with `use` and handle one concern
- Never call hooks conditionally or inside loops
- Use `useCallback` for functions passed as props to memoized children; `useMemo` for expensive computations
- Clean up effects: return a cleanup function from `useEffect` for subscriptions, timers, and listeners

### Performance
- Lazy-load routes and heavy components with `React.lazy()` and `Suspense`
- Use virtualization (react-window, tanstack-virtual) for lists over 100 items
- Avoid creating new objects/arrays in render — hoist them or memoize
- Use the React DevTools Profiler to identify bottlenecks before optimizing

### Anti-Patterns to Avoid
- Do not use `useEffect` for state derivation — compute derived values during render
- Do not sync state between components with `useEffect` — lift state up or use a shared store
- Do not put API calls in `useEffect` directly — use a data fetching library
- Avoid index as key in lists where items can be reordered, added, or removed

## Django Conventions

### Project Structure
- Follow Django app convention: each feature is a Django app in `apps/{feature}/`
- App structure: `models.py`, `views.py`, `urls.py`, `serializers.py`, `admin.py`, `tests/`
- Settings: split into `settings/base.py`, `settings/dev.py`, `settings/prod.py`
- Templates: `templates/{app_name}/` per app or a shared `templates/` directory
- Static files: `static/` per app or a project-level `staticfiles/`
- Management commands: `apps/{feature}/management/commands/`

### Model Patterns
- Use explicit `related_name` on all ForeignKey and M2M fields
- Define `__str__` on every model for readable admin and debugging
- Add `class Meta` with `ordering`, `verbose_name`, and `db_table` where appropriate
- Use model managers for custom querysets: `objects = UserManager()`
- Use `UUIDField` as primary key for public-facing APIs to avoid sequential ID enumeration
- Add database indexes on fields used in filters and ordering

### View and URL Patterns
- Use class-based views (CBVs) for standard CRUD; function-based views for complex or one-off logic
- For APIs, use Django REST Framework: `ModelViewSet` for CRUD, `APIView` for custom endpoints
- URL naming: `app_name:action-resource` (e.g., `users:detail-user`)
- Always use `reverse()` or `{% url %}` for URL generation — never hardcode paths
- Apply permission classes at the view level, not in the URL config

### Serializer Patterns (DRF)
- Use `ModelSerializer` for standard CRUD; plain `Serializer` for custom input shapes
- Validate at the field level (`validate_email`) and object level (`validate`)
- Use `read_only_fields` to protect computed and auto-generated fields
- Use nested serializers sparingly — prefer flat responses with IDs and separate endpoints

### Security
- Never disable CSRF protection; use `@csrf_exempt` only for webhook endpoints with signature verification
- Use `django.contrib.auth` for authentication; extend `AbstractUser` for custom user models
- Set `AUTH_USER_MODEL` early — changing it later requires manual migration
- Use `SECRET_KEY` from environment variables; rotate periodically

### Anti-Patterns to Avoid
- Do not put business logic in views or serializers — use service functions or model methods
- Do not use raw SQL unless the ORM genuinely cannot express the query
- Do not create N+1 queries — use `select_related` (FK) and `prefetch_related` (M2M/reverse FK)
- Do not override `save()` for side effects — use signals or explicit service calls
- Do not import models at module level in signals — use string references

## Flask Conventions

### Project Structure
- Use the application factory pattern: `create_app()` in `app/__init__.py`
- Blueprints: `app/{feature}/` with `routes.py`, `models.py`, `services.py`, `schemas.py`
- Register blueprints with URL prefixes: `app.register_blueprint(users_bp, url_prefix='/api/users')`
- Configuration: `config.py` with `Development`, `Production`, `Testing` classes
- Extensions: initialize in `app/extensions.py` (db, migrate, login_manager), init in factory
- Templates: `app/templates/`; static: `app/static/`

### Route Patterns
- Use blueprints for every feature — never define routes on the main app object
- Decorate with specific methods: `@bp.route('/users', methods=['GET'])` or use `@bp.get('/users')`
- Return tuples for non-200 responses: `return jsonify(error='Not found'), 404`
- Use `flask.abort(404)` for quick error responses; register custom error handlers with `@app.errorhandler`
- Access request data via `request.json`, `request.args`, `request.form` — validate before use

### Request Validation
- Use Marshmallow or Pydantic for request/response schema validation
- Validate early in the route handler; return 400 with field-level error details
- Use `@expects_json` or custom decorators to enforce `Content-Type: application/json`
- Never trust `request.json` without validation — it can be any shape

### Database and Models
- Use Flask-SQLAlchemy with the application factory pattern
- Define models in `app/{feature}/models.py`; import in `app/models.py` for Alembic discovery
- Use Flask-Migrate (Alembic) for schema migrations — never modify the database manually
- Use `db.session.commit()` explicitly; configure autocommit/autoflush carefully
- Avoid lazy loading in API responses — use `joinedload` or `selectinload` to prevent N+1

### Error Handling
- Register global error handlers: `@app.errorhandler(404)`, `@app.errorhandler(Exception)`
- Return consistent JSON error responses: `{ "error": { "code": "NOT_FOUND", "message": "..." } }`
- Log exceptions with `app.logger.exception()` for full stack traces
- Never expose internal error details in production — use generic messages

### Anti-Patterns to Avoid
- Do not use the global `app` object — use the factory pattern and `current_app`
- Do not import the app instance in modules — use `current_app` proxy
- Do not put business logic in route handlers — delegate to service functions
- Do not use Flask's `g` object for data that should be passed explicitly
- Do not skip database migrations — manual schema changes cause drift

## FastAPI Conventions

### Project Structure
- Entry point: `app/main.py` with `FastAPI()` instance and router includes
- Routers: `app/routers/{resource}.py` using `APIRouter(prefix="/resources", tags=["resources"])`
- Models: `app/models/` for SQLAlchemy/Tortoise ORM models
- Schemas: `app/schemas/` for Pydantic request/response models
- Services: `app/services/` for business logic
- Dependencies: `app/dependencies.py` for shared dependency injection functions
- Configuration: `app/config.py` using Pydantic `BaseSettings`

### Pydantic Models
- Define separate schemas for create, update, and response: `UserCreate`, `UserUpdate`, `UserResponse`
- Use `model_config = ConfigDict(from_attributes=True)` for ORM model conversion
- Use `Field()` with `description`, `examples`, and validation constraints for OpenAPI docs
- Use `Annotated[str, Field(min_length=1, max_length=100)]` for reusable field types
- Never expose internal fields (password hashes, internal IDs) in response models

### Dependency Injection
- Use `Depends()` for shared logic: database sessions, auth, pagination, rate limiting
- Define dependencies as functions or classes with `__call__`
- Chain dependencies: `current_user = Depends(get_current_user)` which itself depends on `get_db`
- Use `yield` dependencies for cleanup (database session, temp files): `yield db; db.close()`
- Scope dependencies per-request by default; cache with `use_cache=True` in request scope

### Async Patterns
- Use `async def` for route handlers that perform I/O (database, HTTP, file)
- Use `def` (sync) for CPU-bound handlers — FastAPI runs them in a thread pool
- Use async database drivers (asyncpg, aiosqlite) with async SQLAlchemy or Tortoise ORM
- Use `httpx.AsyncClient` for outbound HTTP calls, not `requests`
- Use `BackgroundTasks` for fire-and-forget operations (email, logging)

### Error Handling
- Raise `HTTPException(status_code=404, detail="User not found")` for HTTP errors
- Register custom exception handlers with `@app.exception_handler(CustomError)`
- Use consistent error response shape: `{ "detail": "message" }` or custom schema
- Validate all input via Pydantic schemas — invalid input automatically returns 422

### Anti-Patterns to Avoid
- Do not use sync database drivers with async handlers — it blocks the event loop
- Do not put business logic in route handlers — delegate to service layer
- Do not use global mutable state — use dependency injection for per-request state
- Do not skip response model definitions — they filter sensitive data and generate docs
- Do not use `requests` library — use `httpx` for both sync and async HTTP clients

## Spring Boot Conventions

### Project Structure
- Follow package-by-feature: `com.company.app.{feature}` with controller, service, repository, model, dto
- Configuration: `src/main/resources/application.yml` with profile-specific overrides (`application-dev.yml`)
- Entry point: `@SpringBootApplication` class in the root package
- Shared code: `com.company.app.common` for exceptions, base classes, and utilities
- Database migrations: `src/main/resources/db/migration/` using Flyway or Liquibase

### Controller Patterns
- Use `@RestController` for APIs; `@Controller` for MVC views
- Map at class level: `@RequestMapping("/api/v1/users")` — method level: `@GetMapping`, `@PostMapping`
- Validate request bodies with `@Valid` and Jakarta Validation annotations on DTOs
- Return `ResponseEntity<T>` for explicit status codes; direct return for 200
- Use `@PathVariable`, `@RequestParam`, `@RequestBody` for input binding

### Service and Repository Patterns
- Service classes: `@Service` with constructor injection (no `@Autowired` on fields)
- Repositories: extend `JpaRepository<Entity, ID>` or `CrudRepository`
- Use `@Transactional` on service methods, not on repositories or controllers
- Read-only transactions: `@Transactional(readOnly = true)` for query methods
- Define custom queries with `@Query` annotation or query methods naming convention

### Dependency Injection
- Use constructor injection exclusively — never field injection (`@Autowired` on fields)
- If a class has only one constructor, `@Autowired` is optional (Spring auto-detects)
- Use `@Configuration` classes with `@Bean` methods for third-party library wiring
- Use profiles (`@Profile("dev")`) for environment-specific beans

### Error Handling
- Use `@RestControllerAdvice` for global exception handling
- Define domain exception hierarchy: `AppException -> NotFoundException, ValidationException`
- Map exceptions to HTTP responses with `@ExceptionHandler`
- Return consistent error response body: `{ timestamp, status, error, message, path }`
- Never expose stack traces in production responses

### Testing
- Unit tests: `@ExtendWith(MockitoExtension.class)` with `@Mock` and `@InjectMocks`
- Integration tests: `@SpringBootTest` with `@AutoConfigureMockMvc` and `MockMvc`
- Database tests: `@DataJpaTest` with embedded H2 or Testcontainers
- Use `@TestContainers` for integration tests against real databases

### Anti-Patterns to Avoid
- Do not inject `EntityManager` in controllers — use repositories and services
- Do not return JPA entities directly from controllers — use DTOs
- Do not use `@Autowired` on fields — use constructor injection
- Do not catch and re-throw exceptions without adding context
- Do not skip database migrations — use Flyway or Liquibase

## Testing Conventions

**Test Frameworks:** playwright,pytest,junit5,testng

### Test File Naming and Location
- Test files live alongside source files or in a parallel `tests/`/`__tests__` directory — follow the established project convention
- Name test files to match the module they test: `user-service.test.ts`, `test_user_service.py`, `UserServiceTest.java`
- Group integration tests separately from unit tests (e.g., `tests/integration/`, `tests/unit/`)

### Test Structure (AAA Pattern)
- Every test follows **Arrange / Act / Assert**:
  - **Arrange**: Set up test data, mocks, and preconditions
  - **Act**: Execute the single operation under test
  - **Assert**: Verify the expected outcome
- Separate the three sections with blank lines for readability
- Each test should have exactly one reason to fail — test one behavior per test function

### What to Test
- All public API methods and functions
- Business logic and domain rules
- Edge cases: empty inputs, boundary values, null/undefined, max/min values
- Error paths: invalid input, missing data, network failures, permission denied
- State transitions and side effects

### What NOT to Test
- Framework internals or third-party library behavior
- Private methods directly (test through the public interface)
- Trivial getters/setters with no logic
- Auto-generated code (ORM models, protobuf stubs)
- Implementation details that may change without affecting behavior

### Mocking Philosophy
- Mock external dependencies (HTTP clients, databases, file system, third-party APIs)
- Do NOT mock the unit under test or its direct collaborators (prefer real objects)
- Use dependency injection to make mocking straightforward
- Prefer fakes/stubs over complex mock frameworks when possible
- Assert on behavior (was the method called with correct args?) not implementation
- Reset mocks between tests to prevent state leakage

### Coverage Expectations
- Aim for 80%+ line coverage on business logic and domain code
- 100% coverage on critical paths (authentication, authorization, payment, data validation)
- Do not chase 100% coverage everywhere — diminishing returns on glue code and configuration
- Coverage gates in CI should block PRs that reduce coverage on changed files

### Integration vs Unit Test Boundaries
- **Unit tests**: fast, isolated, no I/O, no network, no database — run in milliseconds
- **Integration tests**: test real interactions between components (API routes, database queries, message queues)
- Integration tests use dedicated test databases/containers, not production-like data
- Run unit tests on every commit; run integration tests in CI pipeline
- Use test containers (Testcontainers, Docker Compose) for integration test infrastructure

### Test Quality
- Tests must be deterministic — no flaky tests; fix or quarantine immediately
- Tests must be independent — no reliance on execution order or shared mutable state
- Use descriptive test names that read as specifications: `should return 404 when user not found`
- Use test data builders or factories to reduce boilerplate setup
- Clean up test resources in teardown/afterEach hooks
