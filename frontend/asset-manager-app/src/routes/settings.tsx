import { Card } from "@fineract-apps/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
		import.meta.env.VITE_FINERACT_API_URL || "http://localhost:8443";
	const authMode = import.meta.env.VITE_AUTH_MODE || "basic";
	const assetServiceUrl =
		import.meta.env.VITE_ASSET_SERVICE_URL || "http://localhost:8083";

	const [backendVersion, setBackendVersion] = useState<{
		commit: string;
		branch: string;
	} | null>(null);

	useEffect(() => {
		fetch(`${assetServiceUrl}/api/version`)
			.then((res) => res.json())
			.then(setBackendVersion)
			.catch(() => setBackendVersion(null));
	}, [assetServiceUrl]);

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
							<span className="text-gray-500">Release Tag</span>
							<span className="font-mono text-gray-900">{__BUILD_TAG__}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-500">Asset Manager</span>
							<span className="font-mono text-gray-900">{__COMMIT_SHA__}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-500">Asset Service</span>
							<span className="font-mono text-gray-900">
								{backendVersion
									? `${backendVersion.commit} (${backendVersion.branch})`
									: "—"}
							</span>
						</div>
					</div>
				</Card>
			</main>
		</div>
	);
}
