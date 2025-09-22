import { fireEvent, render, screen } from "@testing-library/react";
import { Card } from ".";

describe("Card", () => {
	it("should render the title and children", () => {
		render(<Card title="Test Title">Test Children</Card>);
		expect(screen.getByText("Test Title")).toBeInTheDocument();
		expect(screen.getByText("Test Children")).toBeInTheDocument();
	});

	it("should call onClick when the card is clicked", () => {
		const onClick = jest.fn();
		render(<Card onClick={onClick}>Click Me</Card>);
		fireEvent.click(screen.getByText("Click Me"));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("should apply hoverable styles when hoverable is true", () => {
		const { container } = render(<Card hoverable>Hover Me</Card>);
		expect(container.firstChild).toHaveClass("hover:shadow-lg");
	});

	it("should render media and footer content", () => {
		render(
			<Card media={<div>Media</div>} footer={<div>Footer</div>}>
				Body
			</Card>,
		);
		expect(screen.getByText("Media")).toBeInTheDocument();
		expect(screen.getByText("Footer")).toBeInTheDocument();
	});

	it("should be accessible via keyboard", () => {
		const onClick = jest.fn();
		render(<Card onClick={onClick}>Click Me</Card>);
		const card = screen.getByText("Click Me");
		card.focus();
		fireEvent.keyUp(card, { key: "Enter", code: "Enter" });
		expect(onClick).toHaveBeenCalledTimes(1);
		fireEvent.keyUp(card, { key: " ", code: "Space" });
		expect(onClick).toHaveBeenCalledTimes(2);
	});
});
