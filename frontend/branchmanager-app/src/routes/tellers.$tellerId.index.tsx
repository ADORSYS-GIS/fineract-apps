import { TellerCashManagementService } from "@fineract-apps/fineract-api";
import { Button, Card, SearchBar } from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";

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
	const { page, pageSize, q } = Route.useSearch();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const { data: tellerData } = useQuery({
		queryKey: ["tellers", tellerId],
		queryFn: () =>
			TellerCashManagementService.getV1TellersByTellerId({
				tellerId: Number(tellerId),
			}),
	});

	const {
		data: cashiersResponse,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["tellers", tellerId, "cashiers"],
		queryFn: () =>
			TellerCashManagementService.getV1TellersByTellerIdCashiers({
				tellerId: Number(tellerId),
			}),
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
	const startingIndexOffset = pageItems.length ? 1 : 0;

	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6">
			<PageHeader to="/tellers/" title={tellerData?.name}>
				<Button
					onClick={() =>
						navigate({
							to: "/tellers/$tellerId/assign",
							params: { tellerId: tellerId },
						})
					}
				>
					{t("assignStaff")}
				</Button>
			</PageHeader>
			<Card
				className="h-full w-full"
				title={<span className="text-xl">{t("cashiers")}</span>}
			>
				<SearchBar
					value={q}
					onValueChange={(value: string) =>
						navigate({
							from: Route.fullPath,
							search: {
								page: 1,
								pageSize,
								q: value,
							},
						})
					}
					placeholder={t("searchTellers")}
				/>
				<div className="overflow-x-auto mt-4">
					<table className="w-full text-sm text-left text-gray-500">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50">
							<tr>
								<th className="px-6 py-3">{t("staff")}</th>
								<th className="px-6 py-3">
									{t("createTeller.startDate.label")}
								</th>
								<th className="px-6 py-3">{t("createTeller.endDate.label")}</th>
								<th className="px-6 py-3 hidden sm:table-cell">
									{t("createTeller.description.label")}
								</th>
							</tr>
						</thead>
						<tbody>
							{isLoading && (
								<tr className="bg-white border-b">
									<td className="px-6 py-4 text-gray-500" colSpan={4}>
										{t("loading")}
									</td>
								</tr>
							)}
							{isError && (
								<tr className="bg-white border-b">
									<td className="px-6 py-4 text-red-600" colSpan={4}>
										{error?.message}
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
													search: {
														page: 1,
														pageSize: 10,
													},
												})
											}
										>
											<td className="px-6 py-4 font-medium text-gray-900">
												{cashier.staffName}
											</td>
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
											<td className="px-6 py-4 hidden sm:table-cell">
												{cashier.description}
											</td>
										</tr>
									))
								) : (
									<tr className="bg-white border-b">
										<td className="px-6 py-4 text-gray-500" colSpan={4}>
											{t("unassigned")}
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
								{start + startingIndexOffset}-{start + pageItems.length}{" "}
								{t("of")} {total}
							</span>
						) : null}
					</div>
					<div className="flex items-center gap-2">
						<select
							className="border rounded px-2 py-1 text-sm"
							value={pageSize}
							onChange={(e) =>
								navigate({
									from: Route.fullPath,
									search: {
										page: 1,
										pageSize: Number(e.target.value),
										q,
									},
								})
							}
						>
							{[10, 20, 50, 100].map((s) => (
								<option key={s} value={s}>
									{s} {t("cashierDetail.pagination.perPage")}
								</option>
							))}
						</select>
						<Button
							variant="secondary"
							disabled={page <= 1}
							onClick={() =>
								navigate({
									from: Route.fullPath,
									search: {
										page: Math.max(1, page - 1),
										pageSize,
										q,
									},
								})
							}
						>
							{t("previous")}
						</Button>
						<Button
							variant="secondary"
							disabled={page * pageSize >= total}
							onClick={() =>
								navigate({
									from: Route.fullPath,
									search: {
										page: page + 1,
										pageSize,
										q,
									},
								})
							}
						>
							{t("next")}
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
		};
	},
});
