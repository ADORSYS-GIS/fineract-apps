// // packages/ui/src/components/Form/Form.test.tsx
// import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// import { Formik } from "formik";
// import { z } from "zod";
// import { Form, Input } from ".";

// describe("Form and Input - basic behaviour", () => {
// 	it("renders input and submits value", async () => {
// 		const handleSubmit = jest.fn();
// 		const schema = z.object({
// 			email: z.string().email(),
// 		});

// 		render(
// 			<Formik
// 				initialValues={{ email: "" }}
// 				validationSchema={schema}
// 				onSubmit={handleSubmit}
// 			>
// 				<Form>
// 					<Input name="email" label="Email" type="email" />
// 					<button type="submit">Submit</button>
// 				</Form>
// 			</Formik>,
// 		);

// 		const input = screen.getByLabelText(/email/i);
// 		fireEvent.change(input, { target: { value: "test@example.com" } });
// 		fireEvent.click(screen.getByText(/submit/i));

// 		await waitFor(() => {
// 			expect(handleSubmit).toHaveBeenCalledTimes(1);
// 			expect(handleSubmit).toHaveBeenCalledWith({ email: "test@example.com" });
// 		});
// 	});

// 	it("shows error message on validation fail", async () => {
// 		const schema = z.object({
// 			email: z.string().min(1, "Required"),
// 		});

// 		render(
// 			<Formik
// 				initialValues={{ email: "" }}
// 				validationSchema={schema}
// 				onSubmit={() => {}}
// 			>
// 				<Form>
// 					<Input name="email" label="Email" type="email" />
// 					<button type="submit">Submit</button>
// 				</Form>
// 			</Formik>,
// 		);

// 		fireEvent.click(screen.getByText(/submit/i));

// 		await waitFor(() => {
// 			const alert = screen.getByRole("alert");
// 			expect(alert.textContent).toBe(
// 				"Invalid input: expected string, received undefined",
// 			);
// 		});
// 	});
// });
