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
		const redirectTo = `${window.location.origin}${appBase}`;

		if (import.meta.env.VITE_AUTH_MODE === "basic") {
			window.location.href = appBase;
		} else {
			// OAuth mode: Use OAuth2 Proxy global logout
			// This terminates the Keycloak session across ALL devices
			localStorage.clear();
			sessionStorage.clear();
			window.location.href = `/oauth2/sign_out?rd=${encodeURIComponent(redirectTo)}`;
		}
	};

	return { onLogout, userData, isUserDataLoading };
};
