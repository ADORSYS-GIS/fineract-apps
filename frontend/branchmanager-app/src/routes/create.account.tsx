import { Card } from "@fineract-apps/ui";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/create/account")({
	component: RouteComponent,
});

function RouteComponent() {
	const subFeatures = [
		{ title: "Savings Account", link: "/create/account/savings" },
		{ title: "Loan Account", link: "/create/account/loan" },
	];

	return (
		<div className="p-6">
			{/* Page title */}
			<h1 className="text-2xl font-bold mb-6">Create Account</h1>

			{/* Sub-feature cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
				{subFeatures.map((feature) => (
					<Link key={feature.title} to={feature.link}>
						<Card
							className="p-4 flex flex-col justify-between hover:shadow-lg transition cursor-pointer"
							hoverable
						>
							<h2 className="text-lg font-semibold">{feature.title}</h2>
						</Card>
					</Link>
				))}
			</div>

			{/* Outlet renders the selected sub-feature */}
			<Outlet />
		</div>
	);
}
