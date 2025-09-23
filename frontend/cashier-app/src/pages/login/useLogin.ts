import { useNavigate } from "@tanstack/react-router";
import { LoginFormValues } from "./Login.types";

export const useLogin = () => {
	const navigate = useNavigate();

	const handleSubmit = (values: LoginFormValues) => {
		console.log("Bypassing login with values:", values);
		navigate({ to: "/dashboard", search: { query: "" } });
	};

	return {
		handleSubmit,
		isPending: false,
		error: null,
	};
};
