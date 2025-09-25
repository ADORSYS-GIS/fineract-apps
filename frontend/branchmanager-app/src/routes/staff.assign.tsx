import { Button, Card, SearchBar } from "@fineract-apps/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

function StaffAssignPage() {
	const [search, setSearch] = useState("");
	const [searchTellers, setSearchTellers] = useState("");
	const [searchAssignments, setSearchAssignments] = useState("");

	return (
		<div className="px-6 py-6">
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
					<Button>New Assignment</Button>
					<Button>Save Assignments</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 grid-auto-rows-1fr">
				<Card
					className="h-full"
					title={<span className="text-xl">Available Staff</span>}
				>
					<SearchBar
						value={search}
						onValueChange={setSearch}
						placeholder="Filter staff..."
					/>
					<div className="mt-4 text-gray-500">No data.</div>
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
					<div className="mt-4 text-gray-500">No data.</div>
				</Card>
				<div className="lg:col-span-2">
					<Card className="h-full">
						<div className="flex justify-between">
							<h2 className="text-xl font-bold text-gray-800 mb-3">
								Current Assignments
							</h2>
							<SearchBar
								value={searchAssignments}
								onValueChange={setSearchAssignments}
								placeholder="Filter assignments..."
							/>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full text-sm text-left text-gray-500">
								<thead className="text-xs text-gray-700 uppercase bg-gray-50">
									<tr>
										<th className="px-6 py-3">Teller ID</th>
										<th className="px-6 py-3">Location</th>
										<th className="px-6 py-3">Cashier</th>
										<th className="px-6 py-3">Assignment Time</th>
										<th className="px-6 py-3 text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									<tr className="bg-white border-b">
										<td className="px-6 py-4 text-gray-500" colSpan={5}>
											No assignments.
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/staff/assign")({
	component: StaffAssignPage,
});
