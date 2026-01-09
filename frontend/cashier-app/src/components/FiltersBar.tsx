import { Search } from "lucide-react";

interface FilterField {
	key: string;
	label?: string;
	type: "text" | "select" | "date";
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	options?: { value: string; label: string }[];
	className?: string;
}

interface FiltersBarProps {
	filters: FilterField[];
	className?: string;
}

export function FiltersBar({ filters, className = "" }: FiltersBarProps) {
	return (
		<div
			className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 ${className}`}
		>
			<div className="flex flex-col md:flex-row gap-4">
				{filters.map((filter) => (
					<div key={filter.key} className={`flex-1 ${filter.className || ""}`}>
						{filter.label && (
							<label className="block text-sm font-medium text-gray-700 mb-2">
								{filter.label}
							</label>
						)}
						{filter.type === "text" && (
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									type="text"
									placeholder={filter.placeholder || "Search..."}
									value={filter.value}
									onChange={(e) => filter.onChange(e.target.value)}
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
						)}
						{filter.type === "select" && (
							<select
								value={filter.value}
								onChange={(e) => filter.onChange(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								{filter.options?.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						)}
						{filter.type === "date" && (
							<input
								type="date"
								value={filter.value}
								onChange={(e) => filter.onChange(e.target.value)}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
