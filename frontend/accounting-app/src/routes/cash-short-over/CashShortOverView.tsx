import { Button, Card, Input } from "@fineract-apps/ui";
import {
	AlertTriangle,
	Calculator,
	CheckCircle,
	DollarSign,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import type { CashShortOverFormData, FormErrors } from "./useCashShortOver";

interface CashShortOverViewProps {
	formData: CashShortOverFormData;
	errors: FormErrors;
	variance: number;
	varianceType: "short" | "over" | "balanced";
	isSubmitting: boolean;
	onFormChange: (field: keyof CashShortOverFormData, value: string) => void;
	onSubmit: (e: React.FormEvent) => void;
	onReset: () => void;
}

export function CashShortOverView({
	formData,
	errors,
	variance,
	varianceType,
	isSubmitting,
	onFormChange,
	onSubmit,
	onReset,
}: CashShortOverViewProps) {
	const expectedAmount = Number.parseFloat(formData.expectedCash) || 0;
	const actualAmount = Number.parseFloat(formData.actualCash) || 0;

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="mb-6">
				<h1 className="text-2xl font-bold mb-2">Cash Short and Over Tracker</h1>
				<p className="text-gray-600">
					Track cash discrepancies and create correcting journal entries
				</p>
			</div>

			{/* Info Card */}
			<Card className="p-4 mb-6 bg-blue-50 border-blue-200">
				<div className="flex items-start gap-3">
					<Calculator className="h-5 w-5 text-blue-600 mt-0.5" />
					<div>
						<h3 className="font-semibold text-blue-900 mb-1">
							How Cash Short/Over Works
						</h3>
						<p className="text-sm text-blue-800">
							Enter the expected cash amount and the actual cash counted. The
							system will calculate the variance and create a correcting journal
							entry automatically. Cash shortages debit the Cash Short/Over
							account and credit Cash. Cash overages debit Cash and credit the
							Cash Short/Over account.
						</p>
					</div>
				</div>
			</Card>

			<form onSubmit={onSubmit}>
				<Card className="p-6 mb-6">
					<h2 className="text-lg font-semibold mb-4">Cash Count Details</h2>

					<div className="space-y-4">
						{/* Transaction Date */}
						<div>
							<label
								htmlFor="transactionDate"
								className="block text-sm font-medium mb-1"
							>
								Transaction Date
							</label>
							<Input
								id="transactionDate"
								type="date"
								value={formData.transactionDate}
								onChange={(e) =>
									onFormChange("transactionDate", e.target.value)
								}
								max={new Date().toISOString().split("T")[0]}
							/>
							{errors.transactionDate && (
								<p className="text-sm text-red-600 mt-1">
									{errors.transactionDate}
								</p>
							)}
						</div>

						{/* Expected Cash */}
						<div>
							<label
								htmlFor="expectedCash"
								className="block text-sm font-medium mb-1"
							>
								Expected Cash Amount ($)
							</label>
							<div className="relative">
								<DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<Input
									id="expectedCash"
									type="number"
									step="0.01"
									min="0"
									placeholder="0.00"
									value={formData.expectedCash}
									onChange={(e) => onFormChange("expectedCash", e.target.value)}
									className="pl-10"
								/>
							</div>
							{errors.expectedCash && (
								<p className="text-sm text-red-600 mt-1">
									{errors.expectedCash}
								</p>
							)}
						</div>

						{/* Actual Cash */}
						<div>
							<label
								htmlFor="actualCash"
								className="block text-sm font-medium mb-1"
							>
								Actual Cash Counted ($)
							</label>
							<div className="relative">
								<DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<Input
									id="actualCash"
									type="number"
									step="0.01"
									min="0"
									placeholder="0.00"
									value={formData.actualCash}
									onChange={(e) => onFormChange("actualCash", e.target.value)}
									className="pl-10"
								/>
							</div>
							{errors.actualCash && (
								<p className="text-sm text-red-600 mt-1">{errors.actualCash}</p>
							)}
						</div>

						{/* Cash GL Account */}
						<div>
							<label
								htmlFor="cashAccountId"
								className="block text-sm font-medium mb-1"
							>
								Cash GL Account
							</label>
							<Input
								id="cashAccountId"
								type="number"
								placeholder="Enter GL Account ID (e.g., 1)"
								value={formData.cashAccountId}
								onChange={(e) => onFormChange("cashAccountId", e.target.value)}
							/>
							{errors.cashAccountId && (
								<p className="text-sm text-red-600 mt-1">
									{errors.cashAccountId}
								</p>
							)}
							<p className="text-sm text-gray-500 mt-1">
								GL account for cash (typically an asset account)
							</p>
						</div>

						{/* Cash Short/Over Account */}
						<div>
							<label
								htmlFor="shortOverAccountId"
								className="block text-sm font-medium mb-1"
							>
								Cash Short/Over GL Account
							</label>
							<Input
								id="shortOverAccountId"
								type="number"
								placeholder="Enter GL Account ID"
								value={formData.shortOverAccountId}
								onChange={(e) =>
									onFormChange("shortOverAccountId", e.target.value)
								}
							/>
							{errors.shortOverAccountId && (
								<p className="text-sm text-red-600 mt-1">
									{errors.shortOverAccountId}
								</p>
							)}
							<p className="text-sm text-gray-500 mt-1">
								GL account for recording cash discrepancies (expense account for
								shortages, revenue for overages)
							</p>
						</div>

						{/* Comments */}
						<div>
							<label
								htmlFor="comments"
								className="block text-sm font-medium mb-1"
							>
								Comments (Optional)
							</label>
							<textarea
								id="comments"
								placeholder="Add notes about this cash count..."
								value={formData.comments}
								onChange={(e) => onFormChange("comments", e.target.value)}
								rows={3}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>
				</Card>

				{/* Variance Display */}
				{(formData.expectedCash || formData.actualCash) && (
					<Card
						className={`p-6 mb-6 ${
							varianceType === "balanced"
								? "bg-green-50 border-green-200"
								: varianceType === "short"
									? "bg-red-50 border-red-200"
									: "bg-yellow-50 border-yellow-200"
						}`}
					>
						<div className="flex items-start gap-3">
							{varianceType === "balanced" ? (
								<CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
							) : varianceType === "short" ? (
								<TrendingDown className="h-6 w-6 text-red-600 mt-0.5" />
							) : (
								<TrendingUp className="h-6 w-6 text-yellow-600 mt-0.5" />
							)}

							<div className="flex-1">
								<h3
									className={`font-semibold mb-2 ${
										varianceType === "balanced"
											? "text-green-900"
											: varianceType === "short"
												? "text-red-900"
												: "text-yellow-900"
									}`}
								>
									{varianceType === "balanced"
										? "Cash is Balanced"
										: varianceType === "short"
											? "Cash Shortage Detected"
											: "Cash Overage Detected"}
								</h3>

								<div className="grid grid-cols-3 gap-4 mb-3">
									<div>
										<p className="text-sm text-gray-600">Expected</p>
										<p className="text-lg font-semibold">
											${expectedAmount.toFixed(2)}
										</p>
									</div>
									<div>
										<p className="text-sm text-gray-600">Actual</p>
										<p className="text-lg font-semibold">
											${actualAmount.toFixed(2)}
										</p>
									</div>
									<div>
										<p className="text-sm text-gray-600">Variance</p>
										<p
											className={`text-lg font-bold ${
												varianceType === "balanced"
													? "text-green-700"
													: varianceType === "short"
														? "text-red-700"
														: "text-yellow-700"
											}`}
										>
											{variance >= 0 ? "+" : ""}${variance.toFixed(2)}
										</p>
									</div>
								</div>

								{varianceType !== "balanced" && (
									<div className="flex items-start gap-2 mt-3 pt-3 border-t border-gray-200">
										<AlertTriangle className="h-4 w-4 text-gray-500 mt-0.5" />
										<p className="text-sm text-gray-700">
											A correcting journal entry will be created to record this{" "}
											{varianceType === "short" ? "shortage" : "overage"}. The
											entry will{" "}
											{varianceType === "short"
												? "debit Cash Short/Over and credit Cash"
												: "debit Cash and credit Cash Short/Over"}{" "}
											for ${Math.abs(variance).toFixed(2)}.
										</p>
									</div>
								)}
							</div>
						</div>
					</Card>
				)}

				{/* Action Buttons */}
				<div className="flex items-center gap-3">
					<Button
						type="submit"
						disabled={isSubmitting || varianceType === "balanced"}
						className="flex-1"
					>
						{isSubmitting
							? "Creating Entry..."
							: varianceType === "balanced"
								? "No Entry Needed"
								: "Create Correcting Entry"}
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={onReset}
						disabled={isSubmitting}
					>
						Reset
					</Button>
				</div>
			</form>
		</div>
	);
}
