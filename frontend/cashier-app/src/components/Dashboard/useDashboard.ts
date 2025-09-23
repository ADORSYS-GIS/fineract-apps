import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Route } from "@/routes/dashboard";
import { login, logout } from "@/store/auth";

export const useDashboard = () => {
	const { query } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const onQueryChange = (newQuery: string) => {
		navigate({ search: { query: newQuery } });
	};

	useEffect(() => {
		login("bWlmb3M6cGFzc3dvcmQ=");
	}, []);

	return {
		onLogout: logout,
		query,
		onQueryChange,
	};
};
