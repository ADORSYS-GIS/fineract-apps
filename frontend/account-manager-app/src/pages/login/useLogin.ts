import { PostV1AuthenticationData } from "@fineract-apps/fineract-api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { fineractApi } from "../../services/api";
import { initialValues, LoginForm, loginSchema } from "./Login.types";

export const useLogin = () => {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);

	const { mutate: login, isPending: isLoggingIn } = useMutation({
		mutationKey: ["login"],
		mutationFn: (loginForm: PostV1AuthenticationData) =>
			fineractApi.auth.postV1Authentication(loginForm),
		onSuccess: (data) => {
			const token = data.base64EncodedAuthenticationKey;
			if (token) {
				localStorage.setItem("token", token);
				localStorage.setItem("user", JSON.stringify(data));
				navigate({ to: "/dashboard" });
			} else {
				setError("Login failed: No token received");
			}
		},
		onError: () => {
			setError("Invalid username or password");
		},
	});

	const onSubmit = (values: LoginForm) => {
		login({ requestBody: values });
	};

	return {
		initialValues,
		validationSchema: loginSchema,
		onSubmit,
		isLoggingIn,
		error,
	};
};
