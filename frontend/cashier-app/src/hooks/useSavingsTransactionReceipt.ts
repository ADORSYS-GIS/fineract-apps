import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { RunReportsService } from "@/services/runReport";

export const useSavingsTransactionReceipt = () => {
	const [receipt, setReceipt] = useState<Blob | null>(null);

	const mutation = useMutation({
		mutationFn: (variables: {
			transactionId: number;
			outputType: "PDF" | "XLS" | "HTML";
		}) =>
			RunReportsService.getSavingsTransactionReceipt(
				variables.transactionId,
				variables.outputType,
			),
		onSuccess: (data) => {
			setReceipt(data);
		},
		onError: (error) => {
			console.error("Error generating receipt:", error);
		},
	});

	return { ...mutation, receipt, setReceipt };
};
