export const useAuth = () => {
	const onLogout = () => {
		window.location.href = `/account/callback?logout=${encodeURIComponent(
			window.location.origin + "/account/",
		)}`;
	};

	return { onLogout };
};
