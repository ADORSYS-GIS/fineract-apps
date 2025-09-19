import { Menu, X } from "lucide-react";
import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../Button";
import { NavbarProps } from "./Navbar.types";
import { navbarVariant } from "./Navbar.variant";

const MobileMenuButton = ({
	isOpen,
	onClick,
}: {
	isOpen?: boolean;
	onClick?: () => void;
}) => (
	<Button variant="ghost" size="sm" onClick={onClick} className="md:hidden">
		{isOpen ? <X size={20} /> : <Menu size={20} />}
	</Button>
);

export const NavbarView = React.forwardRef<HTMLElement, NavbarProps>(
	(
		{
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
		},
		ref,
	) => {
		const classes = cn(
			navbarVariant({ variant, size, className }),
			isMenuOpen && "shadow-lg",
			className,
		);
		return (
			<header className={classes} ref={ref}>
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
					<MobileMenuButton isOpen={isMenuOpen} onClick={onToggleMenu} />
				</div>
			</header>
		);
	},
);

NavbarView.displayName = "NavbarView";
