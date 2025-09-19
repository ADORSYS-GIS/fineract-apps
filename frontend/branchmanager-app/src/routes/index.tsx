import { createFileRoute } from "@tanstack/react-router";

function HomePage() {
	return <div>Welcome to the Branch Manager Home Page!</div>;
}

export const Route = createFileRoute("/")({
	component: HomePage,
});
