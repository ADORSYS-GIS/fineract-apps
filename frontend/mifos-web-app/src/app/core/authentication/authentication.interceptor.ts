/** Angular Imports */
import { Injectable } from "@angular/core";
import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpErrorResponse,
} from "@angular/common/http";

/** rxjs Imports */
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

/** Custom Imports */
import { environment } from "../../../environments/environment";
import { SettingsService } from "app/settings/settings.service";
import { SessionMonitorService } from "./session-monitor.service";

/** Http request (default) options headers. */
const httpOptions: { headers: { [key: string]: string } } = {
	headers: {
		"Fineract-Platform-TenantId": environment.fineractPlatformTenantId,
	},
};

/** Authorization header. */
const authorizationHeader = "Authorization";
const authorizationTenantHeader = "Fineract-Platform-TenantId";
/** Two factor access token header. */
const twoFactorAccessTokenHeader = "Fineract-Platform-TFA-Token";

/**
 * Http Request interceptor to set the request headers.
 * Note: Authorization is handled by nginx + oauth2-proxy, so no auth headers are added here.
 * nginx will forward the authentication to the Fineract backend.
 *
 * Also handles 401 Unauthorized errors by redirecting to OAuth2-Proxy login.
 */
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
	constructor(
		private settingsService: SettingsService,
		private sessionMonitorService: SessionMonitorService,
	) {}

	/**
	 * Intercepts a Http request and sets the request headers.
	 * Only sets tenant ID header - authentication is handled by nginx/oauth2-proxy.
	 * Also handles 401 errors by triggering session expiration flow.
	 */
	intercept(
		request: HttpRequest<any>,
		next: HttpHandler,
	): Observable<HttpEvent<any>> {
		if (this.settingsService.tenantIdentifier) {
			httpOptions.headers["Fineract-Platform-TenantId"] =
				this.settingsService.tenantIdentifier;
		}
		// Note: We don't add Authorization header here - nginx/oauth2-proxy handles authentication
		request = request.clone({ setHeaders: httpOptions.headers });

		return next.handle(request).pipe(
			catchError((error: HttpErrorResponse) => {
				// Handle 401 Unauthorized - session expired
				if (this.sessionMonitorService.isSessionExpiredError(error)) {
					console.log(
						"[AuthInterceptor] 401 detected, handling session expiration",
					);
					this.sessionMonitorService.handleSessionExpired(request.url);
					// Return error observable to prevent further processing
					return throwError(() => error);
				}
				// For other errors, just pass them through
				return throwError(() => error);
			}),
		);
	}

	/**
	 * Sets the two factor access token header.
	 * @param {string} twoFactorAccessToken Two factor access token.
	 */
	setTwoFactorAccessToken(twoFactorAccessToken: string) {
		httpOptions.headers[twoFactorAccessTokenHeader] = twoFactorAccessToken;
	}

	/**
	 * Removes the two factor access token header.
	 */
	removeTwoFactorAuthorization() {
		delete httpOptions.headers[twoFactorAccessTokenHeader];
	}
}
