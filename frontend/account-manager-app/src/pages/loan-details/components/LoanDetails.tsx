import { GetLoansLoanIdResponse } from "@fineract-apps/fineract-api";
import { Card } from "@fineract-apps/ui";
import { format } from "date-fns";
import { FC, ReactNode } from "react";

interface LoanDetailsProps {
	loan: GetLoansLoanIdResponse;
}

const DetailRow: FC<{ label: string; value: ReactNode }> = ({
	label,
	value,
}) => (
	<tr className="border-b border-gray-200">
		<td className="py-3 px-4 font-semibold text-gray-700">{label}</td>
		<td className="py-3 px-4 text-gray-600">{value}</td>
	</tr>
);

export const LoanDetails: FC<LoanDetailsProps> = ({ loan }) => {
	const disbursementDate = loan.timeline?.actualDisbursementDate
		? format(new Date(loan.timeline.actualDisbursementDate), "dd MMMM yyyy")
		: "N/A";

	return (
		<Card className="p-6 rounded-lg shadow-md w-full">
			<table className="w-full text-sm table-auto">
				<tbody>
					<DetailRow label="Disbursement Date" value={disbursementDate} />
					<DetailRow label="Loan Purpose" value={"Not Available"} />
					<DetailRow label="Loan Officer" value={loan.loanOfficerName} />
					<DetailRow label="Currency" value={loan.currency?.name} />
					<DetailRow label="External Id" value={loan.externalId} />
					<DetailRow
						label="Proposed Amount"
						value={loan.proposedPrincipal?.toLocaleString()}
					/>
					<DetailRow
						label="Approved Amount"
						value={loan.approvedPrincipal?.toLocaleString()}
					/>
					<DetailRow
						label="Disburse Amount"
						value={loan.netDisbursalAmount?.toLocaleString()}
					/>
				</tbody>
			</table>
		</Card>
	);
};
