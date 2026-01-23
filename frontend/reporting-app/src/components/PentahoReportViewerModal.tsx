import { Button, Card } from "@fineract-apps/ui";
import { Download, Printer, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface PentahoReportViewerModalProps {
	reportName: string;
	reportBlob: Blob;
	outputType: string;
	isOpen: boolean;
	onClose: () => void;
}

export const PentahoReportViewerModal = ({
	reportName,
	reportBlob,
	outputType,
	isOpen,
	onClose,
}: PentahoReportViewerModalProps) => {
	const { t } = useTranslation();
	const [reportUrl, setReportUrl] = useState<string | null>(null);

	useEffect(() => {
		if (reportBlob) {
			const url = URL.createObjectURL(reportBlob);
			setReportUrl(url);
			return () => {
				URL.revokeObjectURL(url);
			};
		}
	}, [reportBlob]);

	const handlePrint = () => {
		if (!reportUrl) return;
		const iframe = document.createElement("iframe");
		iframe.style.display = "none";
		iframe.src = reportUrl;
		document.body.appendChild(iframe);
		iframe.contentWindow?.print();
	};

	const handleDownload = () => {
		if (!reportUrl) return;
		const link = document.createElement("a");
		link.href = reportUrl;
		const today = new Date().toISOString().slice(0, 10);
		link.setAttribute(
			"download",
			`${reportName}_${today}.${outputType.toLowerCase()}`,
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	if (!isOpen) {
		return null;
	}

	const isPreviewable = outputType === "PDF" || outputType === "HTML";

	return (
		<div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
			<Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
				<div className="p-4 flex justify-between items-center border-b">
					<h2 className="text-2xl font-semibold text-gray-800">{reportName}</h2>
					<Button
						variant="ghost"
						onClick={onClose}
						className="text-gray-500 hover:text-gray-800"
					>
						<X className="w-6 h-6" />
					</Button>
				</div>
				<div className="p-6 flex-1 overflow-y-auto">
					{isPreviewable ? (
						<iframe
							src={reportUrl || ""}
							className="w-full h-full min-h-[60vh]"
							title={reportName}
						/>
					) : (
						<div className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center bg-gray-100 rounded-lg">
							<h3 className="text-xl font-semibold text-gray-700 mb-2">
								Preview not available for {outputType} format.
							</h3>
							<p className="text-gray-600 mb-6">
								Click the download button to save the file.
							</p>
							<Button onClick={handleDownload}>
								<Download size={20} className="mr-2" />
								Download {outputType}
							</Button>
						</div>
					)}
				</div>
				<div className="p-4 bg-gray-50 flex justify-end gap-4 border-t">
					{isPreviewable && (
						<Button
							onClick={handlePrint}
							className="bg-gray-800 hover:bg-gray-900 text-white"
						>
							<Printer size={20} className="mr-2" />
							{t("reusable.print")}
						</Button>
					)}
					<Button
						onClick={handleDownload}
						className="bg-gray-800 hover:bg-gray-900 text-white"
					>
						<Download size={20} className="mr-2" />
						{t("reusable.download")}
					</Button>
				</div>
			</Card>
		</div>
	);
};
