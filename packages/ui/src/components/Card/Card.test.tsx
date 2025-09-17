import { fireEvent, render, screen } from "@testing-library/react";
import { Card } from "./index";

describe("Card", () => {
	test("renders card with title and content", () => {
		render(<Card title="Test Card">Test Content</Card>);

		expect(screen.getByText("Test Card")).toBeInTheDocument();
		expect(screen.getByText("Test Content")).toBeInTheDocument();
	});

	test("applies custom class names", () => {
		const { container } = render(
			<Card title="Test Card" className="custom-class">
				Test Content
			</Card>,
		);

		const card = container.firstChild;
		expect(card).toHaveClass("custom-class");
	});

	test("calls onClick when card is clicked", () => {
		const handleClick = jest.fn();
		const { container } = render(
			<Card title="Test Card" onClick={handleClick}>
				Test Content
			</Card>,
		);

		const card = container.firstChild;
		fireEvent.click(card!);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	test("renders media when provided", () => {
		const mediaContent = <div data-testid="test-media">Media</div>;
		render(
			<Card title="Test Card" media={mediaContent}>
				Test Content
			</Card>,
		);

		expect(screen.getByTestId("test-media")).toBeInTheDocument();
	});

	test("applies background class when provided", () => {
		const { container } = render(
			<Card title="Test Card" background="bg-blue-100">
				Test Content
			</Card>,
		);

		const card = container.firstChild;
		expect(card).toHaveClass("bg-blue-100");
	});

	test("applies hover effect when hoverable is true", () => {
		const { container } = render(
			<Card title="Test Card" hoverable>
				Test Content
			</Card>,
		);

		const card = container.firstChild;
		expect(card).toHaveClass("hover:shadow-md");
		expect(card).toHaveClass("cursor-pointer");
	});

	test("applies loading state when loading is true", () => {
		const { container } = render(
			<Card title="Test Card" loading>
				Test Content
			</Card>,
		);

		const card = container.firstChild;
		expect(card).toHaveClass("opacity-50");
		expect(card).toHaveClass("animate-pulse");
	});
});
