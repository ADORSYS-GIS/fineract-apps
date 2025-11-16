import { JournalEntriesService } from "@fineract-apps/fineract-api";
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

export function useJournalEntryDetail() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { entryId } = useParams({ from: "/journal-entries/$entryId" });

	const { data: entry, isLoading } = useQuery<JournalEntryDetail | null>({
		queryKey: ["journal-entry-detail", entryId],
		queryFn: async () => {
			// For now, return mock data since the API endpoint might not support individual entry fetch
			// In production, you would call: JournalEntriesService.getV1JournalentriesById({ id: entryId })

			// Mock data for development
			return {
				id: Number(entryId),
				transactionId: `JE-${entryId}`,
				transactionDate: new Date().toISOString(),
				officeName: "Head Office",
				referenceNumber: "REF-001",
				comments: "Monthly journal entry",
				createdBy: "admin",
				createdDate: new Date().toISOString(),
				debits: [
					{
						glAccountId: 1,
						glAccountName: "Cash",
						glAccountCode: "1000",
						amount: 5000,
					},
				],
				credits: [
					{
						glAccountId: 10,
						glAccountName: "Revenue",
						glAccountCode: "4000",
						amount: 5000,
					},
				],
			};
		},
	});

	const reverseMutation = useMutation({
		mutationFn: async (data: { transactionId: string; comments: string }) => {
			const response =
				await JournalEntriesService.postV1JournalentriesByTransactionId({
					transactionId: data.transactionId,
					command: "reverse",
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

	return {
		entry,
		isLoading,
		isReversing: reverseMutation.isPending,
		onBack: handleBack,
		onReverse: handleReverse,
	};
}
