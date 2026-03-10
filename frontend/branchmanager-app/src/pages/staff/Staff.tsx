import { StaffView } from "./Staff.view";
import { useStaffPage } from "./useStaff";

export const Staff = () => {
	const props = useStaffPage();
	return <StaffView {...props} />;
};
