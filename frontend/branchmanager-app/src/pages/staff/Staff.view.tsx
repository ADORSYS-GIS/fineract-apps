import { Button, Card, SearchBar } from "@fineract-apps/ui";

type StaffItem = {
	id: number;
	displayName?: string;
	firstname?: string;
	lastname?: string;
	officeName?: string;
	mobileNo?: string;
};

type TellerItem = { id: number; name?: string };

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

export const StaffView = ({
	search,
	setSearch,
	searchTellers,
	setSearchTellers,
	searchAssignments,
	setSearchAssignments,
	staffItems,
	isLoadingStaff,
	staffError,
	selectedStaffId,
	setSelectedStaffId,
	tellerItems,
	loadingTellers,
	tellersError,
	selectedTellerId,
	setSelectedTellerId,
	assignments,
	loadingAssignments,
	assignmentsError,
	onNewAssignment,
}: {
	search: string;
	setSearch: (v: string) => void;
	searchTellers: string;
	setSearchTellers: (v: string) => void;
	searchAssignments: string;
	setSearchAssignments: (v: string) => void;
	staffItems: StaffItem[];
	isLoadingStaff: boolean;
	staffError?: string;
	selectedStaffId: number | null;
	setSelectedStaffId: (id: number) => void;
	tellerItems: TellerItem[];
	loadingTellers: boolean;
	tellersError?: string;
	selectedTellerId: number | null;
	setSelectedTellerId: (id: number) => void;
	assignments: TellerAssignment[];
	loadingAssignments: boolean;
	assignmentsError?: string;
	onNewAssignment: () => void;
}) => {
	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6">
			<div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Manage Staff Assignments
					</h1>
					<p className="text-gray-500">
						Assign cashiers to tellers using the interface.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button onClick={onNewAssignment} disabled={!selectedStaffId}>
						New Assignment
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card
					className="h-full"
					title={<span className="text-xl">Available Staff</span>}
				>
					<SearchBar
						value={search}
						onValueChange={setSearch}
						placeholder="Filter staff..."
					/>
					<div className="mt-4 space-y-3">
						{isLoadingStaff && <div>Loading...</div>}
						{staffError && <div className="text-red-600">{staffError}</div>}
						{!isLoadingStaff &&
							!staffError &&
							staffItems.map((s) => {
								const isSelected = selectedStaffId === s.id;
								const name =
									s.displayName ||
									`${s.firstname ?? ""} ${s.lastname ?? ""}`.trim();
								return (
									<button
										key={s.id}
										type="button"
										onClick={() => setSelectedStaffId(s.id)}
										className={`w-full flex items-center justify-between p-3 rounded-md border bg-white text-left transition ${isSelected ? "border-gray-400 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
									>
										<div>
											<p className="font-medium text-gray-800">{name}</p>
											<p className="text-sm text-gray-500">
												{s.officeName || ""}
											</p>
										</div>
										<span className="text-sm text-gray-500">
											{s.mobileNo || "-"}
										</span>
									</button>
								);
							})}
					</div>
				</Card>

				<Card
					className="h-full"
					title={<span className="text-xl">Tellers</span>}
				>
					<SearchBar
						value={searchTellers}
						onValueChange={setSearchTellers}
						placeholder="Filter tellers..."
					/>
					<div className="mt-4 space-y-3">
						{loadingTellers && <div>Loading...</div>}
						{tellersError && <div className="text-red-600">{tellersError}</div>}
						{!loadingTellers &&
							!tellersError &&
							tellerItems.map((t) => (
								<button
									key={t.id}
									type="button"
									onClick={() => setSelectedTellerId(t.id)}
									className={`w-full text-left p-3 rounded-md border bg-white shadow-sm transition ${selectedTellerId === t.id ? "border-gray-400" : "border-gray-200 hover:border-gray-300"}`}
								>
									<p className="font-medium text-gray-800">
										{t.name ?? `Teller ${t.id}`}
									</p>
									<p className="text-sm text-gray-500">ID: {t.id}</p>
								</button>
							))}
					</div>
				</Card>

				<div className="col-span-1 lg:col-span-2">
					<Card className="h-full w-full">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
													<td className="px-6 py-4">
														{a.tellerName ??
															(selectedTellerId
																? `Teller ${selectedTellerId}`
																: "-")}
													</td>
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
		</div>
	);
};
