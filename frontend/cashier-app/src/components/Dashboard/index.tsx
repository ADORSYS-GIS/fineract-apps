import { DashboardView } from "./Dashboard.view";
import { useDashboard } from "./useDashboard";

export function Dashboard() {
	const { query, onQueryChange } = useDashboard();

	return <DashboardView query={query} onQueryChange={onQueryChange} />;
}
