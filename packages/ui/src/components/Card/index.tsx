import React from "react";
import { CardProps } from "./Card.types";
import { CardView } from "./Card.view";

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
	({ ...props }, ref) => {
		return <CardView {...props} ref={ref} />;
	},
);

Card.displayName = "Card";
