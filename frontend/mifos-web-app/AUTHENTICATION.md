# Authentication Configuration

This application has been configured to use **nginx + oauth2-proxy + Keycloak** for authentication instead of the built-in authentication system.

## Architecture Overview

This application uses a **dual-nginx architecture** where authentication is handled at the Kubernetes Ingress layer, and this container's nginx only serves static files:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      Browser (User)                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│              Kubernetes Ingress NGINX (Authentication Layer)             │
│  - Validates all requests via OAuth2-Proxy                               │
│  - Routes /fineract-provider → Fineract API (HTTPS:8443)                │
│  - Routes / → Web-App nginx container (HTTP:80)                          │
│  - Adds Authorization: Bearer <token> header                             │
│  - Forwards X-Auth-Request-User, X-Auth-Request-Email, etc.              │
└─────────────────────────────────────────────────────────────────────────┘
                    ↓                                   ↓
        ┌───────────────────────┐       ┌──────────────────────────────────┐
        │  Fineract API         │       │  Web-App nginx (this container)  │
        │  (Port 8443 HTTPS)    │       │  (Port 80 HTTP)                  │
        │  - Business logic     │       │  - Serves static Angular files   │
        │  - Validates tokens   │       │  - SPA routing (fallback to      │
        │                       │       │    index.html)                   │
        └───────────────────────┘       │  - Does NOT proxy API requests   │
                                        └──────────────────────────────────┘
```

### Key Points:

1. **Two Separate nginx Instances:**
   - **Ingress NGINX** (Kubernetes): Handles authentication, routing, and API proxying
   - **Container NGINX** (this app): Only serves the Angular static files

2. **API Routing:**
   - API calls from the browser go **directly to Ingress NGINX**, not through this container
   - This container's nginx does **NOT** proxy API requests
   - The `location /fineract-provider/` in nginx.conf returns 404 (should never be reached)

3. **Authentication Flow:**
   - All requests (API and frontend) are authenticated at the **Ingress layer**
   - OAuth2-Proxy validates sessions with Keycloak
   - Headers are added by Ingress NGINX before routing to backends
   - This Angular app assumes all users are pre-authenticated

4. **Separate Ingress Resources:**
   - `fineract-oauth2-protected`: Routes `/fineract-provider` to Fineract API (HTTPS backend)
   - `fineract-web-app-protected`: Routes `/` to this web-app (HTTP backend)
   - Split is necessary because backends use different protocols

## Changes Made

### 1. Frontend Authentication Disabled

The following changes were made to disable frontend authentication:

- **AuthenticationGuard** (`src/app/core/authentication/authentication.guard.ts`): Always returns `true` - all users reaching the app are pre-authenticated
- **AuthenticationService** (`src/app/core/authentication/authentication.service.ts`):
  - `isAuthenticated()` always returns `true`
  - `logout()` redirects to `/oauth2/sign_out`
  - Constructor initializes with authenticated state
- **AuthenticationInterceptor** (`src/app/core/authentication/authentication.interceptor.ts`): No longer adds Authorization headers (nginx handles this)
- **Environment configs**: OAuth and OIDC flags set to `false`

### 2. Container Nginx Configuration

A custom nginx configuration (`nginx.conf`) has been created that:

- **Serves the Angular SPA** (static files only)
- **Handles SPA routing** (fallback to index.html for client-side routes)
- **Does NOT handle API proxying** (API requests are routed by Ingress NGINX)
- **Does NOT add authentication headers** (headers are added by Ingress NGINX)
- Provides health check endpoint at `/health`
- Optimizes static asset caching
- Enables gzip compression

**Important:** This nginx configuration is for the **container only**. The actual authentication and API routing is handled by the **Kubernetes Ingress NGINX** at `/Users/guymoyo/dev/fineract-gitops/apps/ingress/base/ingress.yaml`

### 3. Docker Configuration

The `Dockerfile` has been updated to:

- Copy custom nginx configuration
- Add health check endpoint
- Include proper labels for GHCR
- Support multi-arch builds (amd64, arm64)

### 4. GitHub Actions Workflow

A new workflow (`.github/workflows/ghcr-publish.yml`) publishes Docker images to GitHub Container Registry:

- **Registry**: `ghcr.io/guymoyo/web-app`
- **Triggers**: Push to `main`, `dev` branches or version tags
- **Tags**:
  - Branch name (e.g., `main`, `dev`)
  - Commit SHA (e.g., `main-abc1234`)
  - Semver for tags (e.g., `v1.2.3`, `1.2`, `1`)
  - `latest` for main branch
- **Platforms**: linux/amd64, linux/arm64

## Deployment Guide

### Prerequisites

Your infrastructure must have:

1. **Keycloak** configured with a realm and client
2. **oauth2-proxy** configured to authenticate with Keycloak
3. **nginx** (main instance) configured to:
   - Protect routes with oauth2-proxy
   - Forward authentication headers
   - Proxy API requests to Fineract backend

### Required nginx Configuration (Main Instance)

Your main nginx configuration should include:

```nginx
# Upstream for oauth2-proxy
upstream oauth2_proxy {
    server oauth2-proxy:4180;
}

# Upstream for Angular frontend
upstream frontend {
    server web-app:80;
}

# Upstream for Fineract backend
upstream fineract_api {
    server fineract-server:8443;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # OAuth2 Proxy authentication endpoint
    location = /oauth2/auth {
        internal;
        proxy_pass http://oauth2_proxy;
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
        proxy_set_header X-Original-URI $request_uri;
    }

    # OAuth2 Proxy callback and sign-out
    location /oauth2/ {
        proxy_pass http://oauth2_proxy;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Scheme $scheme;
        proxy_set_header X-Auth-Request-Redirect $request_uri;
    }

    # Fineract API - requires authentication
    location /fineract-provider/api/ {
        auth_request /oauth2/auth;
        auth_request_set $user $upstream_http_x_auth_request_user;
        auth_request_set $email $upstream_http_x_auth_request_email;
        auth_request_set $token $upstream_http_x_auth_request_access_token;

        proxy_set_header X-Auth-Request-User $user;
        proxy_set_header X-Auth-Request-Email $email;
        proxy_set_header X-Auth-Request-Access-Token $token;
        proxy_set_header Authorization "Bearer $token";

        proxy_pass https://fineract_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend application - requires authentication
    location / {
        auth_request /oauth2/auth;
        auth_request_set $user $upstream_http_x_auth_request_user;
        auth_request_set $email $upstream_http_x_auth_request_email;
        auth_request_set $token $upstream_http_x_auth_request_access_token;

        proxy_set_header X-Auth-Request-User $user;
        proxy_set_header X-Auth-Request-Email $email;
        proxy_set_header X-Auth-Request-Access-Token $token;

        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### oauth2-proxy Configuration

Example oauth2-proxy configuration:

```bash
OAUTH2_PROXY_PROVIDER=keycloak-oidc
OAUTH2_PROXY_CLIENT_ID=your-client-id
OAUTH2_PROXY_CLIENT_SECRET=your-client-secret
OAUTH2_PROXY_REDIRECT_URL=https://your-domain.com/oauth2/callback
OAUTH2_PROXY_OIDC_ISSUER_URL=https://keycloak.example.com/realms/your-realm
OAUTH2_PROXY_COOKIE_SECRET=<generate-with-python-or-openssl>
OAUTH2_PROXY_EMAIL_DOMAINS=*
OAUTH2_PROXY_UPSTREAMS=static://202
OAUTH2_PROXY_COOKIE_SECURE=true
OAUTH2_PROXY_PASS_ACCESS_TOKEN=true
OAUTH2_PROXY_PASS_USER_HEADERS=true
OAUTH2_PROXY_SET_XAUTHREQUEST=true
```

### ArgoCD Application

Example ArgoCD application manifest:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: fineract-web-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/guymoyo/web-app
    targetRevision: main
    path: k8s  # Create this directory with Kubernetes manifests
  destination:
    server: https://kubernetes.default.svc
    namespace: fineract
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

### Kubernetes Deployment Example

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fineract-web-app
  namespace: fineract
spec:
  replicas: 2
  selector:
    matchLabels:
      app: fineract-web-app
  template:
    metadata:
      labels:
        app: fineract-web-app
    spec:
      containers:
      - name: web-app
        image: ghcr.io/guymoyo/web-app:latest
        ports:
        - containerPort: 80
        env:
        - name: fineractApiUrl
          value: "https://your-domain.com"
        - name: fineractPlatformTenantId
          value: "default"
        - name: oauth2ProxyLogoutUrl
          value: "/oauth2/sign_out"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: fineract-web-app
  namespace: fineract
spec:
  selector:
    app: fineract-web-app
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

## Building and Publishing

### Local Build

```bash
# Build the Docker image
docker build -t ghcr.io/guymoyo/web-app:local .

# Run locally
docker run -p 8080:80 \
  -e fineractApiUrl=https://your-fineract-api.com \
  -e fineractPlatformTenantId=default \
  ghcr.io/guymoyo/web-app:local
```

### GitHub Actions (Automatic)

Images are automatically built and pushed to GHCR when you:

1. Push to `main` or `dev` branch
2. Create a version tag (e.g., `v1.0.0`)

The workflow requires the `packages: write` permission, which is automatically granted to GitHub Actions.

### Pull Image

```bash
# Authenticate with GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull the image
docker pull ghcr.io/guymoyo/web-app:latest
```

## Environment Variables

The application supports runtime configuration via environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `fineractApiUrl` | Fineract API base URL | `window.location.origin` |
| `fineractPlatformTenantId` | Tenant identifier | `default` |
| `oauth2ProxyLogoutUrl` | oauth2-proxy logout URL | `/oauth2/sign_out` |
| `defaultLanguage` | Default language | `en-US` |
| `sessionIdleTimeout` | Session timeout in ms | `300000` (5 min) |

## Logout Flow

When users click logout:

1. Angular calls `AuthenticationService.logout()`
2. User is redirected to `/oauth2/sign_out`
3. oauth2-proxy clears the session cookie
4. oauth2-proxy redirects to Keycloak logout endpoint
5. Keycloak clears the SSO session
6. User is redirected to the login page

## Security Considerations

1. **No credentials in frontend**: All authentication is handled by nginx/oauth2-proxy
2. **Token forwarding**: nginx forwards oauth2-proxy tokens to Fineract API
3. **Headers validation**: Fineract backend should validate tokens from headers
4. **Session timeout**: Configure appropriate session timeouts in oauth2-proxy
5. **HTTPS only**: Always use HTTPS in production
6. **Cookie security**: Set `secure`, `httpOnly`, and `sameSite` flags on cookies

## Troubleshooting

### Authentication Loop

If users get stuck in an authentication loop:

1. Check oauth2-proxy logs
2. Verify Keycloak client configuration
3. Ensure redirect URLs are correctly configured
4. Check cookie domain settings

### API Calls Failing

If API calls return 401/403:

1. Verify nginx is forwarding authentication headers
2. Check Fineract backend token validation
3. Ensure oauth2-proxy is passing tokens correctly
4. Review nginx logs for header values

### Logout Not Working

If logout doesn't work:

1. Verify `/oauth2/sign_out` is accessible
2. Check oauth2-proxy logout redirect configuration
3. Ensure Keycloak end_session_endpoint is configured
4. Review browser developer tools for redirect chain

## References

- [oauth2-proxy Documentation](https://oauth2-proxy.github.io/oauth2-proxy/)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [nginx Authentication](https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-subrequest-authentication/)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)

## Support

For issues related to:

- **Frontend application**: Create an issue in this repository
- **Authentication setup**: Review the documentation above or consult your DevOps team
- **Fineract API**: Refer to the Fineract documentation
- **Infrastructure**: Contact your platform administrator
