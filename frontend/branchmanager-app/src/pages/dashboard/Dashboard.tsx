import { DashboardView } from "./Dashboard.view";
import { useDashboard } from "./useDashboard";

export const Dashboard = () => {
	const props = useDashboard();
	return <DashboardView {...props} />;
};
