import { CurrencyService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";

export const useCurrency = () => {
	const { data: currencies, isLoading: isCurrenciesLoading } = useQuery({
		queryKey: ["currencies"],
		queryFn: () => CurrencyService.getV1Currencies(),
		staleTime: Infinity,
	});

	const currencyCode = currencies?.selectedCurrencyOptions?.[0]?.code;

	return { currencyCode, isCurrenciesLoading };
};
