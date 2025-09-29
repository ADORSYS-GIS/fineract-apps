import { Button, Form, Input } from "@fineract-apps/ui";
import { useLogin } from "./useLogin";

export const LoginView = ({
	initialValues,
	validationSchema,
	onSubmit,
	isLoggingIn,
	error,
}: ReturnType<typeof useLogin>) => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-lg">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
					<p className="mt-2 text-gray-600">Please sign in to continue</p>
				</div>
				{error && <p className="text-red-500 text-center">{error}</p>}
				<Form
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={onSubmit}
				>
					<Input
						name="username"
						label="Username"
						placeholder="Enter your username"
					/>
					<Input
						name="password"
						label="Password"
						type="password"
						placeholder="Enter your password"
					/>
					<Button type="submit" className="w-full" disabled={isLoggingIn}>
						{isLoggingIn ? "Logging in..." : "Login"}
					</Button>
				</Form>
			</div>
		</div>
	);
};
