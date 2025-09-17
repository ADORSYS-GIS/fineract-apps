// useNavbar.ts
import { useCallback, useState } from "react";
import { NavbarProps } from "./Navbar.types";

export const useNavbar = (
	props?: Pick<NavbarProps, "isMenuOpen" | "onToggleMenu">,
) => {
	const isControlled = props?.isMenuOpen !== undefined;
	const [internalOpen, setInternalOpen] = useState(false);
	const effectiveOpen = isControlled ? !!props?.isMenuOpen : internalOpen;

	const toggleMenu = useCallback(() => {
		if (isControlled) props?.onToggleMenu?.();
		else setInternalOpen((prev) => !prev);
	}, [isControlled, props]);

	return { isMenuOpen: effectiveOpen, toggleMenu };
};
