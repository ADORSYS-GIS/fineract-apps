import { fireEvent, render, screen } from "@testing-library/react";
import { MenuItem } from "./Sidebar.types";
import { SidebarView } from "./Sidebar.view";
import "@testing-library/jest-dom";

const menuItems: MenuItem[] = [
	{ name: "Home", link: "/home" },
	{ name: "Profile", link: "/profile" },
];

describe("SidebarView", () => {
	const activeLink = "/home";
	const handleClick = jest.fn();
	const onLogout = jest.fn();

	it("renders the logo", () => {
		render(
			<SidebarView
				logo="OnlineBank"
				menuItems={menuItems}
				onLogout={onLogout}
				activeLink={activeLink}
				handleClick={handleClick}
			/>,
		);
		expect(screen.getByText("OnlineBank")).toBeInTheDocument();
	});

	it("renders menu items", () => {
		render(
			<SidebarView
				menuItems={menuItems}
				onLogout={onLogout}
				activeLink={activeLink}
				handleClick={handleClick}
			/>,
		);
		expect(screen.getByText("Home")).toBeInTheDocument();
		expect(screen.getByText("Profile")).toBeInTheDocument();
	});

	it("renders the logout button and triggers click", () => {
		render(
			<SidebarView
				menuItems={menuItems}
				onLogout={onLogout}
				activeLink={activeLink}
				handleClick={handleClick}
			/>,
		);
		fireEvent.click(screen.getByText("Logout"));
		expect(onLogout).toHaveBeenCalled();
	});
});
