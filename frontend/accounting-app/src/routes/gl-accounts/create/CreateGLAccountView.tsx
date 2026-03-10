import { Button } from "@fineract-apps/ui";
import { ArrowLeft } from "lucide-react";
import { Input, PageHeader, Select, Textarea } from "../../../components";
import type { FormErrors, GLAccountFormData } from "./useCreateGLAccount";

interface CreateGLAccountViewProps {
	formData: GLAccountFormData;
	errors: FormErrors;
	isSubmitting: boolean;
	onFormChange: (
		field: keyof GLAccountFormData,
		value: string | boolean,
	) => void;
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
		<div className="p-6 max-w-4xl mx-auto min-h-screen">
			<PageHeader
				title="Create GL Account"
				subtitle="Add a new General Ledger account"
				actions={[
					{
						label: "Back to GL Accounts",
						onClick: onCancel,
						variant: "outline" as const,
						icon: <ArrowLeft className="h-4 w-4" />,
					},
				]}
			/>

			<form onSubmit={onSubmit}>
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						Account Information
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Input
							label="Account Name *"
							value={formData.name}
							onChange={(e) => onFormChange("name", e.target.value)}
							error={errors.name}
							placeholder="e.g., Cash on Hand"
						/>

						<Input
							label="GL Code *"
							value={formData.glCode}
							onChange={(e) => onFormChange("glCode", e.target.value)}
							error={errors.glCode}
							placeholder="e.g., 1000"
						/>

						<Select
							label="Account Type *"
							value={formData.type}
							onChange={(e) => onFormChange("type", e.target.value)}
							options={[
								{ value: "", label: "Select Type" },
								{ value: "1", label: "Asset" },
								{ value: "2", label: "Liability" },
								{ value: "3", label: "Equity" },
								{ value: "4", label: "Income" },
								{ value: "5", label: "Expense" },
							]}
							error={errors.type}
						/>

						<Select
							label="Account Usage *"
							value={formData.usage}
							onChange={(e) => onFormChange("usage", e.target.value)}
							options={[
								{ value: "1", label: "Detail" },
								{ value: "2", label: "Header" },
							]}
							error={errors.usage}
						/>

						<div className="md:col-span-2">
							<Textarea
								label="Description"
								value={formData.description}
								onChange={(e) => onFormChange("description", e.target.value)}
								rows={3}
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
				</div>

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
