import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { JournalEntryDetailContainer } from "./JournalEntryDetailContainer";

const journalEntrySearchSchema = z.object({
	auditId: z.number().optional(),
});

export const Route = createFileRoute("/journal-entries/$entryId/")({
	validateSearch: journalEntrySearchSchema,
	component: JournalEntryDetailContainer,
});
