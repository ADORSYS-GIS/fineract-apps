import { useQuery } from "@tanstack/react-query";
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
	});

	const onLogout = () => {
		globalThis.location.href = `/cashier/callback?logout=${encodeURIComponent(
			globalThis.location.origin + "/account/",
		)}`;
	};

	return { onLogout, userData, isUserDataLoading };
};
