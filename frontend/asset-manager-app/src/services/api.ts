import {
	AuthenticationHttpBasicService,
	ClientService,
	CurrencyService,
	DefaultService,
	OfficesService,
	OpenAPI,
	SavingsAccountService,
	SavingsProductService,
} from "@fineract-apps/fineract-api";

export function configureApi() {
	OpenAPI.BASE = import.meta.env.VITE_FINERACT_API_URL;

	if (import.meta.env.VITE_AUTH_MODE === "basic") {
		OpenAPI.USERNAME = import.meta.env.VITE_FINERACT_USERNAME;
		OpenAPI.PASSWORD = import.meta.env.VITE_FINERACT_PASSWORD;
		OpenAPI.interceptors.request.use((request) => {
			request.headers = {
				...request.headers,
				"Fineract-Platform-TenantId": import.meta.env.VITE_FINERACT_TENANT_ID,
			};
			return request;
		});
	}
}

export const fineractApi = {
	authentication: AuthenticationHttpBasicService,
	clients: ClientService,
	offices: OfficesService,
	savingsAccounts: SavingsAccountService,
	savingsProducts: SavingsProductService,
	currencies: CurrencyService,
	default: DefaultService,
};
