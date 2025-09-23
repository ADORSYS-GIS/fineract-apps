import { LoginView } from "./Login.view";
import { useLogin } from "./useLogin";

export const Login = () => {
	const { handleSubmit, isPending, error } = useLogin();

	return (
		<LoginView
			handleSubmit={handleSubmit}
			isPending={isPending}
			error={error}
		/>
	);
};
