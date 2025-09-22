// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { AccountNumberFormatService, AccountTransfersService, AccountingClosureService, AccountingRulesService, AdhocQueryApiService, AuditsService, BulkImportService, BulkLoansService, BusinessDateManagementService, BusinessStepConfigurationService, CacheService, CalendarService, CashierJournalsService, CashiersService, CentersService, ChargesService, ClientChargesService, ClientCollateralManagementService, ClientFamilyMemberService, ClientIdentifierService, ClientService, ClientTransactionService, ClientsAddressService, CodeValuesService, CodesService, CollateralManagementService, CreditBureauConfigurationService, CurrencyService, DataTablesService, DefaultService, DelinquencyRangeAndBucketsManagementService, DepositAccountOnHoldFundTransactionsService, DeviceRegistrationService, DocumentsService, EntityDataTableService, EntityFieldConfigurationService, ExternalAssetOwnerLoanProductAttributesService, ExternalAssetOwnersService, ExternalEventConfigurationService, ExternalServicesService, FetchAuthenticatedUserDetailsService, FineractEntityService, FixedDepositAccountService, FixedDepositAccountTransactionsService, FixedDepositProductService, FloatingRatesService, FundsService, GeneralLedgerAccountService, GlobalConfigurationService, GroupsLevelService, GroupsService, GuarantorsService, HolidaysService, HooksService, InterOperationService, InterestRateChartService, InterestRateSlabAKAInterestBandsService, JournalEntriesService, LikelihoodService, ListReportMailingJobHistoryService, LoanAccountLockService, LoanBuyDownFeesService, LoanCapitalizedIncomeService, LoanChargesService, LoanCobCatchUpService, LoanCollateralManagementService, LoanCollateralService, LoanDisbursementDetailsService, LoanInterestPauseService, LoanProductsService, LoanTransactionsService, LoansPointInTimeService, LoansService, MakerCheckerOr4EyeFunctionalityService, MappingFinancialActivitiesToAccountsService, MeetingsService, MixMappingService, MixReportService, MixTaxonomyService, NotesService, NotificationService, OfficesService, PasswordPreferencesService, PaymentTypeService, PermissionsService, PocketService, PovertyLineService, ProductMixService, ProductsService, ProgressiveLoanService, ProvisioningCategoryService, ProvisioningCriteriaService, ProvisioningEntriesService, RateService, RecurringDepositAccountService, RecurringDepositAccountTransactionsService, RecurringDepositProductService, RepaymentWithPostDatedChecksService, ReportMailingJobsService, ReportsService, RescheduleLoansService, RolesService, RunReportsService, SavingsAccountService, SavingsAccountTransactionsService, SavingsChargesService, SavingsProductService, SchedulerJobService, SchedulerService, ScoreCardService, SearchApiService, SelfAccountTransferService, SelfClientService, SelfDividendService, SelfLoanProductsService, SelfLoansService, SelfRunReportService, SelfSavingsAccountService, SelfSavingsProductsService, SelfScoreCardService, SelfShareAccountsService, SelfShareProductsService, SelfSpmService, SelfThirdPartyTransferService, SelfUserDetailsService, ShareAccountService, SmsService, SpmApiLookUpTableService, SpmSurveysService, StaffService, StandingInstructionsHistoryService, StandingInstructionsService, SurveyService, TaxComponentsService, TaxGroupService, TellerCashManagementService, TwoFactorService, UserGeneratedDocumentsService, UsersService, WorkingDaysService } from "../requests/services.gen";
import { DateParam, TransactionType } from "../requests/types.gen";
import * as Common from "./common";
export const useDefaultServiceGetApplicationWadlSuspense = <TData = Common.DefaultServiceGetApplicationWadlDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetApplicationWadlKeyFn(queryKey), queryFn: () => DefaultService.getApplicationWadl() as TData, ...options });
export const useDefaultServiceGetApplicationWadlByPathSuspense = <TData = Common.DefaultServiceGetApplicationWadlByPathDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ path }: {
  path: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetApplicationWadlByPathKeyFn({ path }, queryKey), queryFn: () => DefaultService.getApplicationWadlByPath({ path }) as TData, ...options });
export const useDefaultServiceGetV1CreditBureauIntegrationCreditReportByCreditBureauIdSuspense = <TData = Common.DefaultServiceGetV1CreditBureauIntegrationCreditReportByCreditBureauIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ creditBureauId }: {
  creditBureauId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1CreditBureauIntegrationCreditReportByCreditBureauIdKeyFn({ creditBureauId }, queryKey), queryFn: () => DefaultService.getV1CreditBureauIntegrationCreditReportByCreditBureauId({ creditBureauId }) as TData, ...options });
export const useDefaultServiceGetV1EchoSuspense = <TData = Common.DefaultServiceGetV1EchoDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EchoKeyFn(queryKey), queryFn: () => DefaultService.getV1Echo() as TData, ...options });
export const useDefaultServiceGetV1EmailSuspense = <TData = Common.DefaultServiceGetV1EmailDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailKeyFn(queryKey), queryFn: () => DefaultService.getV1Email() as TData, ...options });
export const useDefaultServiceGetV1EmailCampaignSuspense = <TData = Common.DefaultServiceGetV1EmailCampaignDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailCampaignKeyFn(queryKey), queryFn: () => DefaultService.getV1EmailCampaign() as TData, ...options });
export const useDefaultServiceGetV1EmailCampaignTemplateSuspense = <TData = Common.DefaultServiceGetV1EmailCampaignTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailCampaignTemplateKeyFn(queryKey), queryFn: () => DefaultService.getV1EmailCampaignTemplate() as TData, ...options });
export const useDefaultServiceGetV1EmailCampaignTemplateByResourceIdSuspense = <TData = Common.DefaultServiceGetV1EmailCampaignTemplateByResourceIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailCampaignTemplateByResourceIdKeyFn({ resourceId }, queryKey), queryFn: () => DefaultService.getV1EmailCampaignTemplateByResourceId({ resourceId }) as TData, ...options });
export const useDefaultServiceGetV1EmailCampaignByResourceIdSuspense = <TData = Common.DefaultServiceGetV1EmailCampaignByResourceIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailCampaignByResourceIdKeyFn({ resourceId }, queryKey), queryFn: () => DefaultService.getV1EmailCampaignByResourceId({ resourceId }) as TData, ...options });
export const useDefaultServiceGetV1EmailConfigurationSuspense = <TData = Common.DefaultServiceGetV1EmailConfigurationDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailConfigurationKeyFn(queryKey), queryFn: () => DefaultService.getV1EmailConfiguration() as TData, ...options });
export const useDefaultServiceGetV1EmailFailedEmailSuspense = <TData = Common.DefaultServiceGetV1EmailFailedEmailDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailFailedEmailKeyFn({ limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => DefaultService.getV1EmailFailedEmail({ limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useDefaultServiceGetV1EmailMessageByStatusSuspense = <TData = Common.DefaultServiceGetV1EmailMessageByStatusDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }: {
  dateFormat?: string;
  fromDate?: DateParam;
  limit?: number;
  locale?: string;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  status?: number;
  toDate?: DateParam;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailMessageByStatusKeyFn({ dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }, queryKey), queryFn: () => DefaultService.getV1EmailMessageByStatus({ dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }) as TData, ...options });
export const useDefaultServiceGetV1EmailPendingEmailSuspense = <TData = Common.DefaultServiceGetV1EmailPendingEmailDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailPendingEmailKeyFn({ limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => DefaultService.getV1EmailPendingEmail({ limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useDefaultServiceGetV1EmailSentEmailSuspense = <TData = Common.DefaultServiceGetV1EmailSentEmailDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailSentEmailKeyFn({ limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => DefaultService.getV1EmailSentEmail({ limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useDefaultServiceGetV1EmailByResourceIdSuspense = <TData = Common.DefaultServiceGetV1EmailByResourceIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailByResourceIdKeyFn({ resourceId }, queryKey), queryFn: () => DefaultService.getV1EmailByResourceId({ resourceId }) as TData, ...options });
export const useDefaultServiceGetV1InternalClientByClientIdAuditSuspense = <TData = Common.DefaultServiceGetV1InternalClientByClientIdAuditDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1InternalClientByClientIdAuditKeyFn({ clientId }, queryKey), queryFn: () => DefaultService.getV1InternalClientByClientIdAudit({ clientId }) as TData, ...options });
export const useDefaultServiceGetV1InternalCobPartitionsByPartitionSizeSuspense = <TData = Common.DefaultServiceGetV1InternalCobPartitionsByPartitionSizeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ partitionSize }: {
  partitionSize: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1InternalCobPartitionsByPartitionSizeKeyFn({ partitionSize }, queryKey), queryFn: () => DefaultService.getV1InternalCobPartitionsByPartitionSize({ partitionSize }) as TData, ...options });
export const useDefaultServiceGetV1InternalExternaleventsSuspense = <TData = Common.DefaultServiceGetV1InternalExternaleventsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ aggregateRootId, category, idempotencyKey, type }: {
  aggregateRootId?: number;
  category?: string;
  idempotencyKey?: string;
  type?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1InternalExternaleventsKeyFn({ aggregateRootId, category, idempotencyKey, type }, queryKey), queryFn: () => DefaultService.getV1InternalExternalevents({ aggregateRootId, category, idempotencyKey, type }) as TData, ...options });
export const useDefaultServiceGetV1InternalLoanStatusByStatusIdSuspense = <TData = Common.DefaultServiceGetV1InternalLoanStatusByStatusIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ statusId }: {
  statusId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1InternalLoanStatusByStatusIdKeyFn({ statusId }, queryKey), queryFn: () => DefaultService.getV1InternalLoanStatusByStatusId({ statusId }) as TData, ...options });
export const useDefaultServiceGetV1InternalLoanByLoanIdAdvancedPaymentAllocationRulesSuspense = <TData = Common.DefaultServiceGetV1InternalLoanByLoanIdAdvancedPaymentAllocationRulesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1InternalLoanByLoanIdAdvancedPaymentAllocationRulesKeyFn({ loanId }, queryKey), queryFn: () => DefaultService.getV1InternalLoanByLoanIdAdvancedPaymentAllocationRules({ loanId }) as TData, ...options });
export const useDefaultServiceGetV1InternalLoanByLoanIdAuditSuspense = <TData = Common.DefaultServiceGetV1InternalLoanByLoanIdAuditDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1InternalLoanByLoanIdAuditKeyFn({ loanId }, queryKey), queryFn: () => DefaultService.getV1InternalLoanByLoanIdAudit({ loanId }) as TData, ...options });
export const useDefaultServiceGetV1InternalLoanByLoanIdTransactionByTransactionIdAuditSuspense = <TData = Common.DefaultServiceGetV1InternalLoanByLoanIdTransactionByTransactionIdAuditDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId, transactionId }: {
  loanId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1InternalLoanByLoanIdTransactionByTransactionIdAuditKeyFn({ loanId, transactionId }, queryKey), queryFn: () => DefaultService.getV1InternalLoanByLoanIdTransactionByTransactionIdAudit({ loanId, transactionId }) as TData, ...options });
export const useDefaultServiceGetV1OfficetransactionsSuspense = <TData = Common.DefaultServiceGetV1OfficetransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1OfficetransactionsKeyFn(queryKey), queryFn: () => DefaultService.getV1Officetransactions() as TData, ...options });
export const useDefaultServiceGetV1OfficetransactionsTemplateSuspense = <TData = Common.DefaultServiceGetV1OfficetransactionsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1OfficetransactionsTemplateKeyFn(queryKey), queryFn: () => DefaultService.getV1OfficetransactionsTemplate() as TData, ...options });
export const useDefaultServiceGetV1SmscampaignsSuspense = <TData = Common.DefaultServiceGetV1SmscampaignsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1SmscampaignsKeyFn({ limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => DefaultService.getV1Smscampaigns({ limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useDefaultServiceGetV1SmscampaignsTemplateSuspense = <TData = Common.DefaultServiceGetV1SmscampaignsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1SmscampaignsTemplateKeyFn(queryKey), queryFn: () => DefaultService.getV1SmscampaignsTemplate() as TData, ...options });
export const useDefaultServiceGetV1SmscampaignsByResourceIdSuspense = <TData = Common.DefaultServiceGetV1SmscampaignsByResourceIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1SmscampaignsByResourceIdKeyFn({ resourceId }, queryKey), queryFn: () => DefaultService.getV1SmscampaignsByResourceId({ resourceId }) as TData, ...options });
export const useDefaultServiceGetV1TwofactorConfigureSuspense = <TData = Common.DefaultServiceGetV1TwofactorConfigureDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1TwofactorConfigureKeyFn(queryKey), queryFn: () => DefaultService.getV1TwofactorConfigure() as TData, ...options });
export const useDefaultServiceGetV1ByEntityByEntityIdImagesSuspense = <TData = Common.DefaultServiceGetV1ByEntityByEntityIdImagesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accept, entity, entityId, maxHeight, maxWidth, output }: {
  accept?: string;
  entity: string;
  entityId: number;
  maxHeight?: number;
  maxWidth?: number;
  output?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1ByEntityByEntityIdImagesKeyFn({ accept, entity, entityId, maxHeight, maxWidth, output }, queryKey), queryFn: () => DefaultService.getV1ByEntityByEntityIdImages({ accept, entity, entityId, maxHeight, maxWidth, output }) as TData, ...options });
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationSuspense = <TData = Common.CreditBureauConfigurationServiceGetV1CreditBureauConfigurationDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationKeyFn(queryKey), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfiguration() as TData, ...options });
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationConfigByOrganisationCreditBureauIdSuspense = <TData = Common.CreditBureauConfigurationServiceGetV1CreditBureauConfigurationConfigByOrganisationCreditBureauIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ organisationCreditBureauId }: {
  organisationCreditBureauId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationConfigByOrganisationCreditBureauIdKeyFn({ organisationCreditBureauId }, queryKey), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationConfigByOrganisationCreditBureauId({ organisationCreditBureauId }) as TData, ...options });
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductSuspense = <TData = Common.CreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductKeyFn(queryKey), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationLoanProduct() as TData, ...options });
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductByLoanProductIdSuspense = <TData = Common.CreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductByLoanProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanProductId }: {
  loanProductId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductByLoanProductIdKeyFn({ loanProductId }, queryKey), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationLoanProductByLoanProductId({ loanProductId }) as TData, ...options });
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationMappingsSuspense = <TData = Common.CreditBureauConfigurationServiceGetV1CreditBureauConfigurationMappingsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationMappingsKeyFn(queryKey), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationMappings() as TData, ...options });
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationOrganisationCreditBureauSuspense = <TData = Common.CreditBureauConfigurationServiceGetV1CreditBureauConfigurationOrganisationCreditBureauDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationOrganisationCreditBureauKeyFn(queryKey), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationOrganisationCreditBureau() as TData, ...options });
export const useAccountingRulesServiceGetV1AccountingrulesSuspense = <TData = Common.AccountingRulesServiceGetV1AccountingrulesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAccountingRulesServiceGetV1AccountingrulesKeyFn(queryKey), queryFn: () => AccountingRulesService.getV1Accountingrules() as TData, ...options });
export const useAccountingRulesServiceGetV1AccountingrulesTemplateSuspense = <TData = Common.AccountingRulesServiceGetV1AccountingrulesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAccountingRulesServiceGetV1AccountingrulesTemplateKeyFn(queryKey), queryFn: () => AccountingRulesService.getV1AccountingrulesTemplate() as TData, ...options });
export const useAccountingRulesServiceGetV1AccountingrulesByAccountingRuleIdSuspense = <TData = Common.AccountingRulesServiceGetV1AccountingrulesByAccountingRuleIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountingRuleId }: {
  accountingRuleId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAccountingRulesServiceGetV1AccountingrulesByAccountingRuleIdKeyFn({ accountingRuleId }, queryKey), queryFn: () => AccountingRulesService.getV1AccountingrulesByAccountingRuleId({ accountingRuleId }) as TData, ...options });
export const useAccountNumberFormatServiceGetV1AccountnumberformatsSuspense = <TData = Common.AccountNumberFormatServiceGetV1AccountnumberformatsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAccountNumberFormatServiceGetV1AccountnumberformatsKeyFn(queryKey), queryFn: () => AccountNumberFormatService.getV1Accountnumberformats() as TData, ...options });
export const useAccountNumberFormatServiceGetV1AccountnumberformatsTemplateSuspense = <TData = Common.AccountNumberFormatServiceGetV1AccountnumberformatsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAccountNumberFormatServiceGetV1AccountnumberformatsTemplateKeyFn(queryKey), queryFn: () => AccountNumberFormatService.getV1AccountnumberformatsTemplate() as TData, ...options });
export const useAccountNumberFormatServiceGetV1AccountnumberformatsByAccountNumberFormatIdSuspense = <TData = Common.AccountNumberFormatServiceGetV1AccountnumberformatsByAccountNumberFormatIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountNumberFormatId }: {
  accountNumberFormatId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAccountNumberFormatServiceGetV1AccountnumberformatsByAccountNumberFormatIdKeyFn({ accountNumberFormatId }, queryKey), queryFn: () => AccountNumberFormatService.getV1AccountnumberformatsByAccountNumberFormatId({ accountNumberFormatId }) as TData, ...options });
export const useShareAccountServiceGetV1AccountsByTypeSuspense = <TData = Common.ShareAccountServiceGetV1AccountsByTypeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, type }: {
  limit?: number;
  offset?: number;
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseShareAccountServiceGetV1AccountsByTypeKeyFn({ limit, offset, type }, queryKey), queryFn: () => ShareAccountService.getV1AccountsByType({ limit, offset, type }) as TData, ...options });
export const useShareAccountServiceGetV1AccountsByTypeDownloadtemplateSuspense = <TData = Common.ShareAccountServiceGetV1AccountsByTypeDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId, type }: {
  dateFormat?: string;
  officeId?: number;
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseShareAccountServiceGetV1AccountsByTypeDownloadtemplateKeyFn({ dateFormat, officeId, type }, queryKey), queryFn: () => ShareAccountService.getV1AccountsByTypeDownloadtemplate({ dateFormat, officeId, type }) as TData, ...options });
export const useShareAccountServiceGetV1AccountsByTypeTemplateSuspense = <TData = Common.ShareAccountServiceGetV1AccountsByTypeTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, productId, type }: {
  clientId?: number;
  productId?: number;
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseShareAccountServiceGetV1AccountsByTypeTemplateKeyFn({ clientId, productId, type }, queryKey), queryFn: () => ShareAccountService.getV1AccountsByTypeTemplate({ clientId, productId, type }) as TData, ...options });
export const useShareAccountServiceGetV1AccountsByTypeByAccountIdSuspense = <TData = Common.ShareAccountServiceGetV1AccountsByTypeByAccountIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, type }: {
  accountId: number;
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseShareAccountServiceGetV1AccountsByTypeByAccountIdKeyFn({ accountId, type }, queryKey), queryFn: () => ShareAccountService.getV1AccountsByTypeByAccountId({ accountId, type }) as TData, ...options });
export const useAccountTransfersServiceGetV1AccounttransfersSuspense = <TData = Common.AccountTransfersServiceGetV1AccounttransfersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountDetailId, externalId, limit, offset, orderBy, sortOrder }: {
  accountDetailId?: number;
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAccountTransfersServiceGetV1AccounttransfersKeyFn({ accountDetailId, externalId, limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => AccountTransfersService.getV1Accounttransfers({ accountDetailId, externalId, limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useAccountTransfersServiceGetV1AccounttransfersTemplateSuspense = <TData = Common.AccountTransfersServiceGetV1AccounttransfersTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }: {
  fromAccountId?: number;
  fromAccountType?: number;
  fromClientId?: number;
  fromOfficeId?: number;
  toAccountId?: number;
  toAccountType?: number;
  toClientId?: number;
  toOfficeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAccountTransfersServiceGetV1AccounttransfersTemplateKeyFn({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }, queryKey), queryFn: () => AccountTransfersService.getV1AccounttransfersTemplate({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }) as TData, ...options });
export const useAccountTransfersServiceGetV1AccounttransfersTemplateRefundByTransferSuspense = <TData = Common.AccountTransfersServiceGetV1AccounttransfersTemplateRefundByTransferDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }: {
  fromAccountId?: number;
  fromAccountType?: number;
  fromClientId?: number;
  fromOfficeId?: number;
  toAccountId?: number;
  toAccountType?: number;
  toClientId?: number;
  toOfficeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAccountTransfersServiceGetV1AccounttransfersTemplateRefundByTransferKeyFn({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }, queryKey), queryFn: () => AccountTransfersService.getV1AccounttransfersTemplateRefundByTransfer({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }) as TData, ...options });
export const useAccountTransfersServiceGetV1AccounttransfersByTransferIdSuspense = <TData = Common.AccountTransfersServiceGetV1AccounttransfersByTransferIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ transferId }: {
  transferId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAccountTransfersServiceGetV1AccounttransfersByTransferIdKeyFn({ transferId }, queryKey), queryFn: () => AccountTransfersService.getV1AccounttransfersByTransferId({ transferId }) as TData, ...options });
export const useAdhocQueryApiServiceGetV1AdhocquerySuspense = <TData = Common.AdhocQueryApiServiceGetV1AdhocqueryDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAdhocQueryApiServiceGetV1AdhocqueryKeyFn(queryKey), queryFn: () => AdhocQueryApiService.getV1Adhocquery() as TData, ...options });
export const useAdhocQueryApiServiceGetV1AdhocqueryTemplateSuspense = <TData = Common.AdhocQueryApiServiceGetV1AdhocqueryTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAdhocQueryApiServiceGetV1AdhocqueryTemplateKeyFn(queryKey), queryFn: () => AdhocQueryApiService.getV1AdhocqueryTemplate() as TData, ...options });
export const useAdhocQueryApiServiceGetV1AdhocqueryByAdHocIdSuspense = <TData = Common.AdhocQueryApiServiceGetV1AdhocqueryByAdHocIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ adHocId }: {
  adHocId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAdhocQueryApiServiceGetV1AdhocqueryByAdHocIdKeyFn({ adHocId }, queryKey), queryFn: () => AdhocQueryApiService.getV1AdhocqueryByAdHocId({ adHocId }) as TData, ...options });
export const useAuditsServiceGetV1AuditsSuspense = <TData = Common.AuditsServiceGetV1AuditsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ actionName, checkerDateTimeFrom, checkerDateTimeTo, checkerId, clientId, dateFormat, entityName, groupId, limit, loanId, locale, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, offset, orderBy, paged, processingResult, resourceId, savingsAccountId, sortOrder, status }: {
  actionName?: string;
  checkerDateTimeFrom?: string;
  checkerDateTimeTo?: string;
  checkerId?: number;
  clientId?: number;
  dateFormat?: string;
  entityName?: string;
  groupId?: number;
  limit?: number;
  loanId?: number;
  locale?: string;
  makerDateTimeFrom?: string;
  makerDateTimeTo?: string;
  makerId?: number;
  officeId?: number;
  offset?: number;
  orderBy?: string;
  paged?: boolean;
  processingResult?: string;
  resourceId?: number;
  savingsAccountId?: number;
  sortOrder?: string;
  status?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAuditsServiceGetV1AuditsKeyFn({ actionName, checkerDateTimeFrom, checkerDateTimeTo, checkerId, clientId, dateFormat, entityName, groupId, limit, loanId, locale, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, offset, orderBy, paged, processingResult, resourceId, savingsAccountId, sortOrder, status }, queryKey), queryFn: () => AuditsService.getV1Audits({ actionName, checkerDateTimeFrom, checkerDateTimeTo, checkerId, clientId, dateFormat, entityName, groupId, limit, loanId, locale, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, offset, orderBy, paged, processingResult, resourceId, savingsAccountId, sortOrder, status }) as TData, ...options });
export const useAuditsServiceGetV1AuditsSearchtemplateSuspense = <TData = Common.AuditsServiceGetV1AuditsSearchtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAuditsServiceGetV1AuditsSearchtemplateKeyFn(queryKey), queryFn: () => AuditsService.getV1AuditsSearchtemplate() as TData, ...options });
export const useAuditsServiceGetV1AuditsByAuditIdSuspense = <TData = Common.AuditsServiceGetV1AuditsByAuditIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ auditId }: {
  auditId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAuditsServiceGetV1AuditsByAuditIdKeyFn({ auditId }, queryKey), queryFn: () => AuditsService.getV1AuditsByAuditId({ auditId }) as TData, ...options });
export const useBusinessDateManagementServiceGetV1BusinessdateSuspense = <TData = Common.BusinessDateManagementServiceGetV1BusinessdateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseBusinessDateManagementServiceGetV1BusinessdateKeyFn(queryKey), queryFn: () => BusinessDateManagementService.getV1Businessdate() as TData, ...options });
export const useBusinessDateManagementServiceGetV1BusinessdateByTypeSuspense = <TData = Common.BusinessDateManagementServiceGetV1BusinessdateByTypeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ type }: {
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseBusinessDateManagementServiceGetV1BusinessdateByTypeKeyFn({ type }, queryKey), queryFn: () => BusinessDateManagementService.getV1BusinessdateByType({ type }) as TData, ...options });
export const useCacheServiceGetV1CachesSuspense = <TData = Common.CacheServiceGetV1CachesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCacheServiceGetV1CachesKeyFn(queryKey), queryFn: () => CacheService.getV1Caches() as TData, ...options });
export const useCashiersServiceGetV1CashiersSuspense = <TData = Common.CashiersServiceGetV1CashiersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ date, officeId, staffId, tellerId }: {
  date?: string;
  officeId?: number;
  staffId?: number;
  tellerId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCashiersServiceGetV1CashiersKeyFn({ date, officeId, staffId, tellerId }, queryKey), queryFn: () => CashiersService.getV1Cashiers({ date, officeId, staffId, tellerId }) as TData, ...options });
export const useCashierJournalsServiceGetV1CashiersjournalSuspense = <TData = Common.CashierJournalsServiceGetV1CashiersjournalDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ cashierId, dateRange, officeId, tellerId }: {
  cashierId?: number;
  dateRange?: string;
  officeId?: number;
  tellerId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCashierJournalsServiceGetV1CashiersjournalKeyFn({ cashierId, dateRange, officeId, tellerId }, queryKey), queryFn: () => CashierJournalsService.getV1Cashiersjournal({ cashierId, dateRange, officeId, tellerId }) as TData, ...options });
export const useCentersServiceGetV1CentersSuspense = <TData = Common.CentersServiceGetV1CentersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, externalId, limit, locale, meetingDate, name, officeId, offset, orderBy, paged, sortOrder, staffId, underHierarchy }: {
  dateFormat?: string;
  externalId?: string;
  limit?: number;
  locale?: string;
  meetingDate?: DateParam;
  name?: string;
  officeId?: number;
  offset?: number;
  orderBy?: string;
  paged?: boolean;
  sortOrder?: string;
  staffId?: number;
  underHierarchy?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCentersServiceGetV1CentersKeyFn({ dateFormat, externalId, limit, locale, meetingDate, name, officeId, offset, orderBy, paged, sortOrder, staffId, underHierarchy }, queryKey), queryFn: () => CentersService.getV1Centers({ dateFormat, externalId, limit, locale, meetingDate, name, officeId, offset, orderBy, paged, sortOrder, staffId, underHierarchy }) as TData, ...options });
export const useCentersServiceGetV1CentersDownloadtemplateSuspense = <TData = Common.CentersServiceGetV1CentersDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCentersServiceGetV1CentersDownloadtemplateKeyFn({ dateFormat, officeId, staffId }, queryKey), queryFn: () => CentersService.getV1CentersDownloadtemplate({ dateFormat, officeId, staffId }) as TData, ...options });
export const useCentersServiceGetV1CentersTemplateSuspense = <TData = Common.CentersServiceGetV1CentersTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ command, officeId, staffInSelectedOfficeOnly }: {
  command?: string;
  officeId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCentersServiceGetV1CentersTemplateKeyFn({ command, officeId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => CentersService.getV1CentersTemplate({ command, officeId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useCentersServiceGetV1CentersByCenterIdSuspense = <TData = Common.CentersServiceGetV1CentersByCenterIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ centerId, staffInSelectedOfficeOnly }: {
  centerId: number;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCentersServiceGetV1CentersByCenterIdKeyFn({ centerId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => CentersService.getV1CentersByCenterId({ centerId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useCentersServiceGetV1CentersByCenterIdAccountsSuspense = <TData = Common.CentersServiceGetV1CentersByCenterIdAccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ centerId }: {
  centerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCentersServiceGetV1CentersByCenterIdAccountsKeyFn({ centerId }, queryKey), queryFn: () => CentersService.getV1CentersByCenterIdAccounts({ centerId }) as TData, ...options });
export const useChargesServiceGetV1ChargesSuspense = <TData = Common.ChargesServiceGetV1ChargesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseChargesServiceGetV1ChargesKeyFn(queryKey), queryFn: () => ChargesService.getV1Charges() as TData, ...options });
export const useChargesServiceGetV1ChargesTemplateSuspense = <TData = Common.ChargesServiceGetV1ChargesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseChargesServiceGetV1ChargesTemplateKeyFn(queryKey), queryFn: () => ChargesService.getV1ChargesTemplate() as TData, ...options });
export const useChargesServiceGetV1ChargesByChargeIdSuspense = <TData = Common.ChargesServiceGetV1ChargesByChargeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chargeId }: {
  chargeId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseChargesServiceGetV1ChargesByChargeIdKeyFn({ chargeId }, queryKey), queryFn: () => ChargesService.getV1ChargesByChargeId({ chargeId }) as TData, ...options });
export const useClientsAddressServiceGetV1ClientAddressesTemplateSuspense = <TData = Common.ClientsAddressServiceGetV1ClientAddressesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientsAddressServiceGetV1ClientAddressesTemplateKeyFn(queryKey), queryFn: () => ClientsAddressService.getV1ClientAddressesTemplate() as TData, ...options });
export const useClientsAddressServiceGetV1ClientByClientidAddressesSuspense = <TData = Common.ClientsAddressServiceGetV1ClientByClientidAddressesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientid, status, type }: {
  clientid: number;
  status?: string;
  type?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientsAddressServiceGetV1ClientByClientidAddressesKeyFn({ clientid, status, type }, queryKey), queryFn: () => ClientsAddressService.getV1ClientByClientidAddresses({ clientid, status, type }) as TData, ...options });
export const useClientServiceGetV1ClientsSuspense = <TData = Common.ClientServiceGetV1ClientsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ displayName, externalId, firstName, lastName, legalForm, limit, officeId, offset, orderBy, orphansOnly, sortOrder, status, underHierarchy }: {
  displayName?: string;
  externalId?: string;
  firstName?: string;
  lastName?: string;
  legalForm?: number;
  limit?: number;
  officeId?: number;
  offset?: number;
  orderBy?: string;
  orphansOnly?: boolean;
  sortOrder?: string;
  status?: string;
  underHierarchy?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsKeyFn({ displayName, externalId, firstName, lastName, legalForm, limit, officeId, offset, orderBy, orphansOnly, sortOrder, status, underHierarchy }, queryKey), queryFn: () => ClientService.getV1Clients({ displayName, externalId, firstName, lastName, legalForm, limit, officeId, offset, orderBy, orphansOnly, sortOrder, status, underHierarchy }) as TData, ...options });
export const useClientServiceGetV1ClientsDownloadtemplateSuspense = <TData = Common.ClientServiceGetV1ClientsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, legalFormType, officeId, staffId }: {
  dateFormat?: string;
  legalFormType?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsDownloadtemplateKeyFn({ dateFormat, legalFormType, officeId, staffId }, queryKey), queryFn: () => ClientService.getV1ClientsDownloadtemplate({ dateFormat, legalFormType, officeId, staffId }) as TData, ...options });
export const useClientServiceGetV1ClientsExternalIdByExternalIdSuspense = <TData = Common.ClientServiceGetV1ClientsExternalIdByExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalId, staffInSelectedOfficeOnly }: {
  externalId: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsExternalIdByExternalIdKeyFn({ externalId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => ClientService.getV1ClientsExternalIdByExternalId({ externalId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useClientServiceGetV1ClientsExternalIdByExternalIdAccountsSuspense = <TData = Common.ClientServiceGetV1ClientsExternalIdByExternalIdAccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalId }: {
  externalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsExternalIdByExternalIdAccountsKeyFn({ externalId }, queryKey), queryFn: () => ClientService.getV1ClientsExternalIdByExternalIdAccounts({ externalId }) as TData, ...options });
export const useClientServiceGetV1ClientsExternalIdByExternalIdObligeedetailsSuspense = <TData = Common.ClientServiceGetV1ClientsExternalIdByExternalIdObligeedetailsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalId }: {
  externalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsExternalIdByExternalIdObligeedetailsKeyFn({ externalId }, queryKey), queryFn: () => ClientService.getV1ClientsExternalIdByExternalIdObligeedetails({ externalId }) as TData, ...options });
export const useClientServiceGetV1ClientsExternalIdByExternalIdTransferproposaldateSuspense = <TData = Common.ClientServiceGetV1ClientsExternalIdByExternalIdTransferproposaldateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalId }: {
  externalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsExternalIdByExternalIdTransferproposaldateKeyFn({ externalId }, queryKey), queryFn: () => ClientService.getV1ClientsExternalIdByExternalIdTransferproposaldate({ externalId }) as TData, ...options });
export const useClientServiceGetV1ClientsTemplateSuspense = <TData = Common.ClientServiceGetV1ClientsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ commandParam, officeId, staffInSelectedOfficeOnly }: {
  commandParam?: string;
  officeId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsTemplateKeyFn({ commandParam, officeId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => ClientService.getV1ClientsTemplate({ commandParam, officeId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useClientServiceGetV1ClientsByClientIdSuspense = <TData = Common.ClientServiceGetV1ClientsByClientIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, staffInSelectedOfficeOnly }: {
  clientId: number;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsByClientIdKeyFn({ clientId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => ClientService.getV1ClientsByClientId({ clientId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useClientServiceGetV1ClientsByClientIdAccountsSuspense = <TData = Common.ClientServiceGetV1ClientsByClientIdAccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsByClientIdAccountsKeyFn({ clientId }, queryKey), queryFn: () => ClientService.getV1ClientsByClientIdAccounts({ clientId }) as TData, ...options });
export const useClientServiceGetV1ClientsByClientIdObligeedetailsSuspense = <TData = Common.ClientServiceGetV1ClientsByClientIdObligeedetailsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsByClientIdObligeedetailsKeyFn({ clientId }, queryKey), queryFn: () => ClientService.getV1ClientsByClientIdObligeedetails({ clientId }) as TData, ...options });
export const useClientServiceGetV1ClientsByClientIdTransferproposaldateSuspense = <TData = Common.ClientServiceGetV1ClientsByClientIdTransferproposaldateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsByClientIdTransferproposaldateKeyFn({ clientId }, queryKey), queryFn: () => ClientService.getV1ClientsByClientIdTransferproposaldate({ clientId }) as TData, ...options });
export const useClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsSuspense = <TData = Common.ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientExternalId, limit, offset }: {
  clientExternalId: string;
  limit?: number;
  offset?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsKeyFn({ clientExternalId, limit, offset }, queryKey), queryFn: () => ClientTransactionService.getV1ClientsExternalIdByClientExternalIdTransactions({ clientExternalId, limit, offset }) as TData, ...options });
export const useClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalIdSuspense = <TData = Common.ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientExternalId, transactionExternalId }: {
  clientExternalId: string;
  transactionExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalIdKeyFn({ clientExternalId, transactionExternalId }, queryKey), queryFn: () => ClientTransactionService.getV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalId({ clientExternalId, transactionExternalId }) as TData, ...options });
export const useClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsByTransactionIdSuspense = <TData = Common.ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientExternalId, transactionId }: {
  clientExternalId: string;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsByTransactionIdKeyFn({ clientExternalId, transactionId }, queryKey), queryFn: () => ClientTransactionService.getV1ClientsExternalIdByClientExternalIdTransactionsByTransactionId({ clientExternalId, transactionId }) as TData, ...options });
export const useClientTransactionServiceGetV1ClientsByClientIdTransactionsSuspense = <TData = Common.ClientTransactionServiceGetV1ClientsByClientIdTransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, limit, offset }: {
  clientId: number;
  limit?: number;
  offset?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientTransactionServiceGetV1ClientsByClientIdTransactionsKeyFn({ clientId, limit, offset }, queryKey), queryFn: () => ClientTransactionService.getV1ClientsByClientIdTransactions({ clientId, limit, offset }) as TData, ...options });
export const useClientTransactionServiceGetV1ClientsByClientIdTransactionsExternalIdByTransactionExternalIdSuspense = <TData = Common.ClientTransactionServiceGetV1ClientsByClientIdTransactionsExternalIdByTransactionExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, transactionExternalId }: {
  clientId: number;
  transactionExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientTransactionServiceGetV1ClientsByClientIdTransactionsExternalIdByTransactionExternalIdKeyFn({ clientId, transactionExternalId }, queryKey), queryFn: () => ClientTransactionService.getV1ClientsByClientIdTransactionsExternalIdByTransactionExternalId({ clientId, transactionExternalId }) as TData, ...options });
export const useClientTransactionServiceGetV1ClientsByClientIdTransactionsByTransactionIdSuspense = <TData = Common.ClientTransactionServiceGetV1ClientsByClientIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, transactionId }: {
  clientId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientTransactionServiceGetV1ClientsByClientIdTransactionsByTransactionIdKeyFn({ clientId, transactionId }, queryKey), queryFn: () => ClientTransactionService.getV1ClientsByClientIdTransactionsByTransactionId({ clientId, transactionId }) as TData, ...options });
export const useClientChargesServiceGetV1ClientsByClientIdChargesSuspense = <TData = Common.ClientChargesServiceGetV1ClientsByClientIdChargesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chargeStatus, clientId, limit, offset, pendingPayment }: {
  chargeStatus?: string;
  clientId: number;
  limit?: number;
  offset?: number;
  pendingPayment?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientChargesServiceGetV1ClientsByClientIdChargesKeyFn({ chargeStatus, clientId, limit, offset, pendingPayment }, queryKey), queryFn: () => ClientChargesService.getV1ClientsByClientIdCharges({ chargeStatus, clientId, limit, offset, pendingPayment }) as TData, ...options });
export const useClientChargesServiceGetV1ClientsByClientIdChargesTemplateSuspense = <TData = Common.ClientChargesServiceGetV1ClientsByClientIdChargesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientChargesServiceGetV1ClientsByClientIdChargesTemplateKeyFn({ clientId }, queryKey), queryFn: () => ClientChargesService.getV1ClientsByClientIdChargesTemplate({ clientId }) as TData, ...options });
export const useClientChargesServiceGetV1ClientsByClientIdChargesByChargeIdSuspense = <TData = Common.ClientChargesServiceGetV1ClientsByClientIdChargesByChargeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chargeId, clientId }: {
  chargeId: number;
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientChargesServiceGetV1ClientsByClientIdChargesByChargeIdKeyFn({ chargeId, clientId }, queryKey), queryFn: () => ClientChargesService.getV1ClientsByClientIdChargesByChargeId({ chargeId, clientId }) as TData, ...options });
export const useClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsSuspense = <TData = Common.ClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, prodId }: {
  clientId: number;
  prodId?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsKeyFn({ clientId, prodId }, queryKey), queryFn: () => ClientCollateralManagementService.getV1ClientsByClientIdCollaterals({ clientId, prodId }) as TData, ...options });
export const useClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsTemplateSuspense = <TData = Common.ClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsTemplateKeyFn({ clientId }, queryKey), queryFn: () => ClientCollateralManagementService.getV1ClientsByClientIdCollateralsTemplate({ clientId }) as TData, ...options });
export const useClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsByClientCollateralIdSuspense = <TData = Common.ClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsByClientCollateralIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientCollateralId, clientId }: {
  clientCollateralId: number;
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsByClientCollateralIdKeyFn({ clientCollateralId, clientId }, queryKey), queryFn: () => ClientCollateralManagementService.getV1ClientsByClientIdCollateralsByClientCollateralId({ clientCollateralId, clientId }) as TData, ...options });
export const useClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersSuspense = <TData = Common.ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersKeyFn({ clientId }, queryKey), queryFn: () => ClientFamilyMemberService.getV1ClientsByClientIdFamilymembers({ clientId }) as TData, ...options });
export const useClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersTemplateSuspense = <TData = Common.ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersTemplateKeyFn({ clientId }, queryKey), queryFn: () => ClientFamilyMemberService.getV1ClientsByClientIdFamilymembersTemplate({ clientId }) as TData, ...options });
export const useClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersByFamilyMemberIdSuspense = <TData = Common.ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersByFamilyMemberIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, familyMemberId }: {
  clientId: number;
  familyMemberId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersByFamilyMemberIdKeyFn({ clientId, familyMemberId }, queryKey), queryFn: () => ClientFamilyMemberService.getV1ClientsByClientIdFamilymembersByFamilyMemberId({ clientId, familyMemberId }) as TData, ...options });
export const useClientIdentifierServiceGetV1ClientsByClientIdIdentifiersSuspense = <TData = Common.ClientIdentifierServiceGetV1ClientsByClientIdIdentifiersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersKeyFn({ clientId }, queryKey), queryFn: () => ClientIdentifierService.getV1ClientsByClientIdIdentifiers({ clientId }) as TData, ...options });
export const useClientIdentifierServiceGetV1ClientsByClientIdIdentifiersTemplateSuspense = <TData = Common.ClientIdentifierServiceGetV1ClientsByClientIdIdentifiersTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersTemplateKeyFn({ clientId }, queryKey), queryFn: () => ClientIdentifierService.getV1ClientsByClientIdIdentifiersTemplate({ clientId }) as TData, ...options });
export const useClientIdentifierServiceGetV1ClientsByClientIdIdentifiersByIdentifierIdSuspense = <TData = Common.ClientIdentifierServiceGetV1ClientsByClientIdIdentifiersByIdentifierIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, identifierId }: {
  clientId: number;
  identifierId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersByIdentifierIdKeyFn({ clientId, identifierId }, queryKey), queryFn: () => ClientIdentifierService.getV1ClientsByClientIdIdentifiersByIdentifierId({ clientId, identifierId }) as TData, ...options });
export const useCodesServiceGetV1CodesSuspense = <TData = Common.CodesServiceGetV1CodesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCodesServiceGetV1CodesKeyFn(queryKey), queryFn: () => CodesService.getV1Codes() as TData, ...options });
export const useCodesServiceGetV1CodesByCodeIdSuspense = <TData = Common.CodesServiceGetV1CodesByCodeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ codeId }: {
  codeId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCodesServiceGetV1CodesByCodeIdKeyFn({ codeId }, queryKey), queryFn: () => CodesService.getV1CodesByCodeId({ codeId }) as TData, ...options });
export const useCodeValuesServiceGetV1CodesByCodeIdCodevaluesSuspense = <TData = Common.CodeValuesServiceGetV1CodesByCodeIdCodevaluesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ codeId }: {
  codeId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCodeValuesServiceGetV1CodesByCodeIdCodevaluesKeyFn({ codeId }, queryKey), queryFn: () => CodeValuesService.getV1CodesByCodeIdCodevalues({ codeId }) as TData, ...options });
export const useCodeValuesServiceGetV1CodesByCodeIdCodevaluesByCodeValueIdSuspense = <TData = Common.CodeValuesServiceGetV1CodesByCodeIdCodevaluesByCodeValueIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ codeId, codeValueId }: {
  codeId: number;
  codeValueId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCodeValuesServiceGetV1CodesByCodeIdCodevaluesByCodeValueIdKeyFn({ codeId, codeValueId }, queryKey), queryFn: () => CodeValuesService.getV1CodesByCodeIdCodevaluesByCodeValueId({ codeId, codeValueId }) as TData, ...options });
export const useCollateralManagementServiceGetV1CollateralManagementSuspense = <TData = Common.CollateralManagementServiceGetV1CollateralManagementDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCollateralManagementServiceGetV1CollateralManagementKeyFn(queryKey), queryFn: () => CollateralManagementService.getV1CollateralManagement() as TData, ...options });
export const useCollateralManagementServiceGetV1CollateralManagementTemplateSuspense = <TData = Common.CollateralManagementServiceGetV1CollateralManagementTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCollateralManagementServiceGetV1CollateralManagementTemplateKeyFn(queryKey), queryFn: () => CollateralManagementService.getV1CollateralManagementTemplate() as TData, ...options });
export const useCollateralManagementServiceGetV1CollateralManagementByCollateralIdSuspense = <TData = Common.CollateralManagementServiceGetV1CollateralManagementByCollateralIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ collateralId }: {
  collateralId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCollateralManagementServiceGetV1CollateralManagementByCollateralIdKeyFn({ collateralId }, queryKey), queryFn: () => CollateralManagementService.getV1CollateralManagementByCollateralId({ collateralId }) as TData, ...options });
export const useGlobalConfigurationServiceGetV1ConfigurationsSuspense = <TData = Common.GlobalConfigurationServiceGetV1ConfigurationsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ survey }: {
  survey?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGlobalConfigurationServiceGetV1ConfigurationsKeyFn({ survey }, queryKey), queryFn: () => GlobalConfigurationService.getV1Configurations({ survey }) as TData, ...options });
export const useGlobalConfigurationServiceGetV1ConfigurationsNameByNameSuspense = <TData = Common.GlobalConfigurationServiceGetV1ConfigurationsNameByNameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ name }: {
  name: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGlobalConfigurationServiceGetV1ConfigurationsNameByNameKeyFn({ name }, queryKey), queryFn: () => GlobalConfigurationService.getV1ConfigurationsNameByName({ name }) as TData, ...options });
export const useGlobalConfigurationServiceGetV1ConfigurationsByConfigIdSuspense = <TData = Common.GlobalConfigurationServiceGetV1ConfigurationsByConfigIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ configId }: {
  configId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGlobalConfigurationServiceGetV1ConfigurationsByConfigIdKeyFn({ configId }, queryKey), queryFn: () => GlobalConfigurationService.getV1ConfigurationsByConfigId({ configId }) as TData, ...options });
export const useCurrencyServiceGetV1CurrenciesSuspense = <TData = Common.CurrencyServiceGetV1CurrenciesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCurrencyServiceGetV1CurrenciesKeyFn(queryKey), queryFn: () => CurrencyService.getV1Currencies() as TData, ...options });
export const useDataTablesServiceGetV1DatatablesSuspense = <TData = Common.DataTablesServiceGetV1DatatablesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ apptable }: {
  apptable?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDataTablesServiceGetV1DatatablesKeyFn({ apptable }, queryKey), queryFn: () => DataTablesService.getV1Datatables({ apptable }) as TData, ...options });
export const useDataTablesServiceGetV1DatatablesByDatatableSuspense = <TData = Common.DataTablesServiceGetV1DatatablesByDatatableDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ datatable }: {
  datatable: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDataTablesServiceGetV1DatatablesByDatatableKeyFn({ datatable }, queryKey), queryFn: () => DataTablesService.getV1DatatablesByDatatable({ datatable }) as TData, ...options });
export const useDataTablesServiceGetV1DatatablesByDatatableQuerySuspense = <TData = Common.DataTablesServiceGetV1DatatablesByDatatableQueryDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ columnFilter, datatable, resultColumns, valueFilter }: {
  columnFilter?: string;
  datatable: string;
  resultColumns?: string;
  valueFilter?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDataTablesServiceGetV1DatatablesByDatatableQueryKeyFn({ columnFilter, datatable, resultColumns, valueFilter }, queryKey), queryFn: () => DataTablesService.getV1DatatablesByDatatableQuery({ columnFilter, datatable, resultColumns, valueFilter }) as TData, ...options });
export const useDataTablesServiceGetV1DatatablesByDatatableByApptableIdSuspense = <TData = Common.DataTablesServiceGetV1DatatablesByDatatableByApptableIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ apptableId, datatable, order }: {
  apptableId: number;
  datatable: string;
  order?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDataTablesServiceGetV1DatatablesByDatatableByApptableIdKeyFn({ apptableId, datatable, order }, queryKey), queryFn: () => DataTablesService.getV1DatatablesByDatatableByApptableId({ apptableId, datatable, order }) as TData, ...options });
export const useDataTablesServiceGetV1DatatablesByDatatableByApptableIdByDatatableIdSuspense = <TData = Common.DataTablesServiceGetV1DatatablesByDatatableByApptableIdByDatatableIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ apptableId, datatable, datatableId, genericResultSet, order }: {
  apptableId: number;
  datatable: string;
  datatableId: number;
  genericResultSet?: boolean;
  order?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDataTablesServiceGetV1DatatablesByDatatableByApptableIdByDatatableIdKeyFn({ apptableId, datatable, datatableId, genericResultSet, order }, queryKey), queryFn: () => DataTablesService.getV1DatatablesByDatatableByApptableIdByDatatableId({ apptableId, datatable, datatableId, genericResultSet, order }) as TData, ...options });
export const useDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsSuspense = <TData = Common.DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsKeyFn(queryKey), queryFn: () => DelinquencyRangeAndBucketsManagementService.getV1DelinquencyBuckets() as TData, ...options });
export const useDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsByDelinquencyBucketIdSuspense = <TData = Common.DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsByDelinquencyBucketIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ delinquencyBucketId }: {
  delinquencyBucketId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsByDelinquencyBucketIdKeyFn({ delinquencyBucketId }, queryKey), queryFn: () => DelinquencyRangeAndBucketsManagementService.getV1DelinquencyBucketsByDelinquencyBucketId({ delinquencyBucketId }) as TData, ...options });
export const useDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesSuspense = <TData = Common.DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesKeyFn(queryKey), queryFn: () => DelinquencyRangeAndBucketsManagementService.getV1DelinquencyRanges() as TData, ...options });
export const useDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesByDelinquencyRangeIdSuspense = <TData = Common.DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesByDelinquencyRangeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ delinquencyRangeId }: {
  delinquencyRangeId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesByDelinquencyRangeIdKeyFn({ delinquencyRangeId }, queryKey), queryFn: () => DelinquencyRangeAndBucketsManagementService.getV1DelinquencyRangesByDelinquencyRangeId({ delinquencyRangeId }) as TData, ...options });
export const useEntityDataTableServiceGetV1EntityDatatableChecksSuspense = <TData = Common.EntityDataTableServiceGetV1EntityDatatableChecksDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entity, limit, offset, productId, status }: {
  entity?: string;
  limit?: number;
  offset?: number;
  productId?: number;
  status?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseEntityDataTableServiceGetV1EntityDatatableChecksKeyFn({ entity, limit, offset, productId, status }, queryKey), queryFn: () => EntityDataTableService.getV1EntityDatatableChecks({ entity, limit, offset, productId, status }) as TData, ...options });
export const useEntityDataTableServiceGetV1EntityDatatableChecksTemplateSuspense = <TData = Common.EntityDataTableServiceGetV1EntityDatatableChecksTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseEntityDataTableServiceGetV1EntityDatatableChecksTemplateKeyFn(queryKey), queryFn: () => EntityDataTableService.getV1EntityDatatableChecksTemplate() as TData, ...options });
export const useFineractEntityServiceGetV1EntitytoentitymappingSuspense = <TData = Common.FineractEntityServiceGetV1EntitytoentitymappingDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFineractEntityServiceGetV1EntitytoentitymappingKeyFn(queryKey), queryFn: () => FineractEntityService.getV1Entitytoentitymapping() as TData, ...options });
export const useFineractEntityServiceGetV1EntitytoentitymappingByMapIdSuspense = <TData = Common.FineractEntityServiceGetV1EntitytoentitymappingByMapIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ mapId }: {
  mapId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFineractEntityServiceGetV1EntitytoentitymappingByMapIdKeyFn({ mapId }, queryKey), queryFn: () => FineractEntityService.getV1EntitytoentitymappingByMapId({ mapId }) as TData, ...options });
export const useFineractEntityServiceGetV1EntitytoentitymappingByMapIdByFromIdByToIdSuspense = <TData = Common.FineractEntityServiceGetV1EntitytoentitymappingByMapIdByFromIdByToIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fromId, mapId, toId }: {
  fromId: number;
  mapId: number;
  toId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFineractEntityServiceGetV1EntitytoentitymappingByMapIdByFromIdByToIdKeyFn({ fromId, mapId, toId }, queryKey), queryFn: () => FineractEntityService.getV1EntitytoentitymappingByMapIdByFromIdByToId({ fromId, mapId, toId }) as TData, ...options });
export const useExternalAssetOwnerLoanProductAttributesServiceGetV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesSuspense = <TData = Common.ExternalAssetOwnerLoanProductAttributesServiceGetV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ attributeKey, loanProductId }: {
  attributeKey?: string;
  loanProductId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseExternalAssetOwnerLoanProductAttributesServiceGetV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesKeyFn({ attributeKey, loanProductId }, queryKey), queryFn: () => ExternalAssetOwnerLoanProductAttributesService.getV1ExternalAssetOwnersLoanProductByLoanProductIdAttributes({ attributeKey, loanProductId }) as TData, ...options });
export const useExternalAssetOwnersServiceGetV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntriesSuspense = <TData = Common.ExternalAssetOwnersServiceGetV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntriesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, ownerExternalId }: {
  limit?: number;
  offset?: number;
  ownerExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntriesKeyFn({ limit, offset, ownerExternalId }, queryKey), queryFn: () => ExternalAssetOwnersService.getV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntries({ limit, offset, ownerExternalId }) as TData, ...options });
export const useExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersSuspense = <TData = Common.ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, loanExternalId, loanId, offset, transferExternalId }: {
  limit?: number;
  loanExternalId?: string;
  loanId?: number;
  offset?: number;
  transferExternalId?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersKeyFn({ limit, loanExternalId, loanId, offset, transferExternalId }, queryKey), queryFn: () => ExternalAssetOwnersService.getV1ExternalAssetOwnersTransfers({ limit, loanExternalId, loanId, offset, transferExternalId }) as TData, ...options });
export const useExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersActiveTransferSuspense = <TData = Common.ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersActiveTransferDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId, loanId, transferExternalId }: {
  loanExternalId?: string;
  loanId?: number;
  transferExternalId?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersActiveTransferKeyFn({ loanExternalId, loanId, transferExternalId }, queryKey), queryFn: () => ExternalAssetOwnersService.getV1ExternalAssetOwnersTransfersActiveTransfer({ loanExternalId, loanId, transferExternalId }) as TData, ...options });
export const useExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersByTransferIdJournalEntriesSuspense = <TData = Common.ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersByTransferIdJournalEntriesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, transferId }: {
  limit?: number;
  offset?: number;
  transferId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersByTransferIdJournalEntriesKeyFn({ limit, offset, transferId }, queryKey), queryFn: () => ExternalAssetOwnersService.getV1ExternalAssetOwnersTransfersByTransferIdJournalEntries({ limit, offset, transferId }) as TData, ...options });
export const useExternalEventConfigurationServiceGetV1ExternaleventsConfigurationSuspense = <TData = Common.ExternalEventConfigurationServiceGetV1ExternaleventsConfigurationDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseExternalEventConfigurationServiceGetV1ExternaleventsConfigurationKeyFn(queryKey), queryFn: () => ExternalEventConfigurationService.getV1ExternaleventsConfiguration() as TData, ...options });
export const useExternalServicesServiceGetV1ExternalserviceByServicenameSuspense = <TData = Common.ExternalServicesServiceGetV1ExternalserviceByServicenameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ servicename }: {
  servicename: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseExternalServicesServiceGetV1ExternalserviceByServicenameKeyFn({ servicename }, queryKey), queryFn: () => ExternalServicesService.getV1ExternalserviceByServicename({ servicename }) as TData, ...options });
export const useEntityFieldConfigurationServiceGetV1FieldconfigurationByEntitySuspense = <TData = Common.EntityFieldConfigurationServiceGetV1FieldconfigurationByEntityDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entity }: {
  entity: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseEntityFieldConfigurationServiceGetV1FieldconfigurationByEntityKeyFn({ entity }, queryKey), queryFn: () => EntityFieldConfigurationService.getV1FieldconfigurationByEntity({ entity }) as TData, ...options });
export const useMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsSuspense = <TData = Common.MappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsKeyFn(queryKey), queryFn: () => MappingFinancialActivitiesToAccountsService.getV1Financialactivityaccounts() as TData, ...options });
export const useMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsTemplateSuspense = <TData = Common.MappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsTemplateKeyFn(queryKey), queryFn: () => MappingFinancialActivitiesToAccountsService.getV1FinancialactivityaccountsTemplate() as TData, ...options });
export const useMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsByMappingIdSuspense = <TData = Common.MappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsByMappingIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ mappingId }: {
  mappingId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsByMappingIdKeyFn({ mappingId }, queryKey), queryFn: () => MappingFinancialActivitiesToAccountsService.getV1FinancialactivityaccountsByMappingId({ mappingId }) as TData, ...options });
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsSuspense = <TData = Common.FixedDepositAccountServiceGetV1FixeddepositaccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, paged, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  paged?: boolean;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsKeyFn({ limit, offset, orderBy, paged, sortOrder }, queryKey), queryFn: () => FixedDepositAccountService.getV1Fixeddepositaccounts({ limit, offset, orderBy, paged, sortOrder }) as TData, ...options });
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsCalculateFdInterestSuspense = <TData = Common.FixedDepositAccountServiceGetV1FixeddepositaccountsCalculateFdInterestDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ annualInterestRate, interestCompoundingPeriodInMonths, interestPostingPeriodInMonths, principalAmount, tenureInMonths }: {
  annualInterestRate?: number;
  interestCompoundingPeriodInMonths?: number;
  interestPostingPeriodInMonths?: number;
  principalAmount?: number;
  tenureInMonths?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsCalculateFdInterestKeyFn({ annualInterestRate, interestCompoundingPeriodInMonths, interestPostingPeriodInMonths, principalAmount, tenureInMonths }, queryKey), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsCalculateFdInterest({ annualInterestRate, interestCompoundingPeriodInMonths, interestPostingPeriodInMonths, principalAmount, tenureInMonths }) as TData, ...options });
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsDownloadtemplateSuspense = <TData = Common.FixedDepositAccountServiceGetV1FixeddepositaccountsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsDownloadtemplateKeyFn({ dateFormat, officeId, staffId }, queryKey), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsDownloadtemplate({ dateFormat, officeId, staffId }) as TData, ...options });
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsTemplateSuspense = <TData = Common.FixedDepositAccountServiceGetV1FixeddepositaccountsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, groupId, productId, staffInSelectedOfficeOnly }: {
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsTemplateKeyFn({ clientId, groupId, productId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsTemplate({ clientId, groupId, productId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsTransactionDownloadtemplateSuspense = <TData = Common.FixedDepositAccountServiceGetV1FixeddepositaccountsTransactionDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsTransactionDownloadtemplateKeyFn({ dateFormat, officeId }, queryKey), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsTransactionDownloadtemplate({ dateFormat, officeId }) as TData, ...options });
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdSuspense = <TData = Common.FixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, chargeStatus, staffInSelectedOfficeOnly }: {
  accountId: number;
  chargeStatus?: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdKeyFn({ accountId, chargeStatus, staffInSelectedOfficeOnly }, queryKey), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsByAccountId({ accountId, chargeStatus, staffInSelectedOfficeOnly }) as TData, ...options });
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdTemplateSuspense = <TData = Common.FixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, command }: {
  accountId: number;
  command?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdTemplateKeyFn({ accountId, command }, queryKey), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsByAccountIdTemplate({ accountId, command }) as TData, ...options });
export const useFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplateSuspense = <TData = Common.FixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fixedDepositAccountId }: {
  fixedDepositAccountId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplateKeyFn({ fixedDepositAccountId }, queryKey), queryFn: () => FixedDepositAccountTransactionsService.getV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplate({ fixedDepositAccountId }) as TData, ...options });
export const useFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionIdSuspense = <TData = Common.FixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fixedDepositAccountId, transactionId }: {
  fixedDepositAccountId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionIdKeyFn({ fixedDepositAccountId, transactionId }, queryKey), queryFn: () => FixedDepositAccountTransactionsService.getV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionId({ fixedDepositAccountId, transactionId }) as TData, ...options });
export const useFixedDepositProductServiceGetV1FixeddepositproductsSuspense = <TData = Common.FixedDepositProductServiceGetV1FixeddepositproductsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFixedDepositProductServiceGetV1FixeddepositproductsKeyFn(queryKey), queryFn: () => FixedDepositProductService.getV1Fixeddepositproducts() as TData, ...options });
export const useFixedDepositProductServiceGetV1FixeddepositproductsTemplateSuspense = <TData = Common.FixedDepositProductServiceGetV1FixeddepositproductsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFixedDepositProductServiceGetV1FixeddepositproductsTemplateKeyFn(queryKey), queryFn: () => FixedDepositProductService.getV1FixeddepositproductsTemplate() as TData, ...options });
export const useFixedDepositProductServiceGetV1FixeddepositproductsByProductIdSuspense = <TData = Common.FixedDepositProductServiceGetV1FixeddepositproductsByProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ productId }: {
  productId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFixedDepositProductServiceGetV1FixeddepositproductsByProductIdKeyFn({ productId }, queryKey), queryFn: () => FixedDepositProductService.getV1FixeddepositproductsByProductId({ productId }) as TData, ...options });
export const useFloatingRatesServiceGetV1FloatingratesSuspense = <TData = Common.FloatingRatesServiceGetV1FloatingratesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFloatingRatesServiceGetV1FloatingratesKeyFn(queryKey), queryFn: () => FloatingRatesService.getV1Floatingrates() as TData, ...options });
export const useFloatingRatesServiceGetV1FloatingratesByFloatingRateIdSuspense = <TData = Common.FloatingRatesServiceGetV1FloatingratesByFloatingRateIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ floatingRateId }: {
  floatingRateId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFloatingRatesServiceGetV1FloatingratesByFloatingRateIdKeyFn({ floatingRateId }, queryKey), queryFn: () => FloatingRatesService.getV1FloatingratesByFloatingRateId({ floatingRateId }) as TData, ...options });
export const useFundsServiceGetV1FundsSuspense = <TData = Common.FundsServiceGetV1FundsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFundsServiceGetV1FundsKeyFn(queryKey), queryFn: () => FundsService.getV1Funds() as TData, ...options });
export const useFundsServiceGetV1FundsByFundIdSuspense = <TData = Common.FundsServiceGetV1FundsByFundIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fundId }: {
  fundId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFundsServiceGetV1FundsByFundIdKeyFn({ fundId }, queryKey), queryFn: () => FundsService.getV1FundsByFundId({ fundId }) as TData, ...options });
export const useGeneralLedgerAccountServiceGetV1GlaccountsSuspense = <TData = Common.GeneralLedgerAccountServiceGetV1GlaccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ disabled, fetchRunningBalance, manualEntriesAllowed, searchParam, type, usage }: {
  disabled?: boolean;
  fetchRunningBalance?: boolean;
  manualEntriesAllowed?: boolean;
  searchParam?: string;
  type?: number;
  usage?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGeneralLedgerAccountServiceGetV1GlaccountsKeyFn({ disabled, fetchRunningBalance, manualEntriesAllowed, searchParam, type, usage }, queryKey), queryFn: () => GeneralLedgerAccountService.getV1Glaccounts({ disabled, fetchRunningBalance, manualEntriesAllowed, searchParam, type, usage }) as TData, ...options });
export const useGeneralLedgerAccountServiceGetV1GlaccountsDownloadtemplateSuspense = <TData = Common.GeneralLedgerAccountServiceGetV1GlaccountsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat }: {
  dateFormat?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGeneralLedgerAccountServiceGetV1GlaccountsDownloadtemplateKeyFn({ dateFormat }, queryKey), queryFn: () => GeneralLedgerAccountService.getV1GlaccountsDownloadtemplate({ dateFormat }) as TData, ...options });
export const useGeneralLedgerAccountServiceGetV1GlaccountsTemplateSuspense = <TData = Common.GeneralLedgerAccountServiceGetV1GlaccountsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ type }: {
  type?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGeneralLedgerAccountServiceGetV1GlaccountsTemplateKeyFn({ type }, queryKey), queryFn: () => GeneralLedgerAccountService.getV1GlaccountsTemplate({ type }) as TData, ...options });
export const useGeneralLedgerAccountServiceGetV1GlaccountsByGlAccountIdSuspense = <TData = Common.GeneralLedgerAccountServiceGetV1GlaccountsByGlAccountIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fetchRunningBalance, glAccountId }: {
  fetchRunningBalance?: boolean;
  glAccountId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGeneralLedgerAccountServiceGetV1GlaccountsByGlAccountIdKeyFn({ fetchRunningBalance, glAccountId }, queryKey), queryFn: () => GeneralLedgerAccountService.getV1GlaccountsByGlAccountId({ fetchRunningBalance, glAccountId }) as TData, ...options });
export const useAccountingClosureServiceGetV1GlclosuresSuspense = <TData = Common.AccountingClosureServiceGetV1GlclosuresDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ officeId }: {
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAccountingClosureServiceGetV1GlclosuresKeyFn({ officeId }, queryKey), queryFn: () => AccountingClosureService.getV1Glclosures({ officeId }) as TData, ...options });
export const useAccountingClosureServiceGetV1GlclosuresByGlClosureIdSuspense = <TData = Common.AccountingClosureServiceGetV1GlclosuresByGlClosureIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ glClosureId }: {
  glClosureId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseAccountingClosureServiceGetV1GlclosuresByGlClosureIdKeyFn({ glClosureId }, queryKey), queryFn: () => AccountingClosureService.getV1GlclosuresByGlClosureId({ glClosureId }) as TData, ...options });
export const useGroupsLevelServiceGetV1GrouplevelsSuspense = <TData = Common.GroupsLevelServiceGetV1GrouplevelsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGroupsLevelServiceGetV1GrouplevelsKeyFn(queryKey), queryFn: () => GroupsLevelService.getV1Grouplevels() as TData, ...options });
export const useGroupsServiceGetV1GroupsSuspense = <TData = Common.GroupsServiceGetV1GroupsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalId, limit, name, officeId, offset, orderBy, orphansOnly, paged, sortOrder, staffId, underHierarchy }: {
  externalId?: string;
  limit?: number;
  name?: string;
  officeId?: number;
  offset?: number;
  orderBy?: string;
  orphansOnly?: boolean;
  paged?: boolean;
  sortOrder?: string;
  staffId?: number;
  underHierarchy?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGroupsServiceGetV1GroupsKeyFn({ externalId, limit, name, officeId, offset, orderBy, orphansOnly, paged, sortOrder, staffId, underHierarchy }, queryKey), queryFn: () => GroupsService.getV1Groups({ externalId, limit, name, officeId, offset, orderBy, orphansOnly, paged, sortOrder, staffId, underHierarchy }) as TData, ...options });
export const useGroupsServiceGetV1GroupsDownloadtemplateSuspense = <TData = Common.GroupsServiceGetV1GroupsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGroupsServiceGetV1GroupsDownloadtemplateKeyFn({ dateFormat, officeId, staffId }, queryKey), queryFn: () => GroupsService.getV1GroupsDownloadtemplate({ dateFormat, officeId, staffId }) as TData, ...options });
export const useGroupsServiceGetV1GroupsTemplateSuspense = <TData = Common.GroupsServiceGetV1GroupsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ center, centerId, command, officeId, staffInSelectedOfficeOnly }: {
  center?: boolean;
  centerId?: number;
  command?: string;
  officeId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGroupsServiceGetV1GroupsTemplateKeyFn({ center, centerId, command, officeId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => GroupsService.getV1GroupsTemplate({ center, centerId, command, officeId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useGroupsServiceGetV1GroupsByGroupIdSuspense = <TData = Common.GroupsServiceGetV1GroupsByGroupIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ groupId, roleId, staffInSelectedOfficeOnly }: {
  groupId: number;
  roleId?: number;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGroupsServiceGetV1GroupsByGroupIdKeyFn({ groupId, roleId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => GroupsService.getV1GroupsByGroupId({ groupId, roleId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useGroupsServiceGetV1GroupsByGroupIdAccountsSuspense = <TData = Common.GroupsServiceGetV1GroupsByGroupIdAccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ groupId }: {
  groupId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGroupsServiceGetV1GroupsByGroupIdAccountsKeyFn({ groupId }, queryKey), queryFn: () => GroupsService.getV1GroupsByGroupIdAccounts({ groupId }) as TData, ...options });
export const useGroupsServiceGetV1GroupsByGroupIdGlimaccountsSuspense = <TData = Common.GroupsServiceGetV1GroupsByGroupIdGlimaccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ groupId, parentLoanAccountNo }: {
  groupId: number;
  parentLoanAccountNo?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGroupsServiceGetV1GroupsByGroupIdGlimaccountsKeyFn({ groupId, parentLoanAccountNo }, queryKey), queryFn: () => GroupsService.getV1GroupsByGroupIdGlimaccounts({ groupId, parentLoanAccountNo }) as TData, ...options });
export const useGroupsServiceGetV1GroupsByGroupIdGsimaccountsSuspense = <TData = Common.GroupsServiceGetV1GroupsByGroupIdGsimaccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ groupId, parentGsimAccountNo, parentGsimId }: {
  groupId: number;
  parentGsimAccountNo?: string;
  parentGsimId?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGroupsServiceGetV1GroupsByGroupIdGsimaccountsKeyFn({ groupId, parentGsimAccountNo, parentGsimId }, queryKey), queryFn: () => GroupsService.getV1GroupsByGroupIdGsimaccounts({ groupId, parentGsimAccountNo, parentGsimId }) as TData, ...options });
export const useHolidaysServiceGetV1HolidaysSuspense = <TData = Common.HolidaysServiceGetV1HolidaysDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, fromDate, locale, officeId, toDate }: {
  dateFormat?: string;
  fromDate?: DateParam;
  locale?: string;
  officeId?: number;
  toDate?: DateParam;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseHolidaysServiceGetV1HolidaysKeyFn({ dateFormat, fromDate, locale, officeId, toDate }, queryKey), queryFn: () => HolidaysService.getV1Holidays({ dateFormat, fromDate, locale, officeId, toDate }) as TData, ...options });
export const useHolidaysServiceGetV1HolidaysTemplateSuspense = <TData = Common.HolidaysServiceGetV1HolidaysTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseHolidaysServiceGetV1HolidaysTemplateKeyFn(queryKey), queryFn: () => HolidaysService.getV1HolidaysTemplate() as TData, ...options });
export const useHolidaysServiceGetV1HolidaysByHolidayIdSuspense = <TData = Common.HolidaysServiceGetV1HolidaysByHolidayIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ holidayId }: {
  holidayId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseHolidaysServiceGetV1HolidaysByHolidayIdKeyFn({ holidayId }, queryKey), queryFn: () => HolidaysService.getV1HolidaysByHolidayId({ holidayId }) as TData, ...options });
export const useHooksServiceGetV1HooksSuspense = <TData = Common.HooksServiceGetV1HooksDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseHooksServiceGetV1HooksKeyFn(queryKey), queryFn: () => HooksService.getV1Hooks() as TData, ...options });
export const useHooksServiceGetV1HooksTemplateSuspense = <TData = Common.HooksServiceGetV1HooksTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseHooksServiceGetV1HooksTemplateKeyFn(queryKey), queryFn: () => HooksService.getV1HooksTemplate() as TData, ...options });
export const useHooksServiceGetV1HooksByHookIdSuspense = <TData = Common.HooksServiceGetV1HooksByHookIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ hookId }: {
  hookId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseHooksServiceGetV1HooksByHookIdKeyFn({ hookId }, queryKey), queryFn: () => HooksService.getV1HooksByHookId({ hookId }) as TData, ...options });
export const useBulkImportServiceGetV1ImportsSuspense = <TData = Common.BulkImportServiceGetV1ImportsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entityType }: {
  entityType?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseBulkImportServiceGetV1ImportsKeyFn({ entityType }, queryKey), queryFn: () => BulkImportService.getV1Imports({ entityType }) as TData, ...options });
export const useBulkImportServiceGetV1ImportsDownloadOutputTemplateSuspense = <TData = Common.BulkImportServiceGetV1ImportsDownloadOutputTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ importDocumentId }: {
  importDocumentId?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseBulkImportServiceGetV1ImportsDownloadOutputTemplateKeyFn({ importDocumentId }, queryKey), queryFn: () => BulkImportService.getV1ImportsDownloadOutputTemplate({ importDocumentId }) as TData, ...options });
export const useBulkImportServiceGetV1ImportsGetOutputTemplateLocationSuspense = <TData = Common.BulkImportServiceGetV1ImportsGetOutputTemplateLocationDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ importDocumentId }: {
  importDocumentId?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseBulkImportServiceGetV1ImportsGetOutputTemplateLocationKeyFn({ importDocumentId }, queryKey), queryFn: () => BulkImportService.getV1ImportsGetOutputTemplateLocation({ importDocumentId }) as TData, ...options });
export const useInterestRateChartServiceGetV1InterestratechartsSuspense = <TData = Common.InterestRateChartServiceGetV1InterestratechartsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ productId }: {
  productId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseInterestRateChartServiceGetV1InterestratechartsKeyFn({ productId }, queryKey), queryFn: () => InterestRateChartService.getV1Interestratecharts({ productId }) as TData, ...options });
export const useInterestRateChartServiceGetV1InterestratechartsTemplateSuspense = <TData = Common.InterestRateChartServiceGetV1InterestratechartsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseInterestRateChartServiceGetV1InterestratechartsTemplateKeyFn(queryKey), queryFn: () => InterestRateChartService.getV1InterestratechartsTemplate() as TData, ...options });
export const useInterestRateChartServiceGetV1InterestratechartsByChartIdSuspense = <TData = Common.InterestRateChartServiceGetV1InterestratechartsByChartIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chartId }: {
  chartId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseInterestRateChartServiceGetV1InterestratechartsByChartIdKeyFn({ chartId }, queryKey), queryFn: () => InterestRateChartService.getV1InterestratechartsByChartId({ chartId }) as TData, ...options });
export const useInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsSuspense = <TData = Common.InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chartId }: {
  chartId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsKeyFn({ chartId }, queryKey), queryFn: () => InterestRateSlabAKAInterestBandsService.getV1InterestratechartsByChartIdChartslabs({ chartId }) as TData, ...options });
export const useInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsTemplateSuspense = <TData = Common.InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chartId }: {
  chartId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsTemplateKeyFn({ chartId }, queryKey), queryFn: () => InterestRateSlabAKAInterestBandsService.getV1InterestratechartsByChartIdChartslabsTemplate({ chartId }) as TData, ...options });
export const useInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsByChartSlabIdSuspense = <TData = Common.InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsByChartSlabIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chartId, chartSlabId }: {
  chartId: number;
  chartSlabId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsByChartSlabIdKeyFn({ chartId, chartSlabId }, queryKey), queryFn: () => InterestRateSlabAKAInterestBandsService.getV1InterestratechartsByChartIdChartslabsByChartSlabId({ chartId, chartSlabId }) as TData, ...options });
export const useProgressiveLoanServiceGetV1InternalLoanProgressiveByLoanIdModelSuspense = <TData = Common.ProgressiveLoanServiceGetV1InternalLoanProgressiveByLoanIdModelDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseProgressiveLoanServiceGetV1InternalLoanProgressiveByLoanIdModelKeyFn({ loanId }, queryKey), queryFn: () => ProgressiveLoanService.getV1InternalLoanProgressiveByLoanIdModel({ loanId }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationAccountsByAccountIdSuspense = <TData = Common.InterOperationServiceGetV1InteroperationAccountsByAccountIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId }: {
  accountId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationAccountsByAccountIdKeyFn({ accountId }, queryKey), queryFn: () => InterOperationService.getV1InteroperationAccountsByAccountId({ accountId }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationAccountsByAccountIdIdentifiersSuspense = <TData = Common.InterOperationServiceGetV1InteroperationAccountsByAccountIdIdentifiersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId }: {
  accountId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationAccountsByAccountIdIdentifiersKeyFn({ accountId }, queryKey), queryFn: () => InterOperationService.getV1InteroperationAccountsByAccountIdIdentifiers({ accountId }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationAccountsByAccountIdKycSuspense = <TData = Common.InterOperationServiceGetV1InteroperationAccountsByAccountIdKycDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId }: {
  accountId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationAccountsByAccountIdKycKeyFn({ accountId }, queryKey), queryFn: () => InterOperationService.getV1InteroperationAccountsByAccountIdKyc({ accountId }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationAccountsByAccountIdTransactionsSuspense = <TData = Common.InterOperationServiceGetV1InteroperationAccountsByAccountIdTransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, credit, debit, fromBookingDateTime, toBookingDateTime }: {
  accountId: string;
  credit?: boolean;
  debit?: boolean;
  fromBookingDateTime?: string;
  toBookingDateTime?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationAccountsByAccountIdTransactionsKeyFn({ accountId, credit, debit, fromBookingDateTime, toBookingDateTime }, queryKey), queryFn: () => InterOperationService.getV1InteroperationAccountsByAccountIdTransactions({ accountId, credit, debit, fromBookingDateTime, toBookingDateTime }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationHealthSuspense = <TData = Common.InterOperationServiceGetV1InteroperationHealthDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationHealthKeyFn(queryKey), queryFn: () => InterOperationService.getV1InteroperationHealth() as TData, ...options });
export const useInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueSuspense = <TData = Common.InterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ idType, idValue }: {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueKeyFn({ idType, idValue }, queryKey), queryFn: () => InterOperationService.getV1InteroperationPartiesByIdTypeByIdValue({ idType, idValue }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeSuspense = <TData = Common.InterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ idType, idValue, subIdOrType }: {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
  subIdOrType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeKeyFn({ idType, idValue, subIdOrType }, queryKey), queryFn: () => InterOperationService.getV1InteroperationPartiesByIdTypeByIdValueBySubIdOrType({ idType, idValue, subIdOrType }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCodeSuspense = <TData = Common.InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCodeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ quoteCode, transactionCode }: {
  quoteCode: string;
  transactionCode: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCodeKeyFn({ quoteCode, transactionCode }, queryKey), queryFn: () => InterOperationService.getV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCode({ quoteCode, transactionCode }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeRequestsByRequestCodeSuspense = <TData = Common.InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeRequestsByRequestCodeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ requestCode, transactionCode }: {
  requestCode: string;
  transactionCode: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeRequestsByRequestCodeKeyFn({ requestCode, transactionCode }, queryKey), queryFn: () => InterOperationService.getV1InteroperationTransactionsByTransactionCodeRequestsByRequestCode({ requestCode, transactionCode }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeTransfersByTransferCodeSuspense = <TData = Common.InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeTransfersByTransferCodeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ transactionCode, transferCode }: {
  transactionCode: string;
  transferCode: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeTransfersByTransferCodeKeyFn({ transactionCode, transferCode }, queryKey), queryFn: () => InterOperationService.getV1InteroperationTransactionsByTransactionCodeTransfersByTransferCode({ transactionCode, transferCode }) as TData, ...options });
export const useSchedulerJobServiceGetV1JobsSuspense = <TData = Common.SchedulerJobServiceGetV1JobsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSchedulerJobServiceGetV1JobsKeyFn(queryKey), queryFn: () => SchedulerJobService.getV1Jobs() as TData, ...options });
export const useSchedulerJobServiceGetV1JobsShortNameByShortNameSuspense = <TData = Common.SchedulerJobServiceGetV1JobsShortNameByShortNameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ shortName }: {
  shortName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSchedulerJobServiceGetV1JobsShortNameByShortNameKeyFn({ shortName }, queryKey), queryFn: () => SchedulerJobService.getV1JobsShortNameByShortName({ shortName }) as TData, ...options });
export const useSchedulerJobServiceGetV1JobsShortNameByShortNameRunhistorySuspense = <TData = Common.SchedulerJobServiceGetV1JobsShortNameByShortNameRunhistoryDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, shortName, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  shortName: string;
  sortOrder?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSchedulerJobServiceGetV1JobsShortNameByShortNameRunhistoryKeyFn({ limit, offset, orderBy, shortName, sortOrder }, queryKey), queryFn: () => SchedulerJobService.getV1JobsShortNameByShortNameRunhistory({ limit, offset, orderBy, shortName, sortOrder }) as TData, ...options });
export const useSchedulerJobServiceGetV1JobsByJobIdSuspense = <TData = Common.SchedulerJobServiceGetV1JobsByJobIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ jobId }: {
  jobId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSchedulerJobServiceGetV1JobsByJobIdKeyFn({ jobId }, queryKey), queryFn: () => SchedulerJobService.getV1JobsByJobId({ jobId }) as TData, ...options });
export const useSchedulerJobServiceGetV1JobsByJobIdRunhistorySuspense = <TData = Common.SchedulerJobServiceGetV1JobsByJobIdRunhistoryDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ jobId, limit, offset, orderBy, sortOrder }: {
  jobId: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSchedulerJobServiceGetV1JobsByJobIdRunhistoryKeyFn({ jobId, limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => SchedulerJobService.getV1JobsByJobIdRunhistory({ jobId, limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useBusinessStepConfigurationServiceGetV1JobsNamesSuspense = <TData = Common.BusinessStepConfigurationServiceGetV1JobsNamesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseBusinessStepConfigurationServiceGetV1JobsNamesKeyFn(queryKey), queryFn: () => BusinessStepConfigurationService.getV1JobsNames() as TData, ...options });
export const useBusinessStepConfigurationServiceGetV1JobsByJobNameAvailableStepsSuspense = <TData = Common.BusinessStepConfigurationServiceGetV1JobsByJobNameAvailableStepsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ jobName }: {
  jobName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseBusinessStepConfigurationServiceGetV1JobsByJobNameAvailableStepsKeyFn({ jobName }, queryKey), queryFn: () => BusinessStepConfigurationService.getV1JobsByJobNameAvailableSteps({ jobName }) as TData, ...options });
export const useBusinessStepConfigurationServiceGetV1JobsByJobNameStepsSuspense = <TData = Common.BusinessStepConfigurationServiceGetV1JobsByJobNameStepsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ jobName }: {
  jobName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseBusinessStepConfigurationServiceGetV1JobsByJobNameStepsKeyFn({ jobName }, queryKey), queryFn: () => BusinessStepConfigurationService.getV1JobsByJobNameSteps({ jobName }) as TData, ...options });
export const useJournalEntriesServiceGetV1JournalentriesSuspense = <TData = Common.JournalEntriesServiceGetV1JournalentriesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, entityType, fromDate, glAccountId, limit, loanId, locale, manualEntriesOnly, officeId, offset, orderBy, runningBalance, savingsId, sortOrder, submittedOnDateFrom, submittedOnDateTo, toDate, transactionDetails, transactionId }: {
  dateFormat?: string;
  entityType?: number;
  fromDate?: DateParam;
  glAccountId?: number;
  limit?: number;
  loanId?: number;
  locale?: string;
  manualEntriesOnly?: boolean;
  officeId?: number;
  offset?: number;
  orderBy?: string;
  runningBalance?: boolean;
  savingsId?: number;
  sortOrder?: string;
  submittedOnDateFrom?: DateParam;
  submittedOnDateTo?: DateParam;
  toDate?: DateParam;
  transactionDetails?: boolean;
  transactionId?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesKeyFn({ dateFormat, entityType, fromDate, glAccountId, limit, loanId, locale, manualEntriesOnly, officeId, offset, orderBy, runningBalance, savingsId, sortOrder, submittedOnDateFrom, submittedOnDateTo, toDate, transactionDetails, transactionId }, queryKey), queryFn: () => JournalEntriesService.getV1Journalentries({ dateFormat, entityType, fromDate, glAccountId, limit, loanId, locale, manualEntriesOnly, officeId, offset, orderBy, runningBalance, savingsId, sortOrder, submittedOnDateFrom, submittedOnDateTo, toDate, transactionDetails, transactionId }) as TData, ...options });
export const useJournalEntriesServiceGetV1JournalentriesDownloadtemplateSuspense = <TData = Common.JournalEntriesServiceGetV1JournalentriesDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesDownloadtemplateKeyFn({ dateFormat, officeId }, queryKey), queryFn: () => JournalEntriesService.getV1JournalentriesDownloadtemplate({ dateFormat, officeId }) as TData, ...options });
export const useJournalEntriesServiceGetV1JournalentriesOpeningbalanceSuspense = <TData = Common.JournalEntriesServiceGetV1JournalentriesOpeningbalanceDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ currencyCode, officeId }: {
  currencyCode?: string;
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesOpeningbalanceKeyFn({ currencyCode, officeId }, queryKey), queryFn: () => JournalEntriesService.getV1JournalentriesOpeningbalance({ currencyCode, officeId }) as TData, ...options });
export const useJournalEntriesServiceGetV1JournalentriesProvisioningSuspense = <TData = Common.JournalEntriesServiceGetV1JournalentriesProvisioningDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entryId, limit, offset }: {
  entryId?: number;
  limit?: number;
  offset?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesProvisioningKeyFn({ entryId, limit, offset }, queryKey), queryFn: () => JournalEntriesService.getV1JournalentriesProvisioning({ entryId, limit, offset }) as TData, ...options });
export const useJournalEntriesServiceGetV1JournalentriesByJournalEntryIdSuspense = <TData = Common.JournalEntriesServiceGetV1JournalentriesByJournalEntryIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ journalEntryId, runningBalance, transactionDetails }: {
  journalEntryId: number;
  runningBalance?: boolean;
  transactionDetails?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesByJournalEntryIdKeyFn({ journalEntryId, runningBalance, transactionDetails }, queryKey), queryFn: () => JournalEntriesService.getV1JournalentriesByJournalEntryId({ journalEntryId, runningBalance, transactionDetails }) as TData, ...options });
export const useLikelihoodServiceGetV1LikelihoodByPpiNameSuspense = <TData = Common.LikelihoodServiceGetV1LikelihoodByPpiNameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ ppiName }: {
  ppiName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLikelihoodServiceGetV1LikelihoodByPpiNameKeyFn({ ppiName }, queryKey), queryFn: () => LikelihoodService.getV1LikelihoodByPpiName({ ppiName }) as TData, ...options });
export const useLikelihoodServiceGetV1LikelihoodByPpiNameByLikelihoodIdSuspense = <TData = Common.LikelihoodServiceGetV1LikelihoodByPpiNameByLikelihoodIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ likelihoodId, ppiName }: {
  likelihoodId: number;
  ppiName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLikelihoodServiceGetV1LikelihoodByPpiNameByLikelihoodIdKeyFn({ likelihoodId, ppiName }, queryKey), queryFn: () => LikelihoodService.getV1LikelihoodByPpiNameByLikelihoodId({ likelihoodId, ppiName }) as TData, ...options });
export const useLoanCollateralManagementServiceGetV1LoanCollateralManagementByCollateralIdSuspense = <TData = Common.LoanCollateralManagementServiceGetV1LoanCollateralManagementByCollateralIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ collateralId }: {
  collateralId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanCollateralManagementServiceGetV1LoanCollateralManagementByCollateralIdKeyFn({ collateralId }, queryKey), queryFn: () => LoanCollateralManagementService.getV1LoanCollateralManagementByCollateralId({ collateralId }) as TData, ...options });
export const useLoanProductsServiceGetV1LoanproductsSuspense = <TData = Common.LoanProductsServiceGetV1LoanproductsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanProductsServiceGetV1LoanproductsKeyFn(queryKey), queryFn: () => LoanProductsService.getV1Loanproducts() as TData, ...options });
export const useLoanProductsServiceGetV1LoanproductsExternalIdByExternalProductIdSuspense = <TData = Common.LoanProductsServiceGetV1LoanproductsExternalIdByExternalProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalProductId }: {
  externalProductId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanProductsServiceGetV1LoanproductsExternalIdByExternalProductIdKeyFn({ externalProductId }, queryKey), queryFn: () => LoanProductsService.getV1LoanproductsExternalIdByExternalProductId({ externalProductId }) as TData, ...options });
export const useLoanProductsServiceGetV1LoanproductsTemplateSuspense = <TData = Common.LoanProductsServiceGetV1LoanproductsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ isProductMixTemplate }: {
  isProductMixTemplate?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanProductsServiceGetV1LoanproductsTemplateKeyFn({ isProductMixTemplate }, queryKey), queryFn: () => LoanProductsService.getV1LoanproductsTemplate({ isProductMixTemplate }) as TData, ...options });
export const useLoanProductsServiceGetV1LoanproductsByProductIdSuspense = <TData = Common.LoanProductsServiceGetV1LoanproductsByProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ productId }: {
  productId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanProductsServiceGetV1LoanproductsByProductIdKeyFn({ productId }, queryKey), queryFn: () => LoanProductsService.getV1LoanproductsByProductId({ productId }) as TData, ...options });
export const useProductMixServiceGetV1LoanproductsByProductIdProductmixSuspense = <TData = Common.ProductMixServiceGetV1LoanproductsByProductIdProductmixDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ productId }: {
  productId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseProductMixServiceGetV1LoanproductsByProductIdProductmixKeyFn({ productId }, queryKey), queryFn: () => ProductMixService.getV1LoanproductsByProductIdProductmix({ productId }) as TData, ...options });
export const useLoansServiceGetV1LoansSuspense = <TData = Common.LoansServiceGetV1LoansDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountNo, associations, clientId, externalId, limit, offset, orderBy, sortOrder, status }: {
  accountNo?: string;
  associations?: string;
  clientId?: number;
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  status?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansKeyFn({ accountNo, associations, clientId, externalId, limit, offset, orderBy, sortOrder, status }, queryKey), queryFn: () => LoansService.getV1Loans({ accountNo, associations, clientId, externalId, limit, offset, orderBy, sortOrder, status }) as TData, ...options });
export const useLoansServiceGetV1LoansDownloadtemplateSuspense = <TData = Common.LoansServiceGetV1LoansDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansDownloadtemplateKeyFn({ dateFormat, officeId, staffId }, queryKey), queryFn: () => LoansService.getV1LoansDownloadtemplate({ dateFormat, officeId, staffId }) as TData, ...options });
export const useLoansServiceGetV1LoansExternalIdByLoanExternalIdSuspense = <TData = Common.LoansServiceGetV1LoansExternalIdByLoanExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ associations, exclude, fields, loanExternalId, staffInSelectedOfficeOnly }: {
  associations?: string;
  exclude?: string;
  fields?: string;
  loanExternalId: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdKeyFn({ associations, exclude, fields, loanExternalId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalId({ associations, exclude, fields, loanExternalId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useLoansServiceGetV1LoansExternalIdByLoanExternalIdApprovedAmountSuspense = <TData = Common.LoansServiceGetV1LoansExternalIdByLoanExternalIdApprovedAmountDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdApprovedAmountKeyFn({ loanExternalId }, queryKey), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalIdApprovedAmount({ loanExternalId }) as TData, ...options });
export const useLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencyActionsSuspense = <TData = Common.LoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencyActionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencyActionsKeyFn({ loanExternalId }, queryKey), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalIdDelinquencyActions({ loanExternalId }) as TData, ...options });
export const useLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencytagsSuspense = <TData = Common.LoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencytagsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencytagsKeyFn({ loanExternalId }, queryKey), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalIdDelinquencytags({ loanExternalId }) as TData, ...options });
export const useLoansServiceGetV1LoansExternalIdByLoanExternalIdTemplateSuspense = <TData = Common.LoansServiceGetV1LoansExternalIdByLoanExternalIdTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId, templateType }: {
  loanExternalId: string;
  templateType?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdTemplateKeyFn({ loanExternalId, templateType }, queryKey), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalIdTemplate({ loanExternalId, templateType }) as TData, ...options });
export const useLoansServiceGetV1LoansGlimAccountByGlimIdSuspense = <TData = Common.LoansServiceGetV1LoansGlimAccountByGlimIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ glimId }: {
  glimId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansGlimAccountByGlimIdKeyFn({ glimId }, queryKey), queryFn: () => LoansService.getV1LoansGlimAccountByGlimId({ glimId }) as TData, ...options });
export const useLoansServiceGetV1LoansRepaymentsDownloadtemplateSuspense = <TData = Common.LoansServiceGetV1LoansRepaymentsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansRepaymentsDownloadtemplateKeyFn({ dateFormat, officeId }, queryKey), queryFn: () => LoansService.getV1LoansRepaymentsDownloadtemplate({ dateFormat, officeId }) as TData, ...options });
export const useLoansServiceGetV1LoansTemplateSuspense = <TData = Common.LoansServiceGetV1LoansTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ activeOnly, clientId, groupId, productId, staffInSelectedOfficeOnly, templateType }: {
  activeOnly?: boolean;
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
  templateType?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansTemplateKeyFn({ activeOnly, clientId, groupId, productId, staffInSelectedOfficeOnly, templateType }, queryKey), queryFn: () => LoansService.getV1LoansTemplate({ activeOnly, clientId, groupId, productId, staffInSelectedOfficeOnly, templateType }) as TData, ...options });
export const useLoansServiceGetV1LoansByLoanIdSuspense = <TData = Common.LoansServiceGetV1LoansByLoanIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ associations, exclude, fields, loanId, staffInSelectedOfficeOnly }: {
  associations?: string;
  exclude?: string;
  fields?: string;
  loanId: number;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdKeyFn({ associations, exclude, fields, loanId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => LoansService.getV1LoansByLoanId({ associations, exclude, fields, loanId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useLoansServiceGetV1LoansByLoanIdApprovedAmountSuspense = <TData = Common.LoansServiceGetV1LoansByLoanIdApprovedAmountDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdApprovedAmountKeyFn({ loanId }, queryKey), queryFn: () => LoansService.getV1LoansByLoanIdApprovedAmount({ loanId }) as TData, ...options });
export const useLoansServiceGetV1LoansByLoanIdDelinquencyActionsSuspense = <TData = Common.LoansServiceGetV1LoansByLoanIdDelinquencyActionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdDelinquencyActionsKeyFn({ loanId }, queryKey), queryFn: () => LoansService.getV1LoansByLoanIdDelinquencyActions({ loanId }) as TData, ...options });
export const useLoansServiceGetV1LoansByLoanIdDelinquencytagsSuspense = <TData = Common.LoansServiceGetV1LoansByLoanIdDelinquencytagsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdDelinquencytagsKeyFn({ loanId }, queryKey), queryFn: () => LoansService.getV1LoansByLoanIdDelinquencytags({ loanId }) as TData, ...options });
export const useLoansServiceGetV1LoansByLoanIdTemplateSuspense = <TData = Common.LoansServiceGetV1LoansByLoanIdTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId, templateType }: {
  loanId: number;
  templateType?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdTemplateKeyFn({ loanId, templateType }, queryKey), queryFn: () => LoansService.getV1LoansByLoanIdTemplate({ loanId, templateType }) as TData, ...options });
export const useLoansPointInTimeServiceGetV1LoansAtDateExternalIdByLoanExternalIdSuspense = <TData = Common.LoansPointInTimeServiceGetV1LoansAtDateExternalIdByLoanExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ date, dateFormat, loanExternalId, locale }: {
  date: DateParam;
  dateFormat?: string;
  loanExternalId: string;
  locale?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoansPointInTimeServiceGetV1LoansAtDateExternalIdByLoanExternalIdKeyFn({ date, dateFormat, loanExternalId, locale }, queryKey), queryFn: () => LoansPointInTimeService.getV1LoansAtDateExternalIdByLoanExternalId({ date, dateFormat, loanExternalId, locale }) as TData, ...options });
export const useLoansPointInTimeServiceGetV1LoansAtDateByLoanIdSuspense = <TData = Common.LoansPointInTimeServiceGetV1LoansAtDateByLoanIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ date, dateFormat, loanId, locale }: {
  date: DateParam;
  dateFormat?: string;
  loanId: number;
  locale?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoansPointInTimeServiceGetV1LoansAtDateByLoanIdKeyFn({ date, dateFormat, loanId, locale }, queryKey), queryFn: () => LoansPointInTimeService.getV1LoansAtDateByLoanId({ date, dateFormat, loanId, locale }) as TData, ...options });
export const useLoanCobCatchUpServiceGetV1LoansIsCatchUpRunningSuspense = <TData = Common.LoanCobCatchUpServiceGetV1LoansIsCatchUpRunningDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanCobCatchUpServiceGetV1LoansIsCatchUpRunningKeyFn(queryKey), queryFn: () => LoanCobCatchUpService.getV1LoansIsCatchUpRunning() as TData, ...options });
export const useLoanCobCatchUpServiceGetV1LoansOldestCobClosedSuspense = <TData = Common.LoanCobCatchUpServiceGetV1LoansOldestCobClosedDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanCobCatchUpServiceGetV1LoansOldestCobClosedKeyFn(queryKey), queryFn: () => LoanCobCatchUpService.getV1LoansOldestCobClosed() as TData, ...options });
export const useLoanBuyDownFeesServiceGetV1LoansExternalIdByLoanExternalIdBuydownFeesSuspense = <TData = Common.LoanBuyDownFeesServiceGetV1LoansExternalIdByLoanExternalIdBuydownFeesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanBuyDownFeesServiceGetV1LoansExternalIdByLoanExternalIdBuydownFeesKeyFn({ loanExternalId }, queryKey), queryFn: () => LoanBuyDownFeesService.getV1LoansExternalIdByLoanExternalIdBuydownFees({ loanExternalId }) as TData, ...options });
export const useLoanBuyDownFeesServiceGetV1LoansByLoanIdBuydownFeesSuspense = <TData = Common.LoanBuyDownFeesServiceGetV1LoansByLoanIdBuydownFeesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanBuyDownFeesServiceGetV1LoansByLoanIdBuydownFeesKeyFn({ loanId }, queryKey), queryFn: () => LoanBuyDownFeesService.getV1LoansByLoanIdBuydownFees({ loanId }) as TData, ...options });
export const useLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdCapitalizedIncomesSuspense = <TData = Common.LoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdCapitalizedIncomesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdCapitalizedIncomesKeyFn({ loanExternalId }, queryKey), queryFn: () => LoanCapitalizedIncomeService.getV1LoansExternalIdByLoanExternalIdCapitalizedIncomes({ loanExternalId }) as TData, ...options });
export const useLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdDeferredincomeSuspense = <TData = Common.LoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdDeferredincomeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdDeferredincomeKeyFn({ loanExternalId }, queryKey), queryFn: () => LoanCapitalizedIncomeService.getV1LoansExternalIdByLoanExternalIdDeferredincome({ loanExternalId }) as TData, ...options });
export const useLoanCapitalizedIncomeServiceGetV1LoansByLoanIdCapitalizedIncomesSuspense = <TData = Common.LoanCapitalizedIncomeServiceGetV1LoansByLoanIdCapitalizedIncomesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanCapitalizedIncomeServiceGetV1LoansByLoanIdCapitalizedIncomesKeyFn({ loanId }, queryKey), queryFn: () => LoanCapitalizedIncomeService.getV1LoansByLoanIdCapitalizedIncomes({ loanId }) as TData, ...options });
export const useLoanCapitalizedIncomeServiceGetV1LoansByLoanIdDeferredincomeSuspense = <TData = Common.LoanCapitalizedIncomeServiceGetV1LoansByLoanIdDeferredincomeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanCapitalizedIncomeServiceGetV1LoansByLoanIdDeferredincomeKeyFn({ loanId }, queryKey), queryFn: () => LoanCapitalizedIncomeService.getV1LoansByLoanIdDeferredincome({ loanId }) as TData, ...options });
export const useLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesSuspense = <TData = Common.LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesKeyFn({ loanExternalId }, queryKey), queryFn: () => LoanChargesService.getV1LoansExternalIdByLoanExternalIdCharges({ loanExternalId }) as TData, ...options });
export const useLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdSuspense = <TData = Common.LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanChargeExternalId, loanExternalId }: {
  loanChargeExternalId: string;
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdKeyFn({ loanChargeExternalId, loanExternalId }, queryKey), queryFn: () => LoanChargesService.getV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalId({ loanChargeExternalId, loanExternalId }) as TData, ...options });
export const useLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesTemplateSuspense = <TData = Common.LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesTemplateKeyFn({ loanExternalId }, queryKey), queryFn: () => LoanChargesService.getV1LoansExternalIdByLoanExternalIdChargesTemplate({ loanExternalId }) as TData, ...options });
export const useLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdSuspense = <TData = Common.LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanChargeId, loanExternalId }: {
  loanChargeId: number;
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdKeyFn({ loanChargeId, loanExternalId }, queryKey), queryFn: () => LoanChargesService.getV1LoansExternalIdByLoanExternalIdChargesByLoanChargeId({ loanChargeId, loanExternalId }) as TData, ...options });
export const useLoanChargesServiceGetV1LoansByLoanIdChargesSuspense = <TData = Common.LoanChargesServiceGetV1LoansByLoanIdChargesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanChargesServiceGetV1LoansByLoanIdChargesKeyFn({ loanId }, queryKey), queryFn: () => LoanChargesService.getV1LoansByLoanIdCharges({ loanId }) as TData, ...options });
export const useLoanChargesServiceGetV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdSuspense = <TData = Common.LoanChargesServiceGetV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanChargeExternalId, loanId }: {
  loanChargeExternalId: string;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanChargesServiceGetV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdKeyFn({ loanChargeExternalId, loanId }, queryKey), queryFn: () => LoanChargesService.getV1LoansByLoanIdChargesExternalIdByLoanChargeExternalId({ loanChargeExternalId, loanId }) as TData, ...options });
export const useLoanChargesServiceGetV1LoansByLoanIdChargesTemplateSuspense = <TData = Common.LoanChargesServiceGetV1LoansByLoanIdChargesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanChargesServiceGetV1LoansByLoanIdChargesTemplateKeyFn({ loanId }, queryKey), queryFn: () => LoanChargesService.getV1LoansByLoanIdChargesTemplate({ loanId }) as TData, ...options });
export const useLoanChargesServiceGetV1LoansByLoanIdChargesByLoanChargeIdSuspense = <TData = Common.LoanChargesServiceGetV1LoansByLoanIdChargesByLoanChargeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanChargeId, loanId }: {
  loanChargeId: number;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanChargesServiceGetV1LoansByLoanIdChargesByLoanChargeIdKeyFn({ loanChargeId, loanId }, queryKey), queryFn: () => LoanChargesService.getV1LoansByLoanIdChargesByLoanChargeId({ loanChargeId, loanId }) as TData, ...options });
export const useLoanInterestPauseServiceGetV1LoansExternalIdByLoanExternalIdInterestPausesSuspense = <TData = Common.LoanInterestPauseServiceGetV1LoansExternalIdByLoanExternalIdInterestPausesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanInterestPauseServiceGetV1LoansExternalIdByLoanExternalIdInterestPausesKeyFn({ loanExternalId }, queryKey), queryFn: () => LoanInterestPauseService.getV1LoansExternalIdByLoanExternalIdInterestPauses({ loanExternalId }) as TData, ...options });
export const useLoanInterestPauseServiceGetV1LoansByLoanIdInterestPausesSuspense = <TData = Common.LoanInterestPauseServiceGetV1LoansByLoanIdInterestPausesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanInterestPauseServiceGetV1LoansByLoanIdInterestPausesKeyFn({ loanId }, queryKey), queryFn: () => LoanInterestPauseService.getV1LoansByLoanIdInterestPauses({ loanId }) as TData, ...options });
export const useLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsSuspense = <TData = Common.LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ excludedTypes, loanExternalId, page, size, sort }: {
  excludedTypes?: TransactionType[];
  loanExternalId: string;
  page?: number;
  size?: number;
  sort?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsKeyFn({ excludedTypes, loanExternalId, page, size, sort }, queryKey), queryFn: () => LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactions({ excludedTypes, loanExternalId, page, size, sort }) as TData, ...options });
export const useLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionIdSuspense = <TData = Common.LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalTransactionId, fields, loanExternalId }: {
  externalTransactionId: string;
  fields?: string;
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionIdKeyFn({ externalTransactionId, fields, loanExternalId }, queryKey), queryFn: () => LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionId({ externalTransactionId, fields, loanExternalId }) as TData, ...options });
export const useLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsTemplateSuspense = <TData = Common.LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ command, dateFormat, loanExternalId, locale, transactionDate, transactionId }: {
  command?: string;
  dateFormat?: string;
  loanExternalId: string;
  locale?: string;
  transactionDate?: DateParam;
  transactionId?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsTemplateKeyFn({ command, dateFormat, loanExternalId, locale, transactionDate, transactionId }, queryKey), queryFn: () => LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactionsTemplate({ command, dateFormat, loanExternalId, locale, transactionDate, transactionId }) as TData, ...options });
export const useLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdSuspense = <TData = Common.LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fields, loanExternalId, transactionId }: {
  fields?: string;
  loanExternalId: string;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdKeyFn({ fields, loanExternalId, transactionId }, queryKey), queryFn: () => LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactionsByTransactionId({ fields, loanExternalId, transactionId }) as TData, ...options });
export const useLoanTransactionsServiceGetV1LoansByLoanIdTransactionsSuspense = <TData = Common.LoanTransactionsServiceGetV1LoansByLoanIdTransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ excludedTypes, loanId, page, size, sort }: {
  excludedTypes?: TransactionType[];
  loanId: number;
  page?: number;
  size?: number;
  sort?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsKeyFn({ excludedTypes, loanId, page, size, sort }, queryKey), queryFn: () => LoanTransactionsService.getV1LoansByLoanIdTransactions({ excludedTypes, loanId, page, size, sort }) as TData, ...options });
export const useLoanTransactionsServiceGetV1LoansByLoanIdTransactionsExternalIdByExternalTransactionIdSuspense = <TData = Common.LoanTransactionsServiceGetV1LoansByLoanIdTransactionsExternalIdByExternalTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalTransactionId, fields, loanId }: {
  externalTransactionId: string;
  fields?: string;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsExternalIdByExternalTransactionIdKeyFn({ externalTransactionId, fields, loanId }, queryKey), queryFn: () => LoanTransactionsService.getV1LoansByLoanIdTransactionsExternalIdByExternalTransactionId({ externalTransactionId, fields, loanId }) as TData, ...options });
export const useLoanTransactionsServiceGetV1LoansByLoanIdTransactionsTemplateSuspense = <TData = Common.LoanTransactionsServiceGetV1LoansByLoanIdTransactionsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ command, dateFormat, loanId, locale, transactionDate, transactionId }: {
  command?: string;
  dateFormat?: string;
  loanId: number;
  locale?: string;
  transactionDate?: DateParam;
  transactionId?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsTemplateKeyFn({ command, dateFormat, loanId, locale, transactionDate, transactionId }, queryKey), queryFn: () => LoanTransactionsService.getV1LoansByLoanIdTransactionsTemplate({ command, dateFormat, loanId, locale, transactionDate, transactionId }) as TData, ...options });
export const useLoanTransactionsServiceGetV1LoansByLoanIdTransactionsByTransactionIdSuspense = <TData = Common.LoanTransactionsServiceGetV1LoansByLoanIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fields, loanId, transactionId }: {
  fields?: string;
  loanId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsByTransactionIdKeyFn({ fields, loanId, transactionId }, queryKey), queryFn: () => LoanTransactionsService.getV1LoansByLoanIdTransactionsByTransactionId({ fields, loanId, transactionId }) as TData, ...options });
export const useBulkLoansServiceGetV1LoansLoanreassignmentTemplateSuspense = <TData = Common.BulkLoansServiceGetV1LoansLoanreassignmentTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fromLoanOfficerId, officeId }: {
  fromLoanOfficerId?: number;
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseBulkLoansServiceGetV1LoansLoanreassignmentTemplateKeyFn({ fromLoanOfficerId, officeId }, queryKey), queryFn: () => BulkLoansService.getV1LoansLoanreassignmentTemplate({ fromLoanOfficerId, officeId }) as TData, ...options });
export const useLoanAccountLockServiceGetV1LoansLockedSuspense = <TData = Common.LoanAccountLockServiceGetV1LoansLockedDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, page }: {
  limit?: number;
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanAccountLockServiceGetV1LoansLockedKeyFn({ limit, page }, queryKey), queryFn: () => LoanAccountLockService.getV1LoansLocked({ limit, page }) as TData, ...options });
export const useLoanCollateralServiceGetV1LoansByLoanIdCollateralsSuspense = <TData = Common.LoanCollateralServiceGetV1LoansByLoanIdCollateralsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanCollateralServiceGetV1LoansByLoanIdCollateralsKeyFn({ loanId }, queryKey), queryFn: () => LoanCollateralService.getV1LoansByLoanIdCollaterals({ loanId }) as TData, ...options });
export const useLoanCollateralServiceGetV1LoansByLoanIdCollateralsTemplateSuspense = <TData = Common.LoanCollateralServiceGetV1LoansByLoanIdCollateralsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanCollateralServiceGetV1LoansByLoanIdCollateralsTemplateKeyFn({ loanId }, queryKey), queryFn: () => LoanCollateralService.getV1LoansByLoanIdCollateralsTemplate({ loanId }) as TData, ...options });
export const useLoanCollateralServiceGetV1LoansByLoanIdCollateralsByCollateralIdSuspense = <TData = Common.LoanCollateralServiceGetV1LoansByLoanIdCollateralsByCollateralIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ collateralId, loanId }: {
  collateralId: number;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanCollateralServiceGetV1LoansByLoanIdCollateralsByCollateralIdKeyFn({ collateralId, loanId }, queryKey), queryFn: () => LoanCollateralService.getV1LoansByLoanIdCollateralsByCollateralId({ collateralId, loanId }) as TData, ...options });
export const useLoanDisbursementDetailsServiceGetV1LoansByLoanIdDisbursementsByDisbursementIdSuspense = <TData = Common.LoanDisbursementDetailsServiceGetV1LoansByLoanIdDisbursementsByDisbursementIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ disbursementId, loanId }: {
  disbursementId: number;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseLoanDisbursementDetailsServiceGetV1LoansByLoanIdDisbursementsByDisbursementIdKeyFn({ disbursementId, loanId }, queryKey), queryFn: () => LoanDisbursementDetailsService.getV1LoansByLoanIdDisbursementsByDisbursementId({ disbursementId, loanId }) as TData, ...options });
export const useGuarantorsServiceGetV1LoansByLoanIdGuarantorsSuspense = <TData = Common.GuarantorsServiceGetV1LoansByLoanIdGuarantorsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsKeyFn({ loanId }, queryKey), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantors({ loanId }) as TData, ...options });
export const useGuarantorsServiceGetV1LoansByLoanIdGuarantorsAccountsTemplateSuspense = <TData = Common.GuarantorsServiceGetV1LoansByLoanIdGuarantorsAccountsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, loanId }: {
  clientId?: number;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsAccountsTemplateKeyFn({ clientId, loanId }, queryKey), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantorsAccountsTemplate({ clientId, loanId }) as TData, ...options });
export const useGuarantorsServiceGetV1LoansByLoanIdGuarantorsDownloadtemplateSuspense = <TData = Common.GuarantorsServiceGetV1LoansByLoanIdGuarantorsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, loanId, officeId }: {
  dateFormat?: string;
  loanId: number;
  officeId?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsDownloadtemplateKeyFn({ dateFormat, loanId, officeId }, queryKey), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantorsDownloadtemplate({ dateFormat, loanId, officeId }) as TData, ...options });
export const useGuarantorsServiceGetV1LoansByLoanIdGuarantorsTemplateSuspense = <TData = Common.GuarantorsServiceGetV1LoansByLoanIdGuarantorsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsTemplateKeyFn({ loanId }, queryKey), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantorsTemplate({ loanId }) as TData, ...options });
export const useGuarantorsServiceGetV1LoansByLoanIdGuarantorsByGuarantorIdSuspense = <TData = Common.GuarantorsServiceGetV1LoansByLoanIdGuarantorsByGuarantorIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ guarantorId, loanId }: {
  guarantorId: number;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsByGuarantorIdKeyFn({ guarantorId, loanId }, queryKey), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantorsByGuarantorId({ guarantorId, loanId }) as TData, ...options });
export const useRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksSuspense = <TData = Common.RepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksKeyFn({ loanId }, queryKey), queryFn: () => RepaymentWithPostDatedChecksService.getV1LoansByLoanIdPostdatedchecks({ loanId }) as TData, ...options });
export const useRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksByInstallmentIdSuspense = <TData = Common.RepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksByInstallmentIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ installmentId, loanId }: {
  installmentId: number;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksByInstallmentIdKeyFn({ installmentId, loanId }, queryKey), queryFn: () => RepaymentWithPostDatedChecksService.getV1LoansByLoanIdPostdatedchecksByInstallmentId({ installmentId, loanId }) as TData, ...options });
export const useMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSuspense = <TData = Common.MakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ actionName, clientId, entityName, groupId, loanid, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, resourceId, savingsAccountId }: {
  actionName?: string;
  clientId?: number;
  entityName?: string;
  groupId?: number;
  loanid?: number;
  makerDateTimeFrom?: string;
  makerDateTimeTo?: string;
  makerId?: number;
  officeId?: number;
  resourceId?: number;
  savingsAccountId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersKeyFn({ actionName, clientId, entityName, groupId, loanid, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, resourceId, savingsAccountId }, queryKey), queryFn: () => MakerCheckerOr4EyeFunctionalityService.getV1Makercheckers({ actionName, clientId, entityName, groupId, loanid, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, resourceId, savingsAccountId }) as TData, ...options });
export const useMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSearchtemplateSuspense = <TData = Common.MakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSearchtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSearchtemplateKeyFn(queryKey), queryFn: () => MakerCheckerOr4EyeFunctionalityService.getV1MakercheckersSearchtemplate() as TData, ...options });
export const useMixMappingServiceGetV1MixmappingSuspense = <TData = Common.MixMappingServiceGetV1MixmappingDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseMixMappingServiceGetV1MixmappingKeyFn(queryKey), queryFn: () => MixMappingService.getV1Mixmapping() as TData, ...options });
export const useMixReportServiceGetV1MixreportSuspense = <TData = Common.MixReportServiceGetV1MixreportDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ currency, endDate, startDate }: {
  currency?: string;
  endDate?: string;
  startDate?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseMixReportServiceGetV1MixreportKeyFn({ currency, endDate, startDate }, queryKey), queryFn: () => MixReportService.getV1Mixreport({ currency, endDate, startDate }) as TData, ...options });
export const useMixTaxonomyServiceGetV1MixtaxonomySuspense = <TData = Common.MixTaxonomyServiceGetV1MixtaxonomyDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseMixTaxonomyServiceGetV1MixtaxonomyKeyFn(queryKey), queryFn: () => MixTaxonomyService.getV1Mixtaxonomy() as TData, ...options });
export const useNotificationServiceGetV1NotificationsSuspense = <TData = Common.NotificationServiceGetV1NotificationsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ isRead, limit, offset, orderBy, sortOrder }: {
  isRead?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseNotificationServiceGetV1NotificationsKeyFn({ isRead, limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => NotificationService.getV1Notifications({ isRead, limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useOfficesServiceGetV1OfficesSuspense = <TData = Common.OfficesServiceGetV1OfficesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ includeAllOffices, orderBy, sortOrder }: {
  includeAllOffices?: boolean;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseOfficesServiceGetV1OfficesKeyFn({ includeAllOffices, orderBy, sortOrder }, queryKey), queryFn: () => OfficesService.getV1Offices({ includeAllOffices, orderBy, sortOrder }) as TData, ...options });
export const useOfficesServiceGetV1OfficesDownloadtemplateSuspense = <TData = Common.OfficesServiceGetV1OfficesDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat }: {
  dateFormat?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseOfficesServiceGetV1OfficesDownloadtemplateKeyFn({ dateFormat }, queryKey), queryFn: () => OfficesService.getV1OfficesDownloadtemplate({ dateFormat }) as TData, ...options });
export const useOfficesServiceGetV1OfficesExternalIdByExternalIdSuspense = <TData = Common.OfficesServiceGetV1OfficesExternalIdByExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalId }: {
  externalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseOfficesServiceGetV1OfficesExternalIdByExternalIdKeyFn({ externalId }, queryKey), queryFn: () => OfficesService.getV1OfficesExternalIdByExternalId({ externalId }) as TData, ...options });
export const useOfficesServiceGetV1OfficesTemplateSuspense = <TData = Common.OfficesServiceGetV1OfficesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseOfficesServiceGetV1OfficesTemplateKeyFn(queryKey), queryFn: () => OfficesService.getV1OfficesTemplate() as TData, ...options });
export const useOfficesServiceGetV1OfficesByOfficeIdSuspense = <TData = Common.OfficesServiceGetV1OfficesByOfficeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ officeId }: {
  officeId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseOfficesServiceGetV1OfficesByOfficeIdKeyFn({ officeId }, queryKey), queryFn: () => OfficesService.getV1OfficesByOfficeId({ officeId }) as TData, ...options });
export const usePasswordPreferencesServiceGetV1PasswordpreferencesSuspense = <TData = Common.PasswordPreferencesServiceGetV1PasswordpreferencesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UsePasswordPreferencesServiceGetV1PasswordpreferencesKeyFn(queryKey), queryFn: () => PasswordPreferencesService.getV1Passwordpreferences() as TData, ...options });
export const usePasswordPreferencesServiceGetV1PasswordpreferencesTemplateSuspense = <TData = Common.PasswordPreferencesServiceGetV1PasswordpreferencesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UsePasswordPreferencesServiceGetV1PasswordpreferencesTemplateKeyFn(queryKey), queryFn: () => PasswordPreferencesService.getV1PasswordpreferencesTemplate() as TData, ...options });
export const usePaymentTypeServiceGetV1PaymenttypesSuspense = <TData = Common.PaymentTypeServiceGetV1PaymenttypesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ onlyWithCode }: {
  onlyWithCode?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UsePaymentTypeServiceGetV1PaymenttypesKeyFn({ onlyWithCode }, queryKey), queryFn: () => PaymentTypeService.getV1Paymenttypes({ onlyWithCode }) as TData, ...options });
export const usePaymentTypeServiceGetV1PaymenttypesByPaymentTypeIdSuspense = <TData = Common.PaymentTypeServiceGetV1PaymenttypesByPaymentTypeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ paymentTypeId }: {
  paymentTypeId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UsePaymentTypeServiceGetV1PaymenttypesByPaymentTypeIdKeyFn({ paymentTypeId }, queryKey), queryFn: () => PaymentTypeService.getV1PaymenttypesByPaymentTypeId({ paymentTypeId }) as TData, ...options });
export const usePermissionsServiceGetV1PermissionsSuspense = <TData = Common.PermissionsServiceGetV1PermissionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UsePermissionsServiceGetV1PermissionsKeyFn(queryKey), queryFn: () => PermissionsService.getV1Permissions() as TData, ...options });
export const usePovertyLineServiceGetV1PovertyLineByPpiNameSuspense = <TData = Common.PovertyLineServiceGetV1PovertyLineByPpiNameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ ppiName }: {
  ppiName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UsePovertyLineServiceGetV1PovertyLineByPpiNameKeyFn({ ppiName }, queryKey), queryFn: () => PovertyLineService.getV1PovertyLineByPpiName({ ppiName }) as TData, ...options });
export const usePovertyLineServiceGetV1PovertyLineByPpiNameByLikelihoodIdSuspense = <TData = Common.PovertyLineServiceGetV1PovertyLineByPpiNameByLikelihoodIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ likelihoodId, ppiName }: {
  likelihoodId: number;
  ppiName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UsePovertyLineServiceGetV1PovertyLineByPpiNameByLikelihoodIdKeyFn({ likelihoodId, ppiName }, queryKey), queryFn: () => PovertyLineService.getV1PovertyLineByPpiNameByLikelihoodId({ likelihoodId, ppiName }) as TData, ...options });
export const useProductsServiceGetV1ProductsByTypeSuspense = <TData = Common.ProductsServiceGetV1ProductsByTypeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, type }: {
  limit?: number;
  offset?: number;
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseProductsServiceGetV1ProductsByTypeKeyFn({ limit, offset, type }, queryKey), queryFn: () => ProductsService.getV1ProductsByType({ limit, offset, type }) as TData, ...options });
export const useProductsServiceGetV1ProductsByTypeTemplateSuspense = <TData = Common.ProductsServiceGetV1ProductsByTypeTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ type }: {
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseProductsServiceGetV1ProductsByTypeTemplateKeyFn({ type }, queryKey), queryFn: () => ProductsService.getV1ProductsByTypeTemplate({ type }) as TData, ...options });
export const useProductsServiceGetV1ProductsByTypeByProductIdSuspense = <TData = Common.ProductsServiceGetV1ProductsByTypeByProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ productId, type }: {
  productId: number;
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseProductsServiceGetV1ProductsByTypeByProductIdKeyFn({ productId, type }, queryKey), queryFn: () => ProductsService.getV1ProductsByTypeByProductId({ productId, type }) as TData, ...options });
export const useProvisioningCategoryServiceGetV1ProvisioningcategorySuspense = <TData = Common.ProvisioningCategoryServiceGetV1ProvisioningcategoryDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseProvisioningCategoryServiceGetV1ProvisioningcategoryKeyFn(queryKey), queryFn: () => ProvisioningCategoryService.getV1Provisioningcategory() as TData, ...options });
export const useProvisioningCriteriaServiceGetV1ProvisioningcriteriaSuspense = <TData = Common.ProvisioningCriteriaServiceGetV1ProvisioningcriteriaDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseProvisioningCriteriaServiceGetV1ProvisioningcriteriaKeyFn(queryKey), queryFn: () => ProvisioningCriteriaService.getV1Provisioningcriteria() as TData, ...options });
export const useProvisioningCriteriaServiceGetV1ProvisioningcriteriaTemplateSuspense = <TData = Common.ProvisioningCriteriaServiceGetV1ProvisioningcriteriaTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseProvisioningCriteriaServiceGetV1ProvisioningcriteriaTemplateKeyFn(queryKey), queryFn: () => ProvisioningCriteriaService.getV1ProvisioningcriteriaTemplate() as TData, ...options });
export const useProvisioningCriteriaServiceGetV1ProvisioningcriteriaByCriteriaIdSuspense = <TData = Common.ProvisioningCriteriaServiceGetV1ProvisioningcriteriaByCriteriaIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ criteriaId }: {
  criteriaId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseProvisioningCriteriaServiceGetV1ProvisioningcriteriaByCriteriaIdKeyFn({ criteriaId }, queryKey), queryFn: () => ProvisioningCriteriaService.getV1ProvisioningcriteriaByCriteriaId({ criteriaId }) as TData, ...options });
export const useProvisioningEntriesServiceGetV1ProvisioningentriesSuspense = <TData = Common.ProvisioningEntriesServiceGetV1ProvisioningentriesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset }: {
  limit?: number;
  offset?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseProvisioningEntriesServiceGetV1ProvisioningentriesKeyFn({ limit, offset }, queryKey), queryFn: () => ProvisioningEntriesService.getV1Provisioningentries({ limit, offset }) as TData, ...options });
export const useProvisioningEntriesServiceGetV1ProvisioningentriesEntriesSuspense = <TData = Common.ProvisioningEntriesServiceGetV1ProvisioningentriesEntriesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ categoryId, entryId, limit, officeId, offset, productId }: {
  categoryId?: number;
  entryId?: number;
  limit?: number;
  officeId?: number;
  offset?: number;
  productId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseProvisioningEntriesServiceGetV1ProvisioningentriesEntriesKeyFn({ categoryId, entryId, limit, officeId, offset, productId }, queryKey), queryFn: () => ProvisioningEntriesService.getV1ProvisioningentriesEntries({ categoryId, entryId, limit, officeId, offset, productId }) as TData, ...options });
export const useProvisioningEntriesServiceGetV1ProvisioningentriesByEntryIdSuspense = <TData = Common.ProvisioningEntriesServiceGetV1ProvisioningentriesByEntryIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entryId }: {
  entryId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseProvisioningEntriesServiceGetV1ProvisioningentriesByEntryIdKeyFn({ entryId }, queryKey), queryFn: () => ProvisioningEntriesService.getV1ProvisioningentriesByEntryId({ entryId }) as TData, ...options });
export const useRateServiceGetV1RatesSuspense = <TData = Common.RateServiceGetV1RatesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRateServiceGetV1RatesKeyFn(queryKey), queryFn: () => RateService.getV1Rates() as TData, ...options });
export const useRateServiceGetV1RatesByRateIdSuspense = <TData = Common.RateServiceGetV1RatesByRateIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ rateId }: {
  rateId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRateServiceGetV1RatesByRateIdKeyFn({ rateId }, queryKey), queryFn: () => RateService.getV1RatesByRateId({ rateId }) as TData, ...options });
export const useRecurringDepositAccountServiceGetV1RecurringdepositaccountsSuspense = <TData = Common.RecurringDepositAccountServiceGetV1RecurringdepositaccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, paged, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  paged?: boolean;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsKeyFn({ limit, offset, orderBy, paged, sortOrder }, queryKey), queryFn: () => RecurringDepositAccountService.getV1Recurringdepositaccounts({ limit, offset, orderBy, paged, sortOrder }) as TData, ...options });
export const useRecurringDepositAccountServiceGetV1RecurringdepositaccountsDownloadtemplateSuspense = <TData = Common.RecurringDepositAccountServiceGetV1RecurringdepositaccountsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsDownloadtemplateKeyFn({ dateFormat, officeId, staffId }, queryKey), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsDownloadtemplate({ dateFormat, officeId, staffId }) as TData, ...options });
export const useRecurringDepositAccountServiceGetV1RecurringdepositaccountsTemplateSuspense = <TData = Common.RecurringDepositAccountServiceGetV1RecurringdepositaccountsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, groupId, productId, staffInSelectedOfficeOnly }: {
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsTemplateKeyFn({ clientId, groupId, productId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsTemplate({ clientId, groupId, productId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useRecurringDepositAccountServiceGetV1RecurringdepositaccountsTransactionsDownloadtemplateSuspense = <TData = Common.RecurringDepositAccountServiceGetV1RecurringdepositaccountsTransactionsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsTransactionsDownloadtemplateKeyFn({ dateFormat, officeId }, queryKey), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsTransactionsDownloadtemplate({ dateFormat, officeId }) as TData, ...options });
export const useRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdSuspense = <TData = Common.RecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, chargeStatus, staffInSelectedOfficeOnly }: {
  accountId: number;
  chargeStatus?: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdKeyFn({ accountId, chargeStatus, staffInSelectedOfficeOnly }, queryKey), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsByAccountId({ accountId, chargeStatus, staffInSelectedOfficeOnly }) as TData, ...options });
export const useRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdTemplateSuspense = <TData = Common.RecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, command }: {
  accountId: number;
  command?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdTemplateKeyFn({ accountId, command }, queryKey), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsByAccountIdTemplate({ accountId, command }) as TData, ...options });
export const useRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplateSuspense = <TData = Common.RecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ command, recurringDepositAccountId }: {
  command?: string;
  recurringDepositAccountId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplateKeyFn({ command, recurringDepositAccountId }, queryKey), queryFn: () => RecurringDepositAccountTransactionsService.getV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplate({ command, recurringDepositAccountId }) as TData, ...options });
export const useRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionIdSuspense = <TData = Common.RecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ recurringDepositAccountId, transactionId }: {
  recurringDepositAccountId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionIdKeyFn({ recurringDepositAccountId, transactionId }, queryKey), queryFn: () => RecurringDepositAccountTransactionsService.getV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionId({ recurringDepositAccountId, transactionId }) as TData, ...options });
export const useRecurringDepositProductServiceGetV1RecurringdepositproductsSuspense = <TData = Common.RecurringDepositProductServiceGetV1RecurringdepositproductsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRecurringDepositProductServiceGetV1RecurringdepositproductsKeyFn(queryKey), queryFn: () => RecurringDepositProductService.getV1Recurringdepositproducts() as TData, ...options });
export const useRecurringDepositProductServiceGetV1RecurringdepositproductsTemplateSuspense = <TData = Common.RecurringDepositProductServiceGetV1RecurringdepositproductsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRecurringDepositProductServiceGetV1RecurringdepositproductsTemplateKeyFn(queryKey), queryFn: () => RecurringDepositProductService.getV1RecurringdepositproductsTemplate() as TData, ...options });
export const useRecurringDepositProductServiceGetV1RecurringdepositproductsByProductIdSuspense = <TData = Common.RecurringDepositProductServiceGetV1RecurringdepositproductsByProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ productId }: {
  productId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRecurringDepositProductServiceGetV1RecurringdepositproductsByProductIdKeyFn({ productId }, queryKey), queryFn: () => RecurringDepositProductService.getV1RecurringdepositproductsByProductId({ productId }) as TData, ...options });
export const useListReportMailingJobHistoryServiceGetV1ReportmailingjobrunhistorySuspense = <TData = Common.ListReportMailingJobHistoryServiceGetV1ReportmailingjobrunhistoryDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, reportMailingJobId, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  reportMailingJobId?: number;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseListReportMailingJobHistoryServiceGetV1ReportmailingjobrunhistoryKeyFn({ limit, offset, orderBy, reportMailingJobId, sortOrder }, queryKey), queryFn: () => ListReportMailingJobHistoryService.getV1Reportmailingjobrunhistory({ limit, offset, orderBy, reportMailingJobId, sortOrder }) as TData, ...options });
export const useReportMailingJobsServiceGetV1ReportmailingjobsSuspense = <TData = Common.ReportMailingJobsServiceGetV1ReportmailingjobsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseReportMailingJobsServiceGetV1ReportmailingjobsKeyFn({ limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => ReportMailingJobsService.getV1Reportmailingjobs({ limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useReportMailingJobsServiceGetV1ReportmailingjobsTemplateSuspense = <TData = Common.ReportMailingJobsServiceGetV1ReportmailingjobsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseReportMailingJobsServiceGetV1ReportmailingjobsTemplateKeyFn(queryKey), queryFn: () => ReportMailingJobsService.getV1ReportmailingjobsTemplate() as TData, ...options });
export const useReportMailingJobsServiceGetV1ReportmailingjobsByEntityIdSuspense = <TData = Common.ReportMailingJobsServiceGetV1ReportmailingjobsByEntityIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entityId }: {
  entityId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseReportMailingJobsServiceGetV1ReportmailingjobsByEntityIdKeyFn({ entityId }, queryKey), queryFn: () => ReportMailingJobsService.getV1ReportmailingjobsByEntityId({ entityId }) as TData, ...options });
export const useReportsServiceGetV1ReportsSuspense = <TData = Common.ReportsServiceGetV1ReportsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseReportsServiceGetV1ReportsKeyFn(queryKey), queryFn: () => ReportsService.getV1Reports() as TData, ...options });
export const useReportsServiceGetV1ReportsTemplateSuspense = <TData = Common.ReportsServiceGetV1ReportsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseReportsServiceGetV1ReportsTemplateKeyFn(queryKey), queryFn: () => ReportsService.getV1ReportsTemplate() as TData, ...options });
export const useReportsServiceGetV1ReportsByIdSuspense = <TData = Common.ReportsServiceGetV1ReportsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseReportsServiceGetV1ReportsByIdKeyFn({ id }, queryKey), queryFn: () => ReportsService.getV1ReportsById({ id }) as TData, ...options });
export const useRescheduleLoansServiceGetV1RescheduleloansSuspense = <TData = Common.RescheduleLoansServiceGetV1RescheduleloansDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ command, loanId }: {
  command?: string;
  loanId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRescheduleLoansServiceGetV1RescheduleloansKeyFn({ command, loanId }, queryKey), queryFn: () => RescheduleLoansService.getV1Rescheduleloans({ command, loanId }) as TData, ...options });
export const useRescheduleLoansServiceGetV1RescheduleloansTemplateSuspense = <TData = Common.RescheduleLoansServiceGetV1RescheduleloansTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRescheduleLoansServiceGetV1RescheduleloansTemplateKeyFn(queryKey), queryFn: () => RescheduleLoansService.getV1RescheduleloansTemplate() as TData, ...options });
export const useRescheduleLoansServiceGetV1RescheduleloansByScheduleIdSuspense = <TData = Common.RescheduleLoansServiceGetV1RescheduleloansByScheduleIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ command, scheduleId }: {
  command?: string;
  scheduleId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRescheduleLoansServiceGetV1RescheduleloansByScheduleIdKeyFn({ command, scheduleId }, queryKey), queryFn: () => RescheduleLoansService.getV1RescheduleloansByScheduleId({ command, scheduleId }) as TData, ...options });
export const useRolesServiceGetV1RolesSuspense = <TData = Common.RolesServiceGetV1RolesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRolesServiceGetV1RolesKeyFn(queryKey), queryFn: () => RolesService.getV1Roles() as TData, ...options });
export const useRolesServiceGetV1RolesByRoleIdSuspense = <TData = Common.RolesServiceGetV1RolesByRoleIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ roleId }: {
  roleId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRolesServiceGetV1RolesByRoleIdKeyFn({ roleId }, queryKey), queryFn: () => RolesService.getV1RolesByRoleId({ roleId }) as TData, ...options });
export const useRolesServiceGetV1RolesByRoleIdPermissionsSuspense = <TData = Common.RolesServiceGetV1RolesByRoleIdPermissionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ roleId }: {
  roleId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRolesServiceGetV1RolesByRoleIdPermissionsKeyFn({ roleId }, queryKey), queryFn: () => RolesService.getV1RolesByRoleIdPermissions({ roleId }) as TData, ...options });
export const useRunReportsServiceGetV1RunreportsAvailableExportsByReportNameSuspense = <TData = Common.RunReportsServiceGetV1RunreportsAvailableExportsByReportNameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ isSelfServiceUserReport, reportName }: {
  isSelfServiceUserReport?: boolean;
  reportName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRunReportsServiceGetV1RunreportsAvailableExportsByReportNameKeyFn({ isSelfServiceUserReport, reportName }, queryKey), queryFn: () => RunReportsService.getV1RunreportsAvailableExportsByReportName({ isSelfServiceUserReport, reportName }) as TData, ...options });
export const useRunReportsServiceGetV1RunreportsByReportNameSuspense = <TData = Common.RunReportsServiceGetV1RunreportsByReportNameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ isSelfServiceUserReport, reportName }: {
  isSelfServiceUserReport?: boolean;
  reportName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseRunReportsServiceGetV1RunreportsByReportNameKeyFn({ isSelfServiceUserReport, reportName }, queryKey), queryFn: () => RunReportsService.getV1RunreportsByReportName({ isSelfServiceUserReport, reportName }) as TData, ...options });
export const useSavingsAccountServiceGetV1SavingsaccountsSuspense = <TData = Common.SavingsAccountServiceGetV1SavingsaccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalId, limit, offset, orderBy, sortOrder }: {
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsKeyFn({ externalId, limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => SavingsAccountService.getV1Savingsaccounts({ externalId, limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useSavingsAccountServiceGetV1SavingsaccountsDownloadtemplateSuspense = <TData = Common.SavingsAccountServiceGetV1SavingsaccountsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsDownloadtemplateKeyFn({ dateFormat, officeId, staffId }, queryKey), queryFn: () => SavingsAccountService.getV1SavingsaccountsDownloadtemplate({ dateFormat, officeId, staffId }) as TData, ...options });
export const useSavingsAccountServiceGetV1SavingsaccountsExternalIdByExternalIdSuspense = <TData = Common.SavingsAccountServiceGetV1SavingsaccountsExternalIdByExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ associations, chargeStatus, externalId, staffInSelectedOfficeOnly }: {
  associations?: string;
  chargeStatus?: string;
  externalId: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsExternalIdByExternalIdKeyFn({ associations, chargeStatus, externalId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => SavingsAccountService.getV1SavingsaccountsExternalIdByExternalId({ associations, chargeStatus, externalId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useSavingsAccountServiceGetV1SavingsaccountsTemplateSuspense = <TData = Common.SavingsAccountServiceGetV1SavingsaccountsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, groupId, productId, staffInSelectedOfficeOnly }: {
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsTemplateKeyFn({ clientId, groupId, productId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => SavingsAccountService.getV1SavingsaccountsTemplate({ clientId, groupId, productId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useSavingsAccountServiceGetV1SavingsaccountsTransactionsDownloadtemplateSuspense = <TData = Common.SavingsAccountServiceGetV1SavingsaccountsTransactionsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsTransactionsDownloadtemplateKeyFn({ dateFormat, officeId }, queryKey), queryFn: () => SavingsAccountService.getV1SavingsaccountsTransactionsDownloadtemplate({ dateFormat, officeId }) as TData, ...options });
export const useSavingsAccountServiceGetV1SavingsaccountsByAccountIdSuspense = <TData = Common.SavingsAccountServiceGetV1SavingsaccountsByAccountIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, associations, chargeStatus, staffInSelectedOfficeOnly }: {
  accountId: number;
  associations?: string;
  chargeStatus?: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsByAccountIdKeyFn({ accountId, associations, chargeStatus, staffInSelectedOfficeOnly }, queryKey), queryFn: () => SavingsAccountService.getV1SavingsaccountsByAccountId({ accountId, associations, chargeStatus, staffInSelectedOfficeOnly }) as TData, ...options });
export const useSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesSuspense = <TData = Common.SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chargeStatus, savingsAccountId }: {
  chargeStatus?: string;
  savingsAccountId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesKeyFn({ chargeStatus, savingsAccountId }, queryKey), queryFn: () => SavingsChargesService.getV1SavingsaccountsBySavingsAccountIdCharges({ chargeStatus, savingsAccountId }) as TData, ...options });
export const useSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesTemplateSuspense = <TData = Common.SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ savingsAccountId }: {
  savingsAccountId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesTemplateKeyFn({ savingsAccountId }, queryKey), queryFn: () => SavingsChargesService.getV1SavingsaccountsBySavingsAccountIdChargesTemplate({ savingsAccountId }) as TData, ...options });
export const useSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdSuspense = <TData = Common.SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ savingsAccountChargeId, savingsAccountId }: {
  savingsAccountChargeId: number;
  savingsAccountId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdKeyFn({ savingsAccountChargeId, savingsAccountId }, queryKey), queryFn: () => SavingsChargesService.getV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeId({ savingsAccountChargeId, savingsAccountId }) as TData, ...options });
export const useDepositAccountOnHoldFundTransactionsServiceGetV1SavingsaccountsBySavingsIdOnholdtransactionsSuspense = <TData = Common.DepositAccountOnHoldFundTransactionsServiceGetV1SavingsaccountsBySavingsIdOnholdtransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ guarantorFundingId, limit, offset, orderBy, savingsId, sortOrder }: {
  guarantorFundingId?: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  savingsId: number;
  sortOrder?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDepositAccountOnHoldFundTransactionsServiceGetV1SavingsaccountsBySavingsIdOnholdtransactionsKeyFn({ guarantorFundingId, limit, offset, orderBy, savingsId, sortOrder }, queryKey), queryFn: () => DepositAccountOnHoldFundTransactionsService.getV1SavingsaccountsBySavingsIdOnholdtransactions({ guarantorFundingId, limit, offset, orderBy, savingsId, sortOrder }) as TData, ...options });
export const useSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsSearchSuspense = <TData = Common.SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsSearchDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ credit, dateFormat, debit, fromAmount, fromDate, fromSubmittedDate, limit, locale, offset, orderBy, savingsId, sortOrder, toAmount, toDate, toSubmittedDate, types }: {
  credit?: boolean;
  dateFormat?: string;
  debit?: boolean;
  fromAmount?: number;
  fromDate?: string;
  fromSubmittedDate?: string;
  limit?: number;
  locale?: string;
  offset?: number;
  orderBy?: string;
  savingsId: number;
  sortOrder?: "ASC" | "DESC";
  toAmount?: number;
  toDate?: string;
  toSubmittedDate?: string;
  types?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsSearchKeyFn({ credit, dateFormat, debit, fromAmount, fromDate, fromSubmittedDate, limit, locale, offset, orderBy, savingsId, sortOrder, toAmount, toDate, toSubmittedDate, types }, queryKey), queryFn: () => SavingsAccountTransactionsService.getV1SavingsaccountsBySavingsIdTransactionsSearch({ credit, dateFormat, debit, fromAmount, fromDate, fromSubmittedDate, limit, locale, offset, orderBy, savingsId, sortOrder, toAmount, toDate, toSubmittedDate, types }) as TData, ...options });
export const useSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsTemplateSuspense = <TData = Common.SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ savingsId }: {
  savingsId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsTemplateKeyFn({ savingsId }, queryKey), queryFn: () => SavingsAccountTransactionsService.getV1SavingsaccountsBySavingsIdTransactionsTemplate({ savingsId }) as TData, ...options });
export const useSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsByTransactionIdSuspense = <TData = Common.SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ savingsId, transactionId }: {
  savingsId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsByTransactionIdKeyFn({ savingsId, transactionId }, queryKey), queryFn: () => SavingsAccountTransactionsService.getV1SavingsaccountsBySavingsIdTransactionsByTransactionId({ savingsId, transactionId }) as TData, ...options });
export const useSavingsProductServiceGetV1SavingsproductsSuspense = <TData = Common.SavingsProductServiceGetV1SavingsproductsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSavingsProductServiceGetV1SavingsproductsKeyFn(queryKey), queryFn: () => SavingsProductService.getV1Savingsproducts() as TData, ...options });
export const useSavingsProductServiceGetV1SavingsproductsTemplateSuspense = <TData = Common.SavingsProductServiceGetV1SavingsproductsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSavingsProductServiceGetV1SavingsproductsTemplateKeyFn(queryKey), queryFn: () => SavingsProductService.getV1SavingsproductsTemplate() as TData, ...options });
export const useSavingsProductServiceGetV1SavingsproductsByProductIdSuspense = <TData = Common.SavingsProductServiceGetV1SavingsproductsByProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ productId }: {
  productId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSavingsProductServiceGetV1SavingsproductsByProductIdKeyFn({ productId }, queryKey), queryFn: () => SavingsProductService.getV1SavingsproductsByProductId({ productId }) as TData, ...options });
export const useSchedulerServiceGetV1SchedulerSuspense = <TData = Common.SchedulerServiceGetV1SchedulerDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSchedulerServiceGetV1SchedulerKeyFn(queryKey), queryFn: () => SchedulerService.getV1Scheduler() as TData, ...options });
export const useSearchApiServiceGetV1SearchSuspense = <TData = Common.SearchApiServiceGetV1SearchDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ exactMatch, query, resource }: {
  exactMatch?: boolean;
  query?: string;
  resource?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSearchApiServiceGetV1SearchKeyFn({ exactMatch, query, resource }, queryKey), queryFn: () => SearchApiService.getV1Search({ exactMatch, query, resource }) as TData, ...options });
export const useSearchApiServiceGetV1SearchTemplateSuspense = <TData = Common.SearchApiServiceGetV1SearchTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSearchApiServiceGetV1SearchTemplateKeyFn(queryKey), queryFn: () => SearchApiService.getV1SearchTemplate() as TData, ...options });
export const useSelfAccountTransferServiceGetV1SelfAccounttransfersTemplateSuspense = <TData = Common.SelfAccountTransferServiceGetV1SelfAccounttransfersTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ type }: {
  type?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfAccountTransferServiceGetV1SelfAccounttransfersTemplateKeyFn({ type }, queryKey), queryFn: () => SelfAccountTransferService.getV1SelfAccounttransfersTemplate({ type }) as TData, ...options });
export const useSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptSuspense = <TData = Common.SelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptKeyFn(queryKey), queryFn: () => SelfThirdPartyTransferService.getV1SelfBeneficiariesTpt() as TData, ...options });
export const useSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptTemplateSuspense = <TData = Common.SelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptTemplateKeyFn(queryKey), queryFn: () => SelfThirdPartyTransferService.getV1SelfBeneficiariesTptTemplate() as TData, ...options });
export const useSelfClientServiceGetV1SelfClientsSuspense = <TData = Common.SelfClientServiceGetV1SelfClientsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ displayName, firstName, lastName, legalForm, limit, offset, orderBy, sortOrder, status }: {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  legalForm?: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  status?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsKeyFn({ displayName, firstName, lastName, legalForm, limit, offset, orderBy, sortOrder, status }, queryKey), queryFn: () => SelfClientService.getV1SelfClients({ displayName, firstName, lastName, legalForm, limit, offset, orderBy, sortOrder, status }) as TData, ...options });
export const useSelfClientServiceGetV1SelfClientsByClientIdSuspense = <TData = Common.SelfClientServiceGetV1SelfClientsByClientIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdKeyFn({ clientId }, queryKey), queryFn: () => SelfClientService.getV1SelfClientsByClientId({ clientId }) as TData, ...options });
export const useSelfClientServiceGetV1SelfClientsByClientIdAccountsSuspense = <TData = Common.SelfClientServiceGetV1SelfClientsByClientIdAccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdAccountsKeyFn({ clientId }, queryKey), queryFn: () => SelfClientService.getV1SelfClientsByClientIdAccounts({ clientId }) as TData, ...options });
export const useSelfClientServiceGetV1SelfClientsByClientIdChargesSuspense = <TData = Common.SelfClientServiceGetV1SelfClientsByClientIdChargesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chargeStatus, clientId, limit, offset, pendingPayment }: {
  chargeStatus?: string;
  clientId: number;
  limit?: number;
  offset?: number;
  pendingPayment?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdChargesKeyFn({ chargeStatus, clientId, limit, offset, pendingPayment }, queryKey), queryFn: () => SelfClientService.getV1SelfClientsByClientIdCharges({ chargeStatus, clientId, limit, offset, pendingPayment }) as TData, ...options });
export const useSelfClientServiceGetV1SelfClientsByClientIdChargesByChargeIdSuspense = <TData = Common.SelfClientServiceGetV1SelfClientsByClientIdChargesByChargeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chargeId, clientId }: {
  chargeId: number;
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdChargesByChargeIdKeyFn({ chargeId, clientId }, queryKey), queryFn: () => SelfClientService.getV1SelfClientsByClientIdChargesByChargeId({ chargeId, clientId }) as TData, ...options });
export const useSelfClientServiceGetV1SelfClientsByClientIdImagesSuspense = <TData = Common.SelfClientServiceGetV1SelfClientsByClientIdImagesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, maxHeight, maxWidth, output }: {
  clientId: number;
  maxHeight?: number;
  maxWidth?: number;
  output?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdImagesKeyFn({ clientId, maxHeight, maxWidth, output }, queryKey), queryFn: () => SelfClientService.getV1SelfClientsByClientIdImages({ clientId, maxHeight, maxWidth, output }) as TData, ...options });
export const useSelfClientServiceGetV1SelfClientsByClientIdObligeedetailsSuspense = <TData = Common.SelfClientServiceGetV1SelfClientsByClientIdObligeedetailsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdObligeedetailsKeyFn({ clientId }, queryKey), queryFn: () => SelfClientService.getV1SelfClientsByClientIdObligeedetails({ clientId }) as TData, ...options });
export const useSelfClientServiceGetV1SelfClientsByClientIdTransactionsSuspense = <TData = Common.SelfClientServiceGetV1SelfClientsByClientIdTransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, limit, offset }: {
  clientId: number;
  limit?: number;
  offset?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdTransactionsKeyFn({ clientId, limit, offset }, queryKey), queryFn: () => SelfClientService.getV1SelfClientsByClientIdTransactions({ clientId, limit, offset }) as TData, ...options });
export const useSelfClientServiceGetV1SelfClientsByClientIdTransactionsByTransactionIdSuspense = <TData = Common.SelfClientServiceGetV1SelfClientsByClientIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, transactionId }: {
  clientId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdTransactionsByTransactionIdKeyFn({ clientId, transactionId }, queryKey), queryFn: () => SelfClientService.getV1SelfClientsByClientIdTransactionsByTransactionId({ clientId, transactionId }) as TData, ...options });
export const useDeviceRegistrationServiceGetV1SelfDeviceRegistrationSuspense = <TData = Common.DeviceRegistrationServiceGetV1SelfDeviceRegistrationDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDeviceRegistrationServiceGetV1SelfDeviceRegistrationKeyFn(queryKey), queryFn: () => DeviceRegistrationService.getV1SelfDeviceRegistration() as TData, ...options });
export const useDeviceRegistrationServiceGetV1SelfDeviceRegistrationClientByClientIdSuspense = <TData = Common.DeviceRegistrationServiceGetV1SelfDeviceRegistrationClientByClientIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDeviceRegistrationServiceGetV1SelfDeviceRegistrationClientByClientIdKeyFn({ clientId }, queryKey), queryFn: () => DeviceRegistrationService.getV1SelfDeviceRegistrationClientByClientId({ clientId }) as TData, ...options });
export const useDeviceRegistrationServiceGetV1SelfDeviceRegistrationByIdSuspense = <TData = Common.DeviceRegistrationServiceGetV1SelfDeviceRegistrationByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDeviceRegistrationServiceGetV1SelfDeviceRegistrationByIdKeyFn({ id }, queryKey), queryFn: () => DeviceRegistrationService.getV1SelfDeviceRegistrationById({ id }) as TData, ...options });
export const useSelfLoanProductsServiceGetV1SelfLoanproductsSuspense = <TData = Common.SelfLoanProductsServiceGetV1SelfLoanproductsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfLoanProductsServiceGetV1SelfLoanproductsKeyFn({ clientId }, queryKey), queryFn: () => SelfLoanProductsService.getV1SelfLoanproducts({ clientId }) as TData, ...options });
export const useSelfLoanProductsServiceGetV1SelfLoanproductsByProductIdSuspense = <TData = Common.SelfLoanProductsServiceGetV1SelfLoanproductsByProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, productId }: {
  clientId?: number;
  productId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfLoanProductsServiceGetV1SelfLoanproductsByProductIdKeyFn({ clientId, productId }, queryKey), queryFn: () => SelfLoanProductsService.getV1SelfLoanproductsByProductId({ clientId, productId }) as TData, ...options });
export const useSelfLoansServiceGetV1SelfLoansTemplateSuspense = <TData = Common.SelfLoansServiceGetV1SelfLoansTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, productId, templateType }: {
  clientId?: number;
  productId?: number;
  templateType?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansTemplateKeyFn({ clientId, productId, templateType }, queryKey), queryFn: () => SelfLoansService.getV1SelfLoansTemplate({ clientId, productId, templateType }) as TData, ...options });
export const useSelfLoansServiceGetV1SelfLoansByLoanIdSuspense = <TData = Common.SelfLoansServiceGetV1SelfLoansByLoanIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdKeyFn({ loanId }, queryKey), queryFn: () => SelfLoansService.getV1SelfLoansByLoanId({ loanId }) as TData, ...options });
export const useSelfLoansServiceGetV1SelfLoansByLoanIdChargesSuspense = <TData = Common.SelfLoansServiceGetV1SelfLoansByLoanIdChargesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdChargesKeyFn({ loanId }, queryKey), queryFn: () => SelfLoansService.getV1SelfLoansByLoanIdCharges({ loanId }) as TData, ...options });
export const useSelfLoansServiceGetV1SelfLoansByLoanIdChargesByChargeIdSuspense = <TData = Common.SelfLoansServiceGetV1SelfLoansByLoanIdChargesByChargeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chargeId, loanId }: {
  chargeId: number;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdChargesByChargeIdKeyFn({ chargeId, loanId }, queryKey), queryFn: () => SelfLoansService.getV1SelfLoansByLoanIdChargesByChargeId({ chargeId, loanId }) as TData, ...options });
export const useSelfLoansServiceGetV1SelfLoansByLoanIdGuarantorsSuspense = <TData = Common.SelfLoansServiceGetV1SelfLoansByLoanIdGuarantorsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdGuarantorsKeyFn({ loanId }, queryKey), queryFn: () => SelfLoansService.getV1SelfLoansByLoanIdGuarantors({ loanId }) as TData, ...options });
export const useSelfLoansServiceGetV1SelfLoansByLoanIdTransactionsByTransactionIdSuspense = <TData = Common.SelfLoansServiceGetV1SelfLoansByLoanIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fields, loanId, transactionId }: {
  fields?: string;
  loanId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdTransactionsByTransactionIdKeyFn({ fields, loanId, transactionId }, queryKey), queryFn: () => SelfLoansService.getV1SelfLoansByLoanIdTransactionsByTransactionId({ fields, loanId, transactionId }) as TData, ...options });
export const usePocketServiceGetV1SelfPocketsSuspense = <TData = Common.PocketServiceGetV1SelfPocketsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UsePocketServiceGetV1SelfPocketsKeyFn(queryKey), queryFn: () => PocketService.getV1SelfPockets() as TData, ...options });
export const useSelfShareProductsServiceGetV1SelfProductsShareSuspense = <TData = Common.SelfShareProductsServiceGetV1SelfProductsShareDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, limit, offset }: {
  clientId?: number;
  limit?: number;
  offset?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfShareProductsServiceGetV1SelfProductsShareKeyFn({ clientId, limit, offset }, queryKey), queryFn: () => SelfShareProductsService.getV1SelfProductsShare({ clientId, limit, offset }) as TData, ...options });
export const useSelfShareProductsServiceGetV1SelfProductsShareByProductIdSuspense = <TData = Common.SelfShareProductsServiceGetV1SelfProductsShareByProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, productId, type }: {
  clientId?: number;
  productId: number;
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfShareProductsServiceGetV1SelfProductsShareByProductIdKeyFn({ clientId, productId, type }, queryKey), queryFn: () => SelfShareProductsService.getV1SelfProductsShareByProductId({ clientId, productId, type }) as TData, ...options });
export const useSelfRunReportServiceGetV1SelfRunreportsByReportNameSuspense = <TData = Common.SelfRunReportServiceGetV1SelfRunreportsByReportNameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ reportName }: {
  reportName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfRunReportServiceGetV1SelfRunreportsByReportNameKeyFn({ reportName }, queryKey), queryFn: () => SelfRunReportService.getV1SelfRunreportsByReportName({ reportName }) as TData, ...options });
export const useSelfSavingsAccountServiceGetV1SelfSavingsaccountsTemplateSuspense = <TData = Common.SelfSavingsAccountServiceGetV1SelfSavingsaccountsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, productId }: {
  clientId?: number;
  productId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsTemplateKeyFn({ clientId, productId }, queryKey), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsTemplate({ clientId, productId }) as TData, ...options });
export const useSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdSuspense = <TData = Common.SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, associations, chargeStatus }: {
  accountId: number;
  associations?: string;
  chargeStatus?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdKeyFn({ accountId, associations, chargeStatus }, queryKey), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountId({ accountId, associations, chargeStatus }) as TData, ...options });
export const useSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesSuspense = <TData = Common.SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, chargeStatus }: {
  accountId: number;
  chargeStatus?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesKeyFn({ accountId, chargeStatus }, queryKey), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountIdCharges({ accountId, chargeStatus }) as TData, ...options });
export const useSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeIdSuspense = <TData = Common.SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, savingsAccountChargeId }: {
  accountId: number;
  savingsAccountChargeId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeIdKeyFn({ accountId, savingsAccountChargeId }, queryKey), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeId({ accountId, savingsAccountChargeId }) as TData, ...options });
export const useSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdTransactionsByTransactionIdSuspense = <TData = Common.SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, transactionId }: {
  accountId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdTransactionsByTransactionIdKeyFn({ accountId, transactionId }, queryKey), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountIdTransactionsByTransactionId({ accountId, transactionId }) as TData, ...options });
export const useSelfSavingsProductsServiceGetV1SelfSavingsproductsSuspense = <TData = Common.SelfSavingsProductsServiceGetV1SelfSavingsproductsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfSavingsProductsServiceGetV1SelfSavingsproductsKeyFn({ clientId }, queryKey), queryFn: () => SelfSavingsProductsService.getV1SelfSavingsproducts({ clientId }) as TData, ...options });
export const useSelfSavingsProductsServiceGetV1SelfSavingsproductsByProductIdSuspense = <TData = Common.SelfSavingsProductsServiceGetV1SelfSavingsproductsByProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, productId }: {
  clientId?: number;
  productId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfSavingsProductsServiceGetV1SelfSavingsproductsByProductIdKeyFn({ clientId, productId }, queryKey), queryFn: () => SelfSavingsProductsService.getV1SelfSavingsproductsByProductId({ clientId, productId }) as TData, ...options });
export const useSelfShareAccountsServiceGetV1SelfShareaccountsTemplateSuspense = <TData = Common.SelfShareAccountsServiceGetV1SelfShareaccountsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, productId }: {
  clientId?: number;
  productId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfShareAccountsServiceGetV1SelfShareaccountsTemplateKeyFn({ clientId, productId }, queryKey), queryFn: () => SelfShareAccountsService.getV1SelfShareaccountsTemplate({ clientId, productId }) as TData, ...options });
export const useSelfShareAccountsServiceGetV1SelfShareaccountsByAccountIdSuspense = <TData = Common.SelfShareAccountsServiceGetV1SelfShareaccountsByAccountIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId }: {
  accountId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfShareAccountsServiceGetV1SelfShareaccountsByAccountIdKeyFn({ accountId }, queryKey), queryFn: () => SelfShareAccountsService.getV1SelfShareaccountsByAccountId({ accountId }) as TData, ...options });
export const useSelfSpmServiceGetV1SelfSurveysSuspense = <TData = Common.SelfSpmServiceGetV1SelfSurveysDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfSpmServiceGetV1SelfSurveysKeyFn(queryKey), queryFn: () => SelfSpmService.getV1SelfSurveys() as TData, ...options });
export const useSelfScoreCardServiceGetV1SelfSurveysScorecardsClientsByClientIdSuspense = <TData = Common.SelfScoreCardServiceGetV1SelfSurveysScorecardsClientsByClientIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfScoreCardServiceGetV1SelfSurveysScorecardsClientsByClientIdKeyFn({ clientId }, queryKey), queryFn: () => SelfScoreCardService.getV1SelfSurveysScorecardsClientsByClientId({ clientId }) as TData, ...options });
export const useSelfUserDetailsServiceGetV1SelfUserdetailsSuspense = <TData = Common.SelfUserDetailsServiceGetV1SelfUserdetailsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfUserDetailsServiceGetV1SelfUserdetailsKeyFn(queryKey), queryFn: () => SelfUserDetailsService.getV1SelfUserdetails() as TData, ...options });
export const useSelfDividendServiceGetV1ShareproductByProductIdDividendSuspense = <TData = Common.SelfDividendServiceGetV1ShareproductByProductIdDividendDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, productId, sortOrder, status }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  productId: number;
  sortOrder?: string;
  status?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfDividendServiceGetV1ShareproductByProductIdDividendKeyFn({ limit, offset, orderBy, productId, sortOrder, status }, queryKey), queryFn: () => SelfDividendService.getV1ShareproductByProductIdDividend({ limit, offset, orderBy, productId, sortOrder, status }) as TData, ...options });
export const useSelfDividendServiceGetV1ShareproductByProductIdDividendByDividendIdSuspense = <TData = Common.SelfDividendServiceGetV1ShareproductByProductIdDividendByDividendIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountNo, dividendId, limit, offset, orderBy, productId, sortOrder }: {
  accountNo?: string;
  dividendId: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  productId: number;
  sortOrder?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSelfDividendServiceGetV1ShareproductByProductIdDividendByDividendIdKeyFn({ accountNo, dividendId, limit, offset, orderBy, productId, sortOrder }, queryKey), queryFn: () => SelfDividendService.getV1ShareproductByProductIdDividendByDividendId({ accountNo, dividendId, limit, offset, orderBy, productId, sortOrder }) as TData, ...options });
export const useSmsServiceGetV1SmsSuspense = <TData = Common.SmsServiceGetV1SmsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSmsServiceGetV1SmsKeyFn(queryKey), queryFn: () => SmsService.getV1Sms() as TData, ...options });
export const useSmsServiceGetV1SmsByCampaignIdMessageByStatusSuspense = <TData = Common.SmsServiceGetV1SmsByCampaignIdMessageByStatusDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ campaignId, dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }: {
  campaignId: number;
  dateFormat?: string;
  fromDate?: DateParam;
  limit?: number;
  locale?: string;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  status?: number;
  toDate?: DateParam;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSmsServiceGetV1SmsByCampaignIdMessageByStatusKeyFn({ campaignId, dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }, queryKey), queryFn: () => SmsService.getV1SmsByCampaignIdMessageByStatus({ campaignId, dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }) as TData, ...options });
export const useSmsServiceGetV1SmsByResourceIdSuspense = <TData = Common.SmsServiceGetV1SmsByResourceIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSmsServiceGetV1SmsByResourceIdKeyFn({ resourceId }, queryKey), queryFn: () => SmsService.getV1SmsByResourceId({ resourceId }) as TData, ...options });
export const useStaffServiceGetV1StaffSuspense = <TData = Common.StaffServiceGetV1StaffDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanOfficersOnly, officeId, staffInOfficeHierarchy, status }: {
  loanOfficersOnly?: boolean;
  officeId?: number;
  staffInOfficeHierarchy?: boolean;
  status?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseStaffServiceGetV1StaffKeyFn({ loanOfficersOnly, officeId, staffInOfficeHierarchy, status }, queryKey), queryFn: () => StaffService.getV1Staff({ loanOfficersOnly, officeId, staffInOfficeHierarchy, status }) as TData, ...options });
export const useStaffServiceGetV1StaffDownloadtemplateSuspense = <TData = Common.StaffServiceGetV1StaffDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseStaffServiceGetV1StaffDownloadtemplateKeyFn({ dateFormat, officeId }, queryKey), queryFn: () => StaffService.getV1StaffDownloadtemplate({ dateFormat, officeId }) as TData, ...options });
export const useStaffServiceGetV1StaffByStaffIdSuspense = <TData = Common.StaffServiceGetV1StaffByStaffIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ staffId }: {
  staffId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseStaffServiceGetV1StaffByStaffIdKeyFn({ staffId }, queryKey), queryFn: () => StaffService.getV1StaffByStaffId({ staffId }) as TData, ...options });
export const useStandingInstructionsHistoryServiceGetV1StandinginstructionrunhistorySuspense = <TData = Common.StandingInstructionsHistoryServiceGetV1StandinginstructionrunhistoryDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, clientName, dateFormat, externalId, fromAccountId, fromAccountType, fromDate, limit, locale, offset, orderBy, sortOrder, toDate, transferType }: {
  clientId?: number;
  clientName?: string;
  dateFormat?: string;
  externalId?: string;
  fromAccountId?: number;
  fromAccountType?: number;
  fromDate?: DateParam;
  limit?: number;
  locale?: string;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  toDate?: DateParam;
  transferType?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseStandingInstructionsHistoryServiceGetV1StandinginstructionrunhistoryKeyFn({ clientId, clientName, dateFormat, externalId, fromAccountId, fromAccountType, fromDate, limit, locale, offset, orderBy, sortOrder, toDate, transferType }, queryKey), queryFn: () => StandingInstructionsHistoryService.getV1Standinginstructionrunhistory({ clientId, clientName, dateFormat, externalId, fromAccountId, fromAccountType, fromDate, limit, locale, offset, orderBy, sortOrder, toDate, transferType }) as TData, ...options });
export const useStandingInstructionsServiceGetV1StandinginstructionsSuspense = <TData = Common.StandingInstructionsServiceGetV1StandinginstructionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, clientName, externalId, fromAccountId, fromAccountType, limit, offset, orderBy, sortOrder, transferType }: {
  clientId?: number;
  clientName?: string;
  externalId?: string;
  fromAccountId?: number;
  fromAccountType?: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  transferType?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseStandingInstructionsServiceGetV1StandinginstructionsKeyFn({ clientId, clientName, externalId, fromAccountId, fromAccountType, limit, offset, orderBy, sortOrder, transferType }, queryKey), queryFn: () => StandingInstructionsService.getV1Standinginstructions({ clientId, clientName, externalId, fromAccountId, fromAccountType, limit, offset, orderBy, sortOrder, transferType }) as TData, ...options });
export const useStandingInstructionsServiceGetV1StandinginstructionsTemplateSuspense = <TData = Common.StandingInstructionsServiceGetV1StandinginstructionsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId, transferType }: {
  fromAccountId?: number;
  fromAccountType?: number;
  fromClientId?: number;
  fromOfficeId?: number;
  toAccountId?: number;
  toAccountType?: number;
  toClientId?: number;
  toOfficeId?: number;
  transferType?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseStandingInstructionsServiceGetV1StandinginstructionsTemplateKeyFn({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId, transferType }, queryKey), queryFn: () => StandingInstructionsService.getV1StandinginstructionsTemplate({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId, transferType }) as TData, ...options });
export const useStandingInstructionsServiceGetV1StandinginstructionsByStandingInstructionIdSuspense = <TData = Common.StandingInstructionsServiceGetV1StandinginstructionsByStandingInstructionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalId, limit, offset, orderBy, sortOrder, standingInstructionId }: {
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  standingInstructionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseStandingInstructionsServiceGetV1StandinginstructionsByStandingInstructionIdKeyFn({ externalId, limit, offset, orderBy, sortOrder, standingInstructionId }, queryKey), queryFn: () => StandingInstructionsService.getV1StandinginstructionsByStandingInstructionId({ externalId, limit, offset, orderBy, sortOrder, standingInstructionId }) as TData, ...options });
export const useSurveyServiceGetV1SurveySuspense = <TData = Common.SurveyServiceGetV1SurveyDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSurveyServiceGetV1SurveyKeyFn(queryKey), queryFn: () => SurveyService.getV1Survey() as TData, ...options });
export const useSurveyServiceGetV1SurveyBySurveyNameSuspense = <TData = Common.SurveyServiceGetV1SurveyBySurveyNameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ surveyName }: {
  surveyName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSurveyServiceGetV1SurveyBySurveyNameKeyFn({ surveyName }, queryKey), queryFn: () => SurveyService.getV1SurveyBySurveyName({ surveyName }) as TData, ...options });
export const useSurveyServiceGetV1SurveyBySurveyNameByClientIdSuspense = <TData = Common.SurveyServiceGetV1SurveyBySurveyNameByClientIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, surveyName }: {
  clientId: number;
  surveyName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSurveyServiceGetV1SurveyBySurveyNameByClientIdKeyFn({ clientId, surveyName }, queryKey), queryFn: () => SurveyService.getV1SurveyBySurveyNameByClientId({ clientId, surveyName }) as TData, ...options });
export const useSurveyServiceGetV1SurveyBySurveyNameByClientIdByEntryIdSuspense = <TData = Common.SurveyServiceGetV1SurveyBySurveyNameByClientIdByEntryIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, entryId, surveyName }: {
  clientId: number;
  entryId: number;
  surveyName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSurveyServiceGetV1SurveyBySurveyNameByClientIdByEntryIdKeyFn({ clientId, entryId, surveyName }, queryKey), queryFn: () => SurveyService.getV1SurveyBySurveyNameByClientIdByEntryId({ clientId, entryId, surveyName }) as TData, ...options });
export const useSpmSurveysServiceGetV1SurveysSuspense = <TData = Common.SpmSurveysServiceGetV1SurveysDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ isActive }: {
  isActive?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSpmSurveysServiceGetV1SurveysKeyFn({ isActive }, queryKey), queryFn: () => SpmSurveysService.getV1Surveys({ isActive }) as TData, ...options });
export const useSpmSurveysServiceGetV1SurveysByIdSuspense = <TData = Common.SpmSurveysServiceGetV1SurveysByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSpmSurveysServiceGetV1SurveysByIdKeyFn({ id }, queryKey), queryFn: () => SpmSurveysService.getV1SurveysById({ id }) as TData, ...options });
export const useScoreCardServiceGetV1SurveysScorecardsClientsByClientIdSuspense = <TData = Common.ScoreCardServiceGetV1SurveysScorecardsClientsByClientIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseScoreCardServiceGetV1SurveysScorecardsClientsByClientIdKeyFn({ clientId }, queryKey), queryFn: () => ScoreCardService.getV1SurveysScorecardsClientsByClientId({ clientId }) as TData, ...options });
export const useScoreCardServiceGetV1SurveysScorecardsBySurveyIdSuspense = <TData = Common.ScoreCardServiceGetV1SurveysScorecardsBySurveyIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ surveyId }: {
  surveyId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseScoreCardServiceGetV1SurveysScorecardsBySurveyIdKeyFn({ surveyId }, queryKey), queryFn: () => ScoreCardService.getV1SurveysScorecardsBySurveyId({ surveyId }) as TData, ...options });
export const useScoreCardServiceGetV1SurveysScorecardsBySurveyIdClientsByClientIdSuspense = <TData = Common.ScoreCardServiceGetV1SurveysScorecardsBySurveyIdClientsByClientIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, surveyId }: {
  clientId: number;
  surveyId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseScoreCardServiceGetV1SurveysScorecardsBySurveyIdClientsByClientIdKeyFn({ clientId, surveyId }, queryKey), queryFn: () => ScoreCardService.getV1SurveysScorecardsBySurveyIdClientsByClientId({ clientId, surveyId }) as TData, ...options });
export const useSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesSuspense = <TData = Common.SpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ surveyId }: {
  surveyId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesKeyFn({ surveyId }, queryKey), queryFn: () => SpmApiLookUpTableService.getV1SurveysBySurveyIdLookuptables({ surveyId }) as TData, ...options });
export const useSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesByKeySuspense = <TData = Common.SpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesByKeyDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ key, surveyId }: {
  key: string;
  surveyId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesByKeyKeyFn({ key, surveyId }, queryKey), queryFn: () => SpmApiLookUpTableService.getV1SurveysBySurveyIdLookuptablesByKey({ key, surveyId }) as TData, ...options });
export const useTaxComponentsServiceGetV1TaxesComponentSuspense = <TData = Common.TaxComponentsServiceGetV1TaxesComponentDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTaxComponentsServiceGetV1TaxesComponentKeyFn(queryKey), queryFn: () => TaxComponentsService.getV1TaxesComponent() as TData, ...options });
export const useTaxComponentsServiceGetV1TaxesComponentTemplateSuspense = <TData = Common.TaxComponentsServiceGetV1TaxesComponentTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTaxComponentsServiceGetV1TaxesComponentTemplateKeyFn(queryKey), queryFn: () => TaxComponentsService.getV1TaxesComponentTemplate() as TData, ...options });
export const useTaxComponentsServiceGetV1TaxesComponentByTaxComponentIdSuspense = <TData = Common.TaxComponentsServiceGetV1TaxesComponentByTaxComponentIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ taxComponentId }: {
  taxComponentId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTaxComponentsServiceGetV1TaxesComponentByTaxComponentIdKeyFn({ taxComponentId }, queryKey), queryFn: () => TaxComponentsService.getV1TaxesComponentByTaxComponentId({ taxComponentId }) as TData, ...options });
export const useTaxGroupServiceGetV1TaxesGroupSuspense = <TData = Common.TaxGroupServiceGetV1TaxesGroupDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTaxGroupServiceGetV1TaxesGroupKeyFn(queryKey), queryFn: () => TaxGroupService.getV1TaxesGroup() as TData, ...options });
export const useTaxGroupServiceGetV1TaxesGroupTemplateSuspense = <TData = Common.TaxGroupServiceGetV1TaxesGroupTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTaxGroupServiceGetV1TaxesGroupTemplateKeyFn(queryKey), queryFn: () => TaxGroupService.getV1TaxesGroupTemplate() as TData, ...options });
export const useTaxGroupServiceGetV1TaxesGroupByTaxGroupIdSuspense = <TData = Common.TaxGroupServiceGetV1TaxesGroupByTaxGroupIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ taxGroupId }: {
  taxGroupId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTaxGroupServiceGetV1TaxesGroupByTaxGroupIdKeyFn({ taxGroupId }, queryKey), queryFn: () => TaxGroupService.getV1TaxesGroupByTaxGroupId({ taxGroupId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersSuspense = <TData = Common.TellerCashManagementServiceGetV1TellersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ officeId }: {
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersKeyFn({ officeId }, queryKey), queryFn: () => TellerCashManagementService.getV1Tellers({ officeId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdSuspense = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ tellerId }: {
  tellerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdKeyFn({ tellerId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerId({ tellerId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiersSuspense = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdCashiersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fromdate, tellerId, todate }: {
  fromdate?: string;
  tellerId: number;
  todate?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersKeyFn({ fromdate, tellerId, todate }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiers({ fromdate, tellerId, todate }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplateSuspense = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ tellerId }: {
  tellerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplateKeyFn({ tellerId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersTemplate({ tellerId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSuspense = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ cashierId, tellerId }: {
  cashierId: number;
  tellerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdKeyFn({ cashierId, tellerId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierId({ cashierId, tellerId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactionsSuspense = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }: {
  cashierId: number;
  currencyCode?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  tellerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactionsKeyFn({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdSummaryandtransactions({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsSuspense = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }: {
  cashierId: number;
  currencyCode?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  tellerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsKeyFn({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdTransactions({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplateSuspense = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ cashierId, tellerId }: {
  cashierId: number;
  tellerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplateKeyFn({ cashierId, tellerId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdTransactionsTemplate({ cashierId, tellerId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdJournalsSuspense = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdJournalsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ cashierId, dateRange, tellerId }: {
  cashierId?: number;
  dateRange?: string;
  tellerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdJournalsKeyFn({ cashierId, dateRange, tellerId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdJournals({ cashierId, dateRange, tellerId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdTransactionsSuspense = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdTransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateRange, tellerId }: {
  dateRange?: string;
  tellerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdTransactionsKeyFn({ dateRange, tellerId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdTransactions({ dateRange, tellerId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdTransactionsByTransactionIdSuspense = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ tellerId, transactionId }: {
  tellerId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdTransactionsByTransactionIdKeyFn({ tellerId, transactionId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdTransactionsByTransactionId({ tellerId, transactionId }) as TData, ...options });
export const useUserGeneratedDocumentsServiceGetV1TemplatesSuspense = <TData = Common.UserGeneratedDocumentsServiceGetV1TemplatesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entityId, typeId }: {
  entityId?: number;
  typeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUserGeneratedDocumentsServiceGetV1TemplatesKeyFn({ entityId, typeId }, queryKey), queryFn: () => UserGeneratedDocumentsService.getV1Templates({ entityId, typeId }) as TData, ...options });
export const useUserGeneratedDocumentsServiceGetV1TemplatesTemplateSuspense = <TData = Common.UserGeneratedDocumentsServiceGetV1TemplatesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUserGeneratedDocumentsServiceGetV1TemplatesTemplateKeyFn(queryKey), queryFn: () => UserGeneratedDocumentsService.getV1TemplatesTemplate() as TData, ...options });
export const useUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdSuspense = <TData = Common.UserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ templateId }: {
  templateId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdKeyFn({ templateId }, queryKey), queryFn: () => UserGeneratedDocumentsService.getV1TemplatesByTemplateId({ templateId }) as TData, ...options });
export const useUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdTemplateSuspense = <TData = Common.UserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ templateId }: {
  templateId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdTemplateKeyFn({ templateId }, queryKey), queryFn: () => UserGeneratedDocumentsService.getV1TemplatesByTemplateIdTemplate({ templateId }) as TData, ...options });
export const useTwoFactorServiceGetV1TwofactorSuspense = <TData = Common.TwoFactorServiceGetV1TwofactorDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseTwoFactorServiceGetV1TwofactorKeyFn(queryKey), queryFn: () => TwoFactorService.getV1Twofactor() as TData, ...options });
export const useFetchAuthenticatedUserDetailsServiceGetV1UserdetailsSuspense = <TData = Common.FetchAuthenticatedUserDetailsServiceGetV1UserdetailsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseFetchAuthenticatedUserDetailsServiceGetV1UserdetailsKeyFn(queryKey), queryFn: () => FetchAuthenticatedUserDetailsService.getV1Userdetails() as TData, ...options });
export const useUsersServiceGetV1UsersSuspense = <TData = Common.UsersServiceGetV1UsersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetV1UsersKeyFn(queryKey), queryFn: () => UsersService.getV1Users() as TData, ...options });
export const useUsersServiceGetV1UsersDownloadtemplateSuspense = <TData = Common.UsersServiceGetV1UsersDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetV1UsersDownloadtemplateKeyFn({ dateFormat, officeId, staffId }, queryKey), queryFn: () => UsersService.getV1UsersDownloadtemplate({ dateFormat, officeId, staffId }) as TData, ...options });
export const useUsersServiceGetV1UsersTemplateSuspense = <TData = Common.UsersServiceGetV1UsersTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetV1UsersTemplateKeyFn(queryKey), queryFn: () => UsersService.getV1UsersTemplate() as TData, ...options });
export const useUsersServiceGetV1UsersByUserIdSuspense = <TData = Common.UsersServiceGetV1UsersByUserIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ userId }: {
  userId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetV1UsersByUserIdKeyFn({ userId }, queryKey), queryFn: () => UsersService.getV1UsersByUserId({ userId }) as TData, ...options });
export const useWorkingDaysServiceGetV1WorkingdaysSuspense = <TData = Common.WorkingDaysServiceGetV1WorkingdaysDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseWorkingDaysServiceGetV1WorkingdaysKeyFn(queryKey), queryFn: () => WorkingDaysService.getV1Workingdays() as TData, ...options });
export const useWorkingDaysServiceGetV1WorkingdaysTemplateSuspense = <TData = Common.WorkingDaysServiceGetV1WorkingdaysTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseWorkingDaysServiceGetV1WorkingdaysTemplateKeyFn(queryKey), queryFn: () => WorkingDaysService.getV1WorkingdaysTemplate() as TData, ...options });
export const useCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsSuspense = <TData = Common.CalendarServiceGetV1ByEntityTypeByEntityIdCalendarsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ calendarType, entityId, entityType }: {
  calendarType?: string;
  entityId: number;
  entityType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsKeyFn({ calendarType, entityId, entityType }, queryKey), queryFn: () => CalendarService.getV1ByEntityTypeByEntityIdCalendars({ calendarType, entityId, entityType }) as TData, ...options });
export const useCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsTemplateSuspense = <TData = Common.CalendarServiceGetV1ByEntityTypeByEntityIdCalendarsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entityId, entityType }: {
  entityId: number;
  entityType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsTemplateKeyFn({ entityId, entityType }, queryKey), queryFn: () => CalendarService.getV1ByEntityTypeByEntityIdCalendarsTemplate({ entityId, entityType }) as TData, ...options });
export const useCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsByCalendarIdSuspense = <TData = Common.CalendarServiceGetV1ByEntityTypeByEntityIdCalendarsByCalendarIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ calendarId, entityId, entityType }: {
  calendarId: number;
  entityId: number;
  entityType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsByCalendarIdKeyFn({ calendarId, entityId, entityType }, queryKey), queryFn: () => CalendarService.getV1ByEntityTypeByEntityIdCalendarsByCalendarId({ calendarId, entityId, entityType }) as TData, ...options });
export const useDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsSuspense = <TData = Common.DocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entityId, entityType }: {
  entityId: number;
  entityType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsKeyFn({ entityId, entityType }, queryKey), queryFn: () => DocumentsService.getV1ByEntityTypeByEntityIdDocuments({ entityId, entityType }) as TData, ...options });
export const useDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdSuspense = <TData = Common.DocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ documentId, entityId, entityType }: {
  documentId: number;
  entityId: number;
  entityType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdKeyFn({ documentId, entityId, entityType }, queryKey), queryFn: () => DocumentsService.getV1ByEntityTypeByEntityIdDocumentsByDocumentId({ documentId, entityId, entityType }) as TData, ...options });
export const useDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachmentSuspense = <TData = Common.DocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachmentDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ documentId, entityId, entityType }: {
  documentId: number;
  entityId: number;
  entityType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachmentKeyFn({ documentId, entityId, entityType }, queryKey), queryFn: () => DocumentsService.getV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachment({ documentId, entityId, entityType }) as TData, ...options });
export const useMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsSuspense = <TData = Common.MeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entityId, entityType, limit }: {
  entityId: number;
  entityType: string;
  limit?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsKeyFn({ entityId, entityType, limit }, queryKey), queryFn: () => MeetingsService.getV1ByEntityTypeByEntityIdMeetings({ entityId, entityType, limit }) as TData, ...options });
export const useMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsTemplateSuspense = <TData = Common.MeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ calendarId, entityId, entityType }: {
  calendarId?: number;
  entityId: number;
  entityType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsTemplateKeyFn({ calendarId, entityId, entityType }, queryKey), queryFn: () => MeetingsService.getV1ByEntityTypeByEntityIdMeetingsTemplate({ calendarId, entityId, entityType }) as TData, ...options });
export const useMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsByMeetingIdSuspense = <TData = Common.MeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsByMeetingIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entityId, entityType, meetingId }: {
  entityId: number;
  entityType: string;
  meetingId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsByMeetingIdKeyFn({ entityId, entityType, meetingId }, queryKey), queryFn: () => MeetingsService.getV1ByEntityTypeByEntityIdMeetingsByMeetingId({ entityId, entityType, meetingId }) as TData, ...options });
export const useNotesServiceGetV1ByResourceTypeByResourceIdNotesSuspense = <TData = Common.NotesServiceGetV1ByResourceTypeByResourceIdNotesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId, resourceType }: {
  resourceId: number;
  resourceType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseNotesServiceGetV1ByResourceTypeByResourceIdNotesKeyFn({ resourceId, resourceType }, queryKey), queryFn: () => NotesService.getV1ByResourceTypeByResourceIdNotes({ resourceId, resourceType }) as TData, ...options });
export const useNotesServiceGetV1ByResourceTypeByResourceIdNotesByNoteIdSuspense = <TData = Common.NotesServiceGetV1ByResourceTypeByResourceIdNotesByNoteIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ noteId, resourceId, resourceType }: {
  noteId: number;
  resourceId: number;
  resourceType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseNotesServiceGetV1ByResourceTypeByResourceIdNotesByNoteIdKeyFn({ noteId, resourceId, resourceType }, queryKey), queryFn: () => NotesService.getV1ByResourceTypeByResourceIdNotesByNoteId({ noteId, resourceId, resourceType }) as TData, ...options });
