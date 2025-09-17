import "@fineract-apps/ui/styles.css";
import { Button } from "@fineract-apps/ui";

function App() {
	return (
		<div style={{ padding: "20px" }}>
			<h1>Account Manager App</h1>
			<p>
				This button is a shared component from the '@fineract-apps/ui' package.
			</p>
			<Button>Click me!</Button>
			<Button>Click me!</Button>

			<Button>Click me!</Button>

			<Button>Click me!</Button>

			<Button className="bg-red-500">Click me!</Button>
			
		</div>
	);
}

export default App;
