import { DashboardView } from "./Dashboard.view";
import { useDashboard } from "./useDashboard";

interface DashboardContainerProps {
	readonly onToggleMenu?: () => void;
	readonly isMenuOpen?: boolean;
}

export function Dashboard({
	onToggleMenu,
	isMenuOpen,
}: DashboardContainerProps) {
	const { onLogout, query, onQueryChange } = useDashboard();

	return (
		<DashboardView
			onToggleMenu={onToggleMenu}
			isMenuOpen={isMenuOpen}
			onLogout={onLogout}
			query={query}
			onQueryChange={onQueryChange}
		/>
	);
}
