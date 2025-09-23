import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient } from "@tanstack/react-query";

export interface MyRouterContext {
  queryClient: QueryClient;
}

function RootLayout() {
	return (
		<>
			<Outlet />
			<TanStackRouterDevtools />
			<ReactQueryDevtools />
		</>
	);
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
});
