// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { InfiniteData, UseInfiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { LoanAccountLockService, LoanTransactionsService } from "../requests/services.gen";
import { TransactionType } from "../requests/types.gen";
import * as Common from "./common";
export const useLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsInfinite = <TData = InfiniteData<Common.LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsDefaultResponse>, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ excludedTypes, loanExternalId, size, sort }: {
  excludedTypes?: TransactionType[];
  loanExternalId: string;
  size?: number;
  sort?: string;
}, queryKey?: TQueryKey, options?: Omit<UseInfiniteQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useInfiniteQuery({
  queryKey: Common.UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsKeyFn({ excludedTypes, loanExternalId, size, sort }, queryKey), queryFn: ({ pageParam }) => LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactions({ excludedTypes, loanExternalId, page: pageParam as number, size, sort }) as TData, initialPageParam: "1", getNextPageParam: response => (response as {
    nextPage: string;
  }).nextPage, ...options
});
export const useLoanTransactionsServiceGetV1LoansByLoanIdTransactionsInfinite = <TData = InfiniteData<Common.LoanTransactionsServiceGetV1LoansByLoanIdTransactionsDefaultResponse>, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ excludedTypes, loanId, size, sort }: {
  excludedTypes?: TransactionType[];
  loanId: number;
  size?: number;
  sort?: string;
}, queryKey?: TQueryKey, options?: Omit<UseInfiniteQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useInfiniteQuery({
  queryKey: Common.UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsKeyFn({ excludedTypes, loanId, size, sort }, queryKey), queryFn: ({ pageParam }) => LoanTransactionsService.getV1LoansByLoanIdTransactions({ excludedTypes, loanId, page: pageParam as number, size, sort }) as TData, initialPageParam: "1", getNextPageParam: response => (response as {
    nextPage: string;
  }).nextPage, ...options
});
export const useLoanAccountLockServiceGetV1LoansLockedInfinite = <TData = InfiniteData<Common.LoanAccountLockServiceGetV1LoansLockedDefaultResponse>, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit }: {
  limit?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseInfiniteQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useInfiniteQuery({
  queryKey: Common.UseLoanAccountLockServiceGetV1LoansLockedKeyFn({ limit }, queryKey), queryFn: ({ pageParam }) => LoanAccountLockService.getV1LoansLocked({ limit, page: pageParam as number }) as TData, initialPageParam: "1", getNextPageParam: response => (response as {
    nextPage: string;
  }).nextPage, ...options
});
