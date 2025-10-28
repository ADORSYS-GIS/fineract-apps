export interface User {
	id: number;
	username: string;
	firstname: string;
	lastname: string;
	email: string;
	officeName?: string;
	// Note: The Fineract API doesn't directly expose isActive on GetUsersResponse
	// We may need to get this from individual user details or use a different field
	// For now, we'll add it as optional
	available?: boolean; // Fineract uses "available" field
}

export interface UserTableProps {
	users: User[];
	isLoading?: boolean;
	onView?: (userId: number) => void;
	onEdit?: (userId: number) => void;
	onToggleStatus?: (userId: number, currentStatus: boolean) => void;
}
