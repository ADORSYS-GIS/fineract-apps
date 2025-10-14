# Stage 1: Build the React application within the pnpm monorepo
FROM node:20.19.5-alpine AS build

WORKDIR /app
RUN npm install -g pnpm
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY package.json ./
COPY packages/ui/package.json ./packages/ui/
COPY packages/fineract-api/package.json packages/fineract-api/fineract.json ./packages/fineract-api/
COPY packages/config/package.json ./packages/config/
COPY frontend/branchmanager-app/package.json ./frontend/branchmanager-app/
COPY frontend/account-manager-app/package.json ./frontend/account-manager-app/
COPY frontend/cashier-app/package.json ./frontend/cashier-app/

# This command installs dependencies for the ENTIRE workspace, but skips lifecycle scripts for now.
RUN pnpm install --frozen-lockfile --ignore-scripts

# Now that dependencies are installed, copy the entire source code (including the scripts themselves).
COPY . .
RUN pnpm run postinstall

# Finally, build the application.
RUN pnpm --filter account-manager-app... build

# Stage 2: Serve the static files with Nginx
FROM nginx:1.28.0-alpine3.21
COPY --from=build /app/frontend/account-manager-app/dist /usr/share/nginx/html/account
COPY frontend/account-manager-app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]