import {
	ApiError,
	GetLoansLoanIdResponse,
	GetLoansLoanIdTransactionsTransactionIdResponse,
	LoanTransactionsService,
} from "@fineract-apps/fineract-api";
import { Button, Card } from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import html2pdf from "html2pdf.js";
import { Download, Printer } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import "./print.css";

interface ReceiptProps {
	loan: GetLoansLoanIdResponse;
	loanId: number;
	transactionId: number;
}

export const Receipt: React.FC<ReceiptProps> = ({
	loan,
	loanId,
	transactionId,
}) => {
	const { t } = useTranslation();
	const {
		data: transaction,
		isLoading,
		error,
	} = useQuery<GetLoansLoanIdTransactionsTransactionIdResponse, ApiError>({
		queryKey: ["transaction", loanId, transactionId],
		queryFn: () =>
			LoanTransactionsService.getV1LoansByLoanIdTransactionsByTransactionId({
				loanId,
				transactionId,
			}),
	});

	if (isLoading) {
		return <div>{t("loadingReceipt")}</div>;
	}

	if (error) {
		return <div>{t("errorFetchingReceipt", { message: error.message })}</div>;
	}

	if (!transaction) {
		return <div>{t("transactionNotFound")}</div>;
	}

	const handlePrint = () => {
		window.print();
	};

	const handleDownload = () => {
		const element = document.getElementById("receipt");
		const clientName = loan.clientName ?? "client";
		const today = new Date().toISOString().slice(0, 10);
		const opt = {
			margin: 0.5,
			filename: `${clientName}_loanrepayment_${today}.pdf`,
			image: { type: "jpeg" as const, quality: 0.98 },
			html2canvas: { scale: 2, useCORS: true },
			jsPDF: {
				unit: "in",
				format: "letter",
				orientation: "portrait" as const,
			},
		};
		if (element) {
			html2pdf().from(element).set(opt).save().catch(console.error);
		}
	};

	return (
		<Card>
			<div className="p-6" id="receipt">
				<style type="text/css">
					{`
				        .text-gray-800 { color: #1f2937 !important; }
				        .text-gray-600 { color: #4b5563 !important; }
				        .text-gray-500 { color: #6b7280 !important; }
				        .text-green-600 { color: #16a34a !important; }
				        .bg-gray-50 { background-color: #f9fafb !important; }
				      `}
				</style>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-semibold text-gray-800">
						{t("transactionReceipt")}
					</h2>
					<span className="text-sm text-gray-500">
						{t("date")}:{" "}
						{new Date(
							transaction.date as unknown as string,
						).toLocaleDateString()}
					</span>
				</div>
				<hr className="my-4" />
				<div className="space-y-4">
					<div className="flex justify-between">
						<p className="text-gray-600">{t("transactionId")}:</p>
						<p className="font-medium text-gray-800">{transaction.id}</p>
					</div>
					<div className="flex justify-between">
						<p className="text-gray-600">{t("type")}:</p>
						<p className="font-medium text-gray-800">
							{transaction.type?.code}
						</p>
					</div>
					<div className="flex justify-between">
						<p className="text-gray-600">{t("amount")}:</p>
						<p className="font-medium text-gray-800">
							{transaction.amount} {transaction.currency?.displaySymbol}
						</p>
					</div>
					<hr className="my-4 border-dashed" />
					<div className="flex justify-between">
						<p className="text-gray-600">{t("principalPortion")}:</p>
						<p className="font-medium text-gray-800">
							{transaction.principalPortion}{" "}
							{transaction.currency?.displaySymbol}
						</p>
					</div>
					<div className="flex justify-between">
						<p className="text-gray-600">{t("interestPortion")}:</p>
						<p className="font-medium text-gray-800">
							{transaction.interestPortion}{" "}
							{transaction.currency?.displaySymbol}
						</p>
					</div>
					<hr className="my-4" />
					<div className="flex justify-between text-lg font-semibold">
						<p className="text-gray-800">{t("outstandingLoanBalance")}:</p>
						<p className="text-green-600">
							{transaction.outstandingLoanBalance}{" "}
							{transaction.currency?.displaySymbol}
						</p>
					</div>
				</div>
			</div>
			<div className="p-6 bg-gray-50 flex justify-end gap-4">
				<Button
					onClick={handlePrint}
					className="bg-gray-800 hover:bg-gray-900 text-white"
				>
					<Printer size={20} className="mr-2" />
					{t("printReceipt")}
				</Button>
				<Button
					onClick={handleDownload}
					className="bg-gray-800 hover:bg-gray-900 text-white"
				>
					<Download size={20} className="mr-2" />
					{t("download")}
				</Button>
			</div>
		</Card>
	);
};
