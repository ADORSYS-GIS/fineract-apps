import { useCashierAction } from "../useCashierAction";

export function useAllocate(
	tellerId: number,
	cashierId: number,
	currencyCode: string,
) {
	return useCashierAction("allocate", tellerId, cashierId, currencyCode);
}
