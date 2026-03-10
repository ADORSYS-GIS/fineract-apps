import { DefaultService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";

export const useClientImage = (clientId: string) => {
	return useQuery<string, Error>({
		queryKey: ["clientImage", clientId],
		queryFn: async () => {
			const response = await DefaultService.getV1ByEntityByEntityIdImages({
				entity: "clients",
				entityId: Number(clientId),
			});
			if (typeof response === "string") {
				return response;
			}
			throw new Error("API did not return a valid image string.");
		},
		enabled: !!clientId,
		staleTime: Infinity,
	});
};
