import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

export interface Customer {
	id: string;
	externalId: string;
	firstName: string;
	lastName: string;
	displayName: string;
	email: string;
	phone: string;
	dateOfBirth: string;
	gender: string;
	status: "pending" | "active" | "inactive";
	activationDate?: string;
}

async function fetchCustomer(
	externalId: string,
	accessToken: string,
): Promise<Customer> {
	const response = await fetch(
		`${import.meta.env.VITE_FINERACT_API_URL || "/fineract-provider/api/v1"}/clients?externalId=${externalId}`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Fineract-Platform-TenantId":
					import.meta.env.VITE_FINERACT_TENANT_ID || "default",
			},
		},
	);

	if (!response.ok) {
		throw new Error("Failed to fetch customer");
	}

	const data = await response.json();
	const client = data.pageItems?.[0];

	if (!client) {
		throw new Error("Customer not found");
	}

	return {
		id: client.id.toString(),
		externalId: client.externalId,
		firstName: client.firstname,
		lastName: client.lastname,
		displayName: client.displayName,
		email: client.emailAddress || "",
		phone: client.mobileNo || "",
		dateOfBirth: client.dateOfBirth ? client.dateOfBirth.join("-") : "",
		gender: client.gender?.name || "",
		status: client.status?.value || "pending",
		activationDate: client.activationDate?.join("-"),
	};
}

export function useCustomer() {
	const auth = useAuth();
	const externalId = auth.user?.profile?.fineract_external_id as
		| string
		| undefined;

	return useQuery({
		queryKey: ["customer", externalId],
		queryFn: () => {
			if (!externalId || !auth.user?.access_token) {
				throw new Error("Not authenticated");
			}
			return fetchCustomer(externalId, auth.user.access_token);
		},
		enabled: !!externalId && !!auth.user?.access_token,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}
