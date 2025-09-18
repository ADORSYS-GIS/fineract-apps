import { fireEvent, render, screen } from "@testing-library/react";
import { MenuItem } from "./Sidebar.types";
import { SidebarView } from "./Sidebar.view";

const menuItems: MenuItem[] = [
	{ name: "Home", link: "/home", icon: undefined },
	{ name: "Profile", link: "/profile", icon: undefined },
];

describe("SidebarView", () => {
	it("should render the logo", () => {
		const onLogout = jest.fn();
		render(<SidebarView menuItems={menuItems} onLogout={onLogout} />);
		expect(screen.getByText("OnlineBank")).toBeInTheDocument();
	});

	it("should render menu items", () => {
		const onLogout = jest.fn();
		render(<SidebarView menuItems={menuItems} onLogout={onLogout} />);
		expect(screen.getByText("Home")).toBeInTheDocument();
		expect(screen.getByText("Profile")).toBeInTheDocument();
	});

	it("should render the logout button and trigger click", () => {
		const onLogout = jest.fn();
		render(<SidebarView menuItems={menuItems} onLogout={onLogout} />);
		const logoutBtn = screen.getByText("Logout");
		expect(logoutBtn).toBeInTheDocument();
		fireEvent.click(logoutBtn);
		expect(onLogout).toHaveBeenCalled();
	});
});
