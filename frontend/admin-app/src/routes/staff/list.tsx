import { Button } from "@fineract-apps/ui";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { StaffTable } from "@/components/StaffTable";

export const Route = createFileRoute("/staff/list")({
	component: StaffListPage,
});

function StaffListPage() {
	return (
		<div className="p-4 max-w-5xl mx-auto">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Staff</h1>
				<Link to="/staff/create">
					<Button>
						<Plus className="w-4 h-4 mr-2" />
						Create Staff
					</Button>
				</Link>
			</div>
			<StaffTable />
		</div>
	);
}
