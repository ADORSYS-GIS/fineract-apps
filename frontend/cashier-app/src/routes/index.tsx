import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

function HomePage() {
	const { t } = useTranslation();
	return <div>{t("cashierHomePage")}</div>;
}

export const Route = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({
			to: "/dashboard",
			search: { query: "", page: 1, limit: 10 },
		});
	},
	component: HomePage,
});
