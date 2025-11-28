/** Angular Imports */
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";

/** rxjs Imports */
import { BehaviorSubject, Observable, of } from "rxjs";
import { map } from "rxjs/operators";

/** Custom Services */
import { AlertService } from "../alert/alert.service";

/** Custom Interceptors */
import { AuthenticationInterceptor } from "./authentication.interceptor";

/** Custom Services */
import { SessionMonitorService } from "./session-monitor.service";
import { RolePermissionMapperService } from "./role-permission-mapper.service";

/** Environment Configuration */
import { environment } from "../../../environments/environment";

/** Custom Models */
import { LoginContext } from "./login-context.model";
import { Credentials } from "./credentials.model";
import { OAuth2Token } from "./o-auth2-token.model";

/**
 * Authentication workflow.
 */
@Injectable()
export class AuthenticationService {
	changePassword(userId: string, passwordObj: any) {
		return this.http.put(`/users/${userId}`, passwordObj);
	}
	// User logged in boolean
	private userLoggedIn: boolean;
	private userLoggedIn$: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(false);
	public readonly isAuthenticated$ = this.userLoggedIn$.asObservable();

	/** Denotes whether the user credentials should persist through sessions. */
	private rememberMe: boolean;
	/**
	 * Denotes the type of storage:
	 *
	 * Session Storage: User credentials should not persist through sessions.
	 *
	 * Local Storage: User credentials should persist through sessions.
	 */
	private storage: any;
	/** User credentials. */

	private credentials: Credentials;
	private dialogShown = false;
	/** Key to store credentials in storage. */
	private credentialsStorageKey = "mifosXCredentials";
	/** Key to store oauth token details in storage. */
	private oAuthTokenDetailsStorageKey = "mifosXOAuthTokenDetails";
	/** Key to store two factor authentication token in storage. */
	private twoFactorAuthenticationTokenStorageKey =
		"mifosXTwoFactorAuthenticationToken";

	/**
	 * Initializes the authentication service.
	 * With nginx/oauth2-proxy authentication, the user is always considered authenticated
	 * since authentication happens at the proxy layer before reaching this app.
	 * @param {HttpClient} http Http Client to send requests.
	 * @param {AlertService} alertService Alert Service.
	 * @param {AuthenticationInterceptor} authenticationInterceptor Authentication Interceptor.
	 * @param {SessionMonitorService} sessionMonitorService Session Monitor Service.
	 * @param {RolePermissionMapperService} rolePermissionMapper Role Permission Mapper Service.
	 */
	constructor(
		private http: HttpClient,
		private alertService: AlertService,
		private authenticationInterceptor: AuthenticationInterceptor,
		private sessionMonitorService: SessionMonitorService,
		private rolePermissionMapper: RolePermissionMapperService,
	) {
		// Authentication is handled by nginx + oauth2-proxy
		// User is always authenticated when they reach this application
		this.userLoggedIn = true;
		this.rememberMe = false;
		this.storage = sessionStorage;
		this.userLoggedIn$.next(true);

		// Initialize mock credentials from headers if needed
		this.initializeFromProxyHeaders();

		// Start session monitoring (without idle timeout by default)
		// Idle timeout can be enabled by passing true
		this.sessionMonitorService.startMonitoring(false);
	}

	/**
	 * Initialize user credentials from nginx/oauth2-proxy headers.
	 * Since authentication is handled by oauth2-proxy, we need to fetch
	 * the real user details from Fineract to get roles and permissions.
	 */
	private initializeFromProxyHeaders() {
		// Check if we already have credentials in storage
		const existingCredentials = this.storage.getItem(
			this.credentialsStorageKey,
		);
		if (existingCredentials) {
			return; // Already initialized
		}

		// Store temporary credentials while we fetch the real ones
		const tempCredentials: Credentials = {
			username: "loading...",
			userId: 0,
			base64EncodedAuthenticationKey: "",
			authenticated: true,
			officeId: 0,
			officeName: "",
			roles: [],
			permissions: [],
			shouldRenewPassword: false,
		};
		this.storage.setItem(
			this.credentialsStorageKey,
			JSON.stringify(tempCredentials),
		);
	}

	/**
	 * Fetch real user details from Fineract backend.
	 * This should be called after the app initializes to get actual user permissions.
	 * @returns {Observable<Credentials>} Observable of user credentials
	 */
	public fetchUserDetails(): Observable<Credentials> {
		return this.http
			.get<Credentials>(`${environment.serverUrl}/userdetails`)
			.pipe(
				map((credentials: Credentials) => {
					console.log(
						"[AuthenticationService] Received credentials from /userdetails:",
						credentials,
					);

					// Map Keycloak roles to Fineract permissions
					if (
						credentials.roles &&
						Array.isArray(credentials.roles) &&
						credentials.roles.length > 0
					) {
						console.log(
							"[AuthenticationService] Mapping roles to permissions:",
							credentials.roles,
						);

						// Extract role names and map to Fineract permissions
						const mappedPermissions =
							this.rolePermissionMapper.mapRolesToPermissions(
								credentials.roles,
							);

						// Replace OAuth2 scopes with actual Fineract permissions
						// The backend currently returns OAuth2 scopes (SCOPE_openid, etc.) instead of Fineract permissions
						credentials.permissions = mappedPermissions;

						console.log(
							"[AuthenticationService] Mapped permissions:",
							credentials.permissions,
						);
					} else {
						console.warn(
							"[AuthenticationService] No roles found in credentials. User will have no permissions.",
						);
						credentials.permissions = [];
					}

					// Store the enhanced credentials with mapped permissions
					this.storage.setItem(
						this.credentialsStorageKey,
						JSON.stringify(credentials),
					);
					this.userLoggedIn = true;
					this.userLoggedIn$.next(true);

					console.log(
						"[AuthenticationService] Stored credentials:",
						credentials,
					);
					return credentials;
				}),
			);
	}

	/**
	 * Authenticates the user.
	 * @param {LoginContext} loginContext Login parameters.
	 * @returns {Observable<boolean>} True if authentication is successful.
	 */
	login(loginContext: LoginContext) {
		this.alertService.alert({
			type: "Authentication Start",
			message: "Please wait...",
		});
		// Only allow Remember Me if enabled in config
		const rememberAllowed = environment.enableRememberMe === true;
		this.rememberMe = rememberAllowed ? loginContext.remember : false;
		this.storage = this.rememberMe ? localStorage : sessionStorage;

		if (environment.oauth.enabled) {
			let httpParams = new HttpParams();
			httpParams = httpParams.set("username", loginContext.username);
			httpParams = httpParams.set("password", loginContext.password);
			httpParams = httpParams.set("client_id", `${environment.oauth.appId}`);
			httpParams = httpParams.set("grant_type", "password");
			httpParams = httpParams.set(
				"remember_me",
				this.rememberMe ? "true" : "false",
			);
			let headers = new HttpHeaders();
			headers = headers.set(
				"Content-Type",
				"application/x-www-form-urlencoded",
			);
			return this.http
				.post(`${environment.oauth.serverUrl}/token`, httpParams.toString(), {
					headers: headers,
				})
				.pipe(
					map((tokenResponse: OAuth2Token) => {
						this.getUserDetails(tokenResponse);
						return of(true);
					}),
				);
		} else {
			return this.http
				.post("/authentication", {
					username: loginContext.username,
					password: loginContext.password,
					remember: this.rememberMe,
				})
				.pipe(
					map((credentials: Credentials) => {
						this.onLoginSuccess(credentials);
						return of(true);
					}),
				);
		}
	}

	/**
	 * Retrieves the user details after oauth2 authentication.
	 *
	 * Sets the oauth2 token refresh time.
	 * @param {OAuth2Token} tokenResponse OAuth2 Token details.
	 */
	private getUserDetails(tokenResponse: OAuth2Token) {
		this.refreshTokenOnExpiry(tokenResponse.expires_in);
		let headers = new HttpHeaders();
		headers = headers.set(
			"Authorization",
			"bearer " + tokenResponse.access_token,
		);
		this.http
			.get(`${environment.serverUrl}/userdetails`, { headers: headers })
			.subscribe((credentials: Credentials) => {
				this.onLoginSuccess(credentials);
				if (!credentials.shouldRenewPassword) {
					this.storage.setItem(
						this.oAuthTokenDetailsStorageKey,
						JSON.stringify(tokenResponse),
					);
				}
			});
	}

	/**
	 * Sets the oauth2 token to refresh on expiry.
	 * @param {number} expiresInTime OAuth2 token expiry time in seconds.
	 */
	private refreshTokenOnExpiry(expiresInTime: number) {
		setTimeout(() => this.refreshOAuthAccessToken(), expiresInTime * 1000);
	}

	/**
	 * Refreshes the oauth2 authorization token.
	 * Note: With oauth2-proxy, token refresh is handled by the proxy.
	 */
	private refreshOAuthAccessToken() {
		var oAuthRefreshToken = JSON.parse(
			this.storage.getItem(this.oAuthTokenDetailsStorageKey),
		);
		if (oAuthRefreshToken == null) {
			return;
		}
		oAuthRefreshToken = JSON.parse(
			this.storage.getItem(this.oAuthTokenDetailsStorageKey),
		).refresh_token;
		const credentials = JSON.parse(
			this.storage.getItem(this.credentialsStorageKey),
		);
		let httpParams = new HttpParams();
		httpParams = httpParams.set("username", credentials.username);
		httpParams = httpParams.set("client_id", `${environment.oauth.appId}`);
		httpParams = httpParams.set("refresh_token", oAuthRefreshToken);
		httpParams = httpParams.set("grant_type", "refresh_token");
		let headers = new HttpHeaders();
		headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
		return this.http
			.post(`${environment.oauth.serverUrl}/token`, httpParams.toString(), {
				headers: headers,
			})
			.subscribe((tokenResponse: OAuth2Token) => {
				this.storage.setItem(
					this.oAuthTokenDetailsStorageKey,
					JSON.stringify(tokenResponse),
				);
				this.refreshTokenOnExpiry(tokenResponse.expires_in);
				const credentials = JSON.parse(
					this.storage.getItem(this.credentialsStorageKey),
				);
				credentials.accessToken = tokenResponse.access_token;
				this.storage.setItem(
					this.credentialsStorageKey,
					JSON.stringify(credentials),
				);
			});
	}

	/**
	 * Sets the authorization token followed by one of the following:
	 *
	 * Sends an alert if two factor authentication is required.
	 *
	 * Sends an alert if password has expired and requires a reset.
	 *
	 * Sends an alert on successful login.
	 * @param {Credentials} credentials Authenticated user credentials.
	 */
	private onLoginSuccess(credentials: Credentials) {
		this.userLoggedIn = true;
		this.userLoggedIn$.next(true); // ✅ notify observers
		// Ensure the rememberMe value is preserved in credentials
		credentials.rememberMe = this.rememberMe;

		// Note: Authorization headers are NOT set here when using oauth2-proxy
		// nginx/oauth2-proxy handles authentication and forwards the Bearer token
		if (credentials.isTwoFactorAuthenticationRequired) {
			this.credentials = credentials;
			this.alertService.alert({
				type: "Two Factor Authentication Required",
				message: "Two Factor Authentication Required",
			});
		} else {
			if (credentials.shouldRenewPassword) {
				this.credentials = credentials;
				this.alertService.alert({
					type: "Password Expired",
					message: "Your password has expired, please reset your password!",
				});
			} else {
				this.setCredentials(credentials);
				this.alertService.alert({
					type: "Authentication Success",
					message: `${credentials.username} successfully logged in!`,
				});
				delete this.credentials;
			}
		}
	}

	/**
	 * Logout ongoing Oauth2 session.
	 * Note: With oauth2-proxy, logout is handled by redirecting to /oauth2/sign_out
	 */
	private logoutAuthSession() {
		const oAuthRefreshToken = JSON.parse(
			this.storage.getItem(this.oAuthTokenDetailsStorageKey),
		).refresh_token;
		const credentials = JSON.parse(
			this.storage.getItem(this.credentialsStorageKey),
		);
		let httpParams = new HttpParams();
		httpParams = httpParams.set("username", credentials.username);
		httpParams = httpParams.set("client_id", `${environment.oauth.appId}`);
		httpParams = httpParams.set("refresh_token", oAuthRefreshToken);
		let headers = new HttpHeaders();
		headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
		return this.http
			.post(`${environment.oauth.serverUrl}/logout`, httpParams.toString(), {
				headers: headers,
			})
			.subscribe();
	}

	/**
	 * Logs out the user by redirecting to oauth2-proxy logout endpoint.
	 * This will clear the oauth2-proxy session and redirect to Keycloak logout.
	 * @returns {Observable<boolean>} True if the user was logged out successfully.
	 */
	logout(): Observable<boolean> {
		// Clear any local storage
		this.setCredentials();
		this.resetDialog();

		// Redirect to oauth2-proxy logout endpoint
		// This will clear the oauth2-proxy session and redirect to Keycloak logout
		window.location.href = "/oauth2/sign_out";

		return of(true);
	}

	/**
	 * Checks if the two factor access token for authenticated user is valid.
	 * @returns {boolean} True if the two factor access token is valid or two factor authentication is not required.
	 */
	twoFactorAccessTokenIsValid(): boolean {
		const twoFactorAccessToken = JSON.parse(
			this.storage.getItem(this.twoFactorAuthenticationTokenStorageKey),
		);
		if (twoFactorAccessToken) {
			return new Date().getTime() < twoFactorAccessToken.validTo;
		}
		return true;
	}

	/**
	 * Checks if the user is authenticated.
	 * Always returns true since authentication is handled by nginx + oauth2-proxy.
	 * @returns {boolean} Always true - users cannot reach this app without authentication.
	 */
	isAuthenticated(): boolean {
		// Authentication is handled by nginx + oauth2-proxy layer
		// All users reaching this application are pre-authenticated
		return true;
	}

	/**
	 * Gets the user credentials.
	 * @returns {Credentials} The user credentials if the user is authenticated otherwise null.
	 */
	getCredentials(): Credentials | null {
		return JSON.parse(this.storage.getItem(this.credentialsStorageKey));
	}

	/**
	 * Sets the user credentials.
	 *
	 * The credentials may be persisted across sessions by setting the `rememberMe` parameter to true.
	 * Otherwise, the credentials are only persisted for the current session.
	 *
	 * @param {Credentials} credentials Authenticated user credentials.
	 */
	private setCredentials(credentials?: Credentials) {
		if (credentials) {
			credentials.rememberMe = this.rememberMe;
			// Make sure we're using the correct storage based on rememberMe value
			this.storage = credentials.rememberMe ? localStorage : sessionStorage;
			this.storage.setItem(
				this.credentialsStorageKey,
				JSON.stringify(credentials),
			);
		} else {
			// Clear credentials from both storage types to ensure complete logout
			localStorage.removeItem(this.credentialsStorageKey);
			sessionStorage.removeItem(this.credentialsStorageKey);
			localStorage.removeItem(this.oAuthTokenDetailsStorageKey);
			sessionStorage.removeItem(this.oAuthTokenDetailsStorageKey);
			localStorage.removeItem(this.twoFactorAuthenticationTokenStorageKey);
			sessionStorage.removeItem(this.twoFactorAuthenticationTokenStorageKey);
		}
	}

	public saveZitadelCredentials(credentials: Credentials): void {
		this.setCredentials(credentials);
	}

	public saveZitadeloAuthTokenDetailsStorageKey(
		tokenResponse: OAuth2Token,
	): void {
		this.storage.setItem(
			this.oAuthTokenDetailsStorageKey,
			JSON.stringify(tokenResponse),
		);
	}

	/**
	 * Following functions are for two factor authentication and require
	 * first level authorization headers to be setup for the requests.
	 */

	/**
	 * Gets the two factor authentication delivery methods available for the user.
	 */
	getDeliveryMethods() {
		return this.http.get("/twofactor");
	}

	showDialog() {
		this.dialogShown = true;
	}

	resetDialog() {
		this.dialogShown = false;
	}

	hasDialogBeenShown() {
		return this.dialogShown;
	}

	/**
	 * Requests OTP to be sent via the given delivery method.
	 * @param {any} deliveryMethod Delivery method for the OTP.
	 */
	requestOTP(deliveryMethod: any) {
		let httpParams = new HttpParams();
		httpParams = httpParams.set("deliveryMethod", deliveryMethod.name);
		httpParams = httpParams.set("extendedToken", this.rememberMe.toString());
		return this.http.post(`/twofactor`, {}, { params: httpParams });
	}

	/**
	 * Validates the OTP and authenticates the user on success.
	 * @param {string} otp
	 */
	validateOTP(otp: string) {
		const httpParams = new HttpParams().set("token", otp);
		return this.http
			.post(`/twofactor/validate`, {}, { params: httpParams })
			.pipe(
				map((response) => {
					this.onOTPValidateSuccess(response);
				}),
			);
	}

	/**
	 * Sets the two factor authorization token followed by one of the following:
	 *
	 * Sends an alert if password has expired and requires a reset.
	 *
	 * Sends an alert on successful login.
	 * @param {any} response Two factor authentication token details.
	 */
	private onOTPValidateSuccess(response: any) {
		this.authenticationInterceptor.setTwoFactorAccessToken(response.token);
		if (this.credentials.shouldRenewPassword) {
			this.alertService.alert({
				type: "Password Expired",
				message: "Your password has expired, please reset your password!",
			});
		} else {
			this.setCredentials(this.credentials);
			this.alertService.alert({
				type: "Authentication Success",
				message: `${this.credentials.username} successfully logged in!`,
			});
			delete this.credentials;
			this.storage.setItem(
				this.twoFactorAuthenticationTokenStorageKey,
				JSON.stringify(response),
			);
		}
	}

	/**
	 * Resets the user's password and authenticates the user.
	 * @param {any} passwordDetails New password.
	 */
	resetPassword(passwordDetails: any) {
		return this.http
			.put(`/users/${this.credentials.userId}`, passwordDetails)
			.pipe(
				map(() => {
					this.alertService.alert({
						type: "Password Reset Success",
						message: `Your password was sucessfully reset!`,
					});
					this.authenticationInterceptor.removeTwoFactorAuthorization();
					const loginContext: LoginContext = {
						username: this.credentials.username,
						password: passwordDetails.password,
						remember: this.rememberMe,
					};
					this.login(loginContext).subscribe();
				}),
			);
	}

	/*
	 * Get user logged in
	 */
	getUserLoggedIn(): boolean {
		return this.userLoggedIn;
	}
}
