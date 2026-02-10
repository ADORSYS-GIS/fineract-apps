import { Button } from "@fineract-apps/ui";
import { type FC, useEffect, useRef, useState } from "react";

interface MintSupplyDialogProps {
	isOpen: boolean;
	currentSupply: number;
	assetSymbol: string;
	onSubmit: (data: { additionalSupply: number }) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export const MintSupplyDialog: FC<MintSupplyDialogProps> = ({
	isOpen,
	currentSupply,
	assetSymbol,
	onSubmit,
	onCancel,
	isLoading,
}) => {
	const cancelRef = useRef<HTMLButtonElement>(null);
	const [amount, setAmount] = useState("");

	useEffect(() => {
		if (isOpen) {
			setAmount("");
			cancelRef.current?.focus();
		}
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !isLoading) onCancel();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, isLoading, onCancel]);

	if (!isOpen) return null;

	const numAmount = Number(amount);
	const isValid = Number.isFinite(numAmount) && numAmount > 0;

	const handleSubmit = () => {
		if (isValid) {
			onSubmit({ additionalSupply: numAmount });
		}
	};

	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
			role="dialog"
			aria-modal="true"
			aria-labelledby="mint-dialog-title"
			onClick={(e) => {
				if (e.target === e.currentTarget && !isLoading) onCancel();
			}}
		>
			<div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
				<h3
					id="mint-dialog-title"
					className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
				>
					Mint Supply — {assetSymbol}
				</h3>
				<p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
					Current total supply:{" "}
					<span className="font-medium">{currentSupply.toLocaleString()}</span>{" "}
					units
				</p>

				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						Additional units to mint
					</label>
					<input
						type="number"
						className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
						placeholder="Enter amount..."
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						min={1}
						step="any"
						autoFocus
					/>
					{amount && isValid && (
						<p className="text-xs text-gray-400 mt-1">
							New total supply: {(currentSupply + numAmount).toLocaleString()}{" "}
							units
						</p>
					)}
				</div>

				<div className="flex justify-end gap-3">
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
						disabled={!isValid || isLoading}
						className="bg-green-600 hover:bg-green-700"
					>
						{isLoading ? "Minting..." : "Mint Supply"}
					</Button>
				</div>
			</div>
		</div>
	);
};
