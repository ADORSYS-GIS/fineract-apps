import { createFileRoute } from "@tanstack/react-router";

import { CreateStaff } from "@/components/CreateStaff";

export const Route = createFileRoute("/staff/create")({
	component: CreateStaffPage,
});

function CreateStaffPage() {
	return (
		<div className="p-4 max-w-5xl mx-auto">
			<CreateStaff />
		</div>
	);
}
