import { createFileRoute } from "@tanstack/react-router";
import Fund from "../pages/funds/Fund";

export const Route = createFileRoute("/fund")({
	component: Fund,
});
