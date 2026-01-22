import { Button, Card } from "@fineract-apps/ui";
import { ArrowLeft } from "lucide-react";
import type { FormErrors, GLAccountFormData } from "./useEditGLAccount";

interface EditGLAccountViewProps {
	formData: GLAccountFormData;
	errors: FormErrors;
	isLoading: boolean;
	isSubmitting: boolean;
	onFormChange: (
		field: keyof GLAccountFormData,
		value: string | boolean,
	) => void;
	onSubmit: (e: React.FormEvent) => void;
	onCancel: () => void;
}

export function EditGLAccountView({
	formData,
	errors,
	isLoading,
	isSubmitting,
	onFormChange,
	onSubmit,
	onCancel,
}: EditGLAccountViewProps) {
	if (isLoading) {
		return (
			<div className="p-6 max-w-4xl mx-auto">
				<Card className="p-6">
					<div className="animate-pulse space-y-4">
						<div className="h-8 bg-gray-200 rounded w-1/3" />
						<div className="h-4 bg-gray-200 rounded w-1/2" />
						<div className="h-10 bg-gray-200 rounded" />
						<div className="h-10 bg-gray-200 rounded" />
						<div className="h-10 bg-gray-200 rounded" />
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="mb-6">
				<button
					onClick={onCancel}
					type="button"
					className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to GL Accounts
				</button>
				<h1 className="text-2xl font-bold">Edit GL Account</h1>
				<p className="text-gray-600 mt-1">
					Update General Ledger account information
				</p>
			</div>

			<form onSubmit={onSubmit}>
				<Card className="p-6 mb-6">
					<h2 className="text-lg font-semibold mb-4">Account Information</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Account Name <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="name"
								value={formData.name}
								onChange={(e) => onFormChange("name", e.target.value)}
								className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.name ? "border-red-500" : "border-gray-300"
								}`}
								placeholder="e.g., Cash on Hand"
							/>
							{errors.name && (
								<p className="text-red-600 text-sm mt-1">{errors.name}</p>
							)}
						</div>

						<div>
							<label
								htmlFor="glCode"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								GL Code <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="glCode"
								value={formData.glCode}
								onChange={(e) => onFormChange("glCode", e.target.value)}
								className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.glCode ? "border-red-500" : "border-gray-300"
								}`}
								placeholder="e.g., 1000"
							/>
							{errors.glCode && (
								<p className="text-red-600 text-sm mt-1">{errors.glCode}</p>
							)}
						</div>

						<div>
							<label
								htmlFor="type"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Account Type <span className="text-red-500">*</span>
							</label>
							<select
								id="type"
								value={formData.type}
								onChange={(e) => onFormChange("type", e.target.value)}
								className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.type ? "border-red-500" : "border-gray-300"
								}`}
							>
								<option value="">Select Type</option>
								<option value="1">Asset</option>
								<option value="2">Liability</option>
								<option value="3">Equity</option>
								<option value="4">Income</option>
								<option value="5">Expense</option>
							</select>
							{errors.type && (
								<p className="text-red-600 text-sm mt-1">{errors.type}</p>
							)}
						</div>

						<div>
							<label
								htmlFor="usage"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Account Usage <span className="text-red-500">*</span>
							</label>
							<select
								id="usage"
								value={formData.usage}
								onChange={(e) => onFormChange("usage", e.target.value)}
								className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
									errors.usage ? "border-red-500" : "border-gray-300"
								}`}
							>
								<option value="">Select Usage</option>
								<option value="1">Detail</option>
								<option value="2">Header</option>
							</select>
							{errors.usage && (
								<p className="text-red-600 text-sm mt-1">{errors.usage}</p>
							)}
							<p className="text-sm text-gray-500 mt-1">
								Detail accounts can have transactions posted to them, Header
								accounts are for grouping only
							</p>
						</div>

						<div>
							<label
								htmlFor="parentId"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Parent Account (Optional)
							</label>
							<input
								type="text"
								id="parentId"
								value={formData.parentId}
								onChange={(e) => onFormChange("parentId", e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Parent Account ID"
							/>
							<p className="text-sm text-gray-500 mt-1">
								Enter the ID of the parent account for hierarchical grouping
							</p>
						</div>

						<div className="md:col-span-2">
							<label
								htmlFor="description"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Description
							</label>
							<textarea
								id="description"
								value={formData.description}
								onChange={(e) => onFormChange("description", e.target.value)}
								rows={3}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter a description for this account"
							/>
						</div>

						<div className="md:col-span-2">
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={formData.manualEntriesAllowed}
									onChange={(e) =>
										onFormChange("manualEntriesAllowed", e.target.checked)
									}
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<span className="text-sm font-medium text-gray-700">
									Allow Manual Journal Entries
								</span>
							</label>
							<p className="text-sm text-gray-500 mt-1 ml-6">
								If enabled, this account can be used in manual journal entries
							</p>
						</div>
					</div>
				</Card>

				<div className="flex justify-end gap-4">
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Updating..." : "Update GL Account"}
					</Button>
				</div>
			</form>
		</div>
	);
}
