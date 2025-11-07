import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface SidebarContextType {
	activeLink: string | null;
	setActiveLink: (link: string | null) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarContext = () => {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebarContext must be used within a SidebarProvider");
	}
	return context;
};

interface SidebarProviderProps {
	children: ReactNode;
	menuItems: { link: string }[];
}

export const SidebarProvider = ({
	children,
	menuItems,
}: SidebarProviderProps) => {
	const initial = menuItems.length > 0 ? menuItems[0].link : null;
	const [activeLink, setActiveLink] = useState<string | null>(initial);

	const value = useMemo(() => ({ activeLink, setActiveLink }), [activeLink]);

	return (
		<SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
	);
};
