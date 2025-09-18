import React from "react";
import { AppLayoutProps } from "./AppLayout.types";

export const AppLayoutView = React.forwardRef<HTMLDivElement, AppLayoutProps>(
	({ children, navbar, sidebar }, ref) => {
		return (
			<div ref={ref} className="flex h-screen bg-gray-100">
				{sidebar}
				<div className="flex-1 flex flex-col overflow-hidden">
					{navbar}
					<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
						{children}
					</main>
				</div>
			</div>
		);
	},
);

AppLayoutView.displayName = "AppLayoutView";
