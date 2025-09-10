import { render, screen } from "@testing-library/react";
import { Button } from "./";
import "@testing-library/jest-dom";

describe("Button", () => {
	it("should render the button with the children", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText("Click me")).toBeInTheDocument();
	});
});
