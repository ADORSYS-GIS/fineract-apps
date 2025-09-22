import { ReactNode } from "react";

export interface AppLayoutProps {
	children: ReactNode;
	navbar?: ReactNode;
	sidebar?: ReactNode;
}
