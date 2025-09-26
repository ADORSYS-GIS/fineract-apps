import { createFileRoute, Navigate } from "@tanstack/react-router";

function RedirectToDashboard() {
	let isAuthenticated = false;
	try {
		isAuthenticated = localStorage.getItem("bm_auth") === "1";
	} catch {
		isAuthenticated = false;
	}
	if (!isAuthenticated) {
		return <Navigate to="/login" />;
	}
	return <Navigate to="/dashboard" />;
}

export const Route = createFileRoute("/")({
	component: RedirectToDashboard,
});
