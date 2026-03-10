import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
	component: Settings,
});

function Settings() {
	return (
		<div className="p-2 ml-75">
			<div className="p-4">
				<h1 className="text-2xl font-bold">Coming soon!</h1>
				<p>Manage your preferences and account settings right here.</p>
			</div>
		</div>
	);
}
