import { OpenAPI } from "@fineract-apps/fineract-api";

/**
 * Configure the OpenAPI client for Fineract API
 * Note: BASE should NOT include /v1 suffix as it's added by the generated client paths
 */
const FINERACT_API_URL =
	import.meta.env.VITE_FINERACT_API_URL || "/fineract-provider/api";
const FINERACT_USERNAME = import.meta.env.VITE_FINERACT_USERNAME || "mifos";
const FINERACT_PASSWORD = import.meta.env.VITE_FINERACT_PASSWORD || "password";
const FINERACT_TENANT_ID = import.meta.env.VITE_FINERACT_TENANT_ID || "default";

OpenAPI.BASE = FINERACT_API_URL;
OpenAPI.USERNAME = FINERACT_USERNAME;
OpenAPI.PASSWORD = FINERACT_PASSWORD;
OpenAPI.HEADERS = {
	"Fineract-Platform-TenantId": FINERACT_TENANT_ID,
};

export { OpenAPI };
