import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "@fineract-apps/ui/styles.css";
import "@fineract-apps/i18n";
import "./index.css";
import { queryClient } from "./query-client.ts";
import { routeTree } from "./routeTree.gen.ts";

// Create a new router instance from the generated route tree
const router = createRouter({
	routeTree,
	context: { queryClient },
	basepath: "/cashier",
});

// Register the router instance for type safety (important for TypeScript)
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render your React application with the router
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Suspense fallback={<div>Loading...</div>}>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</Suspense>
	</StrictMode>,
);
