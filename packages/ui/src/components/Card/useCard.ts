// /frontend/shared/src/components/ui/Card/useCard.ts
import { CardProps } from "./Card.types";

export const useCard = (props: CardProps) => {
	// Keep structure while avoiding added complexity.
	// Allows future stateful features without affecting presentational simplicity.
	return { props };
};
