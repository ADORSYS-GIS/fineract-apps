export interface DashboardViewProps {
	readonly query: string;
	readonly onQueryChange: (query: string) => void;
	readonly onLogout: () => void;
}
