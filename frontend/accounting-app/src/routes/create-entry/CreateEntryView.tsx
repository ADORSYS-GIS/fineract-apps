import { Button, Card } from "@fineract-apps/ui";
import { AlertCircle, Minus, Plus } from "lucide-react";
import type { GLAccount } from "../gl-accounts/useGLAccounts";
import type { EntryFormData, EntryLine } from "./useCreateEntry";

interface CreateEntryViewProps {
	formData: EntryFormData;
	debits: EntryLine[];
	credits: EntryLine[];
	glAccounts: GLAccount[];
	isBalanced: boolean;
	isSubmitting: boolean;
	currencyCode?: string;
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
	onCancel: () => void;
}

export function CreateEntryView({
	formData,
	debits,
	credits,
	glAccounts,
	isBalanced,
	isSubmitting,
	currencyCode,
	onFormChange,
	onAddDebit,
	onRemoveDebit,
	onAddCredit,
	onRemoveCredit,
	onDebitChange,
	onCreditChange,
	onSubmit,
	onCancel,
}: CreateEntryViewProps) {
	const totalDebits = debits.reduce((sum, d) => sum + Number(d.amount || 0), 0);
	const totalCredits = credits.reduce(
		(sum, c) => sum + Number(c.amount || 0),
		0,
	);

	return (
		<div className="p-6 max-w-6xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Create Manual Journal Entry</h1>

			<form onSubmit={onSubmit}>
				<Card className="p-6 mb-6">
					<h2 className="text-lg font-semibold mb-4">Entry Details</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Transaction Date *
							</label>
							<input
								type="date"
								value={formData.transactionDate}
								onChange={(e) =>
									onFormChange("transactionDate", e.target.value)
								}
								required
								className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Reference Number
							</label>
							<input
								type="text"
								value={formData.referenceNumber}
								onChange={(e) =>
									onFormChange("referenceNumber", e.target.value)
								}
								placeholder="Optional reference number"
								className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Comments
							</label>
							<textarea
								value={formData.comments}
								onChange={(e) => onFormChange("comments", e.target.value)}
								rows={3}
								placeholder="Optional comments or description"
								className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>
				</Card>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					<Card className="p-6">
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
										<select
											value={debit.glAccountId}
											onChange={(e) =>
												onDebitChange(index, "glAccountId", e.target.value)
											}
											required
											className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
										>
											<option value="">Select GL Account</option>
											{glAccounts.map((account) => (
												<option key={account.id} value={account.id}>
													{account.name} - {account.glCode}
												</option>
											))}
										</select>
									</div>
									<div className="w-32">
										<input
											type="number"
											step="0.01"
											min="0"
											value={debit.amount}
											onChange={(e) =>
												onDebitChange(index, "amount", e.target.value)
											}
											placeholder="Amount"
											required
											className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
									{totalDebits.toLocaleString()} {currencyCode}
								</span>
							</div>
						</div>
					</Card>

					<Card className="p-6">
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
										<select
											value={credit.glAccountId}
											onChange={(e) =>
												onCreditChange(index, "glAccountId", e.target.value)
											}
											required
											className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
										>
											<option value="">Select GL Account</option>
											{glAccounts.map((account) => (
												<option key={account.id} value={account.id}>
													{account.name} - {account.glCode}
												</option>
											))}
										</select>
									</div>
									<div className="w-32">
										<input
											type="number"
											step="0.01"
											min="0"
											value={credit.amount}
											onChange={(e) =>
												onCreditChange(index, "amount", e.target.value)
											}
											placeholder="Amount"
											required
											className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
									{totalCredits.toLocaleString()} {currencyCode}
								</span>
							</div>
						</div>
					</Card>
				</div>

				{!isBalanced && (debits.length > 0 || credits.length > 0) && (
					<Card className="p-4 mb-6 bg-yellow-50 border-yellow-200">
						<div className="flex items-center gap-2 text-yellow-800">
							<AlertCircle className="h-5 w-5" />
							<p className="font-medium">
								Entry is not balanced. Debits and credits must be equal.
							</p>
						</div>
						<p className="text-sm text-yellow-700 mt-1 ml-7">
							Difference:{" "}
							{Math.abs(totalDebits - totalCredits).toLocaleString()}{" "}
							{currencyCode}
						</p>
					</Card>
				)}

				{isBalanced && totalDebits > 0 && (
					<Card className="p-4 mb-6 bg-green-50 border-green-200">
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
					</Card>
				)}

				<div className="flex justify-end gap-4">
					<Button type="button" variant="outline" onClick={onCancel}>
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
						{isSubmitting ? "Submitting..." : "Submit for Approval"}
					</Button>
				</div>
			</form>
		</div>
	);
}
