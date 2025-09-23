import { createFileRoute } from "@tanstack/react-router";

function SettingsPage() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold">Settings</h1>
			<p className="text-gray-600 mt-2">Application settings (placeholder).</p>
		</div>
	);
}

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});
