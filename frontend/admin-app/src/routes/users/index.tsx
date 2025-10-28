import { useUsersServiceGetV1Users } from "@fineract-apps/fineract-api";
import { Button } from "@fineract-apps/ui";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import type { User } from "@/components/UserTable";
import { UserTable } from "@/components/UserTable";

function UsersListPage() {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");

	// Fetch users from Fineract API
	const { data: users = [], isLoading } = useUsersServiceGetV1Users();

	const filteredUsers = (users as User[]).filter((user) => {
		const query = searchQuery.toLowerCase();
		return (
			user.username?.toLowerCase().includes(query) ||
			user.firstname?.toLowerCase().includes(query) ||
			user.lastname?.toLowerCase().includes(query) ||
			user.email?.toLowerCase().includes(query)
		);
	});

	const handleView = (userId: number) => {
		navigate({ to: "/users/$userId", params: { userId: String(userId) } });
	};

	const handleEdit = (userId: number) => {
		navigate({
			to: "/users/$userId/edit",
			params: { userId: String(userId) },
		});
	};

	const handleCreateUser = () => {
		navigate({ to: "/users/create" });
	};

	return (
		<div className="p-6">
			<div className="mb-6">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">
							User Management
						</h1>
						<p className="text-sm text-gray-600 mt-1">
							View and manage user accounts
						</p>
					</div>
					<Button onClick={handleCreateUser} size="default">
						<Plus className="w-4 h-4 mr-2" />
						Create User
					</Button>
				</div>

				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						type="text"
						placeholder="Search by username, name, or email..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
					/>
				</div>
			</div>

			<UserTable
				users={filteredUsers}
				isLoading={isLoading}
				onView={handleView}
				onEdit={handleEdit}
			/>
		</div>
	);
}

export const Route = createFileRoute("/users/")({
	component: UsersListPage,
});
