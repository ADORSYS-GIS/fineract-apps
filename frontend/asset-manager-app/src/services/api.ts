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
import axios from "axios";

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

	// In OAuth mode, intercept CORS-blocked auth redirects on the default axios instance
	// (used by the generated OpenAPI client) and redirect to login
	if (import.meta.env.VITE_AUTH_MODE === "oauth") {
		axios.interceptors.response.use(
			(response) => response,
			(error) => {
				if (!error.response) {
					sessionStorage.removeItem("auth");
					window.location.href = `/oauth2/authorization/keycloak?rd=${encodeURIComponent(window.location.href)}`;
				}
				return Promise.reject(error);
			},
		);
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
