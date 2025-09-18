import React, { type KeyboardEvent } from "react";
import { cn } from "../../lib/utils";
import { CardProps } from "./Card.types";
import { cardVariants } from "./Card.variants";

export const CardView = React.forwardRef<HTMLDivElement, CardProps>(
	(
		{
			title,
			footer,
			media,
			children,
			variant,
			size,
			hoverable,
			className,
			onClick,
			loading = false,
			ariaLabel,
		},
		ref,
	) => {
		const classes = cn(
			cardVariants({ variant, size, hoverable }),
			loading && "opacity-50 animate-pulse",
			className,
		);

		const interactiveProps = onClick
			? {
					onClick,
					role: "button" as const,
					tabIndex: 0,
					onKeyUp: (e: KeyboardEvent) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							onClick();
						}
					},
				}
			: {};

		return (
			<div
				className={classes}
				aria-label={ariaLabel}
				{...interactiveProps}
				ref={ref}
			>
				{media && <div className="mb-2">{media}</div>}
				{title && <div className="font-semibold">{title}</div>}
				<div className="flex-1">{children}</div>
				{footer && <div className="mt-2">{footer}</div>}
			</div>
		);
	},
);

CardView.displayName = "CardView";
