import { Button, SearchBar } from "@fineract-apps/ui";
import { useState } from "react";
import "@fineract-apps/ui/styles.css";

const mockSuggestions = [
	{ id: "1", label: "John Doe - #123456" },
	{ id: "2", label: "Jane Smith - #789012" },
	{ id: "3", label: "Bob Wilson - #345678" },
];

function App() {
	const [loading, setLoading] = useState(false);

	const handleSearch = async (value: string) => {
		console.log("Searching for:", value);
	};

	const mockSuggestionProvider = async (q: string) => {
		setLoading(true);
		try {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 500));
			return mockSuggestions.filter((s) =>
				s.label.toLowerCase().includes(q.toLowerCase()),
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ padding: "20px" }}>
			<h1>Account Manager App</h1>

			<h2 className="mt-8 mb-4 text-lg font-semibold">Default SearchBar</h2>
			<div style={{ maxWidth: 420 }}>
				<SearchBar
					placeholder="Search accounts"
					onSearch={handleSearch}
					suggestionProvider={mockSuggestionProvider}
					isLoading={loading}
				/>
			</div>

			<h2 className="mt-8 mb-4 text-lg font-semibold">Simple Usage</h2>
			<div style={{ maxWidth: 320 }}>
				<SearchBar
					size="sm"
					placeholder="Quick search"
					onSearch={handleSearch}
				/>
			</div>

			<h2 className="mt-8 mb-4 text-lg font-semibold">With Search Button</h2>
			<div style={{ maxWidth: 420 }}>
				<SearchBar
					variant="withButton"
					placeholder="Search with button"
					onSearch={handleSearch}
				/>
			</div>

			<h2 className="mt-8 mb-4 text-lg font-semibold">Static Suggestions</h2>
			<div style={{ maxWidth: 420 }}>
				<SearchBar
					placeholder="Search from list"
					suggestions={mockSuggestions}
					onSearch={handleSearch}
					onSuggestionSelect={(suggestion) =>
						console.log("Selected:", suggestion)
					}
				/>
			</div>

			<Button>Click me!</Button>
		</div>
	);
}

export default App;
