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
						{[
							{
								name: "Teller 1 - Main Counter",
								assigned: true,
								cashier: { name: "John Doe", role: "Cashier" },
							},
							{ name: "Teller 2 - Drive-Thru", assigned: false },
						]
							.filter(
								(teller) =>
									teller.name
										.toLowerCase()
										.indexOf(searchTellers.toLowerCase()) !== -1,
							)
							.map((teller) =>
								teller.assigned ? (
									<div
										key={teller.name}
										className="p-4 rounded-md border border-gray-200"
									>
										<div className="flex items-center justify-between mb-3">
											<h3 className="font-semibold text-gray-700">
												{teller.name}
											</h3>
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
												Assigned
											</span>
										</div>
										<div className="flex items-center justify-between p-3 rounded-md border border-dashed border-gray-300 bg-white">
											<div>
												<p className="font-medium text-gray-800">
													{teller.cashier?.name}
												</p>
												<p className="text-sm text-gray-500">
													{teller.cashier?.role}
												</p>
											</div>
											<Button variant="destructive">Remove</Button>
										</div>
									</div>
								) : (
									<div
										key={teller.name}
										className="p-4 rounded-md border border-dashed border-gray-300 min-h-[100px] flex items-center justify-center text-gray-400"
									>
										<div className="text-center">
											<p className="text-sm">Drop Cashier Here</p>
											<p className="text-xs">{teller.name}</p>
										</div>
									</div>
								),
							)}
					</div>
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
									{[
										{
											id: "Teller 1",
											location: "Main Counter",
											cashier: "John Doe",
											time: "09:15 AM",
											assigned: true,
										},
										{
											id: "Teller 5",
											location: "Walk-in",
											cashier: "Unassigned",
											time: "-",
											assigned: false,
										},
									]
										.filter(
											(assignment) =>
												assignment.id
													.toLowerCase()
													.indexOf(searchAssignments.toLowerCase()) !== -1 ||
												assignment.location
													.toLowerCase()
													.indexOf(searchAssignments.toLowerCase()) !== -1 ||
												assignment.cashier
													.toLowerCase()
													.indexOf(searchAssignments.toLowerCase()) !== -1,
										)
										.map((assignment) => (
											<tr key={assignment.id} className="bg-white border-b">
												<td className="px-6 py-4 font-medium text-gray-900">
													{assignment.id}
												</td>
												<td className="px-6 py-4">{assignment.location}</td>
												<td
													className={`px-6 py-4 ${!assignment.assigned ? "text-gray-400 italic" : ""}`}
												>
													{assignment.cashier}
												</td>
												<td className="px-6 py-4">{assignment.time}</td>
												<td className="px-6 py-4 text-right">
													<a
														className="font-medium text-blue-600 hover:underline"
														href="#"
													>
														{assignment.assigned ? "Reassign" : "Assign"}
													</a>
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
}

export const Route = createFileRoute("/staff/assign")({
	component: StaffAssignPage,
});
