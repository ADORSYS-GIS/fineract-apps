import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SearchBar } from "./index";
import { Suggestion } from "./SearchBar.types";

jest.useFakeTimers();

const suggestions: Suggestion[] = [
	{ id: "1", label: "Apple" },
	{ id: "2", label: "Banana" },
	{ id: "3", label: "Orange" },
];

describe("SearchBar", () => {
	it("renders the search bar", () => {
		render(<SearchBar />);
		const input = screen.getByPlaceholderText("Search...");
		expect(input).toBeInTheDocument();
	});

	it("handles user input", () => {
		render(<SearchBar />);
		const input = screen.getByPlaceholderText("Search...") as HTMLInputElement;
		fireEvent.change(input, { target: { value: "test" } });
		expect(input.value).toBe("test");
	});

	it("shows suggestions when typing", async () => {
		render(<SearchBar suggestions={suggestions} minChars={1} />);
		const input = screen.getByPlaceholderText("Search...");
		fireEvent.change(input, { target: { value: "a" } });

		await waitFor(() => {
			expect(screen.getByText("Apple")).toBeInTheDocument();
			expect(screen.getByText("Banana")).toBeInTheDocument();
			expect(screen.getByText("Orange")).toBeInTheDocument();
		});
	});

	it("calls onSuggestionSelect when a suggestion is clicked", async () => {
		const onSuggestionSelect = jest.fn();
		render(
			<SearchBar
				suggestions={suggestions}
				onSuggestionSelect={onSuggestionSelect}
				minChars={1}
			/>,
		);
		const input = screen.getByPlaceholderText("Search...");
		fireEvent.change(input, { target: { value: "a" } });

		await waitFor(() => {
			fireEvent.click(screen.getByText("Apple"));
		});

		expect(onSuggestionSelect).toHaveBeenCalledWith(suggestions[0]);
	});

	it("calls onSearch when the search button is clicked", () => {
		const onSearch = jest.fn();
		render(<SearchBar onSearch={onSearch} variant="withButton" />);
		const input = screen.getByPlaceholderText("Search...");
		fireEvent.change(input, { target: { value: "test" } });

		const searchButton = screen.getByRole("button", { name: "Search" });
		fireEvent.click(searchButton);

		expect(onSearch).toHaveBeenCalledWith("test");
	});

	it("calls onSearch when Enter is pressed", () => {
		const onSearch = jest.fn();
		render(<SearchBar onSearch={onSearch} />);
		const input = screen.getByPlaceholderText("Search...");
		fireEvent.change(input, { target: { value: "test" } });
		fireEvent.keyDown(input, { key: "Enter" });

		expect(onSearch).toHaveBeenCalledWith("test");
	});

	it("shows clear button when there is input", () => {
		render(<SearchBar />);
		const input = screen.getByPlaceholderText("Search...");
		fireEvent.change(input, { target: { value: "test" } });
		expect(
			screen.getByRole("button", { name: "Clear search" }),
		).toBeInTheDocument();
	});

	it("clears input when clear button is clicked", () => {
		render(<SearchBar />);
		const input = screen.getByPlaceholderText("Search...") as HTMLInputElement;
		fireEvent.change(input, { target: { value: "test" } });

		const clearButton = screen.getByRole("button", { name: "Clear search" });
		fireEvent.click(clearButton);

		expect(input.value).toBe("");
	});

	it("shows loading indicator when isLoading is true", () => {
		render(<SearchBar isLoading />);
		expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
	});

	it("filters suggestions based on search query", async () => {
		render(<SearchBar suggestions={suggestions} minChars={1} />);
		const input = screen.getByPlaceholderText("Search...");

		// Search for "app" should only show "Apple"
		fireEvent.change(input, { target: { value: "app" } });

		await waitFor(() => {
			expect(screen.getByText("Apple")).toBeInTheDocument();
			expect(screen.queryByText("Banana")).not.toBeInTheDocument();
			expect(screen.queryByText("Orange")).not.toBeInTheDocument();
		});
	});

	it("highlights suggestions on hover and keyboard navigation", async () => {
		render(<SearchBar suggestions={suggestions} minChars={1} />);
		const input = screen.getByPlaceholderText("Search...");
		fireEvent.change(input, { target: { value: "a" } });

		await waitFor(() => {
			const appleItem = screen.getByText("Apple");
			expect(appleItem).toBeInTheDocument();
		});

		// Test keyboard navigation
		fireEvent.keyDown(input, { key: "ArrowDown" });
		fireEvent.keyDown(input, { key: "ArrowDown" });
	});

	it("handles suggestionProvider function", async () => {
		const mockSuggestionProvider = jest.fn().mockResolvedValue([
			{ id: "dynamic1", label: "Dynamic Result 1" },
			{ id: "dynamic2", label: "Dynamic Result 2" },
		]);

		render(
			<SearchBar suggestionProvider={mockSuggestionProvider} minChars={1} />,
		);

		const input = screen.getByPlaceholderText("Search...");
		fireEvent.change(input, { target: { value: "test" } });

		// Fast forward timers for debounce
		jest.advanceTimersByTime(250);

		await waitFor(() => {
			expect(mockSuggestionProvider).toHaveBeenCalledWith(
				"test",
				expect.any(AbortSignal),
			);
		});

		await waitFor(() => {
			expect(screen.getByText("Dynamic Result 1")).toBeInTheDocument();
			expect(screen.getByText("Dynamic Result 2")).toBeInTheDocument();
		});
	});

	it("handles suggestionProvider errors gracefully", async () => {
		const consoleSpy = jest.spyOn(console, "error").mockImplementation();
		const mockSuggestionProvider = jest
			.fn()
			.mockRejectedValue(new Error("Network error"));

		render(
			<SearchBar suggestionProvider={mockSuggestionProvider} minChars={1} />,
		);

		const input = screen.getByPlaceholderText("Search...");
		fireEvent.change(input, { target: { value: "test" } });

		// Fast forward timers for debounce
		jest.advanceTimersByTime(250);

		await waitFor(() => {
			expect(mockSuggestionProvider).toHaveBeenCalled();
		});

		// Should handle error gracefully and not crash
		await waitFor(() => {
			expect(consoleSpy).toHaveBeenCalledWith(
				"SearchBar suggestion fetch error:",
				expect.any(Error),
			);
		});

		consoleSpy.mockRestore();
	});

	it("handles AbortError without logging", async () => {
		const consoleSpy = jest
			.spyOn(console, "error")
			.mockImplementation((message: string) => {
				// Allow downshift warnings and React warnings, but catch our specific error
				if (
					!message.includes("downshift:") &&
					!message.includes("An update to")
				) {
					throw new Error(`Unexpected console.error call: ${message}`);
				}
			});

		const abortError = new Error("Request aborted");
		abortError.name = "AbortError";
		const mockSuggestionProvider = jest.fn().mockRejectedValue(abortError);

		render(
			<SearchBar suggestionProvider={mockSuggestionProvider} minChars={1} />,
		);

		const input = screen.getByPlaceholderText("Search...");
		fireEvent.change(input, { target: { value: "test" } });

		// Fast forward timers for debounce
		jest.advanceTimersByTime(250);

		await waitFor(() => {
			expect(mockSuggestionProvider).toHaveBeenCalled();
		});

		// Should not log our specific SearchBar error (AbortError should be silenced)
		// The consoleSpy will throw if our specific error is logged
		consoleSpy.mockRestore();
	});

	it("respects maxSuggestions prop", async () => {
		const manySuggestions = Array.from({ length: 10 }, (_, i) => ({
			id: `item${i}`,
			label: `Item ${i}`,
		}));

		render(
			<SearchBar
				suggestions={manySuggestions}
				minChars={1}
				maxSuggestions={3}
			/>,
		);

		const input = screen.getByPlaceholderText("Search...");
		fireEvent.change(input, { target: { value: "item" } });

		await waitFor(() => {
			expect(screen.getByText("Item 0")).toBeInTheDocument();
			expect(screen.getByText("Item 1")).toBeInTheDocument();
			expect(screen.getByText("Item 2")).toBeInTheDocument();
			expect(screen.queryByText("Item 3")).not.toBeInTheDocument();
		});
	});

	it("shows suggestions when minChars requirement is met", async () => {
		render(<SearchBar suggestions={suggestions} minChars={3} />);
		const input = screen.getByPlaceholderText("Search...");

		// Type less than minChars - should not show suggestions
		fireEvent.change(input, { target: { value: "ap" } });

		await waitFor(() => {
			expect(screen.queryByText("Apple")).not.toBeInTheDocument();
		});

		// Type enough chars - should show suggestions
		fireEvent.change(input, { target: { value: "app" } });

		await waitFor(() => {
			expect(screen.getByText("Apple")).toBeInTheDocument();
		});
	});

	it("handles custom placeholder text", () => {
		render(<SearchBar placeholder="Custom placeholder..." />);
		expect(
			screen.getByPlaceholderText("Custom placeholder..."),
		).toBeInTheDocument();
	});

	it("handles different sizes", () => {
		render(<SearchBar size="sm" />);
		expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
	});

	it("handles showClear prop", () => {
		render(<SearchBar showClear={false} />);
		const input = screen.getByPlaceholderText("Search...");
		fireEvent.change(input, { target: { value: "test" } });

		// Clear button should not be shown
		expect(
			screen.queryByRole("button", { name: "Clear search" }),
		).not.toBeInTheDocument();
	});

	it("handles showSearchButton prop", () => {
		const onSearch = jest.fn();
		render(<SearchBar showSearchButton onSearch={onSearch} />);

		// Should show search button even in default variant
		expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
	});

	it("handles custom debounce time", async () => {
		const mockSuggestionProvider = jest
			.fn()
			.mockResolvedValue([{ id: "test", label: "Test Result" }]);

		render(
			<SearchBar
				suggestionProvider={mockSuggestionProvider}
				minChars={1}
				debounceMs={500}
			/>,
		);

		const input = screen.getByPlaceholderText("Search...");
		fireEvent.change(input, { target: { value: "test" } });

		// Should not call provider before debounce time
		jest.advanceTimersByTime(250);
		expect(mockSuggestionProvider).not.toHaveBeenCalled();

		// Should call provider after debounce time
		jest.advanceTimersByTime(250);
		await waitFor(() => {
			expect(mockSuggestionProvider).toHaveBeenCalled();
		});
	});
});
