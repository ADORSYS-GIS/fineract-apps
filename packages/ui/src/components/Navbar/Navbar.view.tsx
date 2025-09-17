// /frontend/shared/src/components/ui/Navbar/Navbar.view.tsx

import { Bell, Menu, X } from "lucide-react";
import { NavbarProps } from "./Navbar.types";

const renderProfileImage = (
	profileImage: string | undefined,
	userName: string,
	size: "small" | "large" = "small",
) => {
	const sizeClasses = size === "large" ? "w-10 h-10" : "w-8 h-8";
	return profileImage ? (
		<img
			src={profileImage}
			alt={`${userName}'s profile`}
			className={`${sizeClasses} rounded-full object-cover border border-gray-200`}
		/>
	) : (
		<div
			className={`${sizeClasses} bg-gray-300 rounded-full flex items-center justify-center`}
		>
			<span className="text-gray-600 font-medium text-sm">
				{userName.charAt(0).toUpperCase()}
			</span>
		</div>
	);
};

const renderNotificationBadge = (
	notifications: number | React.ReactNode | undefined,
) => {
	if (!notifications || typeof notifications !== "number" || notifications <= 0)
		return null;
	return (
		<span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium">
			{notifications > 99 ? "99+" : notifications}
		</span>
	);
};

export const NavbarView = ({
	logo,
	userName,
	userId,
	onLogout,
	notifications,
	isMenuOpen,
	onToggleMenu,
	profileImage,
	className,
}: NavbarProps) => {
	const effectiveLogo = logo ?? "BankerPro";

	const logoSection = (
		<div className="flex items-center">
			<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
				<span className="text-white font-bold text-sm">B</span>
			</div>
			<span className="font-semibold text-gray-900 text-lg">
				{effectiveLogo}
			</span>
		</div>
	);

	const desktopNotifications = notifications ? (
		<div className="relative hidden md:block">
			<Bell size={20} className="text-gray-600 hover:text-gray-800" />
			{renderNotificationBadge(notifications)}
		</div>
	) : null;

	const desktopUserInfo = (
		<div className="hidden md:flex items-center gap-3">
			{renderProfileImage(profileImage, userName)}
			<div className="flex flex-col">
				<span className="text-sm font-medium text-gray-900">{userName}</span>
				<span className="text-xs text-gray-500">ID: {userId}</span>
			</div>
		</div>
	);

	const logoutButton = (
		<button
			onClick={onLogout}
			className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
		>
			Logout
		</button>
	);

	const mobileMenuButton = (
		<button
			onClick={onToggleMenu}
			className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
		>
			{isMenuOpen ? <X size={20} /> : <Menu size={20} />}
		</button>
	);

	const mobileMenu = isMenuOpen ? (
		<div className="absolute top-full right-4 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 md:hidden z-50">
			<div className="px-4 py-3 border-b border-gray-100">
				<div className="flex items-center gap-3">
					{renderProfileImage(profileImage, userName, "large")}
					<div className="flex flex-col">
						<span className="text-sm font-medium text-gray-900">
							{userName}
						</span>
						<span className="text-xs text-gray-500">ID: {userId}</span>
					</div>
				</div>
			</div>
			{notifications && (
				<div className="px-4 py-2 border-b border-gray-100">
					<div className="flex items-center justify-between">
						<span className="text-sm text-gray-700">Notifications</span>
						{renderNotificationBadge(notifications)}
					</div>
				</div>
			)}
			<button
				onClick={onLogout}
				className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
			>
				Logout
			</button>
		</div>
	) : null;

	return (
		<header
			className={`flex justify-between items-center bg-white border-b border-gray-200 px-6 py-3 shadow-sm ${className ?? ""}`}
		>
			{logoSection}
			<div className="flex items-center gap-4">
				{desktopNotifications}
				{desktopUserInfo}
				{logoutButton}
				{mobileMenuButton}
				{mobileMenu}
			</div>
		</header>
	);
};
