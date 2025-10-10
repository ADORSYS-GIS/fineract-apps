import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

function SettingsPage() {
	return (
		<div className="p-6">
			<PageHeader title="Settings" />
			<p className="text-gray-600 mt-2">Application settings (placeholder).</p>
		</div>
	);
}

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});
