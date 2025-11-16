import { createFileRoute } from "@tanstack/react-router";
import { CashShortOverContainer } from "./CashShortOverContainer";

export const Route = createFileRoute("/cash-short-over/")({
	component: CashShortOverContainer,
});
