// /frontend/shared/src/components/ui/Card/useCard.ts
import { useState } from "react";
import { CardProps } from "./Card.types";

export const useCard = ({
	collapsible = false,
	defaultCollapsed = false,
}: CardProps) => {
	const [isCollapsed, setIsCollapsed] = useState(
		collapsible ? defaultCollapsed : false,
	);

	const toggleCollapse = () => {
		if (collapsible) {
			setIsCollapsed((prev) => !prev);
		}
	};

	return { isCollapsed, toggleCollapse };
};
