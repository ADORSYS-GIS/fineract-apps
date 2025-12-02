// Ensure i18n is initialized when consumers import the UI package.
// Apps that already initialize i18n can keep their own setup; this is a safe side-effect for most cases.
import "@fineract-apps/i18n";

export { AppLayout } from "./components/AppLayout";
// Button component and types
export { Button } from "./components/Button";
export { Card } from "./components/Card";
export {
	Form,
	FormTitle,
	FormWarning,
	Input,
	SubmitButton,
	useFormContext,
} from "./components/Form";
export * from "./components/LanguageSwitcher";
export { Navbar } from "./components/Navbar";
export { NotificationCard } from "./components/NotificationCard";
export { Pagination } from "./components/Pagination";
export { SearchBar } from "./components/SearchBar";
export * from "./components/Sidebar";
export { Table } from "./components/Table";
export type { TableColumn, TableProps } from "./components/Table/Table.types";
export { useBusinessDate } from "./hooks/useBusinessDate";
export { useOnClickOutside } from "./hooks/useOnClickOutside";
export {
	cn,
	formatBusinessDateForInput,
	formatCurrency,
	formatToFineractDate,
} from "./lib/utils";
export {
	getBusinessDate,
	getBusinessDateByType,
} from "./services/businessDateService";
export * from "./utils/auth";
