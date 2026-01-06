/**
 * User Sync Service API Client
 *
 * Provides functions to interact with the User Sync Service for:
 * - User creation in Keycloak
 * - Password reset (triggers email to user)
 * - User status management (activate/deactivate in Keycloak)
 * - Force password change on next login
 * - Get user's Keycloak sync status
 */

const USER_SYNC_API_BASE = "/api/user-sync";

/**
 * Generic API Response type for User Sync operations
 */
export interface UserSyncApiResponse {
	status: "success" | "error" | "exists" | "not_found";
	message: string;
}

/**
 * Payload for syncing a new user to Keycloak
 */
export interface SyncUserPayload {
	// The backend requires a userId, but the integration plan states this call
	// happens *before* the Fineract user is created. This needs to be resolved.
	// A placeholder or a change in the backend might be required.
	userId: number; // Assuming a placeholder like 0 will be sent.
	username: string;
	email: string;
	firstName?: string;
	lastName?: string;
	role?: string;
	officeId?: number;
	officeName?: string;
}

/**
 * Response from a successful user sync operation
 */
export interface SyncUserResponse extends UserSyncApiResponse {
	keycloak_user_id?: string;
	temporary_password?: string;
	required_actions?: string[];
}

/**
 * Response from getting a user's Keycloak status
 */
export interface KeycloakStatusResponse extends UserSyncApiResponse {
	keycloak_user?: {
		id: string;
		enabled: boolean;
		emailVerified: boolean;
		requiredActions: string[];
		roles: string[];
		groups: string[];
	};
}

/**
 * Sync a single user to Keycloak.
 * This should be the first step in the user creation process.
 *
 * @param userData - The user data to sync
 * @returns Promise with sync result, including temporary password
 */
export async function syncUser(
	userData: SyncUserPayload,
): Promise<SyncUserResponse> {
	const response = await fetch(`${USER_SYNC_API_BASE}/sync/user`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include", // Include OIDC session cookies
		body: JSON.stringify(userData),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to sync user to Keycloak");
	}

	return response.json();
}

/**
 * Trigger password reset email for a user via Keycloak
 *
 * @param username - Fineract username
 * @returns Promise with success/error message
 */
export async function resetUserPassword(
	username: string,
): Promise<UserSyncApiResponse> {
	const response = await fetch(
		`${USER_SYNC_API_BASE}/users/${username}/reset-password`,
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
): Promise<UserSyncApiResponse> {
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
): Promise<UserSyncApiResponse> {
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
): Promise<KeycloakStatusResponse> {
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
