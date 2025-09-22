// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseQueryResult } from "@tanstack/react-query";
import { AccountNumberFormatService, AccountTransfersService, AccountingClosureService, AccountingRulesService, AdhocQueryApiService, AuditsService, AuthenticationHttpBasicService, BatchApiService, BulkImportService, BulkLoansService, BusinessDateManagementService, BusinessStepConfigurationService, CacheService, CalendarService, CashierJournalsService, CashiersService, CentersService, ChargesService, ClientChargesService, ClientCollateralManagementService, ClientFamilyMemberService, ClientIdentifierService, ClientSearchV2Service, ClientService, ClientTransactionService, ClientsAddressService, CodeValuesService, CodesService, CollateralManagementService, CollectionSheetService, CreditBureauConfigurationService, CurrencyService, DataTablesService, DefaultService, DelinquencyRangeAndBucketsManagementService, DepositAccountOnHoldFundTransactionsService, DeviceRegistrationService, DocumentsService, EntityDataTableService, EntityFieldConfigurationService, ExternalAssetOwnerLoanProductAttributesService, ExternalAssetOwnersService, ExternalEventConfigurationService, ExternalServicesService, FetchAuthenticatedUserDetailsService, FineractEntityService, FixedDepositAccountService, FixedDepositAccountTransactionsService, FixedDepositProductService, FloatingRatesService, FundsService, GeneralLedgerAccountService, GlobalConfigurationService, GroupsLevelService, GroupsService, GuarantorsService, HolidaysService, HooksService, InlineJobService, InstanceModeService, InterOperationService, InterestRateChartService, InterestRateSlabAKAInterestBandsService, JournalEntriesService, LikelihoodService, ListReportMailingJobHistoryService, LoanAccountLockService, LoanBuyDownFeesService, LoanCapitalizedIncomeService, LoanChargesService, LoanCobCatchUpService, LoanCollateralManagementService, LoanCollateralService, LoanDisbursementDetailsService, LoanInterestPauseService, LoanProductsService, LoanReschedulingService, LoanTransactionsService, LoansPointInTimeService, LoansService, MakerCheckerOr4EyeFunctionalityService, MappingFinancialActivitiesToAccountsService, MeetingsService, MixMappingService, MixReportService, MixTaxonomyService, NotesService, NotificationService, OfficesService, PasswordPreferencesService, PaymentTypeService, PeriodicAccrualAccountingService, PermissionsService, PocketService, PovertyLineService, ProductMixService, ProductsService, ProgressiveLoanService, ProvisioningCategoryService, ProvisioningCriteriaService, ProvisioningEntriesService, RateService, RecurringDepositAccountService, RecurringDepositAccountTransactionsService, RecurringDepositProductService, RepaymentWithPostDatedChecksService, ReportMailingJobsService, ReportsService, RescheduleLoansService, RolesService, RunReportsService, SavingsAccountService, SavingsAccountTransactionsService, SavingsChargesService, SavingsProductService, SchedulerJobService, SchedulerService, ScoreCardService, SearchApiService, SelfAccountTransferService, SelfAuthenticationService, SelfClientService, SelfDividendService, SelfLoanProductsService, SelfLoansService, SelfRunReportService, SelfSavingsAccountService, SelfSavingsProductsService, SelfScoreCardService, SelfServiceRegistrationService, SelfShareAccountsService, SelfShareProductsService, SelfSpmService, SelfThirdPartyTransferService, SelfUserDetailsService, SelfUserService, ShareAccountService, SmsService, SpmApiLookUpTableService, SpmSurveysService, StaffService, StandingInstructionsHistoryService, StandingInstructionsService, SurveyService, TaxComponentsService, TaxGroupService, TellerCashManagementService, TwoFactorService, UserGeneratedDocumentsService, UsersService, WorkingDaysService } from "../requests/services.gen";
import { DateParam, TransactionType } from "../requests/types.gen";
export type DefaultServiceGetApplicationWadlDefaultResponse = Awaited<ReturnType<typeof DefaultService.getApplicationWadl>>;
export type DefaultServiceGetApplicationWadlQueryResult<TData = DefaultServiceGetApplicationWadlDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetApplicationWadlKey = "DefaultServiceGetApplicationWadl";
export const UseDefaultServiceGetApplicationWadlKeyFn = (queryKey?: Array<unknown>) => [useDefaultServiceGetApplicationWadlKey, ...(queryKey ?? [])];
export type DefaultServiceGetApplicationWadlByPathDefaultResponse = Awaited<ReturnType<typeof DefaultService.getApplicationWadlByPath>>;
export type DefaultServiceGetApplicationWadlByPathQueryResult<TData = DefaultServiceGetApplicationWadlByPathDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetApplicationWadlByPathKey = "DefaultServiceGetApplicationWadlByPath";
export const UseDefaultServiceGetApplicationWadlByPathKeyFn = ({ path }: {
  path: string;
}, queryKey?: Array<unknown>) => [useDefaultServiceGetApplicationWadlByPathKey, ...(queryKey ?? [{ path }])];
export type DefaultServiceGetV1CreditBureauIntegrationCreditReportByCreditBureauIdDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1CreditBureauIntegrationCreditReportByCreditBureauId>>;
export type DefaultServiceGetV1CreditBureauIntegrationCreditReportByCreditBureauIdQueryResult<TData = DefaultServiceGetV1CreditBureauIntegrationCreditReportByCreditBureauIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1CreditBureauIntegrationCreditReportByCreditBureauIdKey = "DefaultServiceGetV1CreditBureauIntegrationCreditReportByCreditBureauId";
export const UseDefaultServiceGetV1CreditBureauIntegrationCreditReportByCreditBureauIdKeyFn = ({ creditBureauId }: {
  creditBureauId: number;
}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1CreditBureauIntegrationCreditReportByCreditBureauIdKey, ...(queryKey ?? [{ creditBureauId }])];
export type DefaultServiceGetV1EchoDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1Echo>>;
export type DefaultServiceGetV1EchoQueryResult<TData = DefaultServiceGetV1EchoDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1EchoKey = "DefaultServiceGetV1Echo";
export const UseDefaultServiceGetV1EchoKeyFn = (queryKey?: Array<unknown>) => [useDefaultServiceGetV1EchoKey, ...(queryKey ?? [])];
export type DefaultServiceGetV1EmailDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1Email>>;
export type DefaultServiceGetV1EmailQueryResult<TData = DefaultServiceGetV1EmailDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1EmailKey = "DefaultServiceGetV1Email";
export const UseDefaultServiceGetV1EmailKeyFn = (queryKey?: Array<unknown>) => [useDefaultServiceGetV1EmailKey, ...(queryKey ?? [])];
export type DefaultServiceGetV1EmailCampaignDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1EmailCampaign>>;
export type DefaultServiceGetV1EmailCampaignQueryResult<TData = DefaultServiceGetV1EmailCampaignDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1EmailCampaignKey = "DefaultServiceGetV1EmailCampaign";
export const UseDefaultServiceGetV1EmailCampaignKeyFn = (queryKey?: Array<unknown>) => [useDefaultServiceGetV1EmailCampaignKey, ...(queryKey ?? [])];
export type DefaultServiceGetV1EmailCampaignTemplateDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1EmailCampaignTemplate>>;
export type DefaultServiceGetV1EmailCampaignTemplateQueryResult<TData = DefaultServiceGetV1EmailCampaignTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1EmailCampaignTemplateKey = "DefaultServiceGetV1EmailCampaignTemplate";
export const UseDefaultServiceGetV1EmailCampaignTemplateKeyFn = (queryKey?: Array<unknown>) => [useDefaultServiceGetV1EmailCampaignTemplateKey, ...(queryKey ?? [])];
export type DefaultServiceGetV1EmailCampaignTemplateByResourceIdDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1EmailCampaignTemplateByResourceId>>;
export type DefaultServiceGetV1EmailCampaignTemplateByResourceIdQueryResult<TData = DefaultServiceGetV1EmailCampaignTemplateByResourceIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1EmailCampaignTemplateByResourceIdKey = "DefaultServiceGetV1EmailCampaignTemplateByResourceId";
export const UseDefaultServiceGetV1EmailCampaignTemplateByResourceIdKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1EmailCampaignTemplateByResourceIdKey, ...(queryKey ?? [{ resourceId }])];
export type DefaultServiceGetV1EmailCampaignByResourceIdDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1EmailCampaignByResourceId>>;
export type DefaultServiceGetV1EmailCampaignByResourceIdQueryResult<TData = DefaultServiceGetV1EmailCampaignByResourceIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1EmailCampaignByResourceIdKey = "DefaultServiceGetV1EmailCampaignByResourceId";
export const UseDefaultServiceGetV1EmailCampaignByResourceIdKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1EmailCampaignByResourceIdKey, ...(queryKey ?? [{ resourceId }])];
export type DefaultServiceGetV1EmailConfigurationDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1EmailConfiguration>>;
export type DefaultServiceGetV1EmailConfigurationQueryResult<TData = DefaultServiceGetV1EmailConfigurationDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1EmailConfigurationKey = "DefaultServiceGetV1EmailConfiguration";
export const UseDefaultServiceGetV1EmailConfigurationKeyFn = (queryKey?: Array<unknown>) => [useDefaultServiceGetV1EmailConfigurationKey, ...(queryKey ?? [])];
export type DefaultServiceGetV1EmailFailedEmailDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1EmailFailedEmail>>;
export type DefaultServiceGetV1EmailFailedEmailQueryResult<TData = DefaultServiceGetV1EmailFailedEmailDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1EmailFailedEmailKey = "DefaultServiceGetV1EmailFailedEmail";
export const UseDefaultServiceGetV1EmailFailedEmailKeyFn = ({ limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1EmailFailedEmailKey, ...(queryKey ?? [{ limit, offset, orderBy, sortOrder }])];
export type DefaultServiceGetV1EmailMessageByStatusDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1EmailMessageByStatus>>;
export type DefaultServiceGetV1EmailMessageByStatusQueryResult<TData = DefaultServiceGetV1EmailMessageByStatusDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1EmailMessageByStatusKey = "DefaultServiceGetV1EmailMessageByStatus";
export const UseDefaultServiceGetV1EmailMessageByStatusKeyFn = ({ dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }: {
  dateFormat?: string;
  fromDate?: DateParam;
  limit?: number;
  locale?: string;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  status?: number;
  toDate?: DateParam;
} = {}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1EmailMessageByStatusKey, ...(queryKey ?? [{ dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }])];
export type DefaultServiceGetV1EmailPendingEmailDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1EmailPendingEmail>>;
export type DefaultServiceGetV1EmailPendingEmailQueryResult<TData = DefaultServiceGetV1EmailPendingEmailDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1EmailPendingEmailKey = "DefaultServiceGetV1EmailPendingEmail";
export const UseDefaultServiceGetV1EmailPendingEmailKeyFn = ({ limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1EmailPendingEmailKey, ...(queryKey ?? [{ limit, offset, orderBy, sortOrder }])];
export type DefaultServiceGetV1EmailSentEmailDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1EmailSentEmail>>;
export type DefaultServiceGetV1EmailSentEmailQueryResult<TData = DefaultServiceGetV1EmailSentEmailDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1EmailSentEmailKey = "DefaultServiceGetV1EmailSentEmail";
export const UseDefaultServiceGetV1EmailSentEmailKeyFn = ({ limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1EmailSentEmailKey, ...(queryKey ?? [{ limit, offset, orderBy, sortOrder }])];
export type DefaultServiceGetV1EmailByResourceIdDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1EmailByResourceId>>;
export type DefaultServiceGetV1EmailByResourceIdQueryResult<TData = DefaultServiceGetV1EmailByResourceIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1EmailByResourceIdKey = "DefaultServiceGetV1EmailByResourceId";
export const UseDefaultServiceGetV1EmailByResourceIdKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1EmailByResourceIdKey, ...(queryKey ?? [{ resourceId }])];
export type DefaultServiceGetV1InternalClientByClientIdAuditDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1InternalClientByClientIdAudit>>;
export type DefaultServiceGetV1InternalClientByClientIdAuditQueryResult<TData = DefaultServiceGetV1InternalClientByClientIdAuditDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1InternalClientByClientIdAuditKey = "DefaultServiceGetV1InternalClientByClientIdAudit";
export const UseDefaultServiceGetV1InternalClientByClientIdAuditKeyFn = ({ clientId }: {
  clientId: number;
}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1InternalClientByClientIdAuditKey, ...(queryKey ?? [{ clientId }])];
export type DefaultServiceGetV1InternalCobPartitionsByPartitionSizeDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1InternalCobPartitionsByPartitionSize>>;
export type DefaultServiceGetV1InternalCobPartitionsByPartitionSizeQueryResult<TData = DefaultServiceGetV1InternalCobPartitionsByPartitionSizeDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1InternalCobPartitionsByPartitionSizeKey = "DefaultServiceGetV1InternalCobPartitionsByPartitionSize";
export const UseDefaultServiceGetV1InternalCobPartitionsByPartitionSizeKeyFn = ({ partitionSize }: {
  partitionSize: number;
}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1InternalCobPartitionsByPartitionSizeKey, ...(queryKey ?? [{ partitionSize }])];
export type DefaultServiceGetV1InternalExternaleventsDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1InternalExternalevents>>;
export type DefaultServiceGetV1InternalExternaleventsQueryResult<TData = DefaultServiceGetV1InternalExternaleventsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1InternalExternaleventsKey = "DefaultServiceGetV1InternalExternalevents";
export const UseDefaultServiceGetV1InternalExternaleventsKeyFn = ({ aggregateRootId, category, idempotencyKey, type }: {
  aggregateRootId?: number;
  category?: string;
  idempotencyKey?: string;
  type?: string;
} = {}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1InternalExternaleventsKey, ...(queryKey ?? [{ aggregateRootId, category, idempotencyKey, type }])];
export type DefaultServiceGetV1InternalLoanStatusByStatusIdDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1InternalLoanStatusByStatusId>>;
export type DefaultServiceGetV1InternalLoanStatusByStatusIdQueryResult<TData = DefaultServiceGetV1InternalLoanStatusByStatusIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1InternalLoanStatusByStatusIdKey = "DefaultServiceGetV1InternalLoanStatusByStatusId";
export const UseDefaultServiceGetV1InternalLoanStatusByStatusIdKeyFn = ({ statusId }: {
  statusId: number;
}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1InternalLoanStatusByStatusIdKey, ...(queryKey ?? [{ statusId }])];
export type DefaultServiceGetV1InternalLoanByLoanIdAdvancedPaymentAllocationRulesDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1InternalLoanByLoanIdAdvancedPaymentAllocationRules>>;
export type DefaultServiceGetV1InternalLoanByLoanIdAdvancedPaymentAllocationRulesQueryResult<TData = DefaultServiceGetV1InternalLoanByLoanIdAdvancedPaymentAllocationRulesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1InternalLoanByLoanIdAdvancedPaymentAllocationRulesKey = "DefaultServiceGetV1InternalLoanByLoanIdAdvancedPaymentAllocationRules";
export const UseDefaultServiceGetV1InternalLoanByLoanIdAdvancedPaymentAllocationRulesKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1InternalLoanByLoanIdAdvancedPaymentAllocationRulesKey, ...(queryKey ?? [{ loanId }])];
export type DefaultServiceGetV1InternalLoanByLoanIdAuditDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1InternalLoanByLoanIdAudit>>;
export type DefaultServiceGetV1InternalLoanByLoanIdAuditQueryResult<TData = DefaultServiceGetV1InternalLoanByLoanIdAuditDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1InternalLoanByLoanIdAuditKey = "DefaultServiceGetV1InternalLoanByLoanIdAudit";
export const UseDefaultServiceGetV1InternalLoanByLoanIdAuditKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1InternalLoanByLoanIdAuditKey, ...(queryKey ?? [{ loanId }])];
export type DefaultServiceGetV1InternalLoanByLoanIdTransactionByTransactionIdAuditDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1InternalLoanByLoanIdTransactionByTransactionIdAudit>>;
export type DefaultServiceGetV1InternalLoanByLoanIdTransactionByTransactionIdAuditQueryResult<TData = DefaultServiceGetV1InternalLoanByLoanIdTransactionByTransactionIdAuditDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1InternalLoanByLoanIdTransactionByTransactionIdAuditKey = "DefaultServiceGetV1InternalLoanByLoanIdTransactionByTransactionIdAudit";
export const UseDefaultServiceGetV1InternalLoanByLoanIdTransactionByTransactionIdAuditKeyFn = ({ loanId, transactionId }: {
  loanId: number;
  transactionId: number;
}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1InternalLoanByLoanIdTransactionByTransactionIdAuditKey, ...(queryKey ?? [{ loanId, transactionId }])];
export type DefaultServiceGetV1OfficetransactionsDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1Officetransactions>>;
export type DefaultServiceGetV1OfficetransactionsQueryResult<TData = DefaultServiceGetV1OfficetransactionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1OfficetransactionsKey = "DefaultServiceGetV1Officetransactions";
export const UseDefaultServiceGetV1OfficetransactionsKeyFn = (queryKey?: Array<unknown>) => [useDefaultServiceGetV1OfficetransactionsKey, ...(queryKey ?? [])];
export type DefaultServiceGetV1OfficetransactionsTemplateDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1OfficetransactionsTemplate>>;
export type DefaultServiceGetV1OfficetransactionsTemplateQueryResult<TData = DefaultServiceGetV1OfficetransactionsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1OfficetransactionsTemplateKey = "DefaultServiceGetV1OfficetransactionsTemplate";
export const UseDefaultServiceGetV1OfficetransactionsTemplateKeyFn = (queryKey?: Array<unknown>) => [useDefaultServiceGetV1OfficetransactionsTemplateKey, ...(queryKey ?? [])];
export type DefaultServiceGetV1SmscampaignsDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1Smscampaigns>>;
export type DefaultServiceGetV1SmscampaignsQueryResult<TData = DefaultServiceGetV1SmscampaignsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1SmscampaignsKey = "DefaultServiceGetV1Smscampaigns";
export const UseDefaultServiceGetV1SmscampaignsKeyFn = ({ limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1SmscampaignsKey, ...(queryKey ?? [{ limit, offset, orderBy, sortOrder }])];
export type DefaultServiceGetV1SmscampaignsTemplateDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1SmscampaignsTemplate>>;
export type DefaultServiceGetV1SmscampaignsTemplateQueryResult<TData = DefaultServiceGetV1SmscampaignsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1SmscampaignsTemplateKey = "DefaultServiceGetV1SmscampaignsTemplate";
export const UseDefaultServiceGetV1SmscampaignsTemplateKeyFn = (queryKey?: Array<unknown>) => [useDefaultServiceGetV1SmscampaignsTemplateKey, ...(queryKey ?? [])];
export type DefaultServiceGetV1SmscampaignsByResourceIdDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1SmscampaignsByResourceId>>;
export type DefaultServiceGetV1SmscampaignsByResourceIdQueryResult<TData = DefaultServiceGetV1SmscampaignsByResourceIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1SmscampaignsByResourceIdKey = "DefaultServiceGetV1SmscampaignsByResourceId";
export const UseDefaultServiceGetV1SmscampaignsByResourceIdKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1SmscampaignsByResourceIdKey, ...(queryKey ?? [{ resourceId }])];
export type DefaultServiceGetV1TwofactorConfigureDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1TwofactorConfigure>>;
export type DefaultServiceGetV1TwofactorConfigureQueryResult<TData = DefaultServiceGetV1TwofactorConfigureDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1TwofactorConfigureKey = "DefaultServiceGetV1TwofactorConfigure";
export const UseDefaultServiceGetV1TwofactorConfigureKeyFn = (queryKey?: Array<unknown>) => [useDefaultServiceGetV1TwofactorConfigureKey, ...(queryKey ?? [])];
export type DefaultServiceGetV1ByEntityByEntityIdImagesDefaultResponse = Awaited<ReturnType<typeof DefaultService.getV1ByEntityByEntityIdImages>>;
export type DefaultServiceGetV1ByEntityByEntityIdImagesQueryResult<TData = DefaultServiceGetV1ByEntityByEntityIdImagesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetV1ByEntityByEntityIdImagesKey = "DefaultServiceGetV1ByEntityByEntityIdImages";
export const UseDefaultServiceGetV1ByEntityByEntityIdImagesKeyFn = ({ accept, entity, entityId, maxHeight, maxWidth, output }: {
  accept?: string;
  entity: string;
  entityId: number;
  maxHeight?: number;
  maxWidth?: number;
  output?: string;
}, queryKey?: Array<unknown>) => [useDefaultServiceGetV1ByEntityByEntityIdImagesKey, ...(queryKey ?? [{ accept, entity, entityId, maxHeight, maxWidth, output }])];
export type CreditBureauConfigurationServiceGetV1CreditBureauConfigurationDefaultResponse = Awaited<ReturnType<typeof CreditBureauConfigurationService.getV1CreditBureauConfiguration>>;
export type CreditBureauConfigurationServiceGetV1CreditBureauConfigurationQueryResult<TData = CreditBureauConfigurationServiceGetV1CreditBureauConfigurationDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationKey = "CreditBureauConfigurationServiceGetV1CreditBureauConfiguration";
export const UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationKeyFn = (queryKey?: Array<unknown>) => [useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationKey, ...(queryKey ?? [])];
export type CreditBureauConfigurationServiceGetV1CreditBureauConfigurationConfigByOrganisationCreditBureauIdDefaultResponse = Awaited<ReturnType<typeof CreditBureauConfigurationService.getV1CreditBureauConfigurationConfigByOrganisationCreditBureauId>>;
export type CreditBureauConfigurationServiceGetV1CreditBureauConfigurationConfigByOrganisationCreditBureauIdQueryResult<TData = CreditBureauConfigurationServiceGetV1CreditBureauConfigurationConfigByOrganisationCreditBureauIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationConfigByOrganisationCreditBureauIdKey = "CreditBureauConfigurationServiceGetV1CreditBureauConfigurationConfigByOrganisationCreditBureauId";
export const UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationConfigByOrganisationCreditBureauIdKeyFn = ({ organisationCreditBureauId }: {
  organisationCreditBureauId: number;
}, queryKey?: Array<unknown>) => [useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationConfigByOrganisationCreditBureauIdKey, ...(queryKey ?? [{ organisationCreditBureauId }])];
export type CreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductDefaultResponse = Awaited<ReturnType<typeof CreditBureauConfigurationService.getV1CreditBureauConfigurationLoanProduct>>;
export type CreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductQueryResult<TData = CreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductKey = "CreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProduct";
export const UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductKeyFn = (queryKey?: Array<unknown>) => [useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductKey, ...(queryKey ?? [])];
export type CreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductByLoanProductIdDefaultResponse = Awaited<ReturnType<typeof CreditBureauConfigurationService.getV1CreditBureauConfigurationLoanProductByLoanProductId>>;
export type CreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductByLoanProductIdQueryResult<TData = CreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductByLoanProductIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductByLoanProductIdKey = "CreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductByLoanProductId";
export const UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductByLoanProductIdKeyFn = ({ loanProductId }: {
  loanProductId: number;
}, queryKey?: Array<unknown>) => [useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductByLoanProductIdKey, ...(queryKey ?? [{ loanProductId }])];
export type CreditBureauConfigurationServiceGetV1CreditBureauConfigurationMappingsDefaultResponse = Awaited<ReturnType<typeof CreditBureauConfigurationService.getV1CreditBureauConfigurationMappings>>;
export type CreditBureauConfigurationServiceGetV1CreditBureauConfigurationMappingsQueryResult<TData = CreditBureauConfigurationServiceGetV1CreditBureauConfigurationMappingsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationMappingsKey = "CreditBureauConfigurationServiceGetV1CreditBureauConfigurationMappings";
export const UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationMappingsKeyFn = (queryKey?: Array<unknown>) => [useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationMappingsKey, ...(queryKey ?? [])];
export type CreditBureauConfigurationServiceGetV1CreditBureauConfigurationOrganisationCreditBureauDefaultResponse = Awaited<ReturnType<typeof CreditBureauConfigurationService.getV1CreditBureauConfigurationOrganisationCreditBureau>>;
export type CreditBureauConfigurationServiceGetV1CreditBureauConfigurationOrganisationCreditBureauQueryResult<TData = CreditBureauConfigurationServiceGetV1CreditBureauConfigurationOrganisationCreditBureauDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationOrganisationCreditBureauKey = "CreditBureauConfigurationServiceGetV1CreditBureauConfigurationOrganisationCreditBureau";
export const UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationOrganisationCreditBureauKeyFn = (queryKey?: Array<unknown>) => [useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationOrganisationCreditBureauKey, ...(queryKey ?? [])];
export type AccountingRulesServiceGetV1AccountingrulesDefaultResponse = Awaited<ReturnType<typeof AccountingRulesService.getV1Accountingrules>>;
export type AccountingRulesServiceGetV1AccountingrulesQueryResult<TData = AccountingRulesServiceGetV1AccountingrulesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccountingRulesServiceGetV1AccountingrulesKey = "AccountingRulesServiceGetV1Accountingrules";
export const UseAccountingRulesServiceGetV1AccountingrulesKeyFn = (queryKey?: Array<unknown>) => [useAccountingRulesServiceGetV1AccountingrulesKey, ...(queryKey ?? [])];
export type AccountingRulesServiceGetV1AccountingrulesTemplateDefaultResponse = Awaited<ReturnType<typeof AccountingRulesService.getV1AccountingrulesTemplate>>;
export type AccountingRulesServiceGetV1AccountingrulesTemplateQueryResult<TData = AccountingRulesServiceGetV1AccountingrulesTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccountingRulesServiceGetV1AccountingrulesTemplateKey = "AccountingRulesServiceGetV1AccountingrulesTemplate";
export const UseAccountingRulesServiceGetV1AccountingrulesTemplateKeyFn = (queryKey?: Array<unknown>) => [useAccountingRulesServiceGetV1AccountingrulesTemplateKey, ...(queryKey ?? [])];
export type AccountingRulesServiceGetV1AccountingrulesByAccountingRuleIdDefaultResponse = Awaited<ReturnType<typeof AccountingRulesService.getV1AccountingrulesByAccountingRuleId>>;
export type AccountingRulesServiceGetV1AccountingrulesByAccountingRuleIdQueryResult<TData = AccountingRulesServiceGetV1AccountingrulesByAccountingRuleIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccountingRulesServiceGetV1AccountingrulesByAccountingRuleIdKey = "AccountingRulesServiceGetV1AccountingrulesByAccountingRuleId";
export const UseAccountingRulesServiceGetV1AccountingrulesByAccountingRuleIdKeyFn = ({ accountingRuleId }: {
  accountingRuleId: number;
}, queryKey?: Array<unknown>) => [useAccountingRulesServiceGetV1AccountingrulesByAccountingRuleIdKey, ...(queryKey ?? [{ accountingRuleId }])];
export type AccountNumberFormatServiceGetV1AccountnumberformatsDefaultResponse = Awaited<ReturnType<typeof AccountNumberFormatService.getV1Accountnumberformats>>;
export type AccountNumberFormatServiceGetV1AccountnumberformatsQueryResult<TData = AccountNumberFormatServiceGetV1AccountnumberformatsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccountNumberFormatServiceGetV1AccountnumberformatsKey = "AccountNumberFormatServiceGetV1Accountnumberformats";
export const UseAccountNumberFormatServiceGetV1AccountnumberformatsKeyFn = (queryKey?: Array<unknown>) => [useAccountNumberFormatServiceGetV1AccountnumberformatsKey, ...(queryKey ?? [])];
export type AccountNumberFormatServiceGetV1AccountnumberformatsTemplateDefaultResponse = Awaited<ReturnType<typeof AccountNumberFormatService.getV1AccountnumberformatsTemplate>>;
export type AccountNumberFormatServiceGetV1AccountnumberformatsTemplateQueryResult<TData = AccountNumberFormatServiceGetV1AccountnumberformatsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccountNumberFormatServiceGetV1AccountnumberformatsTemplateKey = "AccountNumberFormatServiceGetV1AccountnumberformatsTemplate";
export const UseAccountNumberFormatServiceGetV1AccountnumberformatsTemplateKeyFn = (queryKey?: Array<unknown>) => [useAccountNumberFormatServiceGetV1AccountnumberformatsTemplateKey, ...(queryKey ?? [])];
export type AccountNumberFormatServiceGetV1AccountnumberformatsByAccountNumberFormatIdDefaultResponse = Awaited<ReturnType<typeof AccountNumberFormatService.getV1AccountnumberformatsByAccountNumberFormatId>>;
export type AccountNumberFormatServiceGetV1AccountnumberformatsByAccountNumberFormatIdQueryResult<TData = AccountNumberFormatServiceGetV1AccountnumberformatsByAccountNumberFormatIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccountNumberFormatServiceGetV1AccountnumberformatsByAccountNumberFormatIdKey = "AccountNumberFormatServiceGetV1AccountnumberformatsByAccountNumberFormatId";
export const UseAccountNumberFormatServiceGetV1AccountnumberformatsByAccountNumberFormatIdKeyFn = ({ accountNumberFormatId }: {
  accountNumberFormatId: number;
}, queryKey?: Array<unknown>) => [useAccountNumberFormatServiceGetV1AccountnumberformatsByAccountNumberFormatIdKey, ...(queryKey ?? [{ accountNumberFormatId }])];
export type ShareAccountServiceGetV1AccountsByTypeDefaultResponse = Awaited<ReturnType<typeof ShareAccountService.getV1AccountsByType>>;
export type ShareAccountServiceGetV1AccountsByTypeQueryResult<TData = ShareAccountServiceGetV1AccountsByTypeDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useShareAccountServiceGetV1AccountsByTypeKey = "ShareAccountServiceGetV1AccountsByType";
export const UseShareAccountServiceGetV1AccountsByTypeKeyFn = ({ limit, offset, type }: {
  limit?: number;
  offset?: number;
  type: string;
}, queryKey?: Array<unknown>) => [useShareAccountServiceGetV1AccountsByTypeKey, ...(queryKey ?? [{ limit, offset, type }])];
export type ShareAccountServiceGetV1AccountsByTypeDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof ShareAccountService.getV1AccountsByTypeDownloadtemplate>>;
export type ShareAccountServiceGetV1AccountsByTypeDownloadtemplateQueryResult<TData = ShareAccountServiceGetV1AccountsByTypeDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useShareAccountServiceGetV1AccountsByTypeDownloadtemplateKey = "ShareAccountServiceGetV1AccountsByTypeDownloadtemplate";
export const UseShareAccountServiceGetV1AccountsByTypeDownloadtemplateKeyFn = ({ dateFormat, officeId, type }: {
  dateFormat?: string;
  officeId?: number;
  type: string;
}, queryKey?: Array<unknown>) => [useShareAccountServiceGetV1AccountsByTypeDownloadtemplateKey, ...(queryKey ?? [{ dateFormat, officeId, type }])];
export type ShareAccountServiceGetV1AccountsByTypeTemplateDefaultResponse = Awaited<ReturnType<typeof ShareAccountService.getV1AccountsByTypeTemplate>>;
export type ShareAccountServiceGetV1AccountsByTypeTemplateQueryResult<TData = ShareAccountServiceGetV1AccountsByTypeTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useShareAccountServiceGetV1AccountsByTypeTemplateKey = "ShareAccountServiceGetV1AccountsByTypeTemplate";
export const UseShareAccountServiceGetV1AccountsByTypeTemplateKeyFn = ({ clientId, productId, type }: {
  clientId?: number;
  productId?: number;
  type: string;
}, queryKey?: Array<unknown>) => [useShareAccountServiceGetV1AccountsByTypeTemplateKey, ...(queryKey ?? [{ clientId, productId, type }])];
export type ShareAccountServiceGetV1AccountsByTypeByAccountIdDefaultResponse = Awaited<ReturnType<typeof ShareAccountService.getV1AccountsByTypeByAccountId>>;
export type ShareAccountServiceGetV1AccountsByTypeByAccountIdQueryResult<TData = ShareAccountServiceGetV1AccountsByTypeByAccountIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useShareAccountServiceGetV1AccountsByTypeByAccountIdKey = "ShareAccountServiceGetV1AccountsByTypeByAccountId";
export const UseShareAccountServiceGetV1AccountsByTypeByAccountIdKeyFn = ({ accountId, type }: {
  accountId: number;
  type: string;
}, queryKey?: Array<unknown>) => [useShareAccountServiceGetV1AccountsByTypeByAccountIdKey, ...(queryKey ?? [{ accountId, type }])];
export type AccountTransfersServiceGetV1AccounttransfersDefaultResponse = Awaited<ReturnType<typeof AccountTransfersService.getV1Accounttransfers>>;
export type AccountTransfersServiceGetV1AccounttransfersQueryResult<TData = AccountTransfersServiceGetV1AccounttransfersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccountTransfersServiceGetV1AccounttransfersKey = "AccountTransfersServiceGetV1Accounttransfers";
export const UseAccountTransfersServiceGetV1AccounttransfersKeyFn = ({ accountDetailId, externalId, limit, offset, orderBy, sortOrder }: {
  accountDetailId?: number;
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: Array<unknown>) => [useAccountTransfersServiceGetV1AccounttransfersKey, ...(queryKey ?? [{ accountDetailId, externalId, limit, offset, orderBy, sortOrder }])];
export type AccountTransfersServiceGetV1AccounttransfersTemplateDefaultResponse = Awaited<ReturnType<typeof AccountTransfersService.getV1AccounttransfersTemplate>>;
export type AccountTransfersServiceGetV1AccounttransfersTemplateQueryResult<TData = AccountTransfersServiceGetV1AccounttransfersTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccountTransfersServiceGetV1AccounttransfersTemplateKey = "AccountTransfersServiceGetV1AccounttransfersTemplate";
export const UseAccountTransfersServiceGetV1AccounttransfersTemplateKeyFn = ({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }: {
  fromAccountId?: number;
  fromAccountType?: number;
  fromClientId?: number;
  fromOfficeId?: number;
  toAccountId?: number;
  toAccountType?: number;
  toClientId?: number;
  toOfficeId?: number;
} = {}, queryKey?: Array<unknown>) => [useAccountTransfersServiceGetV1AccounttransfersTemplateKey, ...(queryKey ?? [{ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }])];
export type AccountTransfersServiceGetV1AccounttransfersTemplateRefundByTransferDefaultResponse = Awaited<ReturnType<typeof AccountTransfersService.getV1AccounttransfersTemplateRefundByTransfer>>;
export type AccountTransfersServiceGetV1AccounttransfersTemplateRefundByTransferQueryResult<TData = AccountTransfersServiceGetV1AccounttransfersTemplateRefundByTransferDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccountTransfersServiceGetV1AccounttransfersTemplateRefundByTransferKey = "AccountTransfersServiceGetV1AccounttransfersTemplateRefundByTransfer";
export const UseAccountTransfersServiceGetV1AccounttransfersTemplateRefundByTransferKeyFn = ({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }: {
  fromAccountId?: number;
  fromAccountType?: number;
  fromClientId?: number;
  fromOfficeId?: number;
  toAccountId?: number;
  toAccountType?: number;
  toClientId?: number;
  toOfficeId?: number;
} = {}, queryKey?: Array<unknown>) => [useAccountTransfersServiceGetV1AccounttransfersTemplateRefundByTransferKey, ...(queryKey ?? [{ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }])];
export type AccountTransfersServiceGetV1AccounttransfersByTransferIdDefaultResponse = Awaited<ReturnType<typeof AccountTransfersService.getV1AccounttransfersByTransferId>>;
export type AccountTransfersServiceGetV1AccounttransfersByTransferIdQueryResult<TData = AccountTransfersServiceGetV1AccounttransfersByTransferIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccountTransfersServiceGetV1AccounttransfersByTransferIdKey = "AccountTransfersServiceGetV1AccounttransfersByTransferId";
export const UseAccountTransfersServiceGetV1AccounttransfersByTransferIdKeyFn = ({ transferId }: {
  transferId: number;
}, queryKey?: Array<unknown>) => [useAccountTransfersServiceGetV1AccounttransfersByTransferIdKey, ...(queryKey ?? [{ transferId }])];
export type AdhocQueryApiServiceGetV1AdhocqueryDefaultResponse = Awaited<ReturnType<typeof AdhocQueryApiService.getV1Adhocquery>>;
export type AdhocQueryApiServiceGetV1AdhocqueryQueryResult<TData = AdhocQueryApiServiceGetV1AdhocqueryDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAdhocQueryApiServiceGetV1AdhocqueryKey = "AdhocQueryApiServiceGetV1Adhocquery";
export const UseAdhocQueryApiServiceGetV1AdhocqueryKeyFn = (queryKey?: Array<unknown>) => [useAdhocQueryApiServiceGetV1AdhocqueryKey, ...(queryKey ?? [])];
export type AdhocQueryApiServiceGetV1AdhocqueryTemplateDefaultResponse = Awaited<ReturnType<typeof AdhocQueryApiService.getV1AdhocqueryTemplate>>;
export type AdhocQueryApiServiceGetV1AdhocqueryTemplateQueryResult<TData = AdhocQueryApiServiceGetV1AdhocqueryTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAdhocQueryApiServiceGetV1AdhocqueryTemplateKey = "AdhocQueryApiServiceGetV1AdhocqueryTemplate";
export const UseAdhocQueryApiServiceGetV1AdhocqueryTemplateKeyFn = (queryKey?: Array<unknown>) => [useAdhocQueryApiServiceGetV1AdhocqueryTemplateKey, ...(queryKey ?? [])];
export type AdhocQueryApiServiceGetV1AdhocqueryByAdHocIdDefaultResponse = Awaited<ReturnType<typeof AdhocQueryApiService.getV1AdhocqueryByAdHocId>>;
export type AdhocQueryApiServiceGetV1AdhocqueryByAdHocIdQueryResult<TData = AdhocQueryApiServiceGetV1AdhocqueryByAdHocIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAdhocQueryApiServiceGetV1AdhocqueryByAdHocIdKey = "AdhocQueryApiServiceGetV1AdhocqueryByAdHocId";
export const UseAdhocQueryApiServiceGetV1AdhocqueryByAdHocIdKeyFn = ({ adHocId }: {
  adHocId: number;
}, queryKey?: Array<unknown>) => [useAdhocQueryApiServiceGetV1AdhocqueryByAdHocIdKey, ...(queryKey ?? [{ adHocId }])];
export type AuditsServiceGetV1AuditsDefaultResponse = Awaited<ReturnType<typeof AuditsService.getV1Audits>>;
export type AuditsServiceGetV1AuditsQueryResult<TData = AuditsServiceGetV1AuditsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAuditsServiceGetV1AuditsKey = "AuditsServiceGetV1Audits";
export const UseAuditsServiceGetV1AuditsKeyFn = ({ actionName, checkerDateTimeFrom, checkerDateTimeTo, checkerId, clientId, dateFormat, entityName, groupId, limit, loanId, locale, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, offset, orderBy, paged, processingResult, resourceId, savingsAccountId, sortOrder, status }: {
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
} = {}, queryKey?: Array<unknown>) => [useAuditsServiceGetV1AuditsKey, ...(queryKey ?? [{ actionName, checkerDateTimeFrom, checkerDateTimeTo, checkerId, clientId, dateFormat, entityName, groupId, limit, loanId, locale, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, offset, orderBy, paged, processingResult, resourceId, savingsAccountId, sortOrder, status }])];
export type AuditsServiceGetV1AuditsSearchtemplateDefaultResponse = Awaited<ReturnType<typeof AuditsService.getV1AuditsSearchtemplate>>;
export type AuditsServiceGetV1AuditsSearchtemplateQueryResult<TData = AuditsServiceGetV1AuditsSearchtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAuditsServiceGetV1AuditsSearchtemplateKey = "AuditsServiceGetV1AuditsSearchtemplate";
export const UseAuditsServiceGetV1AuditsSearchtemplateKeyFn = (queryKey?: Array<unknown>) => [useAuditsServiceGetV1AuditsSearchtemplateKey, ...(queryKey ?? [])];
export type AuditsServiceGetV1AuditsByAuditIdDefaultResponse = Awaited<ReturnType<typeof AuditsService.getV1AuditsByAuditId>>;
export type AuditsServiceGetV1AuditsByAuditIdQueryResult<TData = AuditsServiceGetV1AuditsByAuditIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAuditsServiceGetV1AuditsByAuditIdKey = "AuditsServiceGetV1AuditsByAuditId";
export const UseAuditsServiceGetV1AuditsByAuditIdKeyFn = ({ auditId }: {
  auditId: number;
}, queryKey?: Array<unknown>) => [useAuditsServiceGetV1AuditsByAuditIdKey, ...(queryKey ?? [{ auditId }])];
export type BusinessDateManagementServiceGetV1BusinessdateDefaultResponse = Awaited<ReturnType<typeof BusinessDateManagementService.getV1Businessdate>>;
export type BusinessDateManagementServiceGetV1BusinessdateQueryResult<TData = BusinessDateManagementServiceGetV1BusinessdateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useBusinessDateManagementServiceGetV1BusinessdateKey = "BusinessDateManagementServiceGetV1Businessdate";
export const UseBusinessDateManagementServiceGetV1BusinessdateKeyFn = (queryKey?: Array<unknown>) => [useBusinessDateManagementServiceGetV1BusinessdateKey, ...(queryKey ?? [])];
export type BusinessDateManagementServiceGetV1BusinessdateByTypeDefaultResponse = Awaited<ReturnType<typeof BusinessDateManagementService.getV1BusinessdateByType>>;
export type BusinessDateManagementServiceGetV1BusinessdateByTypeQueryResult<TData = BusinessDateManagementServiceGetV1BusinessdateByTypeDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useBusinessDateManagementServiceGetV1BusinessdateByTypeKey = "BusinessDateManagementServiceGetV1BusinessdateByType";
export const UseBusinessDateManagementServiceGetV1BusinessdateByTypeKeyFn = ({ type }: {
  type: string;
}, queryKey?: Array<unknown>) => [useBusinessDateManagementServiceGetV1BusinessdateByTypeKey, ...(queryKey ?? [{ type }])];
export type CacheServiceGetV1CachesDefaultResponse = Awaited<ReturnType<typeof CacheService.getV1Caches>>;
export type CacheServiceGetV1CachesQueryResult<TData = CacheServiceGetV1CachesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCacheServiceGetV1CachesKey = "CacheServiceGetV1Caches";
export const UseCacheServiceGetV1CachesKeyFn = (queryKey?: Array<unknown>) => [useCacheServiceGetV1CachesKey, ...(queryKey ?? [])];
export type CashiersServiceGetV1CashiersDefaultResponse = Awaited<ReturnType<typeof CashiersService.getV1Cashiers>>;
export type CashiersServiceGetV1CashiersQueryResult<TData = CashiersServiceGetV1CashiersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCashiersServiceGetV1CashiersKey = "CashiersServiceGetV1Cashiers";
export const UseCashiersServiceGetV1CashiersKeyFn = ({ date, officeId, staffId, tellerId }: {
  date?: string;
  officeId?: number;
  staffId?: number;
  tellerId?: number;
} = {}, queryKey?: Array<unknown>) => [useCashiersServiceGetV1CashiersKey, ...(queryKey ?? [{ date, officeId, staffId, tellerId }])];
export type CashierJournalsServiceGetV1CashiersjournalDefaultResponse = Awaited<ReturnType<typeof CashierJournalsService.getV1Cashiersjournal>>;
export type CashierJournalsServiceGetV1CashiersjournalQueryResult<TData = CashierJournalsServiceGetV1CashiersjournalDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCashierJournalsServiceGetV1CashiersjournalKey = "CashierJournalsServiceGetV1Cashiersjournal";
export const UseCashierJournalsServiceGetV1CashiersjournalKeyFn = ({ cashierId, dateRange, officeId, tellerId }: {
  cashierId?: number;
  dateRange?: string;
  officeId?: number;
  tellerId?: number;
} = {}, queryKey?: Array<unknown>) => [useCashierJournalsServiceGetV1CashiersjournalKey, ...(queryKey ?? [{ cashierId, dateRange, officeId, tellerId }])];
export type CentersServiceGetV1CentersDefaultResponse = Awaited<ReturnType<typeof CentersService.getV1Centers>>;
export type CentersServiceGetV1CentersQueryResult<TData = CentersServiceGetV1CentersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCentersServiceGetV1CentersKey = "CentersServiceGetV1Centers";
export const UseCentersServiceGetV1CentersKeyFn = ({ dateFormat, externalId, limit, locale, meetingDate, name, officeId, offset, orderBy, paged, sortOrder, staffId, underHierarchy }: {
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
} = {}, queryKey?: Array<unknown>) => [useCentersServiceGetV1CentersKey, ...(queryKey ?? [{ dateFormat, externalId, limit, locale, meetingDate, name, officeId, offset, orderBy, paged, sortOrder, staffId, underHierarchy }])];
export type CentersServiceGetV1CentersDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof CentersService.getV1CentersDownloadtemplate>>;
export type CentersServiceGetV1CentersDownloadtemplateQueryResult<TData = CentersServiceGetV1CentersDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCentersServiceGetV1CentersDownloadtemplateKey = "CentersServiceGetV1CentersDownloadtemplate";
export const UseCentersServiceGetV1CentersDownloadtemplateKeyFn = ({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: Array<unknown>) => [useCentersServiceGetV1CentersDownloadtemplateKey, ...(queryKey ?? [{ dateFormat, officeId, staffId }])];
export type CentersServiceGetV1CentersTemplateDefaultResponse = Awaited<ReturnType<typeof CentersService.getV1CentersTemplate>>;
export type CentersServiceGetV1CentersTemplateQueryResult<TData = CentersServiceGetV1CentersTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCentersServiceGetV1CentersTemplateKey = "CentersServiceGetV1CentersTemplate";
export const UseCentersServiceGetV1CentersTemplateKeyFn = ({ command, officeId, staffInSelectedOfficeOnly }: {
  command?: string;
  officeId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: Array<unknown>) => [useCentersServiceGetV1CentersTemplateKey, ...(queryKey ?? [{ command, officeId, staffInSelectedOfficeOnly }])];
export type CentersServiceGetV1CentersByCenterIdDefaultResponse = Awaited<ReturnType<typeof CentersService.getV1CentersByCenterId>>;
export type CentersServiceGetV1CentersByCenterIdQueryResult<TData = CentersServiceGetV1CentersByCenterIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCentersServiceGetV1CentersByCenterIdKey = "CentersServiceGetV1CentersByCenterId";
export const UseCentersServiceGetV1CentersByCenterIdKeyFn = ({ centerId, staffInSelectedOfficeOnly }: {
  centerId: number;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: Array<unknown>) => [useCentersServiceGetV1CentersByCenterIdKey, ...(queryKey ?? [{ centerId, staffInSelectedOfficeOnly }])];
export type CentersServiceGetV1CentersByCenterIdAccountsDefaultResponse = Awaited<ReturnType<typeof CentersService.getV1CentersByCenterIdAccounts>>;
export type CentersServiceGetV1CentersByCenterIdAccountsQueryResult<TData = CentersServiceGetV1CentersByCenterIdAccountsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCentersServiceGetV1CentersByCenterIdAccountsKey = "CentersServiceGetV1CentersByCenterIdAccounts";
export const UseCentersServiceGetV1CentersByCenterIdAccountsKeyFn = ({ centerId }: {
  centerId: number;
}, queryKey?: Array<unknown>) => [useCentersServiceGetV1CentersByCenterIdAccountsKey, ...(queryKey ?? [{ centerId }])];
export type ChargesServiceGetV1ChargesDefaultResponse = Awaited<ReturnType<typeof ChargesService.getV1Charges>>;
export type ChargesServiceGetV1ChargesQueryResult<TData = ChargesServiceGetV1ChargesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useChargesServiceGetV1ChargesKey = "ChargesServiceGetV1Charges";
export const UseChargesServiceGetV1ChargesKeyFn = (queryKey?: Array<unknown>) => [useChargesServiceGetV1ChargesKey, ...(queryKey ?? [])];
export type ChargesServiceGetV1ChargesTemplateDefaultResponse = Awaited<ReturnType<typeof ChargesService.getV1ChargesTemplate>>;
export type ChargesServiceGetV1ChargesTemplateQueryResult<TData = ChargesServiceGetV1ChargesTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useChargesServiceGetV1ChargesTemplateKey = "ChargesServiceGetV1ChargesTemplate";
export const UseChargesServiceGetV1ChargesTemplateKeyFn = (queryKey?: Array<unknown>) => [useChargesServiceGetV1ChargesTemplateKey, ...(queryKey ?? [])];
export type ChargesServiceGetV1ChargesByChargeIdDefaultResponse = Awaited<ReturnType<typeof ChargesService.getV1ChargesByChargeId>>;
export type ChargesServiceGetV1ChargesByChargeIdQueryResult<TData = ChargesServiceGetV1ChargesByChargeIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useChargesServiceGetV1ChargesByChargeIdKey = "ChargesServiceGetV1ChargesByChargeId";
export const UseChargesServiceGetV1ChargesByChargeIdKeyFn = ({ chargeId }: {
  chargeId: number;
}, queryKey?: Array<unknown>) => [useChargesServiceGetV1ChargesByChargeIdKey, ...(queryKey ?? [{ chargeId }])];
export type ClientsAddressServiceGetV1ClientAddressesTemplateDefaultResponse = Awaited<ReturnType<typeof ClientsAddressService.getV1ClientAddressesTemplate>>;
export type ClientsAddressServiceGetV1ClientAddressesTemplateQueryResult<TData = ClientsAddressServiceGetV1ClientAddressesTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientsAddressServiceGetV1ClientAddressesTemplateKey = "ClientsAddressServiceGetV1ClientAddressesTemplate";
export const UseClientsAddressServiceGetV1ClientAddressesTemplateKeyFn = (queryKey?: Array<unknown>) => [useClientsAddressServiceGetV1ClientAddressesTemplateKey, ...(queryKey ?? [])];
export type ClientsAddressServiceGetV1ClientByClientidAddressesDefaultResponse = Awaited<ReturnType<typeof ClientsAddressService.getV1ClientByClientidAddresses>>;
export type ClientsAddressServiceGetV1ClientByClientidAddressesQueryResult<TData = ClientsAddressServiceGetV1ClientByClientidAddressesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientsAddressServiceGetV1ClientByClientidAddressesKey = "ClientsAddressServiceGetV1ClientByClientidAddresses";
export const UseClientsAddressServiceGetV1ClientByClientidAddressesKeyFn = ({ clientid, status, type }: {
  clientid: number;
  status?: string;
  type?: number;
}, queryKey?: Array<unknown>) => [useClientsAddressServiceGetV1ClientByClientidAddressesKey, ...(queryKey ?? [{ clientid, status, type }])];
export type ClientServiceGetV1ClientsDefaultResponse = Awaited<ReturnType<typeof ClientService.getV1Clients>>;
export type ClientServiceGetV1ClientsQueryResult<TData = ClientServiceGetV1ClientsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientServiceGetV1ClientsKey = "ClientServiceGetV1Clients";
export const UseClientServiceGetV1ClientsKeyFn = ({ displayName, externalId, firstName, lastName, legalForm, limit, officeId, offset, orderBy, orphansOnly, sortOrder, status, underHierarchy }: {
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
} = {}, queryKey?: Array<unknown>) => [useClientServiceGetV1ClientsKey, ...(queryKey ?? [{ displayName, externalId, firstName, lastName, legalForm, limit, officeId, offset, orderBy, orphansOnly, sortOrder, status, underHierarchy }])];
export type ClientServiceGetV1ClientsDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof ClientService.getV1ClientsDownloadtemplate>>;
export type ClientServiceGetV1ClientsDownloadtemplateQueryResult<TData = ClientServiceGetV1ClientsDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientServiceGetV1ClientsDownloadtemplateKey = "ClientServiceGetV1ClientsDownloadtemplate";
export const UseClientServiceGetV1ClientsDownloadtemplateKeyFn = ({ dateFormat, legalFormType, officeId, staffId }: {
  dateFormat?: string;
  legalFormType?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: Array<unknown>) => [useClientServiceGetV1ClientsDownloadtemplateKey, ...(queryKey ?? [{ dateFormat, legalFormType, officeId, staffId }])];
export type ClientServiceGetV1ClientsExternalIdByExternalIdDefaultResponse = Awaited<ReturnType<typeof ClientService.getV1ClientsExternalIdByExternalId>>;
export type ClientServiceGetV1ClientsExternalIdByExternalIdQueryResult<TData = ClientServiceGetV1ClientsExternalIdByExternalIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientServiceGetV1ClientsExternalIdByExternalIdKey = "ClientServiceGetV1ClientsExternalIdByExternalId";
export const UseClientServiceGetV1ClientsExternalIdByExternalIdKeyFn = ({ externalId, staffInSelectedOfficeOnly }: {
  externalId: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: Array<unknown>) => [useClientServiceGetV1ClientsExternalIdByExternalIdKey, ...(queryKey ?? [{ externalId, staffInSelectedOfficeOnly }])];
export type ClientServiceGetV1ClientsExternalIdByExternalIdAccountsDefaultResponse = Awaited<ReturnType<typeof ClientService.getV1ClientsExternalIdByExternalIdAccounts>>;
export type ClientServiceGetV1ClientsExternalIdByExternalIdAccountsQueryResult<TData = ClientServiceGetV1ClientsExternalIdByExternalIdAccountsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientServiceGetV1ClientsExternalIdByExternalIdAccountsKey = "ClientServiceGetV1ClientsExternalIdByExternalIdAccounts";
export const UseClientServiceGetV1ClientsExternalIdByExternalIdAccountsKeyFn = ({ externalId }: {
  externalId: string;
}, queryKey?: Array<unknown>) => [useClientServiceGetV1ClientsExternalIdByExternalIdAccountsKey, ...(queryKey ?? [{ externalId }])];
export type ClientServiceGetV1ClientsExternalIdByExternalIdObligeedetailsDefaultResponse = Awaited<ReturnType<typeof ClientService.getV1ClientsExternalIdByExternalIdObligeedetails>>;
export type ClientServiceGetV1ClientsExternalIdByExternalIdObligeedetailsQueryResult<TData = ClientServiceGetV1ClientsExternalIdByExternalIdObligeedetailsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientServiceGetV1ClientsExternalIdByExternalIdObligeedetailsKey = "ClientServiceGetV1ClientsExternalIdByExternalIdObligeedetails";
export const UseClientServiceGetV1ClientsExternalIdByExternalIdObligeedetailsKeyFn = ({ externalId }: {
  externalId: string;
}, queryKey?: Array<unknown>) => [useClientServiceGetV1ClientsExternalIdByExternalIdObligeedetailsKey, ...(queryKey ?? [{ externalId }])];
export type ClientServiceGetV1ClientsExternalIdByExternalIdTransferproposaldateDefaultResponse = Awaited<ReturnType<typeof ClientService.getV1ClientsExternalIdByExternalIdTransferproposaldate>>;
export type ClientServiceGetV1ClientsExternalIdByExternalIdTransferproposaldateQueryResult<TData = ClientServiceGetV1ClientsExternalIdByExternalIdTransferproposaldateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientServiceGetV1ClientsExternalIdByExternalIdTransferproposaldateKey = "ClientServiceGetV1ClientsExternalIdByExternalIdTransferproposaldate";
export const UseClientServiceGetV1ClientsExternalIdByExternalIdTransferproposaldateKeyFn = ({ externalId }: {
  externalId: string;
}, queryKey?: Array<unknown>) => [useClientServiceGetV1ClientsExternalIdByExternalIdTransferproposaldateKey, ...(queryKey ?? [{ externalId }])];
export type ClientServiceGetV1ClientsTemplateDefaultResponse = Awaited<ReturnType<typeof ClientService.getV1ClientsTemplate>>;
export type ClientServiceGetV1ClientsTemplateQueryResult<TData = ClientServiceGetV1ClientsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientServiceGetV1ClientsTemplateKey = "ClientServiceGetV1ClientsTemplate";
export const UseClientServiceGetV1ClientsTemplateKeyFn = ({ commandParam, officeId, staffInSelectedOfficeOnly }: {
  commandParam?: string;
  officeId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: Array<unknown>) => [useClientServiceGetV1ClientsTemplateKey, ...(queryKey ?? [{ commandParam, officeId, staffInSelectedOfficeOnly }])];
export type ClientServiceGetV1ClientsByClientIdDefaultResponse = Awaited<ReturnType<typeof ClientService.getV1ClientsByClientId>>;
export type ClientServiceGetV1ClientsByClientIdQueryResult<TData = ClientServiceGetV1ClientsByClientIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientServiceGetV1ClientsByClientIdKey = "ClientServiceGetV1ClientsByClientId";
export const UseClientServiceGetV1ClientsByClientIdKeyFn = ({ clientId, staffInSelectedOfficeOnly }: {
  clientId: number;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: Array<unknown>) => [useClientServiceGetV1ClientsByClientIdKey, ...(queryKey ?? [{ clientId, staffInSelectedOfficeOnly }])];
export type ClientServiceGetV1ClientsByClientIdAccountsDefaultResponse = Awaited<ReturnType<typeof ClientService.getV1ClientsByClientIdAccounts>>;
export type ClientServiceGetV1ClientsByClientIdAccountsQueryResult<TData = ClientServiceGetV1ClientsByClientIdAccountsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientServiceGetV1ClientsByClientIdAccountsKey = "ClientServiceGetV1ClientsByClientIdAccounts";
export const UseClientServiceGetV1ClientsByClientIdAccountsKeyFn = ({ clientId }: {
  clientId: number;
}, queryKey?: Array<unknown>) => [useClientServiceGetV1ClientsByClientIdAccountsKey, ...(queryKey ?? [{ clientId }])];
export type ClientServiceGetV1ClientsByClientIdObligeedetailsDefaultResponse = Awaited<ReturnType<typeof ClientService.getV1ClientsByClientIdObligeedetails>>;
export type ClientServiceGetV1ClientsByClientIdObligeedetailsQueryResult<TData = ClientServiceGetV1ClientsByClientIdObligeedetailsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientServiceGetV1ClientsByClientIdObligeedetailsKey = "ClientServiceGetV1ClientsByClientIdObligeedetails";
export const UseClientServiceGetV1ClientsByClientIdObligeedetailsKeyFn = ({ clientId }: {
  clientId: number;
}, queryKey?: Array<unknown>) => [useClientServiceGetV1ClientsByClientIdObligeedetailsKey, ...(queryKey ?? [{ clientId }])];
export type ClientServiceGetV1ClientsByClientIdTransferproposaldateDefaultResponse = Awaited<ReturnType<typeof ClientService.getV1ClientsByClientIdTransferproposaldate>>;
export type ClientServiceGetV1ClientsByClientIdTransferproposaldateQueryResult<TData = ClientServiceGetV1ClientsByClientIdTransferproposaldateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientServiceGetV1ClientsByClientIdTransferproposaldateKey = "ClientServiceGetV1ClientsByClientIdTransferproposaldate";
export const UseClientServiceGetV1ClientsByClientIdTransferproposaldateKeyFn = ({ clientId }: {
  clientId: number;
}, queryKey?: Array<unknown>) => [useClientServiceGetV1ClientsByClientIdTransferproposaldateKey, ...(queryKey ?? [{ clientId }])];
export type ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsDefaultResponse = Awaited<ReturnType<typeof ClientTransactionService.getV1ClientsExternalIdByClientExternalIdTransactions>>;
export type ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsQueryResult<TData = ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsKey = "ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactions";
export const UseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsKeyFn = ({ clientExternalId, limit, offset }: {
  clientExternalId: string;
  limit?: number;
  offset?: number;
}, queryKey?: Array<unknown>) => [useClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsKey, ...(queryKey ?? [{ clientExternalId, limit, offset }])];
export type ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalIdDefaultResponse = Awaited<ReturnType<typeof ClientTransactionService.getV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalId>>;
export type ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalIdQueryResult<TData = ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalIdKey = "ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalId";
export const UseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalIdKeyFn = ({ clientExternalId, transactionExternalId }: {
  clientExternalId: string;
  transactionExternalId: string;
}, queryKey?: Array<unknown>) => [useClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalIdKey, ...(queryKey ?? [{ clientExternalId, transactionExternalId }])];
export type ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsByTransactionIdDefaultResponse = Awaited<ReturnType<typeof ClientTransactionService.getV1ClientsExternalIdByClientExternalIdTransactionsByTransactionId>>;
export type ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsByTransactionIdQueryResult<TData = ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsByTransactionIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsByTransactionIdKey = "ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsByTransactionId";
export const UseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsByTransactionIdKeyFn = ({ clientExternalId, transactionId }: {
  clientExternalId: string;
  transactionId: number;
}, queryKey?: Array<unknown>) => [useClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsByTransactionIdKey, ...(queryKey ?? [{ clientExternalId, transactionId }])];
export type ClientTransactionServiceGetV1ClientsByClientIdTransactionsDefaultResponse = Awaited<ReturnType<typeof ClientTransactionService.getV1ClientsByClientIdTransactions>>;
export type ClientTransactionServiceGetV1ClientsByClientIdTransactionsQueryResult<TData = ClientTransactionServiceGetV1ClientsByClientIdTransactionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientTransactionServiceGetV1ClientsByClientIdTransactionsKey = "ClientTransactionServiceGetV1ClientsByClientIdTransactions";
export const UseClientTransactionServiceGetV1ClientsByClientIdTransactionsKeyFn = ({ clientId, limit, offset }: {
  clientId: number;
  limit?: number;
  offset?: number;
}, queryKey?: Array<unknown>) => [useClientTransactionServiceGetV1ClientsByClientIdTransactionsKey, ...(queryKey ?? [{ clientId, limit, offset }])];
export type ClientTransactionServiceGetV1ClientsByClientIdTransactionsExternalIdByTransactionExternalIdDefaultResponse = Awaited<ReturnType<typeof ClientTransactionService.getV1ClientsByClientIdTransactionsExternalIdByTransactionExternalId>>;
export type ClientTransactionServiceGetV1ClientsByClientIdTransactionsExternalIdByTransactionExternalIdQueryResult<TData = ClientTransactionServiceGetV1ClientsByClientIdTransactionsExternalIdByTransactionExternalIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientTransactionServiceGetV1ClientsByClientIdTransactionsExternalIdByTransactionExternalIdKey = "ClientTransactionServiceGetV1ClientsByClientIdTransactionsExternalIdByTransactionExternalId";
export const UseClientTransactionServiceGetV1ClientsByClientIdTransactionsExternalIdByTransactionExternalIdKeyFn = ({ clientId, transactionExternalId }: {
  clientId: number;
  transactionExternalId: string;
}, queryKey?: Array<unknown>) => [useClientTransactionServiceGetV1ClientsByClientIdTransactionsExternalIdByTransactionExternalIdKey, ...(queryKey ?? [{ clientId, transactionExternalId }])];
export type ClientTransactionServiceGetV1ClientsByClientIdTransactionsByTransactionIdDefaultResponse = Awaited<ReturnType<typeof ClientTransactionService.getV1ClientsByClientIdTransactionsByTransactionId>>;
export type ClientTransactionServiceGetV1ClientsByClientIdTransactionsByTransactionIdQueryResult<TData = ClientTransactionServiceGetV1ClientsByClientIdTransactionsByTransactionIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientTransactionServiceGetV1ClientsByClientIdTransactionsByTransactionIdKey = "ClientTransactionServiceGetV1ClientsByClientIdTransactionsByTransactionId";
export const UseClientTransactionServiceGetV1ClientsByClientIdTransactionsByTransactionIdKeyFn = ({ clientId, transactionId }: {
  clientId: number;
  transactionId: number;
}, queryKey?: Array<unknown>) => [useClientTransactionServiceGetV1ClientsByClientIdTransactionsByTransactionIdKey, ...(queryKey ?? [{ clientId, transactionId }])];
export type ClientChargesServiceGetV1ClientsByClientIdChargesDefaultResponse = Awaited<ReturnType<typeof ClientChargesService.getV1ClientsByClientIdCharges>>;
export type ClientChargesServiceGetV1ClientsByClientIdChargesQueryResult<TData = ClientChargesServiceGetV1ClientsByClientIdChargesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientChargesServiceGetV1ClientsByClientIdChargesKey = "ClientChargesServiceGetV1ClientsByClientIdCharges";
export const UseClientChargesServiceGetV1ClientsByClientIdChargesKeyFn = ({ chargeStatus, clientId, limit, offset, pendingPayment }: {
  chargeStatus?: string;
  clientId: number;
  limit?: number;
  offset?: number;
  pendingPayment?: boolean;
}, queryKey?: Array<unknown>) => [useClientChargesServiceGetV1ClientsByClientIdChargesKey, ...(queryKey ?? [{ chargeStatus, clientId, limit, offset, pendingPayment }])];
export type ClientChargesServiceGetV1ClientsByClientIdChargesTemplateDefaultResponse = Awaited<ReturnType<typeof ClientChargesService.getV1ClientsByClientIdChargesTemplate>>;
export type ClientChargesServiceGetV1ClientsByClientIdChargesTemplateQueryResult<TData = ClientChargesServiceGetV1ClientsByClientIdChargesTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientChargesServiceGetV1ClientsByClientIdChargesTemplateKey = "ClientChargesServiceGetV1ClientsByClientIdChargesTemplate";
export const UseClientChargesServiceGetV1ClientsByClientIdChargesTemplateKeyFn = ({ clientId }: {
  clientId: number;
}, queryKey?: Array<unknown>) => [useClientChargesServiceGetV1ClientsByClientIdChargesTemplateKey, ...(queryKey ?? [{ clientId }])];
export type ClientChargesServiceGetV1ClientsByClientIdChargesByChargeIdDefaultResponse = Awaited<ReturnType<typeof ClientChargesService.getV1ClientsByClientIdChargesByChargeId>>;
export type ClientChargesServiceGetV1ClientsByClientIdChargesByChargeIdQueryResult<TData = ClientChargesServiceGetV1ClientsByClientIdChargesByChargeIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientChargesServiceGetV1ClientsByClientIdChargesByChargeIdKey = "ClientChargesServiceGetV1ClientsByClientIdChargesByChargeId";
export const UseClientChargesServiceGetV1ClientsByClientIdChargesByChargeIdKeyFn = ({ chargeId, clientId }: {
  chargeId: number;
  clientId: number;
}, queryKey?: Array<unknown>) => [useClientChargesServiceGetV1ClientsByClientIdChargesByChargeIdKey, ...(queryKey ?? [{ chargeId, clientId }])];
export type ClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsDefaultResponse = Awaited<ReturnType<typeof ClientCollateralManagementService.getV1ClientsByClientIdCollaterals>>;
export type ClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsQueryResult<TData = ClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsKey = "ClientCollateralManagementServiceGetV1ClientsByClientIdCollaterals";
export const UseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsKeyFn = ({ clientId, prodId }: {
  clientId: number;
  prodId?: number;
}, queryKey?: Array<unknown>) => [useClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsKey, ...(queryKey ?? [{ clientId, prodId }])];
export type ClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsTemplateDefaultResponse = Awaited<ReturnType<typeof ClientCollateralManagementService.getV1ClientsByClientIdCollateralsTemplate>>;
export type ClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsTemplateQueryResult<TData = ClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsTemplateKey = "ClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsTemplate";
export const UseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsTemplateKeyFn = ({ clientId }: {
  clientId: number;
}, queryKey?: Array<unknown>) => [useClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsTemplateKey, ...(queryKey ?? [{ clientId }])];
export type ClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsByClientCollateralIdDefaultResponse = Awaited<ReturnType<typeof ClientCollateralManagementService.getV1ClientsByClientIdCollateralsByClientCollateralId>>;
export type ClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsByClientCollateralIdQueryResult<TData = ClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsByClientCollateralIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsByClientCollateralIdKey = "ClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsByClientCollateralId";
export const UseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsByClientCollateralIdKeyFn = ({ clientCollateralId, clientId }: {
  clientCollateralId: number;
  clientId: number;
}, queryKey?: Array<unknown>) => [useClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsByClientCollateralIdKey, ...(queryKey ?? [{ clientCollateralId, clientId }])];
export type ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersDefaultResponse = Awaited<ReturnType<typeof ClientFamilyMemberService.getV1ClientsByClientIdFamilymembers>>;
export type ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersQueryResult<TData = ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersKey = "ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembers";
export const UseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersKeyFn = ({ clientId }: {
  clientId: number;
}, queryKey?: Array<unknown>) => [useClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersKey, ...(queryKey ?? [{ clientId }])];
export type ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersTemplateDefaultResponse = Awaited<ReturnType<typeof ClientFamilyMemberService.getV1ClientsByClientIdFamilymembersTemplate>>;
export type ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersTemplateQueryResult<TData = ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersTemplateKey = "ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersTemplate";
export const UseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersTemplateKeyFn = ({ clientId }: {
  clientId: number;
}, queryKey?: Array<unknown>) => [useClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersTemplateKey, ...(queryKey ?? [{ clientId }])];
export type ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersByFamilyMemberIdDefaultResponse = Awaited<ReturnType<typeof ClientFamilyMemberService.getV1ClientsByClientIdFamilymembersByFamilyMemberId>>;
export type ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersByFamilyMemberIdQueryResult<TData = ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersByFamilyMemberIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersByFamilyMemberIdKey = "ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersByFamilyMemberId";
export const UseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersByFamilyMemberIdKeyFn = ({ clientId, familyMemberId }: {
  clientId: number;
  familyMemberId: number;
}, queryKey?: Array<unknown>) => [useClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersByFamilyMemberIdKey, ...(queryKey ?? [{ clientId, familyMemberId }])];
export type ClientIdentifierServiceGetV1ClientsByClientIdIdentifiersDefaultResponse = Awaited<ReturnType<typeof ClientIdentifierService.getV1ClientsByClientIdIdentifiers>>;
export type ClientIdentifierServiceGetV1ClientsByClientIdIdentifiersQueryResult<TData = ClientIdentifierServiceGetV1ClientsByClientIdIdentifiersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientIdentifierServiceGetV1ClientsByClientIdIdentifiersKey = "ClientIdentifierServiceGetV1ClientsByClientIdIdentifiers";
export const UseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersKeyFn = ({ clientId }: {
  clientId: number;
}, queryKey?: Array<unknown>) => [useClientIdentifierServiceGetV1ClientsByClientIdIdentifiersKey, ...(queryKey ?? [{ clientId }])];
export type ClientIdentifierServiceGetV1ClientsByClientIdIdentifiersTemplateDefaultResponse = Awaited<ReturnType<typeof ClientIdentifierService.getV1ClientsByClientIdIdentifiersTemplate>>;
export type ClientIdentifierServiceGetV1ClientsByClientIdIdentifiersTemplateQueryResult<TData = ClientIdentifierServiceGetV1ClientsByClientIdIdentifiersTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientIdentifierServiceGetV1ClientsByClientIdIdentifiersTemplateKey = "ClientIdentifierServiceGetV1ClientsByClientIdIdentifiersTemplate";
export const UseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersTemplateKeyFn = ({ clientId }: {
  clientId: number;
}, queryKey?: Array<unknown>) => [useClientIdentifierServiceGetV1ClientsByClientIdIdentifiersTemplateKey, ...(queryKey ?? [{ clientId }])];
export type ClientIdentifierServiceGetV1ClientsByClientIdIdentifiersByIdentifierIdDefaultResponse = Awaited<ReturnType<typeof ClientIdentifierService.getV1ClientsByClientIdIdentifiersByIdentifierId>>;
export type ClientIdentifierServiceGetV1ClientsByClientIdIdentifiersByIdentifierIdQueryResult<TData = ClientIdentifierServiceGetV1ClientsByClientIdIdentifiersByIdentifierIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useClientIdentifierServiceGetV1ClientsByClientIdIdentifiersByIdentifierIdKey = "ClientIdentifierServiceGetV1ClientsByClientIdIdentifiersByIdentifierId";
export const UseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersByIdentifierIdKeyFn = ({ clientId, identifierId }: {
  clientId: number;
  identifierId: number;
}, queryKey?: Array<unknown>) => [useClientIdentifierServiceGetV1ClientsByClientIdIdentifiersByIdentifierIdKey, ...(queryKey ?? [{ clientId, identifierId }])];
export type CodesServiceGetV1CodesDefaultResponse = Awaited<ReturnType<typeof CodesService.getV1Codes>>;
export type CodesServiceGetV1CodesQueryResult<TData = CodesServiceGetV1CodesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCodesServiceGetV1CodesKey = "CodesServiceGetV1Codes";
export const UseCodesServiceGetV1CodesKeyFn = (queryKey?: Array<unknown>) => [useCodesServiceGetV1CodesKey, ...(queryKey ?? [])];
export type CodesServiceGetV1CodesByCodeIdDefaultResponse = Awaited<ReturnType<typeof CodesService.getV1CodesByCodeId>>;
export type CodesServiceGetV1CodesByCodeIdQueryResult<TData = CodesServiceGetV1CodesByCodeIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCodesServiceGetV1CodesByCodeIdKey = "CodesServiceGetV1CodesByCodeId";
export const UseCodesServiceGetV1CodesByCodeIdKeyFn = ({ codeId }: {
  codeId: number;
}, queryKey?: Array<unknown>) => [useCodesServiceGetV1CodesByCodeIdKey, ...(queryKey ?? [{ codeId }])];
export type CodeValuesServiceGetV1CodesByCodeIdCodevaluesDefaultResponse = Awaited<ReturnType<typeof CodeValuesService.getV1CodesByCodeIdCodevalues>>;
export type CodeValuesServiceGetV1CodesByCodeIdCodevaluesQueryResult<TData = CodeValuesServiceGetV1CodesByCodeIdCodevaluesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCodeValuesServiceGetV1CodesByCodeIdCodevaluesKey = "CodeValuesServiceGetV1CodesByCodeIdCodevalues";
export const UseCodeValuesServiceGetV1CodesByCodeIdCodevaluesKeyFn = ({ codeId }: {
  codeId: number;
}, queryKey?: Array<unknown>) => [useCodeValuesServiceGetV1CodesByCodeIdCodevaluesKey, ...(queryKey ?? [{ codeId }])];
export type CodeValuesServiceGetV1CodesByCodeIdCodevaluesByCodeValueIdDefaultResponse = Awaited<ReturnType<typeof CodeValuesService.getV1CodesByCodeIdCodevaluesByCodeValueId>>;
export type CodeValuesServiceGetV1CodesByCodeIdCodevaluesByCodeValueIdQueryResult<TData = CodeValuesServiceGetV1CodesByCodeIdCodevaluesByCodeValueIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCodeValuesServiceGetV1CodesByCodeIdCodevaluesByCodeValueIdKey = "CodeValuesServiceGetV1CodesByCodeIdCodevaluesByCodeValueId";
export const UseCodeValuesServiceGetV1CodesByCodeIdCodevaluesByCodeValueIdKeyFn = ({ codeId, codeValueId }: {
  codeId: number;
  codeValueId: number;
}, queryKey?: Array<unknown>) => [useCodeValuesServiceGetV1CodesByCodeIdCodevaluesByCodeValueIdKey, ...(queryKey ?? [{ codeId, codeValueId }])];
export type CollateralManagementServiceGetV1CollateralManagementDefaultResponse = Awaited<ReturnType<typeof CollateralManagementService.getV1CollateralManagement>>;
export type CollateralManagementServiceGetV1CollateralManagementQueryResult<TData = CollateralManagementServiceGetV1CollateralManagementDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCollateralManagementServiceGetV1CollateralManagementKey = "CollateralManagementServiceGetV1CollateralManagement";
export const UseCollateralManagementServiceGetV1CollateralManagementKeyFn = (queryKey?: Array<unknown>) => [useCollateralManagementServiceGetV1CollateralManagementKey, ...(queryKey ?? [])];
export type CollateralManagementServiceGetV1CollateralManagementTemplateDefaultResponse = Awaited<ReturnType<typeof CollateralManagementService.getV1CollateralManagementTemplate>>;
export type CollateralManagementServiceGetV1CollateralManagementTemplateQueryResult<TData = CollateralManagementServiceGetV1CollateralManagementTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCollateralManagementServiceGetV1CollateralManagementTemplateKey = "CollateralManagementServiceGetV1CollateralManagementTemplate";
export const UseCollateralManagementServiceGetV1CollateralManagementTemplateKeyFn = (queryKey?: Array<unknown>) => [useCollateralManagementServiceGetV1CollateralManagementTemplateKey, ...(queryKey ?? [])];
export type CollateralManagementServiceGetV1CollateralManagementByCollateralIdDefaultResponse = Awaited<ReturnType<typeof CollateralManagementService.getV1CollateralManagementByCollateralId>>;
export type CollateralManagementServiceGetV1CollateralManagementByCollateralIdQueryResult<TData = CollateralManagementServiceGetV1CollateralManagementByCollateralIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCollateralManagementServiceGetV1CollateralManagementByCollateralIdKey = "CollateralManagementServiceGetV1CollateralManagementByCollateralId";
export const UseCollateralManagementServiceGetV1CollateralManagementByCollateralIdKeyFn = ({ collateralId }: {
  collateralId: number;
}, queryKey?: Array<unknown>) => [useCollateralManagementServiceGetV1CollateralManagementByCollateralIdKey, ...(queryKey ?? [{ collateralId }])];
export type GlobalConfigurationServiceGetV1ConfigurationsDefaultResponse = Awaited<ReturnType<typeof GlobalConfigurationService.getV1Configurations>>;
export type GlobalConfigurationServiceGetV1ConfigurationsQueryResult<TData = GlobalConfigurationServiceGetV1ConfigurationsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGlobalConfigurationServiceGetV1ConfigurationsKey = "GlobalConfigurationServiceGetV1Configurations";
export const UseGlobalConfigurationServiceGetV1ConfigurationsKeyFn = ({ survey }: {
  survey?: boolean;
} = {}, queryKey?: Array<unknown>) => [useGlobalConfigurationServiceGetV1ConfigurationsKey, ...(queryKey ?? [{ survey }])];
export type GlobalConfigurationServiceGetV1ConfigurationsNameByNameDefaultResponse = Awaited<ReturnType<typeof GlobalConfigurationService.getV1ConfigurationsNameByName>>;
export type GlobalConfigurationServiceGetV1ConfigurationsNameByNameQueryResult<TData = GlobalConfigurationServiceGetV1ConfigurationsNameByNameDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGlobalConfigurationServiceGetV1ConfigurationsNameByNameKey = "GlobalConfigurationServiceGetV1ConfigurationsNameByName";
export const UseGlobalConfigurationServiceGetV1ConfigurationsNameByNameKeyFn = ({ name }: {
  name: string;
}, queryKey?: Array<unknown>) => [useGlobalConfigurationServiceGetV1ConfigurationsNameByNameKey, ...(queryKey ?? [{ name }])];
export type GlobalConfigurationServiceGetV1ConfigurationsByConfigIdDefaultResponse = Awaited<ReturnType<typeof GlobalConfigurationService.getV1ConfigurationsByConfigId>>;
export type GlobalConfigurationServiceGetV1ConfigurationsByConfigIdQueryResult<TData = GlobalConfigurationServiceGetV1ConfigurationsByConfigIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGlobalConfigurationServiceGetV1ConfigurationsByConfigIdKey = "GlobalConfigurationServiceGetV1ConfigurationsByConfigId";
export const UseGlobalConfigurationServiceGetV1ConfigurationsByConfigIdKeyFn = ({ configId }: {
  configId: number;
}, queryKey?: Array<unknown>) => [useGlobalConfigurationServiceGetV1ConfigurationsByConfigIdKey, ...(queryKey ?? [{ configId }])];
export type CurrencyServiceGetV1CurrenciesDefaultResponse = Awaited<ReturnType<typeof CurrencyService.getV1Currencies>>;
export type CurrencyServiceGetV1CurrenciesQueryResult<TData = CurrencyServiceGetV1CurrenciesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCurrencyServiceGetV1CurrenciesKey = "CurrencyServiceGetV1Currencies";
export const UseCurrencyServiceGetV1CurrenciesKeyFn = (queryKey?: Array<unknown>) => [useCurrencyServiceGetV1CurrenciesKey, ...(queryKey ?? [])];
export type DataTablesServiceGetV1DatatablesDefaultResponse = Awaited<ReturnType<typeof DataTablesService.getV1Datatables>>;
export type DataTablesServiceGetV1DatatablesQueryResult<TData = DataTablesServiceGetV1DatatablesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDataTablesServiceGetV1DatatablesKey = "DataTablesServiceGetV1Datatables";
export const UseDataTablesServiceGetV1DatatablesKeyFn = ({ apptable }: {
  apptable?: string;
} = {}, queryKey?: Array<unknown>) => [useDataTablesServiceGetV1DatatablesKey, ...(queryKey ?? [{ apptable }])];
export type DataTablesServiceGetV1DatatablesByDatatableDefaultResponse = Awaited<ReturnType<typeof DataTablesService.getV1DatatablesByDatatable>>;
export type DataTablesServiceGetV1DatatablesByDatatableQueryResult<TData = DataTablesServiceGetV1DatatablesByDatatableDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDataTablesServiceGetV1DatatablesByDatatableKey = "DataTablesServiceGetV1DatatablesByDatatable";
export const UseDataTablesServiceGetV1DatatablesByDatatableKeyFn = ({ datatable }: {
  datatable: string;
}, queryKey?: Array<unknown>) => [useDataTablesServiceGetV1DatatablesByDatatableKey, ...(queryKey ?? [{ datatable }])];
export type DataTablesServiceGetV1DatatablesByDatatableQueryDefaultResponse = Awaited<ReturnType<typeof DataTablesService.getV1DatatablesByDatatableQuery>>;
export type DataTablesServiceGetV1DatatablesByDatatableQueryQueryResult<TData = DataTablesServiceGetV1DatatablesByDatatableQueryDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDataTablesServiceGetV1DatatablesByDatatableQueryKey = "DataTablesServiceGetV1DatatablesByDatatableQuery";
export const UseDataTablesServiceGetV1DatatablesByDatatableQueryKeyFn = ({ columnFilter, datatable, resultColumns, valueFilter }: {
  columnFilter?: string;
  datatable: string;
  resultColumns?: string;
  valueFilter?: string;
}, queryKey?: Array<unknown>) => [useDataTablesServiceGetV1DatatablesByDatatableQueryKey, ...(queryKey ?? [{ columnFilter, datatable, resultColumns, valueFilter }])];
export type DataTablesServiceGetV1DatatablesByDatatableByApptableIdDefaultResponse = Awaited<ReturnType<typeof DataTablesService.getV1DatatablesByDatatableByApptableId>>;
export type DataTablesServiceGetV1DatatablesByDatatableByApptableIdQueryResult<TData = DataTablesServiceGetV1DatatablesByDatatableByApptableIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDataTablesServiceGetV1DatatablesByDatatableByApptableIdKey = "DataTablesServiceGetV1DatatablesByDatatableByApptableId";
export const UseDataTablesServiceGetV1DatatablesByDatatableByApptableIdKeyFn = ({ apptableId, datatable, order }: {
  apptableId: number;
  datatable: string;
  order?: string;
}, queryKey?: Array<unknown>) => [useDataTablesServiceGetV1DatatablesByDatatableByApptableIdKey, ...(queryKey ?? [{ apptableId, datatable, order }])];
export type DataTablesServiceGetV1DatatablesByDatatableByApptableIdByDatatableIdDefaultResponse = Awaited<ReturnType<typeof DataTablesService.getV1DatatablesByDatatableByApptableIdByDatatableId>>;
export type DataTablesServiceGetV1DatatablesByDatatableByApptableIdByDatatableIdQueryResult<TData = DataTablesServiceGetV1DatatablesByDatatableByApptableIdByDatatableIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDataTablesServiceGetV1DatatablesByDatatableByApptableIdByDatatableIdKey = "DataTablesServiceGetV1DatatablesByDatatableByApptableIdByDatatableId";
export const UseDataTablesServiceGetV1DatatablesByDatatableByApptableIdByDatatableIdKeyFn = ({ apptableId, datatable, datatableId, genericResultSet, order }: {
  apptableId: number;
  datatable: string;
  datatableId: number;
  genericResultSet?: boolean;
  order?: string;
}, queryKey?: Array<unknown>) => [useDataTablesServiceGetV1DatatablesByDatatableByApptableIdByDatatableIdKey, ...(queryKey ?? [{ apptableId, datatable, datatableId, genericResultSet, order }])];
export type DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsDefaultResponse = Awaited<ReturnType<typeof DelinquencyRangeAndBucketsManagementService.getV1DelinquencyBuckets>>;
export type DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsQueryResult<TData = DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsKey = "DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBuckets";
export const UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsKeyFn = (queryKey?: Array<unknown>) => [useDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsKey, ...(queryKey ?? [])];
export type DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsByDelinquencyBucketIdDefaultResponse = Awaited<ReturnType<typeof DelinquencyRangeAndBucketsManagementService.getV1DelinquencyBucketsByDelinquencyBucketId>>;
export type DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsByDelinquencyBucketIdQueryResult<TData = DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsByDelinquencyBucketIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsByDelinquencyBucketIdKey = "DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsByDelinquencyBucketId";
export const UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsByDelinquencyBucketIdKeyFn = ({ delinquencyBucketId }: {
  delinquencyBucketId: number;
}, queryKey?: Array<unknown>) => [useDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsByDelinquencyBucketIdKey, ...(queryKey ?? [{ delinquencyBucketId }])];
export type DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesDefaultResponse = Awaited<ReturnType<typeof DelinquencyRangeAndBucketsManagementService.getV1DelinquencyRanges>>;
export type DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesQueryResult<TData = DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesKey = "DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRanges";
export const UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesKeyFn = (queryKey?: Array<unknown>) => [useDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesKey, ...(queryKey ?? [])];
export type DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesByDelinquencyRangeIdDefaultResponse = Awaited<ReturnType<typeof DelinquencyRangeAndBucketsManagementService.getV1DelinquencyRangesByDelinquencyRangeId>>;
export type DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesByDelinquencyRangeIdQueryResult<TData = DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesByDelinquencyRangeIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesByDelinquencyRangeIdKey = "DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesByDelinquencyRangeId";
export const UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesByDelinquencyRangeIdKeyFn = ({ delinquencyRangeId }: {
  delinquencyRangeId: number;
}, queryKey?: Array<unknown>) => [useDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesByDelinquencyRangeIdKey, ...(queryKey ?? [{ delinquencyRangeId }])];
export type EntityDataTableServiceGetV1EntityDatatableChecksDefaultResponse = Awaited<ReturnType<typeof EntityDataTableService.getV1EntityDatatableChecks>>;
export type EntityDataTableServiceGetV1EntityDatatableChecksQueryResult<TData = EntityDataTableServiceGetV1EntityDatatableChecksDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useEntityDataTableServiceGetV1EntityDatatableChecksKey = "EntityDataTableServiceGetV1EntityDatatableChecks";
export const UseEntityDataTableServiceGetV1EntityDatatableChecksKeyFn = ({ entity, limit, offset, productId, status }: {
  entity?: string;
  limit?: number;
  offset?: number;
  productId?: number;
  status?: number;
} = {}, queryKey?: Array<unknown>) => [useEntityDataTableServiceGetV1EntityDatatableChecksKey, ...(queryKey ?? [{ entity, limit, offset, productId, status }])];
export type EntityDataTableServiceGetV1EntityDatatableChecksTemplateDefaultResponse = Awaited<ReturnType<typeof EntityDataTableService.getV1EntityDatatableChecksTemplate>>;
export type EntityDataTableServiceGetV1EntityDatatableChecksTemplateQueryResult<TData = EntityDataTableServiceGetV1EntityDatatableChecksTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useEntityDataTableServiceGetV1EntityDatatableChecksTemplateKey = "EntityDataTableServiceGetV1EntityDatatableChecksTemplate";
export const UseEntityDataTableServiceGetV1EntityDatatableChecksTemplateKeyFn = (queryKey?: Array<unknown>) => [useEntityDataTableServiceGetV1EntityDatatableChecksTemplateKey, ...(queryKey ?? [])];
export type FineractEntityServiceGetV1EntitytoentitymappingDefaultResponse = Awaited<ReturnType<typeof FineractEntityService.getV1Entitytoentitymapping>>;
export type FineractEntityServiceGetV1EntitytoentitymappingQueryResult<TData = FineractEntityServiceGetV1EntitytoentitymappingDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFineractEntityServiceGetV1EntitytoentitymappingKey = "FineractEntityServiceGetV1Entitytoentitymapping";
export const UseFineractEntityServiceGetV1EntitytoentitymappingKeyFn = (queryKey?: Array<unknown>) => [useFineractEntityServiceGetV1EntitytoentitymappingKey, ...(queryKey ?? [])];
export type FineractEntityServiceGetV1EntitytoentitymappingByMapIdDefaultResponse = Awaited<ReturnType<typeof FineractEntityService.getV1EntitytoentitymappingByMapId>>;
export type FineractEntityServiceGetV1EntitytoentitymappingByMapIdQueryResult<TData = FineractEntityServiceGetV1EntitytoentitymappingByMapIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFineractEntityServiceGetV1EntitytoentitymappingByMapIdKey = "FineractEntityServiceGetV1EntitytoentitymappingByMapId";
export const UseFineractEntityServiceGetV1EntitytoentitymappingByMapIdKeyFn = ({ mapId }: {
  mapId: number;
}, queryKey?: Array<unknown>) => [useFineractEntityServiceGetV1EntitytoentitymappingByMapIdKey, ...(queryKey ?? [{ mapId }])];
export type FineractEntityServiceGetV1EntitytoentitymappingByMapIdByFromIdByToIdDefaultResponse = Awaited<ReturnType<typeof FineractEntityService.getV1EntitytoentitymappingByMapIdByFromIdByToId>>;
export type FineractEntityServiceGetV1EntitytoentitymappingByMapIdByFromIdByToIdQueryResult<TData = FineractEntityServiceGetV1EntitytoentitymappingByMapIdByFromIdByToIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFineractEntityServiceGetV1EntitytoentitymappingByMapIdByFromIdByToIdKey = "FineractEntityServiceGetV1EntitytoentitymappingByMapIdByFromIdByToId";
export const UseFineractEntityServiceGetV1EntitytoentitymappingByMapIdByFromIdByToIdKeyFn = ({ fromId, mapId, toId }: {
  fromId: number;
  mapId: number;
  toId: number;
}, queryKey?: Array<unknown>) => [useFineractEntityServiceGetV1EntitytoentitymappingByMapIdByFromIdByToIdKey, ...(queryKey ?? [{ fromId, mapId, toId }])];
export type ExternalAssetOwnerLoanProductAttributesServiceGetV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesDefaultResponse = Awaited<ReturnType<typeof ExternalAssetOwnerLoanProductAttributesService.getV1ExternalAssetOwnersLoanProductByLoanProductIdAttributes>>;
export type ExternalAssetOwnerLoanProductAttributesServiceGetV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesQueryResult<TData = ExternalAssetOwnerLoanProductAttributesServiceGetV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useExternalAssetOwnerLoanProductAttributesServiceGetV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesKey = "ExternalAssetOwnerLoanProductAttributesServiceGetV1ExternalAssetOwnersLoanProductByLoanProductIdAttributes";
export const UseExternalAssetOwnerLoanProductAttributesServiceGetV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesKeyFn = ({ attributeKey, loanProductId }: {
  attributeKey?: string;
  loanProductId: number;
}, queryKey?: Array<unknown>) => [useExternalAssetOwnerLoanProductAttributesServiceGetV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesKey, ...(queryKey ?? [{ attributeKey, loanProductId }])];
export type ExternalAssetOwnersServiceGetV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntriesDefaultResponse = Awaited<ReturnType<typeof ExternalAssetOwnersService.getV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntries>>;
export type ExternalAssetOwnersServiceGetV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntriesQueryResult<TData = ExternalAssetOwnersServiceGetV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntriesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useExternalAssetOwnersServiceGetV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntriesKey = "ExternalAssetOwnersServiceGetV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntries";
export const UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntriesKeyFn = ({ limit, offset, ownerExternalId }: {
  limit?: number;
  offset?: number;
  ownerExternalId: string;
}, queryKey?: Array<unknown>) => [useExternalAssetOwnersServiceGetV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntriesKey, ...(queryKey ?? [{ limit, offset, ownerExternalId }])];
export type ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersDefaultResponse = Awaited<ReturnType<typeof ExternalAssetOwnersService.getV1ExternalAssetOwnersTransfers>>;
export type ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersQueryResult<TData = ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersKey = "ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfers";
export const UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersKeyFn = ({ limit, loanExternalId, loanId, offset, transferExternalId }: {
  limit?: number;
  loanExternalId?: string;
  loanId?: number;
  offset?: number;
  transferExternalId?: string;
} = {}, queryKey?: Array<unknown>) => [useExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersKey, ...(queryKey ?? [{ limit, loanExternalId, loanId, offset, transferExternalId }])];
export type ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersActiveTransferDefaultResponse = Awaited<ReturnType<typeof ExternalAssetOwnersService.getV1ExternalAssetOwnersTransfersActiveTransfer>>;
export type ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersActiveTransferQueryResult<TData = ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersActiveTransferDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersActiveTransferKey = "ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersActiveTransfer";
export const UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersActiveTransferKeyFn = ({ loanExternalId, loanId, transferExternalId }: {
  loanExternalId?: string;
  loanId?: number;
  transferExternalId?: string;
} = {}, queryKey?: Array<unknown>) => [useExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersActiveTransferKey, ...(queryKey ?? [{ loanExternalId, loanId, transferExternalId }])];
export type ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersByTransferIdJournalEntriesDefaultResponse = Awaited<ReturnType<typeof ExternalAssetOwnersService.getV1ExternalAssetOwnersTransfersByTransferIdJournalEntries>>;
export type ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersByTransferIdJournalEntriesQueryResult<TData = ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersByTransferIdJournalEntriesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersByTransferIdJournalEntriesKey = "ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersByTransferIdJournalEntries";
export const UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersByTransferIdJournalEntriesKeyFn = ({ limit, offset, transferId }: {
  limit?: number;
  offset?: number;
  transferId: number;
}, queryKey?: Array<unknown>) => [useExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersByTransferIdJournalEntriesKey, ...(queryKey ?? [{ limit, offset, transferId }])];
export type ExternalEventConfigurationServiceGetV1ExternaleventsConfigurationDefaultResponse = Awaited<ReturnType<typeof ExternalEventConfigurationService.getV1ExternaleventsConfiguration>>;
export type ExternalEventConfigurationServiceGetV1ExternaleventsConfigurationQueryResult<TData = ExternalEventConfigurationServiceGetV1ExternaleventsConfigurationDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useExternalEventConfigurationServiceGetV1ExternaleventsConfigurationKey = "ExternalEventConfigurationServiceGetV1ExternaleventsConfiguration";
export const UseExternalEventConfigurationServiceGetV1ExternaleventsConfigurationKeyFn = (queryKey?: Array<unknown>) => [useExternalEventConfigurationServiceGetV1ExternaleventsConfigurationKey, ...(queryKey ?? [])];
export type ExternalServicesServiceGetV1ExternalserviceByServicenameDefaultResponse = Awaited<ReturnType<typeof ExternalServicesService.getV1ExternalserviceByServicename>>;
export type ExternalServicesServiceGetV1ExternalserviceByServicenameQueryResult<TData = ExternalServicesServiceGetV1ExternalserviceByServicenameDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useExternalServicesServiceGetV1ExternalserviceByServicenameKey = "ExternalServicesServiceGetV1ExternalserviceByServicename";
export const UseExternalServicesServiceGetV1ExternalserviceByServicenameKeyFn = ({ servicename }: {
  servicename: string;
}, queryKey?: Array<unknown>) => [useExternalServicesServiceGetV1ExternalserviceByServicenameKey, ...(queryKey ?? [{ servicename }])];
export type EntityFieldConfigurationServiceGetV1FieldconfigurationByEntityDefaultResponse = Awaited<ReturnType<typeof EntityFieldConfigurationService.getV1FieldconfigurationByEntity>>;
export type EntityFieldConfigurationServiceGetV1FieldconfigurationByEntityQueryResult<TData = EntityFieldConfigurationServiceGetV1FieldconfigurationByEntityDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useEntityFieldConfigurationServiceGetV1FieldconfigurationByEntityKey = "EntityFieldConfigurationServiceGetV1FieldconfigurationByEntity";
export const UseEntityFieldConfigurationServiceGetV1FieldconfigurationByEntityKeyFn = ({ entity }: {
  entity: string;
}, queryKey?: Array<unknown>) => [useEntityFieldConfigurationServiceGetV1FieldconfigurationByEntityKey, ...(queryKey ?? [{ entity }])];
export type MappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsDefaultResponse = Awaited<ReturnType<typeof MappingFinancialActivitiesToAccountsService.getV1Financialactivityaccounts>>;
export type MappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsQueryResult<TData = MappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsKey = "MappingFinancialActivitiesToAccountsServiceGetV1Financialactivityaccounts";
export const UseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsKeyFn = (queryKey?: Array<unknown>) => [useMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsKey, ...(queryKey ?? [])];
export type MappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsTemplateDefaultResponse = Awaited<ReturnType<typeof MappingFinancialActivitiesToAccountsService.getV1FinancialactivityaccountsTemplate>>;
export type MappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsTemplateQueryResult<TData = MappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsTemplateKey = "MappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsTemplate";
export const UseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsTemplateKeyFn = (queryKey?: Array<unknown>) => [useMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsTemplateKey, ...(queryKey ?? [])];
export type MappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsByMappingIdDefaultResponse = Awaited<ReturnType<typeof MappingFinancialActivitiesToAccountsService.getV1FinancialactivityaccountsByMappingId>>;
export type MappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsByMappingIdQueryResult<TData = MappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsByMappingIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsByMappingIdKey = "MappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsByMappingId";
export const UseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsByMappingIdKeyFn = ({ mappingId }: {
  mappingId: number;
}, queryKey?: Array<unknown>) => [useMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsByMappingIdKey, ...(queryKey ?? [{ mappingId }])];
export type FixedDepositAccountServiceGetV1FixeddepositaccountsDefaultResponse = Awaited<ReturnType<typeof FixedDepositAccountService.getV1Fixeddepositaccounts>>;
export type FixedDepositAccountServiceGetV1FixeddepositaccountsQueryResult<TData = FixedDepositAccountServiceGetV1FixeddepositaccountsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsKey = "FixedDepositAccountServiceGetV1Fixeddepositaccounts";
export const UseFixedDepositAccountServiceGetV1FixeddepositaccountsKeyFn = ({ limit, offset, orderBy, paged, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  paged?: boolean;
  sortOrder?: string;
} = {}, queryKey?: Array<unknown>) => [useFixedDepositAccountServiceGetV1FixeddepositaccountsKey, ...(queryKey ?? [{ limit, offset, orderBy, paged, sortOrder }])];
export type FixedDepositAccountServiceGetV1FixeddepositaccountsCalculateFdInterestDefaultResponse = Awaited<ReturnType<typeof FixedDepositAccountService.getV1FixeddepositaccountsCalculateFdInterest>>;
export type FixedDepositAccountServiceGetV1FixeddepositaccountsCalculateFdInterestQueryResult<TData = FixedDepositAccountServiceGetV1FixeddepositaccountsCalculateFdInterestDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsCalculateFdInterestKey = "FixedDepositAccountServiceGetV1FixeddepositaccountsCalculateFdInterest";
export const UseFixedDepositAccountServiceGetV1FixeddepositaccountsCalculateFdInterestKeyFn = ({ annualInterestRate, interestCompoundingPeriodInMonths, interestPostingPeriodInMonths, principalAmount, tenureInMonths }: {
  annualInterestRate?: number;
  interestCompoundingPeriodInMonths?: number;
  interestPostingPeriodInMonths?: number;
  principalAmount?: number;
  tenureInMonths?: number;
} = {}, queryKey?: Array<unknown>) => [useFixedDepositAccountServiceGetV1FixeddepositaccountsCalculateFdInterestKey, ...(queryKey ?? [{ annualInterestRate, interestCompoundingPeriodInMonths, interestPostingPeriodInMonths, principalAmount, tenureInMonths }])];
export type FixedDepositAccountServiceGetV1FixeddepositaccountsDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof FixedDepositAccountService.getV1FixeddepositaccountsDownloadtemplate>>;
export type FixedDepositAccountServiceGetV1FixeddepositaccountsDownloadtemplateQueryResult<TData = FixedDepositAccountServiceGetV1FixeddepositaccountsDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsDownloadtemplateKey = "FixedDepositAccountServiceGetV1FixeddepositaccountsDownloadtemplate";
export const UseFixedDepositAccountServiceGetV1FixeddepositaccountsDownloadtemplateKeyFn = ({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: Array<unknown>) => [useFixedDepositAccountServiceGetV1FixeddepositaccountsDownloadtemplateKey, ...(queryKey ?? [{ dateFormat, officeId, staffId }])];
export type FixedDepositAccountServiceGetV1FixeddepositaccountsTemplateDefaultResponse = Awaited<ReturnType<typeof FixedDepositAccountService.getV1FixeddepositaccountsTemplate>>;
export type FixedDepositAccountServiceGetV1FixeddepositaccountsTemplateQueryResult<TData = FixedDepositAccountServiceGetV1FixeddepositaccountsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsTemplateKey = "FixedDepositAccountServiceGetV1FixeddepositaccountsTemplate";
export const UseFixedDepositAccountServiceGetV1FixeddepositaccountsTemplateKeyFn = ({ clientId, groupId, productId, staffInSelectedOfficeOnly }: {
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: Array<unknown>) => [useFixedDepositAccountServiceGetV1FixeddepositaccountsTemplateKey, ...(queryKey ?? [{ clientId, groupId, productId, staffInSelectedOfficeOnly }])];
export type FixedDepositAccountServiceGetV1FixeddepositaccountsTransactionDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof FixedDepositAccountService.getV1FixeddepositaccountsTransactionDownloadtemplate>>;
export type FixedDepositAccountServiceGetV1FixeddepositaccountsTransactionDownloadtemplateQueryResult<TData = FixedDepositAccountServiceGetV1FixeddepositaccountsTransactionDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsTransactionDownloadtemplateKey = "FixedDepositAccountServiceGetV1FixeddepositaccountsTransactionDownloadtemplate";
export const UseFixedDepositAccountServiceGetV1FixeddepositaccountsTransactionDownloadtemplateKeyFn = ({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: Array<unknown>) => [useFixedDepositAccountServiceGetV1FixeddepositaccountsTransactionDownloadtemplateKey, ...(queryKey ?? [{ dateFormat, officeId }])];
export type FixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdDefaultResponse = Awaited<ReturnType<typeof FixedDepositAccountService.getV1FixeddepositaccountsByAccountId>>;
export type FixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdQueryResult<TData = FixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdKey = "FixedDepositAccountServiceGetV1FixeddepositaccountsByAccountId";
export const UseFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdKeyFn = ({ accountId, chargeStatus, staffInSelectedOfficeOnly }: {
  accountId: number;
  chargeStatus?: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: Array<unknown>) => [useFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdKey, ...(queryKey ?? [{ accountId, chargeStatus, staffInSelectedOfficeOnly }])];
export type FixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdTemplateDefaultResponse = Awaited<ReturnType<typeof FixedDepositAccountService.getV1FixeddepositaccountsByAccountIdTemplate>>;
export type FixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdTemplateQueryResult<TData = FixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdTemplateKey = "FixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdTemplate";
export const UseFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdTemplateKeyFn = ({ accountId, command }: {
  accountId: number;
  command?: string;
}, queryKey?: Array<unknown>) => [useFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdTemplateKey, ...(queryKey ?? [{ accountId, command }])];
export type FixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplateDefaultResponse = Awaited<ReturnType<typeof FixedDepositAccountTransactionsService.getV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplate>>;
export type FixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplateQueryResult<TData = FixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplateKey = "FixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplate";
export const UseFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplateKeyFn = ({ fixedDepositAccountId }: {
  fixedDepositAccountId: number;
}, queryKey?: Array<unknown>) => [useFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplateKey, ...(queryKey ?? [{ fixedDepositAccountId }])];
export type FixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionIdDefaultResponse = Awaited<ReturnType<typeof FixedDepositAccountTransactionsService.getV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionId>>;
export type FixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionIdQueryResult<TData = FixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionIdKey = "FixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionId";
export const UseFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionIdKeyFn = ({ fixedDepositAccountId, transactionId }: {
  fixedDepositAccountId: number;
  transactionId: number;
}, queryKey?: Array<unknown>) => [useFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionIdKey, ...(queryKey ?? [{ fixedDepositAccountId, transactionId }])];
export type FixedDepositProductServiceGetV1FixeddepositproductsDefaultResponse = Awaited<ReturnType<typeof FixedDepositProductService.getV1Fixeddepositproducts>>;
export type FixedDepositProductServiceGetV1FixeddepositproductsQueryResult<TData = FixedDepositProductServiceGetV1FixeddepositproductsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFixedDepositProductServiceGetV1FixeddepositproductsKey = "FixedDepositProductServiceGetV1Fixeddepositproducts";
export const UseFixedDepositProductServiceGetV1FixeddepositproductsKeyFn = (queryKey?: Array<unknown>) => [useFixedDepositProductServiceGetV1FixeddepositproductsKey, ...(queryKey ?? [])];
export type FixedDepositProductServiceGetV1FixeddepositproductsTemplateDefaultResponse = Awaited<ReturnType<typeof FixedDepositProductService.getV1FixeddepositproductsTemplate>>;
export type FixedDepositProductServiceGetV1FixeddepositproductsTemplateQueryResult<TData = FixedDepositProductServiceGetV1FixeddepositproductsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFixedDepositProductServiceGetV1FixeddepositproductsTemplateKey = "FixedDepositProductServiceGetV1FixeddepositproductsTemplate";
export const UseFixedDepositProductServiceGetV1FixeddepositproductsTemplateKeyFn = (queryKey?: Array<unknown>) => [useFixedDepositProductServiceGetV1FixeddepositproductsTemplateKey, ...(queryKey ?? [])];
export type FixedDepositProductServiceGetV1FixeddepositproductsByProductIdDefaultResponse = Awaited<ReturnType<typeof FixedDepositProductService.getV1FixeddepositproductsByProductId>>;
export type FixedDepositProductServiceGetV1FixeddepositproductsByProductIdQueryResult<TData = FixedDepositProductServiceGetV1FixeddepositproductsByProductIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFixedDepositProductServiceGetV1FixeddepositproductsByProductIdKey = "FixedDepositProductServiceGetV1FixeddepositproductsByProductId";
export const UseFixedDepositProductServiceGetV1FixeddepositproductsByProductIdKeyFn = ({ productId }: {
  productId: number;
}, queryKey?: Array<unknown>) => [useFixedDepositProductServiceGetV1FixeddepositproductsByProductIdKey, ...(queryKey ?? [{ productId }])];
export type FloatingRatesServiceGetV1FloatingratesDefaultResponse = Awaited<ReturnType<typeof FloatingRatesService.getV1Floatingrates>>;
export type FloatingRatesServiceGetV1FloatingratesQueryResult<TData = FloatingRatesServiceGetV1FloatingratesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFloatingRatesServiceGetV1FloatingratesKey = "FloatingRatesServiceGetV1Floatingrates";
export const UseFloatingRatesServiceGetV1FloatingratesKeyFn = (queryKey?: Array<unknown>) => [useFloatingRatesServiceGetV1FloatingratesKey, ...(queryKey ?? [])];
export type FloatingRatesServiceGetV1FloatingratesByFloatingRateIdDefaultResponse = Awaited<ReturnType<typeof FloatingRatesService.getV1FloatingratesByFloatingRateId>>;
export type FloatingRatesServiceGetV1FloatingratesByFloatingRateIdQueryResult<TData = FloatingRatesServiceGetV1FloatingratesByFloatingRateIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFloatingRatesServiceGetV1FloatingratesByFloatingRateIdKey = "FloatingRatesServiceGetV1FloatingratesByFloatingRateId";
export const UseFloatingRatesServiceGetV1FloatingratesByFloatingRateIdKeyFn = ({ floatingRateId }: {
  floatingRateId: number;
}, queryKey?: Array<unknown>) => [useFloatingRatesServiceGetV1FloatingratesByFloatingRateIdKey, ...(queryKey ?? [{ floatingRateId }])];
export type FundsServiceGetV1FundsDefaultResponse = Awaited<ReturnType<typeof FundsService.getV1Funds>>;
export type FundsServiceGetV1FundsQueryResult<TData = FundsServiceGetV1FundsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFundsServiceGetV1FundsKey = "FundsServiceGetV1Funds";
export const UseFundsServiceGetV1FundsKeyFn = (queryKey?: Array<unknown>) => [useFundsServiceGetV1FundsKey, ...(queryKey ?? [])];
export type FundsServiceGetV1FundsByFundIdDefaultResponse = Awaited<ReturnType<typeof FundsService.getV1FundsByFundId>>;
export type FundsServiceGetV1FundsByFundIdQueryResult<TData = FundsServiceGetV1FundsByFundIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFundsServiceGetV1FundsByFundIdKey = "FundsServiceGetV1FundsByFundId";
export const UseFundsServiceGetV1FundsByFundIdKeyFn = ({ fundId }: {
  fundId: number;
}, queryKey?: Array<unknown>) => [useFundsServiceGetV1FundsByFundIdKey, ...(queryKey ?? [{ fundId }])];
export type GeneralLedgerAccountServiceGetV1GlaccountsDefaultResponse = Awaited<ReturnType<typeof GeneralLedgerAccountService.getV1Glaccounts>>;
export type GeneralLedgerAccountServiceGetV1GlaccountsQueryResult<TData = GeneralLedgerAccountServiceGetV1GlaccountsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGeneralLedgerAccountServiceGetV1GlaccountsKey = "GeneralLedgerAccountServiceGetV1Glaccounts";
export const UseGeneralLedgerAccountServiceGetV1GlaccountsKeyFn = ({ disabled, fetchRunningBalance, manualEntriesAllowed, searchParam, type, usage }: {
  disabled?: boolean;
  fetchRunningBalance?: boolean;
  manualEntriesAllowed?: boolean;
  searchParam?: string;
  type?: number;
  usage?: number;
} = {}, queryKey?: Array<unknown>) => [useGeneralLedgerAccountServiceGetV1GlaccountsKey, ...(queryKey ?? [{ disabled, fetchRunningBalance, manualEntriesAllowed, searchParam, type, usage }])];
export type GeneralLedgerAccountServiceGetV1GlaccountsDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof GeneralLedgerAccountService.getV1GlaccountsDownloadtemplate>>;
export type GeneralLedgerAccountServiceGetV1GlaccountsDownloadtemplateQueryResult<TData = GeneralLedgerAccountServiceGetV1GlaccountsDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGeneralLedgerAccountServiceGetV1GlaccountsDownloadtemplateKey = "GeneralLedgerAccountServiceGetV1GlaccountsDownloadtemplate";
export const UseGeneralLedgerAccountServiceGetV1GlaccountsDownloadtemplateKeyFn = ({ dateFormat }: {
  dateFormat?: string;
} = {}, queryKey?: Array<unknown>) => [useGeneralLedgerAccountServiceGetV1GlaccountsDownloadtemplateKey, ...(queryKey ?? [{ dateFormat }])];
export type GeneralLedgerAccountServiceGetV1GlaccountsTemplateDefaultResponse = Awaited<ReturnType<typeof GeneralLedgerAccountService.getV1GlaccountsTemplate>>;
export type GeneralLedgerAccountServiceGetV1GlaccountsTemplateQueryResult<TData = GeneralLedgerAccountServiceGetV1GlaccountsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGeneralLedgerAccountServiceGetV1GlaccountsTemplateKey = "GeneralLedgerAccountServiceGetV1GlaccountsTemplate";
export const UseGeneralLedgerAccountServiceGetV1GlaccountsTemplateKeyFn = ({ type }: {
  type?: number;
} = {}, queryKey?: Array<unknown>) => [useGeneralLedgerAccountServiceGetV1GlaccountsTemplateKey, ...(queryKey ?? [{ type }])];
export type GeneralLedgerAccountServiceGetV1GlaccountsByGlAccountIdDefaultResponse = Awaited<ReturnType<typeof GeneralLedgerAccountService.getV1GlaccountsByGlAccountId>>;
export type GeneralLedgerAccountServiceGetV1GlaccountsByGlAccountIdQueryResult<TData = GeneralLedgerAccountServiceGetV1GlaccountsByGlAccountIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGeneralLedgerAccountServiceGetV1GlaccountsByGlAccountIdKey = "GeneralLedgerAccountServiceGetV1GlaccountsByGlAccountId";
export const UseGeneralLedgerAccountServiceGetV1GlaccountsByGlAccountIdKeyFn = ({ fetchRunningBalance, glAccountId }: {
  fetchRunningBalance?: boolean;
  glAccountId: number;
}, queryKey?: Array<unknown>) => [useGeneralLedgerAccountServiceGetV1GlaccountsByGlAccountIdKey, ...(queryKey ?? [{ fetchRunningBalance, glAccountId }])];
export type AccountingClosureServiceGetV1GlclosuresDefaultResponse = Awaited<ReturnType<typeof AccountingClosureService.getV1Glclosures>>;
export type AccountingClosureServiceGetV1GlclosuresQueryResult<TData = AccountingClosureServiceGetV1GlclosuresDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccountingClosureServiceGetV1GlclosuresKey = "AccountingClosureServiceGetV1Glclosures";
export const UseAccountingClosureServiceGetV1GlclosuresKeyFn = ({ officeId }: {
  officeId?: number;
} = {}, queryKey?: Array<unknown>) => [useAccountingClosureServiceGetV1GlclosuresKey, ...(queryKey ?? [{ officeId }])];
export type AccountingClosureServiceGetV1GlclosuresByGlClosureIdDefaultResponse = Awaited<ReturnType<typeof AccountingClosureService.getV1GlclosuresByGlClosureId>>;
export type AccountingClosureServiceGetV1GlclosuresByGlClosureIdQueryResult<TData = AccountingClosureServiceGetV1GlclosuresByGlClosureIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAccountingClosureServiceGetV1GlclosuresByGlClosureIdKey = "AccountingClosureServiceGetV1GlclosuresByGlClosureId";
export const UseAccountingClosureServiceGetV1GlclosuresByGlClosureIdKeyFn = ({ glClosureId }: {
  glClosureId: number;
}, queryKey?: Array<unknown>) => [useAccountingClosureServiceGetV1GlclosuresByGlClosureIdKey, ...(queryKey ?? [{ glClosureId }])];
export type GroupsLevelServiceGetV1GrouplevelsDefaultResponse = Awaited<ReturnType<typeof GroupsLevelService.getV1Grouplevels>>;
export type GroupsLevelServiceGetV1GrouplevelsQueryResult<TData = GroupsLevelServiceGetV1GrouplevelsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGroupsLevelServiceGetV1GrouplevelsKey = "GroupsLevelServiceGetV1Grouplevels";
export const UseGroupsLevelServiceGetV1GrouplevelsKeyFn = (queryKey?: Array<unknown>) => [useGroupsLevelServiceGetV1GrouplevelsKey, ...(queryKey ?? [])];
export type GroupsServiceGetV1GroupsDefaultResponse = Awaited<ReturnType<typeof GroupsService.getV1Groups>>;
export type GroupsServiceGetV1GroupsQueryResult<TData = GroupsServiceGetV1GroupsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGroupsServiceGetV1GroupsKey = "GroupsServiceGetV1Groups";
export const UseGroupsServiceGetV1GroupsKeyFn = ({ externalId, limit, name, officeId, offset, orderBy, orphansOnly, paged, sortOrder, staffId, underHierarchy }: {
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
} = {}, queryKey?: Array<unknown>) => [useGroupsServiceGetV1GroupsKey, ...(queryKey ?? [{ externalId, limit, name, officeId, offset, orderBy, orphansOnly, paged, sortOrder, staffId, underHierarchy }])];
export type GroupsServiceGetV1GroupsDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof GroupsService.getV1GroupsDownloadtemplate>>;
export type GroupsServiceGetV1GroupsDownloadtemplateQueryResult<TData = GroupsServiceGetV1GroupsDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGroupsServiceGetV1GroupsDownloadtemplateKey = "GroupsServiceGetV1GroupsDownloadtemplate";
export const UseGroupsServiceGetV1GroupsDownloadtemplateKeyFn = ({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: Array<unknown>) => [useGroupsServiceGetV1GroupsDownloadtemplateKey, ...(queryKey ?? [{ dateFormat, officeId, staffId }])];
export type GroupsServiceGetV1GroupsTemplateDefaultResponse = Awaited<ReturnType<typeof GroupsService.getV1GroupsTemplate>>;
export type GroupsServiceGetV1GroupsTemplateQueryResult<TData = GroupsServiceGetV1GroupsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGroupsServiceGetV1GroupsTemplateKey = "GroupsServiceGetV1GroupsTemplate";
export const UseGroupsServiceGetV1GroupsTemplateKeyFn = ({ center, centerId, command, officeId, staffInSelectedOfficeOnly }: {
  center?: boolean;
  centerId?: number;
  command?: string;
  officeId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: Array<unknown>) => [useGroupsServiceGetV1GroupsTemplateKey, ...(queryKey ?? [{ center, centerId, command, officeId, staffInSelectedOfficeOnly }])];
export type GroupsServiceGetV1GroupsByGroupIdDefaultResponse = Awaited<ReturnType<typeof GroupsService.getV1GroupsByGroupId>>;
export type GroupsServiceGetV1GroupsByGroupIdQueryResult<TData = GroupsServiceGetV1GroupsByGroupIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGroupsServiceGetV1GroupsByGroupIdKey = "GroupsServiceGetV1GroupsByGroupId";
export const UseGroupsServiceGetV1GroupsByGroupIdKeyFn = ({ groupId, roleId, staffInSelectedOfficeOnly }: {
  groupId: number;
  roleId?: number;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: Array<unknown>) => [useGroupsServiceGetV1GroupsByGroupIdKey, ...(queryKey ?? [{ groupId, roleId, staffInSelectedOfficeOnly }])];
export type GroupsServiceGetV1GroupsByGroupIdAccountsDefaultResponse = Awaited<ReturnType<typeof GroupsService.getV1GroupsByGroupIdAccounts>>;
export type GroupsServiceGetV1GroupsByGroupIdAccountsQueryResult<TData = GroupsServiceGetV1GroupsByGroupIdAccountsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGroupsServiceGetV1GroupsByGroupIdAccountsKey = "GroupsServiceGetV1GroupsByGroupIdAccounts";
export const UseGroupsServiceGetV1GroupsByGroupIdAccountsKeyFn = ({ groupId }: {
  groupId: number;
}, queryKey?: Array<unknown>) => [useGroupsServiceGetV1GroupsByGroupIdAccountsKey, ...(queryKey ?? [{ groupId }])];
export type GroupsServiceGetV1GroupsByGroupIdGlimaccountsDefaultResponse = Awaited<ReturnType<typeof GroupsService.getV1GroupsByGroupIdGlimaccounts>>;
export type GroupsServiceGetV1GroupsByGroupIdGlimaccountsQueryResult<TData = GroupsServiceGetV1GroupsByGroupIdGlimaccountsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGroupsServiceGetV1GroupsByGroupIdGlimaccountsKey = "GroupsServiceGetV1GroupsByGroupIdGlimaccounts";
export const UseGroupsServiceGetV1GroupsByGroupIdGlimaccountsKeyFn = ({ groupId, parentLoanAccountNo }: {
  groupId: number;
  parentLoanAccountNo?: string;
}, queryKey?: Array<unknown>) => [useGroupsServiceGetV1GroupsByGroupIdGlimaccountsKey, ...(queryKey ?? [{ groupId, parentLoanAccountNo }])];
export type GroupsServiceGetV1GroupsByGroupIdGsimaccountsDefaultResponse = Awaited<ReturnType<typeof GroupsService.getV1GroupsByGroupIdGsimaccounts>>;
export type GroupsServiceGetV1GroupsByGroupIdGsimaccountsQueryResult<TData = GroupsServiceGetV1GroupsByGroupIdGsimaccountsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGroupsServiceGetV1GroupsByGroupIdGsimaccountsKey = "GroupsServiceGetV1GroupsByGroupIdGsimaccounts";
export const UseGroupsServiceGetV1GroupsByGroupIdGsimaccountsKeyFn = ({ groupId, parentGsimAccountNo, parentGsimId }: {
  groupId: number;
  parentGsimAccountNo?: string;
  parentGsimId?: number;
}, queryKey?: Array<unknown>) => [useGroupsServiceGetV1GroupsByGroupIdGsimaccountsKey, ...(queryKey ?? [{ groupId, parentGsimAccountNo, parentGsimId }])];
export type HolidaysServiceGetV1HolidaysDefaultResponse = Awaited<ReturnType<typeof HolidaysService.getV1Holidays>>;
export type HolidaysServiceGetV1HolidaysQueryResult<TData = HolidaysServiceGetV1HolidaysDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useHolidaysServiceGetV1HolidaysKey = "HolidaysServiceGetV1Holidays";
export const UseHolidaysServiceGetV1HolidaysKeyFn = ({ dateFormat, fromDate, locale, officeId, toDate }: {
  dateFormat?: string;
  fromDate?: DateParam;
  locale?: string;
  officeId?: number;
  toDate?: DateParam;
} = {}, queryKey?: Array<unknown>) => [useHolidaysServiceGetV1HolidaysKey, ...(queryKey ?? [{ dateFormat, fromDate, locale, officeId, toDate }])];
export type HolidaysServiceGetV1HolidaysTemplateDefaultResponse = Awaited<ReturnType<typeof HolidaysService.getV1HolidaysTemplate>>;
export type HolidaysServiceGetV1HolidaysTemplateQueryResult<TData = HolidaysServiceGetV1HolidaysTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useHolidaysServiceGetV1HolidaysTemplateKey = "HolidaysServiceGetV1HolidaysTemplate";
export const UseHolidaysServiceGetV1HolidaysTemplateKeyFn = (queryKey?: Array<unknown>) => [useHolidaysServiceGetV1HolidaysTemplateKey, ...(queryKey ?? [])];
export type HolidaysServiceGetV1HolidaysByHolidayIdDefaultResponse = Awaited<ReturnType<typeof HolidaysService.getV1HolidaysByHolidayId>>;
export type HolidaysServiceGetV1HolidaysByHolidayIdQueryResult<TData = HolidaysServiceGetV1HolidaysByHolidayIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useHolidaysServiceGetV1HolidaysByHolidayIdKey = "HolidaysServiceGetV1HolidaysByHolidayId";
export const UseHolidaysServiceGetV1HolidaysByHolidayIdKeyFn = ({ holidayId }: {
  holidayId: number;
}, queryKey?: Array<unknown>) => [useHolidaysServiceGetV1HolidaysByHolidayIdKey, ...(queryKey ?? [{ holidayId }])];
export type HooksServiceGetV1HooksDefaultResponse = Awaited<ReturnType<typeof HooksService.getV1Hooks>>;
export type HooksServiceGetV1HooksQueryResult<TData = HooksServiceGetV1HooksDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useHooksServiceGetV1HooksKey = "HooksServiceGetV1Hooks";
export const UseHooksServiceGetV1HooksKeyFn = (queryKey?: Array<unknown>) => [useHooksServiceGetV1HooksKey, ...(queryKey ?? [])];
export type HooksServiceGetV1HooksTemplateDefaultResponse = Awaited<ReturnType<typeof HooksService.getV1HooksTemplate>>;
export type HooksServiceGetV1HooksTemplateQueryResult<TData = HooksServiceGetV1HooksTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useHooksServiceGetV1HooksTemplateKey = "HooksServiceGetV1HooksTemplate";
export const UseHooksServiceGetV1HooksTemplateKeyFn = (queryKey?: Array<unknown>) => [useHooksServiceGetV1HooksTemplateKey, ...(queryKey ?? [])];
export type HooksServiceGetV1HooksByHookIdDefaultResponse = Awaited<ReturnType<typeof HooksService.getV1HooksByHookId>>;
export type HooksServiceGetV1HooksByHookIdQueryResult<TData = HooksServiceGetV1HooksByHookIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useHooksServiceGetV1HooksByHookIdKey = "HooksServiceGetV1HooksByHookId";
export const UseHooksServiceGetV1HooksByHookIdKeyFn = ({ hookId }: {
  hookId: number;
}, queryKey?: Array<unknown>) => [useHooksServiceGetV1HooksByHookIdKey, ...(queryKey ?? [{ hookId }])];
export type BulkImportServiceGetV1ImportsDefaultResponse = Awaited<ReturnType<typeof BulkImportService.getV1Imports>>;
export type BulkImportServiceGetV1ImportsQueryResult<TData = BulkImportServiceGetV1ImportsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useBulkImportServiceGetV1ImportsKey = "BulkImportServiceGetV1Imports";
export const UseBulkImportServiceGetV1ImportsKeyFn = ({ entityType }: {
  entityType?: string;
} = {}, queryKey?: Array<unknown>) => [useBulkImportServiceGetV1ImportsKey, ...(queryKey ?? [{ entityType }])];
export type BulkImportServiceGetV1ImportsDownloadOutputTemplateDefaultResponse = Awaited<ReturnType<typeof BulkImportService.getV1ImportsDownloadOutputTemplate>>;
export type BulkImportServiceGetV1ImportsDownloadOutputTemplateQueryResult<TData = BulkImportServiceGetV1ImportsDownloadOutputTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useBulkImportServiceGetV1ImportsDownloadOutputTemplateKey = "BulkImportServiceGetV1ImportsDownloadOutputTemplate";
export const UseBulkImportServiceGetV1ImportsDownloadOutputTemplateKeyFn = ({ importDocumentId }: {
  importDocumentId?: string;
} = {}, queryKey?: Array<unknown>) => [useBulkImportServiceGetV1ImportsDownloadOutputTemplateKey, ...(queryKey ?? [{ importDocumentId }])];
export type BulkImportServiceGetV1ImportsGetOutputTemplateLocationDefaultResponse = Awaited<ReturnType<typeof BulkImportService.getV1ImportsGetOutputTemplateLocation>>;
export type BulkImportServiceGetV1ImportsGetOutputTemplateLocationQueryResult<TData = BulkImportServiceGetV1ImportsGetOutputTemplateLocationDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useBulkImportServiceGetV1ImportsGetOutputTemplateLocationKey = "BulkImportServiceGetV1ImportsGetOutputTemplateLocation";
export const UseBulkImportServiceGetV1ImportsGetOutputTemplateLocationKeyFn = ({ importDocumentId }: {
  importDocumentId?: string;
} = {}, queryKey?: Array<unknown>) => [useBulkImportServiceGetV1ImportsGetOutputTemplateLocationKey, ...(queryKey ?? [{ importDocumentId }])];
export type InterestRateChartServiceGetV1InterestratechartsDefaultResponse = Awaited<ReturnType<typeof InterestRateChartService.getV1Interestratecharts>>;
export type InterestRateChartServiceGetV1InterestratechartsQueryResult<TData = InterestRateChartServiceGetV1InterestratechartsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useInterestRateChartServiceGetV1InterestratechartsKey = "InterestRateChartServiceGetV1Interestratecharts";
export const UseInterestRateChartServiceGetV1InterestratechartsKeyFn = ({ productId }: {
  productId?: number;
} = {}, queryKey?: Array<unknown>) => [useInterestRateChartServiceGetV1InterestratechartsKey, ...(queryKey ?? [{ productId }])];
export type InterestRateChartServiceGetV1InterestratechartsTemplateDefaultResponse = Awaited<ReturnType<typeof InterestRateChartService.getV1InterestratechartsTemplate>>;
export type InterestRateChartServiceGetV1InterestratechartsTemplateQueryResult<TData = InterestRateChartServiceGetV1InterestratechartsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useInterestRateChartServiceGetV1InterestratechartsTemplateKey = "InterestRateChartServiceGetV1InterestratechartsTemplate";
export const UseInterestRateChartServiceGetV1InterestratechartsTemplateKeyFn = (queryKey?: Array<unknown>) => [useInterestRateChartServiceGetV1InterestratechartsTemplateKey, ...(queryKey ?? [])];
export type InterestRateChartServiceGetV1InterestratechartsByChartIdDefaultResponse = Awaited<ReturnType<typeof InterestRateChartService.getV1InterestratechartsByChartId>>;
export type InterestRateChartServiceGetV1InterestratechartsByChartIdQueryResult<TData = InterestRateChartServiceGetV1InterestratechartsByChartIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useInterestRateChartServiceGetV1InterestratechartsByChartIdKey = "InterestRateChartServiceGetV1InterestratechartsByChartId";
export const UseInterestRateChartServiceGetV1InterestratechartsByChartIdKeyFn = ({ chartId }: {
  chartId: number;
}, queryKey?: Array<unknown>) => [useInterestRateChartServiceGetV1InterestratechartsByChartIdKey, ...(queryKey ?? [{ chartId }])];
export type InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsDefaultResponse = Awaited<ReturnType<typeof InterestRateSlabAKAInterestBandsService.getV1InterestratechartsByChartIdChartslabs>>;
export type InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsQueryResult<TData = InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsKey = "InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabs";
export const UseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsKeyFn = ({ chartId }: {
  chartId: number;
}, queryKey?: Array<unknown>) => [useInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsKey, ...(queryKey ?? [{ chartId }])];
export type InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsTemplateDefaultResponse = Awaited<ReturnType<typeof InterestRateSlabAKAInterestBandsService.getV1InterestratechartsByChartIdChartslabsTemplate>>;
export type InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsTemplateQueryResult<TData = InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsTemplateKey = "InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsTemplate";
export const UseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsTemplateKeyFn = ({ chartId }: {
  chartId: number;
}, queryKey?: Array<unknown>) => [useInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsTemplateKey, ...(queryKey ?? [{ chartId }])];
export type InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsByChartSlabIdDefaultResponse = Awaited<ReturnType<typeof InterestRateSlabAKAInterestBandsService.getV1InterestratechartsByChartIdChartslabsByChartSlabId>>;
export type InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsByChartSlabIdQueryResult<TData = InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsByChartSlabIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsByChartSlabIdKey = "InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsByChartSlabId";
export const UseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsByChartSlabIdKeyFn = ({ chartId, chartSlabId }: {
  chartId: number;
  chartSlabId: number;
}, queryKey?: Array<unknown>) => [useInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsByChartSlabIdKey, ...(queryKey ?? [{ chartId, chartSlabId }])];
export type ProgressiveLoanServiceGetV1InternalLoanProgressiveByLoanIdModelDefaultResponse = Awaited<ReturnType<typeof ProgressiveLoanService.getV1InternalLoanProgressiveByLoanIdModel>>;
export type ProgressiveLoanServiceGetV1InternalLoanProgressiveByLoanIdModelQueryResult<TData = ProgressiveLoanServiceGetV1InternalLoanProgressiveByLoanIdModelDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProgressiveLoanServiceGetV1InternalLoanProgressiveByLoanIdModelKey = "ProgressiveLoanServiceGetV1InternalLoanProgressiveByLoanIdModel";
export const UseProgressiveLoanServiceGetV1InternalLoanProgressiveByLoanIdModelKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useProgressiveLoanServiceGetV1InternalLoanProgressiveByLoanIdModelKey, ...(queryKey ?? [{ loanId }])];
export type InterOperationServiceGetV1InteroperationAccountsByAccountIdDefaultResponse = Awaited<ReturnType<typeof InterOperationService.getV1InteroperationAccountsByAccountId>>;
export type InterOperationServiceGetV1InteroperationAccountsByAccountIdQueryResult<TData = InterOperationServiceGetV1InteroperationAccountsByAccountIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useInterOperationServiceGetV1InteroperationAccountsByAccountIdKey = "InterOperationServiceGetV1InteroperationAccountsByAccountId";
export const UseInterOperationServiceGetV1InteroperationAccountsByAccountIdKeyFn = ({ accountId }: {
  accountId: string;
}, queryKey?: Array<unknown>) => [useInterOperationServiceGetV1InteroperationAccountsByAccountIdKey, ...(queryKey ?? [{ accountId }])];
export type InterOperationServiceGetV1InteroperationAccountsByAccountIdIdentifiersDefaultResponse = Awaited<ReturnType<typeof InterOperationService.getV1InteroperationAccountsByAccountIdIdentifiers>>;
export type InterOperationServiceGetV1InteroperationAccountsByAccountIdIdentifiersQueryResult<TData = InterOperationServiceGetV1InteroperationAccountsByAccountIdIdentifiersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useInterOperationServiceGetV1InteroperationAccountsByAccountIdIdentifiersKey = "InterOperationServiceGetV1InteroperationAccountsByAccountIdIdentifiers";
export const UseInterOperationServiceGetV1InteroperationAccountsByAccountIdIdentifiersKeyFn = ({ accountId }: {
  accountId: string;
}, queryKey?: Array<unknown>) => [useInterOperationServiceGetV1InteroperationAccountsByAccountIdIdentifiersKey, ...(queryKey ?? [{ accountId }])];
export type InterOperationServiceGetV1InteroperationAccountsByAccountIdKycDefaultResponse = Awaited<ReturnType<typeof InterOperationService.getV1InteroperationAccountsByAccountIdKyc>>;
export type InterOperationServiceGetV1InteroperationAccountsByAccountIdKycQueryResult<TData = InterOperationServiceGetV1InteroperationAccountsByAccountIdKycDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useInterOperationServiceGetV1InteroperationAccountsByAccountIdKycKey = "InterOperationServiceGetV1InteroperationAccountsByAccountIdKyc";
export const UseInterOperationServiceGetV1InteroperationAccountsByAccountIdKycKeyFn = ({ accountId }: {
  accountId: string;
}, queryKey?: Array<unknown>) => [useInterOperationServiceGetV1InteroperationAccountsByAccountIdKycKey, ...(queryKey ?? [{ accountId }])];
export type InterOperationServiceGetV1InteroperationAccountsByAccountIdTransactionsDefaultResponse = Awaited<ReturnType<typeof InterOperationService.getV1InteroperationAccountsByAccountIdTransactions>>;
export type InterOperationServiceGetV1InteroperationAccountsByAccountIdTransactionsQueryResult<TData = InterOperationServiceGetV1InteroperationAccountsByAccountIdTransactionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useInterOperationServiceGetV1InteroperationAccountsByAccountIdTransactionsKey = "InterOperationServiceGetV1InteroperationAccountsByAccountIdTransactions";
export const UseInterOperationServiceGetV1InteroperationAccountsByAccountIdTransactionsKeyFn = ({ accountId, credit, debit, fromBookingDateTime, toBookingDateTime }: {
  accountId: string;
  credit?: boolean;
  debit?: boolean;
  fromBookingDateTime?: string;
  toBookingDateTime?: string;
}, queryKey?: Array<unknown>) => [useInterOperationServiceGetV1InteroperationAccountsByAccountIdTransactionsKey, ...(queryKey ?? [{ accountId, credit, debit, fromBookingDateTime, toBookingDateTime }])];
export type InterOperationServiceGetV1InteroperationHealthDefaultResponse = Awaited<ReturnType<typeof InterOperationService.getV1InteroperationHealth>>;
export type InterOperationServiceGetV1InteroperationHealthQueryResult<TData = InterOperationServiceGetV1InteroperationHealthDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useInterOperationServiceGetV1InteroperationHealthKey = "InterOperationServiceGetV1InteroperationHealth";
export const UseInterOperationServiceGetV1InteroperationHealthKeyFn = (queryKey?: Array<unknown>) => [useInterOperationServiceGetV1InteroperationHealthKey, ...(queryKey ?? [])];
export type InterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueDefaultResponse = Awaited<ReturnType<typeof InterOperationService.getV1InteroperationPartiesByIdTypeByIdValue>>;
export type InterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueQueryResult<TData = InterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueKey = "InterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValue";
export const UseInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueKeyFn = ({ idType, idValue }: {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
}, queryKey?: Array<unknown>) => [useInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueKey, ...(queryKey ?? [{ idType, idValue }])];
export type InterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeDefaultResponse = Awaited<ReturnType<typeof InterOperationService.getV1InteroperationPartiesByIdTypeByIdValueBySubIdOrType>>;
export type InterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeQueryResult<TData = InterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeKey = "InterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueBySubIdOrType";
export const UseInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeKeyFn = ({ idType, idValue, subIdOrType }: {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
  subIdOrType: string;
}, queryKey?: Array<unknown>) => [useInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeKey, ...(queryKey ?? [{ idType, idValue, subIdOrType }])];
export type InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCodeDefaultResponse = Awaited<ReturnType<typeof InterOperationService.getV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCode>>;
export type InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCodeQueryResult<TData = InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCodeDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCodeKey = "InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCode";
export const UseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCodeKeyFn = ({ quoteCode, transactionCode }: {
  quoteCode: string;
  transactionCode: string;
}, queryKey?: Array<unknown>) => [useInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCodeKey, ...(queryKey ?? [{ quoteCode, transactionCode }])];
export type InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeRequestsByRequestCodeDefaultResponse = Awaited<ReturnType<typeof InterOperationService.getV1InteroperationTransactionsByTransactionCodeRequestsByRequestCode>>;
export type InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeRequestsByRequestCodeQueryResult<TData = InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeRequestsByRequestCodeDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeRequestsByRequestCodeKey = "InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeRequestsByRequestCode";
export const UseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeRequestsByRequestCodeKeyFn = ({ requestCode, transactionCode }: {
  requestCode: string;
  transactionCode: string;
}, queryKey?: Array<unknown>) => [useInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeRequestsByRequestCodeKey, ...(queryKey ?? [{ requestCode, transactionCode }])];
export type InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeTransfersByTransferCodeDefaultResponse = Awaited<ReturnType<typeof InterOperationService.getV1InteroperationTransactionsByTransactionCodeTransfersByTransferCode>>;
export type InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeTransfersByTransferCodeQueryResult<TData = InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeTransfersByTransferCodeDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeTransfersByTransferCodeKey = "InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeTransfersByTransferCode";
export const UseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeTransfersByTransferCodeKeyFn = ({ transactionCode, transferCode }: {
  transactionCode: string;
  transferCode: string;
}, queryKey?: Array<unknown>) => [useInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeTransfersByTransferCodeKey, ...(queryKey ?? [{ transactionCode, transferCode }])];
export type SchedulerJobServiceGetV1JobsDefaultResponse = Awaited<ReturnType<typeof SchedulerJobService.getV1Jobs>>;
export type SchedulerJobServiceGetV1JobsQueryResult<TData = SchedulerJobServiceGetV1JobsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSchedulerJobServiceGetV1JobsKey = "SchedulerJobServiceGetV1Jobs";
export const UseSchedulerJobServiceGetV1JobsKeyFn = (queryKey?: Array<unknown>) => [useSchedulerJobServiceGetV1JobsKey, ...(queryKey ?? [])];
export type SchedulerJobServiceGetV1JobsShortNameByShortNameDefaultResponse = Awaited<ReturnType<typeof SchedulerJobService.getV1JobsShortNameByShortName>>;
export type SchedulerJobServiceGetV1JobsShortNameByShortNameQueryResult<TData = SchedulerJobServiceGetV1JobsShortNameByShortNameDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSchedulerJobServiceGetV1JobsShortNameByShortNameKey = "SchedulerJobServiceGetV1JobsShortNameByShortName";
export const UseSchedulerJobServiceGetV1JobsShortNameByShortNameKeyFn = ({ shortName }: {
  shortName: string;
}, queryKey?: Array<unknown>) => [useSchedulerJobServiceGetV1JobsShortNameByShortNameKey, ...(queryKey ?? [{ shortName }])];
export type SchedulerJobServiceGetV1JobsShortNameByShortNameRunhistoryDefaultResponse = Awaited<ReturnType<typeof SchedulerJobService.getV1JobsShortNameByShortNameRunhistory>>;
export type SchedulerJobServiceGetV1JobsShortNameByShortNameRunhistoryQueryResult<TData = SchedulerJobServiceGetV1JobsShortNameByShortNameRunhistoryDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSchedulerJobServiceGetV1JobsShortNameByShortNameRunhistoryKey = "SchedulerJobServiceGetV1JobsShortNameByShortNameRunhistory";
export const UseSchedulerJobServiceGetV1JobsShortNameByShortNameRunhistoryKeyFn = ({ limit, offset, orderBy, shortName, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  shortName: string;
  sortOrder?: string;
}, queryKey?: Array<unknown>) => [useSchedulerJobServiceGetV1JobsShortNameByShortNameRunhistoryKey, ...(queryKey ?? [{ limit, offset, orderBy, shortName, sortOrder }])];
export type SchedulerJobServiceGetV1JobsByJobIdDefaultResponse = Awaited<ReturnType<typeof SchedulerJobService.getV1JobsByJobId>>;
export type SchedulerJobServiceGetV1JobsByJobIdQueryResult<TData = SchedulerJobServiceGetV1JobsByJobIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSchedulerJobServiceGetV1JobsByJobIdKey = "SchedulerJobServiceGetV1JobsByJobId";
export const UseSchedulerJobServiceGetV1JobsByJobIdKeyFn = ({ jobId }: {
  jobId: number;
}, queryKey?: Array<unknown>) => [useSchedulerJobServiceGetV1JobsByJobIdKey, ...(queryKey ?? [{ jobId }])];
export type SchedulerJobServiceGetV1JobsByJobIdRunhistoryDefaultResponse = Awaited<ReturnType<typeof SchedulerJobService.getV1JobsByJobIdRunhistory>>;
export type SchedulerJobServiceGetV1JobsByJobIdRunhistoryQueryResult<TData = SchedulerJobServiceGetV1JobsByJobIdRunhistoryDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSchedulerJobServiceGetV1JobsByJobIdRunhistoryKey = "SchedulerJobServiceGetV1JobsByJobIdRunhistory";
export const UseSchedulerJobServiceGetV1JobsByJobIdRunhistoryKeyFn = ({ jobId, limit, offset, orderBy, sortOrder }: {
  jobId: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
}, queryKey?: Array<unknown>) => [useSchedulerJobServiceGetV1JobsByJobIdRunhistoryKey, ...(queryKey ?? [{ jobId, limit, offset, orderBy, sortOrder }])];
export type BusinessStepConfigurationServiceGetV1JobsNamesDefaultResponse = Awaited<ReturnType<typeof BusinessStepConfigurationService.getV1JobsNames>>;
export type BusinessStepConfigurationServiceGetV1JobsNamesQueryResult<TData = BusinessStepConfigurationServiceGetV1JobsNamesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useBusinessStepConfigurationServiceGetV1JobsNamesKey = "BusinessStepConfigurationServiceGetV1JobsNames";
export const UseBusinessStepConfigurationServiceGetV1JobsNamesKeyFn = (queryKey?: Array<unknown>) => [useBusinessStepConfigurationServiceGetV1JobsNamesKey, ...(queryKey ?? [])];
export type BusinessStepConfigurationServiceGetV1JobsByJobNameAvailableStepsDefaultResponse = Awaited<ReturnType<typeof BusinessStepConfigurationService.getV1JobsByJobNameAvailableSteps>>;
export type BusinessStepConfigurationServiceGetV1JobsByJobNameAvailableStepsQueryResult<TData = BusinessStepConfigurationServiceGetV1JobsByJobNameAvailableStepsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useBusinessStepConfigurationServiceGetV1JobsByJobNameAvailableStepsKey = "BusinessStepConfigurationServiceGetV1JobsByJobNameAvailableSteps";
export const UseBusinessStepConfigurationServiceGetV1JobsByJobNameAvailableStepsKeyFn = ({ jobName }: {
  jobName: string;
}, queryKey?: Array<unknown>) => [useBusinessStepConfigurationServiceGetV1JobsByJobNameAvailableStepsKey, ...(queryKey ?? [{ jobName }])];
export type BusinessStepConfigurationServiceGetV1JobsByJobNameStepsDefaultResponse = Awaited<ReturnType<typeof BusinessStepConfigurationService.getV1JobsByJobNameSteps>>;
export type BusinessStepConfigurationServiceGetV1JobsByJobNameStepsQueryResult<TData = BusinessStepConfigurationServiceGetV1JobsByJobNameStepsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useBusinessStepConfigurationServiceGetV1JobsByJobNameStepsKey = "BusinessStepConfigurationServiceGetV1JobsByJobNameSteps";
export const UseBusinessStepConfigurationServiceGetV1JobsByJobNameStepsKeyFn = ({ jobName }: {
  jobName: string;
}, queryKey?: Array<unknown>) => [useBusinessStepConfigurationServiceGetV1JobsByJobNameStepsKey, ...(queryKey ?? [{ jobName }])];
export type JournalEntriesServiceGetV1JournalentriesDefaultResponse = Awaited<ReturnType<typeof JournalEntriesService.getV1Journalentries>>;
export type JournalEntriesServiceGetV1JournalentriesQueryResult<TData = JournalEntriesServiceGetV1JournalentriesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useJournalEntriesServiceGetV1JournalentriesKey = "JournalEntriesServiceGetV1Journalentries";
export const UseJournalEntriesServiceGetV1JournalentriesKeyFn = ({ dateFormat, entityType, fromDate, glAccountId, limit, loanId, locale, manualEntriesOnly, officeId, offset, orderBy, runningBalance, savingsId, sortOrder, submittedOnDateFrom, submittedOnDateTo, toDate, transactionDetails, transactionId }: {
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
} = {}, queryKey?: Array<unknown>) => [useJournalEntriesServiceGetV1JournalentriesKey, ...(queryKey ?? [{ dateFormat, entityType, fromDate, glAccountId, limit, loanId, locale, manualEntriesOnly, officeId, offset, orderBy, runningBalance, savingsId, sortOrder, submittedOnDateFrom, submittedOnDateTo, toDate, transactionDetails, transactionId }])];
export type JournalEntriesServiceGetV1JournalentriesDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof JournalEntriesService.getV1JournalentriesDownloadtemplate>>;
export type JournalEntriesServiceGetV1JournalentriesDownloadtemplateQueryResult<TData = JournalEntriesServiceGetV1JournalentriesDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useJournalEntriesServiceGetV1JournalentriesDownloadtemplateKey = "JournalEntriesServiceGetV1JournalentriesDownloadtemplate";
export const UseJournalEntriesServiceGetV1JournalentriesDownloadtemplateKeyFn = ({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: Array<unknown>) => [useJournalEntriesServiceGetV1JournalentriesDownloadtemplateKey, ...(queryKey ?? [{ dateFormat, officeId }])];
export type JournalEntriesServiceGetV1JournalentriesOpeningbalanceDefaultResponse = Awaited<ReturnType<typeof JournalEntriesService.getV1JournalentriesOpeningbalance>>;
export type JournalEntriesServiceGetV1JournalentriesOpeningbalanceQueryResult<TData = JournalEntriesServiceGetV1JournalentriesOpeningbalanceDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useJournalEntriesServiceGetV1JournalentriesOpeningbalanceKey = "JournalEntriesServiceGetV1JournalentriesOpeningbalance";
export const UseJournalEntriesServiceGetV1JournalentriesOpeningbalanceKeyFn = ({ currencyCode, officeId }: {
  currencyCode?: string;
  officeId?: number;
} = {}, queryKey?: Array<unknown>) => [useJournalEntriesServiceGetV1JournalentriesOpeningbalanceKey, ...(queryKey ?? [{ currencyCode, officeId }])];
export type JournalEntriesServiceGetV1JournalentriesProvisioningDefaultResponse = Awaited<ReturnType<typeof JournalEntriesService.getV1JournalentriesProvisioning>>;
export type JournalEntriesServiceGetV1JournalentriesProvisioningQueryResult<TData = JournalEntriesServiceGetV1JournalentriesProvisioningDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useJournalEntriesServiceGetV1JournalentriesProvisioningKey = "JournalEntriesServiceGetV1JournalentriesProvisioning";
export const UseJournalEntriesServiceGetV1JournalentriesProvisioningKeyFn = ({ entryId, limit, offset }: {
  entryId?: number;
  limit?: number;
  offset?: number;
} = {}, queryKey?: Array<unknown>) => [useJournalEntriesServiceGetV1JournalentriesProvisioningKey, ...(queryKey ?? [{ entryId, limit, offset }])];
export type JournalEntriesServiceGetV1JournalentriesByJournalEntryIdDefaultResponse = Awaited<ReturnType<typeof JournalEntriesService.getV1JournalentriesByJournalEntryId>>;
export type JournalEntriesServiceGetV1JournalentriesByJournalEntryIdQueryResult<TData = JournalEntriesServiceGetV1JournalentriesByJournalEntryIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useJournalEntriesServiceGetV1JournalentriesByJournalEntryIdKey = "JournalEntriesServiceGetV1JournalentriesByJournalEntryId";
export const UseJournalEntriesServiceGetV1JournalentriesByJournalEntryIdKeyFn = ({ journalEntryId, runningBalance, transactionDetails }: {
  journalEntryId: number;
  runningBalance?: boolean;
  transactionDetails?: boolean;
}, queryKey?: Array<unknown>) => [useJournalEntriesServiceGetV1JournalentriesByJournalEntryIdKey, ...(queryKey ?? [{ journalEntryId, runningBalance, transactionDetails }])];
export type LikelihoodServiceGetV1LikelihoodByPpiNameDefaultResponse = Awaited<ReturnType<typeof LikelihoodService.getV1LikelihoodByPpiName>>;
export type LikelihoodServiceGetV1LikelihoodByPpiNameQueryResult<TData = LikelihoodServiceGetV1LikelihoodByPpiNameDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLikelihoodServiceGetV1LikelihoodByPpiNameKey = "LikelihoodServiceGetV1LikelihoodByPpiName";
export const UseLikelihoodServiceGetV1LikelihoodByPpiNameKeyFn = ({ ppiName }: {
  ppiName: string;
}, queryKey?: Array<unknown>) => [useLikelihoodServiceGetV1LikelihoodByPpiNameKey, ...(queryKey ?? [{ ppiName }])];
export type LikelihoodServiceGetV1LikelihoodByPpiNameByLikelihoodIdDefaultResponse = Awaited<ReturnType<typeof LikelihoodService.getV1LikelihoodByPpiNameByLikelihoodId>>;
export type LikelihoodServiceGetV1LikelihoodByPpiNameByLikelihoodIdQueryResult<TData = LikelihoodServiceGetV1LikelihoodByPpiNameByLikelihoodIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLikelihoodServiceGetV1LikelihoodByPpiNameByLikelihoodIdKey = "LikelihoodServiceGetV1LikelihoodByPpiNameByLikelihoodId";
export const UseLikelihoodServiceGetV1LikelihoodByPpiNameByLikelihoodIdKeyFn = ({ likelihoodId, ppiName }: {
  likelihoodId: number;
  ppiName: string;
}, queryKey?: Array<unknown>) => [useLikelihoodServiceGetV1LikelihoodByPpiNameByLikelihoodIdKey, ...(queryKey ?? [{ likelihoodId, ppiName }])];
export type LoanCollateralManagementServiceGetV1LoanCollateralManagementByCollateralIdDefaultResponse = Awaited<ReturnType<typeof LoanCollateralManagementService.getV1LoanCollateralManagementByCollateralId>>;
export type LoanCollateralManagementServiceGetV1LoanCollateralManagementByCollateralIdQueryResult<TData = LoanCollateralManagementServiceGetV1LoanCollateralManagementByCollateralIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanCollateralManagementServiceGetV1LoanCollateralManagementByCollateralIdKey = "LoanCollateralManagementServiceGetV1LoanCollateralManagementByCollateralId";
export const UseLoanCollateralManagementServiceGetV1LoanCollateralManagementByCollateralIdKeyFn = ({ collateralId }: {
  collateralId: number;
}, queryKey?: Array<unknown>) => [useLoanCollateralManagementServiceGetV1LoanCollateralManagementByCollateralIdKey, ...(queryKey ?? [{ collateralId }])];
export type LoanProductsServiceGetV1LoanproductsDefaultResponse = Awaited<ReturnType<typeof LoanProductsService.getV1Loanproducts>>;
export type LoanProductsServiceGetV1LoanproductsQueryResult<TData = LoanProductsServiceGetV1LoanproductsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanProductsServiceGetV1LoanproductsKey = "LoanProductsServiceGetV1Loanproducts";
export const UseLoanProductsServiceGetV1LoanproductsKeyFn = (queryKey?: Array<unknown>) => [useLoanProductsServiceGetV1LoanproductsKey, ...(queryKey ?? [])];
export type LoanProductsServiceGetV1LoanproductsExternalIdByExternalProductIdDefaultResponse = Awaited<ReturnType<typeof LoanProductsService.getV1LoanproductsExternalIdByExternalProductId>>;
export type LoanProductsServiceGetV1LoanproductsExternalIdByExternalProductIdQueryResult<TData = LoanProductsServiceGetV1LoanproductsExternalIdByExternalProductIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanProductsServiceGetV1LoanproductsExternalIdByExternalProductIdKey = "LoanProductsServiceGetV1LoanproductsExternalIdByExternalProductId";
export const UseLoanProductsServiceGetV1LoanproductsExternalIdByExternalProductIdKeyFn = ({ externalProductId }: {
  externalProductId: string;
}, queryKey?: Array<unknown>) => [useLoanProductsServiceGetV1LoanproductsExternalIdByExternalProductIdKey, ...(queryKey ?? [{ externalProductId }])];
export type LoanProductsServiceGetV1LoanproductsTemplateDefaultResponse = Awaited<ReturnType<typeof LoanProductsService.getV1LoanproductsTemplate>>;
export type LoanProductsServiceGetV1LoanproductsTemplateQueryResult<TData = LoanProductsServiceGetV1LoanproductsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanProductsServiceGetV1LoanproductsTemplateKey = "LoanProductsServiceGetV1LoanproductsTemplate";
export const UseLoanProductsServiceGetV1LoanproductsTemplateKeyFn = ({ isProductMixTemplate }: {
  isProductMixTemplate?: boolean;
} = {}, queryKey?: Array<unknown>) => [useLoanProductsServiceGetV1LoanproductsTemplateKey, ...(queryKey ?? [{ isProductMixTemplate }])];
export type LoanProductsServiceGetV1LoanproductsByProductIdDefaultResponse = Awaited<ReturnType<typeof LoanProductsService.getV1LoanproductsByProductId>>;
export type LoanProductsServiceGetV1LoanproductsByProductIdQueryResult<TData = LoanProductsServiceGetV1LoanproductsByProductIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanProductsServiceGetV1LoanproductsByProductIdKey = "LoanProductsServiceGetV1LoanproductsByProductId";
export const UseLoanProductsServiceGetV1LoanproductsByProductIdKeyFn = ({ productId }: {
  productId: number;
}, queryKey?: Array<unknown>) => [useLoanProductsServiceGetV1LoanproductsByProductIdKey, ...(queryKey ?? [{ productId }])];
export type ProductMixServiceGetV1LoanproductsByProductIdProductmixDefaultResponse = Awaited<ReturnType<typeof ProductMixService.getV1LoanproductsByProductIdProductmix>>;
export type ProductMixServiceGetV1LoanproductsByProductIdProductmixQueryResult<TData = ProductMixServiceGetV1LoanproductsByProductIdProductmixDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProductMixServiceGetV1LoanproductsByProductIdProductmixKey = "ProductMixServiceGetV1LoanproductsByProductIdProductmix";
export const UseProductMixServiceGetV1LoanproductsByProductIdProductmixKeyFn = ({ productId }: {
  productId: number;
}, queryKey?: Array<unknown>) => [useProductMixServiceGetV1LoanproductsByProductIdProductmixKey, ...(queryKey ?? [{ productId }])];
export type LoansServiceGetV1LoansDefaultResponse = Awaited<ReturnType<typeof LoansService.getV1Loans>>;
export type LoansServiceGetV1LoansQueryResult<TData = LoansServiceGetV1LoansDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoansServiceGetV1LoansKey = "LoansServiceGetV1Loans";
export const UseLoansServiceGetV1LoansKeyFn = ({ accountNo, associations, clientId, externalId, limit, offset, orderBy, sortOrder, status }: {
  accountNo?: string;
  associations?: string;
  clientId?: number;
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  status?: string;
} = {}, queryKey?: Array<unknown>) => [useLoansServiceGetV1LoansKey, ...(queryKey ?? [{ accountNo, associations, clientId, externalId, limit, offset, orderBy, sortOrder, status }])];
export type LoansServiceGetV1LoansDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof LoansService.getV1LoansDownloadtemplate>>;
export type LoansServiceGetV1LoansDownloadtemplateQueryResult<TData = LoansServiceGetV1LoansDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoansServiceGetV1LoansDownloadtemplateKey = "LoansServiceGetV1LoansDownloadtemplate";
export const UseLoansServiceGetV1LoansDownloadtemplateKeyFn = ({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: Array<unknown>) => [useLoansServiceGetV1LoansDownloadtemplateKey, ...(queryKey ?? [{ dateFormat, officeId, staffId }])];
export type LoansServiceGetV1LoansExternalIdByLoanExternalIdDefaultResponse = Awaited<ReturnType<typeof LoansService.getV1LoansExternalIdByLoanExternalId>>;
export type LoansServiceGetV1LoansExternalIdByLoanExternalIdQueryResult<TData = LoansServiceGetV1LoansExternalIdByLoanExternalIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoansServiceGetV1LoansExternalIdByLoanExternalIdKey = "LoansServiceGetV1LoansExternalIdByLoanExternalId";
export const UseLoansServiceGetV1LoansExternalIdByLoanExternalIdKeyFn = ({ associations, exclude, fields, loanExternalId, staffInSelectedOfficeOnly }: {
  associations?: string;
  exclude?: string;
  fields?: string;
  loanExternalId: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: Array<unknown>) => [useLoansServiceGetV1LoansExternalIdByLoanExternalIdKey, ...(queryKey ?? [{ associations, exclude, fields, loanExternalId, staffInSelectedOfficeOnly }])];
export type LoansServiceGetV1LoansExternalIdByLoanExternalIdApprovedAmountDefaultResponse = Awaited<ReturnType<typeof LoansService.getV1LoansExternalIdByLoanExternalIdApprovedAmount>>;
export type LoansServiceGetV1LoansExternalIdByLoanExternalIdApprovedAmountQueryResult<TData = LoansServiceGetV1LoansExternalIdByLoanExternalIdApprovedAmountDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoansServiceGetV1LoansExternalIdByLoanExternalIdApprovedAmountKey = "LoansServiceGetV1LoansExternalIdByLoanExternalIdApprovedAmount";
export const UseLoansServiceGetV1LoansExternalIdByLoanExternalIdApprovedAmountKeyFn = ({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: Array<unknown>) => [useLoansServiceGetV1LoansExternalIdByLoanExternalIdApprovedAmountKey, ...(queryKey ?? [{ loanExternalId }])];
export type LoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencyActionsDefaultResponse = Awaited<ReturnType<typeof LoansService.getV1LoansExternalIdByLoanExternalIdDelinquencyActions>>;
export type LoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencyActionsQueryResult<TData = LoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencyActionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencyActionsKey = "LoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencyActions";
export const UseLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencyActionsKeyFn = ({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: Array<unknown>) => [useLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencyActionsKey, ...(queryKey ?? [{ loanExternalId }])];
export type LoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencytagsDefaultResponse = Awaited<ReturnType<typeof LoansService.getV1LoansExternalIdByLoanExternalIdDelinquencytags>>;
export type LoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencytagsQueryResult<TData = LoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencytagsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencytagsKey = "LoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencytags";
export const UseLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencytagsKeyFn = ({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: Array<unknown>) => [useLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencytagsKey, ...(queryKey ?? [{ loanExternalId }])];
export type LoansServiceGetV1LoansExternalIdByLoanExternalIdTemplateDefaultResponse = Awaited<ReturnType<typeof LoansService.getV1LoansExternalIdByLoanExternalIdTemplate>>;
export type LoansServiceGetV1LoansExternalIdByLoanExternalIdTemplateQueryResult<TData = LoansServiceGetV1LoansExternalIdByLoanExternalIdTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoansServiceGetV1LoansExternalIdByLoanExternalIdTemplateKey = "LoansServiceGetV1LoansExternalIdByLoanExternalIdTemplate";
export const UseLoansServiceGetV1LoansExternalIdByLoanExternalIdTemplateKeyFn = ({ loanExternalId, templateType }: {
  loanExternalId: string;
  templateType?: string;
}, queryKey?: Array<unknown>) => [useLoansServiceGetV1LoansExternalIdByLoanExternalIdTemplateKey, ...(queryKey ?? [{ loanExternalId, templateType }])];
export type LoansServiceGetV1LoansGlimAccountByGlimIdDefaultResponse = Awaited<ReturnType<typeof LoansService.getV1LoansGlimAccountByGlimId>>;
export type LoansServiceGetV1LoansGlimAccountByGlimIdQueryResult<TData = LoansServiceGetV1LoansGlimAccountByGlimIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoansServiceGetV1LoansGlimAccountByGlimIdKey = "LoansServiceGetV1LoansGlimAccountByGlimId";
export const UseLoansServiceGetV1LoansGlimAccountByGlimIdKeyFn = ({ glimId }: {
  glimId: number;
}, queryKey?: Array<unknown>) => [useLoansServiceGetV1LoansGlimAccountByGlimIdKey, ...(queryKey ?? [{ glimId }])];
export type LoansServiceGetV1LoansRepaymentsDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof LoansService.getV1LoansRepaymentsDownloadtemplate>>;
export type LoansServiceGetV1LoansRepaymentsDownloadtemplateQueryResult<TData = LoansServiceGetV1LoansRepaymentsDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoansServiceGetV1LoansRepaymentsDownloadtemplateKey = "LoansServiceGetV1LoansRepaymentsDownloadtemplate";
export const UseLoansServiceGetV1LoansRepaymentsDownloadtemplateKeyFn = ({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: Array<unknown>) => [useLoansServiceGetV1LoansRepaymentsDownloadtemplateKey, ...(queryKey ?? [{ dateFormat, officeId }])];
export type LoansServiceGetV1LoansTemplateDefaultResponse = Awaited<ReturnType<typeof LoansService.getV1LoansTemplate>>;
export type LoansServiceGetV1LoansTemplateQueryResult<TData = LoansServiceGetV1LoansTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoansServiceGetV1LoansTemplateKey = "LoansServiceGetV1LoansTemplate";
export const UseLoansServiceGetV1LoansTemplateKeyFn = ({ activeOnly, clientId, groupId, productId, staffInSelectedOfficeOnly, templateType }: {
  activeOnly?: boolean;
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
  templateType?: string;
} = {}, queryKey?: Array<unknown>) => [useLoansServiceGetV1LoansTemplateKey, ...(queryKey ?? [{ activeOnly, clientId, groupId, productId, staffInSelectedOfficeOnly, templateType }])];
export type LoansServiceGetV1LoansByLoanIdDefaultResponse = Awaited<ReturnType<typeof LoansService.getV1LoansByLoanId>>;
export type LoansServiceGetV1LoansByLoanIdQueryResult<TData = LoansServiceGetV1LoansByLoanIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoansServiceGetV1LoansByLoanIdKey = "LoansServiceGetV1LoansByLoanId";
export const UseLoansServiceGetV1LoansByLoanIdKeyFn = ({ associations, exclude, fields, loanId, staffInSelectedOfficeOnly }: {
  associations?: string;
  exclude?: string;
  fields?: string;
  loanId: number;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: Array<unknown>) => [useLoansServiceGetV1LoansByLoanIdKey, ...(queryKey ?? [{ associations, exclude, fields, loanId, staffInSelectedOfficeOnly }])];
export type LoansServiceGetV1LoansByLoanIdApprovedAmountDefaultResponse = Awaited<ReturnType<typeof LoansService.getV1LoansByLoanIdApprovedAmount>>;
export type LoansServiceGetV1LoansByLoanIdApprovedAmountQueryResult<TData = LoansServiceGetV1LoansByLoanIdApprovedAmountDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoansServiceGetV1LoansByLoanIdApprovedAmountKey = "LoansServiceGetV1LoansByLoanIdApprovedAmount";
export const UseLoansServiceGetV1LoansByLoanIdApprovedAmountKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useLoansServiceGetV1LoansByLoanIdApprovedAmountKey, ...(queryKey ?? [{ loanId }])];
export type LoansServiceGetV1LoansByLoanIdDelinquencyActionsDefaultResponse = Awaited<ReturnType<typeof LoansService.getV1LoansByLoanIdDelinquencyActions>>;
export type LoansServiceGetV1LoansByLoanIdDelinquencyActionsQueryResult<TData = LoansServiceGetV1LoansByLoanIdDelinquencyActionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoansServiceGetV1LoansByLoanIdDelinquencyActionsKey = "LoansServiceGetV1LoansByLoanIdDelinquencyActions";
export const UseLoansServiceGetV1LoansByLoanIdDelinquencyActionsKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useLoansServiceGetV1LoansByLoanIdDelinquencyActionsKey, ...(queryKey ?? [{ loanId }])];
export type LoansServiceGetV1LoansByLoanIdDelinquencytagsDefaultResponse = Awaited<ReturnType<typeof LoansService.getV1LoansByLoanIdDelinquencytags>>;
export type LoansServiceGetV1LoansByLoanIdDelinquencytagsQueryResult<TData = LoansServiceGetV1LoansByLoanIdDelinquencytagsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoansServiceGetV1LoansByLoanIdDelinquencytagsKey = "LoansServiceGetV1LoansByLoanIdDelinquencytags";
export const UseLoansServiceGetV1LoansByLoanIdDelinquencytagsKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useLoansServiceGetV1LoansByLoanIdDelinquencytagsKey, ...(queryKey ?? [{ loanId }])];
export type LoansServiceGetV1LoansByLoanIdTemplateDefaultResponse = Awaited<ReturnType<typeof LoansService.getV1LoansByLoanIdTemplate>>;
export type LoansServiceGetV1LoansByLoanIdTemplateQueryResult<TData = LoansServiceGetV1LoansByLoanIdTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoansServiceGetV1LoansByLoanIdTemplateKey = "LoansServiceGetV1LoansByLoanIdTemplate";
export const UseLoansServiceGetV1LoansByLoanIdTemplateKeyFn = ({ loanId, templateType }: {
  loanId: number;
  templateType?: string;
}, queryKey?: Array<unknown>) => [useLoansServiceGetV1LoansByLoanIdTemplateKey, ...(queryKey ?? [{ loanId, templateType }])];
export type LoansPointInTimeServiceGetV1LoansAtDateExternalIdByLoanExternalIdDefaultResponse = Awaited<ReturnType<typeof LoansPointInTimeService.getV1LoansAtDateExternalIdByLoanExternalId>>;
export type LoansPointInTimeServiceGetV1LoansAtDateExternalIdByLoanExternalIdQueryResult<TData = LoansPointInTimeServiceGetV1LoansAtDateExternalIdByLoanExternalIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoansPointInTimeServiceGetV1LoansAtDateExternalIdByLoanExternalIdKey = "LoansPointInTimeServiceGetV1LoansAtDateExternalIdByLoanExternalId";
export const UseLoansPointInTimeServiceGetV1LoansAtDateExternalIdByLoanExternalIdKeyFn = ({ date, dateFormat, loanExternalId, locale }: {
  date: DateParam;
  dateFormat?: string;
  loanExternalId: string;
  locale?: string;
}, queryKey?: Array<unknown>) => [useLoansPointInTimeServiceGetV1LoansAtDateExternalIdByLoanExternalIdKey, ...(queryKey ?? [{ date, dateFormat, loanExternalId, locale }])];
export type LoansPointInTimeServiceGetV1LoansAtDateByLoanIdDefaultResponse = Awaited<ReturnType<typeof LoansPointInTimeService.getV1LoansAtDateByLoanId>>;
export type LoansPointInTimeServiceGetV1LoansAtDateByLoanIdQueryResult<TData = LoansPointInTimeServiceGetV1LoansAtDateByLoanIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoansPointInTimeServiceGetV1LoansAtDateByLoanIdKey = "LoansPointInTimeServiceGetV1LoansAtDateByLoanId";
export const UseLoansPointInTimeServiceGetV1LoansAtDateByLoanIdKeyFn = ({ date, dateFormat, loanId, locale }: {
  date: DateParam;
  dateFormat?: string;
  loanId: number;
  locale?: string;
}, queryKey?: Array<unknown>) => [useLoansPointInTimeServiceGetV1LoansAtDateByLoanIdKey, ...(queryKey ?? [{ date, dateFormat, loanId, locale }])];
export type LoanCobCatchUpServiceGetV1LoansIsCatchUpRunningDefaultResponse = Awaited<ReturnType<typeof LoanCobCatchUpService.getV1LoansIsCatchUpRunning>>;
export type LoanCobCatchUpServiceGetV1LoansIsCatchUpRunningQueryResult<TData = LoanCobCatchUpServiceGetV1LoansIsCatchUpRunningDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanCobCatchUpServiceGetV1LoansIsCatchUpRunningKey = "LoanCobCatchUpServiceGetV1LoansIsCatchUpRunning";
export const UseLoanCobCatchUpServiceGetV1LoansIsCatchUpRunningKeyFn = (queryKey?: Array<unknown>) => [useLoanCobCatchUpServiceGetV1LoansIsCatchUpRunningKey, ...(queryKey ?? [])];
export type LoanCobCatchUpServiceGetV1LoansOldestCobClosedDefaultResponse = Awaited<ReturnType<typeof LoanCobCatchUpService.getV1LoansOldestCobClosed>>;
export type LoanCobCatchUpServiceGetV1LoansOldestCobClosedQueryResult<TData = LoanCobCatchUpServiceGetV1LoansOldestCobClosedDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanCobCatchUpServiceGetV1LoansOldestCobClosedKey = "LoanCobCatchUpServiceGetV1LoansOldestCobClosed";
export const UseLoanCobCatchUpServiceGetV1LoansOldestCobClosedKeyFn = (queryKey?: Array<unknown>) => [useLoanCobCatchUpServiceGetV1LoansOldestCobClosedKey, ...(queryKey ?? [])];
export type LoanBuyDownFeesServiceGetV1LoansExternalIdByLoanExternalIdBuydownFeesDefaultResponse = Awaited<ReturnType<typeof LoanBuyDownFeesService.getV1LoansExternalIdByLoanExternalIdBuydownFees>>;
export type LoanBuyDownFeesServiceGetV1LoansExternalIdByLoanExternalIdBuydownFeesQueryResult<TData = LoanBuyDownFeesServiceGetV1LoansExternalIdByLoanExternalIdBuydownFeesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanBuyDownFeesServiceGetV1LoansExternalIdByLoanExternalIdBuydownFeesKey = "LoanBuyDownFeesServiceGetV1LoansExternalIdByLoanExternalIdBuydownFees";
export const UseLoanBuyDownFeesServiceGetV1LoansExternalIdByLoanExternalIdBuydownFeesKeyFn = ({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: Array<unknown>) => [useLoanBuyDownFeesServiceGetV1LoansExternalIdByLoanExternalIdBuydownFeesKey, ...(queryKey ?? [{ loanExternalId }])];
export type LoanBuyDownFeesServiceGetV1LoansByLoanIdBuydownFeesDefaultResponse = Awaited<ReturnType<typeof LoanBuyDownFeesService.getV1LoansByLoanIdBuydownFees>>;
export type LoanBuyDownFeesServiceGetV1LoansByLoanIdBuydownFeesQueryResult<TData = LoanBuyDownFeesServiceGetV1LoansByLoanIdBuydownFeesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanBuyDownFeesServiceGetV1LoansByLoanIdBuydownFeesKey = "LoanBuyDownFeesServiceGetV1LoansByLoanIdBuydownFees";
export const UseLoanBuyDownFeesServiceGetV1LoansByLoanIdBuydownFeesKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useLoanBuyDownFeesServiceGetV1LoansByLoanIdBuydownFeesKey, ...(queryKey ?? [{ loanId }])];
export type LoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdCapitalizedIncomesDefaultResponse = Awaited<ReturnType<typeof LoanCapitalizedIncomeService.getV1LoansExternalIdByLoanExternalIdCapitalizedIncomes>>;
export type LoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdCapitalizedIncomesQueryResult<TData = LoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdCapitalizedIncomesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdCapitalizedIncomesKey = "LoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdCapitalizedIncomes";
export const UseLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdCapitalizedIncomesKeyFn = ({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: Array<unknown>) => [useLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdCapitalizedIncomesKey, ...(queryKey ?? [{ loanExternalId }])];
export type LoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdDeferredincomeDefaultResponse = Awaited<ReturnType<typeof LoanCapitalizedIncomeService.getV1LoansExternalIdByLoanExternalIdDeferredincome>>;
export type LoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdDeferredincomeQueryResult<TData = LoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdDeferredincomeDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdDeferredincomeKey = "LoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdDeferredincome";
export const UseLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdDeferredincomeKeyFn = ({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: Array<unknown>) => [useLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdDeferredincomeKey, ...(queryKey ?? [{ loanExternalId }])];
export type LoanCapitalizedIncomeServiceGetV1LoansByLoanIdCapitalizedIncomesDefaultResponse = Awaited<ReturnType<typeof LoanCapitalizedIncomeService.getV1LoansByLoanIdCapitalizedIncomes>>;
export type LoanCapitalizedIncomeServiceGetV1LoansByLoanIdCapitalizedIncomesQueryResult<TData = LoanCapitalizedIncomeServiceGetV1LoansByLoanIdCapitalizedIncomesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanCapitalizedIncomeServiceGetV1LoansByLoanIdCapitalizedIncomesKey = "LoanCapitalizedIncomeServiceGetV1LoansByLoanIdCapitalizedIncomes";
export const UseLoanCapitalizedIncomeServiceGetV1LoansByLoanIdCapitalizedIncomesKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useLoanCapitalizedIncomeServiceGetV1LoansByLoanIdCapitalizedIncomesKey, ...(queryKey ?? [{ loanId }])];
export type LoanCapitalizedIncomeServiceGetV1LoansByLoanIdDeferredincomeDefaultResponse = Awaited<ReturnType<typeof LoanCapitalizedIncomeService.getV1LoansByLoanIdDeferredincome>>;
export type LoanCapitalizedIncomeServiceGetV1LoansByLoanIdDeferredincomeQueryResult<TData = LoanCapitalizedIncomeServiceGetV1LoansByLoanIdDeferredincomeDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanCapitalizedIncomeServiceGetV1LoansByLoanIdDeferredincomeKey = "LoanCapitalizedIncomeServiceGetV1LoansByLoanIdDeferredincome";
export const UseLoanCapitalizedIncomeServiceGetV1LoansByLoanIdDeferredincomeKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useLoanCapitalizedIncomeServiceGetV1LoansByLoanIdDeferredincomeKey, ...(queryKey ?? [{ loanId }])];
export type LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesDefaultResponse = Awaited<ReturnType<typeof LoanChargesService.getV1LoansExternalIdByLoanExternalIdCharges>>;
export type LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesQueryResult<TData = LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesKey = "LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdCharges";
export const UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesKeyFn = ({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: Array<unknown>) => [useLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesKey, ...(queryKey ?? [{ loanExternalId }])];
export type LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdDefaultResponse = Awaited<ReturnType<typeof LoanChargesService.getV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalId>>;
export type LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdQueryResult<TData = LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdKey = "LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalId";
export const UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdKeyFn = ({ loanChargeExternalId, loanExternalId }: {
  loanChargeExternalId: string;
  loanExternalId: string;
}, queryKey?: Array<unknown>) => [useLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdKey, ...(queryKey ?? [{ loanChargeExternalId, loanExternalId }])];
export type LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesTemplateDefaultResponse = Awaited<ReturnType<typeof LoanChargesService.getV1LoansExternalIdByLoanExternalIdChargesTemplate>>;
export type LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesTemplateQueryResult<TData = LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesTemplateKey = "LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesTemplate";
export const UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesTemplateKeyFn = ({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: Array<unknown>) => [useLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesTemplateKey, ...(queryKey ?? [{ loanExternalId }])];
export type LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdDefaultResponse = Awaited<ReturnType<typeof LoanChargesService.getV1LoansExternalIdByLoanExternalIdChargesByLoanChargeId>>;
export type LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdQueryResult<TData = LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdKey = "LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesByLoanChargeId";
export const UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdKeyFn = ({ loanChargeId, loanExternalId }: {
  loanChargeId: number;
  loanExternalId: string;
}, queryKey?: Array<unknown>) => [useLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdKey, ...(queryKey ?? [{ loanChargeId, loanExternalId }])];
export type LoanChargesServiceGetV1LoansByLoanIdChargesDefaultResponse = Awaited<ReturnType<typeof LoanChargesService.getV1LoansByLoanIdCharges>>;
export type LoanChargesServiceGetV1LoansByLoanIdChargesQueryResult<TData = LoanChargesServiceGetV1LoansByLoanIdChargesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanChargesServiceGetV1LoansByLoanIdChargesKey = "LoanChargesServiceGetV1LoansByLoanIdCharges";
export const UseLoanChargesServiceGetV1LoansByLoanIdChargesKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useLoanChargesServiceGetV1LoansByLoanIdChargesKey, ...(queryKey ?? [{ loanId }])];
export type LoanChargesServiceGetV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdDefaultResponse = Awaited<ReturnType<typeof LoanChargesService.getV1LoansByLoanIdChargesExternalIdByLoanChargeExternalId>>;
export type LoanChargesServiceGetV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdQueryResult<TData = LoanChargesServiceGetV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanChargesServiceGetV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdKey = "LoanChargesServiceGetV1LoansByLoanIdChargesExternalIdByLoanChargeExternalId";
export const UseLoanChargesServiceGetV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdKeyFn = ({ loanChargeExternalId, loanId }: {
  loanChargeExternalId: string;
  loanId: number;
}, queryKey?: Array<unknown>) => [useLoanChargesServiceGetV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdKey, ...(queryKey ?? [{ loanChargeExternalId, loanId }])];
export type LoanChargesServiceGetV1LoansByLoanIdChargesTemplateDefaultResponse = Awaited<ReturnType<typeof LoanChargesService.getV1LoansByLoanIdChargesTemplate>>;
export type LoanChargesServiceGetV1LoansByLoanIdChargesTemplateQueryResult<TData = LoanChargesServiceGetV1LoansByLoanIdChargesTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanChargesServiceGetV1LoansByLoanIdChargesTemplateKey = "LoanChargesServiceGetV1LoansByLoanIdChargesTemplate";
export const UseLoanChargesServiceGetV1LoansByLoanIdChargesTemplateKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useLoanChargesServiceGetV1LoansByLoanIdChargesTemplateKey, ...(queryKey ?? [{ loanId }])];
export type LoanChargesServiceGetV1LoansByLoanIdChargesByLoanChargeIdDefaultResponse = Awaited<ReturnType<typeof LoanChargesService.getV1LoansByLoanIdChargesByLoanChargeId>>;
export type LoanChargesServiceGetV1LoansByLoanIdChargesByLoanChargeIdQueryResult<TData = LoanChargesServiceGetV1LoansByLoanIdChargesByLoanChargeIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanChargesServiceGetV1LoansByLoanIdChargesByLoanChargeIdKey = "LoanChargesServiceGetV1LoansByLoanIdChargesByLoanChargeId";
export const UseLoanChargesServiceGetV1LoansByLoanIdChargesByLoanChargeIdKeyFn = ({ loanChargeId, loanId }: {
  loanChargeId: number;
  loanId: number;
}, queryKey?: Array<unknown>) => [useLoanChargesServiceGetV1LoansByLoanIdChargesByLoanChargeIdKey, ...(queryKey ?? [{ loanChargeId, loanId }])];
export type LoanInterestPauseServiceGetV1LoansExternalIdByLoanExternalIdInterestPausesDefaultResponse = Awaited<ReturnType<typeof LoanInterestPauseService.getV1LoansExternalIdByLoanExternalIdInterestPauses>>;
export type LoanInterestPauseServiceGetV1LoansExternalIdByLoanExternalIdInterestPausesQueryResult<TData = LoanInterestPauseServiceGetV1LoansExternalIdByLoanExternalIdInterestPausesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanInterestPauseServiceGetV1LoansExternalIdByLoanExternalIdInterestPausesKey = "LoanInterestPauseServiceGetV1LoansExternalIdByLoanExternalIdInterestPauses";
export const UseLoanInterestPauseServiceGetV1LoansExternalIdByLoanExternalIdInterestPausesKeyFn = ({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: Array<unknown>) => [useLoanInterestPauseServiceGetV1LoansExternalIdByLoanExternalIdInterestPausesKey, ...(queryKey ?? [{ loanExternalId }])];
export type LoanInterestPauseServiceGetV1LoansByLoanIdInterestPausesDefaultResponse = Awaited<ReturnType<typeof LoanInterestPauseService.getV1LoansByLoanIdInterestPauses>>;
export type LoanInterestPauseServiceGetV1LoansByLoanIdInterestPausesQueryResult<TData = LoanInterestPauseServiceGetV1LoansByLoanIdInterestPausesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanInterestPauseServiceGetV1LoansByLoanIdInterestPausesKey = "LoanInterestPauseServiceGetV1LoansByLoanIdInterestPauses";
export const UseLoanInterestPauseServiceGetV1LoansByLoanIdInterestPausesKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useLoanInterestPauseServiceGetV1LoansByLoanIdInterestPausesKey, ...(queryKey ?? [{ loanId }])];
export type LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsDefaultResponse = Awaited<ReturnType<typeof LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactions>>;
export type LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsQueryResult<TData = LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsKey = "LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactions";
export const UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsKeyFn = ({ excludedTypes, loanExternalId, page, size, sort }: {
  excludedTypes?: TransactionType[];
  loanExternalId: string;
  page?: number;
  size?: number;
  sort?: string;
}, queryKey?: Array<unknown>) => [useLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsKey, ...(queryKey ?? [{ excludedTypes, loanExternalId, page, size, sort }])];
export type LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionIdDefaultResponse = Awaited<ReturnType<typeof LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionId>>;
export type LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionIdQueryResult<TData = LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionIdKey = "LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionId";
export const UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionIdKeyFn = ({ externalTransactionId, fields, loanExternalId }: {
  externalTransactionId: string;
  fields?: string;
  loanExternalId: string;
}, queryKey?: Array<unknown>) => [useLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionIdKey, ...(queryKey ?? [{ externalTransactionId, fields, loanExternalId }])];
export type LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsTemplateDefaultResponse = Awaited<ReturnType<typeof LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactionsTemplate>>;
export type LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsTemplateQueryResult<TData = LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsTemplateKey = "LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsTemplate";
export const UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsTemplateKeyFn = ({ command, dateFormat, loanExternalId, locale, transactionDate, transactionId }: {
  command?: string;
  dateFormat?: string;
  loanExternalId: string;
  locale?: string;
  transactionDate?: DateParam;
  transactionId?: number;
}, queryKey?: Array<unknown>) => [useLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsTemplateKey, ...(queryKey ?? [{ command, dateFormat, loanExternalId, locale, transactionDate, transactionId }])];
export type LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdDefaultResponse = Awaited<ReturnType<typeof LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactionsByTransactionId>>;
export type LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdQueryResult<TData = LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdKey = "LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsByTransactionId";
export const UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdKeyFn = ({ fields, loanExternalId, transactionId }: {
  fields?: string;
  loanExternalId: string;
  transactionId: number;
}, queryKey?: Array<unknown>) => [useLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdKey, ...(queryKey ?? [{ fields, loanExternalId, transactionId }])];
export type LoanTransactionsServiceGetV1LoansByLoanIdTransactionsDefaultResponse = Awaited<ReturnType<typeof LoanTransactionsService.getV1LoansByLoanIdTransactions>>;
export type LoanTransactionsServiceGetV1LoansByLoanIdTransactionsQueryResult<TData = LoanTransactionsServiceGetV1LoansByLoanIdTransactionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanTransactionsServiceGetV1LoansByLoanIdTransactionsKey = "LoanTransactionsServiceGetV1LoansByLoanIdTransactions";
export const UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsKeyFn = ({ excludedTypes, loanId, page, size, sort }: {
  excludedTypes?: TransactionType[];
  loanId: number;
  page?: number;
  size?: number;
  sort?: string;
}, queryKey?: Array<unknown>) => [useLoanTransactionsServiceGetV1LoansByLoanIdTransactionsKey, ...(queryKey ?? [{ excludedTypes, loanId, page, size, sort }])];
export type LoanTransactionsServiceGetV1LoansByLoanIdTransactionsExternalIdByExternalTransactionIdDefaultResponse = Awaited<ReturnType<typeof LoanTransactionsService.getV1LoansByLoanIdTransactionsExternalIdByExternalTransactionId>>;
export type LoanTransactionsServiceGetV1LoansByLoanIdTransactionsExternalIdByExternalTransactionIdQueryResult<TData = LoanTransactionsServiceGetV1LoansByLoanIdTransactionsExternalIdByExternalTransactionIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanTransactionsServiceGetV1LoansByLoanIdTransactionsExternalIdByExternalTransactionIdKey = "LoanTransactionsServiceGetV1LoansByLoanIdTransactionsExternalIdByExternalTransactionId";
export const UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsExternalIdByExternalTransactionIdKeyFn = ({ externalTransactionId, fields, loanId }: {
  externalTransactionId: string;
  fields?: string;
  loanId: number;
}, queryKey?: Array<unknown>) => [useLoanTransactionsServiceGetV1LoansByLoanIdTransactionsExternalIdByExternalTransactionIdKey, ...(queryKey ?? [{ externalTransactionId, fields, loanId }])];
export type LoanTransactionsServiceGetV1LoansByLoanIdTransactionsTemplateDefaultResponse = Awaited<ReturnType<typeof LoanTransactionsService.getV1LoansByLoanIdTransactionsTemplate>>;
export type LoanTransactionsServiceGetV1LoansByLoanIdTransactionsTemplateQueryResult<TData = LoanTransactionsServiceGetV1LoansByLoanIdTransactionsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanTransactionsServiceGetV1LoansByLoanIdTransactionsTemplateKey = "LoanTransactionsServiceGetV1LoansByLoanIdTransactionsTemplate";
export const UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsTemplateKeyFn = ({ command, dateFormat, loanId, locale, transactionDate, transactionId }: {
  command?: string;
  dateFormat?: string;
  loanId: number;
  locale?: string;
  transactionDate?: DateParam;
  transactionId?: number;
}, queryKey?: Array<unknown>) => [useLoanTransactionsServiceGetV1LoansByLoanIdTransactionsTemplateKey, ...(queryKey ?? [{ command, dateFormat, loanId, locale, transactionDate, transactionId }])];
export type LoanTransactionsServiceGetV1LoansByLoanIdTransactionsByTransactionIdDefaultResponse = Awaited<ReturnType<typeof LoanTransactionsService.getV1LoansByLoanIdTransactionsByTransactionId>>;
export type LoanTransactionsServiceGetV1LoansByLoanIdTransactionsByTransactionIdQueryResult<TData = LoanTransactionsServiceGetV1LoansByLoanIdTransactionsByTransactionIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanTransactionsServiceGetV1LoansByLoanIdTransactionsByTransactionIdKey = "LoanTransactionsServiceGetV1LoansByLoanIdTransactionsByTransactionId";
export const UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsByTransactionIdKeyFn = ({ fields, loanId, transactionId }: {
  fields?: string;
  loanId: number;
  transactionId: number;
}, queryKey?: Array<unknown>) => [useLoanTransactionsServiceGetV1LoansByLoanIdTransactionsByTransactionIdKey, ...(queryKey ?? [{ fields, loanId, transactionId }])];
export type BulkLoansServiceGetV1LoansLoanreassignmentTemplateDefaultResponse = Awaited<ReturnType<typeof BulkLoansService.getV1LoansLoanreassignmentTemplate>>;
export type BulkLoansServiceGetV1LoansLoanreassignmentTemplateQueryResult<TData = BulkLoansServiceGetV1LoansLoanreassignmentTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useBulkLoansServiceGetV1LoansLoanreassignmentTemplateKey = "BulkLoansServiceGetV1LoansLoanreassignmentTemplate";
export const UseBulkLoansServiceGetV1LoansLoanreassignmentTemplateKeyFn = ({ fromLoanOfficerId, officeId }: {
  fromLoanOfficerId?: number;
  officeId?: number;
} = {}, queryKey?: Array<unknown>) => [useBulkLoansServiceGetV1LoansLoanreassignmentTemplateKey, ...(queryKey ?? [{ fromLoanOfficerId, officeId }])];
export type LoanAccountLockServiceGetV1LoansLockedDefaultResponse = Awaited<ReturnType<typeof LoanAccountLockService.getV1LoansLocked>>;
export type LoanAccountLockServiceGetV1LoansLockedQueryResult<TData = LoanAccountLockServiceGetV1LoansLockedDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanAccountLockServiceGetV1LoansLockedKey = "LoanAccountLockServiceGetV1LoansLocked";
export const UseLoanAccountLockServiceGetV1LoansLockedKeyFn = ({ limit, page }: {
  limit?: number;
  page?: number;
} = {}, queryKey?: Array<unknown>) => [useLoanAccountLockServiceGetV1LoansLockedKey, ...(queryKey ?? [{ limit, page }])];
export type LoanCollateralServiceGetV1LoansByLoanIdCollateralsDefaultResponse = Awaited<ReturnType<typeof LoanCollateralService.getV1LoansByLoanIdCollaterals>>;
export type LoanCollateralServiceGetV1LoansByLoanIdCollateralsQueryResult<TData = LoanCollateralServiceGetV1LoansByLoanIdCollateralsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanCollateralServiceGetV1LoansByLoanIdCollateralsKey = "LoanCollateralServiceGetV1LoansByLoanIdCollaterals";
export const UseLoanCollateralServiceGetV1LoansByLoanIdCollateralsKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useLoanCollateralServiceGetV1LoansByLoanIdCollateralsKey, ...(queryKey ?? [{ loanId }])];
export type LoanCollateralServiceGetV1LoansByLoanIdCollateralsTemplateDefaultResponse = Awaited<ReturnType<typeof LoanCollateralService.getV1LoansByLoanIdCollateralsTemplate>>;
export type LoanCollateralServiceGetV1LoansByLoanIdCollateralsTemplateQueryResult<TData = LoanCollateralServiceGetV1LoansByLoanIdCollateralsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanCollateralServiceGetV1LoansByLoanIdCollateralsTemplateKey = "LoanCollateralServiceGetV1LoansByLoanIdCollateralsTemplate";
export const UseLoanCollateralServiceGetV1LoansByLoanIdCollateralsTemplateKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useLoanCollateralServiceGetV1LoansByLoanIdCollateralsTemplateKey, ...(queryKey ?? [{ loanId }])];
export type LoanCollateralServiceGetV1LoansByLoanIdCollateralsByCollateralIdDefaultResponse = Awaited<ReturnType<typeof LoanCollateralService.getV1LoansByLoanIdCollateralsByCollateralId>>;
export type LoanCollateralServiceGetV1LoansByLoanIdCollateralsByCollateralIdQueryResult<TData = LoanCollateralServiceGetV1LoansByLoanIdCollateralsByCollateralIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanCollateralServiceGetV1LoansByLoanIdCollateralsByCollateralIdKey = "LoanCollateralServiceGetV1LoansByLoanIdCollateralsByCollateralId";
export const UseLoanCollateralServiceGetV1LoansByLoanIdCollateralsByCollateralIdKeyFn = ({ collateralId, loanId }: {
  collateralId: number;
  loanId: number;
}, queryKey?: Array<unknown>) => [useLoanCollateralServiceGetV1LoansByLoanIdCollateralsByCollateralIdKey, ...(queryKey ?? [{ collateralId, loanId }])];
export type LoanDisbursementDetailsServiceGetV1LoansByLoanIdDisbursementsByDisbursementIdDefaultResponse = Awaited<ReturnType<typeof LoanDisbursementDetailsService.getV1LoansByLoanIdDisbursementsByDisbursementId>>;
export type LoanDisbursementDetailsServiceGetV1LoansByLoanIdDisbursementsByDisbursementIdQueryResult<TData = LoanDisbursementDetailsServiceGetV1LoansByLoanIdDisbursementsByDisbursementIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useLoanDisbursementDetailsServiceGetV1LoansByLoanIdDisbursementsByDisbursementIdKey = "LoanDisbursementDetailsServiceGetV1LoansByLoanIdDisbursementsByDisbursementId";
export const UseLoanDisbursementDetailsServiceGetV1LoansByLoanIdDisbursementsByDisbursementIdKeyFn = ({ disbursementId, loanId }: {
  disbursementId: number;
  loanId: number;
}, queryKey?: Array<unknown>) => [useLoanDisbursementDetailsServiceGetV1LoansByLoanIdDisbursementsByDisbursementIdKey, ...(queryKey ?? [{ disbursementId, loanId }])];
export type GuarantorsServiceGetV1LoansByLoanIdGuarantorsDefaultResponse = Awaited<ReturnType<typeof GuarantorsService.getV1LoansByLoanIdGuarantors>>;
export type GuarantorsServiceGetV1LoansByLoanIdGuarantorsQueryResult<TData = GuarantorsServiceGetV1LoansByLoanIdGuarantorsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGuarantorsServiceGetV1LoansByLoanIdGuarantorsKey = "GuarantorsServiceGetV1LoansByLoanIdGuarantors";
export const UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useGuarantorsServiceGetV1LoansByLoanIdGuarantorsKey, ...(queryKey ?? [{ loanId }])];
export type GuarantorsServiceGetV1LoansByLoanIdGuarantorsAccountsTemplateDefaultResponse = Awaited<ReturnType<typeof GuarantorsService.getV1LoansByLoanIdGuarantorsAccountsTemplate>>;
export type GuarantorsServiceGetV1LoansByLoanIdGuarantorsAccountsTemplateQueryResult<TData = GuarantorsServiceGetV1LoansByLoanIdGuarantorsAccountsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGuarantorsServiceGetV1LoansByLoanIdGuarantorsAccountsTemplateKey = "GuarantorsServiceGetV1LoansByLoanIdGuarantorsAccountsTemplate";
export const UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsAccountsTemplateKeyFn = ({ clientId, loanId }: {
  clientId?: number;
  loanId: number;
}, queryKey?: Array<unknown>) => [useGuarantorsServiceGetV1LoansByLoanIdGuarantorsAccountsTemplateKey, ...(queryKey ?? [{ clientId, loanId }])];
export type GuarantorsServiceGetV1LoansByLoanIdGuarantorsDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof GuarantorsService.getV1LoansByLoanIdGuarantorsDownloadtemplate>>;
export type GuarantorsServiceGetV1LoansByLoanIdGuarantorsDownloadtemplateQueryResult<TData = GuarantorsServiceGetV1LoansByLoanIdGuarantorsDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGuarantorsServiceGetV1LoansByLoanIdGuarantorsDownloadtemplateKey = "GuarantorsServiceGetV1LoansByLoanIdGuarantorsDownloadtemplate";
export const UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsDownloadtemplateKeyFn = ({ dateFormat, loanId, officeId }: {
  dateFormat?: string;
  loanId: number;
  officeId?: number;
}, queryKey?: Array<unknown>) => [useGuarantorsServiceGetV1LoansByLoanIdGuarantorsDownloadtemplateKey, ...(queryKey ?? [{ dateFormat, loanId, officeId }])];
export type GuarantorsServiceGetV1LoansByLoanIdGuarantorsTemplateDefaultResponse = Awaited<ReturnType<typeof GuarantorsService.getV1LoansByLoanIdGuarantorsTemplate>>;
export type GuarantorsServiceGetV1LoansByLoanIdGuarantorsTemplateQueryResult<TData = GuarantorsServiceGetV1LoansByLoanIdGuarantorsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGuarantorsServiceGetV1LoansByLoanIdGuarantorsTemplateKey = "GuarantorsServiceGetV1LoansByLoanIdGuarantorsTemplate";
export const UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsTemplateKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useGuarantorsServiceGetV1LoansByLoanIdGuarantorsTemplateKey, ...(queryKey ?? [{ loanId }])];
export type GuarantorsServiceGetV1LoansByLoanIdGuarantorsByGuarantorIdDefaultResponse = Awaited<ReturnType<typeof GuarantorsService.getV1LoansByLoanIdGuarantorsByGuarantorId>>;
export type GuarantorsServiceGetV1LoansByLoanIdGuarantorsByGuarantorIdQueryResult<TData = GuarantorsServiceGetV1LoansByLoanIdGuarantorsByGuarantorIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGuarantorsServiceGetV1LoansByLoanIdGuarantorsByGuarantorIdKey = "GuarantorsServiceGetV1LoansByLoanIdGuarantorsByGuarantorId";
export const UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsByGuarantorIdKeyFn = ({ guarantorId, loanId }: {
  guarantorId: number;
  loanId: number;
}, queryKey?: Array<unknown>) => [useGuarantorsServiceGetV1LoansByLoanIdGuarantorsByGuarantorIdKey, ...(queryKey ?? [{ guarantorId, loanId }])];
export type RepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksDefaultResponse = Awaited<ReturnType<typeof RepaymentWithPostDatedChecksService.getV1LoansByLoanIdPostdatedchecks>>;
export type RepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksQueryResult<TData = RepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksKey = "RepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecks";
export const UseRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksKey, ...(queryKey ?? [{ loanId }])];
export type RepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksByInstallmentIdDefaultResponse = Awaited<ReturnType<typeof RepaymentWithPostDatedChecksService.getV1LoansByLoanIdPostdatedchecksByInstallmentId>>;
export type RepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksByInstallmentIdQueryResult<TData = RepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksByInstallmentIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksByInstallmentIdKey = "RepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksByInstallmentId";
export const UseRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksByInstallmentIdKeyFn = ({ installmentId, loanId }: {
  installmentId: number;
  loanId: number;
}, queryKey?: Array<unknown>) => [useRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksByInstallmentIdKey, ...(queryKey ?? [{ installmentId, loanId }])];
export type MakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersDefaultResponse = Awaited<ReturnType<typeof MakerCheckerOr4EyeFunctionalityService.getV1Makercheckers>>;
export type MakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersQueryResult<TData = MakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersKey = "MakerCheckerOr4EyeFunctionalityServiceGetV1Makercheckers";
export const UseMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersKeyFn = ({ actionName, clientId, entityName, groupId, loanid, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, resourceId, savingsAccountId }: {
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
} = {}, queryKey?: Array<unknown>) => [useMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersKey, ...(queryKey ?? [{ actionName, clientId, entityName, groupId, loanid, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, resourceId, savingsAccountId }])];
export type MakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSearchtemplateDefaultResponse = Awaited<ReturnType<typeof MakerCheckerOr4EyeFunctionalityService.getV1MakercheckersSearchtemplate>>;
export type MakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSearchtemplateQueryResult<TData = MakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSearchtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSearchtemplateKey = "MakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSearchtemplate";
export const UseMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSearchtemplateKeyFn = (queryKey?: Array<unknown>) => [useMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSearchtemplateKey, ...(queryKey ?? [])];
export type MixMappingServiceGetV1MixmappingDefaultResponse = Awaited<ReturnType<typeof MixMappingService.getV1Mixmapping>>;
export type MixMappingServiceGetV1MixmappingQueryResult<TData = MixMappingServiceGetV1MixmappingDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMixMappingServiceGetV1MixmappingKey = "MixMappingServiceGetV1Mixmapping";
export const UseMixMappingServiceGetV1MixmappingKeyFn = (queryKey?: Array<unknown>) => [useMixMappingServiceGetV1MixmappingKey, ...(queryKey ?? [])];
export type MixReportServiceGetV1MixreportDefaultResponse = Awaited<ReturnType<typeof MixReportService.getV1Mixreport>>;
export type MixReportServiceGetV1MixreportQueryResult<TData = MixReportServiceGetV1MixreportDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMixReportServiceGetV1MixreportKey = "MixReportServiceGetV1Mixreport";
export const UseMixReportServiceGetV1MixreportKeyFn = ({ currency, endDate, startDate }: {
  currency?: string;
  endDate?: string;
  startDate?: string;
} = {}, queryKey?: Array<unknown>) => [useMixReportServiceGetV1MixreportKey, ...(queryKey ?? [{ currency, endDate, startDate }])];
export type MixTaxonomyServiceGetV1MixtaxonomyDefaultResponse = Awaited<ReturnType<typeof MixTaxonomyService.getV1Mixtaxonomy>>;
export type MixTaxonomyServiceGetV1MixtaxonomyQueryResult<TData = MixTaxonomyServiceGetV1MixtaxonomyDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMixTaxonomyServiceGetV1MixtaxonomyKey = "MixTaxonomyServiceGetV1Mixtaxonomy";
export const UseMixTaxonomyServiceGetV1MixtaxonomyKeyFn = (queryKey?: Array<unknown>) => [useMixTaxonomyServiceGetV1MixtaxonomyKey, ...(queryKey ?? [])];
export type NotificationServiceGetV1NotificationsDefaultResponse = Awaited<ReturnType<typeof NotificationService.getV1Notifications>>;
export type NotificationServiceGetV1NotificationsQueryResult<TData = NotificationServiceGetV1NotificationsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useNotificationServiceGetV1NotificationsKey = "NotificationServiceGetV1Notifications";
export const UseNotificationServiceGetV1NotificationsKeyFn = ({ isRead, limit, offset, orderBy, sortOrder }: {
  isRead?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: Array<unknown>) => [useNotificationServiceGetV1NotificationsKey, ...(queryKey ?? [{ isRead, limit, offset, orderBy, sortOrder }])];
export type OfficesServiceGetV1OfficesDefaultResponse = Awaited<ReturnType<typeof OfficesService.getV1Offices>>;
export type OfficesServiceGetV1OfficesQueryResult<TData = OfficesServiceGetV1OfficesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useOfficesServiceGetV1OfficesKey = "OfficesServiceGetV1Offices";
export const UseOfficesServiceGetV1OfficesKeyFn = ({ includeAllOffices, orderBy, sortOrder }: {
  includeAllOffices?: boolean;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: Array<unknown>) => [useOfficesServiceGetV1OfficesKey, ...(queryKey ?? [{ includeAllOffices, orderBy, sortOrder }])];
export type OfficesServiceGetV1OfficesDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof OfficesService.getV1OfficesDownloadtemplate>>;
export type OfficesServiceGetV1OfficesDownloadtemplateQueryResult<TData = OfficesServiceGetV1OfficesDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useOfficesServiceGetV1OfficesDownloadtemplateKey = "OfficesServiceGetV1OfficesDownloadtemplate";
export const UseOfficesServiceGetV1OfficesDownloadtemplateKeyFn = ({ dateFormat }: {
  dateFormat?: string;
} = {}, queryKey?: Array<unknown>) => [useOfficesServiceGetV1OfficesDownloadtemplateKey, ...(queryKey ?? [{ dateFormat }])];
export type OfficesServiceGetV1OfficesExternalIdByExternalIdDefaultResponse = Awaited<ReturnType<typeof OfficesService.getV1OfficesExternalIdByExternalId>>;
export type OfficesServiceGetV1OfficesExternalIdByExternalIdQueryResult<TData = OfficesServiceGetV1OfficesExternalIdByExternalIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useOfficesServiceGetV1OfficesExternalIdByExternalIdKey = "OfficesServiceGetV1OfficesExternalIdByExternalId";
export const UseOfficesServiceGetV1OfficesExternalIdByExternalIdKeyFn = ({ externalId }: {
  externalId: string;
}, queryKey?: Array<unknown>) => [useOfficesServiceGetV1OfficesExternalIdByExternalIdKey, ...(queryKey ?? [{ externalId }])];
export type OfficesServiceGetV1OfficesTemplateDefaultResponse = Awaited<ReturnType<typeof OfficesService.getV1OfficesTemplate>>;
export type OfficesServiceGetV1OfficesTemplateQueryResult<TData = OfficesServiceGetV1OfficesTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useOfficesServiceGetV1OfficesTemplateKey = "OfficesServiceGetV1OfficesTemplate";
export const UseOfficesServiceGetV1OfficesTemplateKeyFn = (queryKey?: Array<unknown>) => [useOfficesServiceGetV1OfficesTemplateKey, ...(queryKey ?? [])];
export type OfficesServiceGetV1OfficesByOfficeIdDefaultResponse = Awaited<ReturnType<typeof OfficesService.getV1OfficesByOfficeId>>;
export type OfficesServiceGetV1OfficesByOfficeIdQueryResult<TData = OfficesServiceGetV1OfficesByOfficeIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useOfficesServiceGetV1OfficesByOfficeIdKey = "OfficesServiceGetV1OfficesByOfficeId";
export const UseOfficesServiceGetV1OfficesByOfficeIdKeyFn = ({ officeId }: {
  officeId: number;
}, queryKey?: Array<unknown>) => [useOfficesServiceGetV1OfficesByOfficeIdKey, ...(queryKey ?? [{ officeId }])];
export type PasswordPreferencesServiceGetV1PasswordpreferencesDefaultResponse = Awaited<ReturnType<typeof PasswordPreferencesService.getV1Passwordpreferences>>;
export type PasswordPreferencesServiceGetV1PasswordpreferencesQueryResult<TData = PasswordPreferencesServiceGetV1PasswordpreferencesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const usePasswordPreferencesServiceGetV1PasswordpreferencesKey = "PasswordPreferencesServiceGetV1Passwordpreferences";
export const UsePasswordPreferencesServiceGetV1PasswordpreferencesKeyFn = (queryKey?: Array<unknown>) => [usePasswordPreferencesServiceGetV1PasswordpreferencesKey, ...(queryKey ?? [])];
export type PasswordPreferencesServiceGetV1PasswordpreferencesTemplateDefaultResponse = Awaited<ReturnType<typeof PasswordPreferencesService.getV1PasswordpreferencesTemplate>>;
export type PasswordPreferencesServiceGetV1PasswordpreferencesTemplateQueryResult<TData = PasswordPreferencesServiceGetV1PasswordpreferencesTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const usePasswordPreferencesServiceGetV1PasswordpreferencesTemplateKey = "PasswordPreferencesServiceGetV1PasswordpreferencesTemplate";
export const UsePasswordPreferencesServiceGetV1PasswordpreferencesTemplateKeyFn = (queryKey?: Array<unknown>) => [usePasswordPreferencesServiceGetV1PasswordpreferencesTemplateKey, ...(queryKey ?? [])];
export type PaymentTypeServiceGetV1PaymenttypesDefaultResponse = Awaited<ReturnType<typeof PaymentTypeService.getV1Paymenttypes>>;
export type PaymentTypeServiceGetV1PaymenttypesQueryResult<TData = PaymentTypeServiceGetV1PaymenttypesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const usePaymentTypeServiceGetV1PaymenttypesKey = "PaymentTypeServiceGetV1Paymenttypes";
export const UsePaymentTypeServiceGetV1PaymenttypesKeyFn = ({ onlyWithCode }: {
  onlyWithCode?: boolean;
} = {}, queryKey?: Array<unknown>) => [usePaymentTypeServiceGetV1PaymenttypesKey, ...(queryKey ?? [{ onlyWithCode }])];
export type PaymentTypeServiceGetV1PaymenttypesByPaymentTypeIdDefaultResponse = Awaited<ReturnType<typeof PaymentTypeService.getV1PaymenttypesByPaymentTypeId>>;
export type PaymentTypeServiceGetV1PaymenttypesByPaymentTypeIdQueryResult<TData = PaymentTypeServiceGetV1PaymenttypesByPaymentTypeIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const usePaymentTypeServiceGetV1PaymenttypesByPaymentTypeIdKey = "PaymentTypeServiceGetV1PaymenttypesByPaymentTypeId";
export const UsePaymentTypeServiceGetV1PaymenttypesByPaymentTypeIdKeyFn = ({ paymentTypeId }: {
  paymentTypeId: number;
}, queryKey?: Array<unknown>) => [usePaymentTypeServiceGetV1PaymenttypesByPaymentTypeIdKey, ...(queryKey ?? [{ paymentTypeId }])];
export type PermissionsServiceGetV1PermissionsDefaultResponse = Awaited<ReturnType<typeof PermissionsService.getV1Permissions>>;
export type PermissionsServiceGetV1PermissionsQueryResult<TData = PermissionsServiceGetV1PermissionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const usePermissionsServiceGetV1PermissionsKey = "PermissionsServiceGetV1Permissions";
export const UsePermissionsServiceGetV1PermissionsKeyFn = (queryKey?: Array<unknown>) => [usePermissionsServiceGetV1PermissionsKey, ...(queryKey ?? [])];
export type PovertyLineServiceGetV1PovertyLineByPpiNameDefaultResponse = Awaited<ReturnType<typeof PovertyLineService.getV1PovertyLineByPpiName>>;
export type PovertyLineServiceGetV1PovertyLineByPpiNameQueryResult<TData = PovertyLineServiceGetV1PovertyLineByPpiNameDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const usePovertyLineServiceGetV1PovertyLineByPpiNameKey = "PovertyLineServiceGetV1PovertyLineByPpiName";
export const UsePovertyLineServiceGetV1PovertyLineByPpiNameKeyFn = ({ ppiName }: {
  ppiName: string;
}, queryKey?: Array<unknown>) => [usePovertyLineServiceGetV1PovertyLineByPpiNameKey, ...(queryKey ?? [{ ppiName }])];
export type PovertyLineServiceGetV1PovertyLineByPpiNameByLikelihoodIdDefaultResponse = Awaited<ReturnType<typeof PovertyLineService.getV1PovertyLineByPpiNameByLikelihoodId>>;
export type PovertyLineServiceGetV1PovertyLineByPpiNameByLikelihoodIdQueryResult<TData = PovertyLineServiceGetV1PovertyLineByPpiNameByLikelihoodIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const usePovertyLineServiceGetV1PovertyLineByPpiNameByLikelihoodIdKey = "PovertyLineServiceGetV1PovertyLineByPpiNameByLikelihoodId";
export const UsePovertyLineServiceGetV1PovertyLineByPpiNameByLikelihoodIdKeyFn = ({ likelihoodId, ppiName }: {
  likelihoodId: number;
  ppiName: string;
}, queryKey?: Array<unknown>) => [usePovertyLineServiceGetV1PovertyLineByPpiNameByLikelihoodIdKey, ...(queryKey ?? [{ likelihoodId, ppiName }])];
export type ProductsServiceGetV1ProductsByTypeDefaultResponse = Awaited<ReturnType<typeof ProductsService.getV1ProductsByType>>;
export type ProductsServiceGetV1ProductsByTypeQueryResult<TData = ProductsServiceGetV1ProductsByTypeDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProductsServiceGetV1ProductsByTypeKey = "ProductsServiceGetV1ProductsByType";
export const UseProductsServiceGetV1ProductsByTypeKeyFn = ({ limit, offset, type }: {
  limit?: number;
  offset?: number;
  type: string;
}, queryKey?: Array<unknown>) => [useProductsServiceGetV1ProductsByTypeKey, ...(queryKey ?? [{ limit, offset, type }])];
export type ProductsServiceGetV1ProductsByTypeTemplateDefaultResponse = Awaited<ReturnType<typeof ProductsService.getV1ProductsByTypeTemplate>>;
export type ProductsServiceGetV1ProductsByTypeTemplateQueryResult<TData = ProductsServiceGetV1ProductsByTypeTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProductsServiceGetV1ProductsByTypeTemplateKey = "ProductsServiceGetV1ProductsByTypeTemplate";
export const UseProductsServiceGetV1ProductsByTypeTemplateKeyFn = ({ type }: {
  type: string;
}, queryKey?: Array<unknown>) => [useProductsServiceGetV1ProductsByTypeTemplateKey, ...(queryKey ?? [{ type }])];
export type ProductsServiceGetV1ProductsByTypeByProductIdDefaultResponse = Awaited<ReturnType<typeof ProductsService.getV1ProductsByTypeByProductId>>;
export type ProductsServiceGetV1ProductsByTypeByProductIdQueryResult<TData = ProductsServiceGetV1ProductsByTypeByProductIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProductsServiceGetV1ProductsByTypeByProductIdKey = "ProductsServiceGetV1ProductsByTypeByProductId";
export const UseProductsServiceGetV1ProductsByTypeByProductIdKeyFn = ({ productId, type }: {
  productId: number;
  type: string;
}, queryKey?: Array<unknown>) => [useProductsServiceGetV1ProductsByTypeByProductIdKey, ...(queryKey ?? [{ productId, type }])];
export type ProvisioningCategoryServiceGetV1ProvisioningcategoryDefaultResponse = Awaited<ReturnType<typeof ProvisioningCategoryService.getV1Provisioningcategory>>;
export type ProvisioningCategoryServiceGetV1ProvisioningcategoryQueryResult<TData = ProvisioningCategoryServiceGetV1ProvisioningcategoryDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProvisioningCategoryServiceGetV1ProvisioningcategoryKey = "ProvisioningCategoryServiceGetV1Provisioningcategory";
export const UseProvisioningCategoryServiceGetV1ProvisioningcategoryKeyFn = (queryKey?: Array<unknown>) => [useProvisioningCategoryServiceGetV1ProvisioningcategoryKey, ...(queryKey ?? [])];
export type ProvisioningCriteriaServiceGetV1ProvisioningcriteriaDefaultResponse = Awaited<ReturnType<typeof ProvisioningCriteriaService.getV1Provisioningcriteria>>;
export type ProvisioningCriteriaServiceGetV1ProvisioningcriteriaQueryResult<TData = ProvisioningCriteriaServiceGetV1ProvisioningcriteriaDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProvisioningCriteriaServiceGetV1ProvisioningcriteriaKey = "ProvisioningCriteriaServiceGetV1Provisioningcriteria";
export const UseProvisioningCriteriaServiceGetV1ProvisioningcriteriaKeyFn = (queryKey?: Array<unknown>) => [useProvisioningCriteriaServiceGetV1ProvisioningcriteriaKey, ...(queryKey ?? [])];
export type ProvisioningCriteriaServiceGetV1ProvisioningcriteriaTemplateDefaultResponse = Awaited<ReturnType<typeof ProvisioningCriteriaService.getV1ProvisioningcriteriaTemplate>>;
export type ProvisioningCriteriaServiceGetV1ProvisioningcriteriaTemplateQueryResult<TData = ProvisioningCriteriaServiceGetV1ProvisioningcriteriaTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProvisioningCriteriaServiceGetV1ProvisioningcriteriaTemplateKey = "ProvisioningCriteriaServiceGetV1ProvisioningcriteriaTemplate";
export const UseProvisioningCriteriaServiceGetV1ProvisioningcriteriaTemplateKeyFn = (queryKey?: Array<unknown>) => [useProvisioningCriteriaServiceGetV1ProvisioningcriteriaTemplateKey, ...(queryKey ?? [])];
export type ProvisioningCriteriaServiceGetV1ProvisioningcriteriaByCriteriaIdDefaultResponse = Awaited<ReturnType<typeof ProvisioningCriteriaService.getV1ProvisioningcriteriaByCriteriaId>>;
export type ProvisioningCriteriaServiceGetV1ProvisioningcriteriaByCriteriaIdQueryResult<TData = ProvisioningCriteriaServiceGetV1ProvisioningcriteriaByCriteriaIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProvisioningCriteriaServiceGetV1ProvisioningcriteriaByCriteriaIdKey = "ProvisioningCriteriaServiceGetV1ProvisioningcriteriaByCriteriaId";
export const UseProvisioningCriteriaServiceGetV1ProvisioningcriteriaByCriteriaIdKeyFn = ({ criteriaId }: {
  criteriaId: number;
}, queryKey?: Array<unknown>) => [useProvisioningCriteriaServiceGetV1ProvisioningcriteriaByCriteriaIdKey, ...(queryKey ?? [{ criteriaId }])];
export type ProvisioningEntriesServiceGetV1ProvisioningentriesDefaultResponse = Awaited<ReturnType<typeof ProvisioningEntriesService.getV1Provisioningentries>>;
export type ProvisioningEntriesServiceGetV1ProvisioningentriesQueryResult<TData = ProvisioningEntriesServiceGetV1ProvisioningentriesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProvisioningEntriesServiceGetV1ProvisioningentriesKey = "ProvisioningEntriesServiceGetV1Provisioningentries";
export const UseProvisioningEntriesServiceGetV1ProvisioningentriesKeyFn = ({ limit, offset }: {
  limit?: number;
  offset?: number;
} = {}, queryKey?: Array<unknown>) => [useProvisioningEntriesServiceGetV1ProvisioningentriesKey, ...(queryKey ?? [{ limit, offset }])];
export type ProvisioningEntriesServiceGetV1ProvisioningentriesEntriesDefaultResponse = Awaited<ReturnType<typeof ProvisioningEntriesService.getV1ProvisioningentriesEntries>>;
export type ProvisioningEntriesServiceGetV1ProvisioningentriesEntriesQueryResult<TData = ProvisioningEntriesServiceGetV1ProvisioningentriesEntriesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProvisioningEntriesServiceGetV1ProvisioningentriesEntriesKey = "ProvisioningEntriesServiceGetV1ProvisioningentriesEntries";
export const UseProvisioningEntriesServiceGetV1ProvisioningentriesEntriesKeyFn = ({ categoryId, entryId, limit, officeId, offset, productId }: {
  categoryId?: number;
  entryId?: number;
  limit?: number;
  officeId?: number;
  offset?: number;
  productId?: number;
} = {}, queryKey?: Array<unknown>) => [useProvisioningEntriesServiceGetV1ProvisioningentriesEntriesKey, ...(queryKey ?? [{ categoryId, entryId, limit, officeId, offset, productId }])];
export type ProvisioningEntriesServiceGetV1ProvisioningentriesByEntryIdDefaultResponse = Awaited<ReturnType<typeof ProvisioningEntriesService.getV1ProvisioningentriesByEntryId>>;
export type ProvisioningEntriesServiceGetV1ProvisioningentriesByEntryIdQueryResult<TData = ProvisioningEntriesServiceGetV1ProvisioningentriesByEntryIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProvisioningEntriesServiceGetV1ProvisioningentriesByEntryIdKey = "ProvisioningEntriesServiceGetV1ProvisioningentriesByEntryId";
export const UseProvisioningEntriesServiceGetV1ProvisioningentriesByEntryIdKeyFn = ({ entryId }: {
  entryId: number;
}, queryKey?: Array<unknown>) => [useProvisioningEntriesServiceGetV1ProvisioningentriesByEntryIdKey, ...(queryKey ?? [{ entryId }])];
export type RateServiceGetV1RatesDefaultResponse = Awaited<ReturnType<typeof RateService.getV1Rates>>;
export type RateServiceGetV1RatesQueryResult<TData = RateServiceGetV1RatesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRateServiceGetV1RatesKey = "RateServiceGetV1Rates";
export const UseRateServiceGetV1RatesKeyFn = (queryKey?: Array<unknown>) => [useRateServiceGetV1RatesKey, ...(queryKey ?? [])];
export type RateServiceGetV1RatesByRateIdDefaultResponse = Awaited<ReturnType<typeof RateService.getV1RatesByRateId>>;
export type RateServiceGetV1RatesByRateIdQueryResult<TData = RateServiceGetV1RatesByRateIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRateServiceGetV1RatesByRateIdKey = "RateServiceGetV1RatesByRateId";
export const UseRateServiceGetV1RatesByRateIdKeyFn = ({ rateId }: {
  rateId: number;
}, queryKey?: Array<unknown>) => [useRateServiceGetV1RatesByRateIdKey, ...(queryKey ?? [{ rateId }])];
export type RecurringDepositAccountServiceGetV1RecurringdepositaccountsDefaultResponse = Awaited<ReturnType<typeof RecurringDepositAccountService.getV1Recurringdepositaccounts>>;
export type RecurringDepositAccountServiceGetV1RecurringdepositaccountsQueryResult<TData = RecurringDepositAccountServiceGetV1RecurringdepositaccountsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRecurringDepositAccountServiceGetV1RecurringdepositaccountsKey = "RecurringDepositAccountServiceGetV1Recurringdepositaccounts";
export const UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsKeyFn = ({ limit, offset, orderBy, paged, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  paged?: boolean;
  sortOrder?: string;
} = {}, queryKey?: Array<unknown>) => [useRecurringDepositAccountServiceGetV1RecurringdepositaccountsKey, ...(queryKey ?? [{ limit, offset, orderBy, paged, sortOrder }])];
export type RecurringDepositAccountServiceGetV1RecurringdepositaccountsDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof RecurringDepositAccountService.getV1RecurringdepositaccountsDownloadtemplate>>;
export type RecurringDepositAccountServiceGetV1RecurringdepositaccountsDownloadtemplateQueryResult<TData = RecurringDepositAccountServiceGetV1RecurringdepositaccountsDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRecurringDepositAccountServiceGetV1RecurringdepositaccountsDownloadtemplateKey = "RecurringDepositAccountServiceGetV1RecurringdepositaccountsDownloadtemplate";
export const UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsDownloadtemplateKeyFn = ({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: Array<unknown>) => [useRecurringDepositAccountServiceGetV1RecurringdepositaccountsDownloadtemplateKey, ...(queryKey ?? [{ dateFormat, officeId, staffId }])];
export type RecurringDepositAccountServiceGetV1RecurringdepositaccountsTemplateDefaultResponse = Awaited<ReturnType<typeof RecurringDepositAccountService.getV1RecurringdepositaccountsTemplate>>;
export type RecurringDepositAccountServiceGetV1RecurringdepositaccountsTemplateQueryResult<TData = RecurringDepositAccountServiceGetV1RecurringdepositaccountsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRecurringDepositAccountServiceGetV1RecurringdepositaccountsTemplateKey = "RecurringDepositAccountServiceGetV1RecurringdepositaccountsTemplate";
export const UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsTemplateKeyFn = ({ clientId, groupId, productId, staffInSelectedOfficeOnly }: {
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: Array<unknown>) => [useRecurringDepositAccountServiceGetV1RecurringdepositaccountsTemplateKey, ...(queryKey ?? [{ clientId, groupId, productId, staffInSelectedOfficeOnly }])];
export type RecurringDepositAccountServiceGetV1RecurringdepositaccountsTransactionsDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof RecurringDepositAccountService.getV1RecurringdepositaccountsTransactionsDownloadtemplate>>;
export type RecurringDepositAccountServiceGetV1RecurringdepositaccountsTransactionsDownloadtemplateQueryResult<TData = RecurringDepositAccountServiceGetV1RecurringdepositaccountsTransactionsDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRecurringDepositAccountServiceGetV1RecurringdepositaccountsTransactionsDownloadtemplateKey = "RecurringDepositAccountServiceGetV1RecurringdepositaccountsTransactionsDownloadtemplate";
export const UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsTransactionsDownloadtemplateKeyFn = ({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: Array<unknown>) => [useRecurringDepositAccountServiceGetV1RecurringdepositaccountsTransactionsDownloadtemplateKey, ...(queryKey ?? [{ dateFormat, officeId }])];
export type RecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdDefaultResponse = Awaited<ReturnType<typeof RecurringDepositAccountService.getV1RecurringdepositaccountsByAccountId>>;
export type RecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdQueryResult<TData = RecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdKey = "RecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountId";
export const UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdKeyFn = ({ accountId, chargeStatus, staffInSelectedOfficeOnly }: {
  accountId: number;
  chargeStatus?: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: Array<unknown>) => [useRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdKey, ...(queryKey ?? [{ accountId, chargeStatus, staffInSelectedOfficeOnly }])];
export type RecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdTemplateDefaultResponse = Awaited<ReturnType<typeof RecurringDepositAccountService.getV1RecurringdepositaccountsByAccountIdTemplate>>;
export type RecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdTemplateQueryResult<TData = RecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdTemplateKey = "RecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdTemplate";
export const UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdTemplateKeyFn = ({ accountId, command }: {
  accountId: number;
  command?: string;
}, queryKey?: Array<unknown>) => [useRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdTemplateKey, ...(queryKey ?? [{ accountId, command }])];
export type RecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplateDefaultResponse = Awaited<ReturnType<typeof RecurringDepositAccountTransactionsService.getV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplate>>;
export type RecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplateQueryResult<TData = RecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplateKey = "RecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplate";
export const UseRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplateKeyFn = ({ command, recurringDepositAccountId }: {
  command?: string;
  recurringDepositAccountId: number;
}, queryKey?: Array<unknown>) => [useRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplateKey, ...(queryKey ?? [{ command, recurringDepositAccountId }])];
export type RecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionIdDefaultResponse = Awaited<ReturnType<typeof RecurringDepositAccountTransactionsService.getV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionId>>;
export type RecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionIdQueryResult<TData = RecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionIdKey = "RecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionId";
export const UseRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionIdKeyFn = ({ recurringDepositAccountId, transactionId }: {
  recurringDepositAccountId: number;
  transactionId: number;
}, queryKey?: Array<unknown>) => [useRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionIdKey, ...(queryKey ?? [{ recurringDepositAccountId, transactionId }])];
export type RecurringDepositProductServiceGetV1RecurringdepositproductsDefaultResponse = Awaited<ReturnType<typeof RecurringDepositProductService.getV1Recurringdepositproducts>>;
export type RecurringDepositProductServiceGetV1RecurringdepositproductsQueryResult<TData = RecurringDepositProductServiceGetV1RecurringdepositproductsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRecurringDepositProductServiceGetV1RecurringdepositproductsKey = "RecurringDepositProductServiceGetV1Recurringdepositproducts";
export const UseRecurringDepositProductServiceGetV1RecurringdepositproductsKeyFn = (queryKey?: Array<unknown>) => [useRecurringDepositProductServiceGetV1RecurringdepositproductsKey, ...(queryKey ?? [])];
export type RecurringDepositProductServiceGetV1RecurringdepositproductsTemplateDefaultResponse = Awaited<ReturnType<typeof RecurringDepositProductService.getV1RecurringdepositproductsTemplate>>;
export type RecurringDepositProductServiceGetV1RecurringdepositproductsTemplateQueryResult<TData = RecurringDepositProductServiceGetV1RecurringdepositproductsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRecurringDepositProductServiceGetV1RecurringdepositproductsTemplateKey = "RecurringDepositProductServiceGetV1RecurringdepositproductsTemplate";
export const UseRecurringDepositProductServiceGetV1RecurringdepositproductsTemplateKeyFn = (queryKey?: Array<unknown>) => [useRecurringDepositProductServiceGetV1RecurringdepositproductsTemplateKey, ...(queryKey ?? [])];
export type RecurringDepositProductServiceGetV1RecurringdepositproductsByProductIdDefaultResponse = Awaited<ReturnType<typeof RecurringDepositProductService.getV1RecurringdepositproductsByProductId>>;
export type RecurringDepositProductServiceGetV1RecurringdepositproductsByProductIdQueryResult<TData = RecurringDepositProductServiceGetV1RecurringdepositproductsByProductIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRecurringDepositProductServiceGetV1RecurringdepositproductsByProductIdKey = "RecurringDepositProductServiceGetV1RecurringdepositproductsByProductId";
export const UseRecurringDepositProductServiceGetV1RecurringdepositproductsByProductIdKeyFn = ({ productId }: {
  productId: number;
}, queryKey?: Array<unknown>) => [useRecurringDepositProductServiceGetV1RecurringdepositproductsByProductIdKey, ...(queryKey ?? [{ productId }])];
export type ListReportMailingJobHistoryServiceGetV1ReportmailingjobrunhistoryDefaultResponse = Awaited<ReturnType<typeof ListReportMailingJobHistoryService.getV1Reportmailingjobrunhistory>>;
export type ListReportMailingJobHistoryServiceGetV1ReportmailingjobrunhistoryQueryResult<TData = ListReportMailingJobHistoryServiceGetV1ReportmailingjobrunhistoryDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useListReportMailingJobHistoryServiceGetV1ReportmailingjobrunhistoryKey = "ListReportMailingJobHistoryServiceGetV1Reportmailingjobrunhistory";
export const UseListReportMailingJobHistoryServiceGetV1ReportmailingjobrunhistoryKeyFn = ({ limit, offset, orderBy, reportMailingJobId, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  reportMailingJobId?: number;
  sortOrder?: string;
} = {}, queryKey?: Array<unknown>) => [useListReportMailingJobHistoryServiceGetV1ReportmailingjobrunhistoryKey, ...(queryKey ?? [{ limit, offset, orderBy, reportMailingJobId, sortOrder }])];
export type ReportMailingJobsServiceGetV1ReportmailingjobsDefaultResponse = Awaited<ReturnType<typeof ReportMailingJobsService.getV1Reportmailingjobs>>;
export type ReportMailingJobsServiceGetV1ReportmailingjobsQueryResult<TData = ReportMailingJobsServiceGetV1ReportmailingjobsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useReportMailingJobsServiceGetV1ReportmailingjobsKey = "ReportMailingJobsServiceGetV1Reportmailingjobs";
export const UseReportMailingJobsServiceGetV1ReportmailingjobsKeyFn = ({ limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: Array<unknown>) => [useReportMailingJobsServiceGetV1ReportmailingjobsKey, ...(queryKey ?? [{ limit, offset, orderBy, sortOrder }])];
export type ReportMailingJobsServiceGetV1ReportmailingjobsTemplateDefaultResponse = Awaited<ReturnType<typeof ReportMailingJobsService.getV1ReportmailingjobsTemplate>>;
export type ReportMailingJobsServiceGetV1ReportmailingjobsTemplateQueryResult<TData = ReportMailingJobsServiceGetV1ReportmailingjobsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useReportMailingJobsServiceGetV1ReportmailingjobsTemplateKey = "ReportMailingJobsServiceGetV1ReportmailingjobsTemplate";
export const UseReportMailingJobsServiceGetV1ReportmailingjobsTemplateKeyFn = (queryKey?: Array<unknown>) => [useReportMailingJobsServiceGetV1ReportmailingjobsTemplateKey, ...(queryKey ?? [])];
export type ReportMailingJobsServiceGetV1ReportmailingjobsByEntityIdDefaultResponse = Awaited<ReturnType<typeof ReportMailingJobsService.getV1ReportmailingjobsByEntityId>>;
export type ReportMailingJobsServiceGetV1ReportmailingjobsByEntityIdQueryResult<TData = ReportMailingJobsServiceGetV1ReportmailingjobsByEntityIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useReportMailingJobsServiceGetV1ReportmailingjobsByEntityIdKey = "ReportMailingJobsServiceGetV1ReportmailingjobsByEntityId";
export const UseReportMailingJobsServiceGetV1ReportmailingjobsByEntityIdKeyFn = ({ entityId }: {
  entityId: number;
}, queryKey?: Array<unknown>) => [useReportMailingJobsServiceGetV1ReportmailingjobsByEntityIdKey, ...(queryKey ?? [{ entityId }])];
export type ReportsServiceGetV1ReportsDefaultResponse = Awaited<ReturnType<typeof ReportsService.getV1Reports>>;
export type ReportsServiceGetV1ReportsQueryResult<TData = ReportsServiceGetV1ReportsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useReportsServiceGetV1ReportsKey = "ReportsServiceGetV1Reports";
export const UseReportsServiceGetV1ReportsKeyFn = (queryKey?: Array<unknown>) => [useReportsServiceGetV1ReportsKey, ...(queryKey ?? [])];
export type ReportsServiceGetV1ReportsTemplateDefaultResponse = Awaited<ReturnType<typeof ReportsService.getV1ReportsTemplate>>;
export type ReportsServiceGetV1ReportsTemplateQueryResult<TData = ReportsServiceGetV1ReportsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useReportsServiceGetV1ReportsTemplateKey = "ReportsServiceGetV1ReportsTemplate";
export const UseReportsServiceGetV1ReportsTemplateKeyFn = (queryKey?: Array<unknown>) => [useReportsServiceGetV1ReportsTemplateKey, ...(queryKey ?? [])];
export type ReportsServiceGetV1ReportsByIdDefaultResponse = Awaited<ReturnType<typeof ReportsService.getV1ReportsById>>;
export type ReportsServiceGetV1ReportsByIdQueryResult<TData = ReportsServiceGetV1ReportsByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useReportsServiceGetV1ReportsByIdKey = "ReportsServiceGetV1ReportsById";
export const UseReportsServiceGetV1ReportsByIdKeyFn = ({ id }: {
  id: number;
}, queryKey?: Array<unknown>) => [useReportsServiceGetV1ReportsByIdKey, ...(queryKey ?? [{ id }])];
export type RescheduleLoansServiceGetV1RescheduleloansDefaultResponse = Awaited<ReturnType<typeof RescheduleLoansService.getV1Rescheduleloans>>;
export type RescheduleLoansServiceGetV1RescheduleloansQueryResult<TData = RescheduleLoansServiceGetV1RescheduleloansDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRescheduleLoansServiceGetV1RescheduleloansKey = "RescheduleLoansServiceGetV1Rescheduleloans";
export const UseRescheduleLoansServiceGetV1RescheduleloansKeyFn = ({ command, loanId }: {
  command?: string;
  loanId?: number;
} = {}, queryKey?: Array<unknown>) => [useRescheduleLoansServiceGetV1RescheduleloansKey, ...(queryKey ?? [{ command, loanId }])];
export type RescheduleLoansServiceGetV1RescheduleloansTemplateDefaultResponse = Awaited<ReturnType<typeof RescheduleLoansService.getV1RescheduleloansTemplate>>;
export type RescheduleLoansServiceGetV1RescheduleloansTemplateQueryResult<TData = RescheduleLoansServiceGetV1RescheduleloansTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRescheduleLoansServiceGetV1RescheduleloansTemplateKey = "RescheduleLoansServiceGetV1RescheduleloansTemplate";
export const UseRescheduleLoansServiceGetV1RescheduleloansTemplateKeyFn = (queryKey?: Array<unknown>) => [useRescheduleLoansServiceGetV1RescheduleloansTemplateKey, ...(queryKey ?? [])];
export type RescheduleLoansServiceGetV1RescheduleloansByScheduleIdDefaultResponse = Awaited<ReturnType<typeof RescheduleLoansService.getV1RescheduleloansByScheduleId>>;
export type RescheduleLoansServiceGetV1RescheduleloansByScheduleIdQueryResult<TData = RescheduleLoansServiceGetV1RescheduleloansByScheduleIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRescheduleLoansServiceGetV1RescheduleloansByScheduleIdKey = "RescheduleLoansServiceGetV1RescheduleloansByScheduleId";
export const UseRescheduleLoansServiceGetV1RescheduleloansByScheduleIdKeyFn = ({ command, scheduleId }: {
  command?: string;
  scheduleId: number;
}, queryKey?: Array<unknown>) => [useRescheduleLoansServiceGetV1RescheduleloansByScheduleIdKey, ...(queryKey ?? [{ command, scheduleId }])];
export type RolesServiceGetV1RolesDefaultResponse = Awaited<ReturnType<typeof RolesService.getV1Roles>>;
export type RolesServiceGetV1RolesQueryResult<TData = RolesServiceGetV1RolesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRolesServiceGetV1RolesKey = "RolesServiceGetV1Roles";
export const UseRolesServiceGetV1RolesKeyFn = (queryKey?: Array<unknown>) => [useRolesServiceGetV1RolesKey, ...(queryKey ?? [])];
export type RolesServiceGetV1RolesByRoleIdDefaultResponse = Awaited<ReturnType<typeof RolesService.getV1RolesByRoleId>>;
export type RolesServiceGetV1RolesByRoleIdQueryResult<TData = RolesServiceGetV1RolesByRoleIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRolesServiceGetV1RolesByRoleIdKey = "RolesServiceGetV1RolesByRoleId";
export const UseRolesServiceGetV1RolesByRoleIdKeyFn = ({ roleId }: {
  roleId: number;
}, queryKey?: Array<unknown>) => [useRolesServiceGetV1RolesByRoleIdKey, ...(queryKey ?? [{ roleId }])];
export type RolesServiceGetV1RolesByRoleIdPermissionsDefaultResponse = Awaited<ReturnType<typeof RolesService.getV1RolesByRoleIdPermissions>>;
export type RolesServiceGetV1RolesByRoleIdPermissionsQueryResult<TData = RolesServiceGetV1RolesByRoleIdPermissionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRolesServiceGetV1RolesByRoleIdPermissionsKey = "RolesServiceGetV1RolesByRoleIdPermissions";
export const UseRolesServiceGetV1RolesByRoleIdPermissionsKeyFn = ({ roleId }: {
  roleId: number;
}, queryKey?: Array<unknown>) => [useRolesServiceGetV1RolesByRoleIdPermissionsKey, ...(queryKey ?? [{ roleId }])];
export type RunReportsServiceGetV1RunreportsAvailableExportsByReportNameDefaultResponse = Awaited<ReturnType<typeof RunReportsService.getV1RunreportsAvailableExportsByReportName>>;
export type RunReportsServiceGetV1RunreportsAvailableExportsByReportNameQueryResult<TData = RunReportsServiceGetV1RunreportsAvailableExportsByReportNameDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRunReportsServiceGetV1RunreportsAvailableExportsByReportNameKey = "RunReportsServiceGetV1RunreportsAvailableExportsByReportName";
export const UseRunReportsServiceGetV1RunreportsAvailableExportsByReportNameKeyFn = ({ isSelfServiceUserReport, reportName }: {
  isSelfServiceUserReport?: boolean;
  reportName: string;
}, queryKey?: Array<unknown>) => [useRunReportsServiceGetV1RunreportsAvailableExportsByReportNameKey, ...(queryKey ?? [{ isSelfServiceUserReport, reportName }])];
export type RunReportsServiceGetV1RunreportsByReportNameDefaultResponse = Awaited<ReturnType<typeof RunReportsService.getV1RunreportsByReportName>>;
export type RunReportsServiceGetV1RunreportsByReportNameQueryResult<TData = RunReportsServiceGetV1RunreportsByReportNameDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useRunReportsServiceGetV1RunreportsByReportNameKey = "RunReportsServiceGetV1RunreportsByReportName";
export const UseRunReportsServiceGetV1RunreportsByReportNameKeyFn = ({ isSelfServiceUserReport, reportName }: {
  isSelfServiceUserReport?: boolean;
  reportName: string;
}, queryKey?: Array<unknown>) => [useRunReportsServiceGetV1RunreportsByReportNameKey, ...(queryKey ?? [{ isSelfServiceUserReport, reportName }])];
export type SavingsAccountServiceGetV1SavingsaccountsDefaultResponse = Awaited<ReturnType<typeof SavingsAccountService.getV1Savingsaccounts>>;
export type SavingsAccountServiceGetV1SavingsaccountsQueryResult<TData = SavingsAccountServiceGetV1SavingsaccountsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSavingsAccountServiceGetV1SavingsaccountsKey = "SavingsAccountServiceGetV1Savingsaccounts";
export const UseSavingsAccountServiceGetV1SavingsaccountsKeyFn = ({ externalId, limit, offset, orderBy, sortOrder }: {
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: Array<unknown>) => [useSavingsAccountServiceGetV1SavingsaccountsKey, ...(queryKey ?? [{ externalId, limit, offset, orderBy, sortOrder }])];
export type SavingsAccountServiceGetV1SavingsaccountsDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof SavingsAccountService.getV1SavingsaccountsDownloadtemplate>>;
export type SavingsAccountServiceGetV1SavingsaccountsDownloadtemplateQueryResult<TData = SavingsAccountServiceGetV1SavingsaccountsDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSavingsAccountServiceGetV1SavingsaccountsDownloadtemplateKey = "SavingsAccountServiceGetV1SavingsaccountsDownloadtemplate";
export const UseSavingsAccountServiceGetV1SavingsaccountsDownloadtemplateKeyFn = ({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: Array<unknown>) => [useSavingsAccountServiceGetV1SavingsaccountsDownloadtemplateKey, ...(queryKey ?? [{ dateFormat, officeId, staffId }])];
export type SavingsAccountServiceGetV1SavingsaccountsExternalIdByExternalIdDefaultResponse = Awaited<ReturnType<typeof SavingsAccountService.getV1SavingsaccountsExternalIdByExternalId>>;
export type SavingsAccountServiceGetV1SavingsaccountsExternalIdByExternalIdQueryResult<TData = SavingsAccountServiceGetV1SavingsaccountsExternalIdByExternalIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSavingsAccountServiceGetV1SavingsaccountsExternalIdByExternalIdKey = "SavingsAccountServiceGetV1SavingsaccountsExternalIdByExternalId";
export const UseSavingsAccountServiceGetV1SavingsaccountsExternalIdByExternalIdKeyFn = ({ associations, chargeStatus, externalId, staffInSelectedOfficeOnly }: {
  associations?: string;
  chargeStatus?: string;
  externalId: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: Array<unknown>) => [useSavingsAccountServiceGetV1SavingsaccountsExternalIdByExternalIdKey, ...(queryKey ?? [{ associations, chargeStatus, externalId, staffInSelectedOfficeOnly }])];
export type SavingsAccountServiceGetV1SavingsaccountsTemplateDefaultResponse = Awaited<ReturnType<typeof SavingsAccountService.getV1SavingsaccountsTemplate>>;
export type SavingsAccountServiceGetV1SavingsaccountsTemplateQueryResult<TData = SavingsAccountServiceGetV1SavingsaccountsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSavingsAccountServiceGetV1SavingsaccountsTemplateKey = "SavingsAccountServiceGetV1SavingsaccountsTemplate";
export const UseSavingsAccountServiceGetV1SavingsaccountsTemplateKeyFn = ({ clientId, groupId, productId, staffInSelectedOfficeOnly }: {
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: Array<unknown>) => [useSavingsAccountServiceGetV1SavingsaccountsTemplateKey, ...(queryKey ?? [{ clientId, groupId, productId, staffInSelectedOfficeOnly }])];
export type SavingsAccountServiceGetV1SavingsaccountsTransactionsDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof SavingsAccountService.getV1SavingsaccountsTransactionsDownloadtemplate>>;
export type SavingsAccountServiceGetV1SavingsaccountsTransactionsDownloadtemplateQueryResult<TData = SavingsAccountServiceGetV1SavingsaccountsTransactionsDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSavingsAccountServiceGetV1SavingsaccountsTransactionsDownloadtemplateKey = "SavingsAccountServiceGetV1SavingsaccountsTransactionsDownloadtemplate";
export const UseSavingsAccountServiceGetV1SavingsaccountsTransactionsDownloadtemplateKeyFn = ({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: Array<unknown>) => [useSavingsAccountServiceGetV1SavingsaccountsTransactionsDownloadtemplateKey, ...(queryKey ?? [{ dateFormat, officeId }])];
export type SavingsAccountServiceGetV1SavingsaccountsByAccountIdDefaultResponse = Awaited<ReturnType<typeof SavingsAccountService.getV1SavingsaccountsByAccountId>>;
export type SavingsAccountServiceGetV1SavingsaccountsByAccountIdQueryResult<TData = SavingsAccountServiceGetV1SavingsaccountsByAccountIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSavingsAccountServiceGetV1SavingsaccountsByAccountIdKey = "SavingsAccountServiceGetV1SavingsaccountsByAccountId";
export const UseSavingsAccountServiceGetV1SavingsaccountsByAccountIdKeyFn = ({ accountId, associations, chargeStatus, staffInSelectedOfficeOnly }: {
  accountId: number;
  associations?: string;
  chargeStatus?: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: Array<unknown>) => [useSavingsAccountServiceGetV1SavingsaccountsByAccountIdKey, ...(queryKey ?? [{ accountId, associations, chargeStatus, staffInSelectedOfficeOnly }])];
export type SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesDefaultResponse = Awaited<ReturnType<typeof SavingsChargesService.getV1SavingsaccountsBySavingsAccountIdCharges>>;
export type SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesQueryResult<TData = SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesKey = "SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdCharges";
export const UseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesKeyFn = ({ chargeStatus, savingsAccountId }: {
  chargeStatus?: string;
  savingsAccountId: number;
}, queryKey?: Array<unknown>) => [useSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesKey, ...(queryKey ?? [{ chargeStatus, savingsAccountId }])];
export type SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesTemplateDefaultResponse = Awaited<ReturnType<typeof SavingsChargesService.getV1SavingsaccountsBySavingsAccountIdChargesTemplate>>;
export type SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesTemplateQueryResult<TData = SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesTemplateKey = "SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesTemplate";
export const UseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesTemplateKeyFn = ({ savingsAccountId }: {
  savingsAccountId: number;
}, queryKey?: Array<unknown>) => [useSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesTemplateKey, ...(queryKey ?? [{ savingsAccountId }])];
export type SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdDefaultResponse = Awaited<ReturnType<typeof SavingsChargesService.getV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeId>>;
export type SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdQueryResult<TData = SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdKey = "SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeId";
export const UseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdKeyFn = ({ savingsAccountChargeId, savingsAccountId }: {
  savingsAccountChargeId: number;
  savingsAccountId: number;
}, queryKey?: Array<unknown>) => [useSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdKey, ...(queryKey ?? [{ savingsAccountChargeId, savingsAccountId }])];
export type DepositAccountOnHoldFundTransactionsServiceGetV1SavingsaccountsBySavingsIdOnholdtransactionsDefaultResponse = Awaited<ReturnType<typeof DepositAccountOnHoldFundTransactionsService.getV1SavingsaccountsBySavingsIdOnholdtransactions>>;
export type DepositAccountOnHoldFundTransactionsServiceGetV1SavingsaccountsBySavingsIdOnholdtransactionsQueryResult<TData = DepositAccountOnHoldFundTransactionsServiceGetV1SavingsaccountsBySavingsIdOnholdtransactionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDepositAccountOnHoldFundTransactionsServiceGetV1SavingsaccountsBySavingsIdOnholdtransactionsKey = "DepositAccountOnHoldFundTransactionsServiceGetV1SavingsaccountsBySavingsIdOnholdtransactions";
export const UseDepositAccountOnHoldFundTransactionsServiceGetV1SavingsaccountsBySavingsIdOnholdtransactionsKeyFn = ({ guarantorFundingId, limit, offset, orderBy, savingsId, sortOrder }: {
  guarantorFundingId?: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  savingsId: number;
  sortOrder?: string;
}, queryKey?: Array<unknown>) => [useDepositAccountOnHoldFundTransactionsServiceGetV1SavingsaccountsBySavingsIdOnholdtransactionsKey, ...(queryKey ?? [{ guarantorFundingId, limit, offset, orderBy, savingsId, sortOrder }])];
export type SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsSearchDefaultResponse = Awaited<ReturnType<typeof SavingsAccountTransactionsService.getV1SavingsaccountsBySavingsIdTransactionsSearch>>;
export type SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsSearchQueryResult<TData = SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsSearchDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsSearchKey = "SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsSearch";
export const UseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsSearchKeyFn = ({ credit, dateFormat, debit, fromAmount, fromDate, fromSubmittedDate, limit, locale, offset, orderBy, savingsId, sortOrder, toAmount, toDate, toSubmittedDate, types }: {
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
}, queryKey?: Array<unknown>) => [useSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsSearchKey, ...(queryKey ?? [{ credit, dateFormat, debit, fromAmount, fromDate, fromSubmittedDate, limit, locale, offset, orderBy, savingsId, sortOrder, toAmount, toDate, toSubmittedDate, types }])];
export type SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsTemplateDefaultResponse = Awaited<ReturnType<typeof SavingsAccountTransactionsService.getV1SavingsaccountsBySavingsIdTransactionsTemplate>>;
export type SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsTemplateQueryResult<TData = SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsTemplateKey = "SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsTemplate";
export const UseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsTemplateKeyFn = ({ savingsId }: {
  savingsId: number;
}, queryKey?: Array<unknown>) => [useSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsTemplateKey, ...(queryKey ?? [{ savingsId }])];
export type SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsByTransactionIdDefaultResponse = Awaited<ReturnType<typeof SavingsAccountTransactionsService.getV1SavingsaccountsBySavingsIdTransactionsByTransactionId>>;
export type SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsByTransactionIdQueryResult<TData = SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsByTransactionIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsByTransactionIdKey = "SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsByTransactionId";
export const UseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsByTransactionIdKeyFn = ({ savingsId, transactionId }: {
  savingsId: number;
  transactionId: number;
}, queryKey?: Array<unknown>) => [useSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsByTransactionIdKey, ...(queryKey ?? [{ savingsId, transactionId }])];
export type SavingsProductServiceGetV1SavingsproductsDefaultResponse = Awaited<ReturnType<typeof SavingsProductService.getV1Savingsproducts>>;
export type SavingsProductServiceGetV1SavingsproductsQueryResult<TData = SavingsProductServiceGetV1SavingsproductsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSavingsProductServiceGetV1SavingsproductsKey = "SavingsProductServiceGetV1Savingsproducts";
export const UseSavingsProductServiceGetV1SavingsproductsKeyFn = (queryKey?: Array<unknown>) => [useSavingsProductServiceGetV1SavingsproductsKey, ...(queryKey ?? [])];
export type SavingsProductServiceGetV1SavingsproductsTemplateDefaultResponse = Awaited<ReturnType<typeof SavingsProductService.getV1SavingsproductsTemplate>>;
export type SavingsProductServiceGetV1SavingsproductsTemplateQueryResult<TData = SavingsProductServiceGetV1SavingsproductsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSavingsProductServiceGetV1SavingsproductsTemplateKey = "SavingsProductServiceGetV1SavingsproductsTemplate";
export const UseSavingsProductServiceGetV1SavingsproductsTemplateKeyFn = (queryKey?: Array<unknown>) => [useSavingsProductServiceGetV1SavingsproductsTemplateKey, ...(queryKey ?? [])];
export type SavingsProductServiceGetV1SavingsproductsByProductIdDefaultResponse = Awaited<ReturnType<typeof SavingsProductService.getV1SavingsproductsByProductId>>;
export type SavingsProductServiceGetV1SavingsproductsByProductIdQueryResult<TData = SavingsProductServiceGetV1SavingsproductsByProductIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSavingsProductServiceGetV1SavingsproductsByProductIdKey = "SavingsProductServiceGetV1SavingsproductsByProductId";
export const UseSavingsProductServiceGetV1SavingsproductsByProductIdKeyFn = ({ productId }: {
  productId: number;
}, queryKey?: Array<unknown>) => [useSavingsProductServiceGetV1SavingsproductsByProductIdKey, ...(queryKey ?? [{ productId }])];
export type SchedulerServiceGetV1SchedulerDefaultResponse = Awaited<ReturnType<typeof SchedulerService.getV1Scheduler>>;
export type SchedulerServiceGetV1SchedulerQueryResult<TData = SchedulerServiceGetV1SchedulerDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSchedulerServiceGetV1SchedulerKey = "SchedulerServiceGetV1Scheduler";
export const UseSchedulerServiceGetV1SchedulerKeyFn = (queryKey?: Array<unknown>) => [useSchedulerServiceGetV1SchedulerKey, ...(queryKey ?? [])];
export type SearchApiServiceGetV1SearchDefaultResponse = Awaited<ReturnType<typeof SearchApiService.getV1Search>>;
export type SearchApiServiceGetV1SearchQueryResult<TData = SearchApiServiceGetV1SearchDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSearchApiServiceGetV1SearchKey = "SearchApiServiceGetV1Search";
export const UseSearchApiServiceGetV1SearchKeyFn = ({ exactMatch, query, resource }: {
  exactMatch?: boolean;
  query?: string;
  resource?: string;
} = {}, queryKey?: Array<unknown>) => [useSearchApiServiceGetV1SearchKey, ...(queryKey ?? [{ exactMatch, query, resource }])];
export type SearchApiServiceGetV1SearchTemplateDefaultResponse = Awaited<ReturnType<typeof SearchApiService.getV1SearchTemplate>>;
export type SearchApiServiceGetV1SearchTemplateQueryResult<TData = SearchApiServiceGetV1SearchTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSearchApiServiceGetV1SearchTemplateKey = "SearchApiServiceGetV1SearchTemplate";
export const UseSearchApiServiceGetV1SearchTemplateKeyFn = (queryKey?: Array<unknown>) => [useSearchApiServiceGetV1SearchTemplateKey, ...(queryKey ?? [])];
export type SelfAccountTransferServiceGetV1SelfAccounttransfersTemplateDefaultResponse = Awaited<ReturnType<typeof SelfAccountTransferService.getV1SelfAccounttransfersTemplate>>;
export type SelfAccountTransferServiceGetV1SelfAccounttransfersTemplateQueryResult<TData = SelfAccountTransferServiceGetV1SelfAccounttransfersTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfAccountTransferServiceGetV1SelfAccounttransfersTemplateKey = "SelfAccountTransferServiceGetV1SelfAccounttransfersTemplate";
export const UseSelfAccountTransferServiceGetV1SelfAccounttransfersTemplateKeyFn = ({ type }: {
  type?: string;
} = {}, queryKey?: Array<unknown>) => [useSelfAccountTransferServiceGetV1SelfAccounttransfersTemplateKey, ...(queryKey ?? [{ type }])];
export type SelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptDefaultResponse = Awaited<ReturnType<typeof SelfThirdPartyTransferService.getV1SelfBeneficiariesTpt>>;
export type SelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptQueryResult<TData = SelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptKey = "SelfThirdPartyTransferServiceGetV1SelfBeneficiariesTpt";
export const UseSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptKeyFn = (queryKey?: Array<unknown>) => [useSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptKey, ...(queryKey ?? [])];
export type SelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptTemplateDefaultResponse = Awaited<ReturnType<typeof SelfThirdPartyTransferService.getV1SelfBeneficiariesTptTemplate>>;
export type SelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptTemplateQueryResult<TData = SelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptTemplateKey = "SelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptTemplate";
export const UseSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptTemplateKeyFn = (queryKey?: Array<unknown>) => [useSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptTemplateKey, ...(queryKey ?? [])];
export type SelfClientServiceGetV1SelfClientsDefaultResponse = Awaited<ReturnType<typeof SelfClientService.getV1SelfClients>>;
export type SelfClientServiceGetV1SelfClientsQueryResult<TData = SelfClientServiceGetV1SelfClientsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfClientServiceGetV1SelfClientsKey = "SelfClientServiceGetV1SelfClients";
export const UseSelfClientServiceGetV1SelfClientsKeyFn = ({ displayName, firstName, lastName, legalForm, limit, offset, orderBy, sortOrder, status }: {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  legalForm?: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  status?: string;
} = {}, queryKey?: Array<unknown>) => [useSelfClientServiceGetV1SelfClientsKey, ...(queryKey ?? [{ displayName, firstName, lastName, legalForm, limit, offset, orderBy, sortOrder, status }])];
export type SelfClientServiceGetV1SelfClientsByClientIdDefaultResponse = Awaited<ReturnType<typeof SelfClientService.getV1SelfClientsByClientId>>;
export type SelfClientServiceGetV1SelfClientsByClientIdQueryResult<TData = SelfClientServiceGetV1SelfClientsByClientIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfClientServiceGetV1SelfClientsByClientIdKey = "SelfClientServiceGetV1SelfClientsByClientId";
export const UseSelfClientServiceGetV1SelfClientsByClientIdKeyFn = ({ clientId }: {
  clientId: number;
}, queryKey?: Array<unknown>) => [useSelfClientServiceGetV1SelfClientsByClientIdKey, ...(queryKey ?? [{ clientId }])];
export type SelfClientServiceGetV1SelfClientsByClientIdAccountsDefaultResponse = Awaited<ReturnType<typeof SelfClientService.getV1SelfClientsByClientIdAccounts>>;
export type SelfClientServiceGetV1SelfClientsByClientIdAccountsQueryResult<TData = SelfClientServiceGetV1SelfClientsByClientIdAccountsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfClientServiceGetV1SelfClientsByClientIdAccountsKey = "SelfClientServiceGetV1SelfClientsByClientIdAccounts";
export const UseSelfClientServiceGetV1SelfClientsByClientIdAccountsKeyFn = ({ clientId }: {
  clientId: number;
}, queryKey?: Array<unknown>) => [useSelfClientServiceGetV1SelfClientsByClientIdAccountsKey, ...(queryKey ?? [{ clientId }])];
export type SelfClientServiceGetV1SelfClientsByClientIdChargesDefaultResponse = Awaited<ReturnType<typeof SelfClientService.getV1SelfClientsByClientIdCharges>>;
export type SelfClientServiceGetV1SelfClientsByClientIdChargesQueryResult<TData = SelfClientServiceGetV1SelfClientsByClientIdChargesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfClientServiceGetV1SelfClientsByClientIdChargesKey = "SelfClientServiceGetV1SelfClientsByClientIdCharges";
export const UseSelfClientServiceGetV1SelfClientsByClientIdChargesKeyFn = ({ chargeStatus, clientId, limit, offset, pendingPayment }: {
  chargeStatus?: string;
  clientId: number;
  limit?: number;
  offset?: number;
  pendingPayment?: boolean;
}, queryKey?: Array<unknown>) => [useSelfClientServiceGetV1SelfClientsByClientIdChargesKey, ...(queryKey ?? [{ chargeStatus, clientId, limit, offset, pendingPayment }])];
export type SelfClientServiceGetV1SelfClientsByClientIdChargesByChargeIdDefaultResponse = Awaited<ReturnType<typeof SelfClientService.getV1SelfClientsByClientIdChargesByChargeId>>;
export type SelfClientServiceGetV1SelfClientsByClientIdChargesByChargeIdQueryResult<TData = SelfClientServiceGetV1SelfClientsByClientIdChargesByChargeIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfClientServiceGetV1SelfClientsByClientIdChargesByChargeIdKey = "SelfClientServiceGetV1SelfClientsByClientIdChargesByChargeId";
export const UseSelfClientServiceGetV1SelfClientsByClientIdChargesByChargeIdKeyFn = ({ chargeId, clientId }: {
  chargeId: number;
  clientId: number;
}, queryKey?: Array<unknown>) => [useSelfClientServiceGetV1SelfClientsByClientIdChargesByChargeIdKey, ...(queryKey ?? [{ chargeId, clientId }])];
export type SelfClientServiceGetV1SelfClientsByClientIdImagesDefaultResponse = Awaited<ReturnType<typeof SelfClientService.getV1SelfClientsByClientIdImages>>;
export type SelfClientServiceGetV1SelfClientsByClientIdImagesQueryResult<TData = SelfClientServiceGetV1SelfClientsByClientIdImagesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfClientServiceGetV1SelfClientsByClientIdImagesKey = "SelfClientServiceGetV1SelfClientsByClientIdImages";
export const UseSelfClientServiceGetV1SelfClientsByClientIdImagesKeyFn = ({ clientId, maxHeight, maxWidth, output }: {
  clientId: number;
  maxHeight?: number;
  maxWidth?: number;
  output?: string;
}, queryKey?: Array<unknown>) => [useSelfClientServiceGetV1SelfClientsByClientIdImagesKey, ...(queryKey ?? [{ clientId, maxHeight, maxWidth, output }])];
export type SelfClientServiceGetV1SelfClientsByClientIdObligeedetailsDefaultResponse = Awaited<ReturnType<typeof SelfClientService.getV1SelfClientsByClientIdObligeedetails>>;
export type SelfClientServiceGetV1SelfClientsByClientIdObligeedetailsQueryResult<TData = SelfClientServiceGetV1SelfClientsByClientIdObligeedetailsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfClientServiceGetV1SelfClientsByClientIdObligeedetailsKey = "SelfClientServiceGetV1SelfClientsByClientIdObligeedetails";
export const UseSelfClientServiceGetV1SelfClientsByClientIdObligeedetailsKeyFn = ({ clientId }: {
  clientId: number;
}, queryKey?: Array<unknown>) => [useSelfClientServiceGetV1SelfClientsByClientIdObligeedetailsKey, ...(queryKey ?? [{ clientId }])];
export type SelfClientServiceGetV1SelfClientsByClientIdTransactionsDefaultResponse = Awaited<ReturnType<typeof SelfClientService.getV1SelfClientsByClientIdTransactions>>;
export type SelfClientServiceGetV1SelfClientsByClientIdTransactionsQueryResult<TData = SelfClientServiceGetV1SelfClientsByClientIdTransactionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfClientServiceGetV1SelfClientsByClientIdTransactionsKey = "SelfClientServiceGetV1SelfClientsByClientIdTransactions";
export const UseSelfClientServiceGetV1SelfClientsByClientIdTransactionsKeyFn = ({ clientId, limit, offset }: {
  clientId: number;
  limit?: number;
  offset?: number;
}, queryKey?: Array<unknown>) => [useSelfClientServiceGetV1SelfClientsByClientIdTransactionsKey, ...(queryKey ?? [{ clientId, limit, offset }])];
export type SelfClientServiceGetV1SelfClientsByClientIdTransactionsByTransactionIdDefaultResponse = Awaited<ReturnType<typeof SelfClientService.getV1SelfClientsByClientIdTransactionsByTransactionId>>;
export type SelfClientServiceGetV1SelfClientsByClientIdTransactionsByTransactionIdQueryResult<TData = SelfClientServiceGetV1SelfClientsByClientIdTransactionsByTransactionIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfClientServiceGetV1SelfClientsByClientIdTransactionsByTransactionIdKey = "SelfClientServiceGetV1SelfClientsByClientIdTransactionsByTransactionId";
export const UseSelfClientServiceGetV1SelfClientsByClientIdTransactionsByTransactionIdKeyFn = ({ clientId, transactionId }: {
  clientId: number;
  transactionId: number;
}, queryKey?: Array<unknown>) => [useSelfClientServiceGetV1SelfClientsByClientIdTransactionsByTransactionIdKey, ...(queryKey ?? [{ clientId, transactionId }])];
export type DeviceRegistrationServiceGetV1SelfDeviceRegistrationDefaultResponse = Awaited<ReturnType<typeof DeviceRegistrationService.getV1SelfDeviceRegistration>>;
export type DeviceRegistrationServiceGetV1SelfDeviceRegistrationQueryResult<TData = DeviceRegistrationServiceGetV1SelfDeviceRegistrationDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDeviceRegistrationServiceGetV1SelfDeviceRegistrationKey = "DeviceRegistrationServiceGetV1SelfDeviceRegistration";
export const UseDeviceRegistrationServiceGetV1SelfDeviceRegistrationKeyFn = (queryKey?: Array<unknown>) => [useDeviceRegistrationServiceGetV1SelfDeviceRegistrationKey, ...(queryKey ?? [])];
export type DeviceRegistrationServiceGetV1SelfDeviceRegistrationClientByClientIdDefaultResponse = Awaited<ReturnType<typeof DeviceRegistrationService.getV1SelfDeviceRegistrationClientByClientId>>;
export type DeviceRegistrationServiceGetV1SelfDeviceRegistrationClientByClientIdQueryResult<TData = DeviceRegistrationServiceGetV1SelfDeviceRegistrationClientByClientIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDeviceRegistrationServiceGetV1SelfDeviceRegistrationClientByClientIdKey = "DeviceRegistrationServiceGetV1SelfDeviceRegistrationClientByClientId";
export const UseDeviceRegistrationServiceGetV1SelfDeviceRegistrationClientByClientIdKeyFn = ({ clientId }: {
  clientId: number;
}, queryKey?: Array<unknown>) => [useDeviceRegistrationServiceGetV1SelfDeviceRegistrationClientByClientIdKey, ...(queryKey ?? [{ clientId }])];
export type DeviceRegistrationServiceGetV1SelfDeviceRegistrationByIdDefaultResponse = Awaited<ReturnType<typeof DeviceRegistrationService.getV1SelfDeviceRegistrationById>>;
export type DeviceRegistrationServiceGetV1SelfDeviceRegistrationByIdQueryResult<TData = DeviceRegistrationServiceGetV1SelfDeviceRegistrationByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDeviceRegistrationServiceGetV1SelfDeviceRegistrationByIdKey = "DeviceRegistrationServiceGetV1SelfDeviceRegistrationById";
export const UseDeviceRegistrationServiceGetV1SelfDeviceRegistrationByIdKeyFn = ({ id }: {
  id: number;
}, queryKey?: Array<unknown>) => [useDeviceRegistrationServiceGetV1SelfDeviceRegistrationByIdKey, ...(queryKey ?? [{ id }])];
export type SelfLoanProductsServiceGetV1SelfLoanproductsDefaultResponse = Awaited<ReturnType<typeof SelfLoanProductsService.getV1SelfLoanproducts>>;
export type SelfLoanProductsServiceGetV1SelfLoanproductsQueryResult<TData = SelfLoanProductsServiceGetV1SelfLoanproductsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfLoanProductsServiceGetV1SelfLoanproductsKey = "SelfLoanProductsServiceGetV1SelfLoanproducts";
export const UseSelfLoanProductsServiceGetV1SelfLoanproductsKeyFn = ({ clientId }: {
  clientId?: number;
} = {}, queryKey?: Array<unknown>) => [useSelfLoanProductsServiceGetV1SelfLoanproductsKey, ...(queryKey ?? [{ clientId }])];
export type SelfLoanProductsServiceGetV1SelfLoanproductsByProductIdDefaultResponse = Awaited<ReturnType<typeof SelfLoanProductsService.getV1SelfLoanproductsByProductId>>;
export type SelfLoanProductsServiceGetV1SelfLoanproductsByProductIdQueryResult<TData = SelfLoanProductsServiceGetV1SelfLoanproductsByProductIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfLoanProductsServiceGetV1SelfLoanproductsByProductIdKey = "SelfLoanProductsServiceGetV1SelfLoanproductsByProductId";
export const UseSelfLoanProductsServiceGetV1SelfLoanproductsByProductIdKeyFn = ({ clientId, productId }: {
  clientId?: number;
  productId: number;
}, queryKey?: Array<unknown>) => [useSelfLoanProductsServiceGetV1SelfLoanproductsByProductIdKey, ...(queryKey ?? [{ clientId, productId }])];
export type SelfLoansServiceGetV1SelfLoansTemplateDefaultResponse = Awaited<ReturnType<typeof SelfLoansService.getV1SelfLoansTemplate>>;
export type SelfLoansServiceGetV1SelfLoansTemplateQueryResult<TData = SelfLoansServiceGetV1SelfLoansTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfLoansServiceGetV1SelfLoansTemplateKey = "SelfLoansServiceGetV1SelfLoansTemplate";
export const UseSelfLoansServiceGetV1SelfLoansTemplateKeyFn = ({ clientId, productId, templateType }: {
  clientId?: number;
  productId?: number;
  templateType?: string;
} = {}, queryKey?: Array<unknown>) => [useSelfLoansServiceGetV1SelfLoansTemplateKey, ...(queryKey ?? [{ clientId, productId, templateType }])];
export type SelfLoansServiceGetV1SelfLoansByLoanIdDefaultResponse = Awaited<ReturnType<typeof SelfLoansService.getV1SelfLoansByLoanId>>;
export type SelfLoansServiceGetV1SelfLoansByLoanIdQueryResult<TData = SelfLoansServiceGetV1SelfLoansByLoanIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfLoansServiceGetV1SelfLoansByLoanIdKey = "SelfLoansServiceGetV1SelfLoansByLoanId";
export const UseSelfLoansServiceGetV1SelfLoansByLoanIdKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useSelfLoansServiceGetV1SelfLoansByLoanIdKey, ...(queryKey ?? [{ loanId }])];
export type SelfLoansServiceGetV1SelfLoansByLoanIdChargesDefaultResponse = Awaited<ReturnType<typeof SelfLoansService.getV1SelfLoansByLoanIdCharges>>;
export type SelfLoansServiceGetV1SelfLoansByLoanIdChargesQueryResult<TData = SelfLoansServiceGetV1SelfLoansByLoanIdChargesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfLoansServiceGetV1SelfLoansByLoanIdChargesKey = "SelfLoansServiceGetV1SelfLoansByLoanIdCharges";
export const UseSelfLoansServiceGetV1SelfLoansByLoanIdChargesKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useSelfLoansServiceGetV1SelfLoansByLoanIdChargesKey, ...(queryKey ?? [{ loanId }])];
export type SelfLoansServiceGetV1SelfLoansByLoanIdChargesByChargeIdDefaultResponse = Awaited<ReturnType<typeof SelfLoansService.getV1SelfLoansByLoanIdChargesByChargeId>>;
export type SelfLoansServiceGetV1SelfLoansByLoanIdChargesByChargeIdQueryResult<TData = SelfLoansServiceGetV1SelfLoansByLoanIdChargesByChargeIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfLoansServiceGetV1SelfLoansByLoanIdChargesByChargeIdKey = "SelfLoansServiceGetV1SelfLoansByLoanIdChargesByChargeId";
export const UseSelfLoansServiceGetV1SelfLoansByLoanIdChargesByChargeIdKeyFn = ({ chargeId, loanId }: {
  chargeId: number;
  loanId: number;
}, queryKey?: Array<unknown>) => [useSelfLoansServiceGetV1SelfLoansByLoanIdChargesByChargeIdKey, ...(queryKey ?? [{ chargeId, loanId }])];
export type SelfLoansServiceGetV1SelfLoansByLoanIdGuarantorsDefaultResponse = Awaited<ReturnType<typeof SelfLoansService.getV1SelfLoansByLoanIdGuarantors>>;
export type SelfLoansServiceGetV1SelfLoansByLoanIdGuarantorsQueryResult<TData = SelfLoansServiceGetV1SelfLoansByLoanIdGuarantorsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfLoansServiceGetV1SelfLoansByLoanIdGuarantorsKey = "SelfLoansServiceGetV1SelfLoansByLoanIdGuarantors";
export const UseSelfLoansServiceGetV1SelfLoansByLoanIdGuarantorsKeyFn = ({ loanId }: {
  loanId: number;
}, queryKey?: Array<unknown>) => [useSelfLoansServiceGetV1SelfLoansByLoanIdGuarantorsKey, ...(queryKey ?? [{ loanId }])];
export type SelfLoansServiceGetV1SelfLoansByLoanIdTransactionsByTransactionIdDefaultResponse = Awaited<ReturnType<typeof SelfLoansService.getV1SelfLoansByLoanIdTransactionsByTransactionId>>;
export type SelfLoansServiceGetV1SelfLoansByLoanIdTransactionsByTransactionIdQueryResult<TData = SelfLoansServiceGetV1SelfLoansByLoanIdTransactionsByTransactionIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfLoansServiceGetV1SelfLoansByLoanIdTransactionsByTransactionIdKey = "SelfLoansServiceGetV1SelfLoansByLoanIdTransactionsByTransactionId";
export const UseSelfLoansServiceGetV1SelfLoansByLoanIdTransactionsByTransactionIdKeyFn = ({ fields, loanId, transactionId }: {
  fields?: string;
  loanId: number;
  transactionId: number;
}, queryKey?: Array<unknown>) => [useSelfLoansServiceGetV1SelfLoansByLoanIdTransactionsByTransactionIdKey, ...(queryKey ?? [{ fields, loanId, transactionId }])];
export type PocketServiceGetV1SelfPocketsDefaultResponse = Awaited<ReturnType<typeof PocketService.getV1SelfPockets>>;
export type PocketServiceGetV1SelfPocketsQueryResult<TData = PocketServiceGetV1SelfPocketsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const usePocketServiceGetV1SelfPocketsKey = "PocketServiceGetV1SelfPockets";
export const UsePocketServiceGetV1SelfPocketsKeyFn = (queryKey?: Array<unknown>) => [usePocketServiceGetV1SelfPocketsKey, ...(queryKey ?? [])];
export type SelfShareProductsServiceGetV1SelfProductsShareDefaultResponse = Awaited<ReturnType<typeof SelfShareProductsService.getV1SelfProductsShare>>;
export type SelfShareProductsServiceGetV1SelfProductsShareQueryResult<TData = SelfShareProductsServiceGetV1SelfProductsShareDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfShareProductsServiceGetV1SelfProductsShareKey = "SelfShareProductsServiceGetV1SelfProductsShare";
export const UseSelfShareProductsServiceGetV1SelfProductsShareKeyFn = ({ clientId, limit, offset }: {
  clientId?: number;
  limit?: number;
  offset?: number;
} = {}, queryKey?: Array<unknown>) => [useSelfShareProductsServiceGetV1SelfProductsShareKey, ...(queryKey ?? [{ clientId, limit, offset }])];
export type SelfShareProductsServiceGetV1SelfProductsShareByProductIdDefaultResponse = Awaited<ReturnType<typeof SelfShareProductsService.getV1SelfProductsShareByProductId>>;
export type SelfShareProductsServiceGetV1SelfProductsShareByProductIdQueryResult<TData = SelfShareProductsServiceGetV1SelfProductsShareByProductIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfShareProductsServiceGetV1SelfProductsShareByProductIdKey = "SelfShareProductsServiceGetV1SelfProductsShareByProductId";
export const UseSelfShareProductsServiceGetV1SelfProductsShareByProductIdKeyFn = ({ clientId, productId, type }: {
  clientId?: number;
  productId: number;
  type: string;
}, queryKey?: Array<unknown>) => [useSelfShareProductsServiceGetV1SelfProductsShareByProductIdKey, ...(queryKey ?? [{ clientId, productId, type }])];
export type SelfRunReportServiceGetV1SelfRunreportsByReportNameDefaultResponse = Awaited<ReturnType<typeof SelfRunReportService.getV1SelfRunreportsByReportName>>;
export type SelfRunReportServiceGetV1SelfRunreportsByReportNameQueryResult<TData = SelfRunReportServiceGetV1SelfRunreportsByReportNameDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfRunReportServiceGetV1SelfRunreportsByReportNameKey = "SelfRunReportServiceGetV1SelfRunreportsByReportName";
export const UseSelfRunReportServiceGetV1SelfRunreportsByReportNameKeyFn = ({ reportName }: {
  reportName: string;
}, queryKey?: Array<unknown>) => [useSelfRunReportServiceGetV1SelfRunreportsByReportNameKey, ...(queryKey ?? [{ reportName }])];
export type SelfSavingsAccountServiceGetV1SelfSavingsaccountsTemplateDefaultResponse = Awaited<ReturnType<typeof SelfSavingsAccountService.getV1SelfSavingsaccountsTemplate>>;
export type SelfSavingsAccountServiceGetV1SelfSavingsaccountsTemplateQueryResult<TData = SelfSavingsAccountServiceGetV1SelfSavingsaccountsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfSavingsAccountServiceGetV1SelfSavingsaccountsTemplateKey = "SelfSavingsAccountServiceGetV1SelfSavingsaccountsTemplate";
export const UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsTemplateKeyFn = ({ clientId, productId }: {
  clientId?: number;
  productId?: number;
} = {}, queryKey?: Array<unknown>) => [useSelfSavingsAccountServiceGetV1SelfSavingsaccountsTemplateKey, ...(queryKey ?? [{ clientId, productId }])];
export type SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdDefaultResponse = Awaited<ReturnType<typeof SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountId>>;
export type SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdQueryResult<TData = SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdKey = "SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountId";
export const UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdKeyFn = ({ accountId, associations, chargeStatus }: {
  accountId: number;
  associations?: string;
  chargeStatus?: string;
}, queryKey?: Array<unknown>) => [useSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdKey, ...(queryKey ?? [{ accountId, associations, chargeStatus }])];
export type SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesDefaultResponse = Awaited<ReturnType<typeof SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountIdCharges>>;
export type SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesQueryResult<TData = SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesKey = "SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdCharges";
export const UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesKeyFn = ({ accountId, chargeStatus }: {
  accountId: number;
  chargeStatus?: string;
}, queryKey?: Array<unknown>) => [useSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesKey, ...(queryKey ?? [{ accountId, chargeStatus }])];
export type SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeIdDefaultResponse = Awaited<ReturnType<typeof SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeId>>;
export type SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeIdQueryResult<TData = SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeIdKey = "SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeId";
export const UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeIdKeyFn = ({ accountId, savingsAccountChargeId }: {
  accountId: number;
  savingsAccountChargeId: number;
}, queryKey?: Array<unknown>) => [useSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeIdKey, ...(queryKey ?? [{ accountId, savingsAccountChargeId }])];
export type SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdTransactionsByTransactionIdDefaultResponse = Awaited<ReturnType<typeof SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountIdTransactionsByTransactionId>>;
export type SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdTransactionsByTransactionIdQueryResult<TData = SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdTransactionsByTransactionIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdTransactionsByTransactionIdKey = "SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdTransactionsByTransactionId";
export const UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdTransactionsByTransactionIdKeyFn = ({ accountId, transactionId }: {
  accountId: number;
  transactionId: number;
}, queryKey?: Array<unknown>) => [useSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdTransactionsByTransactionIdKey, ...(queryKey ?? [{ accountId, transactionId }])];
export type SelfSavingsProductsServiceGetV1SelfSavingsproductsDefaultResponse = Awaited<ReturnType<typeof SelfSavingsProductsService.getV1SelfSavingsproducts>>;
export type SelfSavingsProductsServiceGetV1SelfSavingsproductsQueryResult<TData = SelfSavingsProductsServiceGetV1SelfSavingsproductsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfSavingsProductsServiceGetV1SelfSavingsproductsKey = "SelfSavingsProductsServiceGetV1SelfSavingsproducts";
export const UseSelfSavingsProductsServiceGetV1SelfSavingsproductsKeyFn = ({ clientId }: {
  clientId?: number;
} = {}, queryKey?: Array<unknown>) => [useSelfSavingsProductsServiceGetV1SelfSavingsproductsKey, ...(queryKey ?? [{ clientId }])];
export type SelfSavingsProductsServiceGetV1SelfSavingsproductsByProductIdDefaultResponse = Awaited<ReturnType<typeof SelfSavingsProductsService.getV1SelfSavingsproductsByProductId>>;
export type SelfSavingsProductsServiceGetV1SelfSavingsproductsByProductIdQueryResult<TData = SelfSavingsProductsServiceGetV1SelfSavingsproductsByProductIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfSavingsProductsServiceGetV1SelfSavingsproductsByProductIdKey = "SelfSavingsProductsServiceGetV1SelfSavingsproductsByProductId";
export const UseSelfSavingsProductsServiceGetV1SelfSavingsproductsByProductIdKeyFn = ({ clientId, productId }: {
  clientId?: number;
  productId: number;
}, queryKey?: Array<unknown>) => [useSelfSavingsProductsServiceGetV1SelfSavingsproductsByProductIdKey, ...(queryKey ?? [{ clientId, productId }])];
export type SelfShareAccountsServiceGetV1SelfShareaccountsTemplateDefaultResponse = Awaited<ReturnType<typeof SelfShareAccountsService.getV1SelfShareaccountsTemplate>>;
export type SelfShareAccountsServiceGetV1SelfShareaccountsTemplateQueryResult<TData = SelfShareAccountsServiceGetV1SelfShareaccountsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfShareAccountsServiceGetV1SelfShareaccountsTemplateKey = "SelfShareAccountsServiceGetV1SelfShareaccountsTemplate";
export const UseSelfShareAccountsServiceGetV1SelfShareaccountsTemplateKeyFn = ({ clientId, productId }: {
  clientId?: number;
  productId?: number;
} = {}, queryKey?: Array<unknown>) => [useSelfShareAccountsServiceGetV1SelfShareaccountsTemplateKey, ...(queryKey ?? [{ clientId, productId }])];
export type SelfShareAccountsServiceGetV1SelfShareaccountsByAccountIdDefaultResponse = Awaited<ReturnType<typeof SelfShareAccountsService.getV1SelfShareaccountsByAccountId>>;
export type SelfShareAccountsServiceGetV1SelfShareaccountsByAccountIdQueryResult<TData = SelfShareAccountsServiceGetV1SelfShareaccountsByAccountIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfShareAccountsServiceGetV1SelfShareaccountsByAccountIdKey = "SelfShareAccountsServiceGetV1SelfShareaccountsByAccountId";
export const UseSelfShareAccountsServiceGetV1SelfShareaccountsByAccountIdKeyFn = ({ accountId }: {
  accountId: number;
}, queryKey?: Array<unknown>) => [useSelfShareAccountsServiceGetV1SelfShareaccountsByAccountIdKey, ...(queryKey ?? [{ accountId }])];
export type SelfSpmServiceGetV1SelfSurveysDefaultResponse = Awaited<ReturnType<typeof SelfSpmService.getV1SelfSurveys>>;
export type SelfSpmServiceGetV1SelfSurveysQueryResult<TData = SelfSpmServiceGetV1SelfSurveysDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfSpmServiceGetV1SelfSurveysKey = "SelfSpmServiceGetV1SelfSurveys";
export const UseSelfSpmServiceGetV1SelfSurveysKeyFn = (queryKey?: Array<unknown>) => [useSelfSpmServiceGetV1SelfSurveysKey, ...(queryKey ?? [])];
export type SelfScoreCardServiceGetV1SelfSurveysScorecardsClientsByClientIdDefaultResponse = Awaited<ReturnType<typeof SelfScoreCardService.getV1SelfSurveysScorecardsClientsByClientId>>;
export type SelfScoreCardServiceGetV1SelfSurveysScorecardsClientsByClientIdQueryResult<TData = SelfScoreCardServiceGetV1SelfSurveysScorecardsClientsByClientIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfScoreCardServiceGetV1SelfSurveysScorecardsClientsByClientIdKey = "SelfScoreCardServiceGetV1SelfSurveysScorecardsClientsByClientId";
export const UseSelfScoreCardServiceGetV1SelfSurveysScorecardsClientsByClientIdKeyFn = ({ clientId }: {
  clientId: number;
}, queryKey?: Array<unknown>) => [useSelfScoreCardServiceGetV1SelfSurveysScorecardsClientsByClientIdKey, ...(queryKey ?? [{ clientId }])];
export type SelfUserDetailsServiceGetV1SelfUserdetailsDefaultResponse = Awaited<ReturnType<typeof SelfUserDetailsService.getV1SelfUserdetails>>;
export type SelfUserDetailsServiceGetV1SelfUserdetailsQueryResult<TData = SelfUserDetailsServiceGetV1SelfUserdetailsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfUserDetailsServiceGetV1SelfUserdetailsKey = "SelfUserDetailsServiceGetV1SelfUserdetails";
export const UseSelfUserDetailsServiceGetV1SelfUserdetailsKeyFn = (queryKey?: Array<unknown>) => [useSelfUserDetailsServiceGetV1SelfUserdetailsKey, ...(queryKey ?? [])];
export type SelfDividendServiceGetV1ShareproductByProductIdDividendDefaultResponse = Awaited<ReturnType<typeof SelfDividendService.getV1ShareproductByProductIdDividend>>;
export type SelfDividendServiceGetV1ShareproductByProductIdDividendQueryResult<TData = SelfDividendServiceGetV1ShareproductByProductIdDividendDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfDividendServiceGetV1ShareproductByProductIdDividendKey = "SelfDividendServiceGetV1ShareproductByProductIdDividend";
export const UseSelfDividendServiceGetV1ShareproductByProductIdDividendKeyFn = ({ limit, offset, orderBy, productId, sortOrder, status }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  productId: number;
  sortOrder?: string;
  status?: number;
}, queryKey?: Array<unknown>) => [useSelfDividendServiceGetV1ShareproductByProductIdDividendKey, ...(queryKey ?? [{ limit, offset, orderBy, productId, sortOrder, status }])];
export type SelfDividendServiceGetV1ShareproductByProductIdDividendByDividendIdDefaultResponse = Awaited<ReturnType<typeof SelfDividendService.getV1ShareproductByProductIdDividendByDividendId>>;
export type SelfDividendServiceGetV1ShareproductByProductIdDividendByDividendIdQueryResult<TData = SelfDividendServiceGetV1ShareproductByProductIdDividendByDividendIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSelfDividendServiceGetV1ShareproductByProductIdDividendByDividendIdKey = "SelfDividendServiceGetV1ShareproductByProductIdDividendByDividendId";
export const UseSelfDividendServiceGetV1ShareproductByProductIdDividendByDividendIdKeyFn = ({ accountNo, dividendId, limit, offset, orderBy, productId, sortOrder }: {
  accountNo?: string;
  dividendId: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  productId: number;
  sortOrder?: string;
}, queryKey?: Array<unknown>) => [useSelfDividendServiceGetV1ShareproductByProductIdDividendByDividendIdKey, ...(queryKey ?? [{ accountNo, dividendId, limit, offset, orderBy, productId, sortOrder }])];
export type SmsServiceGetV1SmsDefaultResponse = Awaited<ReturnType<typeof SmsService.getV1Sms>>;
export type SmsServiceGetV1SmsQueryResult<TData = SmsServiceGetV1SmsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSmsServiceGetV1SmsKey = "SmsServiceGetV1Sms";
export const UseSmsServiceGetV1SmsKeyFn = (queryKey?: Array<unknown>) => [useSmsServiceGetV1SmsKey, ...(queryKey ?? [])];
export type SmsServiceGetV1SmsByCampaignIdMessageByStatusDefaultResponse = Awaited<ReturnType<typeof SmsService.getV1SmsByCampaignIdMessageByStatus>>;
export type SmsServiceGetV1SmsByCampaignIdMessageByStatusQueryResult<TData = SmsServiceGetV1SmsByCampaignIdMessageByStatusDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSmsServiceGetV1SmsByCampaignIdMessageByStatusKey = "SmsServiceGetV1SmsByCampaignIdMessageByStatus";
export const UseSmsServiceGetV1SmsByCampaignIdMessageByStatusKeyFn = ({ campaignId, dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }: {
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
}, queryKey?: Array<unknown>) => [useSmsServiceGetV1SmsByCampaignIdMessageByStatusKey, ...(queryKey ?? [{ campaignId, dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }])];
export type SmsServiceGetV1SmsByResourceIdDefaultResponse = Awaited<ReturnType<typeof SmsService.getV1SmsByResourceId>>;
export type SmsServiceGetV1SmsByResourceIdQueryResult<TData = SmsServiceGetV1SmsByResourceIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSmsServiceGetV1SmsByResourceIdKey = "SmsServiceGetV1SmsByResourceId";
export const UseSmsServiceGetV1SmsByResourceIdKeyFn = ({ resourceId }: {
  resourceId: number;
}, queryKey?: Array<unknown>) => [useSmsServiceGetV1SmsByResourceIdKey, ...(queryKey ?? [{ resourceId }])];
export type StaffServiceGetV1StaffDefaultResponse = Awaited<ReturnType<typeof StaffService.getV1Staff>>;
export type StaffServiceGetV1StaffQueryResult<TData = StaffServiceGetV1StaffDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useStaffServiceGetV1StaffKey = "StaffServiceGetV1Staff";
export const UseStaffServiceGetV1StaffKeyFn = ({ loanOfficersOnly, officeId, staffInOfficeHierarchy, status }: {
  loanOfficersOnly?: boolean;
  officeId?: number;
  staffInOfficeHierarchy?: boolean;
  status?: string;
} = {}, queryKey?: Array<unknown>) => [useStaffServiceGetV1StaffKey, ...(queryKey ?? [{ loanOfficersOnly, officeId, staffInOfficeHierarchy, status }])];
export type StaffServiceGetV1StaffDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof StaffService.getV1StaffDownloadtemplate>>;
export type StaffServiceGetV1StaffDownloadtemplateQueryResult<TData = StaffServiceGetV1StaffDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useStaffServiceGetV1StaffDownloadtemplateKey = "StaffServiceGetV1StaffDownloadtemplate";
export const UseStaffServiceGetV1StaffDownloadtemplateKeyFn = ({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: Array<unknown>) => [useStaffServiceGetV1StaffDownloadtemplateKey, ...(queryKey ?? [{ dateFormat, officeId }])];
export type StaffServiceGetV1StaffByStaffIdDefaultResponse = Awaited<ReturnType<typeof StaffService.getV1StaffByStaffId>>;
export type StaffServiceGetV1StaffByStaffIdQueryResult<TData = StaffServiceGetV1StaffByStaffIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useStaffServiceGetV1StaffByStaffIdKey = "StaffServiceGetV1StaffByStaffId";
export const UseStaffServiceGetV1StaffByStaffIdKeyFn = ({ staffId }: {
  staffId: number;
}, queryKey?: Array<unknown>) => [useStaffServiceGetV1StaffByStaffIdKey, ...(queryKey ?? [{ staffId }])];
export type StandingInstructionsHistoryServiceGetV1StandinginstructionrunhistoryDefaultResponse = Awaited<ReturnType<typeof StandingInstructionsHistoryService.getV1Standinginstructionrunhistory>>;
export type StandingInstructionsHistoryServiceGetV1StandinginstructionrunhistoryQueryResult<TData = StandingInstructionsHistoryServiceGetV1StandinginstructionrunhistoryDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useStandingInstructionsHistoryServiceGetV1StandinginstructionrunhistoryKey = "StandingInstructionsHistoryServiceGetV1Standinginstructionrunhistory";
export const UseStandingInstructionsHistoryServiceGetV1StandinginstructionrunhistoryKeyFn = ({ clientId, clientName, dateFormat, externalId, fromAccountId, fromAccountType, fromDate, limit, locale, offset, orderBy, sortOrder, toDate, transferType }: {
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
} = {}, queryKey?: Array<unknown>) => [useStandingInstructionsHistoryServiceGetV1StandinginstructionrunhistoryKey, ...(queryKey ?? [{ clientId, clientName, dateFormat, externalId, fromAccountId, fromAccountType, fromDate, limit, locale, offset, orderBy, sortOrder, toDate, transferType }])];
export type StandingInstructionsServiceGetV1StandinginstructionsDefaultResponse = Awaited<ReturnType<typeof StandingInstructionsService.getV1Standinginstructions>>;
export type StandingInstructionsServiceGetV1StandinginstructionsQueryResult<TData = StandingInstructionsServiceGetV1StandinginstructionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useStandingInstructionsServiceGetV1StandinginstructionsKey = "StandingInstructionsServiceGetV1Standinginstructions";
export const UseStandingInstructionsServiceGetV1StandinginstructionsKeyFn = ({ clientId, clientName, externalId, fromAccountId, fromAccountType, limit, offset, orderBy, sortOrder, transferType }: {
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
} = {}, queryKey?: Array<unknown>) => [useStandingInstructionsServiceGetV1StandinginstructionsKey, ...(queryKey ?? [{ clientId, clientName, externalId, fromAccountId, fromAccountType, limit, offset, orderBy, sortOrder, transferType }])];
export type StandingInstructionsServiceGetV1StandinginstructionsTemplateDefaultResponse = Awaited<ReturnType<typeof StandingInstructionsService.getV1StandinginstructionsTemplate>>;
export type StandingInstructionsServiceGetV1StandinginstructionsTemplateQueryResult<TData = StandingInstructionsServiceGetV1StandinginstructionsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useStandingInstructionsServiceGetV1StandinginstructionsTemplateKey = "StandingInstructionsServiceGetV1StandinginstructionsTemplate";
export const UseStandingInstructionsServiceGetV1StandinginstructionsTemplateKeyFn = ({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId, transferType }: {
  fromAccountId?: number;
  fromAccountType?: number;
  fromClientId?: number;
  fromOfficeId?: number;
  toAccountId?: number;
  toAccountType?: number;
  toClientId?: number;
  toOfficeId?: number;
  transferType?: number;
} = {}, queryKey?: Array<unknown>) => [useStandingInstructionsServiceGetV1StandinginstructionsTemplateKey, ...(queryKey ?? [{ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId, transferType }])];
export type StandingInstructionsServiceGetV1StandinginstructionsByStandingInstructionIdDefaultResponse = Awaited<ReturnType<typeof StandingInstructionsService.getV1StandinginstructionsByStandingInstructionId>>;
export type StandingInstructionsServiceGetV1StandinginstructionsByStandingInstructionIdQueryResult<TData = StandingInstructionsServiceGetV1StandinginstructionsByStandingInstructionIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useStandingInstructionsServiceGetV1StandinginstructionsByStandingInstructionIdKey = "StandingInstructionsServiceGetV1StandinginstructionsByStandingInstructionId";
export const UseStandingInstructionsServiceGetV1StandinginstructionsByStandingInstructionIdKeyFn = ({ externalId, limit, offset, orderBy, sortOrder, standingInstructionId }: {
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  standingInstructionId: number;
}, queryKey?: Array<unknown>) => [useStandingInstructionsServiceGetV1StandinginstructionsByStandingInstructionIdKey, ...(queryKey ?? [{ externalId, limit, offset, orderBy, sortOrder, standingInstructionId }])];
export type SurveyServiceGetV1SurveyDefaultResponse = Awaited<ReturnType<typeof SurveyService.getV1Survey>>;
export type SurveyServiceGetV1SurveyQueryResult<TData = SurveyServiceGetV1SurveyDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSurveyServiceGetV1SurveyKey = "SurveyServiceGetV1Survey";
export const UseSurveyServiceGetV1SurveyKeyFn = (queryKey?: Array<unknown>) => [useSurveyServiceGetV1SurveyKey, ...(queryKey ?? [])];
export type SurveyServiceGetV1SurveyBySurveyNameDefaultResponse = Awaited<ReturnType<typeof SurveyService.getV1SurveyBySurveyName>>;
export type SurveyServiceGetV1SurveyBySurveyNameQueryResult<TData = SurveyServiceGetV1SurveyBySurveyNameDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSurveyServiceGetV1SurveyBySurveyNameKey = "SurveyServiceGetV1SurveyBySurveyName";
export const UseSurveyServiceGetV1SurveyBySurveyNameKeyFn = ({ surveyName }: {
  surveyName: string;
}, queryKey?: Array<unknown>) => [useSurveyServiceGetV1SurveyBySurveyNameKey, ...(queryKey ?? [{ surveyName }])];
export type SurveyServiceGetV1SurveyBySurveyNameByClientIdDefaultResponse = Awaited<ReturnType<typeof SurveyService.getV1SurveyBySurveyNameByClientId>>;
export type SurveyServiceGetV1SurveyBySurveyNameByClientIdQueryResult<TData = SurveyServiceGetV1SurveyBySurveyNameByClientIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSurveyServiceGetV1SurveyBySurveyNameByClientIdKey = "SurveyServiceGetV1SurveyBySurveyNameByClientId";
export const UseSurveyServiceGetV1SurveyBySurveyNameByClientIdKeyFn = ({ clientId, surveyName }: {
  clientId: number;
  surveyName: string;
}, queryKey?: Array<unknown>) => [useSurveyServiceGetV1SurveyBySurveyNameByClientIdKey, ...(queryKey ?? [{ clientId, surveyName }])];
export type SurveyServiceGetV1SurveyBySurveyNameByClientIdByEntryIdDefaultResponse = Awaited<ReturnType<typeof SurveyService.getV1SurveyBySurveyNameByClientIdByEntryId>>;
export type SurveyServiceGetV1SurveyBySurveyNameByClientIdByEntryIdQueryResult<TData = SurveyServiceGetV1SurveyBySurveyNameByClientIdByEntryIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSurveyServiceGetV1SurveyBySurveyNameByClientIdByEntryIdKey = "SurveyServiceGetV1SurveyBySurveyNameByClientIdByEntryId";
export const UseSurveyServiceGetV1SurveyBySurveyNameByClientIdByEntryIdKeyFn = ({ clientId, entryId, surveyName }: {
  clientId: number;
  entryId: number;
  surveyName: string;
}, queryKey?: Array<unknown>) => [useSurveyServiceGetV1SurveyBySurveyNameByClientIdByEntryIdKey, ...(queryKey ?? [{ clientId, entryId, surveyName }])];
export type SpmSurveysServiceGetV1SurveysDefaultResponse = Awaited<ReturnType<typeof SpmSurveysService.getV1Surveys>>;
export type SpmSurveysServiceGetV1SurveysQueryResult<TData = SpmSurveysServiceGetV1SurveysDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSpmSurveysServiceGetV1SurveysKey = "SpmSurveysServiceGetV1Surveys";
export const UseSpmSurveysServiceGetV1SurveysKeyFn = ({ isActive }: {
  isActive?: boolean;
} = {}, queryKey?: Array<unknown>) => [useSpmSurveysServiceGetV1SurveysKey, ...(queryKey ?? [{ isActive }])];
export type SpmSurveysServiceGetV1SurveysByIdDefaultResponse = Awaited<ReturnType<typeof SpmSurveysService.getV1SurveysById>>;
export type SpmSurveysServiceGetV1SurveysByIdQueryResult<TData = SpmSurveysServiceGetV1SurveysByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSpmSurveysServiceGetV1SurveysByIdKey = "SpmSurveysServiceGetV1SurveysById";
export const UseSpmSurveysServiceGetV1SurveysByIdKeyFn = ({ id }: {
  id: number;
}, queryKey?: Array<unknown>) => [useSpmSurveysServiceGetV1SurveysByIdKey, ...(queryKey ?? [{ id }])];
export type ScoreCardServiceGetV1SurveysScorecardsClientsByClientIdDefaultResponse = Awaited<ReturnType<typeof ScoreCardService.getV1SurveysScorecardsClientsByClientId>>;
export type ScoreCardServiceGetV1SurveysScorecardsClientsByClientIdQueryResult<TData = ScoreCardServiceGetV1SurveysScorecardsClientsByClientIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useScoreCardServiceGetV1SurveysScorecardsClientsByClientIdKey = "ScoreCardServiceGetV1SurveysScorecardsClientsByClientId";
export const UseScoreCardServiceGetV1SurveysScorecardsClientsByClientIdKeyFn = ({ clientId }: {
  clientId: number;
}, queryKey?: Array<unknown>) => [useScoreCardServiceGetV1SurveysScorecardsClientsByClientIdKey, ...(queryKey ?? [{ clientId }])];
export type ScoreCardServiceGetV1SurveysScorecardsBySurveyIdDefaultResponse = Awaited<ReturnType<typeof ScoreCardService.getV1SurveysScorecardsBySurveyId>>;
export type ScoreCardServiceGetV1SurveysScorecardsBySurveyIdQueryResult<TData = ScoreCardServiceGetV1SurveysScorecardsBySurveyIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useScoreCardServiceGetV1SurveysScorecardsBySurveyIdKey = "ScoreCardServiceGetV1SurveysScorecardsBySurveyId";
export const UseScoreCardServiceGetV1SurveysScorecardsBySurveyIdKeyFn = ({ surveyId }: {
  surveyId: number;
}, queryKey?: Array<unknown>) => [useScoreCardServiceGetV1SurveysScorecardsBySurveyIdKey, ...(queryKey ?? [{ surveyId }])];
export type ScoreCardServiceGetV1SurveysScorecardsBySurveyIdClientsByClientIdDefaultResponse = Awaited<ReturnType<typeof ScoreCardService.getV1SurveysScorecardsBySurveyIdClientsByClientId>>;
export type ScoreCardServiceGetV1SurveysScorecardsBySurveyIdClientsByClientIdQueryResult<TData = ScoreCardServiceGetV1SurveysScorecardsBySurveyIdClientsByClientIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useScoreCardServiceGetV1SurveysScorecardsBySurveyIdClientsByClientIdKey = "ScoreCardServiceGetV1SurveysScorecardsBySurveyIdClientsByClientId";
export const UseScoreCardServiceGetV1SurveysScorecardsBySurveyIdClientsByClientIdKeyFn = ({ clientId, surveyId }: {
  clientId: number;
  surveyId: number;
}, queryKey?: Array<unknown>) => [useScoreCardServiceGetV1SurveysScorecardsBySurveyIdClientsByClientIdKey, ...(queryKey ?? [{ clientId, surveyId }])];
export type SpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesDefaultResponse = Awaited<ReturnType<typeof SpmApiLookUpTableService.getV1SurveysBySurveyIdLookuptables>>;
export type SpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesQueryResult<TData = SpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesKey = "SpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptables";
export const UseSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesKeyFn = ({ surveyId }: {
  surveyId: number;
}, queryKey?: Array<unknown>) => [useSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesKey, ...(queryKey ?? [{ surveyId }])];
export type SpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesByKeyDefaultResponse = Awaited<ReturnType<typeof SpmApiLookUpTableService.getV1SurveysBySurveyIdLookuptablesByKey>>;
export type SpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesByKeyQueryResult<TData = SpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesByKeyDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesByKeyKey = "SpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesByKey";
export const UseSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesByKeyKeyFn = ({ key, surveyId }: {
  key: string;
  surveyId: number;
}, queryKey?: Array<unknown>) => [useSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesByKeyKey, ...(queryKey ?? [{ key, surveyId }])];
export type TaxComponentsServiceGetV1TaxesComponentDefaultResponse = Awaited<ReturnType<typeof TaxComponentsService.getV1TaxesComponent>>;
export type TaxComponentsServiceGetV1TaxesComponentQueryResult<TData = TaxComponentsServiceGetV1TaxesComponentDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTaxComponentsServiceGetV1TaxesComponentKey = "TaxComponentsServiceGetV1TaxesComponent";
export const UseTaxComponentsServiceGetV1TaxesComponentKeyFn = (queryKey?: Array<unknown>) => [useTaxComponentsServiceGetV1TaxesComponentKey, ...(queryKey ?? [])];
export type TaxComponentsServiceGetV1TaxesComponentTemplateDefaultResponse = Awaited<ReturnType<typeof TaxComponentsService.getV1TaxesComponentTemplate>>;
export type TaxComponentsServiceGetV1TaxesComponentTemplateQueryResult<TData = TaxComponentsServiceGetV1TaxesComponentTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTaxComponentsServiceGetV1TaxesComponentTemplateKey = "TaxComponentsServiceGetV1TaxesComponentTemplate";
export const UseTaxComponentsServiceGetV1TaxesComponentTemplateKeyFn = (queryKey?: Array<unknown>) => [useTaxComponentsServiceGetV1TaxesComponentTemplateKey, ...(queryKey ?? [])];
export type TaxComponentsServiceGetV1TaxesComponentByTaxComponentIdDefaultResponse = Awaited<ReturnType<typeof TaxComponentsService.getV1TaxesComponentByTaxComponentId>>;
export type TaxComponentsServiceGetV1TaxesComponentByTaxComponentIdQueryResult<TData = TaxComponentsServiceGetV1TaxesComponentByTaxComponentIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTaxComponentsServiceGetV1TaxesComponentByTaxComponentIdKey = "TaxComponentsServiceGetV1TaxesComponentByTaxComponentId";
export const UseTaxComponentsServiceGetV1TaxesComponentByTaxComponentIdKeyFn = ({ taxComponentId }: {
  taxComponentId: number;
}, queryKey?: Array<unknown>) => [useTaxComponentsServiceGetV1TaxesComponentByTaxComponentIdKey, ...(queryKey ?? [{ taxComponentId }])];
export type TaxGroupServiceGetV1TaxesGroupDefaultResponse = Awaited<ReturnType<typeof TaxGroupService.getV1TaxesGroup>>;
export type TaxGroupServiceGetV1TaxesGroupQueryResult<TData = TaxGroupServiceGetV1TaxesGroupDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTaxGroupServiceGetV1TaxesGroupKey = "TaxGroupServiceGetV1TaxesGroup";
export const UseTaxGroupServiceGetV1TaxesGroupKeyFn = (queryKey?: Array<unknown>) => [useTaxGroupServiceGetV1TaxesGroupKey, ...(queryKey ?? [])];
export type TaxGroupServiceGetV1TaxesGroupTemplateDefaultResponse = Awaited<ReturnType<typeof TaxGroupService.getV1TaxesGroupTemplate>>;
export type TaxGroupServiceGetV1TaxesGroupTemplateQueryResult<TData = TaxGroupServiceGetV1TaxesGroupTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTaxGroupServiceGetV1TaxesGroupTemplateKey = "TaxGroupServiceGetV1TaxesGroupTemplate";
export const UseTaxGroupServiceGetV1TaxesGroupTemplateKeyFn = (queryKey?: Array<unknown>) => [useTaxGroupServiceGetV1TaxesGroupTemplateKey, ...(queryKey ?? [])];
export type TaxGroupServiceGetV1TaxesGroupByTaxGroupIdDefaultResponse = Awaited<ReturnType<typeof TaxGroupService.getV1TaxesGroupByTaxGroupId>>;
export type TaxGroupServiceGetV1TaxesGroupByTaxGroupIdQueryResult<TData = TaxGroupServiceGetV1TaxesGroupByTaxGroupIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTaxGroupServiceGetV1TaxesGroupByTaxGroupIdKey = "TaxGroupServiceGetV1TaxesGroupByTaxGroupId";
export const UseTaxGroupServiceGetV1TaxesGroupByTaxGroupIdKeyFn = ({ taxGroupId }: {
  taxGroupId: number;
}, queryKey?: Array<unknown>) => [useTaxGroupServiceGetV1TaxesGroupByTaxGroupIdKey, ...(queryKey ?? [{ taxGroupId }])];
export type TellerCashManagementServiceGetV1TellersDefaultResponse = Awaited<ReturnType<typeof TellerCashManagementService.getV1Tellers>>;
export type TellerCashManagementServiceGetV1TellersQueryResult<TData = TellerCashManagementServiceGetV1TellersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTellerCashManagementServiceGetV1TellersKey = "TellerCashManagementServiceGetV1Tellers";
export const UseTellerCashManagementServiceGetV1TellersKeyFn = ({ officeId }: {
  officeId?: number;
} = {}, queryKey?: Array<unknown>) => [useTellerCashManagementServiceGetV1TellersKey, ...(queryKey ?? [{ officeId }])];
export type TellerCashManagementServiceGetV1TellersByTellerIdDefaultResponse = Awaited<ReturnType<typeof TellerCashManagementService.getV1TellersByTellerId>>;
export type TellerCashManagementServiceGetV1TellersByTellerIdQueryResult<TData = TellerCashManagementServiceGetV1TellersByTellerIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTellerCashManagementServiceGetV1TellersByTellerIdKey = "TellerCashManagementServiceGetV1TellersByTellerId";
export const UseTellerCashManagementServiceGetV1TellersByTellerIdKeyFn = ({ tellerId }: {
  tellerId: number;
}, queryKey?: Array<unknown>) => [useTellerCashManagementServiceGetV1TellersByTellerIdKey, ...(queryKey ?? [{ tellerId }])];
export type TellerCashManagementServiceGetV1TellersByTellerIdCashiersDefaultResponse = Awaited<ReturnType<typeof TellerCashManagementService.getV1TellersByTellerIdCashiers>>;
export type TellerCashManagementServiceGetV1TellersByTellerIdCashiersQueryResult<TData = TellerCashManagementServiceGetV1TellersByTellerIdCashiersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiersKey = "TellerCashManagementServiceGetV1TellersByTellerIdCashiers";
export const UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersKeyFn = ({ fromdate, tellerId, todate }: {
  fromdate?: string;
  tellerId: number;
  todate?: string;
}, queryKey?: Array<unknown>) => [useTellerCashManagementServiceGetV1TellersByTellerIdCashiersKey, ...(queryKey ?? [{ fromdate, tellerId, todate }])];
export type TellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplateDefaultResponse = Awaited<ReturnType<typeof TellerCashManagementService.getV1TellersByTellerIdCashiersTemplate>>;
export type TellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplateQueryResult<TData = TellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplateKey = "TellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplate";
export const UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplateKeyFn = ({ tellerId }: {
  tellerId: number;
}, queryKey?: Array<unknown>) => [useTellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplateKey, ...(queryKey ?? [{ tellerId }])];
export type TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdDefaultResponse = Awaited<ReturnType<typeof TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierId>>;
export type TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdQueryResult<TData = TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdKey = "TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierId";
export const UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdKeyFn = ({ cashierId, tellerId }: {
  cashierId: number;
  tellerId: number;
}, queryKey?: Array<unknown>) => [useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdKey, ...(queryKey ?? [{ cashierId, tellerId }])];
export type TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactionsDefaultResponse = Awaited<ReturnType<typeof TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdSummaryandtransactions>>;
export type TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactionsQueryResult<TData = TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactionsKey = "TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactions";
export const UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactionsKeyFn = ({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }: {
  cashierId: number;
  currencyCode?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  tellerId: number;
}, queryKey?: Array<unknown>) => [useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactionsKey, ...(queryKey ?? [{ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }])];
export type TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsDefaultResponse = Awaited<ReturnType<typeof TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdTransactions>>;
export type TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsQueryResult<TData = TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsKey = "TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactions";
export const UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsKeyFn = ({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }: {
  cashierId: number;
  currencyCode?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  tellerId: number;
}, queryKey?: Array<unknown>) => [useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsKey, ...(queryKey ?? [{ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }])];
export type TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplateDefaultResponse = Awaited<ReturnType<typeof TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdTransactionsTemplate>>;
export type TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplateQueryResult<TData = TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplateKey = "TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplate";
export const UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplateKeyFn = ({ cashierId, tellerId }: {
  cashierId: number;
  tellerId: number;
}, queryKey?: Array<unknown>) => [useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplateKey, ...(queryKey ?? [{ cashierId, tellerId }])];
export type TellerCashManagementServiceGetV1TellersByTellerIdJournalsDefaultResponse = Awaited<ReturnType<typeof TellerCashManagementService.getV1TellersByTellerIdJournals>>;
export type TellerCashManagementServiceGetV1TellersByTellerIdJournalsQueryResult<TData = TellerCashManagementServiceGetV1TellersByTellerIdJournalsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTellerCashManagementServiceGetV1TellersByTellerIdJournalsKey = "TellerCashManagementServiceGetV1TellersByTellerIdJournals";
export const UseTellerCashManagementServiceGetV1TellersByTellerIdJournalsKeyFn = ({ cashierId, dateRange, tellerId }: {
  cashierId?: number;
  dateRange?: string;
  tellerId: number;
}, queryKey?: Array<unknown>) => [useTellerCashManagementServiceGetV1TellersByTellerIdJournalsKey, ...(queryKey ?? [{ cashierId, dateRange, tellerId }])];
export type TellerCashManagementServiceGetV1TellersByTellerIdTransactionsDefaultResponse = Awaited<ReturnType<typeof TellerCashManagementService.getV1TellersByTellerIdTransactions>>;
export type TellerCashManagementServiceGetV1TellersByTellerIdTransactionsQueryResult<TData = TellerCashManagementServiceGetV1TellersByTellerIdTransactionsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTellerCashManagementServiceGetV1TellersByTellerIdTransactionsKey = "TellerCashManagementServiceGetV1TellersByTellerIdTransactions";
export const UseTellerCashManagementServiceGetV1TellersByTellerIdTransactionsKeyFn = ({ dateRange, tellerId }: {
  dateRange?: string;
  tellerId: number;
}, queryKey?: Array<unknown>) => [useTellerCashManagementServiceGetV1TellersByTellerIdTransactionsKey, ...(queryKey ?? [{ dateRange, tellerId }])];
export type TellerCashManagementServiceGetV1TellersByTellerIdTransactionsByTransactionIdDefaultResponse = Awaited<ReturnType<typeof TellerCashManagementService.getV1TellersByTellerIdTransactionsByTransactionId>>;
export type TellerCashManagementServiceGetV1TellersByTellerIdTransactionsByTransactionIdQueryResult<TData = TellerCashManagementServiceGetV1TellersByTellerIdTransactionsByTransactionIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTellerCashManagementServiceGetV1TellersByTellerIdTransactionsByTransactionIdKey = "TellerCashManagementServiceGetV1TellersByTellerIdTransactionsByTransactionId";
export const UseTellerCashManagementServiceGetV1TellersByTellerIdTransactionsByTransactionIdKeyFn = ({ tellerId, transactionId }: {
  tellerId: number;
  transactionId: number;
}, queryKey?: Array<unknown>) => [useTellerCashManagementServiceGetV1TellersByTellerIdTransactionsByTransactionIdKey, ...(queryKey ?? [{ tellerId, transactionId }])];
export type UserGeneratedDocumentsServiceGetV1TemplatesDefaultResponse = Awaited<ReturnType<typeof UserGeneratedDocumentsService.getV1Templates>>;
export type UserGeneratedDocumentsServiceGetV1TemplatesQueryResult<TData = UserGeneratedDocumentsServiceGetV1TemplatesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUserGeneratedDocumentsServiceGetV1TemplatesKey = "UserGeneratedDocumentsServiceGetV1Templates";
export const UseUserGeneratedDocumentsServiceGetV1TemplatesKeyFn = ({ entityId, typeId }: {
  entityId?: number;
  typeId?: number;
} = {}, queryKey?: Array<unknown>) => [useUserGeneratedDocumentsServiceGetV1TemplatesKey, ...(queryKey ?? [{ entityId, typeId }])];
export type UserGeneratedDocumentsServiceGetV1TemplatesTemplateDefaultResponse = Awaited<ReturnType<typeof UserGeneratedDocumentsService.getV1TemplatesTemplate>>;
export type UserGeneratedDocumentsServiceGetV1TemplatesTemplateQueryResult<TData = UserGeneratedDocumentsServiceGetV1TemplatesTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUserGeneratedDocumentsServiceGetV1TemplatesTemplateKey = "UserGeneratedDocumentsServiceGetV1TemplatesTemplate";
export const UseUserGeneratedDocumentsServiceGetV1TemplatesTemplateKeyFn = (queryKey?: Array<unknown>) => [useUserGeneratedDocumentsServiceGetV1TemplatesTemplateKey, ...(queryKey ?? [])];
export type UserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdDefaultResponse = Awaited<ReturnType<typeof UserGeneratedDocumentsService.getV1TemplatesByTemplateId>>;
export type UserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdQueryResult<TData = UserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdKey = "UserGeneratedDocumentsServiceGetV1TemplatesByTemplateId";
export const UseUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdKeyFn = ({ templateId }: {
  templateId: number;
}, queryKey?: Array<unknown>) => [useUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdKey, ...(queryKey ?? [{ templateId }])];
export type UserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdTemplateDefaultResponse = Awaited<ReturnType<typeof UserGeneratedDocumentsService.getV1TemplatesByTemplateIdTemplate>>;
export type UserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdTemplateQueryResult<TData = UserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdTemplateKey = "UserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdTemplate";
export const UseUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdTemplateKeyFn = ({ templateId }: {
  templateId: number;
}, queryKey?: Array<unknown>) => [useUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdTemplateKey, ...(queryKey ?? [{ templateId }])];
export type TwoFactorServiceGetV1TwofactorDefaultResponse = Awaited<ReturnType<typeof TwoFactorService.getV1Twofactor>>;
export type TwoFactorServiceGetV1TwofactorQueryResult<TData = TwoFactorServiceGetV1TwofactorDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTwoFactorServiceGetV1TwofactorKey = "TwoFactorServiceGetV1Twofactor";
export const UseTwoFactorServiceGetV1TwofactorKeyFn = (queryKey?: Array<unknown>) => [useTwoFactorServiceGetV1TwofactorKey, ...(queryKey ?? [])];
export type FetchAuthenticatedUserDetailsServiceGetV1UserdetailsDefaultResponse = Awaited<ReturnType<typeof FetchAuthenticatedUserDetailsService.getV1Userdetails>>;
export type FetchAuthenticatedUserDetailsServiceGetV1UserdetailsQueryResult<TData = FetchAuthenticatedUserDetailsServiceGetV1UserdetailsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useFetchAuthenticatedUserDetailsServiceGetV1UserdetailsKey = "FetchAuthenticatedUserDetailsServiceGetV1Userdetails";
export const UseFetchAuthenticatedUserDetailsServiceGetV1UserdetailsKeyFn = (queryKey?: Array<unknown>) => [useFetchAuthenticatedUserDetailsServiceGetV1UserdetailsKey, ...(queryKey ?? [])];
export type UsersServiceGetV1UsersDefaultResponse = Awaited<ReturnType<typeof UsersService.getV1Users>>;
export type UsersServiceGetV1UsersQueryResult<TData = UsersServiceGetV1UsersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUsersServiceGetV1UsersKey = "UsersServiceGetV1Users";
export const UseUsersServiceGetV1UsersKeyFn = (queryKey?: Array<unknown>) => [useUsersServiceGetV1UsersKey, ...(queryKey ?? [])];
export type UsersServiceGetV1UsersDownloadtemplateDefaultResponse = Awaited<ReturnType<typeof UsersService.getV1UsersDownloadtemplate>>;
export type UsersServiceGetV1UsersDownloadtemplateQueryResult<TData = UsersServiceGetV1UsersDownloadtemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUsersServiceGetV1UsersDownloadtemplateKey = "UsersServiceGetV1UsersDownloadtemplate";
export const UseUsersServiceGetV1UsersDownloadtemplateKeyFn = ({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: Array<unknown>) => [useUsersServiceGetV1UsersDownloadtemplateKey, ...(queryKey ?? [{ dateFormat, officeId, staffId }])];
export type UsersServiceGetV1UsersTemplateDefaultResponse = Awaited<ReturnType<typeof UsersService.getV1UsersTemplate>>;
export type UsersServiceGetV1UsersTemplateQueryResult<TData = UsersServiceGetV1UsersTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUsersServiceGetV1UsersTemplateKey = "UsersServiceGetV1UsersTemplate";
export const UseUsersServiceGetV1UsersTemplateKeyFn = (queryKey?: Array<unknown>) => [useUsersServiceGetV1UsersTemplateKey, ...(queryKey ?? [])];
export type UsersServiceGetV1UsersByUserIdDefaultResponse = Awaited<ReturnType<typeof UsersService.getV1UsersByUserId>>;
export type UsersServiceGetV1UsersByUserIdQueryResult<TData = UsersServiceGetV1UsersByUserIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUsersServiceGetV1UsersByUserIdKey = "UsersServiceGetV1UsersByUserId";
export const UseUsersServiceGetV1UsersByUserIdKeyFn = ({ userId }: {
  userId: number;
}, queryKey?: Array<unknown>) => [useUsersServiceGetV1UsersByUserIdKey, ...(queryKey ?? [{ userId }])];
export type WorkingDaysServiceGetV1WorkingdaysDefaultResponse = Awaited<ReturnType<typeof WorkingDaysService.getV1Workingdays>>;
export type WorkingDaysServiceGetV1WorkingdaysQueryResult<TData = WorkingDaysServiceGetV1WorkingdaysDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useWorkingDaysServiceGetV1WorkingdaysKey = "WorkingDaysServiceGetV1Workingdays";
export const UseWorkingDaysServiceGetV1WorkingdaysKeyFn = (queryKey?: Array<unknown>) => [useWorkingDaysServiceGetV1WorkingdaysKey, ...(queryKey ?? [])];
export type WorkingDaysServiceGetV1WorkingdaysTemplateDefaultResponse = Awaited<ReturnType<typeof WorkingDaysService.getV1WorkingdaysTemplate>>;
export type WorkingDaysServiceGetV1WorkingdaysTemplateQueryResult<TData = WorkingDaysServiceGetV1WorkingdaysTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useWorkingDaysServiceGetV1WorkingdaysTemplateKey = "WorkingDaysServiceGetV1WorkingdaysTemplate";
export const UseWorkingDaysServiceGetV1WorkingdaysTemplateKeyFn = (queryKey?: Array<unknown>) => [useWorkingDaysServiceGetV1WorkingdaysTemplateKey, ...(queryKey ?? [])];
export type CalendarServiceGetV1ByEntityTypeByEntityIdCalendarsDefaultResponse = Awaited<ReturnType<typeof CalendarService.getV1ByEntityTypeByEntityIdCalendars>>;
export type CalendarServiceGetV1ByEntityTypeByEntityIdCalendarsQueryResult<TData = CalendarServiceGetV1ByEntityTypeByEntityIdCalendarsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsKey = "CalendarServiceGetV1ByEntityTypeByEntityIdCalendars";
export const UseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsKeyFn = ({ calendarType, entityId, entityType }: {
  calendarType?: string;
  entityId: number;
  entityType: string;
}, queryKey?: Array<unknown>) => [useCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsKey, ...(queryKey ?? [{ calendarType, entityId, entityType }])];
export type CalendarServiceGetV1ByEntityTypeByEntityIdCalendarsTemplateDefaultResponse = Awaited<ReturnType<typeof CalendarService.getV1ByEntityTypeByEntityIdCalendarsTemplate>>;
export type CalendarServiceGetV1ByEntityTypeByEntityIdCalendarsTemplateQueryResult<TData = CalendarServiceGetV1ByEntityTypeByEntityIdCalendarsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsTemplateKey = "CalendarServiceGetV1ByEntityTypeByEntityIdCalendarsTemplate";
export const UseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsTemplateKeyFn = ({ entityId, entityType }: {
  entityId: number;
  entityType: string;
}, queryKey?: Array<unknown>) => [useCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsTemplateKey, ...(queryKey ?? [{ entityId, entityType }])];
export type CalendarServiceGetV1ByEntityTypeByEntityIdCalendarsByCalendarIdDefaultResponse = Awaited<ReturnType<typeof CalendarService.getV1ByEntityTypeByEntityIdCalendarsByCalendarId>>;
export type CalendarServiceGetV1ByEntityTypeByEntityIdCalendarsByCalendarIdQueryResult<TData = CalendarServiceGetV1ByEntityTypeByEntityIdCalendarsByCalendarIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsByCalendarIdKey = "CalendarServiceGetV1ByEntityTypeByEntityIdCalendarsByCalendarId";
export const UseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsByCalendarIdKeyFn = ({ calendarId, entityId, entityType }: {
  calendarId: number;
  entityId: number;
  entityType: string;
}, queryKey?: Array<unknown>) => [useCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsByCalendarIdKey, ...(queryKey ?? [{ calendarId, entityId, entityType }])];
export type DocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsDefaultResponse = Awaited<ReturnType<typeof DocumentsService.getV1ByEntityTypeByEntityIdDocuments>>;
export type DocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsQueryResult<TData = DocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsKey = "DocumentsServiceGetV1ByEntityTypeByEntityIdDocuments";
export const UseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsKeyFn = ({ entityId, entityType }: {
  entityId: number;
  entityType: string;
}, queryKey?: Array<unknown>) => [useDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsKey, ...(queryKey ?? [{ entityId, entityType }])];
export type DocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdDefaultResponse = Awaited<ReturnType<typeof DocumentsService.getV1ByEntityTypeByEntityIdDocumentsByDocumentId>>;
export type DocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdQueryResult<TData = DocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdKey = "DocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentId";
export const UseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdKeyFn = ({ documentId, entityId, entityType }: {
  documentId: number;
  entityId: number;
  entityType: string;
}, queryKey?: Array<unknown>) => [useDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdKey, ...(queryKey ?? [{ documentId, entityId, entityType }])];
export type DocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachmentDefaultResponse = Awaited<ReturnType<typeof DocumentsService.getV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachment>>;
export type DocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachmentQueryResult<TData = DocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachmentDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachmentKey = "DocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachment";
export const UseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachmentKeyFn = ({ documentId, entityId, entityType }: {
  documentId: number;
  entityId: number;
  entityType: string;
}, queryKey?: Array<unknown>) => [useDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachmentKey, ...(queryKey ?? [{ documentId, entityId, entityType }])];
export type MeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsDefaultResponse = Awaited<ReturnType<typeof MeetingsService.getV1ByEntityTypeByEntityIdMeetings>>;
export type MeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsQueryResult<TData = MeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsKey = "MeetingsServiceGetV1ByEntityTypeByEntityIdMeetings";
export const UseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsKeyFn = ({ entityId, entityType, limit }: {
  entityId: number;
  entityType: string;
  limit?: number;
}, queryKey?: Array<unknown>) => [useMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsKey, ...(queryKey ?? [{ entityId, entityType, limit }])];
export type MeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsTemplateDefaultResponse = Awaited<ReturnType<typeof MeetingsService.getV1ByEntityTypeByEntityIdMeetingsTemplate>>;
export type MeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsTemplateQueryResult<TData = MeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsTemplateDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsTemplateKey = "MeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsTemplate";
export const UseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsTemplateKeyFn = ({ calendarId, entityId, entityType }: {
  calendarId?: number;
  entityId: number;
  entityType: string;
}, queryKey?: Array<unknown>) => [useMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsTemplateKey, ...(queryKey ?? [{ calendarId, entityId, entityType }])];
export type MeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsByMeetingIdDefaultResponse = Awaited<ReturnType<typeof MeetingsService.getV1ByEntityTypeByEntityIdMeetingsByMeetingId>>;
export type MeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsByMeetingIdQueryResult<TData = MeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsByMeetingIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsByMeetingIdKey = "MeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsByMeetingId";
export const UseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsByMeetingIdKeyFn = ({ entityId, entityType, meetingId }: {
  entityId: number;
  entityType: string;
  meetingId: number;
}, queryKey?: Array<unknown>) => [useMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsByMeetingIdKey, ...(queryKey ?? [{ entityId, entityType, meetingId }])];
export type NotesServiceGetV1ByResourceTypeByResourceIdNotesDefaultResponse = Awaited<ReturnType<typeof NotesService.getV1ByResourceTypeByResourceIdNotes>>;
export type NotesServiceGetV1ByResourceTypeByResourceIdNotesQueryResult<TData = NotesServiceGetV1ByResourceTypeByResourceIdNotesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useNotesServiceGetV1ByResourceTypeByResourceIdNotesKey = "NotesServiceGetV1ByResourceTypeByResourceIdNotes";
export const UseNotesServiceGetV1ByResourceTypeByResourceIdNotesKeyFn = ({ resourceId, resourceType }: {
  resourceId: number;
  resourceType: string;
}, queryKey?: Array<unknown>) => [useNotesServiceGetV1ByResourceTypeByResourceIdNotesKey, ...(queryKey ?? [{ resourceId, resourceType }])];
export type NotesServiceGetV1ByResourceTypeByResourceIdNotesByNoteIdDefaultResponse = Awaited<ReturnType<typeof NotesService.getV1ByResourceTypeByResourceIdNotesByNoteId>>;
export type NotesServiceGetV1ByResourceTypeByResourceIdNotesByNoteIdQueryResult<TData = NotesServiceGetV1ByResourceTypeByResourceIdNotesByNoteIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useNotesServiceGetV1ByResourceTypeByResourceIdNotesByNoteIdKey = "NotesServiceGetV1ByResourceTypeByResourceIdNotesByNoteId";
export const UseNotesServiceGetV1ByResourceTypeByResourceIdNotesByNoteIdKeyFn = ({ noteId, resourceId, resourceType }: {
  noteId: number;
  resourceId: number;
  resourceType: string;
}, queryKey?: Array<unknown>) => [useNotesServiceGetV1ByResourceTypeByResourceIdNotesByNoteIdKey, ...(queryKey ?? [{ noteId, resourceId, resourceType }])];
export type DefaultServicePostV1CreditBureauIntegrationAddCreditReportMutationResult = Awaited<ReturnType<typeof DefaultService.postV1CreditBureauIntegrationAddCreditReport>>;
export type DefaultServicePostV1CreditBureauIntegrationCreditReportMutationResult = Awaited<ReturnType<typeof DefaultService.postV1CreditBureauIntegrationCreditReport>>;
export type DefaultServicePostV1CreditBureauIntegrationSaveCreditReportMutationResult = Awaited<ReturnType<typeof DefaultService.postV1CreditBureauIntegrationSaveCreditReport>>;
export type DefaultServicePostV1EmailMutationResult = Awaited<ReturnType<typeof DefaultService.postV1Email>>;
export type DefaultServicePostV1EmailCampaignMutationResult = Awaited<ReturnType<typeof DefaultService.postV1EmailCampaign>>;
export type DefaultServicePostV1EmailCampaignPreviewMutationResult = Awaited<ReturnType<typeof DefaultService.postV1EmailCampaignPreview>>;
export type DefaultServicePostV1EmailCampaignByResourceIdMutationResult = Awaited<ReturnType<typeof DefaultService.postV1EmailCampaignByResourceId>>;
export type DefaultServicePostV1InternalCobFastForwardCobDateOfLoanByLoanIdMutationResult = Awaited<ReturnType<typeof DefaultService.postV1InternalCobFastForwardCobDateOfLoanByLoanId>>;
export type DefaultServicePostV1InternalLoansByLoanIdPlaceLockByLockOwnerMutationResult = Awaited<ReturnType<typeof DefaultService.postV1InternalLoansByLoanIdPlaceLockByLockOwner>>;
export type DefaultServicePostV1OfficetransactionsMutationResult = Awaited<ReturnType<typeof DefaultService.postV1Officetransactions>>;
export type DefaultServicePostV1SmscampaignsMutationResult = Awaited<ReturnType<typeof DefaultService.postV1Smscampaigns>>;
export type DefaultServicePostV1SmscampaignsPreviewMutationResult = Awaited<ReturnType<typeof DefaultService.postV1SmscampaignsPreview>>;
export type DefaultServicePostV1SmscampaignsByCampaignIdMutationResult = Awaited<ReturnType<typeof DefaultService.postV1SmscampaignsByCampaignId>>;
export type DefaultServicePostV1ByEntityByEntityIdImagesMutationResult = Awaited<ReturnType<typeof DefaultService.postV1ByEntityByEntityIdImages>>;
export type CreditBureauConfigurationServicePostV1CreditBureauConfigurationConfigurationByCreditBureauIdMutationResult = Awaited<ReturnType<typeof CreditBureauConfigurationService.postV1CreditBureauConfigurationConfigurationByCreditBureauId>>;
export type CreditBureauConfigurationServicePostV1CreditBureauConfigurationMappingsByOrganisationCreditBureauIdMutationResult = Awaited<ReturnType<typeof CreditBureauConfigurationService.postV1CreditBureauConfigurationMappingsByOrganisationCreditBureauId>>;
export type CreditBureauConfigurationServicePostV1CreditBureauConfigurationOrganisationCreditBureauByOrganisationCreditBureauIdMutationResult = Awaited<ReturnType<typeof CreditBureauConfigurationService.postV1CreditBureauConfigurationOrganisationCreditBureauByOrganisationCreditBureauId>>;
export type AccountingRulesServicePostV1AccountingrulesMutationResult = Awaited<ReturnType<typeof AccountingRulesService.postV1Accountingrules>>;
export type AccountNumberFormatServicePostV1AccountnumberformatsMutationResult = Awaited<ReturnType<typeof AccountNumberFormatService.postV1Accountnumberformats>>;
export type ShareAccountServicePostV1AccountsByTypeMutationResult = Awaited<ReturnType<typeof ShareAccountService.postV1AccountsByType>>;
export type ShareAccountServicePostV1AccountsByTypeUploadtemplateMutationResult = Awaited<ReturnType<typeof ShareAccountService.postV1AccountsByTypeUploadtemplate>>;
export type ShareAccountServicePostV1AccountsByTypeByAccountIdMutationResult = Awaited<ReturnType<typeof ShareAccountService.postV1AccountsByTypeByAccountId>>;
export type AccountTransfersServicePostV1AccounttransfersMutationResult = Awaited<ReturnType<typeof AccountTransfersService.postV1Accounttransfers>>;
export type AccountTransfersServicePostV1AccounttransfersRefundByTransferMutationResult = Awaited<ReturnType<typeof AccountTransfersService.postV1AccounttransfersRefundByTransfer>>;
export type AdhocQueryApiServicePostV1AdhocqueryMutationResult = Awaited<ReturnType<typeof AdhocQueryApiService.postV1Adhocquery>>;
export type AuthenticationHttpBasicServicePostV1AuthenticationMutationResult = Awaited<ReturnType<typeof AuthenticationHttpBasicService.postV1Authentication>>;
export type BatchApiServicePostV1BatchesMutationResult = Awaited<ReturnType<typeof BatchApiService.postV1Batches>>;
export type BusinessDateManagementServicePostV1BusinessdateMutationResult = Awaited<ReturnType<typeof BusinessDateManagementService.postV1Businessdate>>;
export type CentersServicePostV1CentersMutationResult = Awaited<ReturnType<typeof CentersService.postV1Centers>>;
export type CentersServicePostV1CentersUploadtemplateMutationResult = Awaited<ReturnType<typeof CentersService.postV1CentersUploadtemplate>>;
export type CentersServicePostV1CentersByCenterIdMutationResult = Awaited<ReturnType<typeof CentersService.postV1CentersByCenterId>>;
export type ChargesServicePostV1ChargesMutationResult = Awaited<ReturnType<typeof ChargesService.postV1Charges>>;
export type ClientsAddressServicePostV1ClientByClientidAddressesMutationResult = Awaited<ReturnType<typeof ClientsAddressService.postV1ClientByClientidAddresses>>;
export type ClientServicePostV1ClientsMutationResult = Awaited<ReturnType<typeof ClientService.postV1Clients>>;
export type ClientServicePostV1ClientsExternalIdByExternalIdMutationResult = Awaited<ReturnType<typeof ClientService.postV1ClientsExternalIdByExternalId>>;
export type ClientServicePostV1ClientsUploadtemplateMutationResult = Awaited<ReturnType<typeof ClientService.postV1ClientsUploadtemplate>>;
export type ClientServicePostV1ClientsByClientIdMutationResult = Awaited<ReturnType<typeof ClientService.postV1ClientsByClientId>>;
export type ClientTransactionServicePostV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalIdMutationResult = Awaited<ReturnType<typeof ClientTransactionService.postV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalId>>;
export type ClientTransactionServicePostV1ClientsExternalIdByClientExternalIdTransactionsByTransactionIdMutationResult = Awaited<ReturnType<typeof ClientTransactionService.postV1ClientsExternalIdByClientExternalIdTransactionsByTransactionId>>;
export type ClientTransactionServicePostV1ClientsByClientIdTransactionsExternalIdByTransactionExternalIdMutationResult = Awaited<ReturnType<typeof ClientTransactionService.postV1ClientsByClientIdTransactionsExternalIdByTransactionExternalId>>;
export type ClientTransactionServicePostV1ClientsByClientIdTransactionsByTransactionIdMutationResult = Awaited<ReturnType<typeof ClientTransactionService.postV1ClientsByClientIdTransactionsByTransactionId>>;
export type ClientChargesServicePostV1ClientsByClientIdChargesMutationResult = Awaited<ReturnType<typeof ClientChargesService.postV1ClientsByClientIdCharges>>;
export type ClientChargesServicePostV1ClientsByClientIdChargesByChargeIdMutationResult = Awaited<ReturnType<typeof ClientChargesService.postV1ClientsByClientIdChargesByChargeId>>;
export type ClientCollateralManagementServicePostV1ClientsByClientIdCollateralsMutationResult = Awaited<ReturnType<typeof ClientCollateralManagementService.postV1ClientsByClientIdCollaterals>>;
export type ClientFamilyMemberServicePostV1ClientsByClientIdFamilymembersMutationResult = Awaited<ReturnType<typeof ClientFamilyMemberService.postV1ClientsByClientIdFamilymembers>>;
export type ClientIdentifierServicePostV1ClientsByClientIdIdentifiersMutationResult = Awaited<ReturnType<typeof ClientIdentifierService.postV1ClientsByClientIdIdentifiers>>;
export type CodesServicePostV1CodesMutationResult = Awaited<ReturnType<typeof CodesService.postV1Codes>>;
export type CodeValuesServicePostV1CodesByCodeIdCodevaluesMutationResult = Awaited<ReturnType<typeof CodeValuesService.postV1CodesByCodeIdCodevalues>>;
export type CollateralManagementServicePostV1CollateralManagementMutationResult = Awaited<ReturnType<typeof CollateralManagementService.postV1CollateralManagement>>;
export type CollectionSheetServicePostV1CollectionsheetMutationResult = Awaited<ReturnType<typeof CollectionSheetService.postV1Collectionsheet>>;
export type DataTablesServicePostV1DatatablesMutationResult = Awaited<ReturnType<typeof DataTablesService.postV1Datatables>>;
export type DataTablesServicePostV1DatatablesDeregisterByDatatableMutationResult = Awaited<ReturnType<typeof DataTablesService.postV1DatatablesDeregisterByDatatable>>;
export type DataTablesServicePostV1DatatablesRegisterByDatatableByApptableMutationResult = Awaited<ReturnType<typeof DataTablesService.postV1DatatablesRegisterByDatatableByApptable>>;
export type DataTablesServicePostV1DatatablesByDatatableQueryMutationResult = Awaited<ReturnType<typeof DataTablesService.postV1DatatablesByDatatableQuery>>;
export type DataTablesServicePostV1DatatablesByDatatableByApptableIdMutationResult = Awaited<ReturnType<typeof DataTablesService.postV1DatatablesByDatatableByApptableId>>;
export type DelinquencyRangeAndBucketsManagementServicePostV1DelinquencyBucketsMutationResult = Awaited<ReturnType<typeof DelinquencyRangeAndBucketsManagementService.postV1DelinquencyBuckets>>;
export type DelinquencyRangeAndBucketsManagementServicePostV1DelinquencyRangesMutationResult = Awaited<ReturnType<typeof DelinquencyRangeAndBucketsManagementService.postV1DelinquencyRanges>>;
export type EntityDataTableServicePostV1EntityDatatableChecksMutationResult = Awaited<ReturnType<typeof EntityDataTableService.postV1EntityDatatableChecks>>;
export type FineractEntityServicePostV1EntitytoentitymappingByRelIdMutationResult = Awaited<ReturnType<typeof FineractEntityService.postV1EntitytoentitymappingByRelId>>;
export type ExternalAssetOwnerLoanProductAttributesServicePostV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesMutationResult = Awaited<ReturnType<typeof ExternalAssetOwnerLoanProductAttributesService.postV1ExternalAssetOwnersLoanProductByLoanProductIdAttributes>>;
export type ExternalAssetOwnersServicePostV1ExternalAssetOwnersSearchMutationResult = Awaited<ReturnType<typeof ExternalAssetOwnersService.postV1ExternalAssetOwnersSearch>>;
export type ExternalAssetOwnersServicePostV1ExternalAssetOwnersTransfersExternalIdByExternalIdMutationResult = Awaited<ReturnType<typeof ExternalAssetOwnersService.postV1ExternalAssetOwnersTransfersExternalIdByExternalId>>;
export type ExternalAssetOwnersServicePostV1ExternalAssetOwnersTransfersLoansExternalIdByLoanExternalIdMutationResult = Awaited<ReturnType<typeof ExternalAssetOwnersService.postV1ExternalAssetOwnersTransfersLoansExternalIdByLoanExternalId>>;
export type ExternalAssetOwnersServicePostV1ExternalAssetOwnersTransfersLoansByLoanIdMutationResult = Awaited<ReturnType<typeof ExternalAssetOwnersService.postV1ExternalAssetOwnersTransfersLoansByLoanId>>;
export type ExternalAssetOwnersServicePostV1ExternalAssetOwnersTransfersByIdMutationResult = Awaited<ReturnType<typeof ExternalAssetOwnersService.postV1ExternalAssetOwnersTransfersById>>;
export type MappingFinancialActivitiesToAccountsServicePostV1FinancialactivityaccountsMutationResult = Awaited<ReturnType<typeof MappingFinancialActivitiesToAccountsService.postV1Financialactivityaccounts>>;
export type FixedDepositAccountServicePostV1FixeddepositaccountsMutationResult = Awaited<ReturnType<typeof FixedDepositAccountService.postV1Fixeddepositaccounts>>;
export type FixedDepositAccountServicePostV1FixeddepositaccountsTransactionUploadtemplateMutationResult = Awaited<ReturnType<typeof FixedDepositAccountService.postV1FixeddepositaccountsTransactionUploadtemplate>>;
export type FixedDepositAccountServicePostV1FixeddepositaccountsUploadtemplateMutationResult = Awaited<ReturnType<typeof FixedDepositAccountService.postV1FixeddepositaccountsUploadtemplate>>;
export type FixedDepositAccountServicePostV1FixeddepositaccountsByAccountIdMutationResult = Awaited<ReturnType<typeof FixedDepositAccountService.postV1FixeddepositaccountsByAccountId>>;
export type FixedDepositAccountTransactionsServicePostV1FixeddepositaccountsByFixedDepositAccountIdTransactionsMutationResult = Awaited<ReturnType<typeof FixedDepositAccountTransactionsService.postV1FixeddepositaccountsByFixedDepositAccountIdTransactions>>;
export type FixedDepositAccountTransactionsServicePostV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionIdMutationResult = Awaited<ReturnType<typeof FixedDepositAccountTransactionsService.postV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionId>>;
export type FixedDepositProductServicePostV1FixeddepositproductsMutationResult = Awaited<ReturnType<typeof FixedDepositProductService.postV1Fixeddepositproducts>>;
export type FloatingRatesServicePostV1FloatingratesMutationResult = Awaited<ReturnType<typeof FloatingRatesService.postV1Floatingrates>>;
export type FundsServicePostV1FundsMutationResult = Awaited<ReturnType<typeof FundsService.postV1Funds>>;
export type GeneralLedgerAccountServicePostV1GlaccountsMutationResult = Awaited<ReturnType<typeof GeneralLedgerAccountService.postV1Glaccounts>>;
export type GeneralLedgerAccountServicePostV1GlaccountsUploadtemplateMutationResult = Awaited<ReturnType<typeof GeneralLedgerAccountService.postV1GlaccountsUploadtemplate>>;
export type AccountingClosureServicePostV1GlclosuresMutationResult = Awaited<ReturnType<typeof AccountingClosureService.postV1Glclosures>>;
export type GroupsServicePostV1GroupsMutationResult = Awaited<ReturnType<typeof GroupsService.postV1Groups>>;
export type GroupsServicePostV1GroupsUploadtemplateMutationResult = Awaited<ReturnType<typeof GroupsService.postV1GroupsUploadtemplate>>;
export type GroupsServicePostV1GroupsByGroupIdMutationResult = Awaited<ReturnType<typeof GroupsService.postV1GroupsByGroupId>>;
export type GroupsServicePostV1GroupsByGroupIdCommandUnassignStaffMutationResult = Awaited<ReturnType<typeof GroupsService.postV1GroupsByGroupIdCommandUnassignStaff>>;
export type HolidaysServicePostV1HolidaysMutationResult = Awaited<ReturnType<typeof HolidaysService.postV1Holidays>>;
export type HolidaysServicePostV1HolidaysByHolidayIdMutationResult = Awaited<ReturnType<typeof HolidaysService.postV1HolidaysByHolidayId>>;
export type HooksServicePostV1HooksMutationResult = Awaited<ReturnType<typeof HooksService.postV1Hooks>>;
export type InterestRateChartServicePostV1InterestratechartsMutationResult = Awaited<ReturnType<typeof InterestRateChartService.postV1Interestratecharts>>;
export type InterestRateSlabAKAInterestBandsServicePostV1InterestratechartsByChartIdChartslabsMutationResult = Awaited<ReturnType<typeof InterestRateSlabAKAInterestBandsService.postV1InterestratechartsByChartIdChartslabs>>;
export type ProgressiveLoanServicePostV1InternalLoanProgressiveByLoanIdModelMutationResult = Awaited<ReturnType<typeof ProgressiveLoanService.postV1InternalLoanProgressiveByLoanIdModel>>;
export type InterOperationServicePostV1InteroperationPartiesByIdTypeByIdValueMutationResult = Awaited<ReturnType<typeof InterOperationService.postV1InteroperationPartiesByIdTypeByIdValue>>;
export type InterOperationServicePostV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeMutationResult = Awaited<ReturnType<typeof InterOperationService.postV1InteroperationPartiesByIdTypeByIdValueBySubIdOrType>>;
export type InterOperationServicePostV1InteroperationQuotesMutationResult = Awaited<ReturnType<typeof InterOperationService.postV1InteroperationQuotes>>;
export type InterOperationServicePostV1InteroperationRequestsMutationResult = Awaited<ReturnType<typeof InterOperationService.postV1InteroperationRequests>>;
export type InterOperationServicePostV1InteroperationTransactionsByAccountIdDisburseMutationResult = Awaited<ReturnType<typeof InterOperationService.postV1InteroperationTransactionsByAccountIdDisburse>>;
export type InterOperationServicePostV1InteroperationTransactionsByAccountIdLoanrepaymentMutationResult = Awaited<ReturnType<typeof InterOperationService.postV1InteroperationTransactionsByAccountIdLoanrepayment>>;
export type InterOperationServicePostV1InteroperationTransfersMutationResult = Awaited<ReturnType<typeof InterOperationService.postV1InteroperationTransfers>>;
export type SchedulerJobServicePostV1JobsShortNameByShortNameMutationResult = Awaited<ReturnType<typeof SchedulerJobService.postV1JobsShortNameByShortName>>;
export type SchedulerJobServicePostV1JobsByJobIdMutationResult = Awaited<ReturnType<typeof SchedulerJobService.postV1JobsByJobId>>;
export type InlineJobServicePostV1JobsByJobNameInlineMutationResult = Awaited<ReturnType<typeof InlineJobService.postV1JobsByJobNameInline>>;
export type JournalEntriesServicePostV1JournalentriesMutationResult = Awaited<ReturnType<typeof JournalEntriesService.postV1Journalentries>>;
export type JournalEntriesServicePostV1JournalentriesUploadtemplateMutationResult = Awaited<ReturnType<typeof JournalEntriesService.postV1JournalentriesUploadtemplate>>;
export type JournalEntriesServicePostV1JournalentriesByTransactionIdMutationResult = Awaited<ReturnType<typeof JournalEntriesService.postV1JournalentriesByTransactionId>>;
export type LoanProductsServicePostV1LoanproductsMutationResult = Awaited<ReturnType<typeof LoanProductsService.postV1Loanproducts>>;
export type ProductMixServicePostV1LoanproductsByProductIdProductmixMutationResult = Awaited<ReturnType<typeof ProductMixService.postV1LoanproductsByProductIdProductmix>>;
export type LoansServicePostV1LoansMutationResult = Awaited<ReturnType<typeof LoansService.postV1Loans>>;
export type LoansServicePostV1LoansExternalIdByLoanExternalIdMutationResult = Awaited<ReturnType<typeof LoansService.postV1LoansExternalIdByLoanExternalId>>;
export type LoansServicePostV1LoansExternalIdByLoanExternalIdDelinquencyActionsMutationResult = Awaited<ReturnType<typeof LoansService.postV1LoansExternalIdByLoanExternalIdDelinquencyActions>>;
export type LoansServicePostV1LoansGlimAccountByGlimIdMutationResult = Awaited<ReturnType<typeof LoansService.postV1LoansGlimAccountByGlimId>>;
export type LoansServicePostV1LoansRepaymentsUploadtemplateMutationResult = Awaited<ReturnType<typeof LoansService.postV1LoansRepaymentsUploadtemplate>>;
export type LoansServicePostV1LoansUploadtemplateMutationResult = Awaited<ReturnType<typeof LoansService.postV1LoansUploadtemplate>>;
export type LoansServicePostV1LoansByLoanIdMutationResult = Awaited<ReturnType<typeof LoansService.postV1LoansByLoanId>>;
export type LoansServicePostV1LoansByLoanIdDelinquencyActionsMutationResult = Awaited<ReturnType<typeof LoansService.postV1LoansByLoanIdDelinquencyActions>>;
export type LoansPointInTimeServicePostV1LoansAtDateSearchMutationResult = Awaited<ReturnType<typeof LoansPointInTimeService.postV1LoansAtDateSearch>>;
export type LoansPointInTimeServicePostV1LoansAtDateSearchExternalIdMutationResult = Awaited<ReturnType<typeof LoansPointInTimeService.postV1LoansAtDateSearchExternalId>>;
export type LoanCobCatchUpServicePostV1LoansCatchUpMutationResult = Awaited<ReturnType<typeof LoanCobCatchUpService.postV1LoansCatchUp>>;
export type LoanChargesServicePostV1LoansExternalIdByLoanExternalIdChargesMutationResult = Awaited<ReturnType<typeof LoanChargesService.postV1LoansExternalIdByLoanExternalIdCharges>>;
export type LoanChargesServicePostV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdMutationResult = Awaited<ReturnType<typeof LoanChargesService.postV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalId>>;
export type LoanChargesServicePostV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdMutationResult = Awaited<ReturnType<typeof LoanChargesService.postV1LoansExternalIdByLoanExternalIdChargesByLoanChargeId>>;
export type LoanChargesServicePostV1LoansByLoanIdChargesMutationResult = Awaited<ReturnType<typeof LoanChargesService.postV1LoansByLoanIdCharges>>;
export type LoanChargesServicePostV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdMutationResult = Awaited<ReturnType<typeof LoanChargesService.postV1LoansByLoanIdChargesExternalIdByLoanChargeExternalId>>;
export type LoanChargesServicePostV1LoansByLoanIdChargesByLoanChargeIdMutationResult = Awaited<ReturnType<typeof LoanChargesService.postV1LoansByLoanIdChargesByLoanChargeId>>;
export type LoanInterestPauseServicePostV1LoansExternalIdByLoanExternalIdInterestPausesMutationResult = Awaited<ReturnType<typeof LoanInterestPauseService.postV1LoansExternalIdByLoanExternalIdInterestPauses>>;
export type LoanInterestPauseServicePostV1LoansByLoanIdInterestPausesMutationResult = Awaited<ReturnType<typeof LoanInterestPauseService.postV1LoansByLoanIdInterestPauses>>;
export type LoanTransactionsServicePostV1LoansExternalIdByLoanExternalIdTransactionsMutationResult = Awaited<ReturnType<typeof LoanTransactionsService.postV1LoansExternalIdByLoanExternalIdTransactions>>;
export type LoanTransactionsServicePostV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionIdMutationResult = Awaited<ReturnType<typeof LoanTransactionsService.postV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionId>>;
export type LoanTransactionsServicePostV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdMutationResult = Awaited<ReturnType<typeof LoanTransactionsService.postV1LoansExternalIdByLoanExternalIdTransactionsByTransactionId>>;
export type LoanTransactionsServicePostV1LoansByLoanIdTransactionsMutationResult = Awaited<ReturnType<typeof LoanTransactionsService.postV1LoansByLoanIdTransactions>>;
export type LoanTransactionsServicePostV1LoansByLoanIdTransactionsExternalIdByExternalTransactionIdMutationResult = Awaited<ReturnType<typeof LoanTransactionsService.postV1LoansByLoanIdTransactionsExternalIdByExternalTransactionId>>;
export type LoanTransactionsServicePostV1LoansByLoanIdTransactionsByTransactionIdMutationResult = Awaited<ReturnType<typeof LoanTransactionsService.postV1LoansByLoanIdTransactionsByTransactionId>>;
export type BulkLoansServicePostV1LoansLoanreassignmentMutationResult = Awaited<ReturnType<typeof BulkLoansService.postV1LoansLoanreassignment>>;
export type LoanCollateralServicePostV1LoansByLoanIdCollateralsMutationResult = Awaited<ReturnType<typeof LoanCollateralService.postV1LoansByLoanIdCollaterals>>;
export type GuarantorsServicePostV1LoansByLoanIdGuarantorsMutationResult = Awaited<ReturnType<typeof GuarantorsService.postV1LoansByLoanIdGuarantors>>;
export type GuarantorsServicePostV1LoansByLoanIdGuarantorsUploadtemplateMutationResult = Awaited<ReturnType<typeof GuarantorsService.postV1LoansByLoanIdGuarantorsUploadtemplate>>;
export type LoanReschedulingServicePostV1LoansByLoanIdScheduleMutationResult = Awaited<ReturnType<typeof LoanReschedulingService.postV1LoansByLoanIdSchedule>>;
export type MakerCheckerOr4EyeFunctionalityServicePostV1MakercheckersByAuditIdMutationResult = Awaited<ReturnType<typeof MakerCheckerOr4EyeFunctionalityService.postV1MakercheckersByAuditId>>;
export type OfficesServicePostV1OfficesMutationResult = Awaited<ReturnType<typeof OfficesService.postV1Offices>>;
export type OfficesServicePostV1OfficesUploadtemplateMutationResult = Awaited<ReturnType<typeof OfficesService.postV1OfficesUploadtemplate>>;
export type PaymentTypeServicePostV1PaymenttypesMutationResult = Awaited<ReturnType<typeof PaymentTypeService.postV1Paymenttypes>>;
export type ProductsServicePostV1ProductsByTypeMutationResult = Awaited<ReturnType<typeof ProductsService.postV1ProductsByType>>;
export type ProductsServicePostV1ProductsByTypeByProductIdMutationResult = Awaited<ReturnType<typeof ProductsService.postV1ProductsByTypeByProductId>>;
export type ProvisioningCategoryServicePostV1ProvisioningcategoryMutationResult = Awaited<ReturnType<typeof ProvisioningCategoryService.postV1Provisioningcategory>>;
export type ProvisioningCriteriaServicePostV1ProvisioningcriteriaMutationResult = Awaited<ReturnType<typeof ProvisioningCriteriaService.postV1Provisioningcriteria>>;
export type ProvisioningEntriesServicePostV1ProvisioningentriesMutationResult = Awaited<ReturnType<typeof ProvisioningEntriesService.postV1Provisioningentries>>;
export type ProvisioningEntriesServicePostV1ProvisioningentriesByEntryIdMutationResult = Awaited<ReturnType<typeof ProvisioningEntriesService.postV1ProvisioningentriesByEntryId>>;
export type RateServicePostV1RatesMutationResult = Awaited<ReturnType<typeof RateService.postV1Rates>>;
export type RecurringDepositAccountServicePostV1RecurringdepositaccountsMutationResult = Awaited<ReturnType<typeof RecurringDepositAccountService.postV1Recurringdepositaccounts>>;
export type RecurringDepositAccountServicePostV1RecurringdepositaccountsTransactionsUploadtemplateMutationResult = Awaited<ReturnType<typeof RecurringDepositAccountService.postV1RecurringdepositaccountsTransactionsUploadtemplate>>;
export type RecurringDepositAccountServicePostV1RecurringdepositaccountsUploadtemplateMutationResult = Awaited<ReturnType<typeof RecurringDepositAccountService.postV1RecurringdepositaccountsUploadtemplate>>;
export type RecurringDepositAccountServicePostV1RecurringdepositaccountsByAccountIdMutationResult = Awaited<ReturnType<typeof RecurringDepositAccountService.postV1RecurringdepositaccountsByAccountId>>;
export type RecurringDepositAccountTransactionsServicePostV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsMutationResult = Awaited<ReturnType<typeof RecurringDepositAccountTransactionsService.postV1RecurringdepositaccountsByRecurringDepositAccountIdTransactions>>;
export type RecurringDepositAccountTransactionsServicePostV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionIdMutationResult = Awaited<ReturnType<typeof RecurringDepositAccountTransactionsService.postV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionId>>;
export type RecurringDepositProductServicePostV1RecurringdepositproductsMutationResult = Awaited<ReturnType<typeof RecurringDepositProductService.postV1Recurringdepositproducts>>;
export type ReportMailingJobsServicePostV1ReportmailingjobsMutationResult = Awaited<ReturnType<typeof ReportMailingJobsService.postV1Reportmailingjobs>>;
export type ReportsServicePostV1ReportsMutationResult = Awaited<ReturnType<typeof ReportsService.postV1Reports>>;
export type RescheduleLoansServicePostV1RescheduleloansMutationResult = Awaited<ReturnType<typeof RescheduleLoansService.postV1Rescheduleloans>>;
export type RescheduleLoansServicePostV1RescheduleloansByScheduleIdMutationResult = Awaited<ReturnType<typeof RescheduleLoansService.postV1RescheduleloansByScheduleId>>;
export type RolesServicePostV1RolesMutationResult = Awaited<ReturnType<typeof RolesService.postV1Roles>>;
export type RolesServicePostV1RolesByRoleIdMutationResult = Awaited<ReturnType<typeof RolesService.postV1RolesByRoleId>>;
export type PeriodicAccrualAccountingServicePostV1RunaccrualsMutationResult = Awaited<ReturnType<typeof PeriodicAccrualAccountingService.postV1Runaccruals>>;
export type SavingsAccountServicePostV1SavingsaccountsMutationResult = Awaited<ReturnType<typeof SavingsAccountService.postV1Savingsaccounts>>;
export type SavingsAccountServicePostV1SavingsaccountsExternalIdByExternalIdMutationResult = Awaited<ReturnType<typeof SavingsAccountService.postV1SavingsaccountsExternalIdByExternalId>>;
export type SavingsAccountServicePostV1SavingsaccountsGsimMutationResult = Awaited<ReturnType<typeof SavingsAccountService.postV1SavingsaccountsGsim>>;
export type SavingsAccountServicePostV1SavingsaccountsGsimcommandsByParentAccountIdMutationResult = Awaited<ReturnType<typeof SavingsAccountService.postV1SavingsaccountsGsimcommandsByParentAccountId>>;
export type SavingsAccountServicePostV1SavingsaccountsTransactionsUploadtemplateMutationResult = Awaited<ReturnType<typeof SavingsAccountService.postV1SavingsaccountsTransactionsUploadtemplate>>;
export type SavingsAccountServicePostV1SavingsaccountsUploadtemplateMutationResult = Awaited<ReturnType<typeof SavingsAccountService.postV1SavingsaccountsUploadtemplate>>;
export type SavingsAccountServicePostV1SavingsaccountsByAccountIdMutationResult = Awaited<ReturnType<typeof SavingsAccountService.postV1SavingsaccountsByAccountId>>;
export type SavingsChargesServicePostV1SavingsaccountsBySavingsAccountIdChargesMutationResult = Awaited<ReturnType<typeof SavingsChargesService.postV1SavingsaccountsBySavingsAccountIdCharges>>;
export type SavingsChargesServicePostV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdMutationResult = Awaited<ReturnType<typeof SavingsChargesService.postV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeId>>;
export type SavingsAccountTransactionsServicePostV1SavingsaccountsBySavingsIdTransactionsMutationResult = Awaited<ReturnType<typeof SavingsAccountTransactionsService.postV1SavingsaccountsBySavingsIdTransactions>>;
export type SavingsAccountTransactionsServicePostV1SavingsaccountsBySavingsIdTransactionsQueryMutationResult = Awaited<ReturnType<typeof SavingsAccountTransactionsService.postV1SavingsaccountsBySavingsIdTransactionsQuery>>;
export type SavingsAccountTransactionsServicePostV1SavingsaccountsBySavingsIdTransactionsByTransactionIdMutationResult = Awaited<ReturnType<typeof SavingsAccountTransactionsService.postV1SavingsaccountsBySavingsIdTransactionsByTransactionId>>;
export type SavingsProductServicePostV1SavingsproductsMutationResult = Awaited<ReturnType<typeof SavingsProductService.postV1Savingsproducts>>;
export type SchedulerServicePostV1SchedulerMutationResult = Awaited<ReturnType<typeof SchedulerService.postV1Scheduler>>;
export type SearchApiServicePostV1SearchAdvanceMutationResult = Awaited<ReturnType<typeof SearchApiService.postV1SearchAdvance>>;
export type SelfAccountTransferServicePostV1SelfAccounttransfersMutationResult = Awaited<ReturnType<typeof SelfAccountTransferService.postV1SelfAccounttransfers>>;
export type SelfAuthenticationServicePostV1SelfAuthenticationMutationResult = Awaited<ReturnType<typeof SelfAuthenticationService.postV1SelfAuthentication>>;
export type SelfThirdPartyTransferServicePostV1SelfBeneficiariesTptMutationResult = Awaited<ReturnType<typeof SelfThirdPartyTransferService.postV1SelfBeneficiariesTpt>>;
export type SelfClientServicePostV1SelfClientsByClientIdImagesMutationResult = Awaited<ReturnType<typeof SelfClientService.postV1SelfClientsByClientIdImages>>;
export type DeviceRegistrationServicePostV1SelfDeviceRegistrationMutationResult = Awaited<ReturnType<typeof DeviceRegistrationService.postV1SelfDeviceRegistration>>;
export type SelfLoansServicePostV1SelfLoansMutationResult = Awaited<ReturnType<typeof SelfLoansService.postV1SelfLoans>>;
export type SelfLoansServicePostV1SelfLoansByLoanIdMutationResult = Awaited<ReturnType<typeof SelfLoansService.postV1SelfLoansByLoanId>>;
export type PocketServicePostV1SelfPocketsMutationResult = Awaited<ReturnType<typeof PocketService.postV1SelfPockets>>;
export type SelfServiceRegistrationServicePostV1SelfRegistrationMutationResult = Awaited<ReturnType<typeof SelfServiceRegistrationService.postV1SelfRegistration>>;
export type SelfServiceRegistrationServicePostV1SelfRegistrationUserMutationResult = Awaited<ReturnType<typeof SelfServiceRegistrationService.postV1SelfRegistrationUser>>;
export type SelfSavingsAccountServicePostV1SelfSavingsaccountsMutationResult = Awaited<ReturnType<typeof SelfSavingsAccountService.postV1SelfSavingsaccounts>>;
export type SelfShareAccountsServicePostV1SelfShareaccountsMutationResult = Awaited<ReturnType<typeof SelfShareAccountsService.postV1SelfShareaccounts>>;
export type SelfScoreCardServicePostV1SelfSurveysScorecardsBySurveyIdMutationResult = Awaited<ReturnType<typeof SelfScoreCardService.postV1SelfSurveysScorecardsBySurveyId>>;
export type SelfDividendServicePostV1ShareproductByProductIdDividendMutationResult = Awaited<ReturnType<typeof SelfDividendService.postV1ShareproductByProductIdDividend>>;
export type SmsServicePostV1SmsMutationResult = Awaited<ReturnType<typeof SmsService.postV1Sms>>;
export type StaffServicePostV1StaffMutationResult = Awaited<ReturnType<typeof StaffService.postV1Staff>>;
export type StaffServicePostV1StaffUploadtemplateMutationResult = Awaited<ReturnType<typeof StaffService.postV1StaffUploadtemplate>>;
export type StandingInstructionsServicePostV1StandinginstructionsMutationResult = Awaited<ReturnType<typeof StandingInstructionsService.postV1Standinginstructions>>;
export type SurveyServicePostV1SurveyBySurveyNameByApptableIdMutationResult = Awaited<ReturnType<typeof SurveyService.postV1SurveyBySurveyNameByApptableId>>;
export type SpmSurveysServicePostV1SurveysMutationResult = Awaited<ReturnType<typeof SpmSurveysService.postV1Surveys>>;
export type SpmSurveysServicePostV1SurveysByIdMutationResult = Awaited<ReturnType<typeof SpmSurveysService.postV1SurveysById>>;
export type ScoreCardServicePostV1SurveysScorecardsBySurveyIdMutationResult = Awaited<ReturnType<typeof ScoreCardService.postV1SurveysScorecardsBySurveyId>>;
export type SpmApiLookUpTableServicePostV1SurveysBySurveyIdLookuptablesMutationResult = Awaited<ReturnType<typeof SpmApiLookUpTableService.postV1SurveysBySurveyIdLookuptables>>;
export type TaxComponentsServicePostV1TaxesComponentMutationResult = Awaited<ReturnType<typeof TaxComponentsService.postV1TaxesComponent>>;
export type TaxGroupServicePostV1TaxesGroupMutationResult = Awaited<ReturnType<typeof TaxGroupService.postV1TaxesGroup>>;
export type TellerCashManagementServicePostV1TellersMutationResult = Awaited<ReturnType<typeof TellerCashManagementService.postV1Tellers>>;
export type TellerCashManagementServicePostV1TellersByTellerIdCashiersMutationResult = Awaited<ReturnType<typeof TellerCashManagementService.postV1TellersByTellerIdCashiers>>;
export type TellerCashManagementServicePostV1TellersByTellerIdCashiersByCashierIdAllocateMutationResult = Awaited<ReturnType<typeof TellerCashManagementService.postV1TellersByTellerIdCashiersByCashierIdAllocate>>;
export type TellerCashManagementServicePostV1TellersByTellerIdCashiersByCashierIdSettleMutationResult = Awaited<ReturnType<typeof TellerCashManagementService.postV1TellersByTellerIdCashiersByCashierIdSettle>>;
export type UserGeneratedDocumentsServicePostV1TemplatesMutationResult = Awaited<ReturnType<typeof UserGeneratedDocumentsService.postV1Templates>>;
export type UserGeneratedDocumentsServicePostV1TemplatesByTemplateIdMutationResult = Awaited<ReturnType<typeof UserGeneratedDocumentsService.postV1TemplatesByTemplateId>>;
export type TwoFactorServicePostV1TwofactorMutationResult = Awaited<ReturnType<typeof TwoFactorService.postV1Twofactor>>;
export type TwoFactorServicePostV1TwofactorInvalidateMutationResult = Awaited<ReturnType<typeof TwoFactorService.postV1TwofactorInvalidate>>;
export type TwoFactorServicePostV1TwofactorValidateMutationResult = Awaited<ReturnType<typeof TwoFactorService.postV1TwofactorValidate>>;
export type UsersServicePostV1UsersMutationResult = Awaited<ReturnType<typeof UsersService.postV1Users>>;
export type UsersServicePostV1UsersUploadtemplateMutationResult = Awaited<ReturnType<typeof UsersService.postV1UsersUploadtemplate>>;
export type UsersServicePostV1UsersByUserIdPwdMutationResult = Awaited<ReturnType<typeof UsersService.postV1UsersByUserIdPwd>>;
export type CalendarServicePostV1ByEntityTypeByEntityIdCalendarsMutationResult = Awaited<ReturnType<typeof CalendarService.postV1ByEntityTypeByEntityIdCalendars>>;
export type DocumentsServicePostV1ByEntityTypeByEntityIdDocumentsMutationResult = Awaited<ReturnType<typeof DocumentsService.postV1ByEntityTypeByEntityIdDocuments>>;
export type MeetingsServicePostV1ByEntityTypeByEntityIdMeetingsMutationResult = Awaited<ReturnType<typeof MeetingsService.postV1ByEntityTypeByEntityIdMeetings>>;
export type MeetingsServicePostV1ByEntityTypeByEntityIdMeetingsByMeetingIdMutationResult = Awaited<ReturnType<typeof MeetingsService.postV1ByEntityTypeByEntityIdMeetingsByMeetingId>>;
export type NotesServicePostV1ByResourceTypeByResourceIdNotesMutationResult = Awaited<ReturnType<typeof NotesService.postV1ByResourceTypeByResourceIdNotes>>;
export type ClientSearchV2ServicePostV2ClientsSearchMutationResult = Awaited<ReturnType<typeof ClientSearchV2Service.postV2ClientsSearch>>;
export type DefaultServicePutV1EmailCampaignByResourceIdMutationResult = Awaited<ReturnType<typeof DefaultService.putV1EmailCampaignByResourceId>>;
export type DefaultServicePutV1EmailConfigurationMutationResult = Awaited<ReturnType<typeof DefaultService.putV1EmailConfiguration>>;
export type DefaultServicePutV1EmailByResourceIdMutationResult = Awaited<ReturnType<typeof DefaultService.putV1EmailByResourceId>>;
export type DefaultServicePutV1InternalConfigurationsNameByConfigNameValueByConfigValueMutationResult = Awaited<ReturnType<typeof DefaultService.putV1InternalConfigurationsNameByConfigNameValueByConfigValue>>;
export type DefaultServicePutV1SmscampaignsByCampaignIdMutationResult = Awaited<ReturnType<typeof DefaultService.putV1SmscampaignsByCampaignId>>;
export type DefaultServicePutV1TwofactorConfigureMutationResult = Awaited<ReturnType<typeof DefaultService.putV1TwofactorConfigure>>;
export type DefaultServicePutV1ByEntityByEntityIdImagesMutationResult = Awaited<ReturnType<typeof DefaultService.putV1ByEntityByEntityIdImages>>;
export type CreditBureauConfigurationServicePutV1CreditBureauConfigurationConfigurationByConfigurationIdMutationResult = Awaited<ReturnType<typeof CreditBureauConfigurationService.putV1CreditBureauConfigurationConfigurationByConfigurationId>>;
export type CreditBureauConfigurationServicePutV1CreditBureauConfigurationMappingsMutationResult = Awaited<ReturnType<typeof CreditBureauConfigurationService.putV1CreditBureauConfigurationMappings>>;
export type CreditBureauConfigurationServicePutV1CreditBureauConfigurationOrganisationCreditBureauMutationResult = Awaited<ReturnType<typeof CreditBureauConfigurationService.putV1CreditBureauConfigurationOrganisationCreditBureau>>;
export type AccountingRulesServicePutV1AccountingrulesByAccountingRuleIdMutationResult = Awaited<ReturnType<typeof AccountingRulesService.putV1AccountingrulesByAccountingRuleId>>;
export type AccountNumberFormatServicePutV1AccountnumberformatsByAccountNumberFormatIdMutationResult = Awaited<ReturnType<typeof AccountNumberFormatService.putV1AccountnumberformatsByAccountNumberFormatId>>;
export type ShareAccountServicePutV1AccountsByTypeByAccountIdMutationResult = Awaited<ReturnType<typeof ShareAccountService.putV1AccountsByTypeByAccountId>>;
export type AdhocQueryApiServicePutV1AdhocqueryByAdHocIdMutationResult = Awaited<ReturnType<typeof AdhocQueryApiService.putV1AdhocqueryByAdHocId>>;
export type CacheServicePutV1CachesMutationResult = Awaited<ReturnType<typeof CacheService.putV1Caches>>;
export type CentersServicePutV1CentersByCenterIdMutationResult = Awaited<ReturnType<typeof CentersService.putV1CentersByCenterId>>;
export type ChargesServicePutV1ChargesByChargeIdMutationResult = Awaited<ReturnType<typeof ChargesService.putV1ChargesByChargeId>>;
export type ClientsAddressServicePutV1ClientByClientidAddressesMutationResult = Awaited<ReturnType<typeof ClientsAddressService.putV1ClientByClientidAddresses>>;
export type ClientServicePutV1ClientsExternalIdByExternalIdMutationResult = Awaited<ReturnType<typeof ClientService.putV1ClientsExternalIdByExternalId>>;
export type ClientServicePutV1ClientsByClientIdMutationResult = Awaited<ReturnType<typeof ClientService.putV1ClientsByClientId>>;
export type ClientCollateralManagementServicePutV1ClientsByClientIdCollateralsByCollateralIdMutationResult = Awaited<ReturnType<typeof ClientCollateralManagementService.putV1ClientsByClientIdCollateralsByCollateralId>>;
export type ClientFamilyMemberServicePutV1ClientsByClientIdFamilymembersByFamilyMemberIdMutationResult = Awaited<ReturnType<typeof ClientFamilyMemberService.putV1ClientsByClientIdFamilymembersByFamilyMemberId>>;
export type ClientIdentifierServicePutV1ClientsByClientIdIdentifiersByIdentifierIdMutationResult = Awaited<ReturnType<typeof ClientIdentifierService.putV1ClientsByClientIdIdentifiersByIdentifierId>>;
export type CodesServicePutV1CodesByCodeIdMutationResult = Awaited<ReturnType<typeof CodesService.putV1CodesByCodeId>>;
export type CodeValuesServicePutV1CodesByCodeIdCodevaluesByCodeValueIdMutationResult = Awaited<ReturnType<typeof CodeValuesService.putV1CodesByCodeIdCodevaluesByCodeValueId>>;
export type CollateralManagementServicePutV1CollateralManagementByCollateralIdMutationResult = Awaited<ReturnType<typeof CollateralManagementService.putV1CollateralManagementByCollateralId>>;
export type GlobalConfigurationServicePutV1ConfigurationsNameByConfigNameMutationResult = Awaited<ReturnType<typeof GlobalConfigurationService.putV1ConfigurationsNameByConfigName>>;
export type GlobalConfigurationServicePutV1ConfigurationsByConfigIdMutationResult = Awaited<ReturnType<typeof GlobalConfigurationService.putV1ConfigurationsByConfigId>>;
export type CurrencyServicePutV1CurrenciesMutationResult = Awaited<ReturnType<typeof CurrencyService.putV1Currencies>>;
export type DataTablesServicePutV1DatatablesByDatatableNameMutationResult = Awaited<ReturnType<typeof DataTablesService.putV1DatatablesByDatatableName>>;
export type DataTablesServicePutV1DatatablesByDatatableByApptableIdMutationResult = Awaited<ReturnType<typeof DataTablesService.putV1DatatablesByDatatableByApptableId>>;
export type DataTablesServicePutV1DatatablesByDatatableByApptableIdByDatatableIdMutationResult = Awaited<ReturnType<typeof DataTablesService.putV1DatatablesByDatatableByApptableIdByDatatableId>>;
export type DelinquencyRangeAndBucketsManagementServicePutV1DelinquencyBucketsByDelinquencyBucketIdMutationResult = Awaited<ReturnType<typeof DelinquencyRangeAndBucketsManagementService.putV1DelinquencyBucketsByDelinquencyBucketId>>;
export type DelinquencyRangeAndBucketsManagementServicePutV1DelinquencyRangesByDelinquencyRangeIdMutationResult = Awaited<ReturnType<typeof DelinquencyRangeAndBucketsManagementService.putV1DelinquencyRangesByDelinquencyRangeId>>;
export type FineractEntityServicePutV1EntitytoentitymappingByMapIdMutationResult = Awaited<ReturnType<typeof FineractEntityService.putV1EntitytoentitymappingByMapId>>;
export type ExternalAssetOwnerLoanProductAttributesServicePutV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesByIdMutationResult = Awaited<ReturnType<typeof ExternalAssetOwnerLoanProductAttributesService.putV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesById>>;
export type ExternalEventConfigurationServicePutV1ExternaleventsConfigurationMutationResult = Awaited<ReturnType<typeof ExternalEventConfigurationService.putV1ExternaleventsConfiguration>>;
export type ExternalServicesServicePutV1ExternalserviceByServicenameMutationResult = Awaited<ReturnType<typeof ExternalServicesService.putV1ExternalserviceByServicename>>;
export type MappingFinancialActivitiesToAccountsServicePutV1FinancialactivityaccountsByMappingIdMutationResult = Awaited<ReturnType<typeof MappingFinancialActivitiesToAccountsService.putV1FinancialactivityaccountsByMappingId>>;
export type FixedDepositAccountServicePutV1FixeddepositaccountsByAccountIdMutationResult = Awaited<ReturnType<typeof FixedDepositAccountService.putV1FixeddepositaccountsByAccountId>>;
export type FixedDepositProductServicePutV1FixeddepositproductsByProductIdMutationResult = Awaited<ReturnType<typeof FixedDepositProductService.putV1FixeddepositproductsByProductId>>;
export type FloatingRatesServicePutV1FloatingratesByFloatingRateIdMutationResult = Awaited<ReturnType<typeof FloatingRatesService.putV1FloatingratesByFloatingRateId>>;
export type FundsServicePutV1FundsByFundIdMutationResult = Awaited<ReturnType<typeof FundsService.putV1FundsByFundId>>;
export type GeneralLedgerAccountServicePutV1GlaccountsByGlAccountIdMutationResult = Awaited<ReturnType<typeof GeneralLedgerAccountService.putV1GlaccountsByGlAccountId>>;
export type AccountingClosureServicePutV1GlclosuresByGlClosureIdMutationResult = Awaited<ReturnType<typeof AccountingClosureService.putV1GlclosuresByGlClosureId>>;
export type GroupsServicePutV1GroupsByGroupIdMutationResult = Awaited<ReturnType<typeof GroupsService.putV1GroupsByGroupId>>;
export type HolidaysServicePutV1HolidaysByHolidayIdMutationResult = Awaited<ReturnType<typeof HolidaysService.putV1HolidaysByHolidayId>>;
export type HooksServicePutV1HooksByHookIdMutationResult = Awaited<ReturnType<typeof HooksService.putV1HooksByHookId>>;
export type InstanceModeServicePutV1InstanceModeMutationResult = Awaited<ReturnType<typeof InstanceModeService.putV1InstanceMode>>;
export type InterestRateChartServicePutV1InterestratechartsByChartIdMutationResult = Awaited<ReturnType<typeof InterestRateChartService.putV1InterestratechartsByChartId>>;
export type InterestRateSlabAKAInterestBandsServicePutV1InterestratechartsByChartIdChartslabsByChartSlabIdMutationResult = Awaited<ReturnType<typeof InterestRateSlabAKAInterestBandsService.putV1InterestratechartsByChartIdChartslabsByChartSlabId>>;
export type SchedulerJobServicePutV1JobsShortNameByShortNameMutationResult = Awaited<ReturnType<typeof SchedulerJobService.putV1JobsShortNameByShortName>>;
export type SchedulerJobServicePutV1JobsByJobIdMutationResult = Awaited<ReturnType<typeof SchedulerJobService.putV1JobsByJobId>>;
export type BusinessStepConfigurationServicePutV1JobsByJobNameStepsMutationResult = Awaited<ReturnType<typeof BusinessStepConfigurationService.putV1JobsByJobNameSteps>>;
export type LikelihoodServicePutV1LikelihoodByPpiNameByLikelihoodIdMutationResult = Awaited<ReturnType<typeof LikelihoodService.putV1LikelihoodByPpiNameByLikelihoodId>>;
export type LoanProductsServicePutV1LoanproductsExternalIdByExternalProductIdMutationResult = Awaited<ReturnType<typeof LoanProductsService.putV1LoanproductsExternalIdByExternalProductId>>;
export type LoanProductsServicePutV1LoanproductsByProductIdMutationResult = Awaited<ReturnType<typeof LoanProductsService.putV1LoanproductsByProductId>>;
export type ProductMixServicePutV1LoanproductsByProductIdProductmixMutationResult = Awaited<ReturnType<typeof ProductMixService.putV1LoanproductsByProductIdProductmix>>;
export type LoansServicePutV1LoansExternalIdByLoanExternalIdMutationResult = Awaited<ReturnType<typeof LoansService.putV1LoansExternalIdByLoanExternalId>>;
export type LoansServicePutV1LoansExternalIdByLoanExternalIdApprovedAmountMutationResult = Awaited<ReturnType<typeof LoansService.putV1LoansExternalIdByLoanExternalIdApprovedAmount>>;
export type LoansServicePutV1LoansExternalIdByLoanExternalIdAvailableDisbursementAmountMutationResult = Awaited<ReturnType<typeof LoansService.putV1LoansExternalIdByLoanExternalIdAvailableDisbursementAmount>>;
export type LoansServicePutV1LoansByLoanIdMutationResult = Awaited<ReturnType<typeof LoansService.putV1LoansByLoanId>>;
export type LoansServicePutV1LoansByLoanIdApprovedAmountMutationResult = Awaited<ReturnType<typeof LoansService.putV1LoansByLoanIdApprovedAmount>>;
export type LoansServicePutV1LoansByLoanIdAvailableDisbursementAmountMutationResult = Awaited<ReturnType<typeof LoansService.putV1LoansByLoanIdAvailableDisbursementAmount>>;
export type LoanChargesServicePutV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdMutationResult = Awaited<ReturnType<typeof LoanChargesService.putV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalId>>;
export type LoanChargesServicePutV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdMutationResult = Awaited<ReturnType<typeof LoanChargesService.putV1LoansExternalIdByLoanExternalIdChargesByLoanChargeId>>;
export type LoanChargesServicePutV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdMutationResult = Awaited<ReturnType<typeof LoanChargesService.putV1LoansByLoanIdChargesExternalIdByLoanChargeExternalId>>;
export type LoanChargesServicePutV1LoansByLoanIdChargesByLoanChargeIdMutationResult = Awaited<ReturnType<typeof LoanChargesService.putV1LoansByLoanIdChargesByLoanChargeId>>;
export type LoanInterestPauseServicePutV1LoansExternalIdByLoanExternalIdInterestPausesByVariationIdMutationResult = Awaited<ReturnType<typeof LoanInterestPauseService.putV1LoansExternalIdByLoanExternalIdInterestPausesByVariationId>>;
export type LoanInterestPauseServicePutV1LoansByLoanIdInterestPausesByVariationIdMutationResult = Awaited<ReturnType<typeof LoanInterestPauseService.putV1LoansByLoanIdInterestPausesByVariationId>>;
export type LoanTransactionsServicePutV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByTransactionExternalIdMutationResult = Awaited<ReturnType<typeof LoanTransactionsService.putV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByTransactionExternalId>>;
export type LoanTransactionsServicePutV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdMutationResult = Awaited<ReturnType<typeof LoanTransactionsService.putV1LoansExternalIdByLoanExternalIdTransactionsByTransactionId>>;
export type LoanTransactionsServicePutV1LoansByLoanIdTransactionsExternalIdByTransactionExternalIdMutationResult = Awaited<ReturnType<typeof LoanTransactionsService.putV1LoansByLoanIdTransactionsExternalIdByTransactionExternalId>>;
export type LoanTransactionsServicePutV1LoansByLoanIdTransactionsByTransactionIdMutationResult = Awaited<ReturnType<typeof LoanTransactionsService.putV1LoansByLoanIdTransactionsByTransactionId>>;
export type LoanCollateralServicePutV1LoansByLoanIdCollateralsByCollateralIdMutationResult = Awaited<ReturnType<typeof LoanCollateralService.putV1LoansByLoanIdCollateralsByCollateralId>>;
export type LoanDisbursementDetailsServicePutV1LoansByLoanIdDisbursementsEditDisbursementsMutationResult = Awaited<ReturnType<typeof LoanDisbursementDetailsService.putV1LoansByLoanIdDisbursementsEditDisbursements>>;
export type LoanDisbursementDetailsServicePutV1LoansByLoanIdDisbursementsByDisbursementIdMutationResult = Awaited<ReturnType<typeof LoanDisbursementDetailsService.putV1LoansByLoanIdDisbursementsByDisbursementId>>;
export type GuarantorsServicePutV1LoansByLoanIdGuarantorsByGuarantorIdMutationResult = Awaited<ReturnType<typeof GuarantorsService.putV1LoansByLoanIdGuarantorsByGuarantorId>>;
export type RepaymentWithPostDatedChecksServicePutV1LoansByLoanIdPostdatedchecksByPostDatedCheckIdMutationResult = Awaited<ReturnType<typeof RepaymentWithPostDatedChecksService.putV1LoansByLoanIdPostdatedchecksByPostDatedCheckId>>;
export type MixMappingServicePutV1MixmappingMutationResult = Awaited<ReturnType<typeof MixMappingService.putV1Mixmapping>>;
export type NotificationServicePutV1NotificationsMutationResult = Awaited<ReturnType<typeof NotificationService.putV1Notifications>>;
export type OfficesServicePutV1OfficesExternalIdByExternalIdMutationResult = Awaited<ReturnType<typeof OfficesService.putV1OfficesExternalIdByExternalId>>;
export type OfficesServicePutV1OfficesByOfficeIdMutationResult = Awaited<ReturnType<typeof OfficesService.putV1OfficesByOfficeId>>;
export type PasswordPreferencesServicePutV1PasswordpreferencesMutationResult = Awaited<ReturnType<typeof PasswordPreferencesService.putV1Passwordpreferences>>;
export type PaymentTypeServicePutV1PaymenttypesByPaymentTypeIdMutationResult = Awaited<ReturnType<typeof PaymentTypeService.putV1PaymenttypesByPaymentTypeId>>;
export type PermissionsServicePutV1PermissionsMutationResult = Awaited<ReturnType<typeof PermissionsService.putV1Permissions>>;
export type ProductsServicePutV1ProductsByTypeByProductIdMutationResult = Awaited<ReturnType<typeof ProductsService.putV1ProductsByTypeByProductId>>;
export type ProvisioningCategoryServicePutV1ProvisioningcategoryByCategoryIdMutationResult = Awaited<ReturnType<typeof ProvisioningCategoryService.putV1ProvisioningcategoryByCategoryId>>;
export type ProvisioningCriteriaServicePutV1ProvisioningcriteriaByCriteriaIdMutationResult = Awaited<ReturnType<typeof ProvisioningCriteriaService.putV1ProvisioningcriteriaByCriteriaId>>;
export type RateServicePutV1RatesByRateIdMutationResult = Awaited<ReturnType<typeof RateService.putV1RatesByRateId>>;
export type RecurringDepositAccountServicePutV1RecurringdepositaccountsByAccountIdMutationResult = Awaited<ReturnType<typeof RecurringDepositAccountService.putV1RecurringdepositaccountsByAccountId>>;
export type RecurringDepositProductServicePutV1RecurringdepositproductsByProductIdMutationResult = Awaited<ReturnType<typeof RecurringDepositProductService.putV1RecurringdepositproductsByProductId>>;
export type ReportMailingJobsServicePutV1ReportmailingjobsByEntityIdMutationResult = Awaited<ReturnType<typeof ReportMailingJobsService.putV1ReportmailingjobsByEntityId>>;
export type ReportsServicePutV1ReportsByIdMutationResult = Awaited<ReturnType<typeof ReportsService.putV1ReportsById>>;
export type RolesServicePutV1RolesByRoleIdMutationResult = Awaited<ReturnType<typeof RolesService.putV1RolesByRoleId>>;
export type RolesServicePutV1RolesByRoleIdPermissionsMutationResult = Awaited<ReturnType<typeof RolesService.putV1RolesByRoleIdPermissions>>;
export type SavingsAccountServicePutV1SavingsaccountsExternalIdByExternalIdMutationResult = Awaited<ReturnType<typeof SavingsAccountService.putV1SavingsaccountsExternalIdByExternalId>>;
export type SavingsAccountServicePutV1SavingsaccountsGsimByParentAccountIdMutationResult = Awaited<ReturnType<typeof SavingsAccountService.putV1SavingsaccountsGsimByParentAccountId>>;
export type SavingsAccountServicePutV1SavingsaccountsByAccountIdMutationResult = Awaited<ReturnType<typeof SavingsAccountService.putV1SavingsaccountsByAccountId>>;
export type SavingsChargesServicePutV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdMutationResult = Awaited<ReturnType<typeof SavingsChargesService.putV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeId>>;
export type SavingsProductServicePutV1SavingsproductsByProductIdMutationResult = Awaited<ReturnType<typeof SavingsProductService.putV1SavingsproductsByProductId>>;
export type SelfThirdPartyTransferServicePutV1SelfBeneficiariesTptByBeneficiaryIdMutationResult = Awaited<ReturnType<typeof SelfThirdPartyTransferService.putV1SelfBeneficiariesTptByBeneficiaryId>>;
export type DeviceRegistrationServicePutV1SelfDeviceRegistrationByIdMutationResult = Awaited<ReturnType<typeof DeviceRegistrationService.putV1SelfDeviceRegistrationById>>;
export type SelfLoansServicePutV1SelfLoansByLoanIdMutationResult = Awaited<ReturnType<typeof SelfLoansService.putV1SelfLoansByLoanId>>;
export type SelfSavingsAccountServicePutV1SelfSavingsaccountsByAccountIdMutationResult = Awaited<ReturnType<typeof SelfSavingsAccountService.putV1SelfSavingsaccountsByAccountId>>;
export type SelfUserServicePutV1SelfUserMutationResult = Awaited<ReturnType<typeof SelfUserService.putV1SelfUser>>;
export type SelfDividendServicePutV1ShareproductByProductIdDividendByDividendIdMutationResult = Awaited<ReturnType<typeof SelfDividendService.putV1ShareproductByProductIdDividendByDividendId>>;
export type SmsServicePutV1SmsByResourceIdMutationResult = Awaited<ReturnType<typeof SmsService.putV1SmsByResourceId>>;
export type StaffServicePutV1StaffByStaffIdMutationResult = Awaited<ReturnType<typeof StaffService.putV1StaffByStaffId>>;
export type StandingInstructionsServicePutV1StandinginstructionsByStandingInstructionIdMutationResult = Awaited<ReturnType<typeof StandingInstructionsService.putV1StandinginstructionsByStandingInstructionId>>;
export type SurveyServicePutV1SurveyRegisterBySurveyNameByApptableMutationResult = Awaited<ReturnType<typeof SurveyService.putV1SurveyRegisterBySurveyNameByApptable>>;
export type SpmSurveysServicePutV1SurveysByIdMutationResult = Awaited<ReturnType<typeof SpmSurveysService.putV1SurveysById>>;
export type TaxComponentsServicePutV1TaxesComponentByTaxComponentIdMutationResult = Awaited<ReturnType<typeof TaxComponentsService.putV1TaxesComponentByTaxComponentId>>;
export type TaxGroupServicePutV1TaxesGroupByTaxGroupIdMutationResult = Awaited<ReturnType<typeof TaxGroupService.putV1TaxesGroupByTaxGroupId>>;
export type TellerCashManagementServicePutV1TellersByTellerIdMutationResult = Awaited<ReturnType<typeof TellerCashManagementService.putV1TellersByTellerId>>;
export type TellerCashManagementServicePutV1TellersByTellerIdCashiersByCashierIdMutationResult = Awaited<ReturnType<typeof TellerCashManagementService.putV1TellersByTellerIdCashiersByCashierId>>;
export type UserGeneratedDocumentsServicePutV1TemplatesByTemplateIdMutationResult = Awaited<ReturnType<typeof UserGeneratedDocumentsService.putV1TemplatesByTemplateId>>;
export type UsersServicePutV1UsersByUserIdMutationResult = Awaited<ReturnType<typeof UsersService.putV1UsersByUserId>>;
export type WorkingDaysServicePutV1WorkingdaysMutationResult = Awaited<ReturnType<typeof WorkingDaysService.putV1Workingdays>>;
export type CalendarServicePutV1ByEntityTypeByEntityIdCalendarsByCalendarIdMutationResult = Awaited<ReturnType<typeof CalendarService.putV1ByEntityTypeByEntityIdCalendarsByCalendarId>>;
export type DocumentsServicePutV1ByEntityTypeByEntityIdDocumentsByDocumentIdMutationResult = Awaited<ReturnType<typeof DocumentsService.putV1ByEntityTypeByEntityIdDocumentsByDocumentId>>;
export type MeetingsServicePutV1ByEntityTypeByEntityIdMeetingsByMeetingIdMutationResult = Awaited<ReturnType<typeof MeetingsService.putV1ByEntityTypeByEntityIdMeetingsByMeetingId>>;
export type NotesServicePutV1ByResourceTypeByResourceIdNotesByNoteIdMutationResult = Awaited<ReturnType<typeof NotesService.putV1ByResourceTypeByResourceIdNotesByNoteId>>;
export type DefaultServiceDeleteV1CreditBureauIntegrationDeleteCreditReportByCreditBureauIdMutationResult = Awaited<ReturnType<typeof DefaultService.deleteV1CreditBureauIntegrationDeleteCreditReportByCreditBureauId>>;
export type DefaultServiceDeleteV1EmailCampaignByResourceIdMutationResult = Awaited<ReturnType<typeof DefaultService.deleteV1EmailCampaignByResourceId>>;
export type DefaultServiceDeleteV1EmailByResourceIdMutationResult = Awaited<ReturnType<typeof DefaultService.deleteV1EmailByResourceId>>;
export type DefaultServiceDeleteV1InternalExternaleventsMutationResult = Awaited<ReturnType<typeof DefaultService.deleteV1InternalExternalevents>>;
export type DefaultServiceDeleteV1OfficetransactionsByTransactionIdMutationResult = Awaited<ReturnType<typeof DefaultService.deleteV1OfficetransactionsByTransactionId>>;
export type DefaultServiceDeleteV1SmscampaignsByCampaignIdMutationResult = Awaited<ReturnType<typeof DefaultService.deleteV1SmscampaignsByCampaignId>>;
export type DefaultServiceDeleteV1ByEntityByEntityIdImagesMutationResult = Awaited<ReturnType<typeof DefaultService.deleteV1ByEntityByEntityIdImages>>;
export type AccountingRulesServiceDeleteV1AccountingrulesByAccountingRuleIdMutationResult = Awaited<ReturnType<typeof AccountingRulesService.deleteV1AccountingrulesByAccountingRuleId>>;
export type AccountNumberFormatServiceDeleteV1AccountnumberformatsByAccountNumberFormatIdMutationResult = Awaited<ReturnType<typeof AccountNumberFormatService.deleteV1AccountnumberformatsByAccountNumberFormatId>>;
export type AdhocQueryApiServiceDeleteV1AdhocqueryByAdHocIdMutationResult = Awaited<ReturnType<typeof AdhocQueryApiService.deleteV1AdhocqueryByAdHocId>>;
export type CentersServiceDeleteV1CentersByCenterIdMutationResult = Awaited<ReturnType<typeof CentersService.deleteV1CentersByCenterId>>;
export type ChargesServiceDeleteV1ChargesByChargeIdMutationResult = Awaited<ReturnType<typeof ChargesService.deleteV1ChargesByChargeId>>;
export type ClientServiceDeleteV1ClientsExternalIdByExternalIdMutationResult = Awaited<ReturnType<typeof ClientService.deleteV1ClientsExternalIdByExternalId>>;
export type ClientServiceDeleteV1ClientsByClientIdMutationResult = Awaited<ReturnType<typeof ClientService.deleteV1ClientsByClientId>>;
export type ClientChargesServiceDeleteV1ClientsByClientIdChargesByChargeIdMutationResult = Awaited<ReturnType<typeof ClientChargesService.deleteV1ClientsByClientIdChargesByChargeId>>;
export type ClientCollateralManagementServiceDeleteV1ClientsByClientIdCollateralsByCollateralIdMutationResult = Awaited<ReturnType<typeof ClientCollateralManagementService.deleteV1ClientsByClientIdCollateralsByCollateralId>>;
export type ClientFamilyMemberServiceDeleteV1ClientsByClientIdFamilymembersByFamilyMemberIdMutationResult = Awaited<ReturnType<typeof ClientFamilyMemberService.deleteV1ClientsByClientIdFamilymembersByFamilyMemberId>>;
export type ClientIdentifierServiceDeleteV1ClientsByClientIdIdentifiersByIdentifierIdMutationResult = Awaited<ReturnType<typeof ClientIdentifierService.deleteV1ClientsByClientIdIdentifiersByIdentifierId>>;
export type CodesServiceDeleteV1CodesByCodeIdMutationResult = Awaited<ReturnType<typeof CodesService.deleteV1CodesByCodeId>>;
export type CodeValuesServiceDeleteV1CodesByCodeIdCodevaluesByCodeValueIdMutationResult = Awaited<ReturnType<typeof CodeValuesService.deleteV1CodesByCodeIdCodevaluesByCodeValueId>>;
export type CollateralManagementServiceDeleteV1CollateralManagementByCollateralIdMutationResult = Awaited<ReturnType<typeof CollateralManagementService.deleteV1CollateralManagementByCollateralId>>;
export type DataTablesServiceDeleteV1DatatablesByDatatableNameMutationResult = Awaited<ReturnType<typeof DataTablesService.deleteV1DatatablesByDatatableName>>;
export type DataTablesServiceDeleteV1DatatablesByDatatableByApptableIdMutationResult = Awaited<ReturnType<typeof DataTablesService.deleteV1DatatablesByDatatableByApptableId>>;
export type DataTablesServiceDeleteV1DatatablesByDatatableByApptableIdByDatatableIdMutationResult = Awaited<ReturnType<typeof DataTablesService.deleteV1DatatablesByDatatableByApptableIdByDatatableId>>;
export type DelinquencyRangeAndBucketsManagementServiceDeleteV1DelinquencyBucketsByDelinquencyBucketIdMutationResult = Awaited<ReturnType<typeof DelinquencyRangeAndBucketsManagementService.deleteV1DelinquencyBucketsByDelinquencyBucketId>>;
export type DelinquencyRangeAndBucketsManagementServiceDeleteV1DelinquencyRangesByDelinquencyRangeIdMutationResult = Awaited<ReturnType<typeof DelinquencyRangeAndBucketsManagementService.deleteV1DelinquencyRangesByDelinquencyRangeId>>;
export type EntityDataTableServiceDeleteV1EntityDatatableChecksByEntityDatatableCheckIdMutationResult = Awaited<ReturnType<typeof EntityDataTableService.deleteV1EntityDatatableChecksByEntityDatatableCheckId>>;
export type FineractEntityServiceDeleteV1EntitytoentitymappingByMapIdMutationResult = Awaited<ReturnType<typeof FineractEntityService.deleteV1EntitytoentitymappingByMapId>>;
export type MappingFinancialActivitiesToAccountsServiceDeleteV1FinancialactivityaccountsByMappingIdMutationResult = Awaited<ReturnType<typeof MappingFinancialActivitiesToAccountsService.deleteV1FinancialactivityaccountsByMappingId>>;
export type FixedDepositAccountServiceDeleteV1FixeddepositaccountsByAccountIdMutationResult = Awaited<ReturnType<typeof FixedDepositAccountService.deleteV1FixeddepositaccountsByAccountId>>;
export type FixedDepositProductServiceDeleteV1FixeddepositproductsByProductIdMutationResult = Awaited<ReturnType<typeof FixedDepositProductService.deleteV1FixeddepositproductsByProductId>>;
export type GeneralLedgerAccountServiceDeleteV1GlaccountsByGlAccountIdMutationResult = Awaited<ReturnType<typeof GeneralLedgerAccountService.deleteV1GlaccountsByGlAccountId>>;
export type AccountingClosureServiceDeleteV1GlclosuresByGlClosureIdMutationResult = Awaited<ReturnType<typeof AccountingClosureService.deleteV1GlclosuresByGlClosureId>>;
export type GroupsServiceDeleteV1GroupsByGroupIdMutationResult = Awaited<ReturnType<typeof GroupsService.deleteV1GroupsByGroupId>>;
export type HolidaysServiceDeleteV1HolidaysByHolidayIdMutationResult = Awaited<ReturnType<typeof HolidaysService.deleteV1HolidaysByHolidayId>>;
export type HooksServiceDeleteV1HooksByHookIdMutationResult = Awaited<ReturnType<typeof HooksService.deleteV1HooksByHookId>>;
export type InterestRateChartServiceDeleteV1InterestratechartsByChartIdMutationResult = Awaited<ReturnType<typeof InterestRateChartService.deleteV1InterestratechartsByChartId>>;
export type InterestRateSlabAKAInterestBandsServiceDeleteV1InterestratechartsByChartIdChartslabsByChartSlabIdMutationResult = Awaited<ReturnType<typeof InterestRateSlabAKAInterestBandsService.deleteV1InterestratechartsByChartIdChartslabsByChartSlabId>>;
export type InterOperationServiceDeleteV1InteroperationPartiesByIdTypeByIdValueMutationResult = Awaited<ReturnType<typeof InterOperationService.deleteV1InteroperationPartiesByIdTypeByIdValue>>;
export type InterOperationServiceDeleteV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeMutationResult = Awaited<ReturnType<typeof InterOperationService.deleteV1InteroperationPartiesByIdTypeByIdValueBySubIdOrType>>;
export type LoanCollateralManagementServiceDeleteV1LoanCollateralManagementByIdMutationResult = Awaited<ReturnType<typeof LoanCollateralManagementService.deleteV1LoanCollateralManagementById>>;
export type ProductMixServiceDeleteV1LoanproductsByProductIdProductmixMutationResult = Awaited<ReturnType<typeof ProductMixService.deleteV1LoanproductsByProductIdProductmix>>;
export type LoansServiceDeleteV1LoansExternalIdByLoanExternalIdMutationResult = Awaited<ReturnType<typeof LoansService.deleteV1LoansExternalIdByLoanExternalId>>;
export type LoansServiceDeleteV1LoansByLoanIdMutationResult = Awaited<ReturnType<typeof LoansService.deleteV1LoansByLoanId>>;
export type LoanChargesServiceDeleteV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdMutationResult = Awaited<ReturnType<typeof LoanChargesService.deleteV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalId>>;
export type LoanChargesServiceDeleteV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdMutationResult = Awaited<ReturnType<typeof LoanChargesService.deleteV1LoansExternalIdByLoanExternalIdChargesByLoanChargeId>>;
export type LoanChargesServiceDeleteV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdMutationResult = Awaited<ReturnType<typeof LoanChargesService.deleteV1LoansByLoanIdChargesExternalIdByLoanChargeExternalId>>;
export type LoanChargesServiceDeleteV1LoansByLoanIdChargesByLoanChargeIdMutationResult = Awaited<ReturnType<typeof LoanChargesService.deleteV1LoansByLoanIdChargesByLoanChargeId>>;
export type LoanInterestPauseServiceDeleteV1LoansExternalIdByLoanExternalIdInterestPausesByVariationIdMutationResult = Awaited<ReturnType<typeof LoanInterestPauseService.deleteV1LoansExternalIdByLoanExternalIdInterestPausesByVariationId>>;
export type LoanInterestPauseServiceDeleteV1LoansByLoanIdInterestPausesByVariationIdMutationResult = Awaited<ReturnType<typeof LoanInterestPauseService.deleteV1LoansByLoanIdInterestPausesByVariationId>>;
export type LoanCollateralServiceDeleteV1LoansByLoanIdCollateralsByCollateralIdMutationResult = Awaited<ReturnType<typeof LoanCollateralService.deleteV1LoansByLoanIdCollateralsByCollateralId>>;
export type GuarantorsServiceDeleteV1LoansByLoanIdGuarantorsByGuarantorIdMutationResult = Awaited<ReturnType<typeof GuarantorsService.deleteV1LoansByLoanIdGuarantorsByGuarantorId>>;
export type RepaymentWithPostDatedChecksServiceDeleteV1LoansByLoanIdPostdatedchecksByPostDatedCheckIdMutationResult = Awaited<ReturnType<typeof RepaymentWithPostDatedChecksService.deleteV1LoansByLoanIdPostdatedchecksByPostDatedCheckId>>;
export type MakerCheckerOr4EyeFunctionalityServiceDeleteV1MakercheckersByAuditIdMutationResult = Awaited<ReturnType<typeof MakerCheckerOr4EyeFunctionalityService.deleteV1MakercheckersByAuditId>>;
export type PaymentTypeServiceDeleteV1PaymenttypesByPaymentTypeIdMutationResult = Awaited<ReturnType<typeof PaymentTypeService.deleteV1PaymenttypesByPaymentTypeId>>;
export type ProvisioningCategoryServiceDeleteV1ProvisioningcategoryByCategoryIdMutationResult = Awaited<ReturnType<typeof ProvisioningCategoryService.deleteV1ProvisioningcategoryByCategoryId>>;
export type ProvisioningCriteriaServiceDeleteV1ProvisioningcriteriaByCriteriaIdMutationResult = Awaited<ReturnType<typeof ProvisioningCriteriaService.deleteV1ProvisioningcriteriaByCriteriaId>>;
export type RecurringDepositAccountServiceDeleteV1RecurringdepositaccountsByAccountIdMutationResult = Awaited<ReturnType<typeof RecurringDepositAccountService.deleteV1RecurringdepositaccountsByAccountId>>;
export type RecurringDepositProductServiceDeleteV1RecurringdepositproductsByProductIdMutationResult = Awaited<ReturnType<typeof RecurringDepositProductService.deleteV1RecurringdepositproductsByProductId>>;
export type ReportMailingJobsServiceDeleteV1ReportmailingjobsByEntityIdMutationResult = Awaited<ReturnType<typeof ReportMailingJobsService.deleteV1ReportmailingjobsByEntityId>>;
export type ReportsServiceDeleteV1ReportsByIdMutationResult = Awaited<ReturnType<typeof ReportsService.deleteV1ReportsById>>;
export type RolesServiceDeleteV1RolesByRoleIdMutationResult = Awaited<ReturnType<typeof RolesService.deleteV1RolesByRoleId>>;
export type SavingsAccountServiceDeleteV1SavingsaccountsExternalIdByExternalIdMutationResult = Awaited<ReturnType<typeof SavingsAccountService.deleteV1SavingsaccountsExternalIdByExternalId>>;
export type SavingsAccountServiceDeleteV1SavingsaccountsByAccountIdMutationResult = Awaited<ReturnType<typeof SavingsAccountService.deleteV1SavingsaccountsByAccountId>>;
export type SavingsChargesServiceDeleteV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdMutationResult = Awaited<ReturnType<typeof SavingsChargesService.deleteV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeId>>;
export type SavingsProductServiceDeleteV1SavingsproductsByProductIdMutationResult = Awaited<ReturnType<typeof SavingsProductService.deleteV1SavingsproductsByProductId>>;
export type SelfThirdPartyTransferServiceDeleteV1SelfBeneficiariesTptByBeneficiaryIdMutationResult = Awaited<ReturnType<typeof SelfThirdPartyTransferService.deleteV1SelfBeneficiariesTptByBeneficiaryId>>;
export type SelfClientServiceDeleteV1SelfClientsByClientIdImagesMutationResult = Awaited<ReturnType<typeof SelfClientService.deleteV1SelfClientsByClientIdImages>>;
export type DeviceRegistrationServiceDeleteV1SelfDeviceRegistrationByIdMutationResult = Awaited<ReturnType<typeof DeviceRegistrationService.deleteV1SelfDeviceRegistrationById>>;
export type SelfDividendServiceDeleteV1ShareproductByProductIdDividendByDividendIdMutationResult = Awaited<ReturnType<typeof SelfDividendService.deleteV1ShareproductByProductIdDividendByDividendId>>;
export type SmsServiceDeleteV1SmsByResourceIdMutationResult = Awaited<ReturnType<typeof SmsService.deleteV1SmsByResourceId>>;
export type SurveyServiceDeleteV1SurveyBySurveyNameByClientIdByFulfilledIdMutationResult = Awaited<ReturnType<typeof SurveyService.deleteV1SurveyBySurveyNameByClientIdByFulfilledId>>;
export type TellerCashManagementServiceDeleteV1TellersByTellerIdMutationResult = Awaited<ReturnType<typeof TellerCashManagementService.deleteV1TellersByTellerId>>;
export type TellerCashManagementServiceDeleteV1TellersByTellerIdCashiersByCashierIdMutationResult = Awaited<ReturnType<typeof TellerCashManagementService.deleteV1TellersByTellerIdCashiersByCashierId>>;
export type UserGeneratedDocumentsServiceDeleteV1TemplatesByTemplateIdMutationResult = Awaited<ReturnType<typeof UserGeneratedDocumentsService.deleteV1TemplatesByTemplateId>>;
export type UsersServiceDeleteV1UsersByUserIdMutationResult = Awaited<ReturnType<typeof UsersService.deleteV1UsersByUserId>>;
export type CalendarServiceDeleteV1ByEntityTypeByEntityIdCalendarsByCalendarIdMutationResult = Awaited<ReturnType<typeof CalendarService.deleteV1ByEntityTypeByEntityIdCalendarsByCalendarId>>;
export type DocumentsServiceDeleteV1ByEntityTypeByEntityIdDocumentsByDocumentIdMutationResult = Awaited<ReturnType<typeof DocumentsService.deleteV1ByEntityTypeByEntityIdDocumentsByDocumentId>>;
export type MeetingsServiceDeleteV1ByEntityTypeByEntityIdMeetingsByMeetingIdMutationResult = Awaited<ReturnType<typeof MeetingsService.deleteV1ByEntityTypeByEntityIdMeetingsByMeetingId>>;
export type NotesServiceDeleteV1ByResourceTypeByResourceIdNotesByNoteIdMutationResult = Awaited<ReturnType<typeof NotesService.deleteV1ByResourceTypeByResourceIdNotesByNoteId>>;
