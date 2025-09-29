import { useNavigate } from "@tanstack/react-router";
import type { LoginValues } from "./Login.types";

export function useLogin() {
	const navigate = useNavigate();

	const initialValues: LoginValues = { username: "", password: "" };

	const onSubmit = () => {
		try {
			localStorage.setItem("bm_auth", "1");
		} catch {
			// noop
		}
		navigate({ to: "/dashboard" });
	};

	return { initialValues, onSubmit };
}
