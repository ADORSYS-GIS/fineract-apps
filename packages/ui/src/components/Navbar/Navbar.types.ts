// /frontend/shared/src/components/ui/Navbar/Navbar.types.ts
import { ReactNode } from "react";

export interface NavbarProps {
	logo?: ReactNode;
	userName: string;
	userId: string;
	onLogout: () => void;
	onToggleMenu?: () => void;
	isMenuOpen?: boolean;
	notifications?: number | ReactNode;
	profileImage?: string; // URL or path to profile image
	className?: string;
}
