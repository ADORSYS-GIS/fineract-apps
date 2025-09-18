import { Form, Input, SubmitButton } from "@fineract-apps/ui";
import React from "react";
import { z } from "zod";

// Simple validation schema
const simpleSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Please enter a valid email"),
	age: z.number().min(18, "Must be at least 18 years old"),
});

type SimpleFormData = z.infer<typeof simpleSchema>;

const initialValues: SimpleFormData = {
	name: "",
	email: "",
	age: 18,
};

export const SimpleForm: React.FC = () => {
	const handleSubmit = async (values: SimpleFormData) => {
		try {
			await new Promise((resolve) => setTimeout(resolve, 500));
			console.log("Simple form submitted:", values);
			alert("Form submitted successfully!");
		} catch (error) {
			console.error("Form submission failed:", error);
			alert("Failed to submit form. Please try again.");
		}
	};

	return (
		<Form
			initialValues={initialValues}
			validationSchema={simpleSchema}
			onSubmit={handleSubmit}
		>
			<h2 className="text-2xl font-bold text-center">Simple Form</h2>

			<Input
				name="name"
				label="Full Name"
				type="text"
				placeholder="Enter your name"
			/>

			<Input
				name="email"
				label="Email Address"
				type="email"
				placeholder="Enter your email"
			/>

			<Input
				name="age"
				label="Age"
				type="number"
				placeholder="Enter your age"
			/>

			<div className="flex justify-center mt-6">
				<SubmitButton label="Submit" />
			</div>
		</Form>
	);
};
