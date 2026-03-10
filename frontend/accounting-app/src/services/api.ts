// Centralized API client configuration for Fineract OpenAPI client
import { OpenAPI } from "@fineract-apps/fineract-api";

export function configureApi() {
	OpenAPI.BASE = import.meta.env.VITE_FINERACT_API_URL;
	// Only set credentials if auth mode is basic
	if (import.meta.env.VITE_AUTH_MODE === "basic") {
		OpenAPI.USERNAME = import.meta.env.VITE_FINERACT_USERNAME;
		OpenAPI.PASSWORD = import.meta.env.VITE_FINERACT_PASSWORD;
		OpenAPI.HEADERS = {
			"Fineract-Platform-TenantId": import.meta.env.VITE_FINERACT_TENANT_ID,
		};
	}
}
