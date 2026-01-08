import { OpenAPI, request } from "@fineract-apps/fineract-api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const useSavingsAccountStatement = () => {
	const [receipt, setReceipt] = useState<Blob | null>(null);

	const mutation = useMutation({
		mutationFn: (variables: {
			accountNo: string;
			fromDate: string;
			toDate: string;
			outputType: "PDF" | "XLS" | "CSV";
		}) => {
			const params = {
				tenantIdentifier: import.meta.env.VITE_FINERACT_TENANT_ID,
				"output-type": variables.outputType,
				R_accountNo: variables.accountNo,
				R_fromDate: variables.fromDate,
				R_toDate: variables.toDate,
				locale: "en",
				dateFormat: "dd MMMM yyyy",
			};

			return request<Blob>(OpenAPI, {
				url: "/v1/runreports/Savings%20Transactions",
				method: "GET",
				query: params,
				headers: {
					"X-Response-Type-Blob": "true",
				},
			});
		},
		onSuccess: (data: Blob) => {
			setReceipt(data);
		},
	});

	return { ...mutation, receipt, setReceipt };
};
