import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SavingsAccountDetails } from "../pages/savings-account-details/SavingsAccountDetails";

const savingsAccountDetailsSearchSchema = z.object({
	action: z.string().optional(),
});

export const Route = createFileRoute("/savings-account-details/$accountId")({
	component: SavingsAccountDetails,
	validateSearch: (search) => savingsAccountDetailsSearchSchema.parse(search),
});
