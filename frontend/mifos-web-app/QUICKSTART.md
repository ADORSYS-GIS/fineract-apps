# Quick Start Guide

This guide will help you get the Fineract Web App deployed to your k3s cluster with ArgoCD.

## Prerequisites

- ✅ k3s cluster running
- ✅ ArgoCD installed on k3s
- ✅ Keycloak configured with a realm and client
- ✅ oauth2-proxy configured
- ✅ nginx ingress controller installed
- ✅ GitHub account with access to this repository

## Step 1: Fork and Clone Repository

```bash
# Clone your fork
git clone https://github.com/guymoyo/web-app.git
cd web-app
```

## Step 2: Review and Customize Configuration

Edit `k8s/kustomization.yaml` to match your environment:

```yaml
configMapGenerator:
  - name: web-app-config
    literals:
      - fineractApiUrl=https://your-actual-domain.com  # Change this
      - fineractPlatformTenantId=default               # Change if needed
      - oauth2ProxyLogoutUrl=/oauth2/sign_out
      - defaultLanguage=en-US
      - sessionIdleTimeout=300000
```

## Step 3: Build and Push Docker Image

Option A: **Push to GitHub to trigger automatic build**

```bash
# Commit your changes
git add .
git commit -m "feat: configure for my environment"
git push origin main
```

GitHub Actions will automatically build and push the image to `ghcr.io/guymoyo/web-app:latest`

Option B: **Build and push manually**

```bash
# Build locally
docker build -t ghcr.io/guymoyo/web-app:latest .

# Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u guymoyo --password-stdin

# Push
docker push ghcr.io/guymoyo/web-app:latest
```

## Step 4: Make Image Public or Create Pull Secret

### Option A: Make Image Public (Easier)

1. Go to https://github.com/users/guymoyo/packages/container/web-app/settings
2. Scroll to "Danger Zone"
3. Click "Change visibility"
4. Select "Public"

### Option B: Create Image Pull Secret (More Secure)

```bash
# Create GitHub Personal Access Token with read:packages scope
# Then create the secret:

kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=guymoyo \
  --docker-password=YOUR_GITHUB_TOKEN \
  --namespace=fineract

# Update deployment.yaml to use the secret:
kubectl patch serviceaccount default -n fineract \
  -p '{"imagePullSecrets": [{"name": "ghcr-secret"}]}'
```

## Step 5: Deploy with ArgoCD

### Create ArgoCD Application

Create a file `fineract-web-app.yaml` in your fineract-gitops repo:

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
    path: k8s
  destination:
    server: https://kubernetes.default.svc
    namespace: fineract
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

Apply it:

```bash
kubectl apply -f fineract-web-app.yaml
```

## Step 6: Verify Deployment

```bash
# Check ArgoCD
argocd app get fineract-web-app
argocd app sync fineract-web-app  # If not auto-synced

# Check Kubernetes
kubectl get pods -n fineract
kubectl get svc -n fineract

# Check logs
kubectl logs -l app=fineract-web-app -n fineract --tail=50
```

Expected output:

```
NAME                                  READY   STATUS    RESTARTS   AGE
fineract-web-app-xxxxxxxxx-xxxxx     1/1     Running   0          2m
fineract-web-app-xxxxxxxxx-yyyyy     1/1     Running   0          2m
```

## Step 7: Configure nginx Ingress

Your main nginx needs to proxy traffic to the web app. Example configuration:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: fineract-web-app
  namespace: fineract
  annotations:
    nginx.ingress.kubernetes.io/auth-url: "http://oauth2-proxy.oauth2-proxy.svc.cluster.local/oauth2/auth"
    nginx.ingress.kubernetes.io/auth-signin: "https://your-domain.com/oauth2/start?rd=$escaped_request_uri"
    nginx.ingress.kubernetes.io/auth-response-headers: "X-Auth-Request-User,X-Auth-Request-Email,X-Auth-Request-Access-Token"
spec:
  ingressClassName: nginx
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: fineract-web-app
            port:
              number: 80
  tls:
  - hosts:
    - your-domain.com
    secretName: tls-secret
```

Apply:

```bash
kubectl apply -f ingress.yaml
```

## Step 8: Test the Application

1. Open browser and navigate to your domain
2. You should be redirected to Keycloak for authentication
3. After successful login, you should see the Fineract Web App
4. Test logout by clicking the logout button

### Verify Authentication Flow

```bash
# Check oauth2-proxy logs
kubectl logs -l app=oauth2-proxy -n oauth2-proxy --tail=50

# Check nginx logs
kubectl logs -l app.kubernetes.io/name=ingress-nginx -n ingress-nginx --tail=50

# Check web-app logs
kubectl logs -l app=fineract-web-app -n fineract --tail=50
```

## Step 9: Monitor and Maintain

### View Application in ArgoCD UI

```bash
# Port forward ArgoCD (if not already exposed)
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

Open https://localhost:8080 and login with username `admin` and the password from above.

### Update Application

To update the application:

```bash
# Make changes to code
git add .
git commit -m "feat: add new feature"
git push origin main

# GitHub Actions will build new image
# ArgoCD will automatically sync (if automated sync is enabled)
# Or manually sync:
argocd app sync fineract-web-app
```

## Common Issues

### Issue: Pods stuck in ImagePullBackOff

**Solution**: Make image public or create image pull secret (see Step 4)

```bash
kubectl describe pod fineract-web-app-xxxxx -n fineract
```

### Issue: Pods CrashLoopBackOff

**Solution**: Check logs for errors

```bash
kubectl logs fineract-web-app-xxxxx -n fineract
```

Common causes:
- Invalid environment variables
- nginx configuration error
- Missing assets

### Issue: Can't access application (404 or 502)

**Solution**: Check ingress and service

```bash
# Check service endpoints
kubectl get endpoints fineract-web-app -n fineract

# Check ingress
kubectl describe ingress fineract-web-app -n fineract

# Port forward to test directly
kubectl port-forward svc/fineract-web-app 8080:80 -n fineract
# Open http://localhost:8080
```

### Issue: Authentication loop

**Solution**: Check oauth2-proxy configuration

```bash
# Check oauth2-proxy logs
kubectl logs -l app=oauth2-proxy -n oauth2-proxy --tail=100

# Verify Keycloak redirect URLs include:
# https://your-domain.com/oauth2/callback
```

### Issue: API calls failing (401/403)

**Solution**: Verify nginx is forwarding auth headers

```bash
# Check nginx configuration includes:
nginx.ingress.kubernetes.io/auth-response-headers: "X-Auth-Request-User,X-Auth-Request-Email,X-Auth-Request-Access-Token"
```

## Next Steps

1. ✅ **Configure monitoring**: Set up Prometheus/Grafana for application monitoring
2. ✅ **Set up logging**: Configure log aggregation (ELK, Loki, etc.)
3. ✅ **Configure backups**: Set up Velero or similar for cluster backups
4. ✅ **Enable auto-scaling**: Configure HPA (see k8s/README.md)
5. ✅ **Security hardening**: Review and apply security policies
6. ✅ **Performance tuning**: Adjust resource limits based on usage

## Getting Help

- **Documentation**: See [AUTHENTICATION.md](./AUTHENTICATION.md) for detailed setup
- **Kubernetes manifests**: See [k8s/README.md](./k8s/README.md) for deployment details
- **Implementation details**: See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **Issues**: Create an issue at https://github.com/guymoyo/web-app/issues

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Internet                                 │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │  nginx Ingress   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  oauth2-proxy    │
                    │  + Keycloak      │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
   ┌──────────────────┐          ┌──────────────────┐
   │  fineract-web-app│          │  fineract-server │
   │  (This repo)     │──────────│  (Backend API)   │
   │  Port: 80        │   API    │  Port: 8443      │
   └──────────────────┘  Calls   └──────────────────┘

         Running in k3s cluster managed by ArgoCD
```

---

**Congratulations!** Your Fineract Web App should now be running with nginx + oauth2-proxy + Keycloak authentication! 🎉
