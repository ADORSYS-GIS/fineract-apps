import { Card, Form, Input, SubmitButton } from "@fineract-apps/ui";
import { useFormikContext } from "formik";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import type {
	ParameterFormValues,
	ReportParameter,
	ReportParameterModalProps,
} from "./ReportParameterModal.types";
import {
	useDependentParameterOptions,
	useReportParameters,
} from "./useReportParameters";

// Component for rendering individual parameter inputs with dependency support
function ParameterInput({
	param,
	allParams,
}: Readonly<{ param: ReportParameter; allParams: ReportParameter[] }>) {
	const { values } = useFormikContext<ParameterFormValues>();
	const key = param.parameterVariable || param.parameterName;
	const label = param.parameterLabel || param.parameterName;

	// Dynamically show/hide child parameters based on parent value
	if (param.parentParameterName) {
		const parentParam = allParams.find(
			(p) => p.parameterName === param.parentParameterName,
		);
		const parentKey =
			parentParam?.parameterVariable || parentParam?.parameterName;
		const parentValue = parentKey ? values[parentKey] : undefined;
		// Do not render child if parent is not selected or has a default/placeholder value
		if (!parentValue || parentValue === "0" || parentValue === "") {
			return null;
		}
	}

	// Determine the base options (for non-dependent fields)
	let options =
		param.parameterData?.map((opt) => ({
			label: opt.name,
			value: opt.id,
		})) || [];

	// Handle dependent parameters
	if (param.parentParameterName) {
		const parentParam = allParams.find(
			(p) => p.parameterName === param.parentParameterName,
		);
		const parentKey =
			parentParam?.parameterVariable || parentParam?.parameterName;
		const parentValue = parentKey ? values[parentKey] : undefined;

		const { data: dependentOptions } = useDependentParameterOptions(
			param,
			parentKey && parentValue ? { [parentKey]: String(parentValue) } : {},
		);

		// If we have dependent options, they become the list. Otherwise, the list is empty for now.
		options =
			dependentOptions?.map((opt) => ({
				label: opt.name,
				value: opt.id,
			})) || [];
	}

	// Post-process the options list to add "All" where appropriate
	const isProductField = (param.parameterVariable || param.parameterName)
		.toLowerCase()
		.includes("product");

	if (param.selectAll) {
		// For any "selectAll" field, ensure "All" is the first option.
		if (!options.some((o) => o.value === "-1")) {
			options.unshift({ label: "All", value: "-1" });
		}
	} else if (isProductField && options.length === 0) {
		// For the product field specifically, if it's not a "selectAll" field
		// and its dynamically fetched options are empty, add "All" as the only option.
		options.push({ label: "All", value: "-1" });
	}

	let inputType: "text" | "select" | "date" = "text";
	if (param.parameterDisplayType === "date") {
		inputType = "date";
	} else if (
		param.parameterDisplayType === "select" ||
		param.parameterName.toLowerCase().includes("select")
	) {
		inputType = "select";
	}

	return (
		<Input
			key={param.id}
			name={key}
			label={`${label}`}
			type={inputType}
			options={options}
			required
		/>
	);
}

export function ReportParameterModal({
	isOpen,
	onClose,
	report,
	onSubmit,
}: Readonly<ReportParameterModalProps>) {
	const { t } = useTranslation();
	const [outputType, setOutputType] = useState("HTML");
	const { reportDetails, isLoading } = useReportParameters(
		report?.id ?? null,
		report?.reportName ?? null,
		isOpen,
	);

	const handleSubmit = (values: ParameterFormValues) => {
		const dateFormatString = "dd MMMM yyyy";

		// Helper to format 'YYYY-MM-DD' to 'dd MMMM yyyy' without timezone issues
		const formatDate = (dateString: string) => {
			if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
			const [year, month, day] = dateString.split("-");
			const monthNames = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			];
			const monthIndex = parseInt(month, 10) - 1;
			return `${parseInt(day, 10)} ${monthNames[monthIndex]} ${year}`;
		};

		const parameters: Record<string, string> = {
			locale: "en",
			dateFormat: dateFormatString,
		};

		if (reportDetails?.reportType === "Pentaho") {
			parameters["output-type"] = outputType;
		}

		reportDetails?.reportParameters?.forEach((param) => {
			const formKey = param.parameterVariable || param.parameterName;
			let apiKey = `R_${formKey}`;
			// For Pentaho reports, the API expects the 'reportParameterName' as the variable
			if (
				reportDetails?.reportType === "Pentaho" &&
				param.reportParameterName
			) {
				apiKey = `R_${param.reportParameterName}`;
			}
			let value = values[formKey];

			// If it's a date parameter, format it for the backend.
			if (param.parameterDisplayType === "date" && typeof value === "string") {
				value = formatDate(value);
			}

			if (value !== undefined && value !== null && value !== "") {
				parameters[apiKey] = String(value);
			} else {
				parameters[apiKey] = "-1";
			}
		});

		onSubmit(parameters);
	};

	// Memoize initial values to prevent unnecessary re-renders
	const initialValues: ParameterFormValues = useMemo(() => {
		const values: ParameterFormValues = {};
		if (reportDetails?.reportParameters) {
			reportDetails.reportParameters.forEach((param: ReportParameter) => {
				const key = param.parameterVariable || param.parameterName;
				let defaultValue = param.parameterDefaultValue || "";

				// Handle "today" default for date parameters
				if (param.parameterDisplayType === "date") {
					if (defaultValue === "today" || !param.parameterDefaultValue) {
						const today = new Date().toISOString().split("T")[0];
						defaultValue = today;
					}
				}

				values[key] = defaultValue;
			});
		}
		return values;
	}, [reportDetails]);

	// Generate validation schema dynamically based on the report parameters
	const validationSchema = useMemo(() => {
		if (!reportDetails?.reportParameters) return undefined;

		const schemaShape: Record<string, z.ZodTypeAny> = {};
		reportDetails.reportParameters.forEach((param: ReportParameter) => {
			if (param.parameterDisplayType === "none") return;

			const key = param.parameterVariable || param.parameterName;
			const label = param.parameterLabel || param.parameterName;

			if (param.parameterDisplayType === "date") {
				// Date validation - required and validate format
				schemaShape[key] = z
					.string()
					.min(1, { message: t("reportParameters.requiredError", { label }) })
					.refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
						message: t("reportParameters.dateError", { label }),
					});
			} else {
				// Treat all other fields, including all types of selects, as required strings
				schemaShape[key] = z
					.string()
					.min(1, { message: t("reportParameters.requiredError", { label }) });
			}
		});

		return z.object(schemaShape) as z.ZodType<ParameterFormValues>;
	}, [reportDetails]);

	if (!isOpen) return null;

	return (
		<div
			key={report?.id}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
		>
			<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 p-0">
				<div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
					<h2 className="text-xl font-bold">{report?.reportName}</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full"
						type="button"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<div className="p-6">
					{(() => {
						if (isLoading) {
							return <p>{t("reportParameters.loading")}</p>;
						}
						if (
							!reportDetails?.reportParameters ||
							reportDetails.reportParameters.length === 0
						) {
							return (
								<div>
									<p className="text-gray-600 mb-4">
										{t("reportParameters.noParameters")}
									</p>
									<button
										onClick={() =>
											onSubmit({
												locale: "en",
												dateFormat: "yyyy-MM-dd",
											})
										}
										className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
										type="button"
									>
										{t("reportParameters.runReport")}
									</button>
								</div>
							);
						}
						return (
							<Form
								initialValues={initialValues}
								validationSchema={validationSchema}
								onSubmit={handleSubmit}
								className="p-0 shadow-none space-y-4"
							>
								{reportDetails.reportType === "Pentaho" && (
									<div>
										<label
											htmlFor="outputType"
											className="block text-sm font-medium mb-2"
										>
											Output Type
										</label>
										<select
											id="outputType"
											name="outputType"
											value={outputType}
											onChange={(e) => setOutputType(e.target.value)}
											className="w-full px-3 py-2 border border-gray-300 rounded-lg"
										>
											<option>Output Type</option>
											<option value="PDF">PDF format</option>
										</select>
									</div>
								)}
								{reportDetails.reportParameters.map(
									(param: ReportParameter) => {
										if (param.parameterDisplayType === "none") return null;
										return (
											<ParameterInput
												key={`${report?.id}-${param.id}`}
												param={param}
												allParams={reportDetails.reportParameters}
											/>
										);
									},
								)}

								<div className="flex gap-3 pt-2">
									<button
										type="button"
										onClick={onClose}
										className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
									>
										{t("reportParameters.cancel")}
									</button>
									<SubmitButton
										label={t("reportParameters.runReport")}
										className="flex-1"
									/>
								</div>
							</Form>
						);
					})()}
				</div>
			</Card>
		</div>
	);
}
