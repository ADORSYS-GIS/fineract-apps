import { Card } from "@fineract-apps/ui";
import { Download, Filter, Shield } from "lucide-react";
import type { AuditTrailData } from "./AuditTrail.types";

export function AuditTrailView({
	isLoading,
	filters,
	onFilterChange,
	onExport,
}: AuditTrailData) {
	if (isLoading) {
		return (
			<div className="p-6">
				<h1 className="text-3xl font-bold mb-6">Audit Trail</h1>
				<p>Loading audit entries...</p>
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center">
					<Shield className="w-8 h-8 mr-3 text-purple-500" />
					<h1 className="text-3xl font-bold">Audit Trail</h1>
				</div>
				<button
					onClick={onExport}
					className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center"
				>
					<Download className="w-4 h-4 mr-2" />
					Export
				</button>
			</div>

			<Card className="p-6 mb-6">
				<div className="flex items-center mb-4">
					<Filter className="w-5 h-5 mr-2 text-gray-600" />
					<h2 className="text-lg font-semibold">Filters</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div>
						<label className="block text-sm font-medium mb-2">From Date</label>
						<input
							type="date"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg"
							value={filters.fromDate}
							onChange={(e) => onFilterChange("fromDate", e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-2">To Date</label>
						<input
							type="date"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg"
							value={filters.toDate}
							onChange={(e) => onFilterChange("toDate", e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-2">Action</label>
						<select
							className="w-full px-3 py-2 border border-gray-300 rounded-lg"
							value={filters.actionName}
							onChange={(e) => onFilterChange("actionName", e.target.value)}
						>
							<option value="">All Actions</option>
							<option value="CREATE">Create</option>
							<option value="UPDATE">Update</option>
							<option value="DELETE">Delete</option>
							<option value="APPROVE">Approve</option>
							<option value="REJECT">Reject</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium mb-2">Entity</label>
						<select
							className="w-full px-3 py-2 border border-gray-300 rounded-lg"
							value={filters.entityName}
							onChange={(e) => onFilterChange("entityName", e.target.value)}
						>
							<option value="">All Entities</option>
							<option value="CLIENT">Client</option>
							<option value="LOAN">Loan</option>
							<option value="SAVINGS">Savings Account</option>
							<option value="USER">User</option>
							<option value="OFFICE">Office</option>
						</select>
					</div>
				</div>
			</Card>

			<Card className="p-6 text-center text-gray-600">
				No audit entries found. Audit trail will be displayed here.
			</Card>
		</div>
	);
}
