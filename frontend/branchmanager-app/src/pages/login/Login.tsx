import { LoginView } from "./Login.view";
import { useLogin } from "./useLogin";

export const Login = () => {
	const { initialValues, onSubmit } = useLogin();
	return <LoginView initialValues={initialValues} onSubmit={onSubmit} />;
};
