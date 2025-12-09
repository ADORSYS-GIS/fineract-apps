import { Card, Form, Input, SubmitButton } from "@fineract-apps/ui";
import { ErrorMessage, Field } from "formik";
import { X } from "lucide-react";
import { useMemo } from "react";
import { z } from "zod";
import type {
	ParameterFormValues,
	ReportParameter,
	ReportParameterModalProps,
} from "./ReportParameterModal.types";
import { useReportParameters } from "./useReportParameters";

export function ReportParameterModal({
	isOpen,
	onClose,
	report,
	onSubmit,
}: ReportParameterModalProps) {
	const { reportDetails, isLoading } = useReportParameters(
		report?.id ?? null,
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
				values[key] =
					param.parameterDefaultValue || (param.selectAll ? [] : "");
			});
		}
		return values;
	}, [reportDetails]);

	// Generate validation schema dynamically based on the report parameters
	const validationSchema = useMemo(() => {
		if (!reportDetails?.reportParameters) return undefined;

		const schemaShape: Record<string, z.ZodString | z.ZodArray<z.ZodString>> =
			{};
		reportDetails.reportParameters.forEach((param: ReportParameter) => {
			if (param.parameterDisplayType === "none") return;

			const key = param.parameterVariable || param.parameterName;
			const label = param.parameterLabel || param.parameterName;

			if (param.selectAll) {
				schemaShape[key] = z.array(z.string()).nonempty({
					message: `Please select at least one ${label}`,
				});
			} else {
				schemaShape[key] = z
					.string()
					.min(1, { message: `${label} is required` });
			}
		});

		return z.object(schemaShape);
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
					{isLoading ? (
						<p>Loading report parameters...</p>
					) : !reportDetails?.reportParameters ||
						reportDetails.reportParameters.length === 0 ? (
						<div>
							<p className="text-gray-600 mb-4">
								This report has no parameters. Click Run to execute it.
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
								Run Report
							</button>
						</div>
					) : (
						<Form
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={handleSubmit}
							className="p-0 shadow-none space-y-4"
						>
							{reportDetails.reportParameters.map((param: ReportParameter) => {
								if (param.parameterDisplayType === "none") return null;

								const key = param.parameterVariable || param.parameterName;
								const label = param.parameterLabel || param.parameterName;
								const options =
									param.parameterData?.map((opt) => ({
										label: opt.name,
										value: opt.id,
									})) || [];

								if (param.selectAll) {
									return (
										<div key={`${report?.id}-${param.id}`}>
											<label
												htmlFor={key}
												className="block text-sm font-medium mb-2"
											>
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
													<option
														key={String(option.value)}
														value={String(option.value)}
													>
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

								const inputType =
									param.parameterDisplayType === "select"
										? "select"
										: param.parameterDisplayType === "date"
											? "date"
											: "text";

								return (
									<Input
										key={`${report?.id}-${param.id}`}
										name={key}
										label={`${label}`}
										type={inputType}
										options={options}
										required
									/>
								);
							})}

							<div className="flex gap-3 pt-2">
								<button
									type="button"
									onClick={onClose}
									className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
								>
									Cancel
								</button>
								<SubmitButton label="Run Report" className="flex-1" />
							</div>
						</Form>
					)}
				</div>
			</Card>
		</div>
	);
}
