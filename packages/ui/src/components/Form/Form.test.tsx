import { fireEvent, render, screen } from "@testing-library/react";
import { Form, Input } from "./Form.view";

describe("Form and Input", () => {
	it("renders input and submits value", () => {
		const handleSubmit = jest.fn();
		render(
			<Form initialValues={{ email: "" }} onSubmit={handleSubmit}>
				<Input name="email" label="Email" type="email" />
				<button type="submit">Submit</button>
			</Form>,
		);
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.click(screen.getByText(/submit/i));
		expect(handleSubmit).toHaveBeenCalledWith({ email: "test@example.com" });
	});

	it("shows error message on validation fail", () => {
		const validationSchema = {
			email: (v: string) => (!v ? "Required" : undefined),
		};
		render(
			<Form initialValues={{ email: "" }} validationSchema={validationSchema}>
				<Input name="email" label="Email" type="email" />
				<button type="submit">Submit</button>
			</Form>,
		);
		fireEvent.click(screen.getByText(/submit/i));
		expect(screen.getByRole("alert")).toHaveTextContent("Required");
	});
});
