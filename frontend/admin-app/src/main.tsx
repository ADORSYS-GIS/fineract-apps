import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "@fineract-apps/ui/styles.css";
import "./index.css";
import { routeTree } from "./routeTree.gen.ts";

// Create a new router instance from the generated route tree
const router = createRouter({ routeTree });

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
			<RouterProvider router={router} />
		</Suspense>
	</StrictMode>,
);
