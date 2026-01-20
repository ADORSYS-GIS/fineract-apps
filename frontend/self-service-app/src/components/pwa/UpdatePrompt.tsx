import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePWA } from "@/hooks/usePWA";

export function UpdatePrompt() {
  const { t } = useTranslation();
  const { updateAvailable, reloadForUpdate } = usePWA();

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-blue-600 text-white rounded-lg shadow-xl p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <RefreshCw className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">
            {t("pwa.updateTitle", "Update available")}
          </h3>
          <p className="text-sm text-blue-100 mt-1">
            {t("pwa.updateDescription", "A new version is ready to install")}
          </p>
        </div>
      </div>

      <button
        onClick={reloadForUpdate}
        className="mt-3 w-full px-3 py-2 text-sm font-medium bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
      >
        {t("pwa.updateNow", "Update now")}
      </button>
    </div>
  );
}
