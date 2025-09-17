// /frontend/shared/src/components/ui/Card/Card.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { Card } from "./index";

test("renders card content", () => {
	render(<Card title="Test Card">Test Content</Card>);
	expect(screen.getByText("Test Card")).toBeDefined();
	expect(screen.getByText("Test Content")).toBeDefined();
});
test("handles collapsible", () => {
	render(
		<Card title="Test Card" collapsible>
			Test Content
		</Card>,
	);
	fireEvent.click(screen.getByText("-"));
	expect(screen.queryByText("Test Content")).not.toBeDefined();
	fireEvent.click(screen.getByText("+"));
	expect(screen.getByText("Test Content")).toBeDefined();
});
