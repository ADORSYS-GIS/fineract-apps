import { GetLoansLoanIdResponse } from "@fineract-apps/fineract-api";

export type LoanDetails = GetLoansLoanIdResponse;

export type LoanReviewViewProps = {
	loan?: LoanDetails;
	isLoading: boolean;
	error?: string;
	onApprove: (note: string) => void;
	onReject: (note: string) => void;
};
