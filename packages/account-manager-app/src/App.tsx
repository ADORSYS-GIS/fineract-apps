import { Button } from "@repo/ui/button";

function App() {
	return (
		<div style={{ padding: "20px" }}>
			<h1>Account Manager App</h1>
			<p>This button is a shared component from the '@repo/ui' package.</p>
			<Button onClick={() => alert("Button clicked!")}>Shared Button</Button>
		</div>
	);
}

export default App;
