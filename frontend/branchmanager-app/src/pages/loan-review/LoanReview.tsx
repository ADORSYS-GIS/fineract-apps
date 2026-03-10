import { LoanReviewView } from "./LoanReview.view";
import { useLoanReview } from "./useLoanReview";

export const LoanReview = () => {
	const props = useLoanReview();
	return <LoanReviewView {...props} />;
};
