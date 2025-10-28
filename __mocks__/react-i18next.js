// __mocks__/react-i18next.js

// This mock provides a fake implementation of the useTranslation hook
// for the Jest test environment. The `t` function simply returns the
// translation key it is given. This allows us to test that the correct
// keys are being used without needing a full i18next instance.

export const useTranslation = () => ({
	t: (key) => key,
	i18n: {
		changeLanguage: () => new Promise(() => {}),
		language: "en",
	},
});
