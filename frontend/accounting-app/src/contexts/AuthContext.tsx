import {
	AuthenticationHttpBasicService,
	type PostAuthenticationResponse,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useState } from "react";
import "../lib/api";
import {
	type AuthUser,
	clearStoredUser,
	getStoredUser,
	storeUser,
} from "../lib/auth";

export type UserRole =
	| "Admin"
	| "Accountant"
	| "Manager"
	| "Viewer"
	| "Supervisor Accountant";

export interface AuthContextType {
	user: AuthUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	roles: UserRole[];
	permissions: string[];
	hasRole: (role: UserRole) => boolean;
	hasPermission: (permission: string) => boolean;
	hasAnyRole: (roles: UserRole[]) => boolean;
	login: (
		authData: PostAuthenticationResponse,
		tokenType?: "basic" | "bearer",
	) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(() => {
		const storedUser = getStoredUser();
		if (storedUser) return storedUser;
		// Temporary mock user for development
		const mockUser: AuthUser = {
			username: "mock-accountant",
			base64EncodedAuthenticationKey: "mock-key",
			authenticated: true,
			permissions: [],
			roles: [{ id: 1, name: "cashier " }],
			token: "mock-token",
			tokenType: "bearer",
		};
		storeUser(mockUser);
		return mockUser;
	});

	const { isLoading } = useQuery({
		queryKey: ["dev-authentication"],
		queryFn: async () => {
			const username = import.meta.env.VITE_FINERACT_USERNAME || "mifos";
			const password = import.meta.env.VITE_FINERACT_PASSWORD || "password";
			const response =
				await AuthenticationHttpBasicService.postV1Authentication({
					requestBody: { username, password },
				});

			const token = btoa(`${username}:${password}`);
			const authUser: AuthUser = { ...response, token, tokenType: "basic" };
			storeUser(authUser);
			setUser(authUser);
			return authUser;
		},
		staleTime: Number.POSITIVE_INFINITY,
		retry: 1,
		// Only run this query if there's no stored user (for local dev)
		enabled: false,
	});

	const login = useCallback(
		(
			authData: PostAuthenticationResponse,
			tokenType: "basic" | "bearer" = "bearer",
		) => {
			if (!authData.base64EncodedAuthenticationKey) {
				console.error("Login failed: authentication key is missing.");
				logout(); // Clear user state if login fails
				return;
			}
			const authUser: AuthUser = {
				...authData,
				token: authData.base64EncodedAuthenticationKey,
				tokenType,
			};
			storeUser(authUser);
			setUser(authUser);
		},
		[],
	);

	const logout = useCallback(() => {
		clearStoredUser();
		setUser(null);
	}, []);

	const isAuthenticated = user?.authenticated ?? false;

	// Extract roles from user data
	const roles: UserRole[] = (user?.roles || [])
		.map((role) => role.name as UserRole)
		.filter(Boolean);

	// Extract permissions from user data
	const permissions: string[] = user?.permissions || [];

	// Helper function to check if user has a specific role
	const hasRole = (role: UserRole): boolean => {
		const lowerCaseRole = role.toLowerCase();
		return roles.some((r) => r.toLowerCase() === lowerCaseRole);
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
		user,
		isLoading,
		isAuthenticated,
		roles,
		permissions,
		hasRole,
		hasPermission,
		hasAnyRole,
		login,
		logout,
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
