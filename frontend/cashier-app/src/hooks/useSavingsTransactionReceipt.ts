import { OpenAPI, request } from "@fineract-apps/fineract-api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const useSavingsTransactionReceipt = () => {
	const [receipt, setReceipt] = useState<Blob | null>(null);

	const mutation = useMutation({
		mutationFn: (variables: {
			transactionId: number;
			outputType: "PDF" | "XLS" | "HTML";
		}) => {
			const params = {
				tenantIdentifier: import.meta.env.VITE_FINERACT_TENANT_ID,
				"output-type": variables.outputType,
				R_transactionId: variables.transactionId,
				locale: "en",
				dateFormat: "dd MMMM yyyy",
			};

			return request<Blob>(OpenAPI, {
				url: "/v1/runreports/Savings%20Transaction%20Receipt",
				method: "GET",
				query: params,
				headers: {
					"X-Response-Type-Blob": "true",
					"Fineract-Platform-TenantId": params.tenantIdentifier,
				},
			});
		},
		onSuccess: (data: Blob) => {
			setReceipt(data);
		},
		onError: (error: Error) => {
			console.error("Error generating receipt:", error);
		},
	});

	return { ...mutation, receipt, setReceipt };
};
