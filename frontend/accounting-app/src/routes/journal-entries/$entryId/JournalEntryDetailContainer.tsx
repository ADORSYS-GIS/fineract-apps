import { JournalEntryDetailView } from "./JournalEntryDetailView";
import { useJournalEntryDetail } from "./useJournalEntryDetail";

export function JournalEntryDetailContainer() {
	const { entry, isLoading, isReversing, onBack, onReverse } =
		useJournalEntryDetail();

	return (
		<JournalEntryDetailView
			entry={entry}
			isLoading={isLoading}
			isReversing={isReversing}
			onBack={onBack}
			onReverse={onReverse}
		/>
	);
}
