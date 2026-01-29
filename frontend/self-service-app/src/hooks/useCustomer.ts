import { ClientService, GetClientsResponse } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { ClientMap, Customer } from "@/types/customer";

async function fetchCustomer(externalId: string): Promise<Customer> {
	const data: GetClientsResponse = await ClientService.getV1Clients({
		externalId,
	});
	const client = data.pageItems?.[0];

	if (!client) {
		throw new Error("Customer not found");
	}

	return ClientMap(client);
}

export function useCustomer() {
	const auth = useAuth();
	const externalId = auth.user?.profile?.fineract_external_id as
		| string
		| undefined;

	return useQuery({
		queryKey: ["customer", externalId],
		queryFn: () => {
			if (!externalId) {
				throw new Error("Not authenticated");
			}
			return fetchCustomer(externalId);
		},
		enabled: !!externalId,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}
