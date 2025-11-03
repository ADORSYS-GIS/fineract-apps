import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/loan-account-details/$loanId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/loan-account-details/$loanId"!</div>;
}
