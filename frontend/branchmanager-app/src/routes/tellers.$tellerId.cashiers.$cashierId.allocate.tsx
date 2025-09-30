import { createFileRoute } from "@tanstack/react-router";
import { Allocate } from "../pages/cashier-actions/allocate/Allocate";

export const Route = createFileRoute(
	"/tellers/$tellerId/cashiers/$cashierId/allocate",
)({
	component: Allocate,
});
