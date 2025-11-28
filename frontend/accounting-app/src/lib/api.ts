import { OpenAPI } from "@fineract-apps/fineract-api";

/**
 * Configure the OpenAPI client for Fineract API
 * Note: BASE should NOT include /v1 suffix as it's added by the generated client paths
 */
const FINERACT_API_URL =
	import.meta.env.VITE_FINERACT_API_URL || "/fineract-provider/api";
const FINERACT_TENANT_ID = import.meta.env.VITE_FINERACT_TENANT_ID || "default";
import { getStoredUser } from "./auth";

OpenAPI.BASE = FINERACT_API_URL;
OpenAPI.HEADERS = async () => {
	const user = getStoredUser();
	const headers: Record<string, string> = {
		"Fineract-Platform-TenantId": FINERACT_TENANT_ID,
	};

	if (user) {
		const token =
			user.tokenType === "basic"
				? `Basic ${user.token}`
				: `Bearer ${user.token}`;
		headers.Authorization = token;
	}

	return headers;
};

export { OpenAPI };
