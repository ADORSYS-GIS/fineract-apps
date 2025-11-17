import { GetLoansLoanIdResponse } from "@fineract-apps/fineract-api";
import { useTranslation } from "react-i18next";
import { ReceiptView } from "@/components/Receipt/Receipt.view";
import { useReceipt } from "@/components/Receipt/useReceipt";

interface ReceiptProps {
	loan: GetLoansLoanIdResponse;
	loanId: number;
	transactionId: number;
	onClose: () => void;
}

export const Receipt: React.FC<ReceiptProps> = ({
	loan,
	loanId,
	transactionId,
	onClose,
}) => {
	const { t } = useTranslation();
	const {
		data: transaction,
		isLoading,
		error,
	} = useReceipt(loanId, transactionId);

	if (isLoading) {
		return <div>{t("loadingReceipt")}</div>;
	}

	if (error) {
		return <div>{t("errorFetchingReceipt", { message: error.message })}</div>;
	}

	if (!transaction) {
		return <div>{t("transactionNotFound")}</div>;
	}

	return (
		<ReceiptView loan={loan} transaction={transaction} onClose={onClose} />
	);
};
