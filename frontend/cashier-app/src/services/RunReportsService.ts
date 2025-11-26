import { OpenAPI } from "@fineract-apps/fineract-api";
import axios from "axios";

const BASE_URL = `${OpenAPI.BASE}/v1/runreports`;

export const RunReportsService = {
	getLoanTransactionReceipt: async (
		transactionId: number,
		outputType: "PDF" | "XLS" | "HTML" = "PDF",
	) => {
		const params = {
			tenantIdentifier: import.meta.env.VITE_FINERACT_TENANT_ID,
			"output-type": outputType,
			R_transactionId: transactionId,
			locale: "en",
			dateFormat: "dd MMMM yyyy",
		};

		const response = await axios.get(
			`${BASE_URL}/Loan%20Transaction%20Receipt`,
			{
				params,
				responseType: "blob",
				headers: {
					Authorization: `Basic ${btoa(
						`${OpenAPI.USERNAME}:${OpenAPI.PASSWORD}`,
					)}`,
				},
			},
		);

		return response.data;
	},
};
