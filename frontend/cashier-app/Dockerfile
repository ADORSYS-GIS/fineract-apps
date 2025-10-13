# Stage 1: Build the React application within the pnpm monorepo
FROM node:20.19.5-alpine AS build

WORKDIR /app
RUN npm install -g pnpm

# Copy all package.json files to leverage Docker's layer caching.
# This is a monorepo optimization: if only source code changes,
# we don't need to re-run `pnpm install`.
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY package.json ./
COPY packages/ui/package.json ./packages/ui/
COPY packages/fineract-api/package.json ./packages/fineract-api/
COPY packages/config/package.json ./packages/config/
# We copy package files for other apps even though we are only building the cashier-app
# to ensure `pnpm install` can resolve the full workspace dependency tree.
COPY frontend/branchmanager-app/package.json ./frontend/branchmanager-app/
COPY frontend/account-manager-app/package.json ./frontend/account-manager-app/
COPY frontend/cashier-app/package.json ./frontend/cashier-app/

# This command installs dependencies for the ENTIRE workspace.
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter cashier-app... build

# Stage 2: Serve the static files with Nginx
FROM nginx:1.28.0-alpine3.21
COPY --from=build /app/frontend/cashier-app/dist /usr/share/nginx/html/cashier
COPY frontend/cashier-app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]