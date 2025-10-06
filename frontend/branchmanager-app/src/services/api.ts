// Centralized API client configuration for Fineract OpenAPI client
import { OpenAPI } from "@fineract-apps/fineract-api";

export function configureApi() {
	// The base path for API calls is now relative, as the proxy handles routing.
	OpenAPI.BASE = "/fineract-provider/api";
}
