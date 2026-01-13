import {
	GetV1MakercheckersResponse,
	MakerCheckerOr4EyeFunctionalityService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";

interface PendingApproval extends GetV1MakercheckersResponse {
	id: number;
	maker: string;
	madeOnDate: string;
	actionName: string;
	entityName: string;
	commandAsJson: string;
}

export const usePendingJournalEntryReview = (auditId: string) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { data: pendingApprovals, isLoading } = useQuery<PendingApproval[]>({
		queryKey: ["pending-approvals"],
		queryFn: async () => {
			const response =
				await MakerCheckerOr4EyeFunctionalityService.getV1Makercheckers();
			// The generated type might be incorrect, so we cast to handle the array response
			return response as unknown as PendingApproval[];
		},
	});

	// The type from the generated client is missing properties, so we cast to any
	const pendingEntry = pendingApprovals?.find(
		(entry) => entry.id === Number(auditId),
	);

	const commandAsJson = pendingEntry?.commandAsJson
		? JSON.parse(pendingEntry.commandAsJson)
		: {};

	const approveMutation = useMutation({
		mutationFn: () =>
			MakerCheckerOr4EyeFunctionalityService.postV1MakercheckersByAuditId({
				auditId: Number(auditId),
				command: "approve",
			}),
		onSuccess: () => {
			toast.success("Journal Entry Approved Successfully");
			queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
			navigate({ to: "/approval-queue" });
		},
		onError: (error) => {
			toast.error(
				error.message || "An error occurred while approving the entry",
			);
		},
	});

	const rejectMutation = useMutation({
		mutationFn: () =>
			MakerCheckerOr4EyeFunctionalityService.deleteV1MakercheckersByAuditId({
				auditId: Number(auditId),
			}),
		onSuccess: () => {
			toast.success("Journal Entry Rejected Successfully");
			queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
			navigate({ to: "/approval-queue" });
		},
		onError: (error) => {
			toast.error(
				error.message || "An error occurred while rejecting the entry",
			);
		},
	});

	return {
		isLoading,
		pendingEntry,
		commandAsJson,
		onApprove: () => approveMutation.mutate(),
		onReject: () => {
			const reason = window.prompt("Please provide a reason for rejection:");
			if (reason) {
				// Note: The generated client for reject doesn't support a body for the reason
				// This prompt is for UX purposes, but the reason is not sent to the API
				// In a real scenario, the API should be updated to accept a reason
				rejectMutation.mutate();
			}
		},
		onBack: () => navigate({ to: "/approval-queue" }),
	};
};
