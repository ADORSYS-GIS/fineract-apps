import { createFileRoute } from "@tanstack/react-router";
import { PendingJournalEntryReviewContainer } from "./PendingJournalEntryReviewContainer";

export const Route = createFileRoute("/approval-queue/$auditId/")({
	component: PendingJournalEntryReviewContainer,
});
