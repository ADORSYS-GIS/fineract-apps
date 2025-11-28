import { JournalEntryDetailView } from "./JournalEntryDetailView";
import { useJournalEntryDetail } from "./useJournalEntryDetail";

export function JournalEntryDetailContainer() {
	const {
		entry,
		isLoading,
		isReversing,
		approvalHistory,
		changeLog,
		userActivityLog,
		onBack,
		onReverse,
	} = useJournalEntryDetail();

	return (
		<JournalEntryDetailView
			entry={entry || null}
			isLoading={isLoading}
			isReversing={isReversing}
			approvalHistory={approvalHistory}
			changeLog={changeLog}
			userActivityLog={userActivityLog}
			onBack={onBack}
			onReverse={onReverse}
		/>
	);
}
