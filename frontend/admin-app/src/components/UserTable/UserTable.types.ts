export interface User {
	readonly id: number;
	readonly username: string;
	readonly firstname: string;
	readonly lastname: string;
	readonly email: string;
	readonly officeName?: string;
	// Note: The Fineract API doesn't directly expose isActive on GetUsersResponse
	// We may need to get this from individual user details or use a different field
	// For now, we'll add it as optional
	readonly available?: boolean; // Fineract uses "available" field
}

export interface UserTableProps {
	readonly users: readonly User[];
	readonly isLoading?: boolean;
	readonly onRowClick?: (userId: number) => void;
	readonly onToggleStatus?: (userId: number, currentStatus: boolean) => void;
	readonly searchTerm: string;
	readonly setSearchTerm: (searchTerm: string) => void;
	readonly currentPage: number;
	readonly setCurrentPage: (page: number) => void;
	readonly totalPages: number;
}
