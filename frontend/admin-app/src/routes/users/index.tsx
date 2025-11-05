import { Card } from "@fineract-apps/ui";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Users } from "lucide-react";

function UsersPage() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>
			<Card variant="elevated" size="lg">
				<div className="p-6">
					<div className="space-y-3">
						<Link
							to="/users/list"
							className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
						>
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium text-gray-900">Manage Users</h3>
									<p className="text-sm text-gray-600 mt-1">
										View, create, and manage user accounts
									</p>
								</div>
								<Users className="w-6 h-6 text-blue-600" />
							</div>
						</Link>
					</div>
				</div>
			</Card>
		</div>
	);
}

export const Route = createFileRoute("/users/")({
	component: UsersPage,
});
