import { CreateStaffAndUserView } from "./CreateStaffAndUser.view";
import { useCreateStaffAndUser } from "./useCreateStaffAndUser";

export const CreateStaffAndUser = () => {
	const props = useCreateStaffAndUser();

	return <CreateStaffAndUserView {...props} />;
};
