import { createFileRoute } from "@tanstack/react-router";
import { JournalEntriesContainer } from "./JournalEntriesContainer";

export const Route = createFileRoute("/journal-entries/")({
	component: JournalEntriesContainer,
});
