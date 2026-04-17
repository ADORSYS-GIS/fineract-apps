import { Card } from "@fineract-apps/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import {
	type ReversalDeadLetterEntry,
	paymentGatewayAdminApi,
} from "@/services/assetApi";

const PROVIDER_LABELS: Record<ReversalDeadLetterEntry["provider"], string> = {
	MTN_MOMO: "MTN MoMo",
	ORANGE_MONEY: "Orange Money",
	CINETPAY: "CinetPay",
};

export const PaymentDlqTable: FC = () => {
	const queryClient = useQueryClient();
	const [showAll, setShowAll] = useState(false);
	const [retryingId, setRetryingId] = useState<number | null>(null);
	const [resolvingId, setResolvingId] = useState<number | null>(null);
	const [resolveNotes, setResolveNotes] = useState<Record<number, string>>({});

	const { data, isLoading } = useQuery({
		queryKey: ["payment-dlq", showAll],
		queryFn: () => paymentGatewayAdminApi.listDlq(showAll),
		select: (res) => res.data,
		refetchInterval: 30000,
	});

	const retryMutation = useMutation({
		mutationFn: (id: number) => paymentGatewayAdminApi.retryDlq(id),
		onSuccess: (res, id) => {
			if (res.data.resolved) {
				toast.success(`DLQ entry #${id} resolved via retry`);
			} else {
				toast.error(
					`Retry attempted but failed (retryCount=${res.data.retryCount}). Check logs.`,
				);
			}
			queryClient.invalidateQueries({ queryKey: ["payment-dlq"] });
		},
		onError: (_, id) => {
			toast.error(`Retry request failed for entry #${id}`);
		},
		onSettled: () => setRetryingId(null),
	});

	const resolveMutation = useMutation({
		mutationFn: ({ id, notes }: { id: number; notes?: string }) =>
			paymentGatewayAdminApi.resolveDlq(id, notes),
		onSuccess: (_, { id }) => {
			toast.success(`DLQ entry #${id} marked as resolved`);
			queryClient.invalidateQueries({ queryKey: ["payment-dlq"] });
		},
		onError: (_, { id }) => {
			toast.error(`Failed to resolve entry #${id}`);
		},
		onSettled: () => setResolvingId(null),
	});

	const entries = data ?? [];
	const unresolvedCount = entries.filter((e) => !e.resolved).length;

	return (
		<Card className="p-4">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-3">
					<h2 className="text-lg font-semibold text-gray-800">
						Reversal Dead-Letter Queue
					</h2>
					{unresolvedCount > 0 && (
						<span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
							<AlertTriangle className="h-3 w-3" />
							{unresolvedCount} pending
						</span>
					)}
				</div>
				<label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
					<input
						type="checkbox"
						checked={showAll}
						onChange={(e) => setShowAll(e.target.checked)}
						className="rounded border-gray-300"
					/>
					Show resolved
				</label>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-8">
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
				</div>
			) : entries.length === 0 ? (
				<div className="flex flex-col items-center py-10 text-gray-500">
					<CheckCircle className="h-8 w-8 text-green-400 mb-2" />
					<p className="text-sm">
						{showAll ? "No entries in the DLQ." : "No unresolved DLQ entries."}
					</p>
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200 text-sm">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-3 py-2 text-left font-medium text-gray-500">
									ID
								</th>
								<th className="px-3 py-2 text-left font-medium text-gray-500">
									Transaction
								</th>
								<th className="px-3 py-2 text-left font-medium text-gray-500">
									Provider
								</th>
								<th className="px-3 py-2 text-right font-medium text-gray-500">
									Amount
								</th>
								<th className="px-3 py-2 text-left font-medium text-gray-500">
									Failure reason
								</th>
								<th className="px-3 py-2 text-right font-medium text-gray-500">
									Retries
								</th>
								<th className="px-3 py-2 text-left font-medium text-gray-500">
									Created
								</th>
								<th className="px-3 py-2 text-left font-medium text-gray-500">
									Status
								</th>
								<th className="px-3 py-2 text-left font-medium text-gray-500">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{entries.map((entry) => (
								<tr
									key={entry.id}
									className={entry.resolved ? "bg-gray-50 opacity-60" : "hover:bg-gray-50"}
								>
									<td className="px-3 py-2 font-mono text-xs text-gray-500">
										#{entry.id}
									</td>
									<td className="px-3 py-2">
										<p className="font-mono text-xs truncate max-w-[120px]" title={entry.transactionId}>
											{entry.transactionId.slice(0, 8)}…
										</p>
										<p className="text-xs text-gray-400">
											acct #{entry.accountId}
										</p>
									</td>
									<td className="px-3 py-2 whitespace-nowrap">
										{PROVIDER_LABELS[entry.provider]}
										{entry.providerHint && (
											<span className="ml-1 text-xs text-gray-400">
												({entry.providerHint.replace("_MOMO", "").replace("_MONEY", "")})
											</span>
										)}
									</td>
									<td className="px-3 py-2 text-right font-medium whitespace-nowrap">
										{entry.amount.toLocaleString()} {entry.currency}
									</td>
									<td className="px-3 py-2 max-w-[200px]">
										<p
											className="text-xs text-red-600 truncate"
											title={entry.failureReason ?? ""}
										>
											{entry.failureReason ?? "—"}
										</p>
									</td>
									<td className="px-3 py-2 text-right text-gray-500">
										{entry.retryCount}
									</td>
									<td className="px-3 py-2 whitespace-nowrap text-gray-500 text-xs">
										{new Date(entry.createdAt).toLocaleString()}
									</td>
									<td className="px-3 py-2">
										{entry.resolved ? (
											<div>
												<span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
													<CheckCircle className="h-3 w-3" />
													Resolved
												</span>
												{entry.resolvedAt && (
													<p className="text-xs text-gray-400 mt-0.5">
														{new Date(entry.resolvedAt).toLocaleDateString()}
													</p>
												)}
												{entry.notes && (
													<p className="text-xs text-gray-500 mt-0.5 max-w-[120px] truncate" title={entry.notes}>
														{entry.notes}
													</p>
												)}
											</div>
										) : (
											<span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
												<AlertTriangle className="h-3 w-3" />
												Pending
											</span>
										)}
									</td>
									<td className="px-3 py-2">
										{!entry.resolved && (
											<div className="flex flex-col gap-1.5 min-w-[160px]">
												<button
													type="button"
													disabled={retryingId === entry.id}
													onClick={() => {
														setRetryingId(entry.id);
														retryMutation.mutate(entry.id);
													}}
													className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
												>
													<RefreshCw className={`h-3 w-3 ${retryingId === entry.id ? "animate-spin" : ""}`} />
													{retryingId === entry.id ? "Retrying…" : "Retry reversal"}
												</button>
												<div className="flex gap-1">
													<input
														type="text"
														placeholder="Resolution notes…"
														value={resolveNotes[entry.id] ?? ""}
														onChange={(e) =>
															setResolveNotes((prev) => ({
																...prev,
																[entry.id]: e.target.value,
															}))
														}
														className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 min-w-0"
													/>
													<button
														type="button"
														disabled={resolvingId === entry.id}
														onClick={() => {
															setResolvingId(entry.id);
															resolveMutation.mutate({
																id: entry.id,
																notes: resolveNotes[entry.id] || undefined,
															});
														}}
														className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 whitespace-nowrap"
													>
														<CheckCircle className="h-3 w-3" />
														Resolve
													</button>
												</div>
											</div>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</Card>
	);
};
