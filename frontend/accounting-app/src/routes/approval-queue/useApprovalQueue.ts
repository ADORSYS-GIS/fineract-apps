import { MakerCheckerOr4EyeFunctionalityService } from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import "../../lib/api";

export interface PendingApproval {
	id: number;
	actionName: string;
	entityName: string;
	resourceId: number;
	maker: string;
	madeOnDate: string;
	processingResult?: string;
}

export function useApprovalQueue() {
	const queryClient = useQueryClient();
	const [approvingId, setApprovingId] = useState<number | null>(null);
	const [rejectingId, setRejectingId] = useState<number | null>(null);

	const { data: pendingApprovals = [], isLoading } = useQuery<
		PendingApproval[]
	>({
		queryKey: ["pending-approvals"],
		queryFn: async () => {
			const response =
				await MakerCheckerOr4EyeFunctionalityService.getV1Makercheckers({});

			// Map the response to our PendingApproval interface
			const approvals = response as unknown as Array<{
				id: number;
				actionName: string;
				entityName: string;
				resourceId: number;
				maker: string;
				madeOnDate: number[];
				processingResult?: string;
			}>;

			return approvals.map((approval) => {
				// Convert date array [year, month, day] to ISO string
				const date = approval.madeOnDate
					? new Date(
							approval.madeOnDate[0],
							approval.madeOnDate[1] - 1,
							approval.madeOnDate[2],
						).toISOString()
					: new Date().toISOString();

				return {
					id: approval.id,
					actionName: approval.actionName,
					entityName: approval.entityName,
					resourceId: approval.resourceId,
					maker: approval.maker,
					madeOnDate: date,
					processingResult: approval.processingResult,
				};
			});
		},
		refetchInterval: 30000, // Refetch every 30 seconds
	});

	const approveMutation = useMutation({
		mutationFn: async (auditId: number) => {
			const response =
				await MakerCheckerOr4EyeFunctionalityService.postV1MakercheckersByAuditId(
					{
						auditId,
						requestBody: { command: "approve" },
					},
				);
			return response;
		},
		onMutate: (auditId) => {
			setApprovingId(auditId);
		},
		onSuccess: () => {
			toast.success("Entry approved successfully!");
			// Invalidate queries to refresh data
			queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
			queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
			queryClient.invalidateQueries({ queryKey: ["accounting-stats"] });
		},
		onError: (error: Error) => {
			toast.error(`Failed to approve entry: ${error.message}`);
		},
		onSettled: () => {
			setApprovingId(null);
		},
	});

	const rejectMutation = useMutation({
		mutationFn: async (auditId: number) => {
			const response =
				await MakerCheckerOr4EyeFunctionalityService.deleteV1MakercheckersByAuditId(
					{
						auditId,
					},
				);
			return response;
		},
		onMutate: (auditId) => {
			setRejectingId(auditId);
		},
		onSuccess: () => {
			toast.success("Entry rejected successfully!");
			// Invalidate queries to refresh data
			queryClient.invalidateQueries({ queryKey: ["pending-approvals"] });
		},
		onError: (error: Error) => {
			toast.error(`Failed to reject entry: ${error.message}`);
		},
		onSettled: () => {
			setRejectingId(null);
		},
	});

	const handleApprove = (auditId: number) => {
		if (
			window.confirm(
				"Are you sure you want to approve this entry? This action cannot be undone.",
			)
		) {
			approveMutation.mutate(auditId);
		}
	};

	const handleReject = (auditId: number) => {
		const reason = window.prompt(
			"Please enter a reason for rejecting this entry:",
		);
		if (reason && reason.trim()) {
			rejectMutation.mutate(auditId);
		} else if (reason !== null) {
			toast.error("Rejection reason is required");
		}
	};

	return {
		pendingApprovals,
		isLoading,
		onApprove: handleApprove,
		onReject: handleReject,
		isApproving: approvingId,
		isRejecting: rejectingId,
	};
}
