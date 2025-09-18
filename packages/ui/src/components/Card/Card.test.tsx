import { fireEvent, render, screen } from "@testing-library/react";
import { Card } from "./index";
import "@testing-library/jest-dom";
import { type ClassValue } from "clsx";

// Mock the cn utility function directly to avoid path alias issues in CI
jest.mock("@/lib/utils", () => ({
	cn: (...args: ClassValue[]) => args.filter(Boolean).join(" "),
}));

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
		expect(container.firstChild).toHaveClass("custom-class");
	});

	test("calls onClick when card is clicked", () => {
		const handleClick = jest.fn();
		render(
			<Card title="Test Card" onClick={handleClick}>
				Test Content
			</Card>,
		);
		fireEvent.click(screen.getByText("Test Card").closest("div")!);
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

	test("applies hover effect when hoverable is true", () => {
		const { container } = render(
			<Card title="Test Card" hoverable>
				Test Content
			</Card>,
		);
		expect(container.firstChild).toHaveClass("cursor-pointer");
		expect(container.firstChild).toHaveClass("hover:shadow-lg");
	});

	test("applies loading state when loading is true", () => {
		const { container } = render(
			<Card title="Test Card" loading>
				Test Content
			</Card>,
		);
		expect(container.firstChild).toHaveClass("opacity-50");
		expect(container.firstChild).toHaveClass("animate-pulse");
	});

	test("renders footer when provided", () => {
		render(
			<Card
				title="Test Card"
				footer={<div data-testid="test-footer">Footer</div>}
			>
				Test Content
			</Card>,
		);
		expect(screen.getByTestId("test-footer")).toBeInTheDocument();
	});
});
