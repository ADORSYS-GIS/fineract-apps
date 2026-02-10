import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fineractApi } from "@/services/api";

export const useAuth = () => {
	const authMode = import.meta.env.VITE_AUTH_MODE || "basic";

	const { data: fineractUser, isLoading: isFineractUserLoading } = useQuery({
		queryKey: ["user"],
		queryFn: () =>
			fineractApi.authentication.postV1Authentication({
				requestBody: {
					username: import.meta.env.VITE_FINERACT_USERNAME,
					password: import.meta.env.VITE_FINERACT_PASSWORD,
				},
			}),
		staleTime: Infinity,
		enabled: authMode === "basic",
	});

	const { data: keycloakUser, isLoading: isKeycloakUserLoading } = useQuery({
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
		staleTime: Infinity,
		retry: 1,
		enabled: authMode === "oauth",
	});

	useEffect(() => {
		if (fineractUser) {
			sessionStorage.setItem("auth", JSON.stringify(fineractUser));
		} else if (keycloakUser) {
			sessionStorage.setItem("auth", JSON.stringify(keycloakUser));
		}
	}, [fineractUser, keycloakUser]);
	const onLogout = () => {
		if (import.meta.env.VITE_AUTH_MODE === "basic") {
			window.location.href = "/home/";
		} else {
			localStorage.clear();
			sessionStorage.clear();
			window.location.href = "/oauth2/sign_out?rd=/logout";
		}
	};
	const isLoading =
		authMode === "oauth" ? isKeycloakUserLoading : isFineractUserLoading;
	const userData = authMode === "oauth" ? keycloakUser : fineractUser;
	const user = {
		...userData,
		displayName:
			authMode === "oauth" ? keycloakUser?.user : fineractUser?.username,
	};
	return { onLogout, userData: user, isUserDataLoading: isLoading };
};
