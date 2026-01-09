import { useTellerCashManagementServiceGetV1Tellers } from "@fineract-apps/fineract-api";
import { Button, Card, SearchBar } from "@fineract-apps/ui";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

interface Teller {
	id: number;
	name: string;
	officeName: string;
	startDate: number[] | string;
	status: string;
}

function TellersListPage() {
	const { t } = useTranslation();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);
	const [q, setQ] = useState("");
	const {
		data: tellers,
		isLoading,
		isError,
		error,
	} = useTellerCashManagementServiceGetV1Tellers(undefined, ["tellers"], {
		staleTime: 60_000,
	});
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
					<h1 className="text-2xl font-bold">{t("tellers.tellers")}</h1>
				</div>
				<Link to="/tellers/create">
					<Button>{t("tellers.createTeller")}</Button>
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-6">
				<Card
					className="h-full"
					title={
						<span className="text-xl">{t("tellers.availableTellers")}</span>
					}
				>
					<SearchBar
						value={q}
						onValueChange={(value) => {
							setQ(value);
							setPage(1);
						}}
						placeholder={t("tellers.filterTellersPlaceholder")}
					/>
					<div className="mt-4 space-y-3">
						{isLoading && <div>{t("common.loading")}</div>}
						{isError && (
							<div className="text-red-600">
								{t("tellers.errorFetchingTellers", {
									message: (error as Error)?.message,
								})}
							</div>
						)}
						{!isLoading && !isError && pageItems.length === 0 && (
							<div className="text-center text-gray-500">
								{t("tellers.noTellersFound")}
							</div>
						)}
						{!isLoading &&
							!isError &&
							pageItems.length > 0 &&
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
												search: {
													page,
													pageSize,
													q,
												},
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
											{teller.status === "ACTIVE"
												? t("tellers.status.active")
												: t("tellers.status.inactive")}
										</span>
									</button>
								);
							})}
					</div>
					{/* Pagination Controls */}
					<div className="flex items-center justify-between mt-4">
						<div className="text-sm text-gray-600">
							{pageItems.length > 0 && (
								<span>
									{start + 1}-{start + pageItems.length} {t("tellers.of")}{" "}
									{total}
								</span>
							)}
						</div>
						<div className="flex items-center gap-2">
							<select
								className="border rounded px-2 py-1 text-sm"
								value={pageSize}
								onChange={(e) => {
									setPageSize(Number(e.target.value));
									setPage(1);
								}}
							>
								{[10, 20, 50, 100].map((s) => (
									<option key={s} value={s}>
										{t("tellers.perPage", { count: s })}
									</option>
								))}
							</select>
							<Button
								variant="secondary"
								disabled={page <= 1}
								onClick={() => setPage((prev) => Math.max(1, prev - 1))}
							>
								{t("tellers.previous")}
							</Button>
							<Button
								variant="secondary"
								disabled={page * pageSize >= total}
								onClick={() => setPage((prev) => prev + 1)}
							>
								{t("tellers.next")}
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
});
