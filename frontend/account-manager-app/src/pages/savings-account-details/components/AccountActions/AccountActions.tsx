import { Button } from "@fineract-apps/ui";
import { MoreVertical } from "lucide-react";
import { FC, useState } from "react";

interface AccountActionsProps {
	isBlocked: boolean;
	onBlock: () => void;
	onUnblock: () => void;
}

export const AccountActions: FC<AccountActionsProps> = ({
	isBlocked,
	onBlock,
	onUnblock,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="relative">
			<Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
				<MoreVertical className="h-6 w-6" />
			</Button>
			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
					<div className="py-1">
						{isBlocked ? (
							<button
								onClick={() => {
									onUnblock();
									setIsOpen(false);
								}}
								className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								Unblock Account
							</button>
						) : (
							<button
								onClick={() => {
									onBlock();
									setIsOpen(false);
								}}
								className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							>
								Block Account
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
