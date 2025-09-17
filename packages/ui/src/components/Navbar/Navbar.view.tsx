// Navbar.view.tsx
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { NavbarProps } from "./Navbar.types";
import { navbarVariant } from "./Navbar.variant";

export const NavbarView = ({
	logo,
	links,
	notifications,
	userSection,
	actions,
	className,
	variant,
	size,
	isMenuOpen,
	onToggleMenu,
}: NavbarProps) => {
	const classes = cn(
		navbarVariant({ variant, size, className }),
		isMenuOpen && "shadow-lg",
		className,
	);
	return (
		<header className={classes}>
			{/* Left side */}
			<div className="flex items-center gap-6">
				{logo && <div className="flex items-center gap-2">{logo}</div>}
				<nav className="hidden md:flex gap-4">{links}</nav>
			</div>

			{/* Right side */}
			<div className="flex items-center gap-4">
				{notifications}
				<div className="hidden md:flex items-center gap-3">{userSection}</div>
				<div className="hidden md:flex items-center gap-2">{actions}</div>

				{/* Mobile toggle */}
				<button
					onClick={onToggleMenu}
					className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
				>
					{isMenuOpen ? <X size={20} /> : <Menu size={20} />}
				</button>
			</div>
		</header>
	);
};
