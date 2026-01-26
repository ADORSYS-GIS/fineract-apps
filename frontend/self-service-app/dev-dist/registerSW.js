if ("serviceWorker" in navigator)
	navigator.serviceWorker.register("/self-service/dev-sw.js?dev-sw", {
		scope: "/self-service/",
		type: "classic",
	});
