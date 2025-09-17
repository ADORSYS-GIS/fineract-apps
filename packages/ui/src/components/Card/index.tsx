// /frontend/shared/src/components/ui/Card/index.tsx

import { CardProps } from "./Card.types";
import { CardView } from "./Card.view";
import { useCard } from "./useCard";

export const Card = (props: CardProps) => {
	const { isCollapsed, toggleCollapse } = useCard(props);

	return (
		<CardView
			{...props}
			isCollapsed={isCollapsed}
			onToggleCollapse={toggleCollapse}
		/>
	);
};
