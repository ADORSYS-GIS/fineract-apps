// /frontend/shared/src/components/ui/Navbar/useNavbar.ts
import { useState } from "react";

export const useNavbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => setIsMenuOpen((prev) => !prev);

	return { isMenuOpen, toggleMenu };
};
