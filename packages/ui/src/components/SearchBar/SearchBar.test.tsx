/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
	const mockOnValueChange = jest.fn();
	const mockOnSearch = jest.fn();

	const defaultProps = {
		onValueChange: mockOnValueChange,
		onSearch: mockOnSearch,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Basic Rendering", () => {
		it("renders with default props", () => {
			render(<SearchBar />);
			expect(screen.getByRole("textbox")).toBeInTheDocument();
			expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
		});

		it("renders with custom placeholder", () => {
			render(<SearchBar placeholder="Find items..." />);
			expect(screen.getByPlaceholderText("Find items...")).toBeInTheDocument();
		});

		it("applies custom className", () => {
			const { container } = render(<SearchBar className="custom-class" />);
			expect(container.firstChild).toHaveClass("custom-class");
		});

		it("renders disabled state", () => {
			render(<SearchBar disabled />);
			expect(screen.getByRole("textbox")).toBeDisabled();
		});
	});

	describe("Value Management", () => {
		it("displays controlled value", () => {
			render(<SearchBar value="test value" {...defaultProps} />);
			expect(screen.getByDisplayValue("test value")).toBeInTheDocument();
		});

		it("calls onValueChange when typing", async () => {
			const user = userEvent.setup();
			render(<SearchBar {...defaultProps} />);

			const input = screen.getByRole("textbox");
			await user.type(input, "hello");

			expect(mockOnValueChange).toHaveBeenCalledTimes(5); // Each character
			expect(mockOnValueChange).toHaveBeenNthCalledWith(1, "h");
			expect(mockOnValueChange).toHaveBeenNthCalledWith(2, "e");
			expect(mockOnValueChange).toHaveBeenNthCalledWith(3, "l");
			expect(mockOnValueChange).toHaveBeenNthCalledWith(4, "l");
			expect(mockOnValueChange).toHaveBeenNthCalledWith(5, "o");
		});

		it("handles empty initial value", () => {
			render(<SearchBar value="" {...defaultProps} />);
			expect(screen.getByRole("textbox")).toHaveValue("");
		});
	});

	describe("Search Functionality", () => {
		it("triggers onSearch when Enter is pressed", async () => {
			const user = userEvent.setup();
			render(<SearchBar value="search term" {...defaultProps} />);

			const input = screen.getByRole("textbox");
			await user.type(input, "{Enter}");

			expect(mockOnSearch).toHaveBeenCalledWith("search term");
		});

		it("does not trigger onSearch on other keys", async () => {
			const user = userEvent.setup();
			render(<SearchBar value="test" {...defaultProps} />);

			const input = screen.getByRole("textbox");
			await user.type(input, "{Space}{Tab}");

			expect(mockOnSearch).not.toHaveBeenCalled();
		});
	});

	describe("Clear Functionality", () => {
		it("shows clear button when showClear is true and has value", () => {
			render(<SearchBar value="test" showClear {...defaultProps} />);
			expect(screen.getByLabelText("Clear input")).toBeInTheDocument();
		});

		it("hides clear button when showClear is false", () => {
			render(<SearchBar value="test" showClear={false} {...defaultProps} />);
			expect(screen.queryByLabelText("Clear input")).not.toBeInTheDocument();
		});

		it("hides clear button when no value", () => {
			render(<SearchBar value="" showClear {...defaultProps} />);
			expect(screen.queryByLabelText("Clear input")).not.toBeInTheDocument();
		});

		it("clears input when clear button is clicked", async () => {
			const user = userEvent.setup();
			render(<SearchBar value="test" showClear {...defaultProps} />);

			const clearButton = screen.getByLabelText("Clear input");
			await user.click(clearButton);

			expect(mockOnValueChange).toHaveBeenCalledWith("");
		});
	});

	describe("Loading State", () => {
		it("shows loading spinner when isLoading is true", () => {
			render(<SearchBar isLoading {...defaultProps} />);
			// Look for the loading icon by class
			const loadingIcon = document.querySelector(".animate-spin");
			expect(loadingIcon).toBeInTheDocument();
		});

		it("hides loading spinner when isLoading is false", () => {
			render(<SearchBar isLoading={false} {...defaultProps} />);
			const loadingIcon = document.querySelector(".animate-spin");
			expect(loadingIcon).not.toBeInTheDocument();
		});
	});

	describe("Variants", () => {
		it("renders default variant", () => {
			const { container } = render(<SearchBar variant="default" />);
			expect(container.firstChild?.firstChild).toHaveClass(
				"flex items-center gap-2",
			);
		});

		it("renders withButton variant", () => {
			render(<SearchBar variant="withButton" {...defaultProps} />);
			expect(
				screen.getByRole("button", { name: /search/i }),
			).toBeInTheDocument();
		});

		it("triggers onSearch when search button is clicked", async () => {
			const user = userEvent.setup();
			render(
				<SearchBar
					variant="withButton"
					value="button search"
					{...defaultProps}
				/>,
			);

			const searchButton = screen.getByRole("button", { name: /search/i });
			await user.click(searchButton);

			expect(mockOnSearch).toHaveBeenCalledWith("button search");
		});

		it("renders expandable variant collapsed by default", () => {
			render(<SearchBar variant="expandable" />);
			expect(screen.getByLabelText("Open search")).toBeInTheDocument();
			expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
		});

		it("expands when expandable search button is clicked", async () => {
			const user = userEvent.setup();
			render(<SearchBar variant="expandable" {...defaultProps} />);

			const expandButton = screen.getByLabelText("Open search");
			await user.click(expandButton);

			expect(screen.getByRole("textbox")).toBeInTheDocument();
			expect(screen.queryByLabelText("Open search")).not.toBeInTheDocument();
		});

		it("collapses expandable on Enter key", async () => {
			const user = userEvent.setup();
			render(<SearchBar variant="expandable" {...defaultProps} />);

			// First expand
			await user.click(screen.getByLabelText("Open search"));
			expect(screen.getByRole("textbox")).toBeInTheDocument();

			// Then press Enter
			await user.type(screen.getByRole("textbox"), "{Enter}");

			// Should be collapsed again
			await waitFor(() => {
				expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
				expect(screen.getByLabelText("Open search")).toBeInTheDocument();
			});
		});

		it("collapses expandable on Escape key", async () => {
			const user = userEvent.setup();
			render(<SearchBar variant="expandable" {...defaultProps} />);

			// First expand
			await user.click(screen.getByLabelText("Open search"));
			expect(screen.getByRole("textbox")).toBeInTheDocument();

			// Then press Escape
			await user.type(screen.getByRole("textbox"), "{Escape}");

			// Should be collapsed
			await waitFor(() => {
				expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
				expect(screen.getByLabelText("Open search")).toBeInTheDocument();
			});
		});
	});

	describe("Size Variants", () => {
		it("applies small size class", () => {
			const { container } = render(<SearchBar size="sm" />);
			expect(container.querySelector(".h-8")).toBeInTheDocument();
		});

		it("applies medium size class (default)", () => {
			const { container } = render(<SearchBar size="md" />);
			expect(container.querySelector(".h-10")).toBeInTheDocument();
		});

		it("applies large size class", () => {
			const { container } = render(<SearchBar size="lg" />);
			expect(container.querySelector(".h-11")).toBeInTheDocument();
		});
	});

	describe("Accessibility", () => {
		it("has proper ARIA attributes", () => {
			render(<SearchBar />);
			const input = screen.getByRole("textbox");
			expect(input).toBeInTheDocument();
		});

		it("has accessible button labels", () => {
			render(<SearchBar value="test" showClear variant="withButton" />);
			expect(screen.getByLabelText("Clear input")).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: /search/i }),
			).toBeInTheDocument();
		});

		it("has accessible expandable button", () => {
			render(<SearchBar variant="expandable" />);
			expect(screen.getByLabelText("Open search")).toBeInTheDocument();
		});
	});
});
