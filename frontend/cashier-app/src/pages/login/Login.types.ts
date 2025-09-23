export interface LoginViewProps {
	handleSubmit: (values: LoginFormValues) => void;
	isPending: boolean;
	error: unknown;
}

export interface LoginFormValues {
	username: string;
	password: string;
}
