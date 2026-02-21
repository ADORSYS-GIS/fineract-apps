import { Card } from "@fineract-apps/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FC, useState } from "react";
import { assetApi, type IncomeTriggerResponse } from "@/services/assetApi";

interface Props {
	assetId: string;
}

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n));

const FREQ_LABELS: Record<number, string> = {
	1: "Monthly",
	3: "Quarterly",
	6: "Semi-Annual",
	12: "Annual",
};

const INCOME_TYPE_LABELS: Record<string, string> = {
	DIVIDEND: "Dividend",
	RENT: "Rent",
	HARVEST_YIELD: "Harvest Yield",
	PROFIT_SHARE: "Profit Share",
};

const Row: FC<{
	label: string;
	value: string;
	description?: string;
	highlight?: boolean;
}> = ({ label, value, description, highlight }) => (
	<div className="flex justify-between items-start py-1.5 border-b border-gray-100 last:border-0">
		<div className="flex-1 mr-3">
			<span className="text-sm text-gray-600">{label}</span>
			{description && (
				<p className="text-xs text-gray-400 mt-0.5">{description}</p>
			)}
		</div>
		<span
			className={`text-sm font-medium whitespace-nowrap ${highlight ? "text-red-600" : "text-gray-900"}`}
		>
			{value}
		</span>
	</div>
);

export const IncomeForecastCard: FC<Props> = ({ assetId }) => {
	const queryClient = useQueryClient();
	const [triggerResult, setTriggerResult] =
		useState<IncomeTriggerResponse | null>(null);

	const { data: forecast, isLoading } = useQuery({
		queryKey: ["income-forecast", assetId],
		queryFn: () => assetApi.getIncomeForecast(assetId),
		select: (res) => res.data,
	});

	const triggerMutation = useMutation({
		mutationFn: () => assetApi.triggerIncomeDistribution(assetId),
		onSuccess: (res) => {
			setTriggerResult(res.data);
			queryClient.invalidateQueries({ queryKey: ["income-forecast", assetId] });
			queryClient.invalidateQueries({ queryKey: ["income-history", assetId] });
		},
	});

	if (isLoading) {
		return (
			<Card className="p-4 mb-6">
				<div className="flex justify-center py-8">
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
				</div>
			</Card>
		);
	}

	if (!forecast) return null;

	const hasShortfall = forecast.shortfall > 0;
	const incomeTypeLabel =
		INCOME_TYPE_LABELS[forecast.incomeType] ?? forecast.incomeType;
	const freqLabel =
		FREQ_LABELS[forecast.distributionFrequencyMonths] ??
		`Every ${forecast.distributionFrequencyMonths} months`;

	return (
		<Card className="p-4 mb-6">
			<h2 className="text-lg font-semibold text-gray-800 mb-3">
				Income Distribution Forecast
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				<div>
					<h3 className="text-sm font-medium text-gray-500 mb-2">
						Obligations
					</h3>
					<Row
						label="Income type"
						description="Type of periodic income distributed to holders"
						value={incomeTypeLabel}
					/>
					<Row
						label="Income per period"
						description="Total amount paid to all holders each distribution cycle"
						value={`${fmt(forecast.incomePerPeriod)} XAF`}
					/>
					<Row
						label="Distribution frequency"
						description="How often income is distributed"
						value={freqLabel}
					/>
					<Row
						label="Income rate"
						description="Annual rate applied to current market price"
						value={`${forecast.incomeRate}%`}
					/>
					<Row
						label="Current price"
						description="Market price used for income calculation"
						value={`${fmt(forecast.currentPrice)} XAF`}
					/>
				</div>

				<div>
					<h3 className="text-sm font-medium text-gray-500 mb-2">
						Treasury Coverage
					</h3>
					<Row
						label="Treasury balance"
						description="Current cash available in the treasury account"
						value={`${fmt(forecast.treasuryBalance)} XAF`}
					/>
					<Row
						label="Shortfall"
						description="Extra cash needed to cover the next distribution"
						value={
							hasShortfall ? `${fmt(forecast.shortfall)} XAF` : "None (surplus)"
						}
						highlight={hasShortfall}
					/>
					<Row
						label="Periods covered"
						description="How many distribution cycles the current balance can fund"
						value={`${forecast.periodsCoveredByBalance} payments`}
					/>
					<Row
						label="Units outstanding"
						description="Total asset units currently held by investors"
						value={String(forecast.totalUnitsOutstanding)}
					/>
					<Row
						label="Next distribution"
						description="Date of the next scheduled income payment"
						value={forecast.nextDistributionDate ?? "N/A"}
					/>
				</div>
			</div>

			{hasShortfall && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
					<p className="text-sm text-red-800">
						The treasury needs at least{" "}
						<strong>{fmt(forecast.shortfall)} XAF</strong> more to cover the
						next {incomeTypeLabel.toLowerCase()} distribution.
					</p>
				</div>
			)}

			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() => triggerMutation.mutate()}
					disabled={triggerMutation.isPending}
					className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{triggerMutation.isPending
						? "Processing..."
						: `Trigger ${incomeTypeLabel} Payment`}
				</button>

				{triggerResult && (
					<span className="text-sm text-gray-600">
						{triggerResult.holdersPaid} paid, {triggerResult.holdersFailed}{" "}
						failed, {fmt(triggerResult.totalAmountPaid)} XAF total
					</span>
				)}
			</div>
		</Card>
	);
};
