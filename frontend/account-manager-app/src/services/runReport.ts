import { OpenAPI } from "@fineract-apps/fineract-api";
import axios from "axios";

const BASE_URL = `${OpenAPI.BASE}/v1/runreports`;

export const RunReportsService = {
	getSavingsAccountStatement: async (
		accountNo: string,
		fromDate: string,
		toDate: string,
		outputType: "PDF" | "XLS" | "CSV" = "PDF",
	) => {
		const params = {
			tenantIdentifier: import.meta.env.VITE_FINERACT_TENANT_ID,
			"output-type": outputType,
			R_accountNo: accountNo,
			R_fromDate: fromDate,
			R_toDate: toDate,
			locale: "en",
			dateFormat: "dd MMMM yyyy",
		};

		const response = await axios.get(`${BASE_URL}/Savings%20Transactions`, {
			params,
			responseType: "blob",
			headers: {
				Authorization: `Basic ${btoa(
					`${OpenAPI.USERNAME}:${OpenAPI.PASSWORD}`,
				)}`,
			},
		});

		return response.data;
	},
};
