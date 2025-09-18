import {
	Form,
	FormTitle,
	FormWarning,
	Input,
	SubmitButton,
} from "@fineract-apps/ui";
import React from "react";
import { z } from "zod";

// Validation schema
const contactSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Please enter a valid email"),
	subject: z.string().min(5, "Subject must be at least 5 characters"),
	message: z.string().min(10, "Message must be at least 10 characters"),
	newsletter: z.boolean().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const initialValues: ContactFormData = {
	name: "",
	email: "",
	subject: "",
	message: "",
	newsletter: false,
};

export const ContactForm: React.FC = () => {
	const handleSubmit = async (values: ContactFormData) => {
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log("Contact form submitted:", values);
			alert("Message sent successfully!");
		} catch (error) {
			console.error("Error submitting form:", error);
			alert("Failed to send message. Please try again.");
		}
	};

	return (
		<Form
			initialValues={initialValues}
			validationSchema={contactSchema}
			onSubmit={handleSubmit}
		>
			<FormTitle>Contact Us</FormTitle>

			<FormWarning title="Response Time">
				We typically respond within 24 hours during business days.
			</FormWarning>

			<Input
				name="name"
				label="Full Name"
				type="text"
				placeholder="Enter your full name"
			/>

			<Input
				name="email"
				label="Email Address"
				type="email"
				placeholder="Enter your email"
				helperText="We'll use this to respond to your message"
			/>

			<Input
				name="subject"
				label="Subject"
				type="text"
				placeholder="What's this about?"
			/>

			<Input
				name="message"
				label="Message"
				type="textarea"
				placeholder="Tell us more..."
				helperText="Please provide as much detail as possible"
			/>

			<Input
				name="newsletter"
				label="Subscribe to our newsletter"
				type="checkbox"
			/>

			<div className="flex justify-center mt-6">
				<SubmitButton label="Send Message" />
			</div>
		</Form>
	);
};
