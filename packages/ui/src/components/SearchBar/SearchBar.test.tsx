import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SearchBar } from "./SearchBar";

// Mock icons
jest.mock("lucide-react", () => ({
	Search: () => <span data-testid="search-icon">Search</span>,
	X: () => <span data-testid="clear-icon">X</span>,
	Loader2: () => <span data-testid="loader-icon">Loading</span>,
}));

describe("SearchBar - Final Clean Version", () => {
	it("renders basic search bar", () => {
		render(<SearchBar placeholder="Search items..." />);

		expect(screen.getByPlaceholderText("Search items...")).toBeInTheDocument();
		expect(screen.getByTestId("search-icon")).toBeInTheDocument();
	});

	it("handles input and calls onValueChange", () => {
		const onValueChange = jest.fn();
		render(<SearchBar onValueChange={onValueChange} />);

		const input = screen.getByRole("combobox");
		fireEvent.change(input, { target: { value: "test" } });

		expect(input).toHaveValue("test");
		expect(onValueChange).toHaveBeenCalledWith("test");
	});

	it("shows suggestions from props", async () => {
		const suggestions = [
			{ id: "1", label: "Apple" },
			{ id: "2", label: "Application" },
		];

		render(<SearchBar suggestions={suggestions} />);

		const input = screen.getByRole("combobox");
		fireEvent.change(input, { target: { value: "app" } });

		await waitFor(() => {
			expect(screen.getByText("Apple")).toBeInTheDocument();
			expect(screen.getByText("Application")).toBeInTheDocument();
		});
	});

	it("calls onSearch when search button clicked", () => {
		const onSearch = jest.fn();
		render(<SearchBar onSearch={onSearch} value="test query" />);

		const searchButton = screen.getByRole("button", { name: /search/i });
		fireEvent.click(searchButton);

		expect(onSearch).toHaveBeenCalledWith("test query");
	});

	it("handles async suggestions", async () => {
		const mockProvider = jest
			.fn()
			.mockResolvedValue([{ id: "1", label: "Async Result" }]);

		render(<SearchBar suggestionProvider={mockProvider} />);

		const input = screen.getByRole("combobox");
		fireEvent.change(input, { target: { value: "test" } });

		await waitFor(() => {
			expect(mockProvider).toHaveBeenCalledWith(
				"test",
				expect.any(AbortSignal),
			);
		});

		await waitFor(() => {
			expect(screen.getByText("Async Result")).toBeInTheDocument();
		});
	});

	it("shows clear button and clears input", () => {
		const onValueChange = jest.fn();
		render(<SearchBar value="test" onValueChange={onValueChange} />);

		const clearButton = screen.getByTestId("clear-icon").closest("button");
		expect(clearButton).toBeInTheDocument();

		fireEvent.click(clearButton!);
		expect(onValueChange).toHaveBeenCalledWith("");
	});

	it("shows loading state", () => {
		render(<SearchBar isLoading={true} />);
		expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
	});

	it("handles suggestion selection", async () => {
		const onSuggestionSelect = jest.fn();
		const suggestions = [{ id: "1", label: "Test Item" }];

		render(
			<SearchBar
				suggestions={suggestions}
				onSuggestionSelect={onSuggestionSelect}
			/>,
		);

		const input = screen.getByRole("combobox");
		fireEvent.change(input, { target: { value: "test" } });

		await waitFor(() => {
			const suggestion = screen.getByText("Test Item");
			fireEvent.click(suggestion);
			expect(onSuggestionSelect).toHaveBeenCalledWith({
				id: "1",
				label: "Test Item",
			});
		});
	});
});
