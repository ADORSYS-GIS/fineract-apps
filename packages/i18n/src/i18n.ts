import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enAccountManager from "./locales/account-manager/en.json";
import frAccountManager from "./locales/account-manager/fr.json";
import enAccounting from "./locales/accounting/en.json";
import frAccounting from "./locales/accounting/fr.json";
import enAdmin from "./locales/admin/en.json";
import frAdmin from "./locales/admin/fr.json";
import enBranchManager from "./locales/branch-manager/en.json";
import frBranchManager from "./locales/branch-manager/fr.json";
import enCashier from "./locales/cashier/en.json";
import frCashier from "./locales/cashier/fr.json";
import enReporting from "./locales/reporting/en.json";
import frReporting from "./locales/reporting/fr.json";
import enReusable from "./locales/reusable/en.json";
import frReusable from "./locales/reusable/fr.json";

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "en",
		debug: import.meta.env.DEV,
		interpolation: {
			escapeValue: false, // React already safes from xss
			prefix: "{",
			suffix: "}",
		},
		resources: {
			en: {
				translation: {
					...enAccountManager.translation,
					...enBranchManager.translation,
					...enCashier.translation,
					...enAccounting.translation,
					...enAdmin.translation,
					...enReporting.translation,
					...enReusable.translation,
				},
			},
			fr: {
				translation: {
					...frAccountManager.translation,
					...frBranchManager.translation,
					...frCashier.translation,
					...frAccounting.translation,
					...frAdmin.translation,
					...frReporting.translation,
					...frReusable.translation,
				},
			},
		},
	});

export default i18n;
