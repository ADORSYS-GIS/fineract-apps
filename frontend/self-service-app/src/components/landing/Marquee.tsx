import { PiggyBank, ShieldCheck, Zap } from "lucide-react";

const MarqueeItem = ({
	icon: Icon,
	text,
}: {
	icon: React.ElementType;
	text: string;
}) => (
	<div className="flex items-center text-sm sm:text-base font-medium text-gray-700">
		<Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mr-3" />
		<span>{text}</span>
	</div>
);

export function Marquee() {
	const items = [
		{ icon: Zap, text: "Instant Mobile Money Transfers" },
		{ icon: ShieldCheck, text: "Secure Passwordless Authentication" },
		{ icon: PiggyBank, text: "Low Fees, High Speed" },
		{ icon: Zap, text: "Instant Mobile Money Transfers" },
		{ icon: ShieldCheck, text: "Secure Passwordless Authentication" },
		{ icon: PiggyBank, text: "Low Fees, High Speed" },
	];

	return (
		<div className="bg-white py-6 sm:py-8 border-t border-gray-200 overflow-hidden sm:hidden">
			<div className="relative flex">
				<div
					className="flex whitespace-nowrap"
					style={{ animation: "marquee 25s linear infinite" }}
				>
					{items.map((item, index) => (
						<div key={`${item.text}-${index}`} className="mx-6 sm:mx-8">
							<MarqueeItem icon={item.icon} text={item.text} />
						</div>
					))}
				</div>

				<div
					className="absolute top-0 flex whitespace-nowrap"
					style={{ animation: "marquee2 25s linear infinite" }}
				>
					{items.map((item, index) => (
						<div key={`${item.text}-${index}`} className="mx-6 sm:mx-8">
							<MarqueeItem icon={item.icon} text={item.text} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
