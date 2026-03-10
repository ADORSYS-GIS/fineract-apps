import { ApiError, OpenAPI, request } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";

export const useReceipt = (
	transactionId: number,
	outputType: "PDF" | "XLS" | "HTML",
) => {
	return useQuery<Blob, ApiError>({
		queryKey: ["receipt", transactionId, outputType],
		queryFn: () => {
			const params = {
				tenantIdentifier: import.meta.env.VITE_FINERACT_TENANT_ID,
				"output-type": outputType,
				R_transactionId: transactionId,
				locale: "en",
				dateFormat: "dd MMMM yyyy",
			};

			return request<Blob>(OpenAPI, {
				url: "/v1/runreports/Loan%20Transaction%20Receipt",
				method: "GET",
				query: params,
				headers: {
					"X-Response-Type-Blob": "true",
				},
			});
		},
	});
};
