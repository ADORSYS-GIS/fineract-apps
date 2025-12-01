import { Button, formatCurrency } from "@fineract-apps/ui";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { BackButton } from "@/components/BackButton";
import { LoanReviewViewProps } from "./LoanReview.types";

export const LoanReviewView = ({
	loan,
	isLoading,
	error,
	onApprove,
	onReject,
}: LoanReviewViewProps) => {
	const [note, setNote] = useState("");

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	if (!loan) {
		return <div>Loan not found</div>;
	}

	return (
		<div className="p-4 sm:p-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
				<div className="order-1 sm:order-2">
					<BackButton to="/approve/loans/" />
				</div>
				<h1 className="text-2xl font-bold text-center sm:text-left order-2 sm:order-1">
					Review Loan: {loan.accountNo} - {loan.clientName}
				</h1>
			</div>
			<div className="bg-white rounded-lg shadow p-6 mb-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
					<div>
						<h3 className="text-lg font-semibold mb-4">Client Details</h3>
						<div className="space-y-3">
							<DetailRow label="Name" value={loan.clientName} />
						</div>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-4">Loan Terms</h3>
						<div className="space-y-3">
							<DetailRow label="Product" value={loan.loanProductName} />
							<DetailRow
								label="Principal"
								value={formatCurrency(loan.principal, loan.currency?.code)}
							/>
							<DetailRow
								label="Term"
								value={`${loan.termFrequency} ${loan.termPeriodFrequencyType?.description}`}
							/>
							<DetailRow
								label="Interest Rate"
								value={`${loan.annualInterestRate}% per annum`}
							/>
							<DetailRow label="Loan Officer" value={loan.loanOfficerName} />
							<DetailRow
								label="Submitted On"
								value={loan.timeline?.submittedOnDate?.toString()}
							/>
							<DetailRow
								label="Expected Disbursement"
								value={loan.timeline?.expectedDisbursementDate?.toString()}
							/>
						</div>
					</div>
				</div>

				<div className="mt-6 pt-6 border-t">
					<h3 className="text-lg font-semibold mb-4">Collateral & Charges</h3>
					<div className="grid grid-cols-2 gap-8">
						<div className="bg-gray-50 p-4 rounded-lg">
							<p className="text-sm font-medium mb-2">Collateral:</p>
							{/* Add collateral details here */}
						</div>
						<div className="bg-gray-50 p-4 rounded-lg">
							<p className="text-sm font-medium mb-2">Charges:</p>
							{/* Add charges details here */}
						</div>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<h3 className="text-lg font-semibold mb-4">Decision</h3>
				<textarea
					id="note"
					name="note"
					placeholder="Add approval or rejection notes..."
					className="w-full p-3 border border-gray-300 rounded-lg mb-4"
					rows={4}
					value={note}
					onChange={(e) => setNote(e.target.value)}
				/>
				<div className="flex gap-4">
					<Button
						onClick={() => onApprove(note)}
						className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
					>
						<Check size={20} />
						Approve Loan
					</Button>
					<Button
						onClick={() => onReject(note)}
						className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium"
					>
						<X size={20} />
						Reject Loan
					</Button>
				</div>
			</div>
		</div>
	);
};

const DetailRow = ({ label, value }: { label: string; value?: string }) => (
	<div className="flex justify-between">
		<span className="text-sm text-gray-600">{label}:</span>
		<span className="text-sm font-medium">{value}</span>
	</div>
);
