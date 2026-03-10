import { PendingLoansView } from "./PendingLoans.view";
import { usePendingLoans } from "./usePendingLoans";

export const PendingLoans = () => {
	const props = usePendingLoans();
	return <PendingLoansView {...props} />;
};
