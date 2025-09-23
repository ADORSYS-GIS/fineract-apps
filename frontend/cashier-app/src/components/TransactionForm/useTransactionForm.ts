import {
  type TransactionFormData,
  transactionSchema,
} from "./TransactionForm.types";

export const useTransactionForm = () => {
  const initialValues: TransactionFormData = {
    amount: "",
  };

  return {
    initialValues,
    validationSchema: transactionSchema,
  };
};