import { Menu, X } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";
import { Button } from "../Button";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { NavbarProps } from "./Navbar.types";
import { navbarVariant } from "./Navbar.variant";

export const MobileMenuButton = ({
	isOpen,
	onClick,
}: {
	isOpen?: boolean;
	onClick?: () => void;
}) => (
	<Button
		variant="ghost"
		size="sm"
		onClick={onClick}
		className="md:hidden"
		data-testid="mobile-menu-button"
	>
		{isOpen ? <X size={20} /> : <Menu size={20} />}
	</Button>
);

export const NavbarView = React.forwardRef<HTMLElement, NavbarProps>(
	(
		{
			sidebarToggle,
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
		const { t } = useTranslation();
		const classes = cn(
			navbarVariant({ variant, size, className }),
			isMenuOpen && "shadow-lg",
			className,
		);
		return (
			<header className={classes} ref={ref}>
				{/* Left side */}
				<div className="flex items-center gap-6">
					{sidebarToggle}
					{logo && <div className="flex items-center gap-2">{logo}</div>}
					<span>{t("welcome")}</span>
					<nav className="hidden md:flex gap-4">{links}</nav>
				</div>

				{/* Right side */}
				<div className="flex items-center gap-4">
					{notifications}
					<div className="hidden md:flex items-center gap-3">{userSection}</div>
					<LanguageSwitcher />
					<div className="hidden md:flex items-center gap-2">{actions}</div>
					<MobileMenuButton isOpen={isMenuOpen} onClick={onToggleMenu} />
				</div>
			</header>
		);
	},
);

NavbarView.displayName = "NavbarView";
