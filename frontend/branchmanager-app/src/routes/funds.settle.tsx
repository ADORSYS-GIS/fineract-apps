import { createFileRoute } from "@tanstack/react-router";
import SettleFunds from "../pages/funds/settle/SettleFunds";

export const Route = createFileRoute("/funds/settle")({
	component: SettleFunds,
});
