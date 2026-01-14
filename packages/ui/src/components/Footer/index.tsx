import { FC } from "react";
import { FooterView } from "./Footer.view";
import { useFooter } from "./useFooter";

export const Footer: FC = () => {
	const footerProps = useFooter();
	return <FooterView {...footerProps} />;
};
