import { Sidebar, menuAccountManager } from "@fineract-apps/ui";

function App() {
  const handleLogout = () => alert("Logout clicked!");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar with dynamic menu */}
      <Sidebar menuItems={menuAccountManager} onLogout={handleLogout} />
    </div>
  );
}

export default App;
