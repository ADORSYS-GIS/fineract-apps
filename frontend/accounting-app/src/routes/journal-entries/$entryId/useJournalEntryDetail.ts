import { JournalEntriesService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
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

	const handleBack = () => {
		navigate({ to: "/journal-entries" });
	};

	return {
		entry,
		isLoading,
		onBack: handleBack,
	};
}
