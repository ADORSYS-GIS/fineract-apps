import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import "@fineract-apps/ui/styles.css";
import { i18n } from "@fineract-apps/i18n";
import "./index.css";
import { routeTree } from "./routeTree.gen.ts";
import { configureApi } from "./services/api";

// Create a new router instance from the generated route tree
const router = createRouter({ routeTree, basepath: "/branchmanager" });

// Configure API client
const queryClient = new QueryClient();
configureApi();

// Register the router instance for type safety (important for TypeScript)
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render your React application with the router
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<I18nextProvider i18n={i18n}>
			<QueryClientProvider client={queryClient}>
				<Suspense fallback={<div>Loading...</div>}>
					<RouterProvider router={router} />
					<ReactQueryDevtools position="bottom" />
				</Suspense>
			</QueryClientProvider>
		</I18nextProvider>
	</StrictMode>,
);
