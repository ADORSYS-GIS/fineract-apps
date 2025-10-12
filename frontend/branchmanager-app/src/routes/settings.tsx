import { createFileRoute } from "@tanstack/react-router";

function SettingsPage() {
	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
			<h1 className="text-2xl font-bold mb-4">Settings</h1>
			<p className="text-gray-600">Application settings (placeholder).</p>
		</div>
	);
}

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});
