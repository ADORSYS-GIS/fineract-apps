import { createFileRoute } from "@tanstack/react-router";

function ReportsPage() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold">Reports</h1>
			<p className="text-gray-600 mt-2">
				Generate and view reports (placeholder).
			</p>
		</div>
	);
}

export const Route = createFileRoute("/reports")({
	component: ReportsPage,
});
