import { Card } from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import {
	assetApi,
	type IncomeEvent,
	type MonthlyAggregate,
} from "@/services/assetApi";

interface Props {
	months?: number;
}

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n));

const INCOME_TYPE_LABELS: Record<string, string> = {
	COUPON: "Coupon",
	DIVIDEND: "Dividend",
	RENT: "Rent",
	HARVEST_YIELD: "Harvest Yield",
	PROFIT_SHARE: "Profit Share",
	PRINCIPAL_REDEMPTION: "Principal Redemption",
};

const BADGE_COLORS: Record<string, string> = {
	COUPON: "bg-blue-100 text-blue-800",
	DIVIDEND: "bg-green-100 text-green-800",
	RENT: "bg-orange-100 text-orange-800",
	HARVEST_YIELD: "bg-yellow-100 text-yellow-800",
	PROFIT_SHARE: "bg-purple-100 text-purple-800",
	PRINCIPAL_REDEMPTION: "bg-gray-100 text-gray-800",
};

export const IncomeCalendarCard: FC<Props> = ({ months = 12 }) => {
	const { data, isLoading } = useQuery({
		queryKey: ["income-calendar", months],
		queryFn: () => assetApi.getIncomeCalendar(months),
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

	if (!data || data.events.length === 0) {
		return (
			<Card className="p-4 mb-6">
				<h2 className="text-lg font-semibold text-gray-800 mb-3">
					Income Calendar
				</h2>
				<p className="text-sm text-gray-500 py-4 text-center">
					No upcoming income events. Invest in income-generating assets to see
					projected payments here.
				</p>
			</Card>
		);
	}

	const maxMonthlyAmount = Math.max(
		...data.monthlyTotals.map((m) => m.totalAmount),
		1,
	);

	return (
		<div className="space-y-6">
			{/* Summary */}
			<Card className="p-4">
				<h2 className="text-lg font-semibold text-gray-800 mb-3">
					Income Calendar
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div>
						<p className="text-xs text-gray-500 uppercase tracking-wider">
							Total Expected
						</p>
						<p className="text-2xl font-bold text-gray-900">
							{fmt(data.totalExpectedIncome)} XAF
						</p>
						<p className="text-xs text-gray-500">Next {months} months</p>
					</div>
					<div>
						<p className="text-xs text-gray-500 uppercase tracking-wider">
							Upcoming Events
						</p>
						<p className="text-2xl font-bold text-gray-900">
							{data.events.length}
						</p>
						<p className="text-xs text-gray-500">payments scheduled</p>
					</div>
					<div>
						<p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
							By Type
						</p>
						<div className="space-y-1">
							{Object.entries(data.totalByIncomeType).map(([type, amount]) => (
								<div key={type} className="flex justify-between text-xs">
									<span className="text-gray-600">
										{INCOME_TYPE_LABELS[type] ?? type}
									</span>
									<span className="font-medium">{fmt(amount)} XAF</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</Card>

			{/* Monthly Bar Chart */}
			<Card className="p-4">
				<h3 className="text-sm font-medium text-gray-500 mb-3">
					Monthly Income Projection
				</h3>
				<div className="flex items-end gap-1 h-40">
					{data.monthlyTotals.map((m: MonthlyAggregate) => {
						const height = Math.max(
							(m.totalAmount / maxMonthlyAmount) * 100,
							2,
						);
						const monthLabel = m.month.substring(5); // "2026-03" → "03"
						return (
							<div key={m.month} className="flex-1 flex flex-col items-center">
								<span className="text-xs text-gray-500 mb-1">
									{fmt(m.totalAmount)}
								</span>
								<div
									className="w-full bg-blue-500 rounded-t"
									style={{ height: `${height}%` }}
									title={`${m.month}: ${fmt(m.totalAmount)} XAF (${m.eventCount} events)`}
								/>
								<span className="text-xs text-gray-400 mt-1">{monthLabel}</span>
							</div>
						);
					})}
				</div>
			</Card>

			{/* Event List */}
			<Card className="p-4">
				<h3 className="text-sm font-medium text-gray-500 mb-3">
					Upcoming Payments
				</h3>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200 text-sm">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-3 py-2 text-left font-medium text-gray-500">
									Date
								</th>
								<th className="px-3 py-2 text-left font-medium text-gray-500">
									Asset
								</th>
								<th className="px-3 py-2 text-left font-medium text-gray-500">
									Type
								</th>
								<th className="px-3 py-2 text-right font-medium text-gray-500">
									Units
								</th>
								<th className="px-3 py-2 text-right font-medium text-gray-500">
									Rate
								</th>
								<th className="px-3 py-2 text-right font-medium text-gray-500">
									Amount (XAF)
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{data.events.map((event: IncomeEvent, idx: number) => (
								<tr
									key={`${event.assetId}-${event.paymentDate}-${idx}`}
									className="hover:bg-gray-50"
								>
									<td className="px-3 py-2 whitespace-nowrap">
										{event.paymentDate}
									</td>
									<td className="px-3 py-2">
										<span className="font-medium">{event.symbol}</span>
										<span className="text-gray-400 ml-1 text-xs">
											{event.assetName}
										</span>
									</td>
									<td className="px-3 py-2">
										<span
											className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${BADGE_COLORS[event.incomeType] ?? "bg-gray-100 text-gray-800"}`}
										>
											{INCOME_TYPE_LABELS[event.incomeType] ?? event.incomeType}
										</span>
									</td>
									<td className="px-3 py-2 text-right">
										{event.units.toLocaleString()}
									</td>
									<td className="px-3 py-2 text-right">
										{event.rateApplied > 0 ? `${event.rateApplied}%` : "—"}
									</td>
									<td className="px-3 py-2 text-right font-medium">
										{fmt(event.expectedAmount)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	);
};
