import { createFileRoute } from "@tanstack/react-router";
import { EditUser } from "@/components/EditUser";

function EditUserPage() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">Edit User</h1>
			<EditUser />
		</div>
	);
}

export const Route = createFileRoute("/users/$userId/edit")({
	component: EditUserPage,
});
