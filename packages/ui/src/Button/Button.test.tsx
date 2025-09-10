import { render, screen } from "@testing-library/react";
import { ButtonView } from "./Button.view";

describe("Button", () => {
	it("renders correctly", () => {
		render(<ButtonView>Click me</ButtonView>);
		const button = screen.getByRole("button", { name: /click me/i });
		expect(button).toBeInTheDocument();
	});
});
