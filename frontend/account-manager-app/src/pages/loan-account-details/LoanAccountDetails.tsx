import { useParams } from "@tanstack/react-router";
import { FC } from "react";
import { LoanAccountDetailsView } from "./LoanAccountDetails.view";
import { useLoanAccountDetails } from "./useLoanAccountDetails";

export const LoanAccountDetails: FC = () => {
	const { loanId } = useParams({
		from: "/loan-account-details/$loanId",
	});

	const props = useLoanAccountDetails(Number(loanId));

	return <LoanAccountDetailsView {...props} />;
};
