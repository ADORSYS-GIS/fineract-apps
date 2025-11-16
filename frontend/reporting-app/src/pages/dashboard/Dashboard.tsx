import { DashboardView } from "./Dashboard.view";
import { useDashboard } from "./useDashboard";

export function Dashboard() {
	const dashboardData = useDashboard();
	return <DashboardView {...dashboardData} />;
}
