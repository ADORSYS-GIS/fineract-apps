import { useTellerCashManagementServiceGetV1Tellers } from "@fineract-apps/fineract-api";
import { Button, Card, SearchBar } from "@fineract-apps/ui";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

interface Teller {
	id: number;
	name: string;
	officeName: string;
	startDate: number[] | string;
	status: string;
}

function TellersListPage() {
	const { page, pageSize, q } = Route.useSearch<{
		page: number;
		pageSize: number;
		q: string;
	}>();
	const {
		data: tellers,
		isLoading,
		isError,
		error,
	} = useTellerCashManagementServiceGetV1Tellers(
		undefined,
		["tellers", { page, pageSize, q }],
		{
			staleTime: 60_000,
			keepPreviousData: true,
		},
	);
	const navigate = useNavigate();
	const [selectedTellerId, setSelectedTellerId] = useState<number | null>(null);

	const filteredTellers = useMemo(() => {
		if (!tellers) return [];
		const query = q.toLowerCase();
		return (tellers as Teller[]).filter((teller) => {
			const name = (teller.name ?? "").toLowerCase();
			const office = (teller.officeName ?? "").toLowerCase();
			return name.includes(query) || office.includes(query);
		});
	}, [tellers, q]);

	const total = filteredTellers.length;
	const start = (page - 1) * pageSize;
	const end = start + pageSize;
	const pageItems = filteredTellers.slice(start, end);

	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6">
			<div className="flex justify-between items-center mb-4">
				<div>
					<h1 className="text-2xl font-bold">Tellers</h1>
					<p className="text-gray-500">Manage tellers and their assignments.</p>
				</div>
				<Link to="/tellers/create">
					<Button>+ Create Teller</Button>
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-6">
				<Card
					className="h-full"
					title={<span className="text-xl">Available Tellers</span>}
				>
					<SearchBar
						value={q}
						onValueChange={(value) =>
							navigate({
								to: "/tellers/",
								search: (prev) => ({ ...prev, q: value, page: 1 }),
							})
						}
						placeholder="Filter tellers..."
					/>
					<div className="mt-4 space-y-3">
						{isLoading && <div>Loading...</div>}
						{isError && (
							<div className="text-red-600">{(error as Error)?.message}</div>
						)}
						{!isLoading &&
							!isError &&
							pageItems.map((teller) => {
								const isSelected = selectedTellerId === teller.id;
								return (
									<button
										key={teller.id}
										type="button"
										onClick={() => {
											setSelectedTellerId(teller.id);
											navigate({
												to: "/tellers/$tellerId",
												params: { tellerId: String(teller.id) },
											});
										}}
										className={`w-full flex items-center justify-between p-3 rounded-md border bg-white text-left transition ${isSelected ? "border-gray-400 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
									>
										<div>
											<p className="font-medium text-gray-800">{teller.name}</p>
											<p className="text-sm text-gray-500">
												{teller.officeName}
											</p>
										</div>
										<span className="text-sm text-gray-500">
											{teller.status}
										</span>
									</button>
								);
							})}
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
										to: "/tellers/",
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
										to: "/tellers/",
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
										to: "/tellers/",
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
		</div>
	);
}

export const Route = createFileRoute("/tellers/")({
	component: TellersListPage,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			page: typeof search.page === "number" ? search.page : 1,
			pageSize: typeof search.pageSize === "number" ? search.pageSize : 20,
			q: typeof search.q === "string" ? search.q : "",
		} as { page: number; pageSize: number; q: string };
	},
});
