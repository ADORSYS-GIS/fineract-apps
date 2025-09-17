// /frontend/shared/src/components/ui/Navbar/index.tsx

import { NavbarProps } from "./Navbar.types";
import { NavbarView } from "./Navbar.view";
import { useNavbar } from "./useNavbar";

export const Navbar = (props: NavbarProps) => {
	const { isMenuOpen, toggleMenu } = useNavbar();

	return (
		<NavbarView {...props} isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />
	);
};
