import { Button, Card } from "@fineract-apps/ui";
import { Edit, Eye } from "lucide-react";
import { UserStatusBadge } from "../UserStatusBadge";
import type { UserTableProps } from "./UserTable.types";

export function UserTable({
	users,
	isLoading,
	onView,
	onEdit,
}: UserTableProps) {
	if (isLoading) {
		return (
			<Card variant="elevated">
				<div className="p-8 text-center text-gray-500">Loading users...</div>
			</Card>
		);
	}

	if (!users || users.length === 0) {
		return (
			<Card variant="elevated">
				<div className="p-8 text-center text-gray-500">No users found.</div>
			</Card>
		);
	}

	return (
		<Card variant="elevated">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50 border-b border-gray-200">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Username
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Email
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Office
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
						{users.map((user) => (
							<tr key={user.id} className="hover:bg-gray-50 transition-colors">
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm font-medium text-gray-900">
										{user.username}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-900">
										{user.firstname} {user.lastname}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-600">{user.email}</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-600">
										{user.officeName || "N/A"}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<UserStatusBadge isActive={user.available !== false} />
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<div className="flex items-center justify-end gap-2">
										{onView && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => onView(user.id)}
												aria-label="View user"
											>
												<Eye className="w-4 h-4" />
											</Button>
										)}
										{onEdit && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => onEdit(user.id)}
												aria-label="Edit user"
											>
												<Edit className="w-4 h-4" />
											</Button>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Card>
	);
}
