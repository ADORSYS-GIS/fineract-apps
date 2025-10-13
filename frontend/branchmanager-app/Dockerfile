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
COPY packages/fineract-api/package.json packages/fineract-api/fineract.json ./packages/fineract-api/
COPY packages/config/package.json ./packages/config/
# We copy package files for other apps even though we are only building the branchmanager-app
# to ensure `pnpm install` can resolve the full workspace dependency tree.
COPY frontend/branchmanager-app/package.json ./frontend/branchmanager-app/
COPY frontend/account-manager-app/package.json ./frontend/account-manager-app/
COPY frontend/cashier-app/package.json ./frontend/cashier-app/

# This command installs dependencies for the ENTIRE workspace, but skips lifecycle scripts for now.
RUN pnpm install --frozen-lockfile --ignore-scripts

# Now that dependencies are installed, copy the entire source code (including the scripts themselves).
COPY . .

# Now, run the lifecycle scripts that were skipped.
# This ensures all binaries and files are present before scripts are executed.
RUN pnpm run postinstall

# Finally, build the application.
RUN pnpm --filter branchmanager-app... build

# Stage 2: Serve the static files with Nginx
FROM nginx:1.28.0-alpine3.21
COPY --from=build /app/frontend/branchmanager-app/dist /usr/share/nginx/html/branchmanager
COPY frontend/branchmanager-app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]