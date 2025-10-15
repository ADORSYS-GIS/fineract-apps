export const useAuth = () => {
	const onLogout = () => {
		window.location.href = `/cashier/callback?logout=${encodeURIComponent(
			window.location.origin + "/account/",
		)}`;
	};

	return { onLogout };
};
