# Kubernetes Manifests for Fineract Web App

This directory contains Kubernetes manifests for deploying the Fineract Web App to k3s.

## Files

- **deployment.yaml**: Deployment configuration with 2 replicas, health checks, and resource limits
- **service.yaml**: ClusterIP service exposing the web app on port 80
- **kustomization.yaml**: Kustomize configuration for easy customization

## Deployment with kubectl

### Prerequisites

1. Access to k3s cluster
2. Image available in GitHub Container Registry: `ghcr.io/guymoyo/web-app`
3. Namespace created: `fineract`

### Deploy

```bash
# Create namespace
kubectl create namespace fineract

# Apply manifests
kubectl apply -k k8s/

# Check deployment status
kubectl get deployments -n fineract
kubectl get pods -n fineract
kubectl get svc -n fineract
```

### Update Configuration

Edit `kustomization.yaml` to change environment variables:

```yaml
configMapGenerator:
  - name: web-app-config
    literals:
      - fineractApiUrl=https://your-actual-domain.com
      - fineractPlatformTenantId=your-tenant
```

Then apply:

```bash
kubectl apply -k k8s/
```

### Update Image Version

Edit `kustomization.yaml`:

```yaml
images:
  - name: ghcr.io/guymoyo/web-app
    newTag: v1.0.0  # Change to desired version
```

Then apply:

```bash
kubectl apply -k k8s/
```

## Deployment with ArgoCD

### Prerequisites

1. ArgoCD installed on k3s cluster
2. GitHub repository accessible by ArgoCD

### Create ArgoCD Application

Create a file `argocd-application.yaml` in your fineract-gitops repository:

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
      allowEmpty: false
    syncOptions:
      - CreateNamespace=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

Apply it:

```bash
kubectl apply -f argocd-application.yaml
```

### Verify Deployment

```bash
# Check ArgoCD application status
argocd app get fineract-web-app

# Check pods
kubectl get pods -n fineract

# Check logs
kubectl logs -f deployment/fineract-web-app -n fineract
```

## Configuration

### Environment Variables

The deployment uses these environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `fineractApiUrl` | Fineract API base URL | `https://your-domain.com` |
| `fineractPlatformTenantId` | Tenant identifier | `default` |
| `oauth2ProxyLogoutUrl` | Logout URL | `/oauth2/sign_out` |
| `defaultLanguage` | Default language | `en-US` |
| `sessionIdleTimeout` | Session timeout (ms) | `300000` |
| `allowServerSwitch` | Allow switching servers | `false` |

### Resources

**Requests** (guaranteed):
- Memory: 128Mi
- CPU: 100m

**Limits** (maximum):
- Memory: 256Mi
- CPU: 500m

Adjust these in `deployment.yaml` based on your needs.

### Replicas

Default: 2 replicas for high availability

Change in `deployment.yaml`:

```yaml
spec:
  replicas: 3  # Adjust as needed
```

## Health Checks

### Liveness Probe
- Path: `/health`
- Initial Delay: 10s
- Period: 30s
- Timeout: 5s
- Failure Threshold: 3

### Readiness Probe
- Path: `/health`
- Initial Delay: 5s
- Period: 10s
- Timeout: 3s
- Failure Threshold: 3

## Security

The deployment includes security best practices:

- Runs as non-root user (nginx user 101)
- No privilege escalation
- Drops all capabilities
- fsGroup set to nginx group
- imagePullPolicy: Always (ensures latest security patches)

## Scaling

### Manual Scaling

```bash
kubectl scale deployment fineract-web-app --replicas=5 -n fineract
```

### Horizontal Pod Autoscaler (HPA)

Create `hpa.yaml`:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: fineract-web-app-hpa
  namespace: fineract
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: fineract-web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

Apply:

```bash
kubectl apply -f hpa.yaml
```

## Monitoring

### View Logs

```bash
# All pods
kubectl logs -l app=fineract-web-app -n fineract --tail=100 -f

# Specific pod
kubectl logs fineract-web-app-xxxxx-yyy -n fineract -f
```

### Describe Pod

```bash
kubectl describe pod fineract-web-app-xxxxx-yyy -n fineract
```

### Port Forward (for testing)

```bash
kubectl port-forward svc/fineract-web-app 8080:80 -n fineract
```

Then access at http://localhost:8080

## Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl get pods -n fineract

# Check events
kubectl get events -n fineract --sort-by='.lastTimestamp'

# Describe deployment
kubectl describe deployment fineract-web-app -n fineract
```

### Image Pull Errors

Ensure GitHub Container Registry is accessible:

```bash
# Create image pull secret if needed
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GITHUB_TOKEN \
  -n fineract

# Add to deployment
kubectl patch serviceaccount default -n fineract \
  -p '{"imagePullSecrets": [{"name": "ghcr-secret"}]}'
```

### Health Check Failing

```bash
# Check health endpoint
kubectl exec -it fineract-web-app-xxxxx-yyy -n fineract -- wget -O- http://localhost/health

# Check nginx logs
kubectl logs fineract-web-app-xxxxx-yyy -n fineract
```

## Integration with nginx/oauth2-proxy

This deployment expects to be accessed through nginx with oauth2-proxy authentication. The service is ClusterIP only.

Your main nginx configuration should:
1. Proxy requests to `fineract-web-app.fineract.svc.cluster.local`
2. Include oauth2-proxy authentication
3. Forward authentication headers

See [AUTHENTICATION.md](../AUTHENTICATION.md) for complete nginx configuration.

## Cleanup

```bash
# Delete all resources
kubectl delete -k k8s/

# Or with ArgoCD
argocd app delete fineract-web-app
```
