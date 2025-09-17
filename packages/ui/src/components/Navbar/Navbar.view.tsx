// /frontend/shared/src/components/ui/Navbar/Navbar.view.tsx

import { Bell, Menu, X } from "lucide-react";
import { NavbarProps } from "./Navbar.types";

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
	return (
		<header
			className={`flex justify-between items-center bg-white border-b border-gray-200 px-6 py-3 shadow-sm ${className || ""}`}
		>
			{/* Left side - Logo */}
			<div className="flex items-center">
				<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
					<span className="text-white font-bold text-sm">B</span>
				</div>
				<span className="font-semibold text-gray-900 text-lg">
					{effectiveLogo}
				</span>
			</div>

			{/* Right side - User info and actions */}
			<div className="flex items-center gap-4">
				{/* Notifications - Desktop */}
				{notifications && (
					<div className="relative hidden md:block">
						<Bell
							size={20}
							className="text-gray-600 hover:text-gray-800 cursor-pointer"
						/>
						{typeof notifications === "number" && notifications > 0 && (
							<span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium">
								{notifications > 99 ? "99+" : notifications}
							</span>
						)}
					</div>
				)}

				{/* User Info - Desktop */}
				<div className="hidden md:flex items-center gap-3">
					{profileImage ? (
						<img
							src={profileImage}
							alt={`${userName}'s profile`}
							className="w-8 h-8 rounded-full object-cover border border-gray-200"
						/>
					) : (
						<div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
							<span className="text-gray-600 font-medium text-sm">
								{userName.charAt(0).toUpperCase()}
							</span>
						</div>
					)}
					<div className="flex flex-col">
						<span className="text-sm font-medium text-gray-900">
							{userName}
						</span>
						<span className="text-xs text-gray-500">ID: {userId}</span>
					</div>
				</div>

				{/* Logout Button - Desktop */}
				<button
					onClick={onLogout}
					className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
				>
					Logout
				</button>

				{/* Mobile Menu Button */}
				<button
					onClick={onToggleMenu}
					className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
				>
					{isMenuOpen ? <X size={20} /> : <Menu size={20} />}
				</button>

				{/* Mobile Dropdown Menu */}
				{isMenuOpen && (
					<div className="absolute top-full right-4 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 md:hidden z-50">
						{/* User Info - Mobile */}
						<div className="px-4 py-3 border-b border-gray-100">
							<div className="flex items-center gap-3">
								{profileImage ? (
									<img
										src={profileImage}
										alt={`${userName}'s profile`}
										className="w-10 h-10 rounded-full object-cover border border-gray-200"
									/>
								) : (
									<div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
										<span className="text-gray-600 font-medium">
											{userName.charAt(0).toUpperCase()}
										</span>
									</div>
								)}
								<div className="flex flex-col">
									<span className="text-sm font-medium text-gray-900">
										{userName}
									</span>
									<span className="text-xs text-gray-500">ID: {userId}</span>
								</div>
							</div>
						</div>

						{/* Notifications - Mobile */}
						{notifications && (
							<div className="px-4 py-2 border-b border-gray-100">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-700">Notifications</span>
									{typeof notifications === "number" && notifications > 0 && (
										<span className="bg-red-500 text-white rounded-full text-xs px-2 py-1 font-medium">
											{notifications > 99 ? "99+" : notifications}
										</span>
									)}
								</div>
							</div>
						)}

						{/* Logout - Mobile */}
						<button
							onClick={onLogout}
							className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
						>
							Logout
						</button>
					</div>
				)}
			</div>
		</header>
	);
};
