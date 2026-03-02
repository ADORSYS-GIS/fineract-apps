import { Card } from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import { assetApi } from "@/services/assetApi";

interface Props {
	assetId: string;
}

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n));

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

export const CouponForecastCard: FC<Props> = ({ assetId }) => {
	const { data: forecast, isLoading } = useQuery({
		queryKey: ["coupon-forecast", assetId],
		queryFn: () => assetApi.getCouponForecast(assetId),
		select: (res) => res.data,
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

	return (
		<Card className="p-4 mb-6">
			<h2 className="text-lg font-semibold text-gray-800 mb-3">
				Coupon Obligation Forecast
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				<div>
					<h3 className="text-sm font-medium text-gray-500 mb-2">
						Obligations
					</h3>
					<Row
						label="Coupon per period"
						description="Interest paid to all holders each coupon cycle"
						value={`${fmt(forecast.couponPerPeriod)} XAF`}
					/>
					<Row
						label="Remaining periods"
						description="Number of coupon payments left until maturity"
						value={String(forecast.remainingCouponPeriods)}
					/>
					<Row
						label="Total coupon obligation"
						description="Sum of all future coupon payments owed to holders"
						value={`${fmt(forecast.totalRemainingCouponObligation)} XAF`}
					/>
					<Row
						label="Principal at maturity"
						description="Total face value to repay holders when the bond expires"
						value={`${fmt(forecast.principalAtMaturity)} XAF`}
					/>
					<Row
						label="Total obligation"
						description="Coupons + principal — full amount the entity must pay"
						value={`${fmt(forecast.totalObligation)} XAF`}
					/>
				</div>

				<div>
					<h3 className="text-sm font-medium text-gray-500 mb-2">
						LP Coverage
					</h3>
					<Row
						label="LP cash balance"
						description="Current cash available in the LP's cash account"
						value={`${fmt(forecast.lpCashBalance)} XAF`}
					/>
					<Row
						label="Shortfall"
						description="Extra money the entity must deposit to cover all obligations"
						value={
							hasShortfall ? `${fmt(forecast.shortfall)} XAF` : "None (surplus)"
						}
						highlight={hasShortfall}
					/>
					<Row
						label="Coupons covered"
						description="How many coupon cycles the current balance can fund"
						value={`${forecast.couponsCoveredByBalance} payments`}
					/>
					<Row
						label="Units outstanding"
						description="Total bond units currently held by investors"
						value={String(forecast.totalUnitsOutstanding)}
					/>
					<Row
						label="Next coupon date"
						description="Date of the next scheduled interest payment"
						value={forecast.nextCouponDate ?? "N/A"}
					/>
				</div>
			</div>

			{hasShortfall && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
					<p className="text-sm text-red-800">
						The entity needs to deposit at least{" "}
						<strong>{fmt(forecast.shortfall)} XAF</strong> to cover all
						remaining coupons and principal repayment.
					</p>
				</div>
			)}
		</Card>
	);
};
