import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { RunReportsService } from "@/services/runReport";

export const useSavingsAccountStatement = () => {
	const [receipt, setReceipt] = useState<Blob | null>(null);

	const mutation = useMutation({
		mutationFn: (variables: {
			accountNo: string;
			fromDate: string;
			toDate: string;
			outputType: "PDF" | "XLS" | "CSV";
		}) =>
			RunReportsService.getSavingsAccountStatement(
				variables.accountNo,
				variables.fromDate,
				variables.toDate,
				variables.outputType,
			),
		onSuccess: (data) => {
			setReceipt(data);
		},
	});

	return { ...mutation, receipt, setReceipt };
};
