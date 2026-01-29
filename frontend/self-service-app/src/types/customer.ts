import { GetClientsPageItemsResponse } from "@fineract-apps/fineract-api";

export interface Customer {
	id: string;
	displayName: string;
	email: string;
	phone: string;
	status: "pending" | "active" | "inactive";
}

export const ClientMap = (client: GetClientsPageItemsResponse): Customer => {
	const { id, displayName, emailAddress, status } = client;
	return {
		id: (id || "").toString(),
		displayName: displayName || "",
		email: emailAddress || "",
		phone: "",
		status: (status as { code: string })?.code?.includes("active")
			? "active"
			: "pending",
	};
};
