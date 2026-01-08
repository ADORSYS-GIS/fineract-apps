import {
	JournalEntriesService,
	MakerCheckerOr4EyeFunctionalityService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import toast from "react-hot-toast";
import "../../../lib/api";
import { Route } from "./index";

export interface JournalEntryDetail {
	id: number;
	transactionId: string;
	transactionDate: string;
	officeName: string;
	referenceNumber?: string;
	comments?: string;
	createdBy: string;
	createdDate: string;
	debits: Array<{
		glAccountId: number;
		glAccountName: string;
		glAccountCode: string;
		amount: number;
	}>;
	credits: Array<{
		glAccountId: number;
		glAccountName: string;
		glAccountCode: string;
		amount: number;
	}>;
	status: string;
}

export function useJournalEntryDetail() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { entryId } = useParams({ from: "/journal-entries/$entryId/" });
	const { auditId } = Route.useSearch();

	const { data: entry, isLoading } = useQuery<JournalEntryDetail | null>({
		queryKey: ["journal-entry-detail", entryId],
		queryFn: async () => {
			const response =
				await JournalEntriesService.getV1JournalentriesByJournalEntryId({
					journalEntryId: Number(entryId),
				});

			// The type from the generated client is likely incorrect. We cast to any to bypass type errors.
			// biome-ignore lint/suspicious/noExplicitAny: The type from the generated client is likely incorrect.
			const data = response as any;

			return {
				id: data.id,
				transactionId: data.transactionId,
				transactionDate: data.transactionDate,
				officeName: data.officeName,
				referenceNumber: data.referenceNumber,
				comments: data.comments,
				createdBy: data.createdByUserName,
				createdDate: data.createdDate,
				debits: data.transactionDetails?.debits || [],
				credits: data.transactionDetails?.credits || [],
				status: data.status,
			};
		},
	});

	const reverseMutation = useMutation({
		mutationFn: async (data: { transactionId: string; comments: string }) => {
			const response =
				await JournalEntriesService.postV1JournalentriesByTransactionId({
					transactionId: data.transactionId,
					command: "reverse",
					// @ts-expect-error comments is not in the type but it exists
					requestBody: {
						comments: data.comments,
					},
				});
			return response;
		},
		onSuccess: () => {
			toast.success(
				"Journal entry reversed successfully! A reversing entry has been created.",
				{ duration: 6000 },
			);
			queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
			queryClient.invalidateQueries({ queryKey: ["journal-entry-detail"] });
			queryClient.invalidateQueries({ queryKey: ["accounting-stats"] });
			// Navigate back to journal entries list
			setTimeout(() => {
				navigate({ to: "/journal-entries" });
			}, 1500);
		},
		onError: (error: Error) => {
			toast.error(`Failed to reverse entry: ${error.message}`);
		},
	});

	const handleBack = () => {
		navigate({ to: "/journal-entries" });
	};

	const handleReverse = () => {
		if (!entry) return;

		const reason = window.prompt(
			"Please enter a reason for reversing this journal entry:",
		);

		if (reason && reason.trim()) {
			const confirmed = window.confirm(
				`Are you sure you want to reverse this journal entry?\n\nThis will create a reversing entry that swaps debits and credits.\n\nReason: ${reason}`,
			);

			if (confirmed) {
				reverseMutation.mutate({
					transactionId: entry.transactionId,
					comments: reason,
				});
			}
		} else if (reason !== null) {
			toast.error("A reason is required to reverse an entry");
		}
	};

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
			navigate({ to: "/approval-queue" });
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
			navigate({ to: "/approval-queue" });
		},
		onError: (error: Error) => {
			toast.error(`Rejection failed: ${error.message}`);
		},
	});

	const handleApprove = () => {
		if (!auditId) return;
		approveMutation.mutate(auditId);
	};

	const handleReject = () => {
		if (!auditId) return;
		rejectMutation.mutate(auditId);
	};

	return {
		entry,
		isLoading,
		isReversing: reverseMutation.isPending,
		isProcessing: approveMutation.isPending || rejectMutation.isPending,
		onBack: handleBack,
		onReverse: handleReverse,
		onApprove: handleApprove,
		onReject: handleReject,
		showApprovalActions: !!auditId,
	};
}
