import { render, screen } from "@testing-library/react";
import { Sidebar } from "./";
import "@testing-library/jest-dom";
import { Home, CreditCard } from "lucide-react";

// Mock menu for testing
const mockMenu = [
  { name: "Dashboard", link: "/dashboard", icon: Home },
  { name: "Accounts", link: "/accounts", icon: CreditCard },
];

describe("Sidebar", () => {
  it("should render the logo", () => {
    render(<Sidebar menuItems={mockMenu} />);
    expect(screen.getByText("OnlineBank")).toBeInTheDocument();
  });

  it("should render menu items", () => {
    render(<Sidebar menuItems={mockMenu} />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Accounts")).toBeInTheDocument();
  });

  it("should render the logout button", () => {
    render(<Sidebar menuItems={mockMenu} onLogout={() => {}} />);
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });
});
