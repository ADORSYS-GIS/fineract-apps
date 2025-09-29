import { LoginView } from "./Login.view";
import { useLogin } from "./useLogin";

export const Login = () => {
	const { initialValues, validationSchema, onSubmit } = useLogin();

	return (
		<LoginView
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
		/>
	);
};
