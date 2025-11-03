import { useParams } from "@tanstack/react-router";
import { FC } from "react";

import { useLoanAccountDetails } from "./useLoanAccountDetails";
import { LoanAccountDetailsView } from "./LoanAccountDetails.view";


export const LoanAccountDetails: FC = () => {
	const { loanId } = useParams({
		from: "/loan-account-details/$loanId",
	});

	const props = useLoanAccountDetails(Number(loanId));

	return (
		<LoanAccountDetailsView
			{...props}
		/>
	);
};
