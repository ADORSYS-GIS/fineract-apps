interface OfficeData {
	id: number;
	name: string;
	[key: string]: unknown;
}

interface RoleData {
	id: number;
	name: string;
	[key: string]: unknown;
}

export interface Employee {
	id: number;
	officeId: number;
	officeName: string;
	firstname: string;
	lastname: string;
	username: string;
	email: string;
	passwordNeverExpires?: boolean;
	allowedOffices?: OfficeData[];
	availableRoles?: RoleData[];
	selectedRoles: RoleData[];
	loanOfficer: boolean;
	mobileNo?: string;
	externalId?: string;
	staff?: {
		id: number;
		joiningDate: string;
		[key: string]: unknown;
	};
}
