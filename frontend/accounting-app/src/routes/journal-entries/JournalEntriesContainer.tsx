import { JournalEntriesView } from "./JournalEntriesView";
import { useJournalEntries } from "./useJournalEntries";

export function JournalEntriesContainer() {
	const {
		journalEntries,
		isLoading,
		dateRange,
		transactionType,
		onDateRangeChange,
		onFilterByType,
		onExportCSV,
		onViewDetails,
		currentPage,
		totalPages,
		onPageChange,
	} = useJournalEntries();

	return (
		<JournalEntriesView
			journalEntries={journalEntries}
			isLoading={isLoading}
			dateRange={dateRange}
			transactionType={transactionType}
			onDateRangeChange={onDateRangeChange}
			onFilterByType={onFilterByType}
			onExportCSV={onExportCSV}
			onViewDetails={onViewDetails}
			currentPage={currentPage}
			totalPages={totalPages}
			onPageChange={onPageChange}
		/>
	);
}
