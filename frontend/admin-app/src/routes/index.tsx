import { StaffService, UsersService } from "@fineract-apps/fineract-api";
import { Card } from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, UserCheck, Users, UserX } from "lucide-react";

function DashboardPage() {
	const { data: usersData, isLoading: usersLoading } = useQuery({
		queryKey: ["users"],
		queryFn: () => UsersService.getV1Users(),
	});

	const { data: staffData, isLoading: staffLoading } = useQuery({
		queryKey: ["staff"],
		queryFn: () => StaffService.getV1Staff({ status: "all" }),
	});

	const totalUsers = usersData?.length ?? 0;
	const totalStaff = staffData?.length ?? 0;
	const activeStaff = staffData?.filter((staff) => staff.isActive).length ?? 0;
	const inactiveStaff =
		staffData?.filter((staff) => !staff.isActive).length ?? 0;

	const isLoading = usersLoading || staffLoading;

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">
				Administration Dashboard
			</h1>
			{isLoading ? (
				<p>Loading stats...</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
					<Card variant="elevated" className="p-6">
						<div className="flex items-center">
							<Users className="w-8 h-8 text-blue-600" />
							<div className="ml-4">
								<h2 className="text-xl font-semibold text-gray-800">
									{totalUsers}
								</h2>
								<p className="text-gray-600">Total Users</p>
							</div>
						</div>
					</Card>
					<Card variant="elevated" className="p-6">
						<div className="flex items-center">
							<Briefcase className="w-8 h-8 text-green-600" />
							<div className="ml-4">
								<h2 className="text-xl font-semibold text-gray-800">
									{totalStaff}
								</h2>
								<p className="text-gray-600">Total Staff</p>
							</div>
						</div>
					</Card>
					<Card variant="elevated" className="p-6">
						<div className="flex items-center">
							<UserCheck className="w-8 h-8 text-green-600" />
							<div className="ml-4">
								<h2 className="text-xl font-semibold text-gray-800">
									{activeStaff}
								</h2>
								<p className="text-gray-600">Active Staff</p>
							</div>
						</div>
					</Card>
					<Card variant="elevated" className="p-6">
						<div className="flex items-center">
							<UserX className="w-8 h-8 text-red-600" />
							<div className="ml-4">
								<h2 className="text-xl font-semibold text-gray-800">
									{inactiveStaff}
								</h2>
								<p className="text-gray-600">Inactive Staff</p>
							</div>
						</div>
					</Card>
				</div>
			)}
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
