import { OpenAPI } from "@fineract-apps/fineract-api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "@fineract-apps/ui/styles.css";
import "./index.css";
import { routeTree } from "./routeTree.gen.ts";

// Create a new router instance from the generated route tree
const router = createRouter({ routeTree });

// Configure API client
const queryClient = new QueryClient();
OpenAPI.BASE = import.meta.env.VITE_API_BASE_URL ?? OpenAPI.BASE;
OpenAPI.HEADERS = async () => ({
	"Fineract-Platform-TenantId": "default",
	"Content-Type": "application/json",
});
OpenAPI.USERNAME = import.meta.env.VITE_BRANCH_MANAGER_USERNAME;
OpenAPI.PASSWORD = import.meta.env.VITE_BRANCH_MANAGER_PASSWORD;

// Register the router instance for type safety (important for TypeScript)
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render your React application with the router
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<Suspense fallback={<div>Loading...</div>}>
				<RouterProvider router={router} />
				<ReactQueryDevtools position="bottom" />
			</Suspense>
		</QueryClientProvider>
	</StrictMode>,
);
