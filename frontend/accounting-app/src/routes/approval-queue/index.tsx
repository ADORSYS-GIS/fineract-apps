import { createFileRoute } from "@tanstack/react-router";
import { ApprovalQueueContainer } from "./ApprovalQueueContainer";

export const Route = createFileRoute("/approval-queue/")({
	component: ApprovalQueueContainer,
});
