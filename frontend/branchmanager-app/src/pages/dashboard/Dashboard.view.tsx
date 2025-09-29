import { SearchBar } from "@fineract-apps/ui";

type Props = {
	title: string;
	query: string;
	setQuery: (v: string) => void;
};

export const DashboardView = ({ title, query, setQuery }: Props) => {
	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6">
			<div className="flex flex-wrap items-center justify-between gap-3 mb-6">
				<h1 className="text-2xl md:text-3xl font-bold text-gray-900">
					{title}
				</h1>
			</div>
			<div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<h2 className="text-[22px] font-bold text-gray-900">
					Pending Approvals
				</h2>
				<SearchBar
					value={query}
					onValueChange={setQuery}
					placeholder="Filter by name, type, amount..."
					className="max-w-md"
				/>
			</div>
			<div className="mt-3 rounded-xl border border-gray-200 bg-white p-6">
				<p className="text-gray-500 text-sm">No pending approvals.</p>
			</div>
		</div>
	);
};
