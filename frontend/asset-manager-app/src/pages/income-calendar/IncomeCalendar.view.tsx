import { FC, useState } from "react";
import { IncomeCalendarCard } from "@/components/IncomeCalendarCard";

export const IncomeCalendarView: FC = () => {
	const [months, setMonths] = useState(12);

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">
							Income Calendar
						</h1>
						<p className="text-sm text-gray-500 mt-1">
							Projected coupon, dividend, rent, and other income payments across
							your portfolio.
						</p>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-500">Period:</span>
						{[6, 12, 24].map((m) => (
							<button
								key={m}
								type="button"
								onClick={() => setMonths(m)}
								className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
									months === m
										? "bg-blue-600 text-white border-blue-600"
										: "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
								}`}
							>
								{m}M
							</button>
						))}
					</div>
				</div>
				<IncomeCalendarCard months={months} />
			</main>
		</div>
	);
};
