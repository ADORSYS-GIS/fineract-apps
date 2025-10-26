/**
 * User Sync Service API Client
 *
 * Provides functions to interact with the User Sync Service for:
 * - Password reset (triggers email to user)
 * - User status management (activate/deactivate in Keycloak)
 * - Force password change on next login
 * - Get user's Keycloak sync status
 */

const USER_SYNC_API_BASE = "/api/user-sync";

/**
 * API Response type for User Sync operations
 */
interface UserSyncResponse {
	status: "success" | "error";
	message: string;
	keycloak_user?: {
		enabled: boolean;
		emailVerified: boolean;
		requiredActions: string[];
		roles: string[];
		groups: string[];
	};
}

/**
 * Trigger password reset email for a user via Keycloak
 *
 * @param username - Fineract username
 * @returns Promise with success/error message
 */
export async function resetUserPassword(
	username: string,
): Promise<UserSyncResponse> {
	const response = await fetch(
		`${USER_SYNC_API_BASE}/users/${username}/reset-password`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include", // Include OIDC session cookies
		},
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to trigger password reset");
	}

	return response.json();
}

/**
 * Update user status in Keycloak (enable/disable)
 *
 * @param username - Fineract username
 * @param enabled - true to enable, false to disable
 * @returns Promise with success/error message
 */
export async function updateUserStatus(
	username: string,
	enabled: boolean,
): Promise<UserSyncResponse> {
	const response = await fetch(
		`${USER_SYNC_API_BASE}/users/${username}/status`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ enabled }),
		},
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to update user status");
	}

	return response.json();
}

/**
 * Force user to change password on next login
 *
 * @param username - Fineract username
 * @returns Promise with success/error message
 */
export async function forcePasswordChange(
	username: string,
): Promise<UserSyncResponse> {
	const response = await fetch(
		`${USER_SYNC_API_BASE}/users/${username}/force-password-change`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		},
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to force password change");
	}

	return response.json();
}

/**
 * Get user's Keycloak sync status and details
 *
 * @param username - Fineract username
 * @returns Promise with user's Keycloak status
 */
export async function getUserKeycloakStatus(
	username: string,
): Promise<UserSyncResponse> {
	const response = await fetch(
		`${USER_SYNC_API_BASE}/users/${username}/keycloak-status`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		},
	);

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to get user Keycloak status");
	}

	return response.json();
}
