import { Card, SearchBar } from "@fineract-apps/ui";

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
	onStaffClick,
}: {
	search: string;
	setSearch: (v: string) => void;
	staffItems: StaffItem[];
	isLoadingStaff: boolean;
	staffError?: string;
	onStaffClick: (id: number) => void;
}) => {
	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
						Manage Staff
					</h1>
					<p className="text-gray-500 mt-1">View and manage staff members.</p>
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
						className="max-w-sm"
					/>
					<div className="mt-4 space-y-3">
						{isLoadingStaff && <div>Loading...</div>}
						{staffError && <div className="text-red-600">{staffError}</div>}
						{!isLoadingStaff && !staffError && staffItems.length > 0 ? (
							staffItems.map((s) => {
								const name =
									s.displayName ||
									`${s.firstname ?? ""} ${s.lastname ?? ""}`.trim();
								return (
									<button
										key={s.id}
										type="button"
										onClick={() => onStaffClick(s.id)}
										className="w-full flex items-center justify-between p-3 rounded-md border bg-white text-left transition border-gray-200 hover:border-gray-300"
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
							})
						) : (
							<div className="text-center py-10">
								<p>No staff members found.</p>
							</div>
						)}
					</div>
				</Card>
			</div>
		</div>
	);
};
