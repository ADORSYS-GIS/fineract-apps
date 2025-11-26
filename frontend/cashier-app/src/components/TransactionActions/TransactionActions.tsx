import { Button } from "@fineract-apps/ui";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

interface TransactionActionsProps {
	onViewReceipt: () => void;
}

export const TransactionActions: React.FC<TransactionActionsProps> = ({
	onViewReceipt,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="relative">
			<Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
				<MoreVertical />
			</Button>
			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
					<Button
						variant="ghost"
						className="w-full text-left"
						onClick={() => {
							onViewReceipt();
							setIsOpen(false);
						}}
					>
						View Receipt
					</Button>
				</div>
			)}
		</div>
	);
};
