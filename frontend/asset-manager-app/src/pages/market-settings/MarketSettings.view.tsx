import { Card } from "@fineract-apps/ui";
import { Clock, Power } from "lucide-react";
import { FC } from "react";
import { useMarketSettings } from "./useMarketSettings";

function formatCountdown(seconds: number): string {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = seconds % 60;
	return `${h}h ${m}m ${s}s`;
}

export const MarketSettingsView: FC<ReturnType<typeof useMarketSettings>> = ({
	marketStatus,
	isLoading,
}) => {
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
			</div>
		);
	}

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				<h1 className="text-2xl font-bold text-gray-800 mb-6">
					Market Settings
				</h1>

				{/* Market Status */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<Card className="p-6">
						<div className="flex items-center gap-4">
							<div
								className={`p-3 rounded-full ${
									marketStatus?.isOpen ? "bg-green-100" : "bg-red-100"
								}`}
							>
								<Power
									className={`h-6 w-6 ${
										marketStatus?.isOpen ? "text-green-600" : "text-red-600"
									}`}
								/>
							</div>
							<div>
								<p className="text-sm text-gray-500">Market Status</p>
								<p
									className={`text-2xl font-bold ${
										marketStatus?.isOpen ? "text-green-600" : "text-red-600"
									}`}
								>
									{marketStatus?.isOpen ? "Open" : "Closed"}
								</p>
							</div>
						</div>
					</Card>

					<Card className="p-6">
						<div className="flex items-center gap-4">
							<div className="p-3 rounded-full bg-blue-100">
								<Clock className="h-6 w-6 text-blue-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">
									{marketStatus?.isOpen
										? "Time Until Close"
										: "Time Until Open"}
								</p>
								<p className="text-2xl font-bold text-gray-900">
									{marketStatus?.isOpen
										? formatCountdown(marketStatus?.secondsUntilClose ?? 0)
										: formatCountdown(marketStatus?.secondsUntilOpen ?? 0)}
								</p>
							</div>
						</div>
					</Card>
				</div>

				{/* Schedule */}
				<Card className="p-6 mb-6">
					<h2 className="text-lg font-semibold text-gray-800 mb-4">
						Trading Schedule
					</h2>
					<div className="space-y-3">
						<div className="flex justify-between items-center py-2 border-b border-gray-100">
							<span className="text-gray-600">Schedule</span>
							<span className="font-medium">
								{marketStatus?.schedule ?? "8:00 AM - 8:00 PM WAT"}
							</span>
						</div>
						<div className="flex justify-between items-center py-2 border-b border-gray-100">
							<span className="text-gray-600">Timezone</span>
							<span className="font-medium">Africa/Lagos (WAT)</span>
						</div>
						<div className="flex justify-between items-center py-2 border-b border-gray-100">
							<span className="text-gray-600">Weekend Trading</span>
							<span className="font-medium text-red-600">Disabled</span>
						</div>
						<div className="flex justify-between items-center py-2">
							<span className="text-gray-600">Trading Days</span>
							<span className="font-medium">Monday - Friday</span>
						</div>
					</div>
				</Card>

				{/* Info */}
				<Card className="p-6">
					<h2 className="text-lg font-semibold text-gray-800 mb-4">
						Market Rules
					</h2>
					<div className="space-y-2 text-sm text-gray-600">
						<p>
							Trading is only allowed during market hours. Orders placed outside
							these hours will be rejected with a MARKET_CLOSED error.
						</p>
						<p>
							Individual assets can be halted independently using the
							Halt/Resume controls on the asset detail page.
						</p>
						<p>
							Market hours are configured in the backend application.yml and
							require a service restart to change.
						</p>
					</div>
				</Card>
			</main>
		</div>
	);
};
