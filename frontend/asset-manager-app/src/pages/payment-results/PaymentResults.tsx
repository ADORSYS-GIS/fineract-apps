import { FC } from "react";
import { PaymentResultsView } from "./PaymentResults.view";
import { usePaymentResults } from "./usePaymentResults";

export const PaymentResults: FC = () => {
	const props = usePaymentResults();
	return <PaymentResultsView {...props} />;
};
