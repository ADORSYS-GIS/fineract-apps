import { menuBranchManager, Sidebar } from "@fineract-apps/ui"; // Use branch manager menu

function App() {
	const handleLogout = () => alert("Logout clicked!"); // Logout handler

	return (
		<div style={{ display: "flex", height: "100vh" }}>
			{/* Sidebar with dynamic menu */}
			<Sidebar menuItems={menuBranchManager} onLogout={handleLogout} />
		</div>
	);
}

export default App;
