import { FC } from "react";
import { LoanDetailsView } from "./LoanDetails.view";
import { useLoanDetails } from "./useLoanDetails";

export const LoanDetails: FC = () => {
	const loanDetailsProps = useLoanDetails();
	return <LoanDetailsView {...loanDetailsProps} />;
};
