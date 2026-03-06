import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { FC, useState } from "react";
import { assetApi, type PaymentResultResponse } from "@/services/assetApi";

interface Props {
	paymentId: number;
	totalResults: number;
}

export const PaymentResultsPreview: FC<Props> = ({
	paymentId,
	totalResults,
}) => {
	const [expanded, setExpanded] = useState(true);

	const { data, isLoading } = useQuery({
		queryKey: ["payment-results-preview", paymentId],
		queryFn: () =>
			assetApi.getScheduledPaymentResults(paymentId, { page: 0, size: 5 }),
		select: (res) => res.data,
	});

	const results = data?.content ?? [];

	return (
		<div className="mt-3">
			<button
				type="button"
				onClick={() => setExpanded((e) => !e)}
				className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-gray-900"
			>
				<span className={`transition-transform ${expanded ? "rotate-90" : ""}`}>
					&#9654;
				</span>
				Payment Results
				{totalResults > 0 && (
					<span className="text-xs font-normal text-gray-500">
						({totalResults})
					</span>
				)}
			</button>

			{expanded && (
				<div className="mt-2">
					{isLoading ? (
						<div className="flex justify-center py-4">
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
						</div>
					) : results.length === 0 ? (
						<p className="text-xs text-gray-500 py-2">
							No individual payment records found.
						</p>
					) : (
						<>
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200 text-xs">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-2 py-1.5 text-left font-medium text-gray-500">
												User
											</th>
											<th className="px-2 py-1.5 text-right font-medium text-gray-500">
												Units
											</th>
											<th className="px-2 py-1.5 text-right font-medium text-gray-500">
												Amount
											</th>
											<th className="px-2 py-1.5 text-left font-medium text-gray-500">
												Status
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-100">
										{results.map((r: PaymentResultResponse) => (
											<tr key={r.id} className="hover:bg-gray-50">
												<td className="px-2 py-1.5">{r.userId}</td>
												<td className="px-2 py-1.5 text-right">
													{r.units.toLocaleString()}
												</td>
												<td className="px-2 py-1.5 text-right font-medium">
													{r.amount.toLocaleString()}
												</td>
												<td className="px-2 py-1.5">
													<span
														className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
															r.status === "SUCCESS"
																? "bg-green-100 text-green-800"
																: "bg-red-100 text-red-800"
														}`}
													>
														{r.status}
													</span>
													{r.failureReason && (
														<p className="text-xs text-red-600 mt-0.5 truncate max-w-[150px]">
															{r.failureReason}
														</p>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{totalResults > 5 && (
								<Link
									to="/payment-results/$paymentId"
									params={{ paymentId: String(paymentId) }}
									className="block mt-2 text-xs text-blue-600 hover:underline text-center"
								>
									View all {totalResults} results &rarr;
								</Link>
							)}
						</>
					)}
				</div>
			)}
		</div>
	);
};
