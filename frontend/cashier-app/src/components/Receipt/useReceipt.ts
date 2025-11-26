import { ApiError } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { RunReportsService } from "@/services/RunReportsService";

export const useReceipt = (
	transactionId: number,
	outputType: "PDF" | "XLS" | "HTML",
) => {
	return useQuery<Blob, ApiError>({
		queryKey: ["receipt", transactionId, outputType],
		queryFn: () =>
			RunReportsService.getLoanTransactionReceipt(transactionId, outputType),
	});
};
