import {
	type TransactionFormData,
	transactionSchema,
} from "./TransactionForm.types";

export const useTransactionForm = () => {
	const initialValues: TransactionFormData = {
		amount: "",
		receiptNumber: "",
	};

	return {
		initialValues,
		validationSchema: transactionSchema,
	};
};
