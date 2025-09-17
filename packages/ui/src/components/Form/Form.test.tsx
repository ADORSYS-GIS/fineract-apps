// packages/ui/src/components/Form/Form.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Form, Input } from ".";

describe("Form and Input - basic behaviour", () => {
	it("renders input and submits value", async () => {
		const handleSubmit = jest.fn();
		render(
			<Form initialValues={{ email: "" }} onSubmit={handleSubmit}>
				<Input name="email" label="Email" type="email" />
				<button type="submit">Submit</button>
			</Form>,
		);

		const input = screen.getByLabelText(/email/i);
		fireEvent.change(input, { target: { value: "test@example.com" } });
		fireEvent.click(screen.getByText(/submit/i));

		await waitFor(() => {
			expect(handleSubmit).toHaveBeenCalledTimes(1);
			expect(handleSubmit).toHaveBeenCalledWith({ email: "test@example.com" });
		});
	});

	it("shows error message on validation fail", async () => {
		const validationSchema = {
			email: (v: unknown) => {
				const s = typeof v === "string" ? v : "";
				return !s ? "Required" : undefined;
			},
		};

		render(
			<Form initialValues={{ email: "" }} validationSchema={validationSchema}>
				<Input name="email" label="Email" type="email" />
				<button type="submit">Submit</button>
			</Form>,
		);

		fireEvent.click(screen.getByText(/submit/i));

		await waitFor(() => {
			const alert = screen.getByRole("alert");
			expect(alert).toHaveTextContent("Required");
		});
	});
});
