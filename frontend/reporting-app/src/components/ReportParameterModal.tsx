import { ReportsService } from "@fineract-apps/fineract-api";
import { Card } from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type {
	ParameterFormValues,
	ReportDetails,
	ReportParameter,
	ReportParameterModalProps,
} from "./ReportParameterModal.types";

export function ReportParameterModal({
	isOpen,
	onClose,
	report,
	onSubmit,
}: ReportParameterModalProps) {
	const [formValues, setFormValues] = useState<ParameterFormValues>({});

	// Fetch report details including parameters
	const { data: reportDetails, isLoading } = useQuery({
		queryKey: ["report-details", report?.id],
		queryFn: async () => {
			if (!report?.id) return null;
			const response = await ReportsService.getV1ReportsById({
				id: report.id,
			});
			return response as unknown as ReportDetails;
		},
		enabled: isOpen && !!report?.id,
	});

	// Reset form when modal opens
	useEffect(() => {
		if (isOpen && reportDetails) {
			const initialValues: ParameterFormValues = {};
			reportDetails.reportParameters?.forEach((param: ReportParameter) => {
				if (param.parameterDefaultValue) {
					initialValues[param.parameterVariable] = param.parameterDefaultValue;
				}
			});
			setFormValues(initialValues);
		}
	}, [isOpen, reportDetails]);

	const handleInputChange = (paramName: string, value: string) => {
		setFormValues((prev) => ({
			...prev,
			[paramName]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Validate required fields
		const missingFields: string[] = [];
		reportDetails?.reportParameters?.forEach((param: ReportParameter) => {
			if (
				param.parameterDisplayType !== "none" &&
				!formValues[param.parameterVariable]
			) {
				missingFields.push(
					param.parameterLabel ||
						param.parameterName ||
						param.parameterVariable,
				);
			}
		});

		if (missingFields.length > 0) {
			toast.error(
				`Please fill in required fields: ${missingFields.join(", ")}`,
			);
			return;
		}

		// Add standard parameters
		const parameters: Record<string, string> = {
			...formValues,
			locale: "en",
			dateFormat: "dd MMMM yyyy",
		};

		onSubmit(parameters);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
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
									onSubmit({ locale: "en", dateFormat: "dd MMMM yyyy" })
								}
								className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
								type="button"
							>
								Run Report
							</button>
						</div>
					) : (
						<form onSubmit={handleSubmit}>
							<div className="space-y-4">
								{reportDetails.reportParameters.map(
									(param: ReportParameter) => {
										if (param.parameterDisplayType === "none") return null;

										return (
											<div key={param.id}>
												<label className="block text-sm font-medium mb-2">
													{param.parameterLabel || param.parameterName}
													<span className="text-red-500 ml-1">*</span>
												</label>

												{param.parameterDisplayType === "select" ? (
													<select
														className="w-full px-3 py-2 border border-gray-300 rounded-lg"
														value={formValues[param.parameterVariable] || ""}
														onChange={(e) =>
															handleInputChange(
																param.parameterVariable,
																e.target.value,
															)
														}
														required
													>
														<option value="">
															Select {param.parameterLabel}
														</option>
														{param.parameterData?.map((option) => (
															<option key={option.id} value={option.id}>
																{option.name}
															</option>
														))}
													</select>
												) : param.parameterDisplayType === "date" ? (
													<input
														type="date"
														className="w-full px-3 py-2 border border-gray-300 rounded-lg"
														value={formValues[param.parameterVariable] || ""}
														onChange={(e) =>
															handleInputChange(
																param.parameterVariable,
																e.target.value,
															)
														}
														required
													/>
												) : (
													<input
														type="text"
														className="w-full px-3 py-2 border border-gray-300 rounded-lg"
														value={formValues[param.parameterVariable] || ""}
														onChange={(e) =>
															handleInputChange(
																param.parameterVariable,
																e.target.value,
															)
														}
														required
													/>
												)}
											</div>
										);
									},
								)}
							</div>

							<div className="flex gap-3 mt-6">
								<button
									type="button"
									onClick={onClose}
									className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
								>
									Run Report
								</button>
							</div>
						</form>
					)}
				</div>
			</Card>
		</div>
	);
}
