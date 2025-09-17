// import { fireEvent, render, screen } from "@testing-library/react";
// import { Navbar } from "./index";

// describe("Navbar", () => {
// 	test("renders user info", () => {
// 		render(
// 			<Navbar
// 				userSection={<div>userSection</div>}
// 				actions={<div>actions</div>}
// 				notifications={<div>notifications</div>}
// 				isMenuOpen={false}
// 				onToggleMenu={jest.fn()}
// 			/>,
// 		);
// 		expect(screen.getByText("Jane Doe")).toBeInTheDocument();
// 		expect(screen.getByText("ID: 12345")).toBeInTheDocument();
// 	});

// 	test("handles logout click", () => {
// 		const handleLogout = jest.fn();
// 		render(
// 			<Navbar
// 				userSection={<div>userSection</div>}
// 				actions={<div>actions</div>}
// 				notifications={<div>notifications</div>}
// 				isMenuOpen={false}
// 				onToggleMenu={jest.fn()}
// 			/>,
// 		);
// 		fireEvent.click(screen.getByRole("button", { name: /logout/i }));
// 		expect(handleLogout).toHaveBeenCalled();
// 	});
// });
