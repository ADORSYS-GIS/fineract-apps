import { Card, Form, Input, SubmitButton } from "@fineract-apps/ui";
import { ErrorMessage, Field, useFormikContext } from "formik";
import { X } from "lucide-react";
import { useMemo } from "react";
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
function ParameterInput({ param }: Readonly<{ param: ReportParameter }>) {
	const { values } = useFormikContext<ParameterFormValues>();
	const key = param.parameterVariable || param.parameterName;
	const label = param.parameterLabel || param.parameterName;

	// Handle dependent parameters
	let options =
		param.parameterData?.map((opt) => ({
			label: opt.name,
			value: opt.id,
		})) || [];

	if (param.parentParameterName) {
		// This is a dependent parameter - get parent value and fetch dynamic options
		const parentKey =
			param.parentParameterName
				.replace(/Select(One|All)$/, "")
				.charAt(0)
				.toLowerCase() +
			param.parentParameterName.replace(/Select(One|All)$/, "").slice(1);
		const parentValue = values[parentKey];

		// Handle both single values and arrays
		let parentValues: Record<string, string> = {};
		if (parentValue) {
			if (Array.isArray(parentValue)) {
				// For multi-select, use the first value or join them
				parentValues[parentKey] =
					parentValue.length > 0 ? String(parentValue[0]) : "";
			} else {
				parentValues[parentKey] = String(parentValue);
			}
		}

		const { data: dependentOptions } = useDependentParameterOptions(
			param,
			parentValues,
		);

		if (dependentOptions) {
			options = dependentOptions.map((opt) => ({
				label: opt.name,
				value: opt.id,
			}));
		}
	}

	if (param.selectAll) {
		return (
			<div key={`${param.id}`}>
				<label htmlFor={key} className="block text-sm font-medium mb-2">
					{label}
					<span className="text-red-500 ml-1">*</span>
				</label>
				<Field
					as="select"
					multiple
					id={key}
					name={key}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg"
				>
					{options.map((option) => (
						<option key={String(option.value)} value={String(option.value)}>
							{option.label}
						</option>
					))}
				</Field>
				<ErrorMessage
					name={key}
					component="div"
					className="mt-1 text-sm text-red-600"
				/>
			</div>
		);
	}

	let inputType: "text" | "select" | "date" = "text";
	if (param.parameterDisplayType === "select") {
		inputType = "select";
	} else if (param.parameterDisplayType === "date") {
		inputType = "date";
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
	const { reportDetails, isLoading } = useReportParameters(
		report?.id ?? null,
		report?.reportName ?? null,
		isOpen,
	);

	const handleSubmit = (values: ParameterFormValues) => {
		const parameters: Record<string, string> = {
			locale: "en",
			dateFormat: "yyyy-MM-dd",
		};

		reportDetails?.reportParameters?.forEach((param) => {
			const formKey = param.parameterVariable || param.parameterName;
			const apiKey = `R_${formKey}`;
			const value = values[formKey];

			if (Array.isArray(value)) {
				if (value.length > 0) {
					parameters[apiKey] = value.join(",");
				} else {
					parameters[apiKey] = "-1";
				}
			} else if (value !== undefined && value !== null && value !== "") {
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
				let defaultValue =
					param.parameterDefaultValue || (param.selectAll ? [] : "");

				// Handle "today" default for date parameters
				if (param.parameterDisplayType === "date") {
					if (defaultValue === "today" || !param.parameterDefaultValue) {
						const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
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

			if (param.selectAll) {
				schemaShape[key] = z.array(z.string()).nonempty({
					message: t("reportParameters.selectPlaceholder", { label }),
				});
			} else if (param.parameterDisplayType === "date") {
				// Date validation - required and validate format
				schemaShape[key] = z
					.string()
					.min(1, { message: t("reportParameters.requiredError", { label }) })
					.refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
						message: t("reportParameters.dateError", { label }),
					});
			} else {
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
								{reportDetails.reportParameters.map(
									(param: ReportParameter) => {
										if (param.parameterDisplayType === "none") return null;
										return (
											<ParameterInput
												key={`${report?.id}-${param.id}`}
												param={param}
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
