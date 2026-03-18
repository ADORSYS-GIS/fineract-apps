# Development Setup — fineract-apps

## Prerequisites

To build and run this project locally, you will need the following tools installed:

| Tool | Minimum Version | Installation |
|------|-----------------|--------------|
| Git | 2.40+ | [https://git-scm.com/](https://git-scm.com/) |
| Node.js | 20.x | [https://nodejs.org](https://nodejs.org) (or use [nvm](https://github.com/nvm-sh/nvm)) |
| pnpm | 10.24.0 | [https://pnpm.io/installation](https://pnpm.io/installation) |
| Java | 21 | [OpenJDK 21](https://openjdk.java.net/projects/jdk/21/) |
| Maven | 3.8+ | [https://maven.apache.org/](https://maven.apache.org/) |
| Docker | 24.x | [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop) |

## Environment Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/fineract-apps.git
cd fineract-apps
```

### 2. Install Dependencies
This is a monorepo with a Java backend and a TypeScript/React frontend.

**Frontend:**
Install all frontend dependencies using `pnpm`:
```bash
pnpm install
```

**Backend:**
Build all backend services and install dependencies using `Maven`:
```bash
./mvnw clean install
```

### 3. Configure Environment Variables
The project is a monorepo containing multiple frontend applications and backend services. Many of these require specific environment variables to run correctly.

**Frontend Applications:**
Most frontend applications in `frontend/` follow a similar pattern. They use `.env` files for environment variables. To get started, copy the example file and fill in the required values.

For example, for the `self-service-app`:
```bash
cp frontend/self-service-app/.env.example frontend/self-service-app/.env
```
Then, edit `frontend/self-service-app/.env` with the correct URIs for your local environment.

**Backend Services:**
Backend services are configured via `application.yml` files located in `src/main/resources`. These files use placeholders like `${ENV_VAR_NAME:default_value}` that can be replaced by environment variables.

For example, the `asset-service` uses variables for database connections, Redis, Keycloak, and Fineract integration. You can set these in your environment or in a run configuration in your IDE.

A comprehensive list of variables for `asset-service` can be found in `backend/asset-service/src/main/resources/application.yml`. Key variables include:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `REDIS_HOST`
- `KEYCLOAK_ISSUER_URI`
- `FINERACT_URL`

The `user-sync-service` uses a `.env` file. You can copy the example and customize it:
```bash
cp backend/user-sync-service/.env backend/user-sync-service/.env.local
```
Then, update `backend/user-sync-service/.env.local` with your Keycloak details.


### 4. Set Up Local Services
Some backend services depend on external services like databases and caches. These can be started easily using Docker Compose. Each service that needs backing services includes a `docker-compose.yml` file.

For example, to start the database, cache, and file storage for the `asset-service`:
```bash
cd backend/asset-service
docker-compose up -d
```

Similarly, for the `payment-gateway-service`:
```bash
cd backend/payment-gateway-service
docker-compose up -d
```
Check the individual service directories in `backend/` for their specific `docker-compose.yml` files.

### 5. Run Database Migrations
The backend services use [Flyway](https://flywaydb.org/) for database migrations. Migrations are located in the `src/main/resources/db/migration` directory of each service.

The migrations are applied automatically when the service starts up. There is no need to run a separate command.

## Running Locally

**Frontend:**
To run all frontend applications in development mode with hot-reloading:
```bash
pnpm dev
```
This will start each frontend app, and you can see the specific ports in the terminal output. Typically, they will be available at URLs like `http://localhost:3000`, `http://localhost:3001`, etc.

**Backend:**
Each backend service can be run individually. For example, to run the `asset-service`:
```bash
cd backend/asset-service
./mvnw spring-boot:run
```
The service will be available at `http://localhost:8083`. Check the `application.yml` file in each service directory for the correct port.

## Running Tests

**Frontend:**
Run all frontend tests using Jest:
```bash
pnpm test
```
To run tests with coverage:
```bash
pnpm test:coverage
```

**Backend:**
Run all backend unit and integration tests using Maven:
```bash
./mvnw test
```
This will run tests for all backend services. To run tests for a specific service, `cd` into the service directory and run the command from there.

## Linting and Formatting
This project uses [Biome](https://biomejs.dev/) for linting and formatting the frontend code.

To check for linting errors:
```bash
pnpm lint
```

To format the code:
```bash
pnpm format
```

To format and fix all auto-fixable linting errors:
```bash
pnpm fix
```

## Building for Production

**Frontend:**
To build all frontend applications for production:
```bash
pnpm build
```
The production-ready files will be placed in the `dist` directory of each frontend application.

**Backend:**
To build all backend services for production:
```bash
./mvnw clean package
```
This command will compile the code, run tests, and package each service into an executable JAR file in the `target` directory of each service's module.

## Deployment
This project uses a GitOps approach for deployment, automated with GitHub Actions.

The CI/CD pipeline is configured to:
1. Build Docker images for all frontend and backend applications on every push to `develop` and `main` branches.
2. Push the images to GitHub Container Registry (`ghcr.io`).
3. Trigger a deployment update in a separate GitOps repository, which is responsible for updating the cluster with the new image versions.

| Environment | Branch | URL | Deploy Method |
|-------------|--------|-----|---------------|
| Development | `develop` | TBD | Auto-deploy on merge |
| Staging | `main` | TBD | Auto-deploy on merge |
| Production | `main` + tag | TBD | Manual promotion from Staging |

## Troubleshooting

### Common Issues
| Issue | Solution |
|-------|----------|
| `pnpm` or `mvn` commands fail | Ensure you have installed the correct versions of all prerequisites as listed at the top of this document. Also, make sure you are in the correct directory when running a command (e.g., in the root for `pnpm` commands, or in a specific service directory for `mvn` commands). |
| Docker containers fail to start | Check that Docker Desktop is running and that you have sufficient resources allocated to it. Also, check for port conflicts on your local machine. |
