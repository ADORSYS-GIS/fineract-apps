import { Form, FormWarning, Input, SubmitButton } from "@fineract-apps/ui";
import React from "react";
import { z } from "zod";

// Validation schema
const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const initialValues: LoginFormData = {
	email: "",
	password: "",
	rememberMe: false,
};

export const LoginForm: React.FC = () => {
	const handleSubmit = async (values: LoginFormData) => {
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log("Login form submitted:", values);
			alert("Login successful!");
		} catch (error) {
			console.error("Login failed:", error);
			alert("Login failed. Please try again.");
		}
	};

	return (
		<Form
			initialValues={initialValues}
			validationSchema={loginSchema}
			onSubmit={handleSubmit}
		>
			<h2 className="text-2xl font-bold text-center">Login Form</h2>

			<FormWarning title="Security Notice">
				Please ensure you're using a secure connection before entering your
				credentials.
			</FormWarning>

			<Input
				name="email"
				label="Email Address"
				type="email"
				placeholder="Enter your email"
				helperText="We'll never share your email with anyone else."
				required
			/>

			<Input
				name="password"
				label="Password"
				type="password"
				placeholder="Enter your password"
				helperText="Password must be at least 6 characters long."
				required
			/>

			<Input name="rememberMe" label="Remember me" type="checkbox" />

			<div className="flex justify-center mt-6">
				<SubmitButton label="Sign In" />
			</div>
		</Form>
	);
};
