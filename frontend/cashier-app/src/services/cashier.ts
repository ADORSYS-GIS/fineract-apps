import {
	CashiersService,
	CurrencyService,
	FetchAuthenticatedUserDetailsService,
} from "@fineract-apps/fineract-api";

export const validateAndGetCashierData = async () => {
	const userDetails =
		await FetchAuthenticatedUserDetailsService.getV1Userdetails();
	const staffId = userDetails?.staffId;
	const officeId = userDetails?.officeId;

	if (!staffId || !officeId) {
		throw new Error("StaffId or OfficeId not available from user details");
	}

	const currencies = await CurrencyService.getV1Currencies();
	const currencyCode = currencies?.selectedCurrencyOptions?.[0]?.code;

	const cashierDataResponse = await CashiersService.getV1Cashiers({
		officeId,
		staffId,
	});

	if (cashierDataResponse && cashierDataResponse.length > 0) {
		return { cashierInfo: cashierDataResponse[0], currencyCode };
	}

	throw new Error(
		"No cashier data found for this user. Please contact an administrator.",
	);
};
