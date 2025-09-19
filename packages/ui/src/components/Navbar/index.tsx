import React from "react";
import { NavbarProps } from "./Navbar.types";
import { NavbarView } from "./Navbar.view";

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
	({ ...props }, ref) => {
		return <NavbarView {...props} ref={ref} />;
	},
);

Navbar.displayName = "Navbar";
