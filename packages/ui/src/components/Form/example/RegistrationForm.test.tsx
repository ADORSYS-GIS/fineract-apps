// packages/ui/src/components/Form/RegistrationForm.test.tsx
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { RegistrationForm, RegistrationValues } from "./RegistrationForm";

/**
 * Tests the form with a realistic registration flow:
 *  - fills fields
 *  - checks validation (password mismatch, underage)
 *  - submits and verifies submitted payload
 */

describe("RegistrationForm integration", () => {
	it("submits correct values when form is valid", async () => {
		const onSubmit = jest.fn<void, [RegistrationValues]>();
		render(<RegistrationForm onSubmit={onSubmit} />);

		// Fill form
		fireEvent.change(screen.getByLabelText(/username/i), {
			target: { value: "alice" },
		});
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "alice@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/^password$/i), {
			target: { value: "secret123" },
		});
		fireEvent.change(screen.getByLabelText(/confirm password/i), {
			target: { value: "secret123" },
		});

		// dob - more than 18 years old
		const pastYear = new Date();
		pastYear.setFullYear(pastYear.getFullYear() - 25);
		const iso = pastYear.toISOString().slice(0, 10); // yyyy-mm-dd
		fireEvent.change(screen.getByLabelText(/date of birth/i), {
			target: { value: iso },
		});

		// accept terms
		const checkbox = screen.getByLabelText(
			/accept the terms/i,
		) as HTMLInputElement;
		fireEvent.click(checkbox);
		expect(checkbox.checked).toBe(true);

		// submit
		fireEvent.click(screen.getByRole("button", { name: /register/i }));

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledTimes(1);
		});

		const expected = {
			username: "alice",
			email: "alice@example.com",
			password: "secret123",
			confirmPassword: "secret123",
			dob: iso,
			acceptTerms: true,
		};
		expect(onSubmit).toHaveBeenCalledWith(expected);
	});

	it("shows validation errors when data invalid (password mismatch & underage)", async () => {
		render(<RegistrationForm />); // default onSubmit logs

		fireEvent.change(screen.getByLabelText(/username/i), {
			target: { value: "bob" },
		});
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "bob@example.com" },
		});
		fireEvent.change(screen.getByLabelText(/^password$/i), {
			target: { value: "secret123" },
		});
		fireEvent.change(screen.getByLabelText(/confirm password/i), {
			target: { value: "different" },
		});

		// date of birth -> under 18
		const recent = new Date();
		recent.setFullYear(recent.getFullYear() - 15);
		const isoRecent = recent.toISOString().slice(0, 10);
		fireEvent.change(screen.getByLabelText(/date of birth/i), {
			target: { value: isoRecent },
		});

		// do not accept terms (leave unchecked)

		fireEvent.click(screen.getByRole("button", { name: /register/i }));

		// Wait for validation messages to appear
		await waitFor(() => {
			// we expect at least one alert with password mismatch or underage or accept terms
			const alerts = screen.getAllByRole("alert");
			expect(alerts.length).toBeGreaterThanOrEqual(1);
		});

		// Check specific error messages are present
		expect(screen.getByText(/passwords must match/i)).toBeInTheDocument();
		expect(
			screen.getByText(/you must be at least 18 years old/i),
		).toBeInTheDocument();
		expect(screen.getByText(/you must accept the terms/i)).toBeInTheDocument();
	});
});
