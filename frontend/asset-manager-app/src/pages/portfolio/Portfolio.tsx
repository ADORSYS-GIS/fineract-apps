import { FC } from "react";
import { PortfolioView } from "./Portfolio.view";
import { usePortfolio } from "./usePortfolio";

export const Portfolio: FC = () => {
	const portfolioProps = usePortfolio();
	return <PortfolioView {...portfolioProps} />;
};
