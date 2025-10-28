import { useTranslation } from "react-i18next";
import { Button } from "../Button";

export const LanguageSwitcher = () => {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	return (
		<div className="flex gap-2">
			<Button
				variant="ghost"
				size="sm"
				onClick={() => changeLanguage("en")}
				disabled={i18n.language === "en"}
			>
				EN
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => changeLanguage("fr")}
				disabled={i18n.language === "fr"}
			>
				FR
			</Button>
		</div>
	);
};
