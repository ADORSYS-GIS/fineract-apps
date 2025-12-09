import { OpenAPI, ReportsService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import type {
	ReportDetails,
	ReportParameter,
} from "./ReportParameterModal.types";

async function fetchParameterOptions(
	param: ReportParameter,
): Promise<{ id: number | string; name: string }[]> {
	if (!param.parameterName.toLowerCase().includes("select")) return [];
	if (param.parameterData?.length) return param.parameterData;

	const headers = {
		...OpenAPI.HEADERS,
		Authorization: `Basic ${btoa(`${OpenAPI.USERNAME}:${OpenAPI.PASSWORD}`)}`,
	};

	try {
		let response;
		let url;

		switch (param.parameterName) {
			case "OfficeIdSelectOne":
			case "OfficeIdSelectAll":
				url = `${OpenAPI.BASE}/v1/offices`;
				response = await fetch(url, { headers });
				break;
			case "loanOfficerIdSelectAll":
				url = `${OpenAPI.BASE}/v1/staff`;
				response = await fetch(url, { headers });
				break;
			case "loanProductIdSelectAll":
				url = `${OpenAPI.BASE}/v1/loanproducts`;
				response = await fetch(url, { headers });
				break;
			default: {
				url = `${OpenAPI.BASE}/v1/runreports/${param.parameterName}?parameterType=true`;
				response = await fetch(url, { headers });
			}
		}

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		if (Array.isArray(data)) {
			// Handle direct array responses (e.g., from /offices, /staff)
			return data.map(
				(item: {
					id: number | string;
					name: string;
					displayName?: string;
				}) => ({
					id: item.id,
					name: item.displayName || item.name,
				}),
			);
		} else if (data.data) {
			// Handle wrapped responses (e.g., from runreports)
			return data.data.map((item: { row: (string | number)[] }) => ({
				id: item.row[0],
				name: item.row[1],
			}));
		}
		return [];
	} catch (error) {
		console.warn(`Could not fetch options for ${param.parameterName}.`, error);
		return [];
	}
}

export function useReportParameters(reportId: number | null, isOpen: boolean) {
	const { data: reportDetails, isLoading: isLoadingDetails } = useQuery({
		queryKey: ["report-details", reportId],
		queryFn: async () => {
			if (!reportId) return null;
			const response = (await ReportsService.getV1ReportsById({
				id: reportId,
			})) as unknown as ReportDetails;

			// Normalize parameter variable and label
			if (response.reportParameters) {
				response.reportParameters = response.reportParameters.map((param) => {
					let variableName =
						param.reportParameterName || param.parameterVariable;
					if (!variableName && param.parameterName) {
						const baseName = param.parameterName.replace(
							/Select(One|All)$/,
							"",
						);
						variableName = baseName.charAt(0).toLowerCase() + baseName.slice(1);
					}

					let label = param.parameterLabel;
					if (!label && variableName) {
						const spaced = variableName.replace(/([A-Z])/g, " $1");
						label = spaced.charAt(0).toUpperCase() + spaced.slice(1);
					} else if (!label && param.parameterName) {
						label = param.parameterName;
					}

					return {
						...param,
						parameterVariable: variableName,
						parameterLabel: label,
					};
				});
			}
			return response;
		},
		enabled: isOpen && !!reportId,
	});

	const { data: parametersWithOptions, isLoading: isLoadingOptions } = useQuery(
		{
			queryKey: ["report-parameter-options", reportDetails?.id],
			queryFn: async () => {
				if (!reportDetails?.reportParameters) return [];

				const enhancedParams = await Promise.all(
					reportDetails.reportParameters.map(async (param) => {
						const options = await fetchParameterOptions(param);
						const sanitizedOptions = options.map((opt) => ({
							...opt,
							name: String(opt.name || "").replace(/\./g, ""),
						}));
						const newParam = { ...param, parameterData: sanitizedOptions };
						if (newParam.parameterName.includes("Select")) {
							newParam.parameterDisplayType = "select";
						}
						return newParam;
					}),
				);
				return enhancedParams;
			},
			enabled: !!reportDetails,
		},
	);

	return {
		reportDetails: reportDetails
			? { ...reportDetails, reportParameters: parametersWithOptions || [] }
			: null,
		isLoading: isLoadingDetails || (isLoadingOptions && !parametersWithOptions),
	};
}
