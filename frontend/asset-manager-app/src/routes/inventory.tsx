import { createFileRoute } from "@tanstack/react-router";
import { Inventory } from "../pages/inventory/Inventory";

export const Route = createFileRoute("/inventory")({
	component: Inventory,
});
