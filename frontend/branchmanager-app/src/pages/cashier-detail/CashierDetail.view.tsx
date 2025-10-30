import { Button, Card } from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { useCurrency } from "@/hooks/useCurrency";
import { formatCurrency } from "@/utils/currency";
import { CashierDetailViewProps } from "./CashierDetail.types";

export const CashierDetailView = ({
	data,
	isLoading,
	error,
	page = 1,
	pageSize = 20,
	total = 0,
	actionButtons,
}: CashierDetailViewProps & { actionButtons?: React.ReactNode }) => {
	const navigate = useNavigate();
	const { currencyCode } = useCurrency();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	const transactions = data?.cashierTransactions?.pageItems || [];

	const formatAmount = (n?: number) => formatCurrency(n, currencyCode);

	return (
		<div className="w-full">
			{/* PageHeader in exact same max-width container as cards  */}
			{/* buttons spacing */}
			{/* stats Card */}
			<Card className="w-full">
				<div className="p-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
						<div className="p-4 bg-gray-50 rounded-lg">
							<p className="font-semibold text-gray-600">Net Cash</p>
							<p className="text-gray-800 text-lg font-bold">
								{formatAmount(data?.netCash)}
							</p>
						</div>
						<div className="p-4 bg-gray-50 rounded-lg">
							<p className="font-semibold text-gray-600">Cash Allocations</p>
							<p className="text-gray-800 text-lg font-bold">
								{formatAmount(data?.sumCashAllocation)}
							</p>
						</div>
						<div className="p-4 bg-gray-50 rounded-lg">
							<p className="font-semibold text-gray-600">Cash Settlements</p>
							<p className="text-gray-800 text-lg font-bold">
								{formatAmount(data?.sumCashSettlement)}
							</p>
						</div>
						<div className="p-4 bg-gray-50 rounded-lg">
							<p className="font-semibold text-gray-600">Inward Cash</p>
							<p className="text-gray-800 text-lg font-bold">
								{formatAmount(data?.sumInwardCash)}
							</p>
						</div>
						<div className="p-4 bg-gray-50 rounded-lg">
							<p className="font-semibold text-gray-600">Outward Cash</p>
							<p className="text-gray-800 text-lg font-bold">
								{formatAmount(data?.sumOutwardCash)}
							</p>
						</div>
					</div>
				</div>
			</Card>

			{/* action buttons row, aligns with below card by px-6, use mt-4 for clear separation */}
			<div className="flex justify-end items-center px-6 mt-4">
				{actionButtons}
			</div>

			<Card
				className="w-full mt-6"
				title={<span className="text-xl font-bold">Transactions</span>}
			>
				<div>
					{/* Mobile and Tablet View: Card List */}
					<div className="md:hidden">
						{transactions.length === 0 ? (
							<div className="px-6 py-4 text-gray-500">
								No transactions found.
							</div>
						) : (
							transactions.map((tx) => (
								<div
									key={tx.id}
									className="border-b px-4 py-4 grid grid-cols-2 gap-x-4 gap-y-2"
								>
									<div className="font-semibold text-gray-600">Date</div>
									<div>{tx.txnDate || tx.createdDate}</div>

									<div className="font-semibold text-gray-600">Type</div>
									<div>{tx.txnType?.value}</div>

									<div className="font-semibold text-gray-600">Amount</div>
									<div>{formatAmount(tx.txnAmount)}</div>

									<div className="font-semibold text-gray-600">Entity</div>
									<div>{tx.entityType}</div>

									<div className="font-semibold text-gray-600">Note</div>
									<div>{tx.txnNote}</div>
								</div>
							))
						)}
					</div>

					{/* Desktop View: Table */}
					<div className="hidden md:block overflow-x-auto">
						<table className="w-full text-sm text-left text-gray-500">
							<thead className="text-xs text-gray-700 uppercase bg-gray-50">
								<tr>
									<th className="px-6 py-3">Date</th>
									<th className="px-6 py-3">Type</th>
									<th className="px-6 py-3">Amount</th>
									<th className="px-6 py-3">Entity</th>
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
											<td className="px-6 py-4">
												{formatAmount(tx.txnAmount)}
											</td>
											<td className="px-6 py-4">{tx.entityType}</td>
											<td className="px-6 py-4">{tx.txnNote}</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
				{/* Pagination Controls */}
				<div className="flex items-center justify-between mt-3">
					<div className="text-sm text-gray-600">
						{total ? (
							<span>
								{" "}
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
										tellerId: String(data?.tellerId),
										cashierId: String(data?.cashierId),
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
										tellerId: String(data?.tellerId),
										cashierId: String(data?.cashierId),
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
										tellerId: String(data?.tellerId),
										cashierId: String(data?.cashierId),
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
		</div>
	);
};
