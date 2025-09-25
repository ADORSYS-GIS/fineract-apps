import { DashboardView } from "./Dashboard.view";
import { useDashboard } from "./useDashboard";

export function Dashboard() {
	const { query, onQueryChange, onLogout } = useDashboard();

	return (
		<DashboardView
			query={query}
			onQueryChange={onQueryChange}
			onLogout={onLogout}
		/>
	);
}
