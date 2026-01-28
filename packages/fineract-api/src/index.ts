export * from "./generated/queries/queries";
export * from "./generated/requests";
export * from "./generated/requests/types.gen";
export * from "./generated/requests/services.gen";
export * from "./generated/requests/core/CancelablePromise";
export * from "./generated/requests/core/ApiError";
export * from "./generated/requests/core/OpenAPI";
export { getHeaders, request } from "./generated/requests/core/request";
export type { ApiRequestOptions } from "./generated/requests/core/ApiRequestOptions";
export * from "./generated/customer-service/requests/services.gen";

import { OpenAPI } from "./generated/requests/core/OpenAPI";

OpenAPI.interceptors.request.use((config) => {
	if (config.headers && config.headers["X-Response-Type-Blob"]) {
		// @ts-ignore
		delete config.headers["X-Response-Type-Blob"];
		config.responseType = "blob";
	}
	return config;
});
