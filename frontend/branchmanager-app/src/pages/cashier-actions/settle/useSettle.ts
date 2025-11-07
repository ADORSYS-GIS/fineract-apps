import { useCashierAction } from "../useCashierAction";

export function useSettle(
	tellerId: number,
	cashierId: number,
	currencyCode: string,
) {
	return useCashierAction("settle", tellerId, cashierId, currencyCode);
}
