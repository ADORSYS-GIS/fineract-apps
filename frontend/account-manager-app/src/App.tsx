import "@fineract-apps/ui/styles.css";
import { Button, SearchBar } from "@fineract-apps/ui";
import { useState } from "react";

function App() {
	const [searchValue, setSearchValue] = useState("");

	return (
		<div style={{ padding: "20px" }}>
			<h1>Account Manager App</h1>
			<p>
				This button is a shared component from the '@fineract-apps/ui' package.
			</p>
			<SearchBar
				value={searchValue}
				onValueChange={setSearchValue}
				placeholder="Search transactions..."
				variant="withButton"
			/>
			<Button>Click me!</Button>
			<Button>Click me!</Button>

			<Button>Click me!</Button>

			<Button>Click me!</Button>

			<Button className="bg-red-500">Click me!</Button>
		</div>
	);
}

export default App;
