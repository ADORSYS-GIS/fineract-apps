import { GetLoansLoanIdResponse } from "@fineract-apps/fineract-api";
import { Button, Card } from "@fineract-apps/ui";
import { Download, Printer, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ReceiptProps {
	loan: GetLoansLoanIdResponse;
	receipt: Blob;
	onClose: () => void;
	outputType: "PDF" | "XLS" | "HTML";
	setOutputType: (outputType: "PDF" | "XLS" | "HTML") => void;
}

export const ReceiptView: React.FC<ReceiptProps> = ({
	loan,
	receipt,
	onClose,
	outputType,
	setOutputType,
}) => {
	const { t } = useTranslation();
	const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

	const handlePrint = () => {
		const url = URL.createObjectURL(receipt);
		setReceiptUrl(url);
		const iframe = document.createElement("iframe");
		iframe.style.display = "none";
		iframe.src = url;
		document.body.appendChild(iframe);
		iframe.contentWindow?.print();
	};

	const handleDownload = () => {
		const url = URL.createObjectURL(receipt);
		const link = document.createElement("a");
		link.href = url;
		const clientName = loan.clientName ?? "client";
		const today = new Date().toISOString().slice(0, 10);
		link.setAttribute(
			"download",
			`${clientName}_loanrepayment_${today}.${outputType.toLowerCase()}`,
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
			<Card className="w-full max-w-2xl">
				<div className="p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-2xl font-semibold text-gray-800">
							{t("transactionReceipt")}
						</h2>
						<Button
							variant="ghost"
							onClick={onClose}
							className="text-gray-500 hover:text-gray-800"
						>
							<X className="w-6 h-6" />
						</Button>
					</div>
					<div className="mb-4">
						<label
							htmlFor="outputType"
							className="block text-sm font-medium text-gray-700"
						>
							{t("receiptFormat")}
						</label>
						<select
							id="outputType"
							name="outputType"
							value={outputType}
							onChange={(e) =>
								setOutputType(e.target.value as "PDF" | "XLS" | "HTML")
							}
							className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
						>
							<option value="PDF">{t("common.pdf")}</option>
							<option value="XLS">{t("common.xls")}</option>
							<option value="HTML">{t("receiptModal.html")}</option>
						</select>
					</div>
					<div className="h-96">
						{receipt && (
							<iframe
								src={receiptUrl || URL.createObjectURL(receipt)}
								className="w-full h-full"
								title={t("receipt.title")}
							/>
						)}
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
				</div>
			</Card>
		</div>
	);
};
