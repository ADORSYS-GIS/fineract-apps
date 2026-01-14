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

			// First get basic report info
			const basicResponse = (await ReportsService.getV1ReportsById({
				id: reportId,
			})) as unknown as ReportDetails;

			// Then get the full parameter list using the template approach
			const headers = {
				...OpenAPI.HEADERS,
				Authorization: `Basic ${btoa(`${OpenAPI.USERNAME}:${OpenAPI.PASSWORD}`)}`,
			};

			const fullParamUrl = `${OpenAPI.BASE}/v1/runreports/FullParameterList?R_reportListing='${reportName}'&parameterType=true`;
			const fullParamResponse = await fetch(fullParamUrl, { headers });

			if (!fullParamResponse.ok) {
				throw new Error(
					`Failed to fetch parameter list: ${fullParamResponse.status}`,
				);
			}

			const fullParamData: FullParameterListResponse =
				await fullParamResponse.json();

			// Transform the full parameter list into ReportParameter format
			const reportParameters: ReportParameter[] = fullParamData.data.map(
				(item, index) => {
					const row = item.row;
					const param: ReportParameter = {
						id: index + 1,
						parameterId: index + 1,
						reportId: reportId,
						parameterName: String(row[0]), // parameter_name
						parameterVariable: String(row[1]), // parameter_variable
						reportParameterName: String(row[1]), // parameter_variable
						parameterLabel: String(row[2]), // parameter_label
						parameterDisplayType: String(row[3]) as
							| "text"
							| "select"
							| "date"
							| "none", // parameter_displayType
						parameterFormatType: String(row[4]), // parameter_FormatType
						parameterDefaultValue: String(row[5]), // parameter_default
						selectOne: String(row[7]) === "Y", // selectOne
						selectAll: String(row[8]) === "Y", // selectAll
						parentParameterName: row[9] ? String(row[9]) : undefined, // parentParameterName
					};
					return param;
				},
			);

			// Normalize parameter variable and label (keeping existing logic for compatibility)
			const normalizedParams = reportParameters.map((param) => {
				let variableName = param.reportParameterName || param.parameterVariable;
				if (!variableName && param.parameterName) {
					const baseName = param.parameterName.replace(/Select(One|All)$/, "");
					variableName = baseName.charAt(0).toLowerCase() + baseName.slice(1);
				}

				let label = param.parameterLabel;
				if (!label && variableName) {
					const spaced = variableName.replaceAll(/([A-Z])/g, " $1");
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

			// Fix for missing dependencies: Link loan officer parameters to office parameters
			// We look for a parameter that maps to the 'officeId' variable
			const officeParam = normalizedParams.find(
				(p) =>
					p.parameterVariable === "officeId" ||
					p.parameterName === "OfficeIdSelectOne",
			);

			if (officeParam) {
				for (const param of normalizedParams) {
					if (
						param.parameterName === "loanOfficerIdSelectAll" &&
						!param.parentParameterName
					) {
						console.debug(
							`[ReportParams] Linking ${param.parameterName} to parent ${officeParam.parameterName}`,
						);
						param.parentParameterName = officeParam.parameterName;
					}
				}
			}

			// Fix for missing dependencies: Link loan product parameters to currency parameters
			// We look for a parameter that maps to the 'currencyId' variable
			const currencyParam = normalizedParams.find(
				(p) =>
					p.parameterVariable === "currencyId" ||
					p.parameterName.toLowerCase().includes("currency"),
			);

			if (currencyParam) {
				for (const param of normalizedParams) {
					if (
						param.parameterName === "loanProductIdSelectAll" &&
						!param.parentParameterName
					) {
						console.debug(
							`[ReportParams] Linking ${param.parameterName} to parent ${currencyParam.parameterName}`,
						);
						param.parentParameterName = currencyParam.parameterName;
					}
				}
			}

			console.debug("[ReportParams] Normalized Parameters:", normalizedParams);

			return {
				...basicResponse,
				reportParameters: normalizedParams,
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
	return useQuery({
		queryKey: ["dependent-param-options", param.parameterName, parentValues],
		queryFn: () => fetchParameterOptions(param, parentValues),
		enabled: !!param.parameterName && param.parameterDisplayType === "select",
	});
}
