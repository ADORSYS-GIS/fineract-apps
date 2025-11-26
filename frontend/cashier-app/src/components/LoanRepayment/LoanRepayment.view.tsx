import {
	GetLoansLoanIdResponse,
	PaymentType,
} from "@fineract-apps/fineract-api";
import { Button, Card } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Receipt } from "@/components/Receipt";

interface LoanRepaymentViewProps {
	loan: GetLoansLoanIdResponse;
	amount: string;
	setAmount: (amount: string) => void;
	paymentTypeId: string;
	setPaymentTypeId: (id: string) => void;
	transactionDate: Date;
	setTransactionDate: (date: Date) => void;
	note: string;
	setNote: (note: string) => void;
	handleSubmit: (e: React.FormEvent) => void;
	isSubmitting: boolean;
	paymentTypes: PaymentType[];
	transactionId: number | null;
	setTransactionId: (id: number | null) => void;
}

export const LoanRepaymentView: React.FC<LoanRepaymentViewProps> = ({
	loan,
	amount,
	setAmount,
	paymentTypeId,
	setPaymentTypeId,
	transactionDate,
	setTransactionDate,
	note,
	setNote,
	handleSubmit,
	isSubmitting,
	paymentTypes,
	transactionId,
	setTransactionId,
}) => {
	const { t } = useTranslation();

	return (
		<div className="p-8 bg-gray-50 min-h-screen">
			<div className="max-w-6xl mx-auto space-y-8">
				<div className="mb-4">
					<Link to="/repayment">
						<Button variant="outline" className="flex items-center">
							<ArrowLeft className="w-4 h-4 mr-2" />
							{t("backToSearch")}
						</Button>
					</Link>
				</div>
				<Card>
					<div className="p-6">
						<h2 className="text-xl font-semibold text-gray-700 mb-4">
							{t("clientSummary")}
						</h2>
						<div className="flex items-center mb-6">
							<div className="w-16 h-16 bg-gray-200 rounded-full mr-4"></div>
							<div>
								<p className="text-lg font-bold text-gray-800">
									{loan.clientName}
								</p>
								<p className="text-sm text-gray-500">
									{t("account")}: {loan.accountNo}
								</p>
							</div>
						</div>

						<hr className="my-6" />

						<h2 className="text-xl font-semibold text-gray-700 mb-4">
							{t("loanSummary")}
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="bg-gray-100 p-4 rounded-lg">
								<p className="text-sm text-gray-500">
									{t("outstandingBalance")}
								</p>
								<p className="text-xl font-bold text-gray-800">
									{new Intl.NumberFormat("en-US").format(
										loan.summary?.totalOutstanding || 0,
									)}{" "}
									XAF
								</p>
							</div>
							<div className="bg-gray-100 p-4 rounded-lg">
								<p className="text-sm text-gray-500">{t("nextInstallment")}</p>
								<p className="text-xl font-bold text-gray-800">
									{new Intl.NumberFormat("en-US").format(
										loan.summary?.totalOutstanding || 0,
									)}{" "}
									XAF
								</p>
							</div>
							<div className="bg-gray-100 p-4 rounded-lg">
								<p className="text-sm text-gray-500">{t("dueDate")}</p>
								<p className="text-xl font-bold text-gray-800">
									{loan.timeline?.expectedMaturityDate
										? format(
												new Date(
													loan.timeline
														.expectedMaturityDate as unknown as string,
												),
												"dd MMM yyyy",
											)
										: "N/A"}
								</p>
							</div>
						</div>
					</div>
				</Card>

				<Card>
					<div className="p-6">
						<h2 className="text-xl font-semibold text-gray-700 mb-6">
							{t("transactionForm")}
						</h2>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label
										htmlFor="amount"
										className="block text-sm font-medium text-gray-700"
									>
										{t("repaymentAmount")}
									</label>
									<input
										type="number"
										id="amount"
										value={amount}
										onChange={(e) => setAmount(e.target.value)}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base p-3"
										required
										placeholder={t("enterRepaymentAmount")}
									/>
								</div>
								<div>
									<label
										htmlFor="transactionDate"
										className="block text-sm font-medium text-gray-700"
									>
										{t("transactionDate")}
									</label>
									<input
										type="date"
										id="transactionDate"
										value={format(transactionDate, "yyyy-MM-dd")}
										onChange={(e) =>
											setTransactionDate(new Date(e.target.value))
										}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base p-3"
										required
									/>
								</div>
							</div>
							<div>
								<label
									htmlFor="paymentTypeId"
									className="block text-sm font-medium text-gray-700"
								>
									{t("paymentType")}
								</label>
								<select
									id="paymentTypeId"
									value={paymentTypeId}
									onChange={(e) => setPaymentTypeId(e.target.value)}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base p-3"
									required
								>
									<option value="">{t("selectPaymentType")}</option>
									{paymentTypes.map((type) => (
										<option key={type.id} value={type.id}>
											{type.name}
										</option>
									))}
								</select>
							</div>
							<div>
								<label
									htmlFor="note"
									className="block text-sm font-medium text-gray-700"
								>
									{t("notesOptional")}
								</label>
								<textarea
									id="note"
									value={note}
									onChange={(e) => setNote(e.target.value)}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base p-3"
									rows={4}
									placeholder={t("addAnyAdditionalNotes")}
								/>
							</div>
							<div className="pt-4">
								<button
									type="submit"
									disabled={isSubmitting}
									className="inline-flex justify-center rounded-md border border-transparent bg-gray-800 py-2 px-6 text-base font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
								>
									{isSubmitting ? t("submitting") : t("submitRepayment")}
								</button>
							</div>
						</form>
					</div>
				</Card>

				{transactionId && (
					<Receipt
						loan={loan}
						transactionId={transactionId}
						onClose={() => setTransactionId(null)}
					/>
				)}
			</div>
		</div>
	);
};
