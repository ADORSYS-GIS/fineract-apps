export type StaffItem = {
	id: number;
	displayName?: string;
	firstname?: string;
	lastname?: string;
	officeName?: string;
	mobileNo?: string;
};

export type StaffViewProps = {
	search: string;
	setSearch: (v: string) => void;
	staffItems: StaffItem[];
	isLoadingStaff: boolean;
	staffError?: string;
	onStaffClick: (id: number) => void;
};
