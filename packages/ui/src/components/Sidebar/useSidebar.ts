// useSidebar.ts
import { useSidebarContext } from "./Sidebar.context";

export const useSidebar = () => {
	const { activeLink, setActiveLink } = useSidebarContext();

	const handleClick = (link: string) => {
		setActiveLink(link);
	};

	return { activeLink, handleClick };
};
