import { Card } from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { type AuditLogResponse, assetApi } from "@/services/assetApi";

interface Props {
	initialAdmin?: string;
	initialAssetId?: string;
	initialAction?: string;
}

export const AuditLogTable: FC<Props> = ({
	initialAdmin,
	initialAssetId,
	initialAction,
}) => {
	const [page, setPage] = useState(0);
	const [adminFilter, setAdminFilter] = useState(initialAdmin ?? "");
	const [assetIdFilter, setAssetIdFilter] = useState(initialAssetId ?? "");
	const [actionFilter, setActionFilter] = useState(initialAction ?? "");
	const pageSize = 20;

	const { data, isLoading } = useQuery({
		queryKey: ["audit-log", page, adminFilter, assetIdFilter, actionFilter],
		queryFn: () =>
			assetApi.getAuditLog({
				page,
				size: pageSize,
				admin: adminFilter || undefined,
				assetId: assetIdFilter || undefined,
				action: actionFilter || undefined,
			}),
		select: (res) => res.data,
	});

	const entries = data?.content ?? [];
	const totalPages = data?.totalPages ?? 0;

	return (
		<Card className="p-4">
			<h2 className="text-lg font-semibold text-gray-800 mb-3">Audit Log</h2>

			{/* Filters */}
			<div className="flex flex-wrap gap-3 mb-4">
				<input
					type="text"
					placeholder="Filter by admin..."
					value={adminFilter}
					onChange={(e) => {
						setAdminFilter(e.target.value);
						setPage(0);
					}}
					className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
				/>
				<input
					type="text"
					placeholder="Filter by asset ID..."
					value={assetIdFilter}
					onChange={(e) => {
						setAssetIdFilter(e.target.value);
						setPage(0);
					}}
					className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
				/>
				<input
					type="text"
					placeholder="Filter by action..."
					value={actionFilter}
					onChange={(e) => {
						setActionFilter(e.target.value);
						setPage(0);
					}}
					className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
				/>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-8">
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
				</div>
			) : entries.length === 0 ? (
				<p className="text-sm text-gray-500 py-4 text-center">
					No audit log entries found.
				</p>
			) : (
				<>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200 text-sm">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-3 py-2 text-left font-medium text-gray-500">
										Time
									</th>
									<th className="px-3 py-2 text-left font-medium text-gray-500">
										Admin
									</th>
									<th className="px-3 py-2 text-left font-medium text-gray-500">
										Action
									</th>
									<th className="px-3 py-2 text-left font-medium text-gray-500">
										Asset
									</th>
									<th className="px-3 py-2 text-left font-medium text-gray-500">
										Result
									</th>
									<th className="px-3 py-2 text-right font-medium text-gray-500">
										Duration
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{entries.map((entry: AuditLogResponse) => (
									<tr key={entry.id} className="hover:bg-gray-50">
										<td className="px-3 py-2 whitespace-nowrap text-gray-600">
											{new Date(entry.performedAt).toLocaleString()}
										</td>
										<td className="px-3 py-2 font-mono text-xs">
											{entry.adminSubject}
										</td>
										<td className="px-3 py-2 font-medium">{entry.action}</td>
										<td className="px-3 py-2">
											{entry.targetAssetSymbol ? (
												<span className="font-mono text-xs">
													{entry.targetAssetSymbol}
												</span>
											) : (
												<span className="text-gray-400">—</span>
											)}
										</td>
										<td className="px-3 py-2">
											<span
												className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
													entry.result === "SUCCESS"
														? "bg-green-100 text-green-800"
														: "bg-red-100 text-red-800"
												}`}
											>
												{entry.result}
											</span>
											{entry.errorMessage && (
												<p className="text-xs text-red-600 mt-1 max-w-xs truncate">
													{entry.errorMessage}
												</p>
											)}
										</td>
										<td className="px-3 py-2 text-right text-gray-500">
											{entry.durationMs}ms
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{totalPages > 1 && (
						<div className="flex justify-between items-center mt-4">
							<button
								type="button"
								className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50"
								disabled={page === 0}
								onClick={() => setPage((p) => Math.max(0, p - 1))}
							>
								Previous
							</button>
							<span className="text-sm text-gray-500">
								Page {page + 1} of {totalPages}
							</span>
							<button
								type="button"
								className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50"
								disabled={page >= totalPages - 1}
								onClick={() => setPage((p) => p + 1)}
							>
								Next
							</button>
						</div>
					)}
				</>
			)}
		</Card>
	);
};
