import { Button } from "@fineract-apps/ui";
function App() {
	return (
		<div style={{ padding: "20px" }}>
			<h1>Account Manager App</h1>
			<p>This button is a shared component from the '@repo/ui' package.</p>
			<Button>test</Button>
			<Button className="bg-red-500">test</Button>
		</div>
	);
}

export default App;
