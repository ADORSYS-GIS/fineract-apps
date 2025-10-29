export const useDashboard = () => {
	const onLogout = () => {
		window.location.href = `/cashier/callback?logout=${encodeURIComponent(
			window.location.origin + "/cashier/",
		)}`;
	};

	return {
		onLogout,
	};
};
