import { Button } from "@fineract-apps/ui";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { UserTable } from "@/components/UserTable";

export const Route = createFileRoute("/users/list")({
	component: UserListPage,
});

function UserListPage() {
	return (
		<div className="p-4 max-w-5xl mx-auto">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Users</h1>
				<Link to="/users/create">
					<Button>
						<Plus className="w-4 h-4 mr-2" />
						Create User
					</Button>
				</Link>
			</div>
			<UserTable />
		</div>
	);
}
