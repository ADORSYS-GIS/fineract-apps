import { GetLoansLoanIdResponse } from "@fineract-apps/fineract-api";
import { Card } from "@fineract-apps/ui";
import { format } from "date-fns";
import { FC } from "react";

interface PerformanceHistoryProps {
	loan: GetLoansLoanIdResponse;
}

export const PerformanceHistory: FC<PerformanceHistoryProps> = ({ loan }) => {
	const maturityDate = loan.timeline?.expectedMaturityDate
		? format(new Date(loan.timeline.expectedMaturityDate), "dd MMMM yyyy")
		: "N/A";

	return (
		<Card className="p-6 rounded-lg shadow-md">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="flex items-center">
					<span className="font-semibold text-gray-600">
						Number of Repayments:
					</span>
					<span className="ml-2 text-gray-800">{loan.numberOfRepayments}</span>
				</div>
				<div className="flex items-center">
					<span className="font-semibold text-gray-600">Maturity Date:</span>
					<span className="ml-2 text-gray-800">{maturityDate}</span>
				</div>
			</div>
		</Card>
	);
};
