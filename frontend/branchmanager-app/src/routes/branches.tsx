import { createFileRoute } from "@tanstack/react-router";

function BranchesPage() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold">Branches</h1>
			<p className="text-gray-600 mt-2">Manage branches (placeholder).</p>
		</div>
	);
}

export const Route = createFileRoute("/branches")({
	component: BranchesPage,
});
