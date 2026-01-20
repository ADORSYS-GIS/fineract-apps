import {
	AuthenticationHttpBasicService,
	type PostAuthenticationResponse,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect } from "react";
import "../lib/api";

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
	user: KeycloakUserInfo | null;
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
				"Super user",
				"Accountant",
				"Supervisor Accountant",
				"Manager",
				"Viewer",
			].includes(role),
		);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const authMode = import.meta.env.VITE_AUTH_MODE || "basic";

	const { data: keycloakUser, isLoading: isLoadingKeycloak } =
		useQuery<KeycloakUserInfo>({
			queryKey: ["keycloak-userinfo"],
			queryFn: async () => {
				const baseUrl = import.meta.env.BASE_URL || "/";
				const apiPath = `${baseUrl}api/userinfo`.replace("//", "/");
				const response = await fetch(apiPath);
				if (!response.ok) {
					throw new Error("Failed to fetch user info");
				}
				return response.json();
			},
			staleTime: Number.POSITIVE_INFINITY,
			retry: 1,
			enabled: authMode === "oauth",
		});

	const { data: fineractUser, isLoading: isLoadingFineract } =
		useQuery<PostAuthenticationResponse>({
			queryKey: ["fineract-authentication"],
			queryFn: async () => {
				return AuthenticationHttpBasicService.postV1Authentication({
					requestBody: {
						username: import.meta.env.VITE_FINERACT_USERNAME || "mifos",
						password: import.meta.env.VITE_FINERACT_PASSWORD || "password",
					},
				});
			},
			staleTime: Number.POSITIVE_INFINITY,
			retry: 1,
			enabled: authMode === "basic",
		});

	const isLoading =
		authMode === "oauth" ? isLoadingKeycloak : isLoadingFineract;
	const isAuthenticated =
		authMode === "oauth"
			? !!keycloakUser?.user
			: (fineractUser?.authenticated ?? false);

	const roles: UserRole[] =
		authMode === "oauth"
			? parseKeycloakRoles(keycloakUser?.roles || "")
			: (fineractUser?.roles || [])
					.map((role) => role.name as UserRole)
					.filter(Boolean);

	const permissions: string[] = fineractUser?.permissions || [];

	const user: KeycloakUserInfo | null =
		authMode === "oauth"
			? keycloakUser || null
			: fineractUser
				? {
						user: fineractUser.username || "",
						email: "", // Not available in basic auth
						roles: (fineractUser.roles || []).map((r) => r.name).join(","),
					}
				: null;

	useEffect(() => {
		if (fineractUser) {
			sessionStorage.setItem("auth", JSON.stringify(fineractUser));
		} else if (keycloakUser) {
			sessionStorage.setItem("auth", JSON.stringify(keycloakUser));
		}
	}, [fineractUser, keycloakUser]);

	const hasRole = (role: UserRole): boolean => roles.includes(role);

	const hasPermission = (permission: string): boolean =>
		permissions.includes(permission);

	const hasAnyRole = (rolesToCheck: UserRole[]): boolean =>
		rolesToCheck.some((role) => roles.includes(role));

	const value: AuthContextType = {
		user,
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
