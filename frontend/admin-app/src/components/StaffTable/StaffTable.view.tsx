import { Button, Card, Pagination, SearchBar } from "@fineract-apps/ui";
import { Edit, Eye, UserPlus } from "lucide-react";
import { UserStatusBadge } from "../UserStatusBadge";
import type { StaffTableProps } from "./StaffTable.types";

export function StaffTable({
	staff,
	isLoading,
	onRowClick,
	onEditClick,
	onAssignUserClick,
	searchTerm,
	setSearchTerm,
	currentPage,
	setCurrentPage,
	totalPages,
}: Readonly<StaffTableProps>) {
	if (isLoading) {
		return (
			<Card variant="elevated">
				<div className="p-8 text-center text-gray-500">Loading staff...</div>
			</Card>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<Card variant="elevated">
				<div className="p-4">
					<SearchBar
						placeholder="Search by name or display name..."
						value={searchTerm}
						onValueChange={setSearchTerm}
					/>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Display Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									First Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Last Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Office
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Is Loan Officer
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{staff.map((staffMember) => (
								<tr
									key={staffMember.id}
									className="hover:bg-gray-50 transition-colors cursor-pointer"
									onClick={() => onRowClick?.(staffMember.id)}
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900">
											{staffMember.displayName}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{staffMember.firstname}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-600">
											{staffMember.lastname}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-600">
											{staffMember.officeName || "N/A"}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-600">
											{staffMember.isLoanOfficer ? "Yes" : "No"}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<UserStatusBadge
											isActive={staffMember.isActive !== false}
										/>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<div className="flex items-center justify-end gap-2">
											<Button
												variant="ghost"
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													onRowClick?.(staffMember.id);
												}}
												aria-label="View staff"
											>
												<Eye className="w-4 h-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													onEditClick?.(staffMember.id);
												}}
												aria-label="Edit staff"
											>
												<Edit className="w-4 h-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													onAssignUserClick?.(staffMember.id);
												}}
												aria-label="Assign user"
											>
												<UserPlus className="w-4 h-4" />
											</Button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{staff.length === 0 && (
					<div className="p-8 text-center text-gray-500">No staff found.</div>
				)}
			</Card>
			{totalPages > 1 && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
				/>
			)}
		</div>
	);
}
