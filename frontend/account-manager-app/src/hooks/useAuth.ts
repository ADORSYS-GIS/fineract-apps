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
			// Pass post_logout_redirect_uri to ensure Keycloak sends user back to app after upstream logout
			window.location.href = `${window.location.origin}/oauth2/sign_out?post_logout_redirect_uri=${encodeURIComponent(
				window.location.origin,
			)}`;
		}
	};

	return { onLogout, userData, isUserDataLoading };
};
