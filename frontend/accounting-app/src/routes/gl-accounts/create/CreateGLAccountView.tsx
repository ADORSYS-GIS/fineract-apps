import { Button, Card } from "@fineract-apps/ui";
import { ArrowLeft } from "lucide-react";
import type { FormErrors, GLAccountFormData } from "./useCreateGLAccount";

interface CreateGLAccountViewProps {
	formData: GLAccountFormData;
	errors: FormErrors;
	isSubmitting: boolean;
	onFormChange: (field: keyof GLAccountFormData, value: string | boolean) => void;
	onSubmit: (e: React.FormEvent) => void;
	onCancel: () => void;
}

export function CreateGLAccountView({
	formData,
	errors,
	isSubmitting,
	onFormChange,
	onSubmit,
	onCancel,
}: CreateGLAccountViewProps) {
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
				<h1 className="text-2xl font-bold">Create GL Account</h1>
				<p className="text-gray-600 mt-1">Add a new General Ledger account</p>
			</div>

			<form onSubmit={onSubmit}>
				<Card className="p-6 mb-6">
					<h2 className="text-lg font-semibold mb-4">Account Information</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Account Name *
							</label>
							<input
								type="text"
								value={formData.name}
								onChange={(e) => onFormChange("name", e.target.value)}
								className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
									errors.name
										? "border-red-500 focus:ring-red-500"
										: "focus:ring-blue-500"
								}`}
								placeholder="e.g., Cash on Hand"
							/>
							{errors.name && (
								<p className="text-sm text-red-600 mt-1">{errors.name}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								GL Code *
							</label>
							<input
								type="text"
								value={formData.glCode}
								onChange={(e) => onFormChange("glCode", e.target.value)}
								className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
									errors.glCode
										? "border-red-500 focus:ring-red-500"
										: "focus:ring-blue-500"
								}`}
								placeholder="e.g., 1000"
							/>
							{errors.glCode && (
								<p className="text-sm text-red-600 mt-1">{errors.glCode}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Account Type *
							</label>
							<select
								value={formData.type}
								onChange={(e) => onFormChange("type", e.target.value)}
								className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
									errors.type
										? "border-red-500 focus:ring-red-500"
										: "focus:ring-blue-500"
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
								<p className="text-sm text-red-600 mt-1">{errors.type}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Account Usage *
							</label>
							<select
								value={formData.usage}
								onChange={(e) => onFormChange("usage", e.target.value)}
								className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
									errors.usage
										? "border-red-500 focus:ring-red-500"
										: "focus:ring-blue-500"
								}`}
							>
								<option value="1">Detail</option>
								<option value="2">Header</option>
							</select>
							{errors.usage && (
								<p className="text-sm text-red-600 mt-1">{errors.usage}</p>
							)}
						</div>

						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Description
							</label>
							<textarea
								value={formData.description}
								onChange={(e) => onFormChange("description", e.target.value)}
								rows={3}
								className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Optional description of the account"
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
									className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
								/>
								<span className="text-sm font-medium text-gray-700">
									Allow Manual Journal Entries
								</span>
							</label>
							<p className="text-sm text-gray-500 ml-6">
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
						{isSubmitting ? "Creating..." : "Create GL Account"}
					</Button>
				</div>
			</form>
		</div>
	);
}
