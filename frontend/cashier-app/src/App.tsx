import { menuCashier, Sidebar } from "@fineract-apps/ui"; // Use cashier menu

function App() {
	const handleLogout = () => alert("Logout clicked!"); // Logout handler

	return (
		<div style={{ display: "flex", height: "100vh" }}>
			{/* Sidebar with dynamic menu */}
			<Sidebar menuItems={menuCashier} onLogout={handleLogout} />
		</div>
	);
}

export default App;
