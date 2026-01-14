import {
	AuthenticationHttpBasicService,
	type PostAuthenticationResponse,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect } from "react";

export type UserRole =
	| "Super user"
	| "Accountant"
	| "Supervisor Accountant"
	| "Manager"
	| "Viewer";

// Keycloak user info from /api/userinfo endpoint
// This data comes from OAuth2 Proxy headers passed through nginx ingress
interface KeycloakUserInfo {
	user: string;
	email: string;
	roles: string; // Comma-separated list of roles from Keycloak
}

export interface AuthContextType {
	user: PostAuthenticationResponse | null;
	keycloakUser: KeycloakUserInfo | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	roles: UserRole[];
	permissions: string[];
	hasRole: (role: UserRole) => boolean;
	hasPermission: (permission: string) => boolean;
	hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Parse roles from Keycloak/OAuth2 Proxy response
 * The roles come as a comma-separated string from the X-Auth-Request-Groups header
 */
function parseKeycloakRoles(rolesString: string): UserRole[] {
	if (!rolesString) return [];

	return rolesString
		.split(",")
		.map((role) => role.trim())
		.filter((role): role is UserRole =>
			[
				"Admin",
				"Accountant",
				"Supervisor Accountant",
				"Manager",
				"Viewer",
			].includes(role),
		);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	// Fetch Keycloak user info from /api/userinfo endpoint
	// This endpoint returns OAuth2 Proxy headers as JSON
	const { data: keycloakUser, isLoading: isLoadingKeycloak } =
		useQuery<KeycloakUserInfo>({
			queryKey: ["keycloak-userinfo"],
			queryFn: async () => {
				const response = await fetch("/api/userinfo");
				if (!response.ok) {
					throw new Error("Failed to fetch user info");
				}
				return response.json();
			},
			staleTime: Number.POSITIVE_INFINITY,
			retry: 1,
		});

	// Fetch Fineract user for permissions (still needed for fine-grained access control)
	const { data: fineractUser, isLoading: isLoadingFineract } =
		useQuery<PostAuthenticationResponse>({
			queryKey: ["fineract-authentication"],
			queryFn: async () => {
				const response =
					await AuthenticationHttpBasicService.postV1Authentication({
						requestBody: {
							username: import.meta.env.VITE_FINERACT_USERNAME || "mifos",
							password: import.meta.env.VITE_FINERACT_PASSWORD || "password",
						},
					});
				return response;
			},
			staleTime: Number.POSITIVE_INFINITY,
			retry: 1,
		});

	const isLoading = isLoadingKeycloak || isLoadingFineract;

	useEffect(() => {
		if (fineractUser) {
			sessionStorage.setItem("auth", JSON.stringify(fineractUser));
		}
	}, [fineractUser]);

	// User is authenticated if we have Keycloak user info
	const isAuthenticated = !!keycloakUser?.user;

	// Extract roles from Keycloak (primary source for authorization)
	const roles: UserRole[] = parseKeycloakRoles(keycloakUser?.roles || "");

	// Extract permissions from Fineract (for fine-grained access control)
	const permissions: string[] = fineractUser?.permissions || [];

	// Helper function to check if user has a specific role
	const hasRole = (role: UserRole): boolean => {
		return roles.includes(role);
	};

	// Helper function to check if user has a specific permission
	const hasPermission = (permission: string): boolean => {
		return permissions.includes(permission);
	};

	// Helper function to check if user has any of the specified roles
	const hasAnyRole = (rolesToCheck: UserRole[]): boolean => {
		return rolesToCheck.some((role) => roles.includes(role));
	};

	const value: AuthContextType = {
		user: fineractUser || null,
		keycloakUser: keycloakUser || null,
		isLoading,
		isAuthenticated,
		roles,
		permissions,
		hasRole,
		hasPermission,
		hasAnyRole,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
