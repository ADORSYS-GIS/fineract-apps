import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, fromEvent, merge, timer } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";

/**
 * Session Monitor Service
 *
 * Handles session expiration detection and user activity monitoring for OAuth2 authentication flow.
 * This service works with OAuth2-Proxy to detect expired sessions and handle graceful redirects.
 */
@Injectable({
	providedIn: "root",
})
export class SessionMonitorService {
	private sessionExpired$ = new Subject<void>();
	private destroy$ = new Subject<void>();

	// Configuration
	private readonly IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
	private readonly IDLE_CHECK_INTERVAL_MS = 60 * 1000; // Check every minute

	private idleTimer: any;
	private lastActivityTime: number = Date.now();
	private isMonitoringIdle: boolean = false;

	constructor(private router: Router) {}

	/**
	 * Initialize session monitoring
	 * Call this when user successfully authenticates
	 *
	 * @param enableIdleTimeout - Whether to enable automatic idle timeout (default: false)
	 */
	startMonitoring(enableIdleTimeout: boolean = false): void {
		if (enableIdleTimeout) {
			this.startIdleMonitoring();
		}
	}

	/**
	 * Stop all session monitoring
	 * Call this when user logs out
	 */
	stopMonitoring(): void {
		this.stopIdleMonitoring();
		this.destroy$.next();
	}

	/**
	 * Handle 401 Unauthorized response from API
	 * This indicates the OAuth2 session has expired
	 *
	 * @param returnUrl - Optional URL to return to after re-authentication
	 */
	handleSessionExpired(returnUrl?: string): void {
		console.log("[SessionMonitor] Session expired, redirecting to login");

		// Stop any active monitoring
		this.stopMonitoring();

		// Clear local storage to ensure clean state
		this.clearStoredCredentials();

		// Emit session expired event
		this.sessionExpired$.next();

		// Build return URL with current location if not provided
		const currentPath =
			returnUrl || window.location.pathname + window.location.search;
		const redirectUrl = `/oauth2/sign_in?rd=${encodeURIComponent(currentPath)}`;

		// Redirect to OAuth2-Proxy login with return URL
		window.location.href = redirectUrl;
	}

	/**
	 * Get observable for session expiration events
	 */
	onSessionExpired() {
		return this.sessionExpired$.asObservable();
	}

	/**
	 * Start monitoring user activity for idle timeout
	 * Tracks mouse moves, key presses, clicks, and scrolls
	 */
	private startIdleMonitoring(): void {
		if (this.isMonitoringIdle) {
			return;
		}

		console.log("[SessionMonitor] Starting idle timeout monitoring");
		this.isMonitoringIdle = true;
		this.lastActivityTime = Date.now();

		// Listen to user activity events
		const activityEvents$ = merge(
			fromEvent(document, "mousemove"),
			fromEvent(document, "keydown"),
			fromEvent(document, "click"),
			fromEvent(document, "scroll", { passive: true }),
		).pipe(
			debounceTime(1000), // Debounce to avoid excessive updates
			takeUntil(this.destroy$),
		);

		// Update last activity time on any user activity
		activityEvents$.subscribe(() => {
			this.lastActivityTime = Date.now();
		});

		// Check for idle timeout periodically
		this.idleTimer = setInterval(() => {
			this.checkIdleTimeout();
		}, this.IDLE_CHECK_INTERVAL_MS);
	}

	/**
	 * Stop idle timeout monitoring
	 */
	private stopIdleMonitoring(): void {
		if (this.idleTimer) {
			clearInterval(this.idleTimer);
			this.idleTimer = null;
		}
		this.isMonitoringIdle = false;
	}

	/**
	 * Check if user has been idle for too long
	 */
	private checkIdleTimeout(): void {
		const idleTime = Date.now() - this.lastActivityTime;

		if (idleTime >= this.IDLE_TIMEOUT_MS) {
			console.log("[SessionMonitor] Idle timeout reached, logging out");
			this.handleSessionExpired();
		}
	}

	/**
	 * Clear stored credentials from local/session storage
	 * Ensures clean state after session expiration
	 */
	private clearStoredCredentials(): void {
		try {
			// Clear Mifos X credentials (matching authentication.service.ts)
			localStorage.removeItem("mifosXCredentials");
			sessionStorage.removeItem("mifosXCredentials");
			localStorage.removeItem("mifosXOAuthTokenDetails");
			sessionStorage.removeItem("mifosXOAuthTokenDetails");

			// Clear any other auth-related items
			localStorage.removeItem("currentUser");
			sessionStorage.removeItem("currentUser");
		} catch (error) {
			console.error("[SessionMonitor] Error clearing credentials:", error);
		}
	}

	/**
	 * Check if current error is a 401 Unauthorized
	 * Helper method for interceptors
	 *
	 * @param error - HTTP error response
	 * @returns true if error is 401
	 */
	isSessionExpiredError(error: any): boolean {
		return error?.status === 401;
	}
}
