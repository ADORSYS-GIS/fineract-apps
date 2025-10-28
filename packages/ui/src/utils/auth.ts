/**
 * Authentication utilities for handling logout
 */

/**
 * Performs a complete logout:
 * 1. Clears all browser storage (localStorage, sessionStorage, cookies)
 * 2. Redirects to Apache Gateway logout endpoint
 * 3. Apache Gateway will redirect to Keycloak logout
 * 4. Keycloak will perform RP-initiated logout and redirect back
 */
export const logout = () => {
	// Clear localStorage
	localStorage.clear();

	// Clear sessionStorage
	sessionStorage.clear();

	// Clear all cookies
	clearAllCookies();

	// Redirect to logout endpoint
	// mod_auth_openidc provides a standard logout endpoint at /redirect_uri?logout=
	// This will clear the session and redirect to Keycloak logout
	const logoutUrl = `${window.location.origin}/redirect_uri?logout=${encodeURIComponent(window.location.origin)}`;

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
