import { DefaultService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";

export const useClientImage = (clientId: string) => {
	return useQuery<string, Error>({
		queryKey: ["clientImage", clientId],
		queryFn: async () => {
			const response = (await DefaultService.getV1ByEntityByEntityIdImages({
				entity: "clients",
				entityId: Number(clientId),
			})) as unknown as string;
			return response;
		},
		enabled: !!clientId,
	});
};
