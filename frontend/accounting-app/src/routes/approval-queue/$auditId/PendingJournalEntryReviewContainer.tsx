import { Route } from "./index";
import { PendingJournalEntryReviewView } from "./PendingJournalEntryReviewView";
import { usePendingJournalEntryReview } from "./usePendingJournalEntryReview";

export const PendingJournalEntryReviewContainer = () => {
	const { auditId } = Route.useParams();
	const state = usePendingJournalEntryReview(auditId);
	return <PendingJournalEntryReviewView {...state} />;
};
