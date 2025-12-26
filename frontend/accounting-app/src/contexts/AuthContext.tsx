import {
	AuthenticationHttpBasicService,
	type PostAuthenticationResponse,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect } from "react";
import "../lib/api";

export type UserRole = "Admin" | "Accountant" | "Manager" | "Viewer";

export interface AuthContextType {
	user: PostAuthenticationResponse | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	roles: UserRole[];
	permissions: string[];
	hasRole: (role: UserRole) => boolean;
	hasPermission: (permission: string) => boolean;
	hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { data: user, isLoading } = useQuery<PostAuthenticationResponse>({
		queryKey: ["authentication"],
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
		staleTime: Number.POSITIVE_INFINITY, // Cache indefinitely
		retry: 1,
	});

	useEffect(() => {
		if (user) {
			sessionStorage.setItem("auth", JSON.stringify(user));
		}
	}, [user]);

	const isAuthenticated = user?.authenticated ?? false;

	// Extract roles from user data
	const roles: UserRole[] = (user?.roles || [])
		.map((role) => role.name as UserRole)
		.filter(Boolean);

	// Extract permissions from user data
	const permissions: string[] = user?.permissions || [];

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
		user: user || null,
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
