export type Staff = {
	readonly id: number;
	readonly firstname: string;
	readonly lastname: string;
	readonly displayName: string;
	readonly officeName?: string;
	readonly isLoanOfficer?: boolean;
	readonly isActive?: boolean;
};

export type StaffTableProps = {
	readonly staff: readonly Staff[];
	readonly isLoading: boolean;
	readonly onRowClick?: (staffId: number) => void;
	readonly onEditClick?: (staffId: number) => void;
	readonly onAssignUserClick?: (staffId: number) => void;
	readonly searchTerm: string;
	readonly setSearchTerm: (searchTerm: string) => void;
	readonly currentPage: number;
	readonly setCurrentPage: (page: number) => void;
	readonly totalPages: number;
};
