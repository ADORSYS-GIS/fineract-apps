import { useTranslation } from "react-i18next";
import { Button } from "../Button";

export const LanguageSwitcher = () => {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	return (
		<div className="flex gap-2">
			{Object.keys(i18n.options.resources || {}).map((lang) => (
				<Button
					key={lang}
					variant="ghost"
					size="sm"
					onClick={() => changeLanguage(lang)}
					disabled={i18n.language.startsWith(lang)}
				>
					{lang.toUpperCase()}
				</Button>
			))}
		</div>
	);
};
