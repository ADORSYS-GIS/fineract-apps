import { render, screen } from "@testing-library/react";
import { AppLayout } from "./";
import "@testing-library/jest-dom";

describe("AppLayout", () => {
	it("should render the main content", () => {
		render(
			<AppLayout>
				<div>Main Content</div>
			</AppLayout>,
		);
		expect(screen.getByText("Main Content")).toBeInTheDocument();
	});

	it("should render the navbar when provided", () => {
		render(
			<AppLayout navbar={<div>Navbar</div>}>
				<div>Main Content</div>
			</AppLayout>,
		);
		expect(screen.getByText("Navbar")).toBeInTheDocument();
	});

	it("should render the sidebar when provided", () => {
		render(
			<AppLayout sidebar={<div>Sidebar</div>}>
				<div>Main Content</div>
			</AppLayout>,
		);
		expect(screen.getByText("Sidebar")).toBeInTheDocument();
	});

	it("should render all sections together", () => {
		render(
			<AppLayout navbar={<div>Navbar</div>} sidebar={<div>Sidebar</div>}>
				<div>Main Content</div>
			</AppLayout>,
		);
		expect(screen.getByText("Navbar")).toBeInTheDocument();
		expect(screen.getByText("Sidebar")).toBeInTheDocument();
		expect(screen.getByText("Main Content")).toBeInTheDocument();
	});
});
