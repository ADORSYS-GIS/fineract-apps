import { GetLoansLoanIdResponse } from "@fineract-apps/fineract-api";
import { Card, formatCurrency } from "@fineract-apps/ui";
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

const LoanSummaryRow: FC<{
	label: string;
	data: LoanSummaryRowData;
	currencyCode?: string;
}> = ({ label, data, currencyCode }) => (
	<tr className="border-b border-gray-200">
		<td className="py-3 px-4 font-semibold text-gray-700">{label}</td>
		<td className="py-3 px-4 text-gray-600">
			{formatCurrency(data.totalPrincipal, currencyCode)}
		</td>
		<td className="py-3 px-4 text-gray-600">
			{formatCurrency(data.principalPaid, currencyCode)}
		</td>
		<td className="py-3 px-4 text-gray-600">
			{formatCurrency(data.totalWaived, currencyCode)}
		</td>
		<td className="py-3 px-4 text-gray-600">
			{formatCurrency(data.principalWrittenOff, currencyCode)}
		</td>
		<td className="py-3 px-4 text-gray-600">
			{formatCurrency(data.principalOutstanding, currencyCode)}
		</td>
		<td className="py-3 px-4 text-gray-600">
			{formatCurrency(data.principalOverdue, currencyCode)}
		</td>
	</tr>
);

export const LoanSummary: FC<LoanSummaryProps> = ({ loan }) => {
	const summary = loan.summary;
	const currencyCode = loan.currency?.code;
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
							currencyCode={currencyCode}
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
							currencyCode={currencyCode}
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
							currencyCode={currencyCode}
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
							currencyCode={currencyCode}
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
								{formatCurrency(summary.totalExpectedRepayment, currencyCode)}
							</td>
							<td className="py-3 px-4">
								{formatCurrency(summary.totalRepayment, currencyCode)}
							</td>
							<td className="py-3 px-4">
								{formatCurrency(summary.totalWaived, currencyCode)}
							</td>
							<td className="py-3 px-4">
								{formatCurrency(summary.totalWrittenOff, currencyCode)}
							</td>
							<td className="py-3 px-4">
								{formatCurrency(summary.totalOutstanding, currencyCode)}
							</td>
							<td className="py-3 px-4">
								{formatCurrency(summary.totalOverdue, currencyCode)}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</Card>
	);
};
