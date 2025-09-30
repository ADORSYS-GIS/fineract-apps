import { Button, Card, SearchBar } from "@fineract-apps/ui";

type StaffItem = {
	id: number;
	displayName?: string;
	firstname?: string;
	lastname?: string;
	officeName?: string;
	mobileNo?: string;
};

export const StaffView = ({
	search,
	setSearch,
	staffItems,
	isLoadingStaff,
	staffError,
	selectedStaffId,
	setSelectedStaffId,
	onNewAssignment,
}: {
	search: string;
	setSearch: (v: string) => void;
	staffItems: StaffItem[];
	isLoadingStaff: boolean;
	staffError?: string;
	selectedStaffId: number | null;
	setSelectedStaffId: (id: number) => void;
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

			<div className="grid grid-cols-1 gap-6">
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
												{s.officeName ?? ""}
											</p>
										</div>
										<span className="text-sm text-gray-500">
											{s.mobileNo ?? "-"}
										</span>
									</button>
								);
							})}
					</div>
				</Card>
			</div>
		</div>
	);
};
