import {
	AuditsService,
	JournalEntriesService,
	MakerCheckerOr4EyeFunctionalityService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import toast from "react-hot-toast";
import "../../../lib/api";

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
}

export interface ApprovalHistory {
	id: number;
	actionName: string;
	maker: string;
	madeOnDate: string;
}

export interface ChangeLog {
	id: number;
	actionName: string;
	maker: string;
	madeOnDate: string;
	command: string;
}

export interface UserActivityLog {
	id: number;
	actionName: string;
	entityName: string;
	resourceId: number;
	maker: string;
	madeOnDate: string;
}

// Helper function to transform API response to local JournalEntryDetail type
// biome-ignore lint/suspicious/noExplicitAny: The auto-generated Fineract API client types are incomplete
const transformJournalEntry = (apiEntry: any): JournalEntryDetail => {
	// The API's CreditDebit type might be incomplete in the generated client.
	// We assume glAccountName and glAccountCode are present in the response.
	const mapCreditDebit = (
		// biome-ignore lint/suspicious/noExplicitAny: The auto-generated Fineract API client types are incomplete
		item: any,
	): {
		glAccountId: number;
		glAccountName: string;
		glAccountCode: string;
		amount: number;
	} => ({
		glAccountId: item.glAccountId,
		glAccountName: item.glAccountName,
		glAccountCode: item.glAccountCode,
		amount: item.amount,
	});

	return {
		id: apiEntry.id || 0,
		transactionId: apiEntry.transactionId || "",
		transactionDate: apiEntry.transactionDate || "",
		officeName: apiEntry.officeName || "",
		comments: apiEntry.comments,
		createdBy: apiEntry.submittedByUsername || "N/A",
		createdDate: apiEntry.submittedOnDate || "",
		debits: apiEntry.transactionDetails?.debits?.map(mapCreditDebit) || [],
		credits: apiEntry.transactionDetails?.credits?.map(mapCreditDebit) || [],
		referenceNumber: apiEntry.transactionDetails?.referenceNumber,
	};
};

export function useJournalEntryDetail() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { entryId } = useParams({ from: "/journal-entries/$entryId" });

	const { data: entry, isLoading } = useQuery<JournalEntryDetail | null>({
		queryKey: ["journal-entry-detail", entryId],
		queryFn: async () => {
			if (!entryId) return null;
			try {
				const journalEntryData =
					await JournalEntriesService.getV1JournalentriesByJournalEntryId({
						journalEntryId: Number(entryId),
						transactionDetails: true,
					});

				if (!journalEntryData) return null;

				// biome-ignore lint/suspicious/noExplicitAny: The auto-generated Fineract API client types are incomplete
				return transformJournalEntry(journalEntryData as any);
			} catch (error) {
				console.error("Failed to fetch journal entry:", error);
				toast.error("Failed to fetch journal entry details.");
				return null;
			}
		},
	});

	const { data: approvalHistory } = useQuery<ApprovalHistory[]>({
		queryKey: ["journal-entry-approval-history", entryId],
		queryFn: async () => {
			if (!entry) return [];
			const history =
				await MakerCheckerOr4EyeFunctionalityService.getV1Makercheckers({
					loanid: Number(entry.id),
				});
			// The API returns all history, so we map it to our simpler type
			return (
				history.map(
					// biome-ignore lint/suspicious/noExplicitAny: The auto-generated Fineract API client types are incomplete
					(item: any) =>
						({
							id: item.id,
							actionName: item.actionName,
							maker: item.maker,
							madeOnDate: item.madeOnDate,
						}) as ApprovalHistory,
				) || []
			);
		},
		enabled: !!entry, // Only run this query after the main entry is fetched
	});

	const { data: changeLog } = useQuery<ChangeLog[]>({
		queryKey: ["journal-entry-change-log", entryId],
		queryFn: async () => {
			if (!entry) return [];
			// This is a placeholder for the actual API call
			// You would replace this with the correct AuditsService method
			const log = await AuditsService.getV1Audits({
				resourceId: entry.id,
			});
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const parsedLog = JSON.parse(log as any);
			return (
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				parsedLog.pageItems?.map(
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					(item: any) =>
						({
							id: item.id,
							actionName: item.actionName,
							maker: item.maker,
							madeOnDate: item.madeOnDate,
							command: item.command,
						}) as ChangeLog,
				) || []
			);
		},
		enabled: !!entry,
	});

	const { data: userActivityLog } = useQuery<UserActivityLog[]>({
		queryKey: ["journal-entry-user-activity", entry?.createdBy],
		queryFn: async () => {
			if (!entry) return [];
			const log = await AuditsService.getV1Audits({
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				makerId: entry.createdBy as any,
			});
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const parsedLog = JSON.parse(log as any);
			return (
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				parsedLog.pageItems?.map(
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					(item: any) =>
						({
							id: item.id,
							actionName: item.actionName,
							entityName: item.entityName,
							resourceId: item.resourceId,
							maker: item.maker,
							madeOnDate: item.madeOnDate,
						}) as UserActivityLog,
				) || []
			);
		},
		enabled: !!entry,
	});

	const reverseMutation = useMutation({
		mutationFn: async (data: { transactionId: string; comments: string }) => {
			const response =
				await JournalEntriesService.postV1JournalentriesByTransactionId({
					transactionId: data.transactionId,
					command: "reverse",
					requestBody: {
						comments: data.comments,
						// biome-ignore lint/suspicious/noExplicitAny: The auto-generated Fineract API client types are incomplete for this command
					} as any,
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

	return {
		entry,
		isLoading,
		isReversing: reverseMutation.isPending,
		approvalHistory: approvalHistory || [],
		changeLog: changeLog || [],
		userActivityLog: userActivityLog || [],
		onBack: handleBack,
		onReverse: handleReverse,
	};
}
