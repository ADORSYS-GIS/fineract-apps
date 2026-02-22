import { type FC, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
	children: ReactNode;
}

export const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
	const { userData, isUserDataLoading } = useAuth();

	if (isUserDataLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
			</div>
		);
	}

	if (!userData) {
		const base = import.meta.env.BASE_URL || "/asset-manager/";
		if (import.meta.env.VITE_AUTH_MODE === "oauth") {
			window.location.href = `/oauth2/authorization/keycloak?rd=${encodeURIComponent(window.location.href)}`;
		} else {
			window.location.href = base;
		}
		return null;
	}

	return <>{children}</>;
};
