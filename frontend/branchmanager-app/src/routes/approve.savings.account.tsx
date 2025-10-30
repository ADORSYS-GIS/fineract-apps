import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ApproveSavingsAccount } from "@/pages/approve-savings-account/ApproveSavingsAccount";

const savingsAccountSearchSchema = z.object({
	accountId: z.number().optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
});

export const Route = createFileRoute("/approve/savings/account")({
	validateSearch: (search) => savingsAccountSearchSchema.parse(search),
	component: ApproveSavingsAccount,
});
// Note: Component moved into pages with logic-view separation.
