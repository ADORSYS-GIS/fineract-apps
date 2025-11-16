import { createFileRoute } from "@tanstack/react-router";
import { JournalEntryDetailContainer } from "./$entryId/JournalEntryDetailContainer";

export const Route = createFileRoute("/journal-entries/$entryId")({
	component: JournalEntryDetailContainer,
});
