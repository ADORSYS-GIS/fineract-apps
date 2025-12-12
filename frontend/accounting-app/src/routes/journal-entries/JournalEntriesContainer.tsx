import { JournalEntriesView } from "./JournalEntriesView";
import { useJournalEntries } from "./useJournalEntries";

export function JournalEntriesContainer() {
	const {
		journalEntries,
		offices,
		glAccounts,
		filters,
		isLoading,
		onFilterChange,
		onExportCSV,
	} = useJournalEntries();

	return (
		<JournalEntriesView
			journalEntries={journalEntries}
			offices={offices}
			glAccounts={glAccounts}
			filters={filters}
			isLoading={isLoading}
			onFilterChange={onFilterChange}
			onExportCSV={onExportCSV}
		/>
	);
}
