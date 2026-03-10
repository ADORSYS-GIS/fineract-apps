import { OpenAPI, ReportsService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import type {
	ReportDetails,
	ReportParameter,
} from "./ReportParameterModal.types";

// Interface for FullParameterList response
interface FullParameterListResponse {
	columnHeaders: Array<{
		columnName: string;
		columnType: string;
		columnDisplayType: string;
		isColumnNullable: boolean;
		isColumnPrimaryKey: boolean;
		isColumnUnique: boolean;
		isColumnIndexed: boolean;
		columnValues: unknown[];
	}>;
	data: Array<{
		row: unknown[];
	}>;
}

async function fetchParameterOptions(
	param: ReportParameter,
	parentValues?: Record<string, string>,
): Promise<{ id: number | string; name: string }[]> {
	// Don't fetch options for date parameters - they should be handled client-side
	if (param.parameterDisplayType === "date") return [];

	// Only fetch for select parameters
	if (
		param.parameterDisplayType !== "select" &&
		!param.parameterName.toLowerCase().includes("select")
	)
		return [];

	if (param.parameterData?.length) return param.parameterData;

	const headers = {
		...OpenAPI.HEADERS,
		Authorization: `Basic ${btoa(`${OpenAPI.USERNAME}:${OpenAPI.PASSWORD}`)}`,
	};

	try {
		let url = `${OpenAPI.BASE}/v1/runreports/${param.parameterName}?parameterType=true`;

		// Handle dependent parameters by adding parent values to query
		if (parentValues && Object.keys(parentValues).length > 0) {
			const queryParams = new URLSearchParams();
			queryParams.set("parameterType", "true");

			// Add parent parameter values (e.g., R_currencyId=XAF)
			Object.entries(parentValues).forEach(([key, value]) => {
				if (value && value !== "-1") {
					queryParams.set(`R_${key}`, value);
				}
			});

			url = `${OpenAPI.BASE}/v1/runreports/${param.parameterName}?${queryParams.toString()}`;
		}

		const response = await fetch(url, { headers });

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		if (data.data) {
			// Handle wrapped responses from runreports
			return data.data.map((item: { row: (string | number)[] }) => ({
				id: item.row[0],
				name: String(item.row[1] || item.row[0]),
			}));
		}

		return [];
	} catch (error) {
		console.warn(`Could not fetch options for ${param.parameterName}.`, error);
		return [];
	}
}

export function useReportParameters(
	reportId: number | null,
	reportName: string | null,
	isOpen: boolean,
) {
	const { data: reportDetails, isLoading: isLoadingDetails } = useQuery({
		queryKey: ["report-details", reportId, reportName],
		queryFn: async () => {
			if (!reportId || !reportName) return null;

			// The getV1ReportsById endpoint returns the definitive list of parameters for a report.
			// We no longer need to call the generic FullParameterList endpoint.
			const reportDetails = (await ReportsService.getV1ReportsById({
				id: reportId,
			})) as unknown as ReportDetails;

			// This is not ideal, but it's a step towards replicating the Angular logic without a full data source refactor.
			const tempFullParamUrl = `${OpenAPI.BASE}/v1/runreports/FullParameterList?R_reportListing='${reportName}'&parameterType=true`;
			const tempFullParamResponse = await fetch(tempFullParamUrl, {
				headers: {
					...OpenAPI.HEADERS,
					Authorization: `Basic ${btoa(`${OpenAPI.USERNAME}:${OpenAPI.PASSWORD}`)}`,
				},
			});
			const fullParamData: FullParameterListResponse =
				await tempFullParamResponse.json();

			interface ReportParameterDetails {
				parameterVariable: string;
				parameterLabel: string;
				parameterDisplayType: "text" | "select" | "date" | "none";
				parameterDefaultValue: string;
				selectOne: boolean;
				selectAll: boolean;
				parentParameterName: string | undefined;
			}

			const detailedParamsMap = new Map<string, ReportParameterDetails>();
			fullParamData.data.forEach((item) => {
				const row = item.row;
				detailedParamsMap.set(String(row[0]), {
					parameterVariable: String(row[1]),
					parameterLabel: String(row[2]),
					parameterDisplayType: String(row[3]) as
						| "text"
						| "select"
						| "date"
						| "none",
					parameterDefaultValue: String(row[5]),
					selectOne: String(row[6]) === "Y",
					selectAll: String(row[7]) === "Y",
					parentParameterName: row[8] ? String(row[8]) : undefined,
				});
			});
			const fleshedOutParams =
				reportDetails.reportParameters?.map((basicParam) => {
					const details = detailedParamsMap.get(basicParam.parameterName);
					return {
						...basicParam,
						...details,
					};
				}) || [];

			return {
				...reportDetails,
				reportParameters: fleshedOutParams,
			};
		},
		enabled: isOpen && !!reportId && !!reportName,
	});

	const { data: parametersWithOptions, isLoading: isLoadingOptions } = useQuery(
		{
			queryKey: [
				"report-parameter-options",
				reportDetails?.id,
				reportDetails?.reportName,
			],
			queryFn: async () => {
				if (!reportDetails?.reportParameters) return [];

				const enhancedParams = await Promise.all(
					reportDetails.reportParameters.map(async (param) => {
						// For now, fetch options without parent dependencies
						// Dependent parameters will be handled dynamically in the form

						// Skip fetching options for dependent parameters during initial load
						if (param.parentParameterName) {
							return { ...param, parameterData: [] };
						}

						const options = await fetchParameterOptions(param);
						const sanitizedOptions = options.map((opt) => ({
							...opt,
							name: String(opt.name || "").replace(/\./g, ""),
						}));
						return { ...param, parameterData: sanitizedOptions };
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

// Hook for fetching dependent parameter options dynamically
export function useDependentParameterOptions(
	param: ReportParameter,
	parentValues: Record<string, string>,
) {
	const hasParentValues = Object.values(parentValues).some(
		(v) => v && v !== "0" && v !== "-1" && v !== "",
	);
	return useQuery({
		queryKey: ["dependent-param-options", param.parameterName, parentValues],
		queryFn: () => fetchParameterOptions(param, parentValues),
		enabled:
			!!param.parameterName &&
			(param.parameterDisplayType === "select" ||
				param.parameterName.toLowerCase().includes("select")) &&
			hasParentValues,
	});
}
