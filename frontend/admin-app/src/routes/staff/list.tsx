import { Button } from "@fineract-apps/ui";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StaffTable } from "@/components/StaffTable";

export const Route = createFileRoute("/staff/list")({
	component: StaffListPage,
});

function StaffListPage() {
	const { t } = useTranslation();
	return (
		<div className="p-4 max-w-5xl mx-auto">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">{t("staff")}</h1>
				<Link to="/staff/create">
					<Button>
						<Plus className="w-4 h-4 mr-2" />
						{t("createStaff")}
					</Button>
				</Link>
			</div>
			<StaffTable />
		</div>
	);
}
