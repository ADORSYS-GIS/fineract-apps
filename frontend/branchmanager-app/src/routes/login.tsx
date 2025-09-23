import { Button, Card, Form, FormTitle, Input } from "@fineract-apps/ui";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

type LoginValues = { username: string; password: string };

function LoginPage() {
	const navigate = useNavigate();
	const initialValues: LoginValues = { username: "", password: "" };

	return (
		<div className="min-h-[80vh] flex items-center justify-center px-4">
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
					onSubmit={() => {
						// TODO: Wire to auth later. For now, navigate to dashboard
						navigate({ to: "/dashboard" });
					}}
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
						<a
							className="text-sm font-medium text-green-600 hover:underline"
							href="#"
						>
							Forgot your password?
						</a>
					</div>
					<Button type="submit" className="w-full rounded-full">
						Login
					</Button>
				</Form>
			</Card>
		</div>
	);
}

export const Route = createFileRoute("/login")({
	component: LoginPage,
});
