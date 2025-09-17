// index.tsx
import { NavbarView } from "./Navbar.view";
import { useNavbar } from "./useNavbar";
import { NavbarProps } from "./Navbar.types";

export const Navbar = (props: NavbarProps) => {
  const { isMenuOpen, toggleMenu } = useNavbar(props);
  return (
    <NavbarView {...props} isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />
  );
};
