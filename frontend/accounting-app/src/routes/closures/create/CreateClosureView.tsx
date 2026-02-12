import { type GetOfficesResponse } from "@fineract-apps/fineract-api";
import { Button } from "@fineract-apps/ui";
import { AlertTriangle, ArrowLeft, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
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
	const { t } = useTranslation();
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
					{t("createClosure.backToClosures")}
				</button>
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<Lock className="h-6 w-6" />
					{t("createClosure.title")}
				</h1>
				<p className="text-gray-600 mt-1">{t("createClosure.subtitle")}</p>
			</div>

			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
				<div className="flex items-start gap-2 text-yellow-800">
					<AlertTriangle className="h-5 w-5 mt-0.5" />
					<div className="text-sm">
						<p className="font-medium">{t("createClosure.important")}</p>
						<p className="mt-1">{t("createClosure.importantMessage")}</p>
					</div>
				</div>
			</div>

			<form onSubmit={onSubmit}>
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						{t("createClosure.closureDetails")}
					</h2>
					<div className="space-y-4">
						<Input
							label={t("createClosure.closingDateLabel")}
							type="date"
							value={formData.closingDate}
							onChange={(e) => onFormChange("closingDate", e.target.value)}
							max={new Date().toISOString().split("T")[0]}
							error={errors.closingDate}
							helperText={t("createClosure.closingDateHelperText")}
						/>

						<Select
							label={t("createClosure.officeLabel")}
							value={formData.officeId}
							onChange={(e) => onFormChange("officeId", e.target.value)}
							options={[
								{
									value: "",
									label: isLoadingOffices
										? t("createClosure.loadingOffices")
										: t("createClosure.selectOffice"),
								},
								...officeOptions,
							]}
							error={errors.officeId}
							helperText={t("createClosure.officeHelperText")}
							disabled={isLoadingOffices}
						/>

						<Textarea
							label={t("createClosure.commentsLabel")}
							value={formData.comments}
							onChange={(e) => onFormChange("comments", e.target.value)}
							rows={3}
							placeholder={t("createClosure.commentsPlaceholder")}
						/>
					</div>
				</div>

				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
					<div className="flex items-start gap-2 text-blue-800">
						<Lock className="h-5 w-5 mt-0.5" />
						<div className="text-sm">
							<p className="font-medium">{t("createClosure.summaryTitle")}</p>
							<p className="mt-1">
								{t("createClosure.summaryClosingDate")}{" "}
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
										: t("createClosure.summaryNotSelected")}
								</span>
							</p>
							<p className="mt-1">{t("createClosure.summaryMessage")}</p>
						</div>
					</div>
				</div>

				<div className="flex justify-end gap-4">
					<Button type="button" variant="outline" onClick={onCancel}>
						{t("createClosure.cancel")}
					</Button>
					<Button
						type="submit"
						disabled={isSubmitting}
						className="flex items-center gap-2"
					>
						<Lock className="h-4 w-4" />
						{isSubmitting
							? t("createClosure.creatingClosure")
							: t("createClosure.createClosure")}
					</Button>
				</div>
			</form>
		</div>
	);
}
