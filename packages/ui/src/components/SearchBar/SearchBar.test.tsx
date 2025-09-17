import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "./index";
import { Suggestion } from "./SearchBar.types";

const mockSuggestions: Suggestion[] = [
	{ id: "1", label: "First Item" },
	{ id: "2", label: "Second Item" },
	{ id: "3", label: "Third Item" },
];

describe("SearchBar", () => {
	it("renders correctly with default props", () => {
		render(<SearchBar />);
		const input = screen.getByRole("combobox");
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute("placeholder", "Search");
	});

	it("handles user input and search callback", async () => {
		const handleSearch = jest.fn();
		render(<SearchBar onSearch={handleSearch} />);

		const input = screen.getByRole("combobox");
		await userEvent.type(input, "test");
		await userEvent.keyboard("{Enter}");

		expect(handleSearch).toHaveBeenCalledWith("test");
	});

	it("shows suggestions from prop and handles selection", async () => {
		const handleSuggestionSelect = jest.fn();
		render(
			<SearchBar
				suggestions={mockSuggestions}
				onSuggestionSelect={handleSuggestionSelect}
			/>,
		);

		// Type to trigger suggestions
		const input = screen.getByRole("combobox");
		await userEvent.type(input, "item");

		// Check if suggestions are shown
		const listbox = screen.getByRole("listbox");
		expect(listbox).toBeInTheDocument();

		// Check all suggestions are rendered
		const options = screen.getAllByRole("option");
		expect(options).toHaveLength(3);

		// Select the first suggestion
		await userEvent.click(options[0]);

		// Check if selection callback was called
		expect(handleSuggestionSelect).toHaveBeenCalledWith(mockSuggestions[0]);
	});

	it("handles async suggestions", async () => {
		const mockProvider = jest.fn().mockResolvedValue(mockSuggestions);
		render(<SearchBar suggestionProvider={mockProvider} />);

		const input = screen.getByRole("combobox");
		await userEvent.type(input, "test");

		// Wait for suggestions to load
		await waitFor(() => {
			expect(mockProvider).toHaveBeenCalledWith(
				"test",
				expect.any(AbortSignal),
			);
		});
	});

	it("shows loading state while fetching suggestions", async () => {
		const mockProvider = jest.fn().mockImplementation(
			() =>
				new Promise((resolve) => {
					setTimeout(() => resolve(mockSuggestions), 100);
				}),
		);

		render(<SearchBar suggestionProvider={mockProvider} />);

		const input = screen.getByRole("combobox");
		await userEvent.type(input, "test");

		// Check for loading indicator
		expect(screen.getByRole("status")).toBeInTheDocument();

		// Wait for suggestions to load
		await waitFor(() => {
			expect(screen.getAllByRole("option")).toHaveLength(3);
		});
	});

	it("handles keyboard navigation in suggestions", async () => {
		render(<SearchBar suggestions={mockSuggestions} />);

		const input = screen.getByRole("combobox");
		await userEvent.type(input, "item");

		// Press arrow down to highlight first option
		await userEvent.keyboard("{ArrowDown}");
		const options = screen.getAllByRole("option");
		expect(options[0]).toHaveAttribute("aria-selected", "true");

		// Press arrow down again to highlight second option
		await userEvent.keyboard("{ArrowDown}");
		expect(options[1]).toHaveAttribute("aria-selected", "true");
	});

	it("clears input when clear button is clicked", async () => {
		const handleClear = jest.fn();
		render(<SearchBar showClear onClear={handleClear} />);

		const input = screen.getByRole("combobox");
		await userEvent.type(input, "test");

		const clearButton = screen.getByLabelText("clear search");
		await userEvent.click(clearButton);

		expect(handleClear).toHaveBeenCalled();
	});
});
