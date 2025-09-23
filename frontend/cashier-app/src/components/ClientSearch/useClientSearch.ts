import { ClientSearchV2Service } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";

export const useClientSearch = (query: string) => {
	return useQuery({
		queryKey: ["clients", { query }],
		queryFn: () =>
			ClientSearchV2Service.postV2ClientsSearch({
				requestBody: {
					request: { text: query },
					page: 0,
					size: 20,
				},
			}),
		// Only enable the query if the query string is not empty
		enabled: query.length >= 3,
	});
};
