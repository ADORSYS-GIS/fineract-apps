// Centralized API client configuration for Fineract OpenAPI client
import { OpenAPI } from "@fineract-apps/fineract-api";

export function configureApi() {
	// Respect vite env but fall back to defaults from the SDK
	OpenAPI.BASE = import.meta.env.VITE_API_BASE_URL ?? OpenAPI.BASE;
	OpenAPI.HEADERS = async () => ({
		"Fineract-Platform-TenantId": "default",
		"Content-Type": "application/json",
	});
	OpenAPI.USERNAME = import.meta.env.VITE_BRANCH_MANAGER_USERNAME;
	OpenAPI.PASSWORD = import.meta.env.VITE_BRANCH_MANAGER_PASSWORD;
}
