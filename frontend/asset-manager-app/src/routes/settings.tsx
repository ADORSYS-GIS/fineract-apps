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

	const fineractApiUrl =
		import.meta.env.VITE_FINERACT_API_URL || "http://localhost:8443";
	const apiVersionMatch = fineractApiUrl.match(/\/v(\d+)/);
	const apiVersion = apiVersionMatch ? `v${apiVersionMatch[1]}` : "v1";

	const [backendVersion, setBackendVersion] = useState<{
		commit: string;
		branch: string;
	} | null>(null);

	useEffect(() => {
		fetch("/api/v1/version")
			.then((res) => res.json())
			.then(setBackendVersion)
			.catch(() => setBackendVersion(null));
	}, []);

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				<h1 className="text-2xl font-bold text-gray-800 mb-6">
					{t("sidebar.settings")}
				</h1>

				<Card className="p-6 max-w-lg">
					<h2 className="text-lg font-semibold text-gray-800 mb-4">
						{t("assetManager.settings.applicationInfo")}
					</h2>
					<div className="space-y-4 text-sm">
						<div className="flex justify-between">
							<span className="text-gray-500">
								{t("assetManager.settings.apiVersion")}
							</span>
							<span className="font-mono text-gray-900">{apiVersion}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-500">
								{t("assetManager.settings.releaseTag")}
							</span>
							<span className="font-mono text-gray-900">{__BUILD_TAG__}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-500">
								{t("assetManager.settings.assetManager")}
							</span>
							<span className="font-mono text-gray-900">{__COMMIT_SHA__}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-500">
								{t("assetManager.settings.assetService")}
							</span>
							<span className="font-mono text-gray-900">
								{backendVersion && backendVersion.commit !== "unknown"
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
