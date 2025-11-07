export type TellerAssignment = {
	id: number;
	tellerName?: string;
	staffName?: string;
	staffId?: number;
	startDate?: string;
	endDate?: string;
	isFullDay?: boolean;
	description?: string;
};

export type DashboardViewProps = {
	title: string;
	query: string;
	setQuery: (v: string) => void;
	searchAssignments: string;
	setSearchAssignments: (v: string) => void;
	assignments: TellerAssignment[];
	loadingAssignments: boolean;
	assignmentsError?: string;
	page: number;
	limit: number;
	total: number;
	setPage: (page: number) => void;
	onLogout?: () => void;
};
