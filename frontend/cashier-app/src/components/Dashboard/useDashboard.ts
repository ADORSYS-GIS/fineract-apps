import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Route } from "@/routes/dashboard";
import { login, logout } from "@/store/auth";

export const useDashboard = () => {
	const { query } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const onQueryChange = (newQuery: string) => {
		navigate({ search: { query: newQuery } });
	};

	const toggleDropdown = () => {
		setIsDropdownOpen((prev) => !prev);
	};

	useEffect(() => {
		login("bWlmb3M6cGFzc3dvcmQ=");
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return {
		onLogout: logout,
		query,
		onQueryChange,
		isDropdownOpen,
		toggleDropdown,
		dropdownRef,
	};
};
