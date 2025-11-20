import { GetLoansLoanIdResponse } from "@fineract-apps/fineract-api";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ReceiptView } from "@/components/Receipt/Receipt.view";
import { useReceipt } from "@/components/Receipt/useReceipt";

interface ReceiptProps {
	loan: GetLoansLoanIdResponse;
	transactionId: number;
	onClose: () => void;
}

export const Receipt: React.FC<ReceiptProps> = ({
	loan,
	transactionId,
	onClose,
}) => {
	const { t } = useTranslation();
	const [outputType, setOutputType] = useState<"PDF" | "XLS" | "HTML">("PDF");
	const {
		data: receipt,
		isLoading,
		error,
	} = useReceipt(transactionId, outputType);

	if (isLoading) {
		return <div>{t("loadingReceipt")}</div>;
	}

	if (error) {
		return <div>{t("errorFetchingReceipt", { message: error.message })}</div>;
	}

	if (!receipt) {
		return <div>{t("receiptNotFound")}</div>;
	}

	return (
		<ReceiptView
			loan={loan}
			receipt={receipt}
			onClose={onClose}
			outputType={outputType}
			setOutputType={setOutputType}
		/>
	);
};
