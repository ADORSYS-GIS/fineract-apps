import { createFileRoute, Navigate } from "@tanstack/react-router";

function RedirectToDashboard() {
	return <Navigate to="/dashboard" />;
}

export const Route = createFileRoute("/")({
	component: RedirectToDashboard,
});
