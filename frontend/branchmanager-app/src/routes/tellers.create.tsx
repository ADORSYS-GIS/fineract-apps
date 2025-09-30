import { createFileRoute } from "@tanstack/react-router";

function CreateTellerPage() {
	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold">Create New Teller</h1>
			<p>Form to create a new teller will be here.</p>
		</div>
	);
}

export const Route = createFileRoute("/tellers/create")({
	component: CreateTellerPage,
});
