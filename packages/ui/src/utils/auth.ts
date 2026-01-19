/**
 * Authentication utilities for handling logout
 */

/**
 * Performs a complete global logout:
 * 1. Clears all browser storage (localStorage, sessionStorage, cookies)
 * 2. Redirects to OAuth2 Proxy logout endpoint
 * 3. OAuth2 Proxy redirects to Keycloak end_session_endpoint
 * 4. Keycloak terminates SSO session (ALL devices logged out)
 * 5. User redirected back to app login page
 */
export const logout = (postLogoutRedirectUri?: string) => {
	// Clear localStorage
	localStorage.clear();

	// Clear sessionStorage
	sessionStorage.clear();

	// Clear all cookies
	clearAllCookies();

	// Construct logout URL using OAuth2 Proxy's sign_out endpoint
	// The 'rd' parameter specifies where to redirect after logout completes
	const redirectUri = postLogoutRedirectUri || window.location.origin;
	const logoutUrl = `/oauth2/sign_out?rd=${encodeURIComponent(redirectUri)}`;

	window.location.href = logoutUrl;
};

/**
 * Clears all cookies accessible to JavaScript
 */
const clearAllCookies = () => {
	const cookies = document.cookie.split(";");

	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i];
		const eqPos = cookie.indexOf("=");
		const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

		// Delete cookie for current path
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;

		// Delete cookie for root path
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;

		// Try deleting with domain
		const domain = window.location.hostname;
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`;
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${domain}`;
	}
};
