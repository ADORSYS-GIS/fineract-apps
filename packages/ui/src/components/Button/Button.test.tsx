import { render, screen } from "@testing-library/react";
import { Button } from "./";
import "@testing-library/jest-dom";

describe("Button", () => {
	it("should render the button with the children", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText("Click me")).toBeInTheDocument();
	});

	it("should apply the default variant and size classes", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByRole("button")).toHaveClass("h-10 py-2 px-4");
	});

	it("should apply the specified variant and size classes", () => {
		render(
			<Button variant="destructive" size="sm">
				Delete
			</Button>,
		);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("h-9 px-3");
	});

	it("should be disabled and show a loader when isLoading is true", () => {
		render(<Button isLoading>Loading</Button>);
		const button = screen.getByRole("button");
		expect(button).toBeDisabled();
		expect(button.querySelector(".animate-spin")).toBeInTheDocument();
	});
});
