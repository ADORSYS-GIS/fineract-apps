import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

function RedirectToDashboard() {
	const { t } = useTranslation();
	return <Navigate to="/dashboard" aria-label={t("branchManagerHomePage")} />;
}

export const Route = createFileRoute("/")({
	component: RedirectToDashboard,
});
