import { Button } from "@fineract-apps/ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/Modal/Modal";

interface RejectionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (reason: string, notes?: string) => void;
	isLoading: boolean;
}

const REJECTION_REASONS = [
	"documentUnclear",
	"documentExpired",
	"documentMismatch",
	"documentFraud",
	"other",
];

export function RejectionModal({
	isOpen,
	onClose,
	onConfirm,
	isLoading,
}: RejectionModalProps) {
	const { t } = useTranslation();
	const [reason, setReason] = useState("");
	const [notes, setNotes] = useState("");

	const handleConfirm = () => {
		if (!reason) return;
		const reasonText = t(`kycReviews.rejectionModal.${reason}`);
		onConfirm(reasonText, notes || undefined);
	};

	const handleClose = () => {
		setReason("");
		setNotes("");
		onClose();
	};

	if (!isOpen) return null;

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title={t("kycReviews.rejectionModal.title")}
		>
			<div className="p-6">
				<h2 className="text-xl font-semibold mb-4">
					{t("kycReviews.rejectionModal.title")}
				</h2>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							{t("kycReviews.rejectionModal.selectReason")}
						</label>
						<select
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
						>
							<option value="">
								{t("kycReviews.rejectionModal.selectReason")}
							</option>
							{REJECTION_REASONS.map((r) => (
								<option key={r} value={r}>
									{t(`kycReviews.rejectionModal.${r}`)}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							{t("kycReviews.rejectionModal.notes")}
						</label>
						<textarea
							className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							rows={3}
							placeholder={t("kycReviews.rejectionModal.notesPlaceholder")}
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
						/>
					</div>
				</div>

				<div className="flex justify-end gap-3 mt-6">
					<Button variant="outline" onClick={handleClose} disabled={isLoading}>
						{t("kycReviews.rejectionModal.cancel")}
					</Button>
					<Button
						variant="destructive"
						onClick={handleConfirm}
						disabled={isLoading || !reason}
					>
						{isLoading ? "..." : t("kycReviews.rejectionModal.confirm")}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
