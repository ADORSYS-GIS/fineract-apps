import { TransactionFormView } from "./TransactionForm.view";
import { TransactionFormViewProps } from "./TransactionForm.types";

export const TransactionForm = (props: TransactionFormViewProps) => {
  return <TransactionFormView {...props} />;
};