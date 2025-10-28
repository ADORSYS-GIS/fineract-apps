import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

function HomePage() {
	const { t } = useTranslation();
	return <div>{t("accountManagerHomePage")}</div>;
}

export const Route = createFileRoute("/")({
	component: HomePage,
});
