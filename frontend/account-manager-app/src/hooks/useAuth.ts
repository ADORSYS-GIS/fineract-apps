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
			
			const appOrigin = window.location.origin;
			// We cannot use post_logout_redirect_uri without id_token_hint (which is HttpOnly).
			// So we redirect to the Keycloak logout endpoint to allow the user to logout interactively.
			// This avoids the "Missing id_token_hint" error and the infinite reload loop.
			const keycloakLogoutUrl = `${appOrigin}/realms/fineract/protocol/openid-connect/logout`;
			window.location.href = `/oauth2/sign_out?rd=${encodeURIComponent(keycloakLogoutUrl)}`;
		}
	};

	return { onLogout, userData, isUserDataLoading };
};
