import { Button, Card, Form, FormTitle, Input } from "@fineract-apps/ui";
import type { LoginValues } from "./Login.types";

type Props = {
	initialValues: LoginValues;
	onSubmit: (values: LoginValues) => void;
};

export const LoginView = ({ initialValues, onSubmit }: Props) => {
	return (
		<div className="min-h-screen flex items-center justify-center px-4 bg-white">
			<Card className="w-full max-w-md p-6 bg-white">
				<div className="text-center mb-6">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
						<span className="text-green-600 font-bold">BM</span>
					</div>
					<h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
					<p className="mt-2 text-gray-600">
						Login to your Branch Manager account
					</p>
				</div>
				<Form<LoginValues>
					initialValues={initialValues}
					onSubmit={onSubmit}
					className="space-y-2"
				>
					<FormTitle className="sr-only">Login</FormTitle>
					<Input name="username" label="Username" placeholder="Username" />
					<Input
						name="password"
						label="Password"
						type="password"
						placeholder="Password"
					/>
					<div className="flex items-center justify-end">
						<button
							type="button"
							className="text-sm font-medium text-green-600 hover:underline"
						>
							Forgot your password?
						</button>
					</div>
					<Button type="submit" className="w-full rounded-full">
						Login
					</Button>
				</Form>
			</Card>
		</div>
	);
};
