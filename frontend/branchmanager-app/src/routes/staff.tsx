import { useStaffServiceGetV1Staff } from "@fineract-apps/fineract-api";
import { Card, SearchBar } from "@fineract-apps/ui";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

function StaffListPage() {
	const [search, setSearch] = useState("");
	const { data, isLoading, isError, error } = useStaffServiceGetV1Staff(
		{ status: "all" },
		["staff", "all"],
		{ staleTime: 60_000 },
	);

	return (
		<div className="px-6 py-6">
			<div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Staff</h1>
					<p className="text-gray-500">All staff in your branch</p>
				</div>
			</div>

			<Card title={<span className="text-xl">Staff Directory</span>}>
				<SearchBar
					value={search}
					onValueChange={setSearch}
					placeholder="Search staff by name..."
				/>

				<div className="mt-4 space-y-3">
					{isLoading && <div>Loading...</div>}
					{isError && (
						<div className="text-red-600">
							{(error as Error)?.message ?? "Error"}
						</div>
					)}
					{!isLoading &&
						!isError &&
						Array.isArray(data) &&
						data.length === 0 && (
							<div className="text-gray-500">No staff found.</div>
						)}
					{Array.isArray(data) &&
						data
							.filter((s) =>
								(s.displayName || `${s.firstname} ${s.lastname}`)
									.toLowerCase()
									.includes(search.toLowerCase()),
							)
							.map((s) => (
								<Link
									key={s.id}
									to={`/staff/${s.id}`}
									className="block p-3 rounded-md border border-gray-200 bg-white hover:bg-gray-50"
								>
									<div className="flex items-center justify-between">
										<div>
											<p className="font-medium text-gray-800">
												{s.displayName || `${s.firstname} ${s.lastname}`}
											</p>
											<p className="text-sm text-gray-500">
												{s.officeName || ""}
											</p>
										</div>
										<div className="text-sm text-gray-500">
											{s.mobileNo || "-"}
										</div>
									</div>
								</Link>
							))}
				</div>
			</Card>
		</div>
	);
}

export const Route = createFileRoute("/staff")({
	component: StaffListPage,
});
