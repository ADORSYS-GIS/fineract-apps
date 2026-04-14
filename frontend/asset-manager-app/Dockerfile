# Build stage — context must be the monorepo root
FROM node:18-alpine AS builder
WORKDIR /app

# Enable pnpm via corepack (matches packageManager field in root package.json)
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

# Copy workspace manifests first so Docker can cache the install layer
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy shared packages needed by the app
COPY packages/config    packages/config
COPY packages/fineract-api packages/fineract-api
COPY packages/ui        packages/ui
COPY packages/i18n      packages/i18n

# Copy the app itself
COPY frontend/asset-manager-app frontend/asset-manager-app

# Install all workspace deps (frozen for reproducibility)
RUN pnpm install --frozen-lockfile

# Build @fineract-apps/ui (asset-manager-app imports it)
RUN pnpm --filter @fineract-apps/ui build

# Build the app
ARG COMMIT_SHA=unknown
ARG BUILD_TAG=local
RUN COMMIT_SHA=${COMMIT_SHA} BUILD_TAG=${BUILD_TAG} \
    pnpm --filter asset-manager-app build

# Runtime stage
FROM nginx:1.27-alpine
COPY --from=builder /app/frontend/asset-manager-app/dist /usr/share/nginx/html
COPY frontend/asset-manager-app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -sf http://localhost/ || exit 1
