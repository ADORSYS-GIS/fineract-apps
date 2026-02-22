import { Button } from "@fineract-apps/ui";
import { FC, useEffect, useRef, useState } from "react";

interface DelistDialogProps {
	isOpen: boolean;
	assetName: string;
	currentPrice: number;
	onSubmit: (data: {
		delistingDate: string;
		delistingRedemptionPrice?: number;
	}) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export const DelistDialog: FC<DelistDialogProps> = ({
	isOpen,
	assetName,
	currentPrice,
	onSubmit,
	onCancel,
	isLoading,
}) => {
	const cancelRef = useRef<HTMLButtonElement>(null);
	const [delistingDate, setDelistingDate] = useState("");
	const [redemptionPrice, setRedemptionPrice] = useState(
		currentPrice?.toString() ?? "",
	);

	useEffect(() => {
		if (isOpen) {
			setDelistingDate("");
			setRedemptionPrice(currentPrice?.toString() ?? "");
			cancelRef.current?.focus();
		}
	}, [isOpen, currentPrice]);

	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !isLoading) onCancel();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, isLoading, onCancel]);

	if (!isOpen) return null;

	const handleSubmit = () => {
		if (!delistingDate) return;
		onSubmit({
			delistingDate,
			delistingRedemptionPrice: redemptionPrice
				? Number(redemptionPrice)
				: undefined,
		});
	};

	const inputClass =
		"w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white";
	const labelClass =
		"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
			role="dialog"
			aria-modal="true"
			onClick={(e) => {
				if (e.target === e.currentTarget && !isLoading) onCancel();
			}}
		>
			<div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
					Delist Asset
				</h3>
				<p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
					Schedule delisting for "{assetName}". BUY orders will be blocked
					immediately, only SELL orders will be accepted until the delisting
					date.
				</p>

				<div className="space-y-4">
					<div>
						<label className={labelClass}>Delisting Date *</label>
						<input
							type="date"
							className={inputClass}
							value={delistingDate}
							onChange={(e) => setDelistingDate(e.target.value)}
							min={new Date().toISOString().split("T")[0]}
						/>
						<p className="text-xs text-gray-400 mt-1">
							On this date, remaining holders will be force-bought out
						</p>
					</div>

					<div>
						<label className={labelClass}>Redemption Price (XAF)</label>
						<input
							type="number"
							className={inputClass}
							value={redemptionPrice}
							onChange={(e) => setRedemptionPrice(e.target.value)}
							min={0}
							placeholder={`Default: current price (${currentPrice?.toLocaleString() ?? "—"})`}
						/>
						<p className="text-xs text-gray-400 mt-1">
							Price paid per unit during forced buyback (defaults to last traded
							price)
						</p>
					</div>
				</div>

				<div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
					<p className="text-sm text-amber-800">
						This action will immediately block new BUY orders. All holders will
						be notified of the upcoming delisting.
					</p>
				</div>

				<div className="flex justify-end gap-3 mt-6">
					<Button
						ref={cancelRef}
						variant="outline"
						onClick={onCancel}
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isLoading || !delistingDate}
						className="bg-orange-600 hover:bg-orange-700"
					>
						{isLoading ? "Processing..." : "Initiate Delisting"}
					</Button>
				</div>
			</div>
		</div>
	);
};
