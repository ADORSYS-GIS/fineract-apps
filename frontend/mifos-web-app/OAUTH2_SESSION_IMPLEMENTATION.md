# OAuth2 Session Management Implementation

## Overview

Complete implementation of session monitoring and logout functionality for the Angular web-app using OAuth2-Proxy authentication.

## Files Modified/Created

### 1. **NEW: `src/app/core/authentication/session-monitor.service.ts`**
Session monitoring service that:
- Detects 401 Unauthorized responses from API (session expired)
- Handles graceful redirect to OAuth2-Proxy login with return URL
- Clears local/session storage credentials
- Optional idle timeout monitoring (disabled by default)
- Tracks user activity (mouse, keyboard, click, scroll events)

**Key Features:**
- `startMonitoring(enableIdleTimeout)` - Start session monitoring
- `stopMonitoring()` - Stop all monitoring
- `handleSessionExpired(returnUrl)` - Handle 401 errors with redirect
- `isSessionExpiredError(error)` - Check if error is 401
- `onSessionExpired()` - Observable for session expiration events

**Configuration:**
- Idle timeout: 30 minutes (configurable)
- Check interval: 60 seconds
- Return URL preservation: Yes
- Storage cleanup: Yes (mifosXCredentials, mifosXOAuthTokenDetails)

### 2. **MODIFIED: `src/app/core/authentication/authentication.interceptor.ts`**
HTTP interceptor updated to:
- Import SessionMonitorService
- Catch 401 errors in HTTP response pipeline
- Call sessionMonitorService.handleSessionExpired() on 401
- Preserve existing tenant ID header logic
- Preserve two-factor authentication support

**Changes:**
```typescript
// Added imports
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SessionMonitorService } from './session-monitor.service';

// Added to intercept() method
return next.handle(request).pipe(
  catchError((error: HttpErrorResponse) => {
    if (this.sessionMonitorService.isSessionExpiredError(error)) {
      console.log('[AuthInterceptor] 401 detected, handling session expiration');
      this.sessionMonitorService.handleSessionExpired(request.url);
      return throwError(() => error);
    }
    return throwError(() => error);
  })
);
```

### 3. **MODIFIED: `src/app/core/shell/toolbar/toolbar.component.ts`**
Toolbar component updated to:
- Import SessionMonitorService
- Inject SessionMonitorService in constructor
- Call stopMonitoring() before logout
- Preserve existing Zitadel OIDC support

**Changes:**
```typescript
// Added import
import { SessionMonitorService } from '../../authentication/session-monitor.service';

// Added to constructor
private sessionMonitorService: SessionMonitorService

// Updated logout() method
logout() {
  // Stop session monitoring before logout
  this.sessionMonitorService.stopMonitoring();

  if (!environment.OIDC.oidcServerEnabled) {
    this.authenticationService.logout().subscribe(() =>
      this.router.navigate(['/login'], { replaceUrl: true })
    );
  } else {
    this.authService.logout();
  }
}
```

### 4. **MODIFIED: `src/app/core/authentication/authentication.service.ts`**
Authentication service updated to:
- Import SessionMonitorService
- Inject SessionMonitorService in constructor
- Start session monitoring on app initialization
- Monitor without idle timeout by default

**Changes:**
```typescript
// Added import
import { SessionMonitorService } from './session-monitor.service';

// Added to constructor
private sessionMonitorService: SessionMonitorService

// Added at end of constructor
this.sessionMonitorService.startMonitoring(false);
```

### 5. **UI - No changes required**
The logout button already exists in `toolbar.component.html` at lines 151-156:
```html
<button mat-menu-item (click)="logout()" id="logout" tabindex="0">
  <mat-icon>
    <fa-icon icon="sign-out-alt" size="sm"></fa-icon>
  </mat-icon>
  <span>{{ 'labels.menus.Sign Out' | translate }}</span>
</button>
```

### 6. **Core Module - No changes required**
SessionMonitorService uses `providedIn: 'root'` so it's automatically available.

## Authentication Flow

### Normal Login Flow
1. User redirected to OAuth2-Proxy (nginx ingress)
2. OAuth2-Proxy redirects to Keycloak
3. User authenticates with Keycloak
4. Keycloak issues JWT token to OAuth2-Proxy
5. OAuth2-Proxy sets session cookie and redirects back to app
6. Angular app loads, AuthenticationService constructor runs
7. SessionMonitorService.startMonitoring() called
8. AuthenticationService.fetchUserDetails() gets user permissions from Fineract
9. User can access protected resources

### Logout Flow
1. User clicks "Sign Out" button in toolbar menu
2. toolbar.component.logout() called
3. SessionMonitorService.stopMonitoring() stops monitoring
4. AuthenticationService.logout() called
5. Redirects to `/oauth2/sign_out`
6. OAuth2-Proxy clears session cookie
7. OAuth2-Proxy redirects to Keycloak logout
8. User logged out

### Session Expiration Flow
1. User making API request to Fineract
2. OAuth2-Proxy session expired (token expired)
3. nginx returns 401 Unauthorized
4. AuthenticationInterceptor catches 401 error
5. SessionMonitorService.handleSessionExpired() called
6. Local/session storage cleared
7. Redirect to `/oauth2/sign_in?rd=<current-path>`
8. OAuth2-Proxy initiates new login flow
9. After login, user returns to original page

### Optional Idle Timeout Flow (Currently Disabled)
To enable idle timeout monitoring, change:
```typescript
// In authentication.service.ts constructor
this.sessionMonitorService.startMonitoring(true); // Enable idle timeout
```

When enabled:
1. SessionMonitorService tracks user activity (mouse, keyboard, clicks, scrolls)
2. If no activity for 30 minutes, auto-logout
3. Redirects to OAuth2-Proxy login with return URL

## Testing Checklist

### 1. **Test Normal Login**
- [ ] Clear browser cookies and local storage
- [ ] Navigate to https://apps.dev.fineract.com
- [ ] Should redirect to Keycloak login
- [ ] Enter credentials: mifos/password
- [ ] Should redirect back to app
- [ ] Check browser console for "User details fetched successfully"
- [ ] Verify you can access dashboard

### 2. **Test Logout**
- [ ] While logged in, click user profile icon (top right)
- [ ] Click "Sign Out"
- [ ] Should redirect to `/oauth2/sign_out`
- [ ] Session cookie should be cleared
- [ ] Verify logged out of Keycloak
- [ ] Try accessing app again, should prompt for login

### 3. **Test 401 Session Expiration**
Option A - Wait for natural expiration (token TTL):
- [ ] Login and wait for OAuth2-Proxy session to expire
- [ ] Make API request (navigate to any page)
- [ ] Should see 401 in network tab
- [ ] Should auto-redirect to login
- [ ] After re-login, should return to original page

Option B - Force 401 error (for quick testing):
- [ ] Login successfully
- [ ] Open browser dev tools → Application → Cookies
- [ ] Delete `_oauth2_proxy` cookie
- [ ] Navigate to any page that makes API calls
- [ ] Should detect 401 and redirect to login
- [ ] After re-login, should return to original page

### 4. **Test Return URL Preservation**
- [ ] Login and navigate to specific page (e.g., /clients)
- [ ] Delete `_oauth2_proxy` cookie (force 401)
- [ ] Refresh page
- [ ] Should redirect to login with `rd=/clients` parameter
- [ ] Login again
- [ ] Should return to /clients page

### 5. **Test Console Logging**
- [ ] Open browser console
- [ ] Login and perform actions
- [ ] Look for these log messages:
  - `[SessionMonitor] Starting idle timeout monitoring` (if enabled)
  - `[AuthInterceptor] 401 detected, handling session expiration` (on 401)
  - `[SessionMonitor] Session expired, redirecting to login` (on 401)

### 6. **Test Storage Cleanup**
- [ ] Login successfully
- [ ] Open dev tools → Application → Local Storage / Session Storage
- [ ] Verify `mifosXCredentials` and `mifosXOAuthTokenDetails` exist
- [ ] Force 401 error (delete cookie)
- [ ] Make API request to trigger 401
- [ ] Check storage again - credentials should be cleared
- [ ] After redirect to login, storage should be clean

## Configuration Options

### Enable Idle Timeout
Edit `authentication.service.ts`:
```typescript
// Line 87
this.sessionMonitorService.startMonitoring(true); // Enable idle timeout
```

### Adjust Idle Timeout Duration
Edit `session-monitor.service.ts`:
```typescript
// Line 21-22
private readonly IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
private readonly IDLE_CHECK_INTERVAL_MS = 60 * 1000; // Check every minute
```

### Custom Storage Cleanup
Edit `session-monitor.service.ts` method `clearStoredCredentials()` to add/remove items.

## OAuth2-Proxy Configuration

The OAuth2-Proxy is configured in:
- **Deployment**: `apps/oauth2-proxy/base/deployment.yaml`
- **Secrets**: `environments/dev/oauth2-proxy-sealed-secret.yaml`

Key OAuth2-Proxy settings:
- Cookie timeout: Defined in OAuth2-Proxy config
- Cookie name: `_oauth2_proxy`
- Session store: Cookie-based
- Provider: Keycloak OIDC

## Keycloak Configuration

Keycloak realm settings:
- **Realm**: fineract
- **Issuer**: https://auth.dev.fineract.com/realms/fineract
- **Client ID**: fineract-web
- **Token URL**: https://auth.dev.fineract.com/realms/fineract/protocol/openid-connect/token
- **JWKS URL**: https://auth.dev.fineract.com/realms/fineract/protocol/openid-connect/certs

## Troubleshooting

### Issue: 401 errors not triggering redirect
**Check:**
1. Verify interceptor is registered in core.module.ts
2. Check browser console for error logs
3. Verify SessionMonitorService is injected properly
4. Check if error is actually 401 (not 403 or other)

### Issue: Redirect loop after login
**Check:**
1. Verify OAuth2-Proxy is forwarding Authorization header
2. Check Fineract logs for JWT validation errors
3. Verify Keycloak issuer URI matches Fineract config
4. Check ingress auth-snippet annotation

### Issue: Logout not clearing session
**Check:**
1. Verify `/oauth2/sign_out` endpoint is accessible
2. Check OAuth2-Proxy logs
3. Verify Keycloak session is being terminated
4. Check if cookie is being cleared properly

### Issue: User details not loading
**Check:**
1. Verify Fineract `/userdetails` endpoint is accessible
2. Check if Authorization header is being forwarded
3. Check Fineract logs for authentication errors
4. Verify user has proper roles in Keycloak

## Architecture Diagram

```
┌─────────────────┐
│   Angular App   │
│   (web-app)     │
└────────┬────────┘
         │
         │ HTTP Request
         │
    ┌────▼─────────────────────────────┐
    │  Authentication Interceptor      │
    │  - Add tenant ID header          │
    │  - Catch 401 errors              │
    └────┬─────────────────────────────┘
         │
         │ 401 Error
         │
    ┌────▼─────────────────────────────┐
    │  Session Monitor Service         │
    │  - Clear storage                 │
    │  - Redirect to /oauth2/sign_in   │
    └────┬─────────────────────────────┘
         │
         │ Redirect
         │
    ┌────▼─────────────────────────────┐
    │  Nginx Ingress + OAuth2-Proxy    │
    │  - Validate session cookie       │
    │  - Redirect to Keycloak if needed│
    └────┬─────────────────────────────┘
         │
         │ OIDC Flow
         │
    ┌────▼─────────────────────────────┐
    │  Keycloak                        │
    │  - Authenticate user             │
    │  - Issue JWT token               │
    └────┬─────────────────────────────┘
         │
         │ JWT Token
         │
    ┌────▼─────────────────────────────┐
    │  OAuth2-Proxy                    │
    │  - Set session cookie            │
    │  - Forward to app with token     │
    └────┬─────────────────────────────┘
         │
         │ Redirect back
         │
    ┌────▼─────────────────────────────┐
    │  Angular App                     │
    │  - Fetch user details            │
    │  - Start session monitoring      │
    └──────────────────────────────────┘
```

## Next Steps

1. **Test the implementation** using the checklist above
2. **Monitor production logs** for 401 errors and redirect issues
3. **Adjust timeouts** based on user feedback and security requirements
4. **Consider enabling idle timeout** if security policy requires it
5. **Add user notifications** before session expires (optional enhancement)

## Future Enhancements

1. **Pre-expiration Warning**: Show a modal 5 minutes before session expires
   - "Your session will expire in 5 minutes. Click here to extend."
   - Requires tracking OAuth2-Proxy cookie expiration time

2. **Background Token Refresh**: Automatically refresh tokens before expiry
   - OAuth2-Proxy handles this automatically
   - May need to configure refresh token rotation

3. **Activity-Based Extension**: Extend session on user activity
   - Currently handled by OAuth2-Proxy
   - Could add explicit refresh API call

4. **Multiple Tab Synchronization**: Sync logout across browser tabs
   - Use BroadcastChannel or localStorage events
   - Ensure all tabs logout when one logs out

5. **Session Analytics**: Track session duration and expiration events
   - Log to analytics service
   - Monitor for suspicious activity patterns
