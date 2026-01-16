import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fineractApi } from "@/services/api";

export const useAuth = () => {
	const { data: userData, isLoading: isUserDataLoading } = useQuery({
		queryKey: ["user"],
		queryFn: () =>
			fineractApi.authentication.postV1Authentication({
				requestBody: {
					username: import.meta.env.VITE_FINERACT_USERNAME,
					password: import.meta.env.VITE_FINERACT_PASSWORD,
				},
			}),
		staleTime: Infinity,
		enabled: import.meta.env.VITE_AUTH_MODE === "basic",
	});

	useEffect(() => {
		if (userData) {
			sessionStorage.setItem("auth", JSON.stringify(userData));
		}
	}, [userData]);

	const onLogout = () => {
		const base = import.meta.env.BASE_URL || "/account/";
		const appBase = base.endsWith("/") ? base : `${base}/`;

		if (import.meta.env.VITE_AUTH_MODE === "basic") {
			window.location.href = appBase;
		} else {
			// Standard OAuth2-Proxy logout flow:
			// 1. Call /oauth2/sign_out to clear the proxy cookie
			// 2. Redirect (rd) to Keycloak logout endpoint to clear upstream session
			// 3. Keycloak redirects (post_logout_redirect_uri) back to the app
			const appOrigin = window.location.origin;
			const keycloakLogoutUrl = `${appOrigin}/realms/fineract/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(
				appOrigin + appBase,
			)}`;
			window.location.href = `/oauth2/sign_out?rd=${encodeURIComponent(keycloakLogoutUrl)}`;
		}
	};

	return { onLogout, userData, isUserDataLoading };
};
