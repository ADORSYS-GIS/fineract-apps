import { LogOut } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { SidebarProps } from "./Sidebar.types";

type SidebarViewProps = SidebarProps & {
	activeLink: string | null;
	handleClick: (link: string) => void;
};

export const SidebarView: React.FC<SidebarViewProps> = ({
	menuItems = [],
	onLogout,
	className,
	activeLink,
	handleClick,
}) => {
	const { t } = useTranslation();
	return (
		<aside
			className={`h-screen w-64 bg-white shadow-lg flex flex-col justify-between ${className}`}
		>
			{/* Logo */}
			<div className="p-4 text-2xl font-bold text-blue-600">OnlineBank</div>

			{/* Menu */}
			<nav className="flex-1 px-2 space-y-2">
				{menuItems.map((item) => {
					const Icon = item.icon;
					const isActive = activeLink === item.link;
					return (
						<a
							key={item.link}
							href={item.link}
							onClick={() => handleClick(item.link)}
							className={`flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition ${
								isActive ? "bg-blue-50 text-blue-600" : ""
							}`}
						>
							{Icon && <Icon className="w-5 h-5" />}
							<span>{t(item.name)}</span>
						</a>
					);
				})}
			</nav>

			{/* Logout */}
			<div className="p-4">
				<button
					onClick={onLogout}
					className="w-full flex items-center gap-2 border rounded-lg p-2 hover:bg-gray-100"
				>
					<LogOut className="w-5 h-5" />
					{t("logout")}
				</button>
			</div>
		</aside>
	);
};
