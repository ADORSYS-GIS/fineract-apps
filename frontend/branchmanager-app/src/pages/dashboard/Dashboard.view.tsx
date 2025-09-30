import { Card, SearchBar } from "@fineract-apps/ui";

type TellerAssignment = {
	id: number;
	tellerName?: string;
	staffName?: string;
	staffId?: number;
	startDate?: string;
	endDate?: string;
	isFullDay?: boolean;
	description?: string;
};

type Props = {
	title: string;
	query: string;
	setQuery: (v: string) => void;
	searchAssignments: string;
	setSearchAssignments: (v: string) => void;
	assignments: TellerAssignment[];
	loadingAssignments: boolean;
	assignmentsError?: string;
};

export const DashboardView = ({
	title,
	query,
	setQuery,
	searchAssignments,
	setSearchAssignments,
	assignments,
	loadingAssignments,
	assignmentsError,
}: Props) => {
	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6">
			<div className="flex flex-wrap items-center justify-between gap-3 mb-6">
				<h1 className="text-2xl md:text-3xl font-bold text-gray-900">
					{title}
				</h1>
			</div>
			<div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<h2 className="text-[22px] font-bold text-gray-900">
					Pending Approvals
				</h2>
				<SearchBar
					value={query}
					onValueChange={setQuery}
					placeholder="Filter by name, type, amount..."
					className="max-w-md"
				/>
			</div>
			<div className="mt-3 rounded-xl border border-gray-200 bg-white p-6">
				<p className="text-gray-500 text-sm">No pending approvals.</p>
			</div>
			<div className="mt-6">
				<Card className="h-full w-full">
					<div>
						<h2 className="text-xl font-bold text-gray-800 mb-3">
							Current Assignments
						</h2>
						<SearchBar
							value={searchAssignments}
							onValueChange={setSearchAssignments}
							placeholder="Filter by staff or description..."
						/>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-sm text-left text-gray-500">
							<thead className="text-xs text-gray-700 uppercase bg-gray-50">
								<tr>
									<th className="px-6 py-3">Teller</th>
									<th className="px-6 py-3">Staff</th>
									<th className="px-6 py-3">Start</th>
									<th className="px-6 py-3">End</th>
									<th className="px-6 py-3">Full Day</th>
									<th className="px-6 py-3">Description</th>
								</tr>
							</thead>
							<tbody>
								{loadingAssignments && (
									<tr className="bg-white border-b">
										<td className="px-6 py-4 text-gray-500" colSpan={6}>
											Loading...
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
													{a.isFullDay ? "Yes" : "No"}
												</td>
												<td className="px-6 py-4">{a.description ?? "-"}</td>
											</tr>
										))
									) : (
										<tr className="bg-white border-b">
											<td className="px-6 py-4 text-gray-500" colSpan={6}>
												No assignments.
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</Card>
			</div>
		</div>
	);
};
