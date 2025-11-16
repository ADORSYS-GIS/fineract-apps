import { JournalEntryDetailView } from "./JournalEntryDetailView";
import { useJournalEntryDetail } from "./useJournalEntryDetail";

export function JournalEntryDetailContainer() {
	const { entry, isLoading, onBack } = useJournalEntryDetail();

	return (
		<JournalEntryDetailView
			entry={entry}
			isLoading={isLoading}
			onBack={onBack}
		/>
	);
}
