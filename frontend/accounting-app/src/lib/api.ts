import { OpenAPI } from "@fineract-apps/fineract-api";

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
