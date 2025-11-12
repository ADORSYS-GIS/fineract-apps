import { createFileRoute } from "@tanstack/react-router";

import { CreateStaffAndUser } from "@/components/CreateStaffAndUser";

export const Route = createFileRoute("/staff/create")({
	component: CreateStaffAndUserPage,
});

function CreateStaffAndUserPage() {
	return (
		<div className="p-4 max-w-5xl mx-auto">
			<CreateStaffAndUser />
		</div>
	);
}
