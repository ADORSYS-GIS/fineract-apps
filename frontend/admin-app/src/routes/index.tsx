import { Card } from "@fineract-apps/ui";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Users } from "lucide-react";

function DashboardPage() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">
				Administration Dashboard
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Link to="/users/list">
					<Card
						variant="elevated"
						className="p-6 hover:shadow-lg transition-shadow"
					>
						<div className="flex items-center">
							<Users className="w-8 h-8 text-blue-600" />
							<div className="ml-4">
								<h2 className="text-xl font-semibold text-gray-800">
									Manage Users
								</h2>
								<p className="text-gray-600">
									Create, edit, and manage user accounts and permissions.
								</p>
							</div>
						</div>
					</Card>
				</Link>
				<Link to="/staff/list">
					<Card
						variant="elevated"
						className="p-6 hover:shadow-lg transition-shadow"
					>
						<div className="flex items-center">
							<Briefcase className="w-8 h-8 text-green-600" />
							<div className="ml-4">
								<h2 className="text-xl font-semibold text-gray-800">
									Manage Staff
								</h2>
								<p className="text-gray-600">
									Administer staff profiles, roles, and assignments.
								</p>
							</div>
						</div>
					</Card>
				</Link>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/")({
	component: DashboardPage,
});
