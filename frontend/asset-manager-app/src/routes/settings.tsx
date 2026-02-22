import { Card } from "@fineract-apps/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ErrorFallback } from "@/components/ErrorFallback";

export const Route = createFileRoute("/settings")({
	component: Settings,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});

function Settings() {
	const { t } = useTranslation();

	const apiEndpoint =
		import.meta.env.VITE_ASSET_SERVICE_URL || "http://localhost:8083";
	const authMode = import.meta.env.VITE_AUTH_MODE || "basic";
	const appVersion = "1.0.0";

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				<h1 className="text-2xl font-bold text-gray-800 mb-6">
					{t("sidebar.settings")}
				</h1>

				<Card className="p-6 max-w-lg">
					<h2 className="text-lg font-semibold text-gray-800 mb-4">
						Application Info
					</h2>
					<div className="space-y-4 text-sm">
						<div className="flex justify-between">
							<span className="text-gray-500">API Endpoint</span>
							<span className="font-mono text-gray-900">{apiEndpoint}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-500">Auth Mode</span>
							<span className="font-medium text-gray-900">{authMode}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-500">App Version</span>
							<span className="font-medium text-gray-900">{appVersion}</span>
						</div>
					</div>
				</Card>
			</main>
		</div>
	);
}
