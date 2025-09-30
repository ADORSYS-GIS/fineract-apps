import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/tellers/$tellerId/cashiers/$cashierId/allocate",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/tellers/$tellerId/cashiers/$cashierId/allocate"!</div>;
}
