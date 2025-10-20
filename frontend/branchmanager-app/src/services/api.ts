// Centralized API client configuration for Fineract OpenAPI client
import { OpenAPI } from "@fineract-apps/fineract-api";

export function configureApi() {
	// The base path for API calls is now relative, as the proxy handles routing.
	// OpenAPI.BASE = "/fineract-provider/api";
	OpenAPI.BASE = import.meta.env.VITE_FINERACT_API_URL;
	OpenAPI.USERNAME = import.meta.env.VITE_FINERACT_USERNAME;
	OpenAPI.PASSWORD = import.meta.env.VITE_FINERACT_PASSWORD;

	OpenAPI.HEADERS = {
		"Fineract-Platform-TenantId": import.meta.env.VITE_FINERACT_TENANT_ID,
	};
}
