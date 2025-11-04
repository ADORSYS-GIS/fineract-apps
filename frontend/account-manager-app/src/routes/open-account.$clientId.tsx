import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { OpenAccount } from "../pages/open-account/OpenAccount";

const openAccountSearchSchema = z.object({
	accountType: z.string().optional(),
});

export const Route = createFileRoute("/open-account/$clientId")({
	component: OpenAccount,
	validateSearch: (search) => openAccountSearchSchema.parse(search),
});
