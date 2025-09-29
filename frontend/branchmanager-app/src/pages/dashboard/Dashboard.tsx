import { DashboardView } from "./Dashboard.view";
import { useDashboard } from "./useDashboard";

export const Dashboard = () => {
	const { title, query, setQuery } = useDashboard();
	return <DashboardView title={title} query={query} setQuery={setQuery} />;
};
