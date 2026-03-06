import { Card } from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { assetApi } from "@/services/assetApi";

interface Props {
	assetId: string;
}

export const CouponSummaryCard: FC<Props> = ({ assetId }) => {
	const { data, isLoading } = useQuery({
		queryKey: ["coupon-summary", assetId],
		queryFn: () => assetApi.getCouponSummary(assetId),
		select: (res) => res.data,
	});

	return (
		<Card className="p-4 mb-6">
			<h2 className="text-lg font-semibold text-gray-800 mb-3">
				Coupon Payment Summary
			</h2>

			{isLoading ? (
				<div className="flex justify-center py-4">
					<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
				</div>
			) : !data || data.totalPaymentCount === 0 ? (
				<p className="text-sm text-gray-500 py-2 text-center">
					No coupon payments yet.
				</p>
			) : (
				<div className="space-y-3 text-sm">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-gray-500">Last Coupon</p>
							<p className="font-medium">{data.lastPaymentDate ?? "—"}</p>
							{data.lastPaymentAt && (
								<p className="text-xs text-gray-400">
									{new Date(data.lastPaymentAt).toLocaleString()}
								</p>
							)}
						</div>
						<div>
							<p className="text-gray-500">Next Scheduled</p>
							<p className="font-medium">
								{data.nextScheduledDate ?? "None pending"}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
						<div>
							<p className="text-gray-500">Total Paid to Date</p>
							<p className="font-semibold text-gray-900">
								{data.totalPaidToDate?.toLocaleString() ?? 0} XAF
							</p>
						</div>
						<div>
							<p className="text-gray-500">Failed Payments</p>
							<p
								className={`font-semibold ${data.failedPaymentCount > 0 ? "text-red-600" : "text-gray-700"}`}
							>
								{data.failedPaymentCount}
								{data.failedPaymentCount > 0 && (
									<span className="text-xs font-normal text-red-500 ml-1">
										of {data.totalPaymentCount}
									</span>
								)}
							</p>
						</div>
					</div>
				</div>
			)}

			<div className="mt-3 pt-3 border-t border-gray-100">
				<Link
					to="/scheduled-payments"
					search={{ assetId }}
					className="text-sm text-blue-600 hover:underline"
				>
					View all scheduled payments &rarr;
				</Link>
			</div>
		</Card>
	);
};
