const React = require("react");

const useTranslation = () => {
	return {
		t: (str) => str,
		i18n: {
			changeLanguage: () => new Promise(() => {}),
		},
	};
};

const withTranslation = () => (Component) => {
	Component.defaultProps = { ...Component.defaultProps, t: () => "" };
	return Component;
};

module.exports = {
	useTranslation,
	withTranslation,
};
