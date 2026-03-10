import { FC } from "react";
import { InventoryView } from "./Inventory.view.tsx";
import { useInventory } from "./useInventory.ts";

export const Inventory: FC = () => {
	const inventoryProps = useInventory();
	return <InventoryView {...inventoryProps} />;
};
