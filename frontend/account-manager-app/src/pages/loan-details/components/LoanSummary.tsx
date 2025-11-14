import { GetLoansLoanIdResponse } from "@fineract-apps/fineract-api";
import { Card } from "@fineract-apps/ui";
import { FC } from "react";

interface LoanSummaryProps {
	loan: GetLoansLoanIdResponse;
}

interface LoanSummaryRowData {
	totalPrincipal?: number;
	principalPaid?: number;
	totalWaived?: number;
	principalWrittenOff?: number;
	principalOutstanding?: number;
	principalOverdue?: number;
}

const LoanSummaryRow: FC<{ label: string; data: LoanSummaryRowData }> = ({
	label,
	data,
}) => (
	<tr className="border-b border-gray-200">
		<td className="py-3 px-4 font-semibold text-gray-700">{label}</td>
		<td className="py-3 px-4 text-gray-600">
			{data.totalPrincipal?.toLocaleString()}
		</td>
		<td className="py-3 px-4 text-gray-600">
			{data.principalPaid?.toLocaleString()}
		</td>
		<td className="py-3 px-4 text-gray-600">
			{data.totalWaived?.toLocaleString()}
		</td>
		<td className="py-3 px-4 text-gray-600">
			{data.principalWrittenOff?.toLocaleString()}
		</td>
		<td className="py-3 px-4 text-gray-600">
			{data.principalOutstanding?.toLocaleString()}
		</td>
		<td className="py-3 px-4 text-gray-600">
			{data.principalOverdue?.toLocaleString()}
		</td>
	</tr>
);

export const LoanSummary: FC<LoanSummaryProps> = ({ loan }) => {
	const summary = loan.summary;
	if (!summary) return null;

	return (
		<Card className="p-6 rounded-lg shadow-md w-full">
			<div className="overflow-x-auto">
				<table className="w-full text-sm table-auto">
					<thead>
						<tr className="border-b border-gray-200">
							<th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
							<th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Original
							</th>
							<th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Paid
							</th>
							<th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Waived
							</th>
							<th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Written Off
							</th>
							<th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Outstanding
							</th>
							<th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Overdue
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						<LoanSummaryRow
							label="Principal"
							data={{
								totalPrincipal: summary.totalPrincipal,
								principalPaid: summary.principalPaid,
								totalWaived: summary.totalWaived,
								principalWrittenOff: summary.principalWrittenOff,
								principalOutstanding: summary.principalOutstanding,
								principalOverdue: summary.principalOverdue,
							}}
						/>
						<LoanSummaryRow
							label="Interest"
							data={{
								totalPrincipal: summary.interestCharged,
								principalPaid: summary.interestPaid,
								totalWaived: summary.interestWaived,
								principalWrittenOff: summary.interestWrittenOff,
								principalOutstanding: summary.interestOutstanding,
								principalOverdue: summary.interestOverdue,
							}}
						/>
						<LoanSummaryRow
							label="Fees"
							data={{
								totalPrincipal: summary.feeChargesCharged,
								principalPaid: summary.feeChargesPaid,
								totalWaived: summary.feeChargesWaived,
								principalWrittenOff: summary.feeChargesWrittenOff,
								principalOutstanding: summary.feeChargesOutstanding,
								principalOverdue: summary.feeChargesOverdue,
							}}
						/>
						<LoanSummaryRow
							label="Penalties"
							data={{
								totalPrincipal: summary.penaltyChargesCharged,
								principalPaid: summary.penaltyChargesPaid,
								totalWaived: summary.penaltyChargesWaived,
								principalWrittenOff: summary.penaltyChargesWrittenOff,
								principalOutstanding: summary.penaltyChargesOutstanding,
								principalOverdue: summary.penaltyChargesOverdue,
							}}
						/>
						<tr className="border-b border-gray-200 font-bold text-gray-800">
							<td className="py-3 px-4">Total</td>
							<td className="py-3 px-4">
								{summary.totalExpectedRepayment?.toLocaleString()}
							</td>
							<td className="py-3 px-4">
								{summary.totalRepayment?.toLocaleString()}
							</td>
							<td className="py-3 px-4">
								{summary.totalWaived?.toLocaleString()}
							</td>
							<td className="py-3 px-4">
								{summary.totalWrittenOff?.toLocaleString()}
							</td>
							<td className="py-3 px-4">
								{summary.totalOutstanding?.toLocaleString()}
							</td>
							<td className="py-3 px-4">
								{summary.totalOverdue?.toLocaleString()}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</Card>
	);
};
