import { useTellerCashManagementServiceGetV1TellersByTellerIdCashiers } from "@fineract-apps/fineract-api";
import { Button, Card, SearchBar } from "@fineract-apps/ui";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";

interface Cashier {
	id: number;
	staffId: number;
	staffName: string;
	description: string;
	startDate: number[] | string;
	endDate: number[] | string;
	isFullDay: boolean;
}

function TellerDetailPage() {
	const { tellerId } = Route.useParams();
	const { page, pageSize, q } = Route.useSearch<{
		page: number;
		pageSize: number;
		q: string;
	}>();
	const navigate = useNavigate();

	const {
		data: cashiersResponse,
		isLoading,
		isError,
		error,
	} = useTellerCashManagementServiceGetV1TellersByTellerIdCashiers({
		tellerId: Number(tellerId),
	});

	interface CashiersResponse {
		cashiers?: Cashier[];
	}

	const cashiers = useMemo(() => {
		if (!cashiersResponse || !(cashiersResponse as CashiersResponse)?.cashiers)
			return [];
		const filtered =
			(cashiersResponse as CashiersResponse)?.cashiers?.filter(
				(cashier: Cashier) => {
					const staff = (cashier.staffName ?? "").toLowerCase();
					const desc = (cashier.description ?? "").toLowerCase();
					const query = (q ?? "").toLowerCase();
					return staff.includes(query) || desc.includes(query);
				},
			) ?? [];
		return filtered;
	}, [cashiersResponse, q]);

	const total = cashiers.length;
	const start = (page - 1) * pageSize;
	const end = start + pageSize;
	const pageItems = cashiers.slice(start, end);

	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6">
			<div className="flex justify-between items-center mb-4">
				<div>
					<h1 className="text-2xl font-bold">Teller Details</h1>
					<p className="text-gray-500">Details for teller ID: {tellerId}</p>
				</div>
				<Button
					onClick={() =>
						navigate({
							to: "/tellers/$tellerId/assign",
							params: { tellerId: tellerId },
						})
					}
				>
					New Assignment
				</Button>
			</div>
			<Card
				className="h-full w-full"
				title={<span className="text-xl">Assigned Cashiers</span>}
			>
				<SearchBar
					value={q}
					onValueChange={(value) =>
						navigate({
							to: "/tellers/$tellerId/",
							params: { tellerId },
							search: (prev) => ({ ...prev, q: value, page: 1 }),
						})
					}
					placeholder="Filter cashiers..."
				/>
				<div className="overflow-x-auto mt-4">
					<table className="w-full text-sm text-left text-gray-500">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50">
							<tr>
								<th className="px-6 py-3">Staff Name</th>
								<th className="px-6 py-3">Description</th>
								<th className="px-6 py-3">Start Date</th>
								<th className="px-6 py-3">End Date</th>
							</tr>
						</thead>
						<tbody>
							{isLoading && (
								<tr className="bg-white border-b">
									<td className="px-6 py-4 text-gray-500" colSpan={4}>
										Loading...
									</td>
								</tr>
							)}
							{isError && (
								<tr className="bg-white border-b">
									<td className="px-6 py-4 text-red-600" colSpan={4}>
										{(error as Error)?.message}
									</td>
								</tr>
							)}
							{!isLoading &&
								!isError &&
								cashiers &&
								(pageItems.length > 0 ? (
									pageItems.map((cashier: Cashier) => (
										<tr
											key={cashier.id}
											className="bg-white border-b hover:bg-gray-50 cursor-pointer"
											onClick={() =>
												navigate({
													to: "/tellers/$tellerId/cashiers/$cashierId",
													params: {
														tellerId,
														cashierId: String(cashier.id),
													},
												})
											}
										>
											<td className="px-6 py-4 font-medium text-gray-900">
												{cashier.staffName}
											</td>
											<td className="px-6 py-4">{cashier.description}</td>
											<td className="px-6 py-4">
												{Array.isArray(cashier.startDate)
													? cashier.startDate.join("-")
													: cashier.startDate}
											</td>
											<td className="px-6 py-4">
												{Array.isArray(cashier.endDate)
													? cashier.endDate.join("-")
													: cashier.endDate}
											</td>
										</tr>
									))
								) : (
									<tr className="bg-white border-b">
										<td className="px-6 py-4 text-gray-500" colSpan={4}>
											No cashiers assigned.
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
				{/* Pagination Controls */}
				<div className="flex items-center justify-between mt-4">
					<div className="text-sm text-gray-600">
						{total ? (
							<span>
								Showing {total ? start + (pageItems.length ? 1 : 0) : 0}-
								{start + pageItems.length} of {total}
							</span>
						) : null}
					</div>
					<div className="flex items-center gap-2">
						<select
							className="border rounded px-2 py-1 text-sm"
							value={pageSize}
							onChange={(e) =>
								navigate({
									to: "/tellers/$tellerId/",
									params: { tellerId },
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
									to: "/tellers/$tellerId/",
									params: { tellerId },
									search: (prev) => ({
										...prev,
										page: Math.max(1, page - 1),
									}),
								})
							}
						>
							Previous
						</Button>
						<Button
							variant="secondary"
							disabled={page * pageSize >= total}
							onClick={() =>
								navigate({
									to: "/tellers/$tellerId/",
									params: { tellerId },
									search: (prev) => ({ ...prev, page: page + 1 }),
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
}

export const Route = createFileRoute("/tellers/$tellerId/")({
	component: TellerDetailPage,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			page: typeof search.page === "number" ? search.page : 1,
			pageSize: typeof search.pageSize === "number" ? search.pageSize : 20,
			q: typeof search.q === "string" ? search.q : "",
		} as { page: number; pageSize: number; q: string };
	},
});
