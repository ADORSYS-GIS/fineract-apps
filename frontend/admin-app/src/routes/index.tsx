import { Card } from "@fineract-apps/ui";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Users } from "lucide-react";

function DashboardPage() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">
				Administration Dashboard
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card variant="elevated" size="md">
					<div className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Total Users
								</p>
								<p className="text-3xl font-bold text-gray-900 mt-2">
									--
								</p>
							</div>
							<Users className="w-12 h-12 text-blue-500" />
						</div>
					</div>
				</Card>

				<Card variant="elevated" size="md">
					<div className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Active Users
								</p>
								<p className="text-3xl font-bold text-green-600 mt-2">
									--
								</p>
							</div>
							<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
								<Users className="w-6 h-6 text-green-600" />
							</div>
						</div>
					</div>
				</Card>

				<Card variant="elevated" size="md">
					<div className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Inactive Users
								</p>
								<p className="text-3xl font-bold text-gray-500 mt-2">
									--
								</p>
							</div>
							<div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
								<Users className="w-6 h-6 text-gray-500" />
							</div>
						</div>
					</div>
				</Card>
			</div>

			<div className="mt-8">
				<Card variant="elevated" size="lg">
					<div className="p-6">
						<h2 className="text-xl font-semibold text-gray-800 mb-4">
							Quick Actions
						</h2>
						<div className="space-y-3">
							<Link
								to="/users"
								className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
							>
								<div className="flex items-center justify-between">
									<div>
										<h3 className="font-medium text-gray-900">
											Manage Users
										</h3>
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
		</div>
	);
}

export const Route = createFileRoute("/")({
	component: DashboardPage,
});
