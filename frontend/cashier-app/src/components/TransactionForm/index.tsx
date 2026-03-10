import { TransactionFormViewProps } from "./TransactionForm.types";
import { TransactionFormView } from "./TransactionForm.view";

export const TransactionForm = (props: TransactionFormViewProps) => {
	return <TransactionFormView {...props} />;
};
