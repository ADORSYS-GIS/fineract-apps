import { DashboardView } from "./Dashboard.view";
import { useDashboard } from "./useDashboard";

export function Dashboard() {
	const { onLogout } = useDashboard();

	return <DashboardView onLogout={onLogout} />;
}
