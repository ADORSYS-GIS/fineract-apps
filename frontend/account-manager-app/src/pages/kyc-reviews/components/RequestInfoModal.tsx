import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@fineract-apps/ui";
import { Modal } from "@/components/Modal/Modal";

interface RequestInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (message: string) => void;
  isLoading: boolean;
}

export function RequestInfoModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: RequestInfoModalProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");

  const handleConfirm = () => {
    if (!message.trim()) return;
    onConfirm(message);
  };

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {t("kycReviews.requestInfoModal.title")}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("kycReviews.requestInfoModal.message")}
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              placeholder={t("kycReviews.requestInfoModal.messagePlaceholder")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {t("kycReviews.requestInfoModal.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !message.trim()}
          >
            {isLoading ? "..." : t("kycReviews.requestInfoModal.confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
