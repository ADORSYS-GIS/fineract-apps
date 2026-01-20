import { Download, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePWA } from "@/hooks/usePWA";

export function InstallPrompt() {
  const { t } = useTranslation();
  const { isInstallable, promptInstall } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (!installed) {
      setDismissed(true);
    }
  };

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
        aria-label={t("common.close", "Close")}
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Download className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            {t("pwa.installTitle", "Install Webank")}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {t("pwa.installDescription", "Add to home screen for quick access")}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setDismissed(true)}
          className="flex-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {t("common.notNow", "Not now")}
        </button>
        <button
          onClick={handleInstall}
          className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t("pwa.install", "Install")}
        </button>
      </div>
    </div>
  );
}
