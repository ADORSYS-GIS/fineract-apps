import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "@fineract-apps/ui/styles.css";
import { OpenAPI } from "@fineract-apps/fineract-api";
import type { AxiosRequestConfig } from "axios";
import "./index.css";
import { routeTree } from "./routeTree.gen.ts";
import { authStore } from "./store/auth.ts";
import { queryClient } from "./query-client.ts";

OpenAPI.interceptors.request.use((config: AxiosRequestConfig) => {
  const { isAuthenticated, base64EncodedAuthenticationKey } = authStore.state;

  if (isAuthenticated && base64EncodedAuthenticationKey) {
    config.headers = {
      ...config.headers,
      Authorization: `Basic ${base64EncodedAuthenticationKey}`,
      'Fineract-Platform-TenantId': 'default',
    };
  }

  return config;
});

// Create a new router instance from the generated route tree
const router = createRouter({ routeTree, context: { queryClient } });

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
