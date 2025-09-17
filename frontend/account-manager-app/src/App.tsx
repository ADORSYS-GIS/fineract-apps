import "@fineract-apps/ui/styles.css";
import { Button, Card, Navbar } from "@fineract-apps/ui";
import { useState } from "react";

function App() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleToggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

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
			<Navbar
				userName="John Doe"
				userId="12345"
				onLogout={() => alert("Logged out")}
				onToggleMenu={handleToggleMenu}
				isMenuOpen={isMenuOpen}
			/>
			<Card title="Sample Card" className="mt-4 p-4">
				This is a sample card component from the '@fineract-apps/ui' package.
			</Card>
			<Card
				title="Card with Media"
				media={<img src="https://via.placeholder.com/150" alt="Placeholder" />}
				className="mt-4 p-4"
			>
				This card has media content.
			</Card>
			<Card
				title="Clickable Card"
				onClick={() => alert("Card clicked!")}
				className="mt-4 p-4"
			>
				Clicking this card will trigger an alert.
			</Card>
		</div>
	);
}

export default App;
