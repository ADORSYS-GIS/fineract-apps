import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/dashboard";

export const useDashboard = () => {
	const { query } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const onQueryChange = (newQuery: string) => {
		navigate({ search: { query: newQuery } });
	};

	return {
		query,
		onQueryChange,
	};
};
