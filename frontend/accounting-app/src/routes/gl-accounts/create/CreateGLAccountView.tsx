import { Button } from "@fineract-apps/ui";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
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
	const { t } = useTranslation();
	return (
		<div className="p-6 max-w-4xl mx-auto min-h-screen">
			<PageHeader
				title={t("createGLAccount")}
				subtitle={t("addNewGeneralLedgerAccount")}
				actions={[
					{
						label: t("backToGLAccounts"),
						onClick: onCancel,
						variant: "outline" as const,
						icon: <ArrowLeft className="h-4 w-4" />,
					},
				]}
			/>

			<form onSubmit={onSubmit}>
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						{t("accountInformation")}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Input
							label={`${t("accountName")} *`}
							value={formData.name}
							onChange={(e) => onFormChange("name", e.target.value)}
							error={errors.name}
							placeholder={t("accountNamePlaceholder")}
						/>

						<Input
							label={`${t("glCode")} *`}
							value={formData.glCode}
							onChange={(e) => onFormChange("glCode", e.target.value)}
							error={errors.glCode}
							placeholder={t("glCodePlaceholder")}
						/>

						<Select
							label={`${t("accountType")} *`}
							value={formData.type}
							onChange={(e) => onFormChange("type", e.target.value)}
							options={[
								{ value: "", label: t("selectType") },
								{ value: "1", label: t("asset") },
								{ value: "2", label: t("liability") },
								{ value: "3", label: t("equity") },
								{ value: "4", label: t("income") },
								{ value: "5", label: t("expense") },
							]}
							error={errors.type}
						/>

						<Select
							label={`${t("usage")} *`}
							value={formData.usage}
							onChange={(e) => onFormChange("usage", e.target.value)}
							options={[
								{ value: "1", label: t("detail") },
								{ value: "2", label: t("header") },
							]}
							error={errors.usage}
						/>

						<div className="md:col-span-2">
							<Textarea
								label={t("description")}
								value={formData.description}
								onChange={(e) => onFormChange("description", e.target.value)}
								rows={3}
								placeholder={t("descriptionPlaceholder")}
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
									{t("allowManualJournalEntries")}
								</span>
							</label>
							<p className="text-sm text-gray-500 ml-6">
								{t("manualEntriesDescription")}
							</p>
						</div>
					</div>
				</div>

				<div className="flex justify-end gap-4">
					<Button type="button" variant="outline" onClick={onCancel}>
						{t("cancel")}
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? t("creating") : t("createGLAccountButton")}
					</Button>
				</div>
			</form>
		</div>
	);
}
