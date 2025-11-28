import { Button, Card } from "@fineract-apps/ui";
import { AlertTriangle, ArrowLeft, Lock } from "lucide-react";
import type { ClosureFormData, FormErrors } from "./useCreateClosure";

interface CreateClosureViewProps {
	formData: ClosureFormData;
	errors: FormErrors;
	isSubmitting: boolean;
	onFormChange: (field: keyof ClosureFormData, value: string) => void;
	onSubmit: (e: React.FormEvent) => void;
	onCancel: () => void;
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/closures/create/CreateClosureView")({
	component: CreateClosureView,
});

export function CreateClosureView({
	formData,
	errors,
	isSubmitting,
	onFormChange,
	onSubmit,
	onCancel,
}: CreateClosureViewProps) {
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

			<Card className="p-4 mb-6 bg-yellow-50 border-yellow-200">
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
			</Card>

			<form onSubmit={onSubmit}>
				<Card className="p-6 mb-6">
					<h2 className="text-lg font-semibold mb-4">Closure Details</h2>
					<div className="space-y-4">
						<div>
							<label
								htmlFor="closingDate"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Closing Date <span className="text-red-500">*</span>
							</label>
							<input
								type="date"
								id="closingDate"
								value={formData.closingDate}
								onChange={(e) => onFormChange("closingDate", e.target.value)}
								max={new Date().toISOString().split("T")[0]}
								className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.closingDate ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{errors.closingDate && (
								<p className="text-red-600 text-sm mt-1">
									{errors.closingDate}
								</p>
							)}
							<p className="text-sm text-gray-500 mt-1">
								Transactions on or before this date will be locked
							</p>
						</div>

						<div>
							<label
								htmlFor="officeId"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Office <span className="text-red-500">*</span>
							</label>
							<select
								id="officeId"
								value={formData.officeId}
								onChange={(e) => onFormChange("officeId", e.target.value)}
								className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.officeId ? "border-red-500" : "border-gray-300"
								}`}
							>
								<option value="1">Head Office</option>
								{/* In production, this would be populated from offices API */}
							</select>
							{errors.officeId && (
								<p className="text-red-600 text-sm mt-1">{errors.officeId}</p>
							)}
							<p className="text-sm text-gray-500 mt-1">
								Select the office for this closure
							</p>
						</div>

						<div>
							<label
								htmlFor="comments"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Comments (Optional)
							</label>
							<textarea
								id="comments"
								value={formData.comments}
								onChange={(e) => onFormChange("comments", e.target.value)}
								rows={3}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Add any notes about this closure (e.g., 'Q4 2024 Period-End Closure')"
							/>
						</div>
					</div>
				</Card>

				<Card className="p-4 mb-6 bg-blue-50 border-blue-200">
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
				</Card>

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
