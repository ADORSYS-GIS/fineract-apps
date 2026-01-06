import {
	type GetV1MakercheckersResponse,
	MakerCheckerOr4EyeFunctionalityService,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import "../../lib/api";

export interface DateRange {
	from: string;
	to: string;
}

export interface ApprovalQueueProps {
	pendingEntries: GetV1MakercheckersResponse[] | undefined;
	isLoading: boolean;
	isProcessing: boolean;
	dateRange: DateRange;
	onDateRangeChange: (range: DateRange) => void;
}

export function useApprovalQueue(): ApprovalQueueProps {
	const today = new Date().toISOString().split("T")[0];
	const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
		.toISOString()
		.split("T")[0];

	const [dateRange, setDateRange] = useState<DateRange>({
		from: thirtyDaysAgo,
		to: today,
	});

	const { data: pendingEntries, isLoading } = useQuery({
		queryKey: ["makercheckers", dateRange],
		queryFn: async (): Promise<GetV1MakercheckersResponse[]> => {
			const response =
				await MakerCheckerOr4EyeFunctionalityService.getV1Makercheckers({
					entityName: "JOURNALENTRY", // Filter for journal entries only
					makerDateTimeFrom: dateRange.from,
					makerDateTimeTo: dateRange.to,
				});
			return response as GetV1MakercheckersResponse[];
		},
		refetchInterval: 30000, // Auto-refresh every 30 seconds
	});

	return {
		pendingEntries,
		isLoading,
		isProcessing: false,
		dateRange,
		onDateRangeChange: setDateRange,
	};
}
