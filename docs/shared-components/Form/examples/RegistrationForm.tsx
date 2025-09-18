import { Form, FormWarning, Input, SubmitButton } from "@fineract-apps/ui";
import React from "react";
import { z } from "zod";

// Validation schema
const registrationSchema = z
	.object({
		firstName: z.string().min(2, "First name must be at least 2 characters"),
		lastName: z.string().min(2, "Last name must be at least 2 characters"),
		email: z.string().email("Please enter a valid email address"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain uppercase, lowercase, and number",
			),
		confirmPassword: z.string(),
		dateOfBirth: z.string().min(1, "Date of birth is required"),
		gender: z.enum(["male", "female", "other"], {
			errorMap: () => ({ message: "Please select a gender" }),
		}),
		country: z.string().min(1, "Please select a country"),
		terms: z
			.boolean()
			.refine((val) => val === true, "You must accept the terms"),
		newsletter: z.boolean().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const initialValues: RegistrationFormData = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	confirmPassword: "",
	dateOfBirth: "",
	gender: "male",
	country: "",
	terms: false,
	newsletter: false,
};

const countryOptions = [
	{ label: "United States", value: "us" },
	{ label: "Canada", value: "ca" },
	{ label: "United Kingdom", value: "uk" },
	{ label: "Germany", value: "de" },
	{ label: "France", value: "fr" },
];

const genderOptions = [
	{ label: "Male", value: "male" },
	{ label: "Female", value: "female" },
	{ label: "Other", value: "other" },
];

export const RegistrationForm: React.FC = () => {
	const handleSubmit = async (values: RegistrationFormData) => {
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));
			console.log("Registration successful:", values);
			alert("Account created successfully!");
		} catch (error) {
			console.error("Registration failed:", error);
			alert("Registration failed. Please try again.");
		}
	};

	return (
		<Form
			initialValues={initialValues}
			validationSchema={registrationSchema}
			onSubmit={handleSubmit}
		>
			<h2 className="text-2xl font-bold text-center">Create Account</h2>

			<FormWarning title="Account Security">
				Your information is encrypted and secure. We never share your personal
				data.
			</FormWarning>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Input
					name="firstName"
					label="First Name"
					type="text"
					placeholder="Enter your first name"
					required
				/>

				<Input
					name="lastName"
					label="Last Name"
					type="text"
					placeholder="Enter your last name"
					required
				/>
			</div>

			<Input
				name="email"
				label="Email Address"
				type="email"
				placeholder="Enter your email"
				helperText="We'll use this for account verification"
				required
			/>

			<Input
				name="password"
				label="Password"
				type="password"
				placeholder="Create a strong password"
				helperText="Must contain uppercase, lowercase, and number"
				required
			/>

			<Input
				name="confirmPassword"
				label="Confirm Password"
				type="password"
				placeholder="Confirm your password"
				required
			/>

			<Input name="dateOfBirth" label="Date of Birth" type="date" required />

			<Input
				name="gender"
				label="Gender"
				type="radio"
				options={genderOptions}
				required
			/>

			<Input
				name="country"
				label="Country"
				type="select"
				options={countryOptions}
				required
			/>

			<Input
				name="terms"
				label="I agree to the Terms of Service and Privacy Policy"
				type="checkbox"
				required
			/>

			<Input
				name="newsletter"
				label="Subscribe to our newsletter for updates and offers"
				type="checkbox"
			/>

			<div className="flex justify-center mt-6">
				<SubmitButton label="Create Account" />
			</div>
		</Form>
	);
};
