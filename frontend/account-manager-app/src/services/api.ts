import {
	AuthenticationHttpBasicService,
	ClientSearchV2Service,
	ClientService,
	DefaultService,
	OfficesService,
	OpenAPI,
	SavingsAccountService,
	SelfClientService,
} from "@fineract-apps/fineract-api";

OpenAPI.BASE = "https://localhost/fineract-provider/api";

OpenAPI.HEADERS = async () => {
	const headers: Record<string, string> = {
		"Fineract-Platform-TenantId": "default",
	};

	const token = localStorage.getItem("token");
	if (token) {
		headers["Authorization"] = `Basic ${token}`;
	}

	return headers;
};

export const fineractApi = {
	clients: ClientService,
	auth: AuthenticationHttpBasicService,
	clientSearchV2: ClientSearchV2Service,
	savingsAccounts: SavingsAccountService,
	offices: OfficesService,
	self: SelfClientService,
	default: DefaultService,
};
