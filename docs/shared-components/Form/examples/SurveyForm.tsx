import { Form, Input, SubmitButton } from "@fineract-apps/ui";
import React from "react";
import { z } from "zod";

// Validation schema
const surveySchema = z.object({
	rating: z.enum(["excellent", "good", "average", "poor"], {
		errorMap: () => ({ message: "Please select a rating" }),
	}),
	feedback: z
		.string()
		.min(10, "Please provide at least 10 characters of feedback")
		.max(500, "Feedback must be less than 500 characters"),
	improvements: z.string().optional(),
	recommend: z.boolean().optional(),
	contact: z.boolean().optional(),
});

type SurveyFormData = z.infer<typeof surveySchema>;

const initialValues: SurveyFormData = {
	rating: "good",
	feedback: "",
	improvements: "",
	recommend: false,
	contact: false,
};

const ratingOptions = [
	{ label: "Excellent", value: "excellent" },
	{ label: "Good", value: "good" },
	{ label: "Average", value: "average" },
	{ label: "Poor", value: "poor" },
];

export const SurveyForm: React.FC = () => {
	const handleSubmit = async (values: SurveyFormData) => {
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log("Survey submitted:", values);
			alert("Thank you for your feedback!");
		} catch (error) {
			console.error("Survey submission failed:", error);
			alert("Failed to submit survey. Please try again.");
		}
	};

	return (
		<Form
			initialValues={initialValues}
			validationSchema={surveySchema}
			onSubmit={handleSubmit}
		>
			<h2 className="text-2xl font-bold text-center">Customer Survey</h2>

			<Input
				name="rating"
				label="How would you rate our service?"
				type="radio"
				options={ratingOptions}
			/>

			<Input
				name="feedback"
				label="Tell us more about your experience"
				type="textarea"
				placeholder="Please share your thoughts..."
				helperText="Your feedback helps us improve our service"
			/>

			<Input
				name="improvements"
				label="What could we improve?"
				type="textarea"
				placeholder="Any suggestions for improvement?"
				helperText="Optional - but we'd love to hear your ideas"
			/>

			<Input
				name="recommend"
				label="Would you recommend us to others?"
				type="checkbox"
			/>

			<Input
				name="contact"
				label="Can we contact you for follow-up questions?"
				type="checkbox"
			/>

			<div className="flex justify-center mt-6">
				<SubmitButton label="Submit Survey" />
			</div>
		</Form>
	);
};
