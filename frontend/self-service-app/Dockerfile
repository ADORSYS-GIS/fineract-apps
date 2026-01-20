# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml* ./
COPY packages/ ./packages/

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY frontend/self-service-app/ ./frontend/self-service-app/

# Build arguments for environment configuration
ARG VITE_OIDC_AUTHORITY
ARG VITE_OIDC_CLIENT_ID
ARG VITE_OIDC_REDIRECT_URI
ARG VITE_OIDC_POST_LOGOUT_URI
ARG VITE_API_BASE_URL
ARG VITE_OTEL_EXPORTER_OTLP_ENDPOINT
ARG VITE_APP_VERSION

# Set environment variables for build
ENV VITE_OIDC_AUTHORITY=$VITE_OIDC_AUTHORITY
ENV VITE_OIDC_CLIENT_ID=$VITE_OIDC_CLIENT_ID
ENV VITE_OIDC_REDIRECT_URI=$VITE_OIDC_REDIRECT_URI
ENV VITE_OIDC_POST_LOGOUT_URI=$VITE_OIDC_POST_LOGOUT_URI
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_OTEL_EXPORTER_OTLP_ENDPOINT=$VITE_OTEL_EXPORTER_OTLP_ENDPOINT
ENV VITE_APP_VERSION=$VITE_APP_VERSION

# Build the application
WORKDIR /app/frontend/self-service-app
RUN pnpm build

# Production stage
FROM nginx:alpine AS production

# Add non-root user
RUN addgroup -g 101 -S nginx && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx || true

# Copy built files
COPY --from=builder /app/frontend/self-service-app/dist /usr/share/nginx/html

# Copy nginx config template
COPY frontend/self-service-app/nginx.conf /etc/nginx/nginx.conf

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
