import { createFileRoute } from "@tanstack/react-router";
import { UserTable } from "@/components/UserTable";

export const Route = createFileRoute("/users/list")({
	component: UserListPage,
});

function UserListPage() {
	return (
		<div className="p-4 max-w-5xl mx-auto">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Users</h1>
			</div>
			<UserTable />
		</div>
	);
}
