import { CreateUserView } from "@/components/CreateUser/CreateUser.view";
import { useCreateUser } from "@/components/CreateUser/useCreateUser";

export const CreateUser = () => {
	const props = useCreateUser();
	return <CreateUserView {...props} />;
};
