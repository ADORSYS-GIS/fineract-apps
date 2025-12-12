import {
	type GetV1MakercheckersResponse,
	MakerCheckerOr4EyeFunctionalityService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
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
	onApprove: (entry: GetV1MakercheckersResponse) => void;
	onReject: (entry: GetV1MakercheckersResponse) => void;
	onDelete: (entry: GetV1MakercheckersResponse) => void;
}

export function useApprovalQueue(): ApprovalQueueProps {
	const queryClient = useQueryClient();

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

	const approveMutation = useMutation({
		mutationFn: (auditId: number) =>
			MakerCheckerOr4EyeFunctionalityService.postV1MakercheckersByAuditId({
				auditId,
				command: "approve",
			}),
		onSuccess: () => {
			toast.success("Entry approved successfully!");
			queryClient.invalidateQueries({ queryKey: ["makercheckers"] });
			queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
			queryClient.invalidateQueries({ queryKey: ["accounting-stats"] });
		},
		onError: (error: Error) => {
			toast.error(`Approval failed: ${error.message}`);
		},
	});

	const rejectMutation = useMutation({
		mutationFn: (auditId: number) =>
			MakerCheckerOr4EyeFunctionalityService.postV1MakercheckersByAuditId({
				auditId,
				command: "reject",
			}),
		onSuccess: () => {
			toast.success("Entry rejected successfully!");
			queryClient.invalidateQueries({ queryKey: ["makercheckers"] });
		},
		onError: (error: Error) => {
			toast.error(`Rejection failed: ${error.message}`);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (auditId: number) =>
			MakerCheckerOr4EyeFunctionalityService.deleteV1MakercheckersByAuditId({
				auditId,
			}),
		onSuccess: () => {
			toast.success("Pending entry deleted successfully!");
			queryClient.invalidateQueries({ queryKey: ["makercheckers"] });
		},
		onError: (error: Error) => {
			toast.error(`Delete failed: ${error.message}`);
		},
	});

	const handleApprove = (entry: GetV1MakercheckersResponse) => {
		approveMutation.mutate((entry as unknown as { id: number }).id);
	};

	const handleReject = (entry: GetV1MakercheckersResponse) => {
		rejectMutation.mutate((entry as unknown as { id: number }).id);
	};

	const handleDelete = (entry: GetV1MakercheckersResponse) => {
		deleteMutation.mutate((entry as unknown as { id: number }).id);
	};

	return {
		pendingEntries,
		isLoading,
		isProcessing:
			approveMutation.isPending ||
			rejectMutation.isPending ||
			deleteMutation.isPending,
		dateRange,
		onDateRangeChange: setDateRange,
		onApprove: handleApprove,
		onReject: handleReject,
		onDelete: handleDelete,
	};
}
