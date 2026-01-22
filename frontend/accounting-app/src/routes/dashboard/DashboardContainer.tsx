import { DashboardView } from "./DashboardView";
import { useDashboard } from "./useDashboard";

export function DashboardContainer() {
	const { stats, isLoading } = useDashboard();

	return <DashboardView stats={stats} isLoading={isLoading} />;
}
