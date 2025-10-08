import { Button, Card } from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { CashierDetailViewProps } from "./CashierDetail.types";

export const CashierDetailView = ({
	data,
	isLoading,
	error,
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
		<div className="flex justify-center p-4 sm:p-6">
			<div className="w-full max-w-4xl">
				<Card className="w-full">
					<div className="p-6">
						<h1 className="text-2xl font-bold mb-2">{data.cashierName}</h1>
						<p className="text-gray-500 mb-4">
							{data.officeName} • {data.tellerName}
						</p>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
							<div>
								<p className="font-semibold text-gray-600">Net Cash</p>
								<p className="text-gray-800">{formatAmount(data.netCash)}</p>
							</div>
							<div>
								<p className="font-semibold text-gray-600">Cash Allocations</p>
								<p className="text-gray-800">
									{formatAmount(data.sumCashAllocation)}
								</p>
							</div>
							<div>
								<p className="font-semibold text-gray-600">Cash Settlements</p>
								<p className="text-gray-800">
									{formatAmount(data.sumCashSettlement)}
								</p>
							</div>
							<div>
								<p className="font-semibold text-gray-600">Inward Cash</p>
								<p className="text-gray-800">
									{formatAmount(data.sumInwardCash)}
								</p>
							</div>
							<div>
								<p className="font-semibold text-gray-600">Outward Cash</p>
								<p className="text-gray-800">
									{formatAmount(data.sumOutwardCash)}
								</p>
							</div>
						</div>
					</div>
				</Card>

				<Card
					className="w-full mt-4"
					title={<span className="text-lg">Transactions</span>}
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
