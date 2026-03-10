import React from "react";
import { AppLayoutProps } from "./AppLayout.types";
import { AppLayoutView } from "./AppLayout.view";

export const AppLayout = React.forwardRef<HTMLDivElement, AppLayoutProps>(
	({ ...props }, ref) => {
		return <AppLayoutView {...props} ref={ref} />;
	},
);

AppLayout.displayName = "AppLayout";
