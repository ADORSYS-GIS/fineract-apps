import { type GetOfficesResponse } from "@fineract-apps/fineract-api";
import { Button } from "@fineract-apps/ui";
import { AlertTriangle, ArrowLeft, Lock } from "lucide-react";
import { Input, Select, Textarea } from "../../../components";
import type { ClosureFormData, FormErrors } from "./useCreateClosure";

interface CreateClosureViewProps {
	formData: ClosureFormData;
	errors: FormErrors;
	offices: GetOfficesResponse[];
	isLoadingOffices: boolean;
	isSubmitting: boolean;
	onFormChange: (field: keyof ClosureFormData, value: string) => void;
	onSubmit: (e: React.FormEvent) => void;
	onCancel: () => void;
}

export function CreateClosureView({
	formData,
	errors,
	offices,
	isLoadingOffices,
	isSubmitting,
	onFormChange,
	onSubmit,
	onCancel,
}: CreateClosureViewProps) {
	const officeOptions = offices.map((office) => ({
		value: String(office.id),
		label: office.nameDecorated || office.name || "",
	}));

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="mb-6">
				<button
					onClick={onCancel}
					type="button"
					className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to Closures
				</button>
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<Lock className="h-6 w-6" />
					Create Accounting Closure
				</h1>
				<p className="text-gray-600 mt-1">
					Lock an accounting period to prevent backdated transactions
				</p>
			</div>

			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
				<div className="flex items-start gap-2 text-yellow-800">
					<AlertTriangle className="h-5 w-5 mt-0.5" />
					<div className="text-sm">
						<p className="font-medium">Important</p>
						<p className="mt-1">
							Creating an accounting closure will prevent any transactions from
							being posted on or before the closing date. This action helps
							maintain period-end integrity. Only create closures for periods
							you're certain are complete.
						</p>
					</div>
				</div>
			</div>

			<form onSubmit={onSubmit}>
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						Closure Details
					</h2>
					<div className="space-y-4">
						<Input
							label="Closing Date *"
							type="date"
							value={formData.closingDate}
							onChange={(e) => onFormChange("closingDate", e.target.value)}
							max={new Date().toISOString().split("T")[0]}
							error={errors.closingDate}
							helperText="Transactions on or before this date will be locked"
						/>

						<Select
							label="Office *"
							value={formData.officeId}
							onChange={(e) => onFormChange("officeId", e.target.value)}
							options={[
								{
									value: "",
									label: isLoadingOffices
										? "Loading offices..."
										: "Select Office",
								},
								...officeOptions,
							]}
							error={errors.officeId}
							helperText="Select the office for this closure"
							disabled={isLoadingOffices}
						/>

						<Textarea
							label="Comments (Optional)"
							value={formData.comments}
							onChange={(e) => onFormChange("comments", e.target.value)}
							rows={3}
							placeholder="Add any notes about this closure (e.g., 'Q4 2024 Period-End Closure')"
						/>
					</div>
				</div>

				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
					<div className="flex items-start gap-2 text-blue-800">
						<Lock className="h-5 w-5 mt-0.5" />
						<div className="text-sm">
							<p className="font-medium">Closure Summary</p>
							<p className="mt-1">
								Closing Date:{" "}
								<span className="font-semibold">
									{formData.closingDate
										? new Date(formData.closingDate).toLocaleDateString(
												"en-US",
												{
													year: "numeric",
													month: "long",
													day: "numeric",
												},
											)
										: "Not selected"}
								</span>
							</p>
							<p className="mt-1">
								All transactions on or before this date will be locked and
								cannot be modified or deleted.
							</p>
						</div>
					</div>
				</div>

				<div className="flex justify-end gap-4">
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button
						type="submit"
						disabled={isSubmitting}
						className="flex items-center gap-2"
					>
						<Lock className="h-4 w-4" />
						{isSubmitting ? "Creating Closure..." : "Create Closure"}
					</Button>
				</div>
			</form>
		</div>
	);
}
