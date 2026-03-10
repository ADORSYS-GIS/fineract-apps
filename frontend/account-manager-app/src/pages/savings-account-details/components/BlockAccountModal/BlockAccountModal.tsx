import { CodeValueData } from "@fineract-apps/fineract-api";
import { Button } from "@fineract-apps/ui";
import { X } from "lucide-react";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

interface BlockAccountModalProps {
	isOpen: boolean;
	onClose: () => void;
	blockReasons: CodeValueData[] | undefined;
	onConfirm: (reasonId: number) => void;
}

export const BlockAccountModal: FC<BlockAccountModalProps> = ({
	isOpen,
	onClose,
	blockReasons,
	onConfirm,
}) => {
	const { t } = useTranslation();
	const [selectedReason, setSelectedReason] = useState<number | null>(null);

	if (!isOpen) {
		return null;
	}

	return (
		<>
			{/* Backdrop */}
			<button
				type="button"
				className="fixed inset-0 z-40 bg-black/40"
				onClick={onClose}
				aria-label={t("accountManagerCommon.closeModal")}
			/>

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
				<dialog
					className="relative bg-white rounded-t-2xl md:rounded-lg p-6 w-full max-w-md shadow-lg"
					open={isOpen}
					onClose={onClose}
				>
					<button
						type="button"
						className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hidden md:block"
						onClick={onClose}
					>
						<X className="w-6 h-6" />
					</button>
					<div className="hidden md:block">
						<h2 className="text-xl font-bold text-center mb-6">
							{t("blockAccountModal.blockAccount")}
						</h2>
					</div>
					<div className="md:hidden flex justify-center mb-4">
						<div className="w-12 h-1.5 bg-gray-300 rounded-full" />
					</div>
					<div className="md:hidden">
						<h2 className="text-xl font-bold text-center mb-6">
							{t("blockAccountModal.blockAccount")}
						</h2>
					</div>
					<p className="text-sm text-gray-600 mb-4">
						{t("blockAccountModal.selectReason")}
					</p>
					<select
						onChange={(e) => setSelectedReason(Number(e.target.value))}
						className="border rounded p-2 w-full mb-4"
					>
						<option value="">
							{t("blockAccountModal.selectReasonPlaceholder")}
						</option>
						{blockReasons?.map((reason) => (
							<option key={reason.id} value={reason.id}>
								{reason.name}
							</option>
						))}
					</select>
					<div className="flex justify-end gap-4">
						<Button variant="outline" onClick={onClose}>
							{t("blockAccountModal.cancel")}
						</Button>
						<Button
							onClick={() => {
								if (selectedReason) {
									onConfirm(selectedReason);
								}
							}}
							disabled={!selectedReason}
						>
							{t("blockAccountModal.confirm")}
						</Button>
					</div>
				</dialog>
			</div>
		</>
	);
};
