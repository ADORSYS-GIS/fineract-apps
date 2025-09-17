// index.tsx

import { NavbarProps } from "./Navbar.types";
import { NavbarView } from "./Navbar.view";
import { useNavbar } from "./useNavbar";

export const Navbar = (props: NavbarProps) => {
	const { isMenuOpen, toggleMenu } = useNavbar(props);
	return (
		<NavbarView {...props} isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />
	);
};
