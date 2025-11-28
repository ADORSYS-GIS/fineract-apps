import type { PostAuthenticationResponse } from "@fineract-apps/fineract-api";
import { jwtDecode } from "jwt-decode";

export type AuthUser = PostAuthenticationResponse & {
	token: string;
	tokenType: "basic" | "bearer";
};

const USER_STORAGE_KEY = "fineract-user";

/**
 * Stores the user session data in localStorage
 * @param user The user object to store
 */
export function storeUser(user: AuthUser) {
	try {
		localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
	} catch (error) {
		console.error("Error storing user session:", error);
	}
}

/**
 * Retrieves the user session from localStorage
 * @returns The user object or null if not found/invalid
 */
export function getStoredUser(): AuthUser | null {
	try {
		const storedUser = localStorage.getItem(USER_STORAGE_KEY);
		if (!storedUser) return null;

		const user = JSON.parse(storedUser) as AuthUser;

		// If it's a bearer token, check for expiration
		if (user.tokenType === "bearer") {
			const decoded = jwtDecode(user.token);
			if (decoded.exp && decoded.exp * 1000 < Date.now()) {
				// Token is expired
				localStorage.removeItem(USER_STORAGE_KEY);
				return null;
			}
		}

		return user;
	} catch (error) {
		console.error("Error retrieving user session:", error);
		// Clear corrupted data
		localStorage.removeItem(USER_STORAGE_KEY);
		return null;
	}
}

/**
 * Clears the user session from localStorage
 */
export function clearStoredUser() {
	localStorage.removeItem(USER_STORAGE_KEY);
}
