import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/settings")({
	component: Settings,
});

function Settings() {
	const { t } = useTranslation();
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold text-gray-800">
				{t("sidebar.settings")}
			</h1>
			<p className="mt-2 text-gray-600">Settings page coming soon.</p>
		</div>
	);
}
