import { Button, Card, SearchBar } from "@fineract-apps/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

function StaffAssignPage() {
	const [search, setSearch] = useState("");

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
					<Button variant="secondary">New Assignment</Button>
					<Button>Save Assignments</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card title={<span className="text-xl">Available Staff</span>}>
					<SearchBar
						value={search}
						onValueChange={setSearch}
						placeholder="Filter staff..."
					/>
					<div className="mt-4 space-y-3">
						{[
							{ name: "Sarah Miller", role: "Cashier" },
							{ name: "David Lee", role: "Cashier" },
							{ name: "Emily Chen", role: "Cashier" },
						]
							.filter(
								(s) =>
									s.name.toLowerCase().indexOf(search.toLowerCase()) !== -1,
							)
							.map((s) => (
								<div
									key={s.name}
									className="flex items-center justify-between p-3 rounded-md border border-gray-200 bg-gray-50"
								>
									<div>
										<p className="font-medium text-gray-800">{s.name}</p>
										<p className="text-sm text-gray-500">{s.role}</p>
									</div>
									<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
										Available
									</span>
								</div>
							))}
					</div>
				</Card>

				<Card title={<span className="text-xl">Tellers</span>}>
					<div className="space-y-4">
						<div className="p-4 rounded-md border border-gray-200">
							<div className="flex items-center justify-between mb-3">
								<h3 className="font-semibold text-gray-700">
									Teller 1 - Main Counter
								</h3>
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
									Assigned
								</span>
							</div>
							<div className="flex items-center justify-between p-3 rounded-md border border-dashed border-gray-300 bg-white">
								<div>
									<p className="font-medium text-gray-800">John Doe</p>
									<p className="text-sm text-gray-500">Cashier</p>
								</div>
								<Button variant="destructive">Remove</Button>
							</div>
						</div>

						<div className="p-4 rounded-md border border-dashed border-gray-300 min-h-[100px] flex items-center justify-center text-gray-400">
							<div className="text-center">
								<p className="text-sm">Drop Cashier Here</p>
								<p className="text-xs">Teller 2 - Drive-Thru</p>
							</div>
						</div>
					</div>
				</Card>
			</div>

			<Card className="mt-8">
				<h2 className="text-xl font-bold text-gray-800 mb-3">
					Current Assignments
				</h2>
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
								<td className="px-6 py-4 font-medium text-gray-900">
									Teller 1
								</td>
								<td className="px-6 py-4">Main Counter</td>
								<td className="px-6 py-4">John Doe</td>
								<td className="px-6 py-4">09:15 AM</td>
								<td className="px-6 py-4 text-right">
									<a
										className="font-medium text-blue-600 hover:underline"
										href="#"
									>
										Reassign
									</a>
								</td>
							</tr>
							<tr className="bg-white">
								<td className="px-6 py-4 font-medium text-gray-900">
									Teller 5
								</td>
								<td className="px-6 py-4">Walk-in</td>
								<td className="px-6 py-4 text-gray-400 italic">Unassigned</td>
								<td className="px-6 py-4">-</td>
								<td className="px-6 py-4 text-right">
									<a
										className="font-medium text-blue-600 hover:underline"
										href="#"
									>
										Assign
									</a>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	);
}

export const Route = createFileRoute("/staff/assign")({
	component: StaffAssignPage,
});
