import { createFileRoute } from "@tanstack/react-router";
import { MarketSettings } from "../pages/market-settings/MarketSettings";

export const Route = createFileRoute("/market-settings")({
	component: MarketSettings,
});
