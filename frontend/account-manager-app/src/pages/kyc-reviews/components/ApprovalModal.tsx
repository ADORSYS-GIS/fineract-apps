import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Select } from "@fineract-apps/ui";
import { Modal } from "@/components/Modal/Modal";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newTier: number, notes?: string) => void;
  isLoading: boolean;
  currentTier: number;
}

export function ApprovalModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  currentTier,
}: ApprovalModalProps) {
  const { t } = useTranslation();
  const [newTier, setNewTier] = useState<number>(Math.min(currentTier + 1, 3));
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    onConfirm(newTier, notes || undefined);
  };

  const handleClose = () => {
    setNewTier(Math.min(currentTier + 1, 3));
    setNotes("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {t("kycReviews.approvalModal.title")}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("kycReviews.approvalModal.selectTier")}
            </label>
            <Select
              value={newTier.toString()}
              onValueChange={(value) => setNewTier(parseInt(value, 10))}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="1">
                  {t("kycReviews.approvalModal.tier1")}
                </Select.Item>
                <Select.Item value="2">
                  {t("kycReviews.approvalModal.tier2")}
                </Select.Item>
                <Select.Item value="3">
                  {t("kycReviews.approvalModal.tier3")}
                </Select.Item>
              </Select.Content>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("kycReviews.approvalModal.notes")}
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder={t("kycReviews.approvalModal.notesPlaceholder")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {t("kycReviews.approvalModal.cancel")}
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "..." : t("kycReviews.approvalModal.confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
