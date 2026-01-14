import { UsersService } from "@fineract-apps/fineract-api";
import { Card } from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";

function DashboardPage() {
	const { t } = useTranslation();
	const { data: employees, isLoading } = useQuery({
		queryKey: ["employees"],
		queryFn: () => UsersService.getV1Users(),
	});

	const totalUsers = employees?.length ?? 0;

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">
				{t("dashboard.title")}
			</h1>
			{isLoading ? (
				<p>{t("dashboard.loading")}</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
					<Card variant="elevated" className="p-6">
						<div className="flex items-center">
							<Users className="w-8 h-8 text-blue-600" />
							<div className="ml-4">
								<h2 className="text-xl font-semibold text-gray-800">
									{totalUsers}
								</h2>
								<p className="text-gray-600">{t("dashboard.totalEmployees")}</p>
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
									{t("dashboard.manageUsers")}
								</h2>
								<p className="text-gray-600">
									{t("dashboard.manageUsersDescription")}
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
