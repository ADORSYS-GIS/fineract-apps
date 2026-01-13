import {
	type CurrencyData,
	type GetGLAccountsResponse,
	type GetOfficesResponse,
	type GetPaymentTypesResponse,
} from "@fineract-apps/fineract-api";
import { Button } from "@fineract-apps/ui";
import { AlertCircle, Loader2, Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/hooks/useCurrency";
import { Input, Select, Textarea } from "../../components";
import type { EntryFormData, EntryLine } from "./useCreateEntry";

interface CreateEntryViewProps {
	formData: EntryFormData;
	debits: EntryLine[];
	credits: EntryLine[];
	isBalanced: boolean;
	glAccounts: GetGLAccountsResponse[];
	offices: GetOfficesResponse[];
	currencies: CurrencyData[];
	paymentTypes: GetPaymentTypesResponse[];
	isLoading: boolean;
	isSubmitting: boolean;
	onFormChange: (field: keyof EntryFormData, value: string) => void;
	onAddDebit: () => void;
	onRemoveDebit: (index: number) => void;
	onAddCredit: () => void;
	onRemoveCredit: (index: number) => void;
	onDebitChange: (index: number, field: keyof EntryLine, value: string) => void;
	onCreditChange: (
		index: number,
		field: keyof EntryLine,
		value: string,
	) => void;
	onSubmit: (e: React.FormEvent) => void;
}

export function CreateEntryView({
	formData,
	debits,
	credits,
	isBalanced,
	glAccounts,
	offices,
	currencies,
	paymentTypes,
	isLoading,
	isSubmitting,
	onFormChange,
	onAddDebit,
	onRemoveDebit,
	onAddCredit,
	onRemoveCredit,
	onDebitChange,
	onCreditChange,
	onSubmit,
}: CreateEntryViewProps) {
	const { t } = useTranslation();
	const { currencyCode } = useCurrency();
	const totalDebits = debits.reduce((sum, d) => sum + Number(d.amount || 0), 0);
	const totalCredits = credits.reduce(
		(sum, c) => sum + Number(c.amount || 0),
		0,
	);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
			</div>
		);
	}

	const glAccountOptions = glAccounts.map((acc) => ({
		value: String(acc.id),
		label: `${acc.name} - ${acc.glCode}`,
	}));

	const officeOptions = offices.map((office) => ({
		value: String(office.id),
		label: office.nameDecorated || office.name || "",
	}));

	const currencyOptions = currencies.map((currency) => ({
		value: currency.code || "",
		label: `${currency.name} (${currency.code})`,
	}));

	const paymentTypeOptions = paymentTypes.map((pt) => ({
		value: String(pt.id),
		label: pt.name || "",
	}));

	return (
		<div className="p-6 max-w-6xl mx-auto min-h-screen">
			<h1 className="text-2xl font-bold text-gray-900 mb-6">
				{t("createEntry.title")}
			</h1>

			<form onSubmit={onSubmit}>
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						{t("createEntry.entryDetails")}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Select
							label={t("createEntry.officeLabel")}
							value={formData.officeId}
							onChange={(e) => onFormChange("officeId", e.target.value)}
							options={[
								{ value: "", label: t("createEntry.selectOffice") },
								...officeOptions,
							]}
							required
						/>
						<Input
							label={t("createEntry.transactionDateLabel")}
							type="date"
							value={formData.transactionDate}
							onChange={(e) => onFormChange("transactionDate", e.target.value)}
							required
						/>
						<Select
							label={t("createEntry.currencyLabel")}
							value={formData.currencyCode}
							onChange={(e) => onFormChange("currencyCode", e.target.value)}
							options={[
								{ value: "", label: t("createEntry.selectCurrency") },
								...currencyOptions,
							]}
							required
						/>
						<Select
							label={t("createEntry.paymentTypeLabel")}
							value={formData.paymentTypeId}
							onChange={(e) => onFormChange("paymentTypeId", e.target.value)}
							options={[
								{ value: "", label: t("createEntry.selectPaymentType") },
								...paymentTypeOptions,
							]}
							required
						/>
						<Input
							label={t("createEntry.referenceNumberLabel")}
							type="text"
							value={formData.referenceNumber}
							onChange={(e) => onFormChange("referenceNumber", e.target.value)}
							placeholder={t("createEntry.referenceNumberPlaceholder")}
						/>
						<div className="md:col-span-2">
							<Textarea
								label={t("createEntry.commentsLabel")}
								value={formData.comments}
								onChange={(e) => onFormChange("comments", e.target.value)}
								rows={3}
								placeholder={t("createEntry.commentsPlaceholder")}
							/>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold">
								{t("createEntry.debits")}
							</h2>
							<Button
								type="button"
								onClick={onAddDebit}
								size="sm"
								className="flex items-center gap-1"
							>
								<Plus className="h-4 w-4" />
								{t("createEntry.addDebit")}
							</Button>
						</div>
						<div className="space-y-4">
							{debits.map((debit, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: Form array needs persistent index for now
								<div key={index} className="flex gap-2">
									<div className="flex-1">
										<Select
											value={debit.glAccountId}
											onChange={(e) =>
												onDebitChange(index, "glAccountId", e.target.value)
											}
											required
											options={[
												{ value: "", label: t("createEntry.selectGLAccount") },
												...glAccountOptions,
											]}
										/>
									</div>
									<div className="w-32">
										<Input
											type="number"
											step="0.01"
											min="0"
											value={debit.amount}
											onChange={(e) =>
												onDebitChange(index, "amount", e.target.value)
											}
											placeholder={t("createEntry.amountPlaceholder")}
											required
										/>
									</div>
									<Button
										type="button"
										onClick={() => onRemoveDebit(index)}
										variant="ghost"
										size="sm"
										className="px-2"
									>
										<Minus className="h-4 w-4" />
									</Button>
								</div>
							))}
							{debits.length === 0 && (
								<p className="text-sm text-gray-500 text-center py-4">
									{t("createEntry.noDebitEntries")}
								</p>
							)}
						</div>
						<div className="mt-4 pt-4 border-t">
							<div className="flex justify-between items-center">
								<span className="font-medium">
									{t("createEntry.totalDebits")}
								</span>
								<span className="text-lg font-bold">
									{currencyCode} {totalDebits.toLocaleString()}
								</span>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold">
								{t("createEntry.credits")}
							</h2>
							<Button
								type="button"
								onClick={onAddCredit}
								size="sm"
								className="flex items-center gap-1"
							>
								<Plus className="h-4 w-4" />
								{t("createEntry.addCredit")}
							</Button>
						</div>
						<div className="space-y-4">
							{credits.map((credit, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: Form array needs persistent index for now
								<div key={index} className="flex gap-2">
									<div className="flex-1">
										<Select
											value={credit.glAccountId}
											onChange={(e) =>
												onCreditChange(index, "glAccountId", e.target.value)
											}
											required
											options={[
												{ value: "", label: t("createEntry.selectGLAccount") },
												...glAccountOptions,
											]}
										/>
									</div>
									<div className="w-32">
										<Input
											type="number"
											step="0.01"
											min="0"
											value={credit.amount}
											onChange={(e) =>
												onCreditChange(index, "amount", e.target.value)
											}
											placeholder={t("createEntry.amountPlaceholder")}
											required
										/>
									</div>
									<Button
										type="button"
										onClick={() => onRemoveCredit(index)}
										variant="ghost"
										size="sm"
										className="px-2"
									>
										<Minus className="h-4 w-4" />
									</Button>
								</div>
							))}
							{credits.length === 0 && (
								<p className="text-sm text-gray-500 text-center py-4">
									{t("createEntry.noCreditEntries")}
								</p>
							)}
						</div>
						<div className="mt-4 pt-4 border-t">
							<div className="flex justify-between items-center">
								<span className="font-medium">
									{t("createEntry.totalCredits")}
								</span>
								<span className="text-lg font-bold">
									{currencyCode} {totalCredits.toLocaleString()}
								</span>
							</div>
						</div>
					</div>
				</div>

				{!isBalanced && (debits.length > 0 || credits.length > 0) && (
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
						<div className="flex items-center gap-2 text-yellow-800">
							<AlertCircle className="h-5 w-5" />
							<p className="font-medium">
								{t("createEntry.unbalancedWarning")}
							</p>
						</div>
						<p className="text-sm text-yellow-700 mt-1 ml-7">
							{t("createEntry.unbalancedDifference")} {currencyCode}{" "}
							{Math.abs(totalDebits - totalCredits).toLocaleString()}
						</p>
					</div>
				)}

				{isBalanced && totalDebits > 0 && (
					<div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
						<div className="flex items-center gap-2 text-green-800">
							<AlertCircle className="h-5 w-5" />
							<p className="font-medium">{t("createEntry.balancedMessage")}</p>
						</div>
						<p className="text-sm text-green-700 mt-1 ml-7">
							{t("createEntry.approvalMessage")}
						</p>
					</div>
				)}

				<div className="flex justify-end gap-4">
					<Button type="button" variant="outline">
						{t("createEntry.cancel")}
					</Button>
					<Button
						type="submit"
						disabled={
							!isBalanced ||
							debits.length === 0 ||
							credits.length === 0 ||
							isSubmitting
						}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								{t("createEntry.submitting")}...
							</>
						) : (
							t("createEntry.submitForApproval")
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
