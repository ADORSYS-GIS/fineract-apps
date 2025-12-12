import {
	type CurrencyData,
	type GetGLAccountsResponse,
	type GetOfficesResponse,
	type GetPaymentTypesResponse,
} from "@fineract-apps/fineract-api";
import { Button } from "@fineract-apps/ui";
import { AlertCircle, Loader2, Minus, Plus } from "lucide-react";
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
				Create Manual Journal Entry
			</h1>

			<form onSubmit={onSubmit}>
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						Entry Details
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Select
							label="Office *"
							value={formData.officeId}
							onChange={(e) => onFormChange("officeId", e.target.value)}
							options={[
								{ value: "", label: "Select Office" },
								...officeOptions,
							]}
							required
						/>
						<Input
							label="Transaction Date *"
							type="date"
							value={formData.transactionDate}
							onChange={(e) => onFormChange("transactionDate", e.target.value)}
							required
						/>
						<Select
							label="Currency *"
							value={formData.currencyCode}
							onChange={(e) => onFormChange("currencyCode", e.target.value)}
							options={[
								{ value: "", label: "Select Currency" },
								...currencyOptions,
							]}
							required
						/>
						<Select
							label="Payment Type *"
							value={formData.paymentTypeId}
							onChange={(e) => onFormChange("paymentTypeId", e.target.value)}
							options={[
								{ value: "", label: "Select Payment Type" },
								...paymentTypeOptions,
							]}
							required
						/>
						<Input
							label="Reference Number"
							type="text"
							value={formData.referenceNumber}
							onChange={(e) => onFormChange("referenceNumber", e.target.value)}
							placeholder="Optional reference number"
						/>
						<div className="md:col-span-2">
							<Textarea
								label="Comments"
								value={formData.comments}
								onChange={(e) => onFormChange("comments", e.target.value)}
								rows={3}
								placeholder="Optional comments or description"
							/>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold">Debits</h2>
							<Button
								type="button"
								onClick={onAddDebit}
								size="sm"
								className="flex items-center gap-1"
							>
								<Plus className="h-4 w-4" />
								Add Debit
							</Button>
						</div>
						<div className="space-y-4">
							{debits.map((debit, index) => (
								<div key={index} className="flex gap-2">
									<div className="flex-1">
										<Select
											value={debit.glAccountId}
											onChange={(e) =>
												onDebitChange(index, "glAccountId", e.target.value)
											}
											required
											options={[
												{ value: "", label: "Select GL Account" },
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
											placeholder="Amount"
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
									No debit entries. Click "Add Debit" to add one.
								</p>
							)}
						</div>
						<div className="mt-4 pt-4 border-t">
							<div className="flex justify-between items-center">
								<span className="font-medium">Total Debits:</span>
								<span className="text-lg font-bold">
									${totalDebits.toLocaleString()}
								</span>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold">Credits</h2>
							<Button
								type="button"
								onClick={onAddCredit}
								size="sm"
								className="flex items-center gap-1"
							>
								<Plus className="h-4 w-4" />
								Add Credit
							</Button>
						</div>
						<div className="space-y-4">
							{credits.map((credit, index) => (
								<div key={index} className="flex gap-2">
									<div className="flex-1">
										<Select
											value={credit.glAccountId}
											onChange={(e) =>
												onCreditChange(index, "glAccountId", e.target.value)
											}
											required
											options={[
												{ value: "", label: "Select GL Account" },
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
											placeholder="Amount"
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
									No credit entries. Click "Add Credit" to add one.
								</p>
							)}
						</div>
						<div className="mt-4 pt-4 border-t">
							<div className="flex justify-between items-center">
								<span className="font-medium">Total Credits:</span>
								<span className="text-lg font-bold">
									${totalCredits.toLocaleString()}
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
								Entry is not balanced. Debits and credits must be equal.
							</p>
						</div>
						<p className="text-sm text-yellow-700 mt-1 ml-7">
							Difference: $
							{Math.abs(totalDebits - totalCredits).toLocaleString()}
						</p>
					</div>
				)}

				{isBalanced && totalDebits > 0 && (
					<div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
						<div className="flex items-center gap-2 text-green-800">
							<AlertCircle className="h-5 w-5" />
							<p className="font-medium">
								Entry is balanced and ready to submit.
							</p>
						</div>
						<p className="text-sm text-green-700 mt-1 ml-7">
							This entry will require approval before being posted to the
							ledger.
						</p>
					</div>
				)}

				<div className="flex justify-end gap-4">
					<Button type="button" variant="outline">
						Cancel
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
								Submitting...
							</>
						) : (
							"Submit for Approval"
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
