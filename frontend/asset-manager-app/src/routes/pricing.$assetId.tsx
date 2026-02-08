import { createFileRoute } from "@tanstack/react-router";
import { Pricing } from "../pages/pricing/Pricing";

export const Route = createFileRoute("/pricing/$assetId")({
	component: Pricing,
});
