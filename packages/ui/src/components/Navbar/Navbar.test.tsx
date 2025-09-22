import { fireEvent, render, screen } from "@testing-library/react";
import { Navbar } from "./index";
import "@testing-library/jest-dom";

describe("Navbar", () => {
	test("renders logo when provided", () => {
		render(
			<Navbar
				logo={<div data-testid="test-logo">Logo</div>}
				userSection={<div>User Section</div>}
				isMenuOpen={false}
				onToggleMenu={jest.fn()}
			/>,
		);
		expect(screen.getByTestId("test-logo")).toBeInTheDocument();
	});

	test("renders user section when provided", () => {
		render(
			<Navbar
				userSection={<div data-testid="test-user">User Section</div>}
				isMenuOpen={false}
				onToggleMenu={jest.fn()}
			/>,
		);
		expect(screen.getByTestId("test-user")).toBeInTheDocument();
	});

	test("renders notifications when provided", () => {
		render(
			<Navbar
				notifications={
					<div data-testid="test-notifications">Notifications</div>
				}
				isMenuOpen={false}
				onToggleMenu={jest.fn()}
			/>,
		);
		expect(screen.getByTestId("test-notifications")).toBeInTheDocument();
	});

	test("renders actions when provided", () => {
		render(
			<Navbar
				actions={<button data-testid="test-action">Action</button>}
				isMenuOpen={false}
				onToggleMenu={jest.fn()}
			/>,
		);
		expect(screen.getByTestId("test-action")).toBeInTheDocument();
	});

	test("toggles mobile menu when menu button is clicked", () => {
		const handleToggle = jest.fn();
		render(
			<Navbar
				isMenuOpen={false}
				onToggleMenu={handleToggle}
				userSection={<div>User</div>}
			/>,
		);

		const menuButton = screen.getByRole("button");
		fireEvent.click(menuButton);
		expect(handleToggle).toHaveBeenCalledTimes(1);
	});

	test("applies variant classes correctly", () => {
		const { container } = render(
			<Navbar
				variant="primary"
				isMenuOpen={false}
				onToggleMenu={jest.fn()}
				userSection={<div>User</div>}
			/>,
		);
		expect(container.firstChild).toHaveClass(
			"bg-navbar-primary",
			"border-navbar-primary",
			"text-navbar-primary-foreground",
		);
	});
});
