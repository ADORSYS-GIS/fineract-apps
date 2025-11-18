import { OpenAPI } from "@fineract-apps/fineract-api";

export function configureApi() {
	OpenAPI.BASE = import.meta.env.VITE_FINERACT_API_URL || "/fineract-provider/api";
	OpenAPI.USERNAME = import.meta.env.VITE_FINERACT_USERNAME || "mifos";
	OpenAPI.PASSWORD = import.meta.env.VITE_FINERACT_PASSWORD || "password";
	OpenAPI.HEADERS = {
		"Fineract-Platform-TenantId": import.meta.env.VITE_FINERACT_TENANT_ID || "default",
	};
}
