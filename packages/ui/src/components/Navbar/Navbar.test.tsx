import { fireEvent, render, screen } from "@testing-library/react";
import { Navbar } from "./index";

describe("Navbar", () => {
	test("renders user info", () => {
		render(
			<Navbar
				userName="Jane Doe"
				userId="12345"
				onLogout={jest.fn()}
				onToggleMenu={jest.fn()}
				isMenuOpen={false}
			/>,
		);
		expect(screen.getByText("Jane Doe")).toBeInTheDocument();
		expect(screen.getByText("ID: 12345")).toBeInTheDocument();
	});

	test("handles logout click", () => {
		const handleLogout = jest.fn();
		render(
			<Navbar
				userName="Jane Doe"
				userId="12345"
				onLogout={handleLogout}
				onToggleMenu={jest.fn()}
				isMenuOpen={false}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: /logout/i }));
		expect(handleLogout).toHaveBeenCalled();
	});
});
