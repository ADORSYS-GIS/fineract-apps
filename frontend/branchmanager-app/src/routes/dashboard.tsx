import { Button, SearchBar } from "@fineract-apps/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

type Approval = {
	id: string;
	applicant: string;
	type: "New Account" | "Loan Application";
	amount: string;
	status: "Pending" | "Approved" | "Rejected";
};

const approvalsSeed: Approval[] = [
	{
		id: "1",
		applicant: "Sophia Clark",
		type: "New Account",
		amount: "$5,000",
		status: "Pending",
	},
	{
		id: "2",
		applicant: "Ethan Bennett",
		type: "Loan Application",
		amount: "$15,000",
		status: "Pending",
	},
	{
		id: "3",
		applicant: "Olivia Carter",
		type: "New Account",
		amount: "$2,000",
		status: "Pending",
	},
];

function DashboardPage() {
	const [query, setQuery] = useState("");

	const filteredApprovals = useMemo(() => {
		const q = query.toLowerCase();
		return approvalsSeed.filter((a) => {
			const inApplicant = a.applicant.toLowerCase().indexOf(q) !== -1;
			const inType = a.type.toLowerCase().indexOf(q) !== -1;
			const inAmount = a.amount.toLowerCase().indexOf(q) !== -1;
			const inStatus = a.status.toLowerCase().indexOf(q) !== -1;
			return inApplicant || inType || inAmount || inStatus;
		});
	}, [query]);

	return (
		<div className="px-6 py-6 md:px-10">
			<div className="flex flex-wrap items-center justify-between gap-3 mb-6">
				<h1 className="text-2xl md:text-3xl font-bold text-gray-900">
					Branch Manager Dashboard
				</h1>
			</div>

			{/* Horizontal menu removed (duplicated with sidebar) */}

			<div className="mt-6 flex items-center justify-between gap-4">
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

			<div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
				<table className="w-full text-left">
					<thead>
						<tr className="bg-gray-50">
							<th className="px-6 py-4 text-gray-800 text-sm font-medium">
								Applicant Name
							</th>
							<th className="px-6 py-4 text-gray-800 text-sm font-medium">
								Application Type
							</th>
							<th className="px-6 py-4 text-gray-800 text-sm font-medium">
								Amount
							</th>
							<th className="px-6 py-4 text-gray-800 text-sm font-medium">
								Status
							</th>
							<th className="px-6 py-4 text-gray-800 text-sm font-medium">
								Action
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{filteredApprovals.map((row) => (
							<tr key={row.id}>
								<td className="px-6 py-4 text-gray-800 text-sm">
									{row.applicant}
								</td>
								<td className="px-6 py-4 text-gray-600 text-sm">{row.type}</td>
								<td className="px-6 py-4 text-gray-600 text-sm">
									{row.amount}
								</td>
								<td className="px-6 py-4 text-sm">
									<span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
										{row.status}
									</span>
								</td>
								<td className="px-6 py-4 text-sm">
									<Button className="rounded-full h-9 px-4 text-sm font-semibold">
										Approve
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/dashboard")({
	component: DashboardPage,
});
