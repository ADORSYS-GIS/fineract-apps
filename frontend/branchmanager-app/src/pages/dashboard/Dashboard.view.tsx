import { Button, Card, SearchBar } from "@fineract-apps/ui";
import { useTranslation } from "react-i18next";
import { DashboardViewProps } from "./Dashboard.types";

export const DashboardView = ({
	title,
	searchAssignments,
	setSearchAssignments,
	assignments,
	loadingAssignments,
	assignmentsError,
	page,
	limit,
	total,
	setPage,
}: DashboardViewProps) => {
	const { t } = useTranslation();
	return (
		<div className="p-4 sm:p-6">
			<h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
			<div className="mt-6">
				<Card className="h-full w-full">
					<div>
						<h2 className="text-xl font-bold text-gray-800 mb-3">
							{t("branchManagerDashboard.currentAssignments")}
						</h2>
						<SearchBar
							value={searchAssignments}
							onValueChange={setSearchAssignments}
							placeholder={t(
								"branchManagerDashboard.filterAssignmentsPlaceholder",
							)}
						/>
					</div>
					<div className="overflow-x-auto mt-4">
						<table className="w-full text-sm text-left text-gray-500">
							<thead className="text-xs text-white uppercase bg-primary">
								<tr>
									<th className="px-6 py-3">
										{t("branchManagerDashboard.tellers")}
									</th>
									<th className="px-6 py-3">
										{t("branchManagerDashboard.staff")}
									</th>
									<th className="px-6 py-3">
										{t("branchManagerDashboard.start")}
									</th>
									<th className="px-6 py-3">
										{t("branchManagerDashboard.end")}
									</th>
									<th className="px-6 py-3">
										{t("branchManagerDashboard.fullDay")}
									</th>
									<th className="px-6 py-3 hidden sm:table-cell">
										{t("branchManagerDashboard.description")}
									</th>
								</tr>
							</thead>
							<tbody>
								{loadingAssignments && (
									<tr className="bg-white border-b">
										<td className="px-6 py-4 text-gray-500" colSpan={6}>
											{t("cashierDetail.loading")}
										</td>
									</tr>
								)}
								{assignmentsError && (
									<tr className="bg-white border-b">
										<td className="px-6 py-4 text-red-600" colSpan={6}>
											{assignmentsError}
										</td>
									</tr>
								)}
								{!loadingAssignments &&
									!assignmentsError &&
									(assignments.length > 0 ? (
										assignments.map((a) => (
											<tr key={a.id} className="bg-white border-b">
												<td className="px-6 py-4">{a.tellerName ?? "-"}</td>
												<td className="px-6 py-4 font-medium text-gray-900">
													{a.staffName ?? a.staffId}
												</td>
												<td className="px-6 py-4">{a.startDate ?? "-"}</td>
												<td className="px-6 py-4">{a.endDate ?? "-"}</td>
												<td className="px-6 py-4">
													{a.isFullDay
														? t("branchManagerCommon.yes")
														: t("branchManagerCommon.no")}
												</td>
												<td className="px-6 py-4 hidden sm:table-cell">
													{a.description ?? "-"}
												</td>
											</tr>
										))
									) : (
										<tr className="bg-white border-b">
											<td className="px-6 py-4 text-gray-500" colSpan={6}>
												{t("branchManagerDashboard.noAssignments")}
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
					<div className="flex justify-center mt-4">
						<Button onClick={() => setPage(page - 1)} disabled={page === 1}>
							{t("cashierDetail.previous")}
						</Button>
						<span className="mx-4">
							{t("approveSavingsAccountList.pageOf", {
								page,
								total: Math.ceil(total / limit),
							})}
						</span>
						<Button
							onClick={() => setPage(page + 1)}
							disabled={page * limit >= total}
						>
							{t("cashierDetail.next")}
						</Button>
					</div>
				</Card>
			</div>
		</div>
	);
};
