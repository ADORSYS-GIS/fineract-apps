import { OpenAPI } from "@fineract-apps/fineract-api";

/**
 * Configure the OpenAPI client for Fineract API
 * Note: BASE should NOT include /v1 suffix as it's added by the generated client paths
 */
export function configureApi() {
	OpenAPI.BASE =
		import.meta.env.VITE_FINERACT_API_URL || "/fineract-provider/api";
	OpenAPI.USERNAME = import.meta.env.VITE_FINERACT_USERNAME || "mifos";
	OpenAPI.PASSWORD = import.meta.env.VITE_FINERACT_PASSWORD || "password";
	OpenAPI.HEADERS = {
		"Fineract-Platform-TenantId":
			import.meta.env.VITE_FINERACT_TENANT_ID || "default",
	};
}
