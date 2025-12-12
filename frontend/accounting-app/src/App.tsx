import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			retry: 1,
		},
	},
});

const router = createRouter({
	routeTree,
	context: {
		queryClient,
	},
	defaultPreload: "intent",
	defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<Toaster position="top-right" />
		</QueryClientProvider>
	);
}
