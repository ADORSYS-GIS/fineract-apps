import { createFileRoute } from "@tanstack/react-router";
import { SelectAccountType } from "../pages/select-account-type/SelectAccountType";

export const Route = createFileRoute("/select-account-type/$clientId")({
	component: SelectAccountType,
});
