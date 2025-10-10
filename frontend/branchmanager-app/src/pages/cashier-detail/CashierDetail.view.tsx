import { Button, Card } from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { CashierDetailViewProps } from "./CashierDetail.types";

export const CashierDetailView = ({
	data,
	isLoading,
	error,
	page = 1,
	pageSize = 20,
	total = 0,
}: CashierDetailViewProps) => {
	const navigate = useNavigate();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	const transactions = data?.cashierTransactions?.pageItems || [];

	const formatAmount = (n?: number) =>
		typeof n === "number"
			? n.toLocaleString(undefined, { maximumFractionDigits: 2 })
			: "-";

	return (
		<div className="flex justify-center p-4 sm:p-6 lg:p-8">
			<div className="w-full max-w-5xl">
				<Card className="w-full">
					<div className="p-6">
						<h1 className="text-2xl sm:text-3xl font-bold mb-2">
							{data.cashierName}
						</h1>
						<p className="text-gray-500 mb-6">
							{data.officeName} • {data.tellerName}
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
							<div className="p-4 bg-gray-50 rounded-lg">
								<p className="font-semibold text-gray-600">Net Cash</p>
								<p className="text-gray-800 text-lg font-bold">
									{formatAmount(data.netCash)}
								</p>
							</div>
							<div className="p-4 bg-gray-50 rounded-lg">
								<p className="font-semibold text-gray-600">Cash Allocations</p>
								<p className="text-gray-800 text-lg font-bold">
									{formatAmount(data.sumCashAllocation)}
								</p>
							</div>
							<div className="p-4 bg-gray-50 rounded-lg">
								<p className="font-semibold text-gray-600">Cash Settlements</p>
								<p className="text-gray-800 text-lg font-bold">
									{formatAmount(data.sumCashSettlement)}
								</p>
							</div>
							<div className="p-4 bg-gray-50 rounded-lg">
								<p className="font-semibold text-gray-600">Inward Cash</p>
								<p className="text-gray-800 text-lg font-bold">
									{formatAmount(data.sumInwardCash)}
								</p>
							</div>
							<div className="p-4 bg-gray-50 rounded-lg">
								<p className="font-semibold text-gray-600">Outward Cash</p>
								<p className="text-gray-800 text-lg font-bold">
									{formatAmount(data.sumOutwardCash)}
								</p>
							</div>
						</div>
					</div>
				</Card>

				<Card
					className="w-full mt-6"
					title={<span className="text-xl font-bold">Transactions</span>}
				>
					<div className="overflow-x-auto">
						<table className="w-full text-sm text-left text-gray-500">
							<thead className="text-xs text-gray-700 uppercase bg-gray-50">
								<tr>
									<th className="px-6 py-3">Date</th>
									<th className="px-6 py-3">Type</th>
									<th className="px-6 py-3">Entity</th>
									<th className="px-6 py-3">Amount</th>
									<th className="px-6 py-3">Note</th>
								</tr>
							</thead>
							<tbody>
								{transactions.length === 0 ? (
									<tr className="bg-white border-b">
										<td className="px-6 py-4 text-gray-500" colSpan={5}>
											No transactions found.
										</td>
									</tr>
								) : (
									transactions.map((tx) => (
										<tr key={tx.id} className="bg-white border-b">
											<td className="px-6 py-4">
												{tx.txnDate || tx.createdDate}
											</td>
											<td className="px-6 py-4">{tx.txnType?.value}</td>
											<td className="px-6 py-4">{tx.entityType}</td>
											<td className="px-6 py-4">
												{formatAmount(tx.txnAmount)}
											</td>
											<td className="px-6 py-4">{tx.txnNote}</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
					{/* Pagination Controls */}
					<div className="flex items-center justify-between mt-3">
						<div className="text-sm text-gray-600">
							{total ? (
								<span>
									Showing{" "}
									{(page - 1) * pageSize +
										Math.min(transactions.length ? 1 : 0, 1)}
									-{(page - 1) * pageSize + transactions.length} of {total}
								</span>
							) : null}
						</div>
						<div className="flex items-center gap-2">
							<select
								className="border rounded px-2 py-1 text-sm"
								value={pageSize}
								onChange={(e) =>
									navigate({
										to: "/tellers/$tellerId/cashiers/$cashierId",
										params: {
											tellerId: String(data.tellerId),
											cashierId: String(data.cashierId),
										},
										search: (prev) => ({
											...prev,
											pageSize: Number(e.target.value),
											page: 1,
										}),
									})
								}
							>
								{[10, 20, 50, 100].map((s) => (
									<option key={s} value={s}>
										{s} / page
									</option>
								))}
							</select>
							<Button
								variant="secondary"
								disabled={page <= 1}
								onClick={() =>
									navigate({
										to: "/tellers/$tellerId/cashiers/$cashierId",
										params: {
											tellerId: String(data.tellerId),
											cashierId: String(data.cashierId),
										},
										search: (prev) => ({
											...prev,
											page: Math.max(1, (prev?.page ?? 1) - 1),
											pageSize: prev?.pageSize ?? 20,
										}),
									})
								}
							>
								Previous
							</Button>
							<Button
								variant="secondary"
								disabled={
									total
										? page * pageSize >= total
										: transactions.length < pageSize
								}
								onClick={() =>
									navigate({
										to: "/tellers/$tellerId/cashiers/$cashierId",
										params: {
											tellerId: String(data.tellerId),
											cashierId: String(data.cashierId),
										},
										search: (prev) => ({
											...prev,
											page: (prev?.page ?? 1) + 1,
											pageSize: prev?.pageSize ?? 20,
										}),
									})
								}
							>
								Next
							</Button>
						</div>
					</div>
				</Card>

				<div className="flex justify-end gap-4 mt-4">
					<Button
						onClick={() =>
							navigate({
								to: "/tellers/$tellerId/cashiers/$cashierId/settle",
								params: {
									tellerId: String(data.tellerId),
									cashierId: String(data.cashierId),
								},
								search: {
									page,
									pageSize,
								},
							})
						}
					>
						Settle
					</Button>
					<Button
						onClick={() =>
							navigate({
								to: "/tellers/$tellerId/cashiers/$cashierId/allocate",
								params: {
									tellerId: String(data.tellerId),
									cashierId: String(data.cashierId),
								},
								search: {
									page,
									pageSize,
								},
							})
						}
					>
						Allocate
					</Button>
				</div>
			</div>
		</div>
	);
};
