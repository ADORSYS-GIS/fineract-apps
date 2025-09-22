// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { AccountNumberFormatService, AccountTransfersService, AccountingClosureService, AccountingRulesService, AdhocQueryApiService, AuditsService, AuthenticationHttpBasicService, BatchApiService, BulkImportService, BulkLoansService, BusinessDateManagementService, BusinessStepConfigurationService, CacheService, CalendarService, CashierJournalsService, CashiersService, CentersService, ChargesService, ClientChargesService, ClientCollateralManagementService, ClientFamilyMemberService, ClientIdentifierService, ClientSearchV2Service, ClientService, ClientTransactionService, ClientsAddressService, CodeValuesService, CodesService, CollateralManagementService, CollectionSheetService, CreditBureauConfigurationService, CurrencyService, DataTablesService, DefaultService, DelinquencyRangeAndBucketsManagementService, DepositAccountOnHoldFundTransactionsService, DeviceRegistrationService, DocumentsService, EntityDataTableService, EntityFieldConfigurationService, ExternalAssetOwnerLoanProductAttributesService, ExternalAssetOwnersService, ExternalEventConfigurationService, ExternalServicesService, FetchAuthenticatedUserDetailsService, FineractEntityService, FixedDepositAccountService, FixedDepositAccountTransactionsService, FixedDepositProductService, FloatingRatesService, FundsService, GeneralLedgerAccountService, GlobalConfigurationService, GroupsLevelService, GroupsService, GuarantorsService, HolidaysService, HooksService, InlineJobService, InstanceModeService, InterOperationService, InterestRateChartService, InterestRateSlabAKAInterestBandsService, JournalEntriesService, LikelihoodService, ListReportMailingJobHistoryService, LoanAccountLockService, LoanBuyDownFeesService, LoanCapitalizedIncomeService, LoanChargesService, LoanCobCatchUpService, LoanCollateralManagementService, LoanCollateralService, LoanDisbursementDetailsService, LoanInterestPauseService, LoanProductsService, LoanReschedulingService, LoanTransactionsService, LoansPointInTimeService, LoansService, MakerCheckerOr4EyeFunctionalityService, MappingFinancialActivitiesToAccountsService, MeetingsService, MixMappingService, MixReportService, MixTaxonomyService, NotesService, NotificationService, OfficesService, PasswordPreferencesService, PaymentTypeService, PeriodicAccrualAccountingService, PermissionsService, PocketService, PovertyLineService, ProductMixService, ProductsService, ProgressiveLoanService, ProvisioningCategoryService, ProvisioningCriteriaService, ProvisioningEntriesService, RateService, RecurringDepositAccountService, RecurringDepositAccountTransactionsService, RecurringDepositProductService, RepaymentWithPostDatedChecksService, ReportMailingJobsService, ReportsService, RescheduleLoansService, RolesService, RunReportsService, SavingsAccountService, SavingsAccountTransactionsService, SavingsChargesService, SavingsProductService, SchedulerJobService, SchedulerService, ScoreCardService, SearchApiService, SelfAccountTransferService, SelfAuthenticationService, SelfClientService, SelfDividendService, SelfLoanProductsService, SelfLoansService, SelfRunReportService, SelfSavingsAccountService, SelfSavingsProductsService, SelfScoreCardService, SelfServiceRegistrationService, SelfShareAccountsService, SelfShareProductsService, SelfSpmService, SelfThirdPartyTransferService, SelfUserDetailsService, SelfUserService, ShareAccountService, SmsService, SpmApiLookUpTableService, SpmSurveysService, StaffService, StandingInstructionsHistoryService, StandingInstructionsService, SurveyService, TaxComponentsService, TaxGroupService, TellerCashManagementService, TwoFactorService, UserGeneratedDocumentsService, UsersService, WorkingDaysService } from "../requests/services.gen";
import { AccountRequest, AccountRuleRequest, AccountTransferRequest, AdHocRequest, BatchRequest, BusinessDateUpdateRequest, BusinessStepRequest, CacheSwitchRequest, CalendarRequest, ChangeInstanceModeRequest, ChangePwdUsersUserIdRequest, ChargeRequest, ClientAddressRequest, ClientCollateralRequest, ClientFamilyMemberRequest, ClientIdentifierRequest, CollateralManagementProductRequest, CollateralProductRequest, CollectionSheetRequest, CommandWrapper, CurrencyUpdateRequest, DateParam, DelinquencyBucketRequest, DelinquencyRangeRequest, DocumentUploadRequest, ExecuteJobRequest, ExternalAssetOwnerRequest, ExternalEventConfigurationUpdateRequest, FloatingRateRequest, FundRequest, GuarantorsRequest, InlineJobRequest, InterestPauseRequestDto, InterestRateChartStabRequest, InteropIdentifierRequestData, InteropQuoteRequestData, InteropTransactionRequestData, InteropTransferRequestData, JournalEntryCommand, LoansLoanIdCollateralsRequest, LoansLoandIdCollateralsCollateralIdRequest, LookupTableData, MixTaxonomyRequest, NoteRequest, PagedLocalRequestAdvancedQueryData, PagedLocalRequestAdvancedQueryRequest, PagedRequestClientTextSearch, PagedRequestExternalAssetOwnerSearchRequest, PaymentTypeRequest, PostAccountNumberFormatsRequest, PostAccountsTypeAccountIdRequest, PostAddAndDeleteDisbursementDetailRequest, PostAdhocQuerySearchRequest, PostAuthenticationRequest, PostCentersCenterIdRequest, PostCentersRequest, PostClientsClientIdChargesChargeIdRequest, PostClientsClientIdChargesRequest, PostClientsClientIdIdentifiersRequest, PostClientsClientIdRequest, PostClientsRequest, PostCodeValuesDataRequest, PostCodesRequest, PostCreateRescheduleLoansRequest, PostDataTablesRegisterDatatableAppTable, PostDataTablesRequest, PostEntityDatatableChecksTemplateRequest, PostExternalAssetOwnerLoanProductAttributeRequest, PostFinancialActivityAccountsRequest, PostFixedDepositAccountsAccountIdRequest, PostFixedDepositAccountsRequest, PostFixedDepositProductsRequest, PostGLAccountsRequest, PostGlClosuresRequest, PostGroupsGroupIdCommandUnassignStaffRequest, PostGroupsGroupIdRequest, PostGroupsRequest, PostHolidaysHolidayIdRequest, PostHolidaysRequest, PostHookRequest, PostInterestRateChartsRequest, PostJournalEntriesTransactionIdRequest, PostLoanProductsRequest, PostLoansDelinquencyActionRequest, PostLoansLoanIdChargesChargeIdRequest, PostLoansLoanIdChargesRequest, PostLoansLoanIdRequest, PostLoansLoanIdScheduleRequest, PostLoansLoanIdTransactionsRequest, PostLoansLoanIdTransactionsTransactionIdRequest, PostLoansRequest, PostOfficesRequest, PostProductsTypeRequest, PostProvisioningCriteriaRequest, PostRecurringDepositAccountsAccountIdRequest, PostRecurringDepositAccountsRecurringDepositAccountIdTransactionsRequest, PostRecurringDepositAccountsRequest, PostRecurringDepositProductsRequest, PostReportMailingJobsRequest, PostRepostRequest, PostRolesRequest, PostRunaccrualsRequest, PostSavingsAccountBulkReversalTransactionsRequest, PostSavingsAccountTransactionsRequest, PostSavingsAccountsAccountIdRequest, PostSavingsAccountsRequest, PostSavingsAccountsSavingsAccountIdChargesRequest, PostSavingsAccountsSavingsAccountIdChargesSavingsAccountChargeIdRequest, PostSavingsProductsRequest, PostSelfBeneficiariesTPTRequest, PostSelfLoansLoanIdRequest, PostSelfLoansRequest, PostSurveySurveyNameApptableIdRequest, PostTaxesComponentsRequest, PostTaxesGroupRequest, PostTellersRequest, PostTellersTellerIdCashiersCashierIdAllocateRequest, PostTellersTellerIdCashiersCashierIdSettleRequest, PostTellersTellerIdCashiersRequest, PostTemplatesRequest, PostUpdateRescheduleLoansRequest, PostUsersRequest, ProductMixRequest, ProvisionEntryRequest, PutAccountNumberFormatsRequest, PutAccountsTypeAccountIdRequest, PutCentersCenterIdRequest, PutChargeTransactionChangesRequest, PutClientsClientIdRequest, PutCodeValuesDataRequest, PutCodesRequest, PutDataTablesRequest, PutExternalAssetOwnerLoanProductAttributeRequest, PutExternalServiceRequest, PutFixedDepositAccountsAccountIdRequest, PutFixedDepositProductsProductIdRequest, PutGLAccountsRequest, PutGlClosuresRequest, PutGlobalConfigurationsRequest, PutGroupsGroupIdRequest, PutHolidaysHolidayIdRequest, PutHookRequest, PutInterestRateChartsChartIdRequest, PutJobsJobIDRequest, PutLoanProductsProductIdRequest, PutLoansApprovedAmountRequest, PutLoansAvailableDisbursementAmountRequest, PutLoansLoanIdChargesChargeIdRequest, PutLoansLoanIdRequest, PutOfficesOfficeIdRequest, PutPasswordPreferencesTemplateRequest, PutPaymentTypesPaymentTypeIdRequest, PutPermissionsRequest, PutProductsTypeProductIdRequest, PutProvisioningCriteriaRequest, PutProvisioningEntriesRequest, PutRecurringDepositAccountsAccountIdRequest, PutRecurringDepositProductsRequest, PutReportMailingJobsRequest, PutReportRequest, PutRolesRoleIdPermissionsRequest, PutRolesRoleIdRequest, PutSavingsAccountsAccountIdRequest, PutSavingsAccountsSavingsAccountIdChargesSavingsAccountChargeIdRequest, PutSavingsProductsProductIdRequest, PutSelfBeneficiariesTPTBeneficiaryIdRequest, PutSelfLoansLoanIdRequest, PutSelfUserRequest, PutStaffRequest, PutTaxesComponentsTaxComponentIdRequest, PutTaxesGroupTaxGroupIdRequest, PutTellersRequest, PutTellersTellerIdCashiersCashierIdRequest, PutTemplatesTemplateIdRequest, PutUsersUserIdRequest, PutWorkingDaysRequest, RateRequest, RetrieveLoansPointInTimeExternalIdsRequest, RetrieveLoansPointInTimeRequest, ScorecardData, SmsCampaignPreviewDto, SmsCreationRequest, SmsUpdateRequest, StaffRequest, StandingInstructionCreationRequest, StandingInstructionUpdatesRequest, SurveyData, TransactionType, UpdateClientCollateralRequest, UpdatePostDatedCheckRequest, UploadRequest } from "../requests/types.gen";
import * as Common from "./common";
export const useDefaultServiceGetApplicationWadl = <TData = Common.DefaultServiceGetApplicationWadlDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetApplicationWadlKeyFn(queryKey), queryFn: () => DefaultService.getApplicationWadl() as TData, ...options });
export const useDefaultServiceGetApplicationWadlByPath = <TData = Common.DefaultServiceGetApplicationWadlByPathDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ path }: {
  path: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetApplicationWadlByPathKeyFn({ path }, queryKey), queryFn: () => DefaultService.getApplicationWadlByPath({ path }) as TData, ...options });
export const useDefaultServiceGetV1CreditBureauIntegrationCreditReportByCreditBureauId = <TData = Common.DefaultServiceGetV1CreditBureauIntegrationCreditReportByCreditBureauIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ creditBureauId }: {
  creditBureauId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1CreditBureauIntegrationCreditReportByCreditBureauIdKeyFn({ creditBureauId }, queryKey), queryFn: () => DefaultService.getV1CreditBureauIntegrationCreditReportByCreditBureauId({ creditBureauId }) as TData, ...options });
export const useDefaultServiceGetV1Echo = <TData = Common.DefaultServiceGetV1EchoDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EchoKeyFn(queryKey), queryFn: () => DefaultService.getV1Echo() as TData, ...options });
export const useDefaultServiceGetV1Email = <TData = Common.DefaultServiceGetV1EmailDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailKeyFn(queryKey), queryFn: () => DefaultService.getV1Email() as TData, ...options });
export const useDefaultServiceGetV1EmailCampaign = <TData = Common.DefaultServiceGetV1EmailCampaignDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailCampaignKeyFn(queryKey), queryFn: () => DefaultService.getV1EmailCampaign() as TData, ...options });
export const useDefaultServiceGetV1EmailCampaignTemplate = <TData = Common.DefaultServiceGetV1EmailCampaignTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailCampaignTemplateKeyFn(queryKey), queryFn: () => DefaultService.getV1EmailCampaignTemplate() as TData, ...options });
export const useDefaultServiceGetV1EmailCampaignTemplateByResourceId = <TData = Common.DefaultServiceGetV1EmailCampaignTemplateByResourceIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailCampaignTemplateByResourceIdKeyFn({ resourceId }, queryKey), queryFn: () => DefaultService.getV1EmailCampaignTemplateByResourceId({ resourceId }) as TData, ...options });
export const useDefaultServiceGetV1EmailCampaignByResourceId = <TData = Common.DefaultServiceGetV1EmailCampaignByResourceIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailCampaignByResourceIdKeyFn({ resourceId }, queryKey), queryFn: () => DefaultService.getV1EmailCampaignByResourceId({ resourceId }) as TData, ...options });
export const useDefaultServiceGetV1EmailConfiguration = <TData = Common.DefaultServiceGetV1EmailConfigurationDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailConfigurationKeyFn(queryKey), queryFn: () => DefaultService.getV1EmailConfiguration() as TData, ...options });
export const useDefaultServiceGetV1EmailFailedEmail = <TData = Common.DefaultServiceGetV1EmailFailedEmailDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailFailedEmailKeyFn({ limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => DefaultService.getV1EmailFailedEmail({ limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useDefaultServiceGetV1EmailMessageByStatus = <TData = Common.DefaultServiceGetV1EmailMessageByStatusDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }: {
  dateFormat?: string;
  fromDate?: DateParam;
  limit?: number;
  locale?: string;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  status?: number;
  toDate?: DateParam;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailMessageByStatusKeyFn({ dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }, queryKey), queryFn: () => DefaultService.getV1EmailMessageByStatus({ dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }) as TData, ...options });
export const useDefaultServiceGetV1EmailPendingEmail = <TData = Common.DefaultServiceGetV1EmailPendingEmailDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailPendingEmailKeyFn({ limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => DefaultService.getV1EmailPendingEmail({ limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useDefaultServiceGetV1EmailSentEmail = <TData = Common.DefaultServiceGetV1EmailSentEmailDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailSentEmailKeyFn({ limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => DefaultService.getV1EmailSentEmail({ limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useDefaultServiceGetV1EmailByResourceId = <TData = Common.DefaultServiceGetV1EmailByResourceIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1EmailByResourceIdKeyFn({ resourceId }, queryKey), queryFn: () => DefaultService.getV1EmailByResourceId({ resourceId }) as TData, ...options });
export const useDefaultServiceGetV1InternalClientByClientIdAudit = <TData = Common.DefaultServiceGetV1InternalClientByClientIdAuditDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1InternalClientByClientIdAuditKeyFn({ clientId }, queryKey), queryFn: () => DefaultService.getV1InternalClientByClientIdAudit({ clientId }) as TData, ...options });
export const useDefaultServiceGetV1InternalCobPartitionsByPartitionSize = <TData = Common.DefaultServiceGetV1InternalCobPartitionsByPartitionSizeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ partitionSize }: {
  partitionSize: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1InternalCobPartitionsByPartitionSizeKeyFn({ partitionSize }, queryKey), queryFn: () => DefaultService.getV1InternalCobPartitionsByPartitionSize({ partitionSize }) as TData, ...options });
export const useDefaultServiceGetV1InternalExternalevents = <TData = Common.DefaultServiceGetV1InternalExternaleventsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ aggregateRootId, category, idempotencyKey, type }: {
  aggregateRootId?: number;
  category?: string;
  idempotencyKey?: string;
  type?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1InternalExternaleventsKeyFn({ aggregateRootId, category, idempotencyKey, type }, queryKey), queryFn: () => DefaultService.getV1InternalExternalevents({ aggregateRootId, category, idempotencyKey, type }) as TData, ...options });
export const useDefaultServiceGetV1InternalLoanStatusByStatusId = <TData = Common.DefaultServiceGetV1InternalLoanStatusByStatusIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ statusId }: {
  statusId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1InternalLoanStatusByStatusIdKeyFn({ statusId }, queryKey), queryFn: () => DefaultService.getV1InternalLoanStatusByStatusId({ statusId }) as TData, ...options });
export const useDefaultServiceGetV1InternalLoanByLoanIdAdvancedPaymentAllocationRules = <TData = Common.DefaultServiceGetV1InternalLoanByLoanIdAdvancedPaymentAllocationRulesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1InternalLoanByLoanIdAdvancedPaymentAllocationRulesKeyFn({ loanId }, queryKey), queryFn: () => DefaultService.getV1InternalLoanByLoanIdAdvancedPaymentAllocationRules({ loanId }) as TData, ...options });
export const useDefaultServiceGetV1InternalLoanByLoanIdAudit = <TData = Common.DefaultServiceGetV1InternalLoanByLoanIdAuditDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1InternalLoanByLoanIdAuditKeyFn({ loanId }, queryKey), queryFn: () => DefaultService.getV1InternalLoanByLoanIdAudit({ loanId }) as TData, ...options });
export const useDefaultServiceGetV1InternalLoanByLoanIdTransactionByTransactionIdAudit = <TData = Common.DefaultServiceGetV1InternalLoanByLoanIdTransactionByTransactionIdAuditDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId, transactionId }: {
  loanId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1InternalLoanByLoanIdTransactionByTransactionIdAuditKeyFn({ loanId, transactionId }, queryKey), queryFn: () => DefaultService.getV1InternalLoanByLoanIdTransactionByTransactionIdAudit({ loanId, transactionId }) as TData, ...options });
export const useDefaultServiceGetV1Officetransactions = <TData = Common.DefaultServiceGetV1OfficetransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1OfficetransactionsKeyFn(queryKey), queryFn: () => DefaultService.getV1Officetransactions() as TData, ...options });
export const useDefaultServiceGetV1OfficetransactionsTemplate = <TData = Common.DefaultServiceGetV1OfficetransactionsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1OfficetransactionsTemplateKeyFn(queryKey), queryFn: () => DefaultService.getV1OfficetransactionsTemplate() as TData, ...options });
export const useDefaultServiceGetV1Smscampaigns = <TData = Common.DefaultServiceGetV1SmscampaignsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1SmscampaignsKeyFn({ limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => DefaultService.getV1Smscampaigns({ limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useDefaultServiceGetV1SmscampaignsTemplate = <TData = Common.DefaultServiceGetV1SmscampaignsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1SmscampaignsTemplateKeyFn(queryKey), queryFn: () => DefaultService.getV1SmscampaignsTemplate() as TData, ...options });
export const useDefaultServiceGetV1SmscampaignsByResourceId = <TData = Common.DefaultServiceGetV1SmscampaignsByResourceIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1SmscampaignsByResourceIdKeyFn({ resourceId }, queryKey), queryFn: () => DefaultService.getV1SmscampaignsByResourceId({ resourceId }) as TData, ...options });
export const useDefaultServiceGetV1TwofactorConfigure = <TData = Common.DefaultServiceGetV1TwofactorConfigureDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1TwofactorConfigureKeyFn(queryKey), queryFn: () => DefaultService.getV1TwofactorConfigure() as TData, ...options });
export const useDefaultServiceGetV1ByEntityByEntityIdImages = <TData = Common.DefaultServiceGetV1ByEntityByEntityIdImagesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accept, entity, entityId, maxHeight, maxWidth, output }: {
  accept?: string;
  entity: string;
  entityId: number;
  maxHeight?: number;
  maxWidth?: number;
  output?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDefaultServiceGetV1ByEntityByEntityIdImagesKeyFn({ accept, entity, entityId, maxHeight, maxWidth, output }, queryKey), queryFn: () => DefaultService.getV1ByEntityByEntityIdImages({ accept, entity, entityId, maxHeight, maxWidth, output }) as TData, ...options });
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfiguration = <TData = Common.CreditBureauConfigurationServiceGetV1CreditBureauConfigurationDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationKeyFn(queryKey), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfiguration() as TData, ...options });
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationConfigByOrganisationCreditBureauId = <TData = Common.CreditBureauConfigurationServiceGetV1CreditBureauConfigurationConfigByOrganisationCreditBureauIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ organisationCreditBureauId }: {
  organisationCreditBureauId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationConfigByOrganisationCreditBureauIdKeyFn({ organisationCreditBureauId }, queryKey), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationConfigByOrganisationCreditBureauId({ organisationCreditBureauId }) as TData, ...options });
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProduct = <TData = Common.CreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductKeyFn(queryKey), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationLoanProduct() as TData, ...options });
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductByLoanProductId = <TData = Common.CreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductByLoanProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanProductId }: {
  loanProductId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductByLoanProductIdKeyFn({ loanProductId }, queryKey), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationLoanProductByLoanProductId({ loanProductId }) as TData, ...options });
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationMappings = <TData = Common.CreditBureauConfigurationServiceGetV1CreditBureauConfigurationMappingsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationMappingsKeyFn(queryKey), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationMappings() as TData, ...options });
export const useCreditBureauConfigurationServiceGetV1CreditBureauConfigurationOrganisationCreditBureau = <TData = Common.CreditBureauConfigurationServiceGetV1CreditBureauConfigurationOrganisationCreditBureauDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationOrganisationCreditBureauKeyFn(queryKey), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationOrganisationCreditBureau() as TData, ...options });
export const useAccountingRulesServiceGetV1Accountingrules = <TData = Common.AccountingRulesServiceGetV1AccountingrulesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAccountingRulesServiceGetV1AccountingrulesKeyFn(queryKey), queryFn: () => AccountingRulesService.getV1Accountingrules() as TData, ...options });
export const useAccountingRulesServiceGetV1AccountingrulesTemplate = <TData = Common.AccountingRulesServiceGetV1AccountingrulesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAccountingRulesServiceGetV1AccountingrulesTemplateKeyFn(queryKey), queryFn: () => AccountingRulesService.getV1AccountingrulesTemplate() as TData, ...options });
export const useAccountingRulesServiceGetV1AccountingrulesByAccountingRuleId = <TData = Common.AccountingRulesServiceGetV1AccountingrulesByAccountingRuleIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountingRuleId }: {
  accountingRuleId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAccountingRulesServiceGetV1AccountingrulesByAccountingRuleIdKeyFn({ accountingRuleId }, queryKey), queryFn: () => AccountingRulesService.getV1AccountingrulesByAccountingRuleId({ accountingRuleId }) as TData, ...options });
export const useAccountNumberFormatServiceGetV1Accountnumberformats = <TData = Common.AccountNumberFormatServiceGetV1AccountnumberformatsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAccountNumberFormatServiceGetV1AccountnumberformatsKeyFn(queryKey), queryFn: () => AccountNumberFormatService.getV1Accountnumberformats() as TData, ...options });
export const useAccountNumberFormatServiceGetV1AccountnumberformatsTemplate = <TData = Common.AccountNumberFormatServiceGetV1AccountnumberformatsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAccountNumberFormatServiceGetV1AccountnumberformatsTemplateKeyFn(queryKey), queryFn: () => AccountNumberFormatService.getV1AccountnumberformatsTemplate() as TData, ...options });
export const useAccountNumberFormatServiceGetV1AccountnumberformatsByAccountNumberFormatId = <TData = Common.AccountNumberFormatServiceGetV1AccountnumberformatsByAccountNumberFormatIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountNumberFormatId }: {
  accountNumberFormatId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAccountNumberFormatServiceGetV1AccountnumberformatsByAccountNumberFormatIdKeyFn({ accountNumberFormatId }, queryKey), queryFn: () => AccountNumberFormatService.getV1AccountnumberformatsByAccountNumberFormatId({ accountNumberFormatId }) as TData, ...options });
export const useShareAccountServiceGetV1AccountsByType = <TData = Common.ShareAccountServiceGetV1AccountsByTypeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, type }: {
  limit?: number;
  offset?: number;
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseShareAccountServiceGetV1AccountsByTypeKeyFn({ limit, offset, type }, queryKey), queryFn: () => ShareAccountService.getV1AccountsByType({ limit, offset, type }) as TData, ...options });
export const useShareAccountServiceGetV1AccountsByTypeDownloadtemplate = <TData = Common.ShareAccountServiceGetV1AccountsByTypeDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId, type }: {
  dateFormat?: string;
  officeId?: number;
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseShareAccountServiceGetV1AccountsByTypeDownloadtemplateKeyFn({ dateFormat, officeId, type }, queryKey), queryFn: () => ShareAccountService.getV1AccountsByTypeDownloadtemplate({ dateFormat, officeId, type }) as TData, ...options });
export const useShareAccountServiceGetV1AccountsByTypeTemplate = <TData = Common.ShareAccountServiceGetV1AccountsByTypeTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, productId, type }: {
  clientId?: number;
  productId?: number;
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseShareAccountServiceGetV1AccountsByTypeTemplateKeyFn({ clientId, productId, type }, queryKey), queryFn: () => ShareAccountService.getV1AccountsByTypeTemplate({ clientId, productId, type }) as TData, ...options });
export const useShareAccountServiceGetV1AccountsByTypeByAccountId = <TData = Common.ShareAccountServiceGetV1AccountsByTypeByAccountIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, type }: {
  accountId: number;
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseShareAccountServiceGetV1AccountsByTypeByAccountIdKeyFn({ accountId, type }, queryKey), queryFn: () => ShareAccountService.getV1AccountsByTypeByAccountId({ accountId, type }) as TData, ...options });
export const useAccountTransfersServiceGetV1Accounttransfers = <TData = Common.AccountTransfersServiceGetV1AccounttransfersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountDetailId, externalId, limit, offset, orderBy, sortOrder }: {
  accountDetailId?: number;
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAccountTransfersServiceGetV1AccounttransfersKeyFn({ accountDetailId, externalId, limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => AccountTransfersService.getV1Accounttransfers({ accountDetailId, externalId, limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useAccountTransfersServiceGetV1AccounttransfersTemplate = <TData = Common.AccountTransfersServiceGetV1AccounttransfersTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }: {
  fromAccountId?: number;
  fromAccountType?: number;
  fromClientId?: number;
  fromOfficeId?: number;
  toAccountId?: number;
  toAccountType?: number;
  toClientId?: number;
  toOfficeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAccountTransfersServiceGetV1AccounttransfersTemplateKeyFn({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }, queryKey), queryFn: () => AccountTransfersService.getV1AccounttransfersTemplate({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }) as TData, ...options });
export const useAccountTransfersServiceGetV1AccounttransfersTemplateRefundByTransfer = <TData = Common.AccountTransfersServiceGetV1AccounttransfersTemplateRefundByTransferDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }: {
  fromAccountId?: number;
  fromAccountType?: number;
  fromClientId?: number;
  fromOfficeId?: number;
  toAccountId?: number;
  toAccountType?: number;
  toClientId?: number;
  toOfficeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAccountTransfersServiceGetV1AccounttransfersTemplateRefundByTransferKeyFn({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }, queryKey), queryFn: () => AccountTransfersService.getV1AccounttransfersTemplateRefundByTransfer({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }) as TData, ...options });
export const useAccountTransfersServiceGetV1AccounttransfersByTransferId = <TData = Common.AccountTransfersServiceGetV1AccounttransfersByTransferIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ transferId }: {
  transferId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAccountTransfersServiceGetV1AccounttransfersByTransferIdKeyFn({ transferId }, queryKey), queryFn: () => AccountTransfersService.getV1AccounttransfersByTransferId({ transferId }) as TData, ...options });
export const useAdhocQueryApiServiceGetV1Adhocquery = <TData = Common.AdhocQueryApiServiceGetV1AdhocqueryDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAdhocQueryApiServiceGetV1AdhocqueryKeyFn(queryKey), queryFn: () => AdhocQueryApiService.getV1Adhocquery() as TData, ...options });
export const useAdhocQueryApiServiceGetV1AdhocqueryTemplate = <TData = Common.AdhocQueryApiServiceGetV1AdhocqueryTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAdhocQueryApiServiceGetV1AdhocqueryTemplateKeyFn(queryKey), queryFn: () => AdhocQueryApiService.getV1AdhocqueryTemplate() as TData, ...options });
export const useAdhocQueryApiServiceGetV1AdhocqueryByAdHocId = <TData = Common.AdhocQueryApiServiceGetV1AdhocqueryByAdHocIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ adHocId }: {
  adHocId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAdhocQueryApiServiceGetV1AdhocqueryByAdHocIdKeyFn({ adHocId }, queryKey), queryFn: () => AdhocQueryApiService.getV1AdhocqueryByAdHocId({ adHocId }) as TData, ...options });
export const useAuditsServiceGetV1Audits = <TData = Common.AuditsServiceGetV1AuditsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ actionName, checkerDateTimeFrom, checkerDateTimeTo, checkerId, clientId, dateFormat, entityName, groupId, limit, loanId, locale, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, offset, orderBy, paged, processingResult, resourceId, savingsAccountId, sortOrder, status }: {
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
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAuditsServiceGetV1AuditsKeyFn({ actionName, checkerDateTimeFrom, checkerDateTimeTo, checkerId, clientId, dateFormat, entityName, groupId, limit, loanId, locale, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, offset, orderBy, paged, processingResult, resourceId, savingsAccountId, sortOrder, status }, queryKey), queryFn: () => AuditsService.getV1Audits({ actionName, checkerDateTimeFrom, checkerDateTimeTo, checkerId, clientId, dateFormat, entityName, groupId, limit, loanId, locale, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, offset, orderBy, paged, processingResult, resourceId, savingsAccountId, sortOrder, status }) as TData, ...options });
export const useAuditsServiceGetV1AuditsSearchtemplate = <TData = Common.AuditsServiceGetV1AuditsSearchtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAuditsServiceGetV1AuditsSearchtemplateKeyFn(queryKey), queryFn: () => AuditsService.getV1AuditsSearchtemplate() as TData, ...options });
export const useAuditsServiceGetV1AuditsByAuditId = <TData = Common.AuditsServiceGetV1AuditsByAuditIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ auditId }: {
  auditId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAuditsServiceGetV1AuditsByAuditIdKeyFn({ auditId }, queryKey), queryFn: () => AuditsService.getV1AuditsByAuditId({ auditId }) as TData, ...options });
export const useBusinessDateManagementServiceGetV1Businessdate = <TData = Common.BusinessDateManagementServiceGetV1BusinessdateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseBusinessDateManagementServiceGetV1BusinessdateKeyFn(queryKey), queryFn: () => BusinessDateManagementService.getV1Businessdate() as TData, ...options });
export const useBusinessDateManagementServiceGetV1BusinessdateByType = <TData = Common.BusinessDateManagementServiceGetV1BusinessdateByTypeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ type }: {
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseBusinessDateManagementServiceGetV1BusinessdateByTypeKeyFn({ type }, queryKey), queryFn: () => BusinessDateManagementService.getV1BusinessdateByType({ type }) as TData, ...options });
export const useCacheServiceGetV1Caches = <TData = Common.CacheServiceGetV1CachesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCacheServiceGetV1CachesKeyFn(queryKey), queryFn: () => CacheService.getV1Caches() as TData, ...options });
export const useCashiersServiceGetV1Cashiers = <TData = Common.CashiersServiceGetV1CashiersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ date, officeId, staffId, tellerId }: {
  date?: string;
  officeId?: number;
  staffId?: number;
  tellerId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCashiersServiceGetV1CashiersKeyFn({ date, officeId, staffId, tellerId }, queryKey), queryFn: () => CashiersService.getV1Cashiers({ date, officeId, staffId, tellerId }) as TData, ...options });
export const useCashierJournalsServiceGetV1Cashiersjournal = <TData = Common.CashierJournalsServiceGetV1CashiersjournalDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ cashierId, dateRange, officeId, tellerId }: {
  cashierId?: number;
  dateRange?: string;
  officeId?: number;
  tellerId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCashierJournalsServiceGetV1CashiersjournalKeyFn({ cashierId, dateRange, officeId, tellerId }, queryKey), queryFn: () => CashierJournalsService.getV1Cashiersjournal({ cashierId, dateRange, officeId, tellerId }) as TData, ...options });
export const useCentersServiceGetV1Centers = <TData = Common.CentersServiceGetV1CentersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, externalId, limit, locale, meetingDate, name, officeId, offset, orderBy, paged, sortOrder, staffId, underHierarchy }: {
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
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCentersServiceGetV1CentersKeyFn({ dateFormat, externalId, limit, locale, meetingDate, name, officeId, offset, orderBy, paged, sortOrder, staffId, underHierarchy }, queryKey), queryFn: () => CentersService.getV1Centers({ dateFormat, externalId, limit, locale, meetingDate, name, officeId, offset, orderBy, paged, sortOrder, staffId, underHierarchy }) as TData, ...options });
export const useCentersServiceGetV1CentersDownloadtemplate = <TData = Common.CentersServiceGetV1CentersDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCentersServiceGetV1CentersDownloadtemplateKeyFn({ dateFormat, officeId, staffId }, queryKey), queryFn: () => CentersService.getV1CentersDownloadtemplate({ dateFormat, officeId, staffId }) as TData, ...options });
export const useCentersServiceGetV1CentersTemplate = <TData = Common.CentersServiceGetV1CentersTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ command, officeId, staffInSelectedOfficeOnly }: {
  command?: string;
  officeId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCentersServiceGetV1CentersTemplateKeyFn({ command, officeId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => CentersService.getV1CentersTemplate({ command, officeId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useCentersServiceGetV1CentersByCenterId = <TData = Common.CentersServiceGetV1CentersByCenterIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ centerId, staffInSelectedOfficeOnly }: {
  centerId: number;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCentersServiceGetV1CentersByCenterIdKeyFn({ centerId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => CentersService.getV1CentersByCenterId({ centerId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useCentersServiceGetV1CentersByCenterIdAccounts = <TData = Common.CentersServiceGetV1CentersByCenterIdAccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ centerId }: {
  centerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCentersServiceGetV1CentersByCenterIdAccountsKeyFn({ centerId }, queryKey), queryFn: () => CentersService.getV1CentersByCenterIdAccounts({ centerId }) as TData, ...options });
export const useChargesServiceGetV1Charges = <TData = Common.ChargesServiceGetV1ChargesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseChargesServiceGetV1ChargesKeyFn(queryKey), queryFn: () => ChargesService.getV1Charges() as TData, ...options });
export const useChargesServiceGetV1ChargesTemplate = <TData = Common.ChargesServiceGetV1ChargesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseChargesServiceGetV1ChargesTemplateKeyFn(queryKey), queryFn: () => ChargesService.getV1ChargesTemplate() as TData, ...options });
export const useChargesServiceGetV1ChargesByChargeId = <TData = Common.ChargesServiceGetV1ChargesByChargeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chargeId }: {
  chargeId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseChargesServiceGetV1ChargesByChargeIdKeyFn({ chargeId }, queryKey), queryFn: () => ChargesService.getV1ChargesByChargeId({ chargeId }) as TData, ...options });
export const useClientsAddressServiceGetV1ClientAddressesTemplate = <TData = Common.ClientsAddressServiceGetV1ClientAddressesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientsAddressServiceGetV1ClientAddressesTemplateKeyFn(queryKey), queryFn: () => ClientsAddressService.getV1ClientAddressesTemplate() as TData, ...options });
export const useClientsAddressServiceGetV1ClientByClientidAddresses = <TData = Common.ClientsAddressServiceGetV1ClientByClientidAddressesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientid, status, type }: {
  clientid: number;
  status?: string;
  type?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientsAddressServiceGetV1ClientByClientidAddressesKeyFn({ clientid, status, type }, queryKey), queryFn: () => ClientsAddressService.getV1ClientByClientidAddresses({ clientid, status, type }) as TData, ...options });
export const useClientServiceGetV1Clients = <TData = Common.ClientServiceGetV1ClientsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ displayName, externalId, firstName, lastName, legalForm, limit, officeId, offset, orderBy, orphansOnly, sortOrder, status, underHierarchy }: {
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
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsKeyFn({ displayName, externalId, firstName, lastName, legalForm, limit, officeId, offset, orderBy, orphansOnly, sortOrder, status, underHierarchy }, queryKey), queryFn: () => ClientService.getV1Clients({ displayName, externalId, firstName, lastName, legalForm, limit, officeId, offset, orderBy, orphansOnly, sortOrder, status, underHierarchy }) as TData, ...options });
export const useClientServiceGetV1ClientsDownloadtemplate = <TData = Common.ClientServiceGetV1ClientsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, legalFormType, officeId, staffId }: {
  dateFormat?: string;
  legalFormType?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsDownloadtemplateKeyFn({ dateFormat, legalFormType, officeId, staffId }, queryKey), queryFn: () => ClientService.getV1ClientsDownloadtemplate({ dateFormat, legalFormType, officeId, staffId }) as TData, ...options });
export const useClientServiceGetV1ClientsExternalIdByExternalId = <TData = Common.ClientServiceGetV1ClientsExternalIdByExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalId, staffInSelectedOfficeOnly }: {
  externalId: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsExternalIdByExternalIdKeyFn({ externalId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => ClientService.getV1ClientsExternalIdByExternalId({ externalId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useClientServiceGetV1ClientsExternalIdByExternalIdAccounts = <TData = Common.ClientServiceGetV1ClientsExternalIdByExternalIdAccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalId }: {
  externalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsExternalIdByExternalIdAccountsKeyFn({ externalId }, queryKey), queryFn: () => ClientService.getV1ClientsExternalIdByExternalIdAccounts({ externalId }) as TData, ...options });
export const useClientServiceGetV1ClientsExternalIdByExternalIdObligeedetails = <TData = Common.ClientServiceGetV1ClientsExternalIdByExternalIdObligeedetailsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalId }: {
  externalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsExternalIdByExternalIdObligeedetailsKeyFn({ externalId }, queryKey), queryFn: () => ClientService.getV1ClientsExternalIdByExternalIdObligeedetails({ externalId }) as TData, ...options });
export const useClientServiceGetV1ClientsExternalIdByExternalIdTransferproposaldate = <TData = Common.ClientServiceGetV1ClientsExternalIdByExternalIdTransferproposaldateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalId }: {
  externalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsExternalIdByExternalIdTransferproposaldateKeyFn({ externalId }, queryKey), queryFn: () => ClientService.getV1ClientsExternalIdByExternalIdTransferproposaldate({ externalId }) as TData, ...options });
export const useClientServiceGetV1ClientsTemplate = <TData = Common.ClientServiceGetV1ClientsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ commandParam, officeId, staffInSelectedOfficeOnly }: {
  commandParam?: string;
  officeId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsTemplateKeyFn({ commandParam, officeId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => ClientService.getV1ClientsTemplate({ commandParam, officeId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useClientServiceGetV1ClientsByClientId = <TData = Common.ClientServiceGetV1ClientsByClientIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, staffInSelectedOfficeOnly }: {
  clientId: number;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsByClientIdKeyFn({ clientId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => ClientService.getV1ClientsByClientId({ clientId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useClientServiceGetV1ClientsByClientIdAccounts = <TData = Common.ClientServiceGetV1ClientsByClientIdAccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsByClientIdAccountsKeyFn({ clientId }, queryKey), queryFn: () => ClientService.getV1ClientsByClientIdAccounts({ clientId }) as TData, ...options });
export const useClientServiceGetV1ClientsByClientIdObligeedetails = <TData = Common.ClientServiceGetV1ClientsByClientIdObligeedetailsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsByClientIdObligeedetailsKeyFn({ clientId }, queryKey), queryFn: () => ClientService.getV1ClientsByClientIdObligeedetails({ clientId }) as TData, ...options });
export const useClientServiceGetV1ClientsByClientIdTransferproposaldate = <TData = Common.ClientServiceGetV1ClientsByClientIdTransferproposaldateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientServiceGetV1ClientsByClientIdTransferproposaldateKeyFn({ clientId }, queryKey), queryFn: () => ClientService.getV1ClientsByClientIdTransferproposaldate({ clientId }) as TData, ...options });
export const useClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactions = <TData = Common.ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientExternalId, limit, offset }: {
  clientExternalId: string;
  limit?: number;
  offset?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsKeyFn({ clientExternalId, limit, offset }, queryKey), queryFn: () => ClientTransactionService.getV1ClientsExternalIdByClientExternalIdTransactions({ clientExternalId, limit, offset }) as TData, ...options });
export const useClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalId = <TData = Common.ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientExternalId, transactionExternalId }: {
  clientExternalId: string;
  transactionExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalIdKeyFn({ clientExternalId, transactionExternalId }, queryKey), queryFn: () => ClientTransactionService.getV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalId({ clientExternalId, transactionExternalId }) as TData, ...options });
export const useClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsByTransactionId = <TData = Common.ClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientExternalId, transactionId }: {
  clientExternalId: string;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsByTransactionIdKeyFn({ clientExternalId, transactionId }, queryKey), queryFn: () => ClientTransactionService.getV1ClientsExternalIdByClientExternalIdTransactionsByTransactionId({ clientExternalId, transactionId }) as TData, ...options });
export const useClientTransactionServiceGetV1ClientsByClientIdTransactions = <TData = Common.ClientTransactionServiceGetV1ClientsByClientIdTransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, limit, offset }: {
  clientId: number;
  limit?: number;
  offset?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientTransactionServiceGetV1ClientsByClientIdTransactionsKeyFn({ clientId, limit, offset }, queryKey), queryFn: () => ClientTransactionService.getV1ClientsByClientIdTransactions({ clientId, limit, offset }) as TData, ...options });
export const useClientTransactionServiceGetV1ClientsByClientIdTransactionsExternalIdByTransactionExternalId = <TData = Common.ClientTransactionServiceGetV1ClientsByClientIdTransactionsExternalIdByTransactionExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, transactionExternalId }: {
  clientId: number;
  transactionExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientTransactionServiceGetV1ClientsByClientIdTransactionsExternalIdByTransactionExternalIdKeyFn({ clientId, transactionExternalId }, queryKey), queryFn: () => ClientTransactionService.getV1ClientsByClientIdTransactionsExternalIdByTransactionExternalId({ clientId, transactionExternalId }) as TData, ...options });
export const useClientTransactionServiceGetV1ClientsByClientIdTransactionsByTransactionId = <TData = Common.ClientTransactionServiceGetV1ClientsByClientIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, transactionId }: {
  clientId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientTransactionServiceGetV1ClientsByClientIdTransactionsByTransactionIdKeyFn({ clientId, transactionId }, queryKey), queryFn: () => ClientTransactionService.getV1ClientsByClientIdTransactionsByTransactionId({ clientId, transactionId }) as TData, ...options });
export const useClientChargesServiceGetV1ClientsByClientIdCharges = <TData = Common.ClientChargesServiceGetV1ClientsByClientIdChargesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chargeStatus, clientId, limit, offset, pendingPayment }: {
  chargeStatus?: string;
  clientId: number;
  limit?: number;
  offset?: number;
  pendingPayment?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientChargesServiceGetV1ClientsByClientIdChargesKeyFn({ chargeStatus, clientId, limit, offset, pendingPayment }, queryKey), queryFn: () => ClientChargesService.getV1ClientsByClientIdCharges({ chargeStatus, clientId, limit, offset, pendingPayment }) as TData, ...options });
export const useClientChargesServiceGetV1ClientsByClientIdChargesTemplate = <TData = Common.ClientChargesServiceGetV1ClientsByClientIdChargesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientChargesServiceGetV1ClientsByClientIdChargesTemplateKeyFn({ clientId }, queryKey), queryFn: () => ClientChargesService.getV1ClientsByClientIdChargesTemplate({ clientId }) as TData, ...options });
export const useClientChargesServiceGetV1ClientsByClientIdChargesByChargeId = <TData = Common.ClientChargesServiceGetV1ClientsByClientIdChargesByChargeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chargeId, clientId }: {
  chargeId: number;
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientChargesServiceGetV1ClientsByClientIdChargesByChargeIdKeyFn({ chargeId, clientId }, queryKey), queryFn: () => ClientChargesService.getV1ClientsByClientIdChargesByChargeId({ chargeId, clientId }) as TData, ...options });
export const useClientCollateralManagementServiceGetV1ClientsByClientIdCollaterals = <TData = Common.ClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, prodId }: {
  clientId: number;
  prodId?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsKeyFn({ clientId, prodId }, queryKey), queryFn: () => ClientCollateralManagementService.getV1ClientsByClientIdCollaterals({ clientId, prodId }) as TData, ...options });
export const useClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsTemplate = <TData = Common.ClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsTemplateKeyFn({ clientId }, queryKey), queryFn: () => ClientCollateralManagementService.getV1ClientsByClientIdCollateralsTemplate({ clientId }) as TData, ...options });
export const useClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsByClientCollateralId = <TData = Common.ClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsByClientCollateralIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientCollateralId, clientId }: {
  clientCollateralId: number;
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsByClientCollateralIdKeyFn({ clientCollateralId, clientId }, queryKey), queryFn: () => ClientCollateralManagementService.getV1ClientsByClientIdCollateralsByClientCollateralId({ clientCollateralId, clientId }) as TData, ...options });
export const useClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembers = <TData = Common.ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersKeyFn({ clientId }, queryKey), queryFn: () => ClientFamilyMemberService.getV1ClientsByClientIdFamilymembers({ clientId }) as TData, ...options });
export const useClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersTemplate = <TData = Common.ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersTemplateKeyFn({ clientId }, queryKey), queryFn: () => ClientFamilyMemberService.getV1ClientsByClientIdFamilymembersTemplate({ clientId }) as TData, ...options });
export const useClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersByFamilyMemberId = <TData = Common.ClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersByFamilyMemberIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, familyMemberId }: {
  clientId: number;
  familyMemberId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersByFamilyMemberIdKeyFn({ clientId, familyMemberId }, queryKey), queryFn: () => ClientFamilyMemberService.getV1ClientsByClientIdFamilymembersByFamilyMemberId({ clientId, familyMemberId }) as TData, ...options });
export const useClientIdentifierServiceGetV1ClientsByClientIdIdentifiers = <TData = Common.ClientIdentifierServiceGetV1ClientsByClientIdIdentifiersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersKeyFn({ clientId }, queryKey), queryFn: () => ClientIdentifierService.getV1ClientsByClientIdIdentifiers({ clientId }) as TData, ...options });
export const useClientIdentifierServiceGetV1ClientsByClientIdIdentifiersTemplate = <TData = Common.ClientIdentifierServiceGetV1ClientsByClientIdIdentifiersTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersTemplateKeyFn({ clientId }, queryKey), queryFn: () => ClientIdentifierService.getV1ClientsByClientIdIdentifiersTemplate({ clientId }) as TData, ...options });
export const useClientIdentifierServiceGetV1ClientsByClientIdIdentifiersByIdentifierId = <TData = Common.ClientIdentifierServiceGetV1ClientsByClientIdIdentifiersByIdentifierIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, identifierId }: {
  clientId: number;
  identifierId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersByIdentifierIdKeyFn({ clientId, identifierId }, queryKey), queryFn: () => ClientIdentifierService.getV1ClientsByClientIdIdentifiersByIdentifierId({ clientId, identifierId }) as TData, ...options });
export const useCodesServiceGetV1Codes = <TData = Common.CodesServiceGetV1CodesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCodesServiceGetV1CodesKeyFn(queryKey), queryFn: () => CodesService.getV1Codes() as TData, ...options });
export const useCodesServiceGetV1CodesByCodeId = <TData = Common.CodesServiceGetV1CodesByCodeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ codeId }: {
  codeId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCodesServiceGetV1CodesByCodeIdKeyFn({ codeId }, queryKey), queryFn: () => CodesService.getV1CodesByCodeId({ codeId }) as TData, ...options });
export const useCodeValuesServiceGetV1CodesByCodeIdCodevalues = <TData = Common.CodeValuesServiceGetV1CodesByCodeIdCodevaluesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ codeId }: {
  codeId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCodeValuesServiceGetV1CodesByCodeIdCodevaluesKeyFn({ codeId }, queryKey), queryFn: () => CodeValuesService.getV1CodesByCodeIdCodevalues({ codeId }) as TData, ...options });
export const useCodeValuesServiceGetV1CodesByCodeIdCodevaluesByCodeValueId = <TData = Common.CodeValuesServiceGetV1CodesByCodeIdCodevaluesByCodeValueIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ codeId, codeValueId }: {
  codeId: number;
  codeValueId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCodeValuesServiceGetV1CodesByCodeIdCodevaluesByCodeValueIdKeyFn({ codeId, codeValueId }, queryKey), queryFn: () => CodeValuesService.getV1CodesByCodeIdCodevaluesByCodeValueId({ codeId, codeValueId }) as TData, ...options });
export const useCollateralManagementServiceGetV1CollateralManagement = <TData = Common.CollateralManagementServiceGetV1CollateralManagementDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCollateralManagementServiceGetV1CollateralManagementKeyFn(queryKey), queryFn: () => CollateralManagementService.getV1CollateralManagement() as TData, ...options });
export const useCollateralManagementServiceGetV1CollateralManagementTemplate = <TData = Common.CollateralManagementServiceGetV1CollateralManagementTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCollateralManagementServiceGetV1CollateralManagementTemplateKeyFn(queryKey), queryFn: () => CollateralManagementService.getV1CollateralManagementTemplate() as TData, ...options });
export const useCollateralManagementServiceGetV1CollateralManagementByCollateralId = <TData = Common.CollateralManagementServiceGetV1CollateralManagementByCollateralIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ collateralId }: {
  collateralId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCollateralManagementServiceGetV1CollateralManagementByCollateralIdKeyFn({ collateralId }, queryKey), queryFn: () => CollateralManagementService.getV1CollateralManagementByCollateralId({ collateralId }) as TData, ...options });
export const useGlobalConfigurationServiceGetV1Configurations = <TData = Common.GlobalConfigurationServiceGetV1ConfigurationsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ survey }: {
  survey?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGlobalConfigurationServiceGetV1ConfigurationsKeyFn({ survey }, queryKey), queryFn: () => GlobalConfigurationService.getV1Configurations({ survey }) as TData, ...options });
export const useGlobalConfigurationServiceGetV1ConfigurationsNameByName = <TData = Common.GlobalConfigurationServiceGetV1ConfigurationsNameByNameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ name }: {
  name: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGlobalConfigurationServiceGetV1ConfigurationsNameByNameKeyFn({ name }, queryKey), queryFn: () => GlobalConfigurationService.getV1ConfigurationsNameByName({ name }) as TData, ...options });
export const useGlobalConfigurationServiceGetV1ConfigurationsByConfigId = <TData = Common.GlobalConfigurationServiceGetV1ConfigurationsByConfigIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ configId }: {
  configId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGlobalConfigurationServiceGetV1ConfigurationsByConfigIdKeyFn({ configId }, queryKey), queryFn: () => GlobalConfigurationService.getV1ConfigurationsByConfigId({ configId }) as TData, ...options });
export const useCurrencyServiceGetV1Currencies = <TData = Common.CurrencyServiceGetV1CurrenciesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCurrencyServiceGetV1CurrenciesKeyFn(queryKey), queryFn: () => CurrencyService.getV1Currencies() as TData, ...options });
export const useDataTablesServiceGetV1Datatables = <TData = Common.DataTablesServiceGetV1DatatablesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ apptable }: {
  apptable?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDataTablesServiceGetV1DatatablesKeyFn({ apptable }, queryKey), queryFn: () => DataTablesService.getV1Datatables({ apptable }) as TData, ...options });
export const useDataTablesServiceGetV1DatatablesByDatatable = <TData = Common.DataTablesServiceGetV1DatatablesByDatatableDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ datatable }: {
  datatable: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDataTablesServiceGetV1DatatablesByDatatableKeyFn({ datatable }, queryKey), queryFn: () => DataTablesService.getV1DatatablesByDatatable({ datatable }) as TData, ...options });
export const useDataTablesServiceGetV1DatatablesByDatatableQuery = <TData = Common.DataTablesServiceGetV1DatatablesByDatatableQueryDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ columnFilter, datatable, resultColumns, valueFilter }: {
  columnFilter?: string;
  datatable: string;
  resultColumns?: string;
  valueFilter?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDataTablesServiceGetV1DatatablesByDatatableQueryKeyFn({ columnFilter, datatable, resultColumns, valueFilter }, queryKey), queryFn: () => DataTablesService.getV1DatatablesByDatatableQuery({ columnFilter, datatable, resultColumns, valueFilter }) as TData, ...options });
export const useDataTablesServiceGetV1DatatablesByDatatableByApptableId = <TData = Common.DataTablesServiceGetV1DatatablesByDatatableByApptableIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ apptableId, datatable, order }: {
  apptableId: number;
  datatable: string;
  order?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDataTablesServiceGetV1DatatablesByDatatableByApptableIdKeyFn({ apptableId, datatable, order }, queryKey), queryFn: () => DataTablesService.getV1DatatablesByDatatableByApptableId({ apptableId, datatable, order }) as TData, ...options });
export const useDataTablesServiceGetV1DatatablesByDatatableByApptableIdByDatatableId = <TData = Common.DataTablesServiceGetV1DatatablesByDatatableByApptableIdByDatatableIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ apptableId, datatable, datatableId, genericResultSet, order }: {
  apptableId: number;
  datatable: string;
  datatableId: number;
  genericResultSet?: boolean;
  order?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDataTablesServiceGetV1DatatablesByDatatableByApptableIdByDatatableIdKeyFn({ apptableId, datatable, datatableId, genericResultSet, order }, queryKey), queryFn: () => DataTablesService.getV1DatatablesByDatatableByApptableIdByDatatableId({ apptableId, datatable, datatableId, genericResultSet, order }) as TData, ...options });
export const useDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBuckets = <TData = Common.DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsKeyFn(queryKey), queryFn: () => DelinquencyRangeAndBucketsManagementService.getV1DelinquencyBuckets() as TData, ...options });
export const useDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsByDelinquencyBucketId = <TData = Common.DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsByDelinquencyBucketIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ delinquencyBucketId }: {
  delinquencyBucketId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsByDelinquencyBucketIdKeyFn({ delinquencyBucketId }, queryKey), queryFn: () => DelinquencyRangeAndBucketsManagementService.getV1DelinquencyBucketsByDelinquencyBucketId({ delinquencyBucketId }) as TData, ...options });
export const useDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRanges = <TData = Common.DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesKeyFn(queryKey), queryFn: () => DelinquencyRangeAndBucketsManagementService.getV1DelinquencyRanges() as TData, ...options });
export const useDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesByDelinquencyRangeId = <TData = Common.DelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesByDelinquencyRangeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ delinquencyRangeId }: {
  delinquencyRangeId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesByDelinquencyRangeIdKeyFn({ delinquencyRangeId }, queryKey), queryFn: () => DelinquencyRangeAndBucketsManagementService.getV1DelinquencyRangesByDelinquencyRangeId({ delinquencyRangeId }) as TData, ...options });
export const useEntityDataTableServiceGetV1EntityDatatableChecks = <TData = Common.EntityDataTableServiceGetV1EntityDatatableChecksDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entity, limit, offset, productId, status }: {
  entity?: string;
  limit?: number;
  offset?: number;
  productId?: number;
  status?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseEntityDataTableServiceGetV1EntityDatatableChecksKeyFn({ entity, limit, offset, productId, status }, queryKey), queryFn: () => EntityDataTableService.getV1EntityDatatableChecks({ entity, limit, offset, productId, status }) as TData, ...options });
export const useEntityDataTableServiceGetV1EntityDatatableChecksTemplate = <TData = Common.EntityDataTableServiceGetV1EntityDatatableChecksTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseEntityDataTableServiceGetV1EntityDatatableChecksTemplateKeyFn(queryKey), queryFn: () => EntityDataTableService.getV1EntityDatatableChecksTemplate() as TData, ...options });
export const useFineractEntityServiceGetV1Entitytoentitymapping = <TData = Common.FineractEntityServiceGetV1EntitytoentitymappingDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFineractEntityServiceGetV1EntitytoentitymappingKeyFn(queryKey), queryFn: () => FineractEntityService.getV1Entitytoentitymapping() as TData, ...options });
export const useFineractEntityServiceGetV1EntitytoentitymappingByMapId = <TData = Common.FineractEntityServiceGetV1EntitytoentitymappingByMapIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ mapId }: {
  mapId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFineractEntityServiceGetV1EntitytoentitymappingByMapIdKeyFn({ mapId }, queryKey), queryFn: () => FineractEntityService.getV1EntitytoentitymappingByMapId({ mapId }) as TData, ...options });
export const useFineractEntityServiceGetV1EntitytoentitymappingByMapIdByFromIdByToId = <TData = Common.FineractEntityServiceGetV1EntitytoentitymappingByMapIdByFromIdByToIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fromId, mapId, toId }: {
  fromId: number;
  mapId: number;
  toId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFineractEntityServiceGetV1EntitytoentitymappingByMapIdByFromIdByToIdKeyFn({ fromId, mapId, toId }, queryKey), queryFn: () => FineractEntityService.getV1EntitytoentitymappingByMapIdByFromIdByToId({ fromId, mapId, toId }) as TData, ...options });
export const useExternalAssetOwnerLoanProductAttributesServiceGetV1ExternalAssetOwnersLoanProductByLoanProductIdAttributes = <TData = Common.ExternalAssetOwnerLoanProductAttributesServiceGetV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ attributeKey, loanProductId }: {
  attributeKey?: string;
  loanProductId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseExternalAssetOwnerLoanProductAttributesServiceGetV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesKeyFn({ attributeKey, loanProductId }, queryKey), queryFn: () => ExternalAssetOwnerLoanProductAttributesService.getV1ExternalAssetOwnersLoanProductByLoanProductIdAttributes({ attributeKey, loanProductId }) as TData, ...options });
export const useExternalAssetOwnersServiceGetV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntries = <TData = Common.ExternalAssetOwnersServiceGetV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntriesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, ownerExternalId }: {
  limit?: number;
  offset?: number;
  ownerExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntriesKeyFn({ limit, offset, ownerExternalId }, queryKey), queryFn: () => ExternalAssetOwnersService.getV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntries({ limit, offset, ownerExternalId }) as TData, ...options });
export const useExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfers = <TData = Common.ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, loanExternalId, loanId, offset, transferExternalId }: {
  limit?: number;
  loanExternalId?: string;
  loanId?: number;
  offset?: number;
  transferExternalId?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersKeyFn({ limit, loanExternalId, loanId, offset, transferExternalId }, queryKey), queryFn: () => ExternalAssetOwnersService.getV1ExternalAssetOwnersTransfers({ limit, loanExternalId, loanId, offset, transferExternalId }) as TData, ...options });
export const useExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersActiveTransfer = <TData = Common.ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersActiveTransferDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId, loanId, transferExternalId }: {
  loanExternalId?: string;
  loanId?: number;
  transferExternalId?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersActiveTransferKeyFn({ loanExternalId, loanId, transferExternalId }, queryKey), queryFn: () => ExternalAssetOwnersService.getV1ExternalAssetOwnersTransfersActiveTransfer({ loanExternalId, loanId, transferExternalId }) as TData, ...options });
export const useExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersByTransferIdJournalEntries = <TData = Common.ExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersByTransferIdJournalEntriesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, transferId }: {
  limit?: number;
  offset?: number;
  transferId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersByTransferIdJournalEntriesKeyFn({ limit, offset, transferId }, queryKey), queryFn: () => ExternalAssetOwnersService.getV1ExternalAssetOwnersTransfersByTransferIdJournalEntries({ limit, offset, transferId }) as TData, ...options });
export const useExternalEventConfigurationServiceGetV1ExternaleventsConfiguration = <TData = Common.ExternalEventConfigurationServiceGetV1ExternaleventsConfigurationDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseExternalEventConfigurationServiceGetV1ExternaleventsConfigurationKeyFn(queryKey), queryFn: () => ExternalEventConfigurationService.getV1ExternaleventsConfiguration() as TData, ...options });
export const useExternalServicesServiceGetV1ExternalserviceByServicename = <TData = Common.ExternalServicesServiceGetV1ExternalserviceByServicenameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ servicename }: {
  servicename: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseExternalServicesServiceGetV1ExternalserviceByServicenameKeyFn({ servicename }, queryKey), queryFn: () => ExternalServicesService.getV1ExternalserviceByServicename({ servicename }) as TData, ...options });
export const useEntityFieldConfigurationServiceGetV1FieldconfigurationByEntity = <TData = Common.EntityFieldConfigurationServiceGetV1FieldconfigurationByEntityDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entity }: {
  entity: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseEntityFieldConfigurationServiceGetV1FieldconfigurationByEntityKeyFn({ entity }, queryKey), queryFn: () => EntityFieldConfigurationService.getV1FieldconfigurationByEntity({ entity }) as TData, ...options });
export const useMappingFinancialActivitiesToAccountsServiceGetV1Financialactivityaccounts = <TData = Common.MappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsKeyFn(queryKey), queryFn: () => MappingFinancialActivitiesToAccountsService.getV1Financialactivityaccounts() as TData, ...options });
export const useMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsTemplate = <TData = Common.MappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsTemplateKeyFn(queryKey), queryFn: () => MappingFinancialActivitiesToAccountsService.getV1FinancialactivityaccountsTemplate() as TData, ...options });
export const useMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsByMappingId = <TData = Common.MappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsByMappingIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ mappingId }: {
  mappingId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsByMappingIdKeyFn({ mappingId }, queryKey), queryFn: () => MappingFinancialActivitiesToAccountsService.getV1FinancialactivityaccountsByMappingId({ mappingId }) as TData, ...options });
export const useFixedDepositAccountServiceGetV1Fixeddepositaccounts = <TData = Common.FixedDepositAccountServiceGetV1FixeddepositaccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, paged, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  paged?: boolean;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsKeyFn({ limit, offset, orderBy, paged, sortOrder }, queryKey), queryFn: () => FixedDepositAccountService.getV1Fixeddepositaccounts({ limit, offset, orderBy, paged, sortOrder }) as TData, ...options });
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsCalculateFdInterest = <TData = Common.FixedDepositAccountServiceGetV1FixeddepositaccountsCalculateFdInterestDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ annualInterestRate, interestCompoundingPeriodInMonths, interestPostingPeriodInMonths, principalAmount, tenureInMonths }: {
  annualInterestRate?: number;
  interestCompoundingPeriodInMonths?: number;
  interestPostingPeriodInMonths?: number;
  principalAmount?: number;
  tenureInMonths?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsCalculateFdInterestKeyFn({ annualInterestRate, interestCompoundingPeriodInMonths, interestPostingPeriodInMonths, principalAmount, tenureInMonths }, queryKey), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsCalculateFdInterest({ annualInterestRate, interestCompoundingPeriodInMonths, interestPostingPeriodInMonths, principalAmount, tenureInMonths }) as TData, ...options });
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsDownloadtemplate = <TData = Common.FixedDepositAccountServiceGetV1FixeddepositaccountsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsDownloadtemplateKeyFn({ dateFormat, officeId, staffId }, queryKey), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsDownloadtemplate({ dateFormat, officeId, staffId }) as TData, ...options });
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsTemplate = <TData = Common.FixedDepositAccountServiceGetV1FixeddepositaccountsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, groupId, productId, staffInSelectedOfficeOnly }: {
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsTemplateKeyFn({ clientId, groupId, productId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsTemplate({ clientId, groupId, productId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsTransactionDownloadtemplate = <TData = Common.FixedDepositAccountServiceGetV1FixeddepositaccountsTransactionDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsTransactionDownloadtemplateKeyFn({ dateFormat, officeId }, queryKey), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsTransactionDownloadtemplate({ dateFormat, officeId }) as TData, ...options });
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountId = <TData = Common.FixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, chargeStatus, staffInSelectedOfficeOnly }: {
  accountId: number;
  chargeStatus?: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdKeyFn({ accountId, chargeStatus, staffInSelectedOfficeOnly }, queryKey), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsByAccountId({ accountId, chargeStatus, staffInSelectedOfficeOnly }) as TData, ...options });
export const useFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdTemplate = <TData = Common.FixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, command }: {
  accountId: number;
  command?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdTemplateKeyFn({ accountId, command }, queryKey), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsByAccountIdTemplate({ accountId, command }) as TData, ...options });
export const useFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplate = <TData = Common.FixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fixedDepositAccountId }: {
  fixedDepositAccountId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplateKeyFn({ fixedDepositAccountId }, queryKey), queryFn: () => FixedDepositAccountTransactionsService.getV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplate({ fixedDepositAccountId }) as TData, ...options });
export const useFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionId = <TData = Common.FixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fixedDepositAccountId, transactionId }: {
  fixedDepositAccountId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionIdKeyFn({ fixedDepositAccountId, transactionId }, queryKey), queryFn: () => FixedDepositAccountTransactionsService.getV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionId({ fixedDepositAccountId, transactionId }) as TData, ...options });
export const useFixedDepositProductServiceGetV1Fixeddepositproducts = <TData = Common.FixedDepositProductServiceGetV1FixeddepositproductsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFixedDepositProductServiceGetV1FixeddepositproductsKeyFn(queryKey), queryFn: () => FixedDepositProductService.getV1Fixeddepositproducts() as TData, ...options });
export const useFixedDepositProductServiceGetV1FixeddepositproductsTemplate = <TData = Common.FixedDepositProductServiceGetV1FixeddepositproductsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFixedDepositProductServiceGetV1FixeddepositproductsTemplateKeyFn(queryKey), queryFn: () => FixedDepositProductService.getV1FixeddepositproductsTemplate() as TData, ...options });
export const useFixedDepositProductServiceGetV1FixeddepositproductsByProductId = <TData = Common.FixedDepositProductServiceGetV1FixeddepositproductsByProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ productId }: {
  productId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFixedDepositProductServiceGetV1FixeddepositproductsByProductIdKeyFn({ productId }, queryKey), queryFn: () => FixedDepositProductService.getV1FixeddepositproductsByProductId({ productId }) as TData, ...options });
export const useFloatingRatesServiceGetV1Floatingrates = <TData = Common.FloatingRatesServiceGetV1FloatingratesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFloatingRatesServiceGetV1FloatingratesKeyFn(queryKey), queryFn: () => FloatingRatesService.getV1Floatingrates() as TData, ...options });
export const useFloatingRatesServiceGetV1FloatingratesByFloatingRateId = <TData = Common.FloatingRatesServiceGetV1FloatingratesByFloatingRateIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ floatingRateId }: {
  floatingRateId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFloatingRatesServiceGetV1FloatingratesByFloatingRateIdKeyFn({ floatingRateId }, queryKey), queryFn: () => FloatingRatesService.getV1FloatingratesByFloatingRateId({ floatingRateId }) as TData, ...options });
export const useFundsServiceGetV1Funds = <TData = Common.FundsServiceGetV1FundsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFundsServiceGetV1FundsKeyFn(queryKey), queryFn: () => FundsService.getV1Funds() as TData, ...options });
export const useFundsServiceGetV1FundsByFundId = <TData = Common.FundsServiceGetV1FundsByFundIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fundId }: {
  fundId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFundsServiceGetV1FundsByFundIdKeyFn({ fundId }, queryKey), queryFn: () => FundsService.getV1FundsByFundId({ fundId }) as TData, ...options });
export const useGeneralLedgerAccountServiceGetV1Glaccounts = <TData = Common.GeneralLedgerAccountServiceGetV1GlaccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ disabled, fetchRunningBalance, manualEntriesAllowed, searchParam, type, usage }: {
  disabled?: boolean;
  fetchRunningBalance?: boolean;
  manualEntriesAllowed?: boolean;
  searchParam?: string;
  type?: number;
  usage?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGeneralLedgerAccountServiceGetV1GlaccountsKeyFn({ disabled, fetchRunningBalance, manualEntriesAllowed, searchParam, type, usage }, queryKey), queryFn: () => GeneralLedgerAccountService.getV1Glaccounts({ disabled, fetchRunningBalance, manualEntriesAllowed, searchParam, type, usage }) as TData, ...options });
export const useGeneralLedgerAccountServiceGetV1GlaccountsDownloadtemplate = <TData = Common.GeneralLedgerAccountServiceGetV1GlaccountsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat }: {
  dateFormat?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGeneralLedgerAccountServiceGetV1GlaccountsDownloadtemplateKeyFn({ dateFormat }, queryKey), queryFn: () => GeneralLedgerAccountService.getV1GlaccountsDownloadtemplate({ dateFormat }) as TData, ...options });
export const useGeneralLedgerAccountServiceGetV1GlaccountsTemplate = <TData = Common.GeneralLedgerAccountServiceGetV1GlaccountsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ type }: {
  type?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGeneralLedgerAccountServiceGetV1GlaccountsTemplateKeyFn({ type }, queryKey), queryFn: () => GeneralLedgerAccountService.getV1GlaccountsTemplate({ type }) as TData, ...options });
export const useGeneralLedgerAccountServiceGetV1GlaccountsByGlAccountId = <TData = Common.GeneralLedgerAccountServiceGetV1GlaccountsByGlAccountIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fetchRunningBalance, glAccountId }: {
  fetchRunningBalance?: boolean;
  glAccountId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGeneralLedgerAccountServiceGetV1GlaccountsByGlAccountIdKeyFn({ fetchRunningBalance, glAccountId }, queryKey), queryFn: () => GeneralLedgerAccountService.getV1GlaccountsByGlAccountId({ fetchRunningBalance, glAccountId }) as TData, ...options });
export const useAccountingClosureServiceGetV1Glclosures = <TData = Common.AccountingClosureServiceGetV1GlclosuresDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ officeId }: {
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAccountingClosureServiceGetV1GlclosuresKeyFn({ officeId }, queryKey), queryFn: () => AccountingClosureService.getV1Glclosures({ officeId }) as TData, ...options });
export const useAccountingClosureServiceGetV1GlclosuresByGlClosureId = <TData = Common.AccountingClosureServiceGetV1GlclosuresByGlClosureIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ glClosureId }: {
  glClosureId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseAccountingClosureServiceGetV1GlclosuresByGlClosureIdKeyFn({ glClosureId }, queryKey), queryFn: () => AccountingClosureService.getV1GlclosuresByGlClosureId({ glClosureId }) as TData, ...options });
export const useGroupsLevelServiceGetV1Grouplevels = <TData = Common.GroupsLevelServiceGetV1GrouplevelsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGroupsLevelServiceGetV1GrouplevelsKeyFn(queryKey), queryFn: () => GroupsLevelService.getV1Grouplevels() as TData, ...options });
export const useGroupsServiceGetV1Groups = <TData = Common.GroupsServiceGetV1GroupsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalId, limit, name, officeId, offset, orderBy, orphansOnly, paged, sortOrder, staffId, underHierarchy }: {
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
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGroupsServiceGetV1GroupsKeyFn({ externalId, limit, name, officeId, offset, orderBy, orphansOnly, paged, sortOrder, staffId, underHierarchy }, queryKey), queryFn: () => GroupsService.getV1Groups({ externalId, limit, name, officeId, offset, orderBy, orphansOnly, paged, sortOrder, staffId, underHierarchy }) as TData, ...options });
export const useGroupsServiceGetV1GroupsDownloadtemplate = <TData = Common.GroupsServiceGetV1GroupsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGroupsServiceGetV1GroupsDownloadtemplateKeyFn({ dateFormat, officeId, staffId }, queryKey), queryFn: () => GroupsService.getV1GroupsDownloadtemplate({ dateFormat, officeId, staffId }) as TData, ...options });
export const useGroupsServiceGetV1GroupsTemplate = <TData = Common.GroupsServiceGetV1GroupsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ center, centerId, command, officeId, staffInSelectedOfficeOnly }: {
  center?: boolean;
  centerId?: number;
  command?: string;
  officeId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGroupsServiceGetV1GroupsTemplateKeyFn({ center, centerId, command, officeId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => GroupsService.getV1GroupsTemplate({ center, centerId, command, officeId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useGroupsServiceGetV1GroupsByGroupId = <TData = Common.GroupsServiceGetV1GroupsByGroupIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ groupId, roleId, staffInSelectedOfficeOnly }: {
  groupId: number;
  roleId?: number;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGroupsServiceGetV1GroupsByGroupIdKeyFn({ groupId, roleId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => GroupsService.getV1GroupsByGroupId({ groupId, roleId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useGroupsServiceGetV1GroupsByGroupIdAccounts = <TData = Common.GroupsServiceGetV1GroupsByGroupIdAccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ groupId }: {
  groupId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGroupsServiceGetV1GroupsByGroupIdAccountsKeyFn({ groupId }, queryKey), queryFn: () => GroupsService.getV1GroupsByGroupIdAccounts({ groupId }) as TData, ...options });
export const useGroupsServiceGetV1GroupsByGroupIdGlimaccounts = <TData = Common.GroupsServiceGetV1GroupsByGroupIdGlimaccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ groupId, parentLoanAccountNo }: {
  groupId: number;
  parentLoanAccountNo?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGroupsServiceGetV1GroupsByGroupIdGlimaccountsKeyFn({ groupId, parentLoanAccountNo }, queryKey), queryFn: () => GroupsService.getV1GroupsByGroupIdGlimaccounts({ groupId, parentLoanAccountNo }) as TData, ...options });
export const useGroupsServiceGetV1GroupsByGroupIdGsimaccounts = <TData = Common.GroupsServiceGetV1GroupsByGroupIdGsimaccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ groupId, parentGsimAccountNo, parentGsimId }: {
  groupId: number;
  parentGsimAccountNo?: string;
  parentGsimId?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGroupsServiceGetV1GroupsByGroupIdGsimaccountsKeyFn({ groupId, parentGsimAccountNo, parentGsimId }, queryKey), queryFn: () => GroupsService.getV1GroupsByGroupIdGsimaccounts({ groupId, parentGsimAccountNo, parentGsimId }) as TData, ...options });
export const useHolidaysServiceGetV1Holidays = <TData = Common.HolidaysServiceGetV1HolidaysDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, fromDate, locale, officeId, toDate }: {
  dateFormat?: string;
  fromDate?: DateParam;
  locale?: string;
  officeId?: number;
  toDate?: DateParam;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseHolidaysServiceGetV1HolidaysKeyFn({ dateFormat, fromDate, locale, officeId, toDate }, queryKey), queryFn: () => HolidaysService.getV1Holidays({ dateFormat, fromDate, locale, officeId, toDate }) as TData, ...options });
export const useHolidaysServiceGetV1HolidaysTemplate = <TData = Common.HolidaysServiceGetV1HolidaysTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseHolidaysServiceGetV1HolidaysTemplateKeyFn(queryKey), queryFn: () => HolidaysService.getV1HolidaysTemplate() as TData, ...options });
export const useHolidaysServiceGetV1HolidaysByHolidayId = <TData = Common.HolidaysServiceGetV1HolidaysByHolidayIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ holidayId }: {
  holidayId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseHolidaysServiceGetV1HolidaysByHolidayIdKeyFn({ holidayId }, queryKey), queryFn: () => HolidaysService.getV1HolidaysByHolidayId({ holidayId }) as TData, ...options });
export const useHooksServiceGetV1Hooks = <TData = Common.HooksServiceGetV1HooksDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseHooksServiceGetV1HooksKeyFn(queryKey), queryFn: () => HooksService.getV1Hooks() as TData, ...options });
export const useHooksServiceGetV1HooksTemplate = <TData = Common.HooksServiceGetV1HooksTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseHooksServiceGetV1HooksTemplateKeyFn(queryKey), queryFn: () => HooksService.getV1HooksTemplate() as TData, ...options });
export const useHooksServiceGetV1HooksByHookId = <TData = Common.HooksServiceGetV1HooksByHookIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ hookId }: {
  hookId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseHooksServiceGetV1HooksByHookIdKeyFn({ hookId }, queryKey), queryFn: () => HooksService.getV1HooksByHookId({ hookId }) as TData, ...options });
export const useBulkImportServiceGetV1Imports = <TData = Common.BulkImportServiceGetV1ImportsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entityType }: {
  entityType?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseBulkImportServiceGetV1ImportsKeyFn({ entityType }, queryKey), queryFn: () => BulkImportService.getV1Imports({ entityType }) as TData, ...options });
export const useBulkImportServiceGetV1ImportsDownloadOutputTemplate = <TData = Common.BulkImportServiceGetV1ImportsDownloadOutputTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ importDocumentId }: {
  importDocumentId?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseBulkImportServiceGetV1ImportsDownloadOutputTemplateKeyFn({ importDocumentId }, queryKey), queryFn: () => BulkImportService.getV1ImportsDownloadOutputTemplate({ importDocumentId }) as TData, ...options });
export const useBulkImportServiceGetV1ImportsGetOutputTemplateLocation = <TData = Common.BulkImportServiceGetV1ImportsGetOutputTemplateLocationDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ importDocumentId }: {
  importDocumentId?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseBulkImportServiceGetV1ImportsGetOutputTemplateLocationKeyFn({ importDocumentId }, queryKey), queryFn: () => BulkImportService.getV1ImportsGetOutputTemplateLocation({ importDocumentId }) as TData, ...options });
export const useInterestRateChartServiceGetV1Interestratecharts = <TData = Common.InterestRateChartServiceGetV1InterestratechartsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ productId }: {
  productId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseInterestRateChartServiceGetV1InterestratechartsKeyFn({ productId }, queryKey), queryFn: () => InterestRateChartService.getV1Interestratecharts({ productId }) as TData, ...options });
export const useInterestRateChartServiceGetV1InterestratechartsTemplate = <TData = Common.InterestRateChartServiceGetV1InterestratechartsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseInterestRateChartServiceGetV1InterestratechartsTemplateKeyFn(queryKey), queryFn: () => InterestRateChartService.getV1InterestratechartsTemplate() as TData, ...options });
export const useInterestRateChartServiceGetV1InterestratechartsByChartId = <TData = Common.InterestRateChartServiceGetV1InterestratechartsByChartIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chartId }: {
  chartId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseInterestRateChartServiceGetV1InterestratechartsByChartIdKeyFn({ chartId }, queryKey), queryFn: () => InterestRateChartService.getV1InterestratechartsByChartId({ chartId }) as TData, ...options });
export const useInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabs = <TData = Common.InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chartId }: {
  chartId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsKeyFn({ chartId }, queryKey), queryFn: () => InterestRateSlabAKAInterestBandsService.getV1InterestratechartsByChartIdChartslabs({ chartId }) as TData, ...options });
export const useInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsTemplate = <TData = Common.InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chartId }: {
  chartId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsTemplateKeyFn({ chartId }, queryKey), queryFn: () => InterestRateSlabAKAInterestBandsService.getV1InterestratechartsByChartIdChartslabsTemplate({ chartId }) as TData, ...options });
export const useInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsByChartSlabId = <TData = Common.InterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsByChartSlabIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chartId, chartSlabId }: {
  chartId: number;
  chartSlabId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsByChartSlabIdKeyFn({ chartId, chartSlabId }, queryKey), queryFn: () => InterestRateSlabAKAInterestBandsService.getV1InterestratechartsByChartIdChartslabsByChartSlabId({ chartId, chartSlabId }) as TData, ...options });
export const useProgressiveLoanServiceGetV1InternalLoanProgressiveByLoanIdModel = <TData = Common.ProgressiveLoanServiceGetV1InternalLoanProgressiveByLoanIdModelDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseProgressiveLoanServiceGetV1InternalLoanProgressiveByLoanIdModelKeyFn({ loanId }, queryKey), queryFn: () => ProgressiveLoanService.getV1InternalLoanProgressiveByLoanIdModel({ loanId }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationAccountsByAccountId = <TData = Common.InterOperationServiceGetV1InteroperationAccountsByAccountIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId }: {
  accountId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationAccountsByAccountIdKeyFn({ accountId }, queryKey), queryFn: () => InterOperationService.getV1InteroperationAccountsByAccountId({ accountId }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationAccountsByAccountIdIdentifiers = <TData = Common.InterOperationServiceGetV1InteroperationAccountsByAccountIdIdentifiersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId }: {
  accountId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationAccountsByAccountIdIdentifiersKeyFn({ accountId }, queryKey), queryFn: () => InterOperationService.getV1InteroperationAccountsByAccountIdIdentifiers({ accountId }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationAccountsByAccountIdKyc = <TData = Common.InterOperationServiceGetV1InteroperationAccountsByAccountIdKycDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId }: {
  accountId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationAccountsByAccountIdKycKeyFn({ accountId }, queryKey), queryFn: () => InterOperationService.getV1InteroperationAccountsByAccountIdKyc({ accountId }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationAccountsByAccountIdTransactions = <TData = Common.InterOperationServiceGetV1InteroperationAccountsByAccountIdTransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, credit, debit, fromBookingDateTime, toBookingDateTime }: {
  accountId: string;
  credit?: boolean;
  debit?: boolean;
  fromBookingDateTime?: string;
  toBookingDateTime?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationAccountsByAccountIdTransactionsKeyFn({ accountId, credit, debit, fromBookingDateTime, toBookingDateTime }, queryKey), queryFn: () => InterOperationService.getV1InteroperationAccountsByAccountIdTransactions({ accountId, credit, debit, fromBookingDateTime, toBookingDateTime }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationHealth = <TData = Common.InterOperationServiceGetV1InteroperationHealthDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationHealthKeyFn(queryKey), queryFn: () => InterOperationService.getV1InteroperationHealth() as TData, ...options });
export const useInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValue = <TData = Common.InterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ idType, idValue }: {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueKeyFn({ idType, idValue }, queryKey), queryFn: () => InterOperationService.getV1InteroperationPartiesByIdTypeByIdValue({ idType, idValue }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueBySubIdOrType = <TData = Common.InterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ idType, idValue, subIdOrType }: {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
  subIdOrType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeKeyFn({ idType, idValue, subIdOrType }, queryKey), queryFn: () => InterOperationService.getV1InteroperationPartiesByIdTypeByIdValueBySubIdOrType({ idType, idValue, subIdOrType }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCode = <TData = Common.InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCodeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ quoteCode, transactionCode }: {
  quoteCode: string;
  transactionCode: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCodeKeyFn({ quoteCode, transactionCode }, queryKey), queryFn: () => InterOperationService.getV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCode({ quoteCode, transactionCode }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeRequestsByRequestCode = <TData = Common.InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeRequestsByRequestCodeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ requestCode, transactionCode }: {
  requestCode: string;
  transactionCode: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeRequestsByRequestCodeKeyFn({ requestCode, transactionCode }, queryKey), queryFn: () => InterOperationService.getV1InteroperationTransactionsByTransactionCodeRequestsByRequestCode({ requestCode, transactionCode }) as TData, ...options });
export const useInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeTransfersByTransferCode = <TData = Common.InterOperationServiceGetV1InteroperationTransactionsByTransactionCodeTransfersByTransferCodeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ transactionCode, transferCode }: {
  transactionCode: string;
  transferCode: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeTransfersByTransferCodeKeyFn({ transactionCode, transferCode }, queryKey), queryFn: () => InterOperationService.getV1InteroperationTransactionsByTransactionCodeTransfersByTransferCode({ transactionCode, transferCode }) as TData, ...options });
export const useSchedulerJobServiceGetV1Jobs = <TData = Common.SchedulerJobServiceGetV1JobsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSchedulerJobServiceGetV1JobsKeyFn(queryKey), queryFn: () => SchedulerJobService.getV1Jobs() as TData, ...options });
export const useSchedulerJobServiceGetV1JobsShortNameByShortName = <TData = Common.SchedulerJobServiceGetV1JobsShortNameByShortNameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ shortName }: {
  shortName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSchedulerJobServiceGetV1JobsShortNameByShortNameKeyFn({ shortName }, queryKey), queryFn: () => SchedulerJobService.getV1JobsShortNameByShortName({ shortName }) as TData, ...options });
export const useSchedulerJobServiceGetV1JobsShortNameByShortNameRunhistory = <TData = Common.SchedulerJobServiceGetV1JobsShortNameByShortNameRunhistoryDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, shortName, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  shortName: string;
  sortOrder?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSchedulerJobServiceGetV1JobsShortNameByShortNameRunhistoryKeyFn({ limit, offset, orderBy, shortName, sortOrder }, queryKey), queryFn: () => SchedulerJobService.getV1JobsShortNameByShortNameRunhistory({ limit, offset, orderBy, shortName, sortOrder }) as TData, ...options });
export const useSchedulerJobServiceGetV1JobsByJobId = <TData = Common.SchedulerJobServiceGetV1JobsByJobIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ jobId }: {
  jobId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSchedulerJobServiceGetV1JobsByJobIdKeyFn({ jobId }, queryKey), queryFn: () => SchedulerJobService.getV1JobsByJobId({ jobId }) as TData, ...options });
export const useSchedulerJobServiceGetV1JobsByJobIdRunhistory = <TData = Common.SchedulerJobServiceGetV1JobsByJobIdRunhistoryDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ jobId, limit, offset, orderBy, sortOrder }: {
  jobId: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSchedulerJobServiceGetV1JobsByJobIdRunhistoryKeyFn({ jobId, limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => SchedulerJobService.getV1JobsByJobIdRunhistory({ jobId, limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useBusinessStepConfigurationServiceGetV1JobsNames = <TData = Common.BusinessStepConfigurationServiceGetV1JobsNamesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseBusinessStepConfigurationServiceGetV1JobsNamesKeyFn(queryKey), queryFn: () => BusinessStepConfigurationService.getV1JobsNames() as TData, ...options });
export const useBusinessStepConfigurationServiceGetV1JobsByJobNameAvailableSteps = <TData = Common.BusinessStepConfigurationServiceGetV1JobsByJobNameAvailableStepsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ jobName }: {
  jobName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseBusinessStepConfigurationServiceGetV1JobsByJobNameAvailableStepsKeyFn({ jobName }, queryKey), queryFn: () => BusinessStepConfigurationService.getV1JobsByJobNameAvailableSteps({ jobName }) as TData, ...options });
export const useBusinessStepConfigurationServiceGetV1JobsByJobNameSteps = <TData = Common.BusinessStepConfigurationServiceGetV1JobsByJobNameStepsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ jobName }: {
  jobName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseBusinessStepConfigurationServiceGetV1JobsByJobNameStepsKeyFn({ jobName }, queryKey), queryFn: () => BusinessStepConfigurationService.getV1JobsByJobNameSteps({ jobName }) as TData, ...options });
export const useJournalEntriesServiceGetV1Journalentries = <TData = Common.JournalEntriesServiceGetV1JournalentriesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, entityType, fromDate, glAccountId, limit, loanId, locale, manualEntriesOnly, officeId, offset, orderBy, runningBalance, savingsId, sortOrder, submittedOnDateFrom, submittedOnDateTo, toDate, transactionDetails, transactionId }: {
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
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesKeyFn({ dateFormat, entityType, fromDate, glAccountId, limit, loanId, locale, manualEntriesOnly, officeId, offset, orderBy, runningBalance, savingsId, sortOrder, submittedOnDateFrom, submittedOnDateTo, toDate, transactionDetails, transactionId }, queryKey), queryFn: () => JournalEntriesService.getV1Journalentries({ dateFormat, entityType, fromDate, glAccountId, limit, loanId, locale, manualEntriesOnly, officeId, offset, orderBy, runningBalance, savingsId, sortOrder, submittedOnDateFrom, submittedOnDateTo, toDate, transactionDetails, transactionId }) as TData, ...options });
export const useJournalEntriesServiceGetV1JournalentriesDownloadtemplate = <TData = Common.JournalEntriesServiceGetV1JournalentriesDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesDownloadtemplateKeyFn({ dateFormat, officeId }, queryKey), queryFn: () => JournalEntriesService.getV1JournalentriesDownloadtemplate({ dateFormat, officeId }) as TData, ...options });
export const useJournalEntriesServiceGetV1JournalentriesOpeningbalance = <TData = Common.JournalEntriesServiceGetV1JournalentriesOpeningbalanceDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ currencyCode, officeId }: {
  currencyCode?: string;
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesOpeningbalanceKeyFn({ currencyCode, officeId }, queryKey), queryFn: () => JournalEntriesService.getV1JournalentriesOpeningbalance({ currencyCode, officeId }) as TData, ...options });
export const useJournalEntriesServiceGetV1JournalentriesProvisioning = <TData = Common.JournalEntriesServiceGetV1JournalentriesProvisioningDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entryId, limit, offset }: {
  entryId?: number;
  limit?: number;
  offset?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesProvisioningKeyFn({ entryId, limit, offset }, queryKey), queryFn: () => JournalEntriesService.getV1JournalentriesProvisioning({ entryId, limit, offset }) as TData, ...options });
export const useJournalEntriesServiceGetV1JournalentriesByJournalEntryId = <TData = Common.JournalEntriesServiceGetV1JournalentriesByJournalEntryIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ journalEntryId, runningBalance, transactionDetails }: {
  journalEntryId: number;
  runningBalance?: boolean;
  transactionDetails?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesByJournalEntryIdKeyFn({ journalEntryId, runningBalance, transactionDetails }, queryKey), queryFn: () => JournalEntriesService.getV1JournalentriesByJournalEntryId({ journalEntryId, runningBalance, transactionDetails }) as TData, ...options });
export const useLikelihoodServiceGetV1LikelihoodByPpiName = <TData = Common.LikelihoodServiceGetV1LikelihoodByPpiNameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ ppiName }: {
  ppiName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLikelihoodServiceGetV1LikelihoodByPpiNameKeyFn({ ppiName }, queryKey), queryFn: () => LikelihoodService.getV1LikelihoodByPpiName({ ppiName }) as TData, ...options });
export const useLikelihoodServiceGetV1LikelihoodByPpiNameByLikelihoodId = <TData = Common.LikelihoodServiceGetV1LikelihoodByPpiNameByLikelihoodIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ likelihoodId, ppiName }: {
  likelihoodId: number;
  ppiName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLikelihoodServiceGetV1LikelihoodByPpiNameByLikelihoodIdKeyFn({ likelihoodId, ppiName }, queryKey), queryFn: () => LikelihoodService.getV1LikelihoodByPpiNameByLikelihoodId({ likelihoodId, ppiName }) as TData, ...options });
export const useLoanCollateralManagementServiceGetV1LoanCollateralManagementByCollateralId = <TData = Common.LoanCollateralManagementServiceGetV1LoanCollateralManagementByCollateralIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ collateralId }: {
  collateralId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanCollateralManagementServiceGetV1LoanCollateralManagementByCollateralIdKeyFn({ collateralId }, queryKey), queryFn: () => LoanCollateralManagementService.getV1LoanCollateralManagementByCollateralId({ collateralId }) as TData, ...options });
export const useLoanProductsServiceGetV1Loanproducts = <TData = Common.LoanProductsServiceGetV1LoanproductsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanProductsServiceGetV1LoanproductsKeyFn(queryKey), queryFn: () => LoanProductsService.getV1Loanproducts() as TData, ...options });
export const useLoanProductsServiceGetV1LoanproductsExternalIdByExternalProductId = <TData = Common.LoanProductsServiceGetV1LoanproductsExternalIdByExternalProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalProductId }: {
  externalProductId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanProductsServiceGetV1LoanproductsExternalIdByExternalProductIdKeyFn({ externalProductId }, queryKey), queryFn: () => LoanProductsService.getV1LoanproductsExternalIdByExternalProductId({ externalProductId }) as TData, ...options });
export const useLoanProductsServiceGetV1LoanproductsTemplate = <TData = Common.LoanProductsServiceGetV1LoanproductsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ isProductMixTemplate }: {
  isProductMixTemplate?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanProductsServiceGetV1LoanproductsTemplateKeyFn({ isProductMixTemplate }, queryKey), queryFn: () => LoanProductsService.getV1LoanproductsTemplate({ isProductMixTemplate }) as TData, ...options });
export const useLoanProductsServiceGetV1LoanproductsByProductId = <TData = Common.LoanProductsServiceGetV1LoanproductsByProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ productId }: {
  productId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanProductsServiceGetV1LoanproductsByProductIdKeyFn({ productId }, queryKey), queryFn: () => LoanProductsService.getV1LoanproductsByProductId({ productId }) as TData, ...options });
export const useProductMixServiceGetV1LoanproductsByProductIdProductmix = <TData = Common.ProductMixServiceGetV1LoanproductsByProductIdProductmixDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ productId }: {
  productId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseProductMixServiceGetV1LoanproductsByProductIdProductmixKeyFn({ productId }, queryKey), queryFn: () => ProductMixService.getV1LoanproductsByProductIdProductmix({ productId }) as TData, ...options });
export const useLoansServiceGetV1Loans = <TData = Common.LoansServiceGetV1LoansDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountNo, associations, clientId, externalId, limit, offset, orderBy, sortOrder, status }: {
  accountNo?: string;
  associations?: string;
  clientId?: number;
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  status?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansKeyFn({ accountNo, associations, clientId, externalId, limit, offset, orderBy, sortOrder, status }, queryKey), queryFn: () => LoansService.getV1Loans({ accountNo, associations, clientId, externalId, limit, offset, orderBy, sortOrder, status }) as TData, ...options });
export const useLoansServiceGetV1LoansDownloadtemplate = <TData = Common.LoansServiceGetV1LoansDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansDownloadtemplateKeyFn({ dateFormat, officeId, staffId }, queryKey), queryFn: () => LoansService.getV1LoansDownloadtemplate({ dateFormat, officeId, staffId }) as TData, ...options });
export const useLoansServiceGetV1LoansExternalIdByLoanExternalId = <TData = Common.LoansServiceGetV1LoansExternalIdByLoanExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ associations, exclude, fields, loanExternalId, staffInSelectedOfficeOnly }: {
  associations?: string;
  exclude?: string;
  fields?: string;
  loanExternalId: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdKeyFn({ associations, exclude, fields, loanExternalId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalId({ associations, exclude, fields, loanExternalId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useLoansServiceGetV1LoansExternalIdByLoanExternalIdApprovedAmount = <TData = Common.LoansServiceGetV1LoansExternalIdByLoanExternalIdApprovedAmountDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdApprovedAmountKeyFn({ loanExternalId }, queryKey), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalIdApprovedAmount({ loanExternalId }) as TData, ...options });
export const useLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencyActions = <TData = Common.LoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencyActionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencyActionsKeyFn({ loanExternalId }, queryKey), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalIdDelinquencyActions({ loanExternalId }) as TData, ...options });
export const useLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencytags = <TData = Common.LoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencytagsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencytagsKeyFn({ loanExternalId }, queryKey), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalIdDelinquencytags({ loanExternalId }) as TData, ...options });
export const useLoansServiceGetV1LoansExternalIdByLoanExternalIdTemplate = <TData = Common.LoansServiceGetV1LoansExternalIdByLoanExternalIdTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId, templateType }: {
  loanExternalId: string;
  templateType?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdTemplateKeyFn({ loanExternalId, templateType }, queryKey), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalIdTemplate({ loanExternalId, templateType }) as TData, ...options });
export const useLoansServiceGetV1LoansGlimAccountByGlimId = <TData = Common.LoansServiceGetV1LoansGlimAccountByGlimIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ glimId }: {
  glimId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansGlimAccountByGlimIdKeyFn({ glimId }, queryKey), queryFn: () => LoansService.getV1LoansGlimAccountByGlimId({ glimId }) as TData, ...options });
export const useLoansServiceGetV1LoansRepaymentsDownloadtemplate = <TData = Common.LoansServiceGetV1LoansRepaymentsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansRepaymentsDownloadtemplateKeyFn({ dateFormat, officeId }, queryKey), queryFn: () => LoansService.getV1LoansRepaymentsDownloadtemplate({ dateFormat, officeId }) as TData, ...options });
export const useLoansServiceGetV1LoansTemplate = <TData = Common.LoansServiceGetV1LoansTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ activeOnly, clientId, groupId, productId, staffInSelectedOfficeOnly, templateType }: {
  activeOnly?: boolean;
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
  templateType?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansTemplateKeyFn({ activeOnly, clientId, groupId, productId, staffInSelectedOfficeOnly, templateType }, queryKey), queryFn: () => LoansService.getV1LoansTemplate({ activeOnly, clientId, groupId, productId, staffInSelectedOfficeOnly, templateType }) as TData, ...options });
export const useLoansServiceGetV1LoansByLoanId = <TData = Common.LoansServiceGetV1LoansByLoanIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ associations, exclude, fields, loanId, staffInSelectedOfficeOnly }: {
  associations?: string;
  exclude?: string;
  fields?: string;
  loanId: number;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdKeyFn({ associations, exclude, fields, loanId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => LoansService.getV1LoansByLoanId({ associations, exclude, fields, loanId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useLoansServiceGetV1LoansByLoanIdApprovedAmount = <TData = Common.LoansServiceGetV1LoansByLoanIdApprovedAmountDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdApprovedAmountKeyFn({ loanId }, queryKey), queryFn: () => LoansService.getV1LoansByLoanIdApprovedAmount({ loanId }) as TData, ...options });
export const useLoansServiceGetV1LoansByLoanIdDelinquencyActions = <TData = Common.LoansServiceGetV1LoansByLoanIdDelinquencyActionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdDelinquencyActionsKeyFn({ loanId }, queryKey), queryFn: () => LoansService.getV1LoansByLoanIdDelinquencyActions({ loanId }) as TData, ...options });
export const useLoansServiceGetV1LoansByLoanIdDelinquencytags = <TData = Common.LoansServiceGetV1LoansByLoanIdDelinquencytagsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdDelinquencytagsKeyFn({ loanId }, queryKey), queryFn: () => LoansService.getV1LoansByLoanIdDelinquencytags({ loanId }) as TData, ...options });
export const useLoansServiceGetV1LoansByLoanIdTemplate = <TData = Common.LoansServiceGetV1LoansByLoanIdTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId, templateType }: {
  loanId: number;
  templateType?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdTemplateKeyFn({ loanId, templateType }, queryKey), queryFn: () => LoansService.getV1LoansByLoanIdTemplate({ loanId, templateType }) as TData, ...options });
export const useLoansPointInTimeServiceGetV1LoansAtDateExternalIdByLoanExternalId = <TData = Common.LoansPointInTimeServiceGetV1LoansAtDateExternalIdByLoanExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ date, dateFormat, loanExternalId, locale }: {
  date: DateParam;
  dateFormat?: string;
  loanExternalId: string;
  locale?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoansPointInTimeServiceGetV1LoansAtDateExternalIdByLoanExternalIdKeyFn({ date, dateFormat, loanExternalId, locale }, queryKey), queryFn: () => LoansPointInTimeService.getV1LoansAtDateExternalIdByLoanExternalId({ date, dateFormat, loanExternalId, locale }) as TData, ...options });
export const useLoansPointInTimeServiceGetV1LoansAtDateByLoanId = <TData = Common.LoansPointInTimeServiceGetV1LoansAtDateByLoanIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ date, dateFormat, loanId, locale }: {
  date: DateParam;
  dateFormat?: string;
  loanId: number;
  locale?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoansPointInTimeServiceGetV1LoansAtDateByLoanIdKeyFn({ date, dateFormat, loanId, locale }, queryKey), queryFn: () => LoansPointInTimeService.getV1LoansAtDateByLoanId({ date, dateFormat, loanId, locale }) as TData, ...options });
export const useLoanCobCatchUpServiceGetV1LoansIsCatchUpRunning = <TData = Common.LoanCobCatchUpServiceGetV1LoansIsCatchUpRunningDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanCobCatchUpServiceGetV1LoansIsCatchUpRunningKeyFn(queryKey), queryFn: () => LoanCobCatchUpService.getV1LoansIsCatchUpRunning() as TData, ...options });
export const useLoanCobCatchUpServiceGetV1LoansOldestCobClosed = <TData = Common.LoanCobCatchUpServiceGetV1LoansOldestCobClosedDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanCobCatchUpServiceGetV1LoansOldestCobClosedKeyFn(queryKey), queryFn: () => LoanCobCatchUpService.getV1LoansOldestCobClosed() as TData, ...options });
export const useLoanBuyDownFeesServiceGetV1LoansExternalIdByLoanExternalIdBuydownFees = <TData = Common.LoanBuyDownFeesServiceGetV1LoansExternalIdByLoanExternalIdBuydownFeesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanBuyDownFeesServiceGetV1LoansExternalIdByLoanExternalIdBuydownFeesKeyFn({ loanExternalId }, queryKey), queryFn: () => LoanBuyDownFeesService.getV1LoansExternalIdByLoanExternalIdBuydownFees({ loanExternalId }) as TData, ...options });
export const useLoanBuyDownFeesServiceGetV1LoansByLoanIdBuydownFees = <TData = Common.LoanBuyDownFeesServiceGetV1LoansByLoanIdBuydownFeesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanBuyDownFeesServiceGetV1LoansByLoanIdBuydownFeesKeyFn({ loanId }, queryKey), queryFn: () => LoanBuyDownFeesService.getV1LoansByLoanIdBuydownFees({ loanId }) as TData, ...options });
export const useLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdCapitalizedIncomes = <TData = Common.LoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdCapitalizedIncomesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdCapitalizedIncomesKeyFn({ loanExternalId }, queryKey), queryFn: () => LoanCapitalizedIncomeService.getV1LoansExternalIdByLoanExternalIdCapitalizedIncomes({ loanExternalId }) as TData, ...options });
export const useLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdDeferredincome = <TData = Common.LoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdDeferredincomeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdDeferredincomeKeyFn({ loanExternalId }, queryKey), queryFn: () => LoanCapitalizedIncomeService.getV1LoansExternalIdByLoanExternalIdDeferredincome({ loanExternalId }) as TData, ...options });
export const useLoanCapitalizedIncomeServiceGetV1LoansByLoanIdCapitalizedIncomes = <TData = Common.LoanCapitalizedIncomeServiceGetV1LoansByLoanIdCapitalizedIncomesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanCapitalizedIncomeServiceGetV1LoansByLoanIdCapitalizedIncomesKeyFn({ loanId }, queryKey), queryFn: () => LoanCapitalizedIncomeService.getV1LoansByLoanIdCapitalizedIncomes({ loanId }) as TData, ...options });
export const useLoanCapitalizedIncomeServiceGetV1LoansByLoanIdDeferredincome = <TData = Common.LoanCapitalizedIncomeServiceGetV1LoansByLoanIdDeferredincomeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanCapitalizedIncomeServiceGetV1LoansByLoanIdDeferredincomeKeyFn({ loanId }, queryKey), queryFn: () => LoanCapitalizedIncomeService.getV1LoansByLoanIdDeferredincome({ loanId }) as TData, ...options });
export const useLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdCharges = <TData = Common.LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesKeyFn({ loanExternalId }, queryKey), queryFn: () => LoanChargesService.getV1LoansExternalIdByLoanExternalIdCharges({ loanExternalId }) as TData, ...options });
export const useLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalId = <TData = Common.LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanChargeExternalId, loanExternalId }: {
  loanChargeExternalId: string;
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdKeyFn({ loanChargeExternalId, loanExternalId }, queryKey), queryFn: () => LoanChargesService.getV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalId({ loanChargeExternalId, loanExternalId }) as TData, ...options });
export const useLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesTemplate = <TData = Common.LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesTemplateKeyFn({ loanExternalId }, queryKey), queryFn: () => LoanChargesService.getV1LoansExternalIdByLoanExternalIdChargesTemplate({ loanExternalId }) as TData, ...options });
export const useLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesByLoanChargeId = <TData = Common.LoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanChargeId, loanExternalId }: {
  loanChargeId: number;
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdKeyFn({ loanChargeId, loanExternalId }, queryKey), queryFn: () => LoanChargesService.getV1LoansExternalIdByLoanExternalIdChargesByLoanChargeId({ loanChargeId, loanExternalId }) as TData, ...options });
export const useLoanChargesServiceGetV1LoansByLoanIdCharges = <TData = Common.LoanChargesServiceGetV1LoansByLoanIdChargesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanChargesServiceGetV1LoansByLoanIdChargesKeyFn({ loanId }, queryKey), queryFn: () => LoanChargesService.getV1LoansByLoanIdCharges({ loanId }) as TData, ...options });
export const useLoanChargesServiceGetV1LoansByLoanIdChargesExternalIdByLoanChargeExternalId = <TData = Common.LoanChargesServiceGetV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanChargeExternalId, loanId }: {
  loanChargeExternalId: string;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanChargesServiceGetV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdKeyFn({ loanChargeExternalId, loanId }, queryKey), queryFn: () => LoanChargesService.getV1LoansByLoanIdChargesExternalIdByLoanChargeExternalId({ loanChargeExternalId, loanId }) as TData, ...options });
export const useLoanChargesServiceGetV1LoansByLoanIdChargesTemplate = <TData = Common.LoanChargesServiceGetV1LoansByLoanIdChargesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanChargesServiceGetV1LoansByLoanIdChargesTemplateKeyFn({ loanId }, queryKey), queryFn: () => LoanChargesService.getV1LoansByLoanIdChargesTemplate({ loanId }) as TData, ...options });
export const useLoanChargesServiceGetV1LoansByLoanIdChargesByLoanChargeId = <TData = Common.LoanChargesServiceGetV1LoansByLoanIdChargesByLoanChargeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanChargeId, loanId }: {
  loanChargeId: number;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanChargesServiceGetV1LoansByLoanIdChargesByLoanChargeIdKeyFn({ loanChargeId, loanId }, queryKey), queryFn: () => LoanChargesService.getV1LoansByLoanIdChargesByLoanChargeId({ loanChargeId, loanId }) as TData, ...options });
export const useLoanInterestPauseServiceGetV1LoansExternalIdByLoanExternalIdInterestPauses = <TData = Common.LoanInterestPauseServiceGetV1LoansExternalIdByLoanExternalIdInterestPausesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanExternalId }: {
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanInterestPauseServiceGetV1LoansExternalIdByLoanExternalIdInterestPausesKeyFn({ loanExternalId }, queryKey), queryFn: () => LoanInterestPauseService.getV1LoansExternalIdByLoanExternalIdInterestPauses({ loanExternalId }) as TData, ...options });
export const useLoanInterestPauseServiceGetV1LoansByLoanIdInterestPauses = <TData = Common.LoanInterestPauseServiceGetV1LoansByLoanIdInterestPausesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanInterestPauseServiceGetV1LoansByLoanIdInterestPausesKeyFn({ loanId }, queryKey), queryFn: () => LoanInterestPauseService.getV1LoansByLoanIdInterestPauses({ loanId }) as TData, ...options });
export const useLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactions = <TData = Common.LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ excludedTypes, loanExternalId, page, size, sort }: {
  excludedTypes?: TransactionType[];
  loanExternalId: string;
  page?: number;
  size?: number;
  sort?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsKeyFn({ excludedTypes, loanExternalId, page, size, sort }, queryKey), queryFn: () => LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactions({ excludedTypes, loanExternalId, page, size, sort }) as TData, ...options });
export const useLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionId = <TData = Common.LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalTransactionId, fields, loanExternalId }: {
  externalTransactionId: string;
  fields?: string;
  loanExternalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionIdKeyFn({ externalTransactionId, fields, loanExternalId }, queryKey), queryFn: () => LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionId({ externalTransactionId, fields, loanExternalId }) as TData, ...options });
export const useLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsTemplate = <TData = Common.LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ command, dateFormat, loanExternalId, locale, transactionDate, transactionId }: {
  command?: string;
  dateFormat?: string;
  loanExternalId: string;
  locale?: string;
  transactionDate?: DateParam;
  transactionId?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsTemplateKeyFn({ command, dateFormat, loanExternalId, locale, transactionDate, transactionId }, queryKey), queryFn: () => LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactionsTemplate({ command, dateFormat, loanExternalId, locale, transactionDate, transactionId }) as TData, ...options });
export const useLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsByTransactionId = <TData = Common.LoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fields, loanExternalId, transactionId }: {
  fields?: string;
  loanExternalId: string;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdKeyFn({ fields, loanExternalId, transactionId }, queryKey), queryFn: () => LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactionsByTransactionId({ fields, loanExternalId, transactionId }) as TData, ...options });
export const useLoanTransactionsServiceGetV1LoansByLoanIdTransactions = <TData = Common.LoanTransactionsServiceGetV1LoansByLoanIdTransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ excludedTypes, loanId, page, size, sort }: {
  excludedTypes?: TransactionType[];
  loanId: number;
  page?: number;
  size?: number;
  sort?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsKeyFn({ excludedTypes, loanId, page, size, sort }, queryKey), queryFn: () => LoanTransactionsService.getV1LoansByLoanIdTransactions({ excludedTypes, loanId, page, size, sort }) as TData, ...options });
export const useLoanTransactionsServiceGetV1LoansByLoanIdTransactionsExternalIdByExternalTransactionId = <TData = Common.LoanTransactionsServiceGetV1LoansByLoanIdTransactionsExternalIdByExternalTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalTransactionId, fields, loanId }: {
  externalTransactionId: string;
  fields?: string;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsExternalIdByExternalTransactionIdKeyFn({ externalTransactionId, fields, loanId }, queryKey), queryFn: () => LoanTransactionsService.getV1LoansByLoanIdTransactionsExternalIdByExternalTransactionId({ externalTransactionId, fields, loanId }) as TData, ...options });
export const useLoanTransactionsServiceGetV1LoansByLoanIdTransactionsTemplate = <TData = Common.LoanTransactionsServiceGetV1LoansByLoanIdTransactionsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ command, dateFormat, loanId, locale, transactionDate, transactionId }: {
  command?: string;
  dateFormat?: string;
  loanId: number;
  locale?: string;
  transactionDate?: DateParam;
  transactionId?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsTemplateKeyFn({ command, dateFormat, loanId, locale, transactionDate, transactionId }, queryKey), queryFn: () => LoanTransactionsService.getV1LoansByLoanIdTransactionsTemplate({ command, dateFormat, loanId, locale, transactionDate, transactionId }) as TData, ...options });
export const useLoanTransactionsServiceGetV1LoansByLoanIdTransactionsByTransactionId = <TData = Common.LoanTransactionsServiceGetV1LoansByLoanIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fields, loanId, transactionId }: {
  fields?: string;
  loanId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsByTransactionIdKeyFn({ fields, loanId, transactionId }, queryKey), queryFn: () => LoanTransactionsService.getV1LoansByLoanIdTransactionsByTransactionId({ fields, loanId, transactionId }) as TData, ...options });
export const useBulkLoansServiceGetV1LoansLoanreassignmentTemplate = <TData = Common.BulkLoansServiceGetV1LoansLoanreassignmentTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fromLoanOfficerId, officeId }: {
  fromLoanOfficerId?: number;
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseBulkLoansServiceGetV1LoansLoanreassignmentTemplateKeyFn({ fromLoanOfficerId, officeId }, queryKey), queryFn: () => BulkLoansService.getV1LoansLoanreassignmentTemplate({ fromLoanOfficerId, officeId }) as TData, ...options });
export const useLoanAccountLockServiceGetV1LoansLocked = <TData = Common.LoanAccountLockServiceGetV1LoansLockedDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, page }: {
  limit?: number;
  page?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanAccountLockServiceGetV1LoansLockedKeyFn({ limit, page }, queryKey), queryFn: () => LoanAccountLockService.getV1LoansLocked({ limit, page }) as TData, ...options });
export const useLoanCollateralServiceGetV1LoansByLoanIdCollaterals = <TData = Common.LoanCollateralServiceGetV1LoansByLoanIdCollateralsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanCollateralServiceGetV1LoansByLoanIdCollateralsKeyFn({ loanId }, queryKey), queryFn: () => LoanCollateralService.getV1LoansByLoanIdCollaterals({ loanId }) as TData, ...options });
export const useLoanCollateralServiceGetV1LoansByLoanIdCollateralsTemplate = <TData = Common.LoanCollateralServiceGetV1LoansByLoanIdCollateralsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanCollateralServiceGetV1LoansByLoanIdCollateralsTemplateKeyFn({ loanId }, queryKey), queryFn: () => LoanCollateralService.getV1LoansByLoanIdCollateralsTemplate({ loanId }) as TData, ...options });
export const useLoanCollateralServiceGetV1LoansByLoanIdCollateralsByCollateralId = <TData = Common.LoanCollateralServiceGetV1LoansByLoanIdCollateralsByCollateralIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ collateralId, loanId }: {
  collateralId: number;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanCollateralServiceGetV1LoansByLoanIdCollateralsByCollateralIdKeyFn({ collateralId, loanId }, queryKey), queryFn: () => LoanCollateralService.getV1LoansByLoanIdCollateralsByCollateralId({ collateralId, loanId }) as TData, ...options });
export const useLoanDisbursementDetailsServiceGetV1LoansByLoanIdDisbursementsByDisbursementId = <TData = Common.LoanDisbursementDetailsServiceGetV1LoansByLoanIdDisbursementsByDisbursementIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ disbursementId, loanId }: {
  disbursementId: number;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseLoanDisbursementDetailsServiceGetV1LoansByLoanIdDisbursementsByDisbursementIdKeyFn({ disbursementId, loanId }, queryKey), queryFn: () => LoanDisbursementDetailsService.getV1LoansByLoanIdDisbursementsByDisbursementId({ disbursementId, loanId }) as TData, ...options });
export const useGuarantorsServiceGetV1LoansByLoanIdGuarantors = <TData = Common.GuarantorsServiceGetV1LoansByLoanIdGuarantorsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsKeyFn({ loanId }, queryKey), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantors({ loanId }) as TData, ...options });
export const useGuarantorsServiceGetV1LoansByLoanIdGuarantorsAccountsTemplate = <TData = Common.GuarantorsServiceGetV1LoansByLoanIdGuarantorsAccountsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, loanId }: {
  clientId?: number;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsAccountsTemplateKeyFn({ clientId, loanId }, queryKey), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantorsAccountsTemplate({ clientId, loanId }) as TData, ...options });
export const useGuarantorsServiceGetV1LoansByLoanIdGuarantorsDownloadtemplate = <TData = Common.GuarantorsServiceGetV1LoansByLoanIdGuarantorsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, loanId, officeId }: {
  dateFormat?: string;
  loanId: number;
  officeId?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsDownloadtemplateKeyFn({ dateFormat, loanId, officeId }, queryKey), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantorsDownloadtemplate({ dateFormat, loanId, officeId }) as TData, ...options });
export const useGuarantorsServiceGetV1LoansByLoanIdGuarantorsTemplate = <TData = Common.GuarantorsServiceGetV1LoansByLoanIdGuarantorsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsTemplateKeyFn({ loanId }, queryKey), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantorsTemplate({ loanId }) as TData, ...options });
export const useGuarantorsServiceGetV1LoansByLoanIdGuarantorsByGuarantorId = <TData = Common.GuarantorsServiceGetV1LoansByLoanIdGuarantorsByGuarantorIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ guarantorId, loanId }: {
  guarantorId: number;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsByGuarantorIdKeyFn({ guarantorId, loanId }, queryKey), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantorsByGuarantorId({ guarantorId, loanId }) as TData, ...options });
export const useRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecks = <TData = Common.RepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksKeyFn({ loanId }, queryKey), queryFn: () => RepaymentWithPostDatedChecksService.getV1LoansByLoanIdPostdatedchecks({ loanId }) as TData, ...options });
export const useRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksByInstallmentId = <TData = Common.RepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksByInstallmentIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ installmentId, loanId }: {
  installmentId: number;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksByInstallmentIdKeyFn({ installmentId, loanId }, queryKey), queryFn: () => RepaymentWithPostDatedChecksService.getV1LoansByLoanIdPostdatedchecksByInstallmentId({ installmentId, loanId }) as TData, ...options });
export const useMakerCheckerOr4EyeFunctionalityServiceGetV1Makercheckers = <TData = Common.MakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ actionName, clientId, entityName, groupId, loanid, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, resourceId, savingsAccountId }: {
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
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersKeyFn({ actionName, clientId, entityName, groupId, loanid, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, resourceId, savingsAccountId }, queryKey), queryFn: () => MakerCheckerOr4EyeFunctionalityService.getV1Makercheckers({ actionName, clientId, entityName, groupId, loanid, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, resourceId, savingsAccountId }) as TData, ...options });
export const useMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSearchtemplate = <TData = Common.MakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSearchtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSearchtemplateKeyFn(queryKey), queryFn: () => MakerCheckerOr4EyeFunctionalityService.getV1MakercheckersSearchtemplate() as TData, ...options });
export const useMixMappingServiceGetV1Mixmapping = <TData = Common.MixMappingServiceGetV1MixmappingDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMixMappingServiceGetV1MixmappingKeyFn(queryKey), queryFn: () => MixMappingService.getV1Mixmapping() as TData, ...options });
export const useMixReportServiceGetV1Mixreport = <TData = Common.MixReportServiceGetV1MixreportDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ currency, endDate, startDate }: {
  currency?: string;
  endDate?: string;
  startDate?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMixReportServiceGetV1MixreportKeyFn({ currency, endDate, startDate }, queryKey), queryFn: () => MixReportService.getV1Mixreport({ currency, endDate, startDate }) as TData, ...options });
export const useMixTaxonomyServiceGetV1Mixtaxonomy = <TData = Common.MixTaxonomyServiceGetV1MixtaxonomyDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMixTaxonomyServiceGetV1MixtaxonomyKeyFn(queryKey), queryFn: () => MixTaxonomyService.getV1Mixtaxonomy() as TData, ...options });
export const useNotificationServiceGetV1Notifications = <TData = Common.NotificationServiceGetV1NotificationsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ isRead, limit, offset, orderBy, sortOrder }: {
  isRead?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseNotificationServiceGetV1NotificationsKeyFn({ isRead, limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => NotificationService.getV1Notifications({ isRead, limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useOfficesServiceGetV1Offices = <TData = Common.OfficesServiceGetV1OfficesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ includeAllOffices, orderBy, sortOrder }: {
  includeAllOffices?: boolean;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseOfficesServiceGetV1OfficesKeyFn({ includeAllOffices, orderBy, sortOrder }, queryKey), queryFn: () => OfficesService.getV1Offices({ includeAllOffices, orderBy, sortOrder }) as TData, ...options });
export const useOfficesServiceGetV1OfficesDownloadtemplate = <TData = Common.OfficesServiceGetV1OfficesDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat }: {
  dateFormat?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseOfficesServiceGetV1OfficesDownloadtemplateKeyFn({ dateFormat }, queryKey), queryFn: () => OfficesService.getV1OfficesDownloadtemplate({ dateFormat }) as TData, ...options });
export const useOfficesServiceGetV1OfficesExternalIdByExternalId = <TData = Common.OfficesServiceGetV1OfficesExternalIdByExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalId }: {
  externalId: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseOfficesServiceGetV1OfficesExternalIdByExternalIdKeyFn({ externalId }, queryKey), queryFn: () => OfficesService.getV1OfficesExternalIdByExternalId({ externalId }) as TData, ...options });
export const useOfficesServiceGetV1OfficesTemplate = <TData = Common.OfficesServiceGetV1OfficesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseOfficesServiceGetV1OfficesTemplateKeyFn(queryKey), queryFn: () => OfficesService.getV1OfficesTemplate() as TData, ...options });
export const useOfficesServiceGetV1OfficesByOfficeId = <TData = Common.OfficesServiceGetV1OfficesByOfficeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ officeId }: {
  officeId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseOfficesServiceGetV1OfficesByOfficeIdKeyFn({ officeId }, queryKey), queryFn: () => OfficesService.getV1OfficesByOfficeId({ officeId }) as TData, ...options });
export const usePasswordPreferencesServiceGetV1Passwordpreferences = <TData = Common.PasswordPreferencesServiceGetV1PasswordpreferencesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UsePasswordPreferencesServiceGetV1PasswordpreferencesKeyFn(queryKey), queryFn: () => PasswordPreferencesService.getV1Passwordpreferences() as TData, ...options });
export const usePasswordPreferencesServiceGetV1PasswordpreferencesTemplate = <TData = Common.PasswordPreferencesServiceGetV1PasswordpreferencesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UsePasswordPreferencesServiceGetV1PasswordpreferencesTemplateKeyFn(queryKey), queryFn: () => PasswordPreferencesService.getV1PasswordpreferencesTemplate() as TData, ...options });
export const usePaymentTypeServiceGetV1Paymenttypes = <TData = Common.PaymentTypeServiceGetV1PaymenttypesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ onlyWithCode }: {
  onlyWithCode?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UsePaymentTypeServiceGetV1PaymenttypesKeyFn({ onlyWithCode }, queryKey), queryFn: () => PaymentTypeService.getV1Paymenttypes({ onlyWithCode }) as TData, ...options });
export const usePaymentTypeServiceGetV1PaymenttypesByPaymentTypeId = <TData = Common.PaymentTypeServiceGetV1PaymenttypesByPaymentTypeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ paymentTypeId }: {
  paymentTypeId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UsePaymentTypeServiceGetV1PaymenttypesByPaymentTypeIdKeyFn({ paymentTypeId }, queryKey), queryFn: () => PaymentTypeService.getV1PaymenttypesByPaymentTypeId({ paymentTypeId }) as TData, ...options });
export const usePermissionsServiceGetV1Permissions = <TData = Common.PermissionsServiceGetV1PermissionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UsePermissionsServiceGetV1PermissionsKeyFn(queryKey), queryFn: () => PermissionsService.getV1Permissions() as TData, ...options });
export const usePovertyLineServiceGetV1PovertyLineByPpiName = <TData = Common.PovertyLineServiceGetV1PovertyLineByPpiNameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ ppiName }: {
  ppiName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UsePovertyLineServiceGetV1PovertyLineByPpiNameKeyFn({ ppiName }, queryKey), queryFn: () => PovertyLineService.getV1PovertyLineByPpiName({ ppiName }) as TData, ...options });
export const usePovertyLineServiceGetV1PovertyLineByPpiNameByLikelihoodId = <TData = Common.PovertyLineServiceGetV1PovertyLineByPpiNameByLikelihoodIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ likelihoodId, ppiName }: {
  likelihoodId: number;
  ppiName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UsePovertyLineServiceGetV1PovertyLineByPpiNameByLikelihoodIdKeyFn({ likelihoodId, ppiName }, queryKey), queryFn: () => PovertyLineService.getV1PovertyLineByPpiNameByLikelihoodId({ likelihoodId, ppiName }) as TData, ...options });
export const useProductsServiceGetV1ProductsByType = <TData = Common.ProductsServiceGetV1ProductsByTypeDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, type }: {
  limit?: number;
  offset?: number;
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseProductsServiceGetV1ProductsByTypeKeyFn({ limit, offset, type }, queryKey), queryFn: () => ProductsService.getV1ProductsByType({ limit, offset, type }) as TData, ...options });
export const useProductsServiceGetV1ProductsByTypeTemplate = <TData = Common.ProductsServiceGetV1ProductsByTypeTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ type }: {
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseProductsServiceGetV1ProductsByTypeTemplateKeyFn({ type }, queryKey), queryFn: () => ProductsService.getV1ProductsByTypeTemplate({ type }) as TData, ...options });
export const useProductsServiceGetV1ProductsByTypeByProductId = <TData = Common.ProductsServiceGetV1ProductsByTypeByProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ productId, type }: {
  productId: number;
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseProductsServiceGetV1ProductsByTypeByProductIdKeyFn({ productId, type }, queryKey), queryFn: () => ProductsService.getV1ProductsByTypeByProductId({ productId, type }) as TData, ...options });
export const useProvisioningCategoryServiceGetV1Provisioningcategory = <TData = Common.ProvisioningCategoryServiceGetV1ProvisioningcategoryDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseProvisioningCategoryServiceGetV1ProvisioningcategoryKeyFn(queryKey), queryFn: () => ProvisioningCategoryService.getV1Provisioningcategory() as TData, ...options });
export const useProvisioningCriteriaServiceGetV1Provisioningcriteria = <TData = Common.ProvisioningCriteriaServiceGetV1ProvisioningcriteriaDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseProvisioningCriteriaServiceGetV1ProvisioningcriteriaKeyFn(queryKey), queryFn: () => ProvisioningCriteriaService.getV1Provisioningcriteria() as TData, ...options });
export const useProvisioningCriteriaServiceGetV1ProvisioningcriteriaTemplate = <TData = Common.ProvisioningCriteriaServiceGetV1ProvisioningcriteriaTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseProvisioningCriteriaServiceGetV1ProvisioningcriteriaTemplateKeyFn(queryKey), queryFn: () => ProvisioningCriteriaService.getV1ProvisioningcriteriaTemplate() as TData, ...options });
export const useProvisioningCriteriaServiceGetV1ProvisioningcriteriaByCriteriaId = <TData = Common.ProvisioningCriteriaServiceGetV1ProvisioningcriteriaByCriteriaIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ criteriaId }: {
  criteriaId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseProvisioningCriteriaServiceGetV1ProvisioningcriteriaByCriteriaIdKeyFn({ criteriaId }, queryKey), queryFn: () => ProvisioningCriteriaService.getV1ProvisioningcriteriaByCriteriaId({ criteriaId }) as TData, ...options });
export const useProvisioningEntriesServiceGetV1Provisioningentries = <TData = Common.ProvisioningEntriesServiceGetV1ProvisioningentriesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset }: {
  limit?: number;
  offset?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseProvisioningEntriesServiceGetV1ProvisioningentriesKeyFn({ limit, offset }, queryKey), queryFn: () => ProvisioningEntriesService.getV1Provisioningentries({ limit, offset }) as TData, ...options });
export const useProvisioningEntriesServiceGetV1ProvisioningentriesEntries = <TData = Common.ProvisioningEntriesServiceGetV1ProvisioningentriesEntriesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ categoryId, entryId, limit, officeId, offset, productId }: {
  categoryId?: number;
  entryId?: number;
  limit?: number;
  officeId?: number;
  offset?: number;
  productId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseProvisioningEntriesServiceGetV1ProvisioningentriesEntriesKeyFn({ categoryId, entryId, limit, officeId, offset, productId }, queryKey), queryFn: () => ProvisioningEntriesService.getV1ProvisioningentriesEntries({ categoryId, entryId, limit, officeId, offset, productId }) as TData, ...options });
export const useProvisioningEntriesServiceGetV1ProvisioningentriesByEntryId = <TData = Common.ProvisioningEntriesServiceGetV1ProvisioningentriesByEntryIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entryId }: {
  entryId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseProvisioningEntriesServiceGetV1ProvisioningentriesByEntryIdKeyFn({ entryId }, queryKey), queryFn: () => ProvisioningEntriesService.getV1ProvisioningentriesByEntryId({ entryId }) as TData, ...options });
export const useRateServiceGetV1Rates = <TData = Common.RateServiceGetV1RatesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRateServiceGetV1RatesKeyFn(queryKey), queryFn: () => RateService.getV1Rates() as TData, ...options });
export const useRateServiceGetV1RatesByRateId = <TData = Common.RateServiceGetV1RatesByRateIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ rateId }: {
  rateId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRateServiceGetV1RatesByRateIdKeyFn({ rateId }, queryKey), queryFn: () => RateService.getV1RatesByRateId({ rateId }) as TData, ...options });
export const useRecurringDepositAccountServiceGetV1Recurringdepositaccounts = <TData = Common.RecurringDepositAccountServiceGetV1RecurringdepositaccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, paged, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  paged?: boolean;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsKeyFn({ limit, offset, orderBy, paged, sortOrder }, queryKey), queryFn: () => RecurringDepositAccountService.getV1Recurringdepositaccounts({ limit, offset, orderBy, paged, sortOrder }) as TData, ...options });
export const useRecurringDepositAccountServiceGetV1RecurringdepositaccountsDownloadtemplate = <TData = Common.RecurringDepositAccountServiceGetV1RecurringdepositaccountsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsDownloadtemplateKeyFn({ dateFormat, officeId, staffId }, queryKey), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsDownloadtemplate({ dateFormat, officeId, staffId }) as TData, ...options });
export const useRecurringDepositAccountServiceGetV1RecurringdepositaccountsTemplate = <TData = Common.RecurringDepositAccountServiceGetV1RecurringdepositaccountsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, groupId, productId, staffInSelectedOfficeOnly }: {
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsTemplateKeyFn({ clientId, groupId, productId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsTemplate({ clientId, groupId, productId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useRecurringDepositAccountServiceGetV1RecurringdepositaccountsTransactionsDownloadtemplate = <TData = Common.RecurringDepositAccountServiceGetV1RecurringdepositaccountsTransactionsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsTransactionsDownloadtemplateKeyFn({ dateFormat, officeId }, queryKey), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsTransactionsDownloadtemplate({ dateFormat, officeId }) as TData, ...options });
export const useRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountId = <TData = Common.RecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, chargeStatus, staffInSelectedOfficeOnly }: {
  accountId: number;
  chargeStatus?: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdKeyFn({ accountId, chargeStatus, staffInSelectedOfficeOnly }, queryKey), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsByAccountId({ accountId, chargeStatus, staffInSelectedOfficeOnly }) as TData, ...options });
export const useRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdTemplate = <TData = Common.RecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, command }: {
  accountId: number;
  command?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdTemplateKeyFn({ accountId, command }, queryKey), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsByAccountIdTemplate({ accountId, command }) as TData, ...options });
export const useRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplate = <TData = Common.RecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ command, recurringDepositAccountId }: {
  command?: string;
  recurringDepositAccountId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplateKeyFn({ command, recurringDepositAccountId }, queryKey), queryFn: () => RecurringDepositAccountTransactionsService.getV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplate({ command, recurringDepositAccountId }) as TData, ...options });
export const useRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionId = <TData = Common.RecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ recurringDepositAccountId, transactionId }: {
  recurringDepositAccountId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionIdKeyFn({ recurringDepositAccountId, transactionId }, queryKey), queryFn: () => RecurringDepositAccountTransactionsService.getV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionId({ recurringDepositAccountId, transactionId }) as TData, ...options });
export const useRecurringDepositProductServiceGetV1Recurringdepositproducts = <TData = Common.RecurringDepositProductServiceGetV1RecurringdepositproductsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRecurringDepositProductServiceGetV1RecurringdepositproductsKeyFn(queryKey), queryFn: () => RecurringDepositProductService.getV1Recurringdepositproducts() as TData, ...options });
export const useRecurringDepositProductServiceGetV1RecurringdepositproductsTemplate = <TData = Common.RecurringDepositProductServiceGetV1RecurringdepositproductsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRecurringDepositProductServiceGetV1RecurringdepositproductsTemplateKeyFn(queryKey), queryFn: () => RecurringDepositProductService.getV1RecurringdepositproductsTemplate() as TData, ...options });
export const useRecurringDepositProductServiceGetV1RecurringdepositproductsByProductId = <TData = Common.RecurringDepositProductServiceGetV1RecurringdepositproductsByProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ productId }: {
  productId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRecurringDepositProductServiceGetV1RecurringdepositproductsByProductIdKeyFn({ productId }, queryKey), queryFn: () => RecurringDepositProductService.getV1RecurringdepositproductsByProductId({ productId }) as TData, ...options });
export const useListReportMailingJobHistoryServiceGetV1Reportmailingjobrunhistory = <TData = Common.ListReportMailingJobHistoryServiceGetV1ReportmailingjobrunhistoryDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, reportMailingJobId, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  reportMailingJobId?: number;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseListReportMailingJobHistoryServiceGetV1ReportmailingjobrunhistoryKeyFn({ limit, offset, orderBy, reportMailingJobId, sortOrder }, queryKey), queryFn: () => ListReportMailingJobHistoryService.getV1Reportmailingjobrunhistory({ limit, offset, orderBy, reportMailingJobId, sortOrder }) as TData, ...options });
export const useReportMailingJobsServiceGetV1Reportmailingjobs = <TData = Common.ReportMailingJobsServiceGetV1ReportmailingjobsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseReportMailingJobsServiceGetV1ReportmailingjobsKeyFn({ limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => ReportMailingJobsService.getV1Reportmailingjobs({ limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useReportMailingJobsServiceGetV1ReportmailingjobsTemplate = <TData = Common.ReportMailingJobsServiceGetV1ReportmailingjobsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseReportMailingJobsServiceGetV1ReportmailingjobsTemplateKeyFn(queryKey), queryFn: () => ReportMailingJobsService.getV1ReportmailingjobsTemplate() as TData, ...options });
export const useReportMailingJobsServiceGetV1ReportmailingjobsByEntityId = <TData = Common.ReportMailingJobsServiceGetV1ReportmailingjobsByEntityIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entityId }: {
  entityId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseReportMailingJobsServiceGetV1ReportmailingjobsByEntityIdKeyFn({ entityId }, queryKey), queryFn: () => ReportMailingJobsService.getV1ReportmailingjobsByEntityId({ entityId }) as TData, ...options });
export const useReportsServiceGetV1Reports = <TData = Common.ReportsServiceGetV1ReportsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseReportsServiceGetV1ReportsKeyFn(queryKey), queryFn: () => ReportsService.getV1Reports() as TData, ...options });
export const useReportsServiceGetV1ReportsTemplate = <TData = Common.ReportsServiceGetV1ReportsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseReportsServiceGetV1ReportsTemplateKeyFn(queryKey), queryFn: () => ReportsService.getV1ReportsTemplate() as TData, ...options });
export const useReportsServiceGetV1ReportsById = <TData = Common.ReportsServiceGetV1ReportsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseReportsServiceGetV1ReportsByIdKeyFn({ id }, queryKey), queryFn: () => ReportsService.getV1ReportsById({ id }) as TData, ...options });
export const useRescheduleLoansServiceGetV1Rescheduleloans = <TData = Common.RescheduleLoansServiceGetV1RescheduleloansDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ command, loanId }: {
  command?: string;
  loanId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRescheduleLoansServiceGetV1RescheduleloansKeyFn({ command, loanId }, queryKey), queryFn: () => RescheduleLoansService.getV1Rescheduleloans({ command, loanId }) as TData, ...options });
export const useRescheduleLoansServiceGetV1RescheduleloansTemplate = <TData = Common.RescheduleLoansServiceGetV1RescheduleloansTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRescheduleLoansServiceGetV1RescheduleloansTemplateKeyFn(queryKey), queryFn: () => RescheduleLoansService.getV1RescheduleloansTemplate() as TData, ...options });
export const useRescheduleLoansServiceGetV1RescheduleloansByScheduleId = <TData = Common.RescheduleLoansServiceGetV1RescheduleloansByScheduleIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ command, scheduleId }: {
  command?: string;
  scheduleId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRescheduleLoansServiceGetV1RescheduleloansByScheduleIdKeyFn({ command, scheduleId }, queryKey), queryFn: () => RescheduleLoansService.getV1RescheduleloansByScheduleId({ command, scheduleId }) as TData, ...options });
export const useRolesServiceGetV1Roles = <TData = Common.RolesServiceGetV1RolesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRolesServiceGetV1RolesKeyFn(queryKey), queryFn: () => RolesService.getV1Roles() as TData, ...options });
export const useRolesServiceGetV1RolesByRoleId = <TData = Common.RolesServiceGetV1RolesByRoleIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ roleId }: {
  roleId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRolesServiceGetV1RolesByRoleIdKeyFn({ roleId }, queryKey), queryFn: () => RolesService.getV1RolesByRoleId({ roleId }) as TData, ...options });
export const useRolesServiceGetV1RolesByRoleIdPermissions = <TData = Common.RolesServiceGetV1RolesByRoleIdPermissionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ roleId }: {
  roleId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRolesServiceGetV1RolesByRoleIdPermissionsKeyFn({ roleId }, queryKey), queryFn: () => RolesService.getV1RolesByRoleIdPermissions({ roleId }) as TData, ...options });
export const useRunReportsServiceGetV1RunreportsAvailableExportsByReportName = <TData = Common.RunReportsServiceGetV1RunreportsAvailableExportsByReportNameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ isSelfServiceUserReport, reportName }: {
  isSelfServiceUserReport?: boolean;
  reportName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRunReportsServiceGetV1RunreportsAvailableExportsByReportNameKeyFn({ isSelfServiceUserReport, reportName }, queryKey), queryFn: () => RunReportsService.getV1RunreportsAvailableExportsByReportName({ isSelfServiceUserReport, reportName }) as TData, ...options });
export const useRunReportsServiceGetV1RunreportsByReportName = <TData = Common.RunReportsServiceGetV1RunreportsByReportNameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ isSelfServiceUserReport, reportName }: {
  isSelfServiceUserReport?: boolean;
  reportName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseRunReportsServiceGetV1RunreportsByReportNameKeyFn({ isSelfServiceUserReport, reportName }, queryKey), queryFn: () => RunReportsService.getV1RunreportsByReportName({ isSelfServiceUserReport, reportName }) as TData, ...options });
export const useSavingsAccountServiceGetV1Savingsaccounts = <TData = Common.SavingsAccountServiceGetV1SavingsaccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalId, limit, offset, orderBy, sortOrder }: {
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsKeyFn({ externalId, limit, offset, orderBy, sortOrder }, queryKey), queryFn: () => SavingsAccountService.getV1Savingsaccounts({ externalId, limit, offset, orderBy, sortOrder }) as TData, ...options });
export const useSavingsAccountServiceGetV1SavingsaccountsDownloadtemplate = <TData = Common.SavingsAccountServiceGetV1SavingsaccountsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsDownloadtemplateKeyFn({ dateFormat, officeId, staffId }, queryKey), queryFn: () => SavingsAccountService.getV1SavingsaccountsDownloadtemplate({ dateFormat, officeId, staffId }) as TData, ...options });
export const useSavingsAccountServiceGetV1SavingsaccountsExternalIdByExternalId = <TData = Common.SavingsAccountServiceGetV1SavingsaccountsExternalIdByExternalIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ associations, chargeStatus, externalId, staffInSelectedOfficeOnly }: {
  associations?: string;
  chargeStatus?: string;
  externalId: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsExternalIdByExternalIdKeyFn({ associations, chargeStatus, externalId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => SavingsAccountService.getV1SavingsaccountsExternalIdByExternalId({ associations, chargeStatus, externalId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useSavingsAccountServiceGetV1SavingsaccountsTemplate = <TData = Common.SavingsAccountServiceGetV1SavingsaccountsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, groupId, productId, staffInSelectedOfficeOnly }: {
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsTemplateKeyFn({ clientId, groupId, productId, staffInSelectedOfficeOnly }, queryKey), queryFn: () => SavingsAccountService.getV1SavingsaccountsTemplate({ clientId, groupId, productId, staffInSelectedOfficeOnly }) as TData, ...options });
export const useSavingsAccountServiceGetV1SavingsaccountsTransactionsDownloadtemplate = <TData = Common.SavingsAccountServiceGetV1SavingsaccountsTransactionsDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsTransactionsDownloadtemplateKeyFn({ dateFormat, officeId }, queryKey), queryFn: () => SavingsAccountService.getV1SavingsaccountsTransactionsDownloadtemplate({ dateFormat, officeId }) as TData, ...options });
export const useSavingsAccountServiceGetV1SavingsaccountsByAccountId = <TData = Common.SavingsAccountServiceGetV1SavingsaccountsByAccountIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, associations, chargeStatus, staffInSelectedOfficeOnly }: {
  accountId: number;
  associations?: string;
  chargeStatus?: string;
  staffInSelectedOfficeOnly?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsByAccountIdKeyFn({ accountId, associations, chargeStatus, staffInSelectedOfficeOnly }, queryKey), queryFn: () => SavingsAccountService.getV1SavingsaccountsByAccountId({ accountId, associations, chargeStatus, staffInSelectedOfficeOnly }) as TData, ...options });
export const useSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdCharges = <TData = Common.SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chargeStatus, savingsAccountId }: {
  chargeStatus?: string;
  savingsAccountId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesKeyFn({ chargeStatus, savingsAccountId }, queryKey), queryFn: () => SavingsChargesService.getV1SavingsaccountsBySavingsAccountIdCharges({ chargeStatus, savingsAccountId }) as TData, ...options });
export const useSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesTemplate = <TData = Common.SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ savingsAccountId }: {
  savingsAccountId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesTemplateKeyFn({ savingsAccountId }, queryKey), queryFn: () => SavingsChargesService.getV1SavingsaccountsBySavingsAccountIdChargesTemplate({ savingsAccountId }) as TData, ...options });
export const useSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeId = <TData = Common.SavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ savingsAccountChargeId, savingsAccountId }: {
  savingsAccountChargeId: number;
  savingsAccountId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdKeyFn({ savingsAccountChargeId, savingsAccountId }, queryKey), queryFn: () => SavingsChargesService.getV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeId({ savingsAccountChargeId, savingsAccountId }) as TData, ...options });
export const useDepositAccountOnHoldFundTransactionsServiceGetV1SavingsaccountsBySavingsIdOnholdtransactions = <TData = Common.DepositAccountOnHoldFundTransactionsServiceGetV1SavingsaccountsBySavingsIdOnholdtransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ guarantorFundingId, limit, offset, orderBy, savingsId, sortOrder }: {
  guarantorFundingId?: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  savingsId: number;
  sortOrder?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDepositAccountOnHoldFundTransactionsServiceGetV1SavingsaccountsBySavingsIdOnholdtransactionsKeyFn({ guarantorFundingId, limit, offset, orderBy, savingsId, sortOrder }, queryKey), queryFn: () => DepositAccountOnHoldFundTransactionsService.getV1SavingsaccountsBySavingsIdOnholdtransactions({ guarantorFundingId, limit, offset, orderBy, savingsId, sortOrder }) as TData, ...options });
export const useSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsSearch = <TData = Common.SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsSearchDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ credit, dateFormat, debit, fromAmount, fromDate, fromSubmittedDate, limit, locale, offset, orderBy, savingsId, sortOrder, toAmount, toDate, toSubmittedDate, types }: {
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
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsSearchKeyFn({ credit, dateFormat, debit, fromAmount, fromDate, fromSubmittedDate, limit, locale, offset, orderBy, savingsId, sortOrder, toAmount, toDate, toSubmittedDate, types }, queryKey), queryFn: () => SavingsAccountTransactionsService.getV1SavingsaccountsBySavingsIdTransactionsSearch({ credit, dateFormat, debit, fromAmount, fromDate, fromSubmittedDate, limit, locale, offset, orderBy, savingsId, sortOrder, toAmount, toDate, toSubmittedDate, types }) as TData, ...options });
export const useSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsTemplate = <TData = Common.SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ savingsId }: {
  savingsId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsTemplateKeyFn({ savingsId }, queryKey), queryFn: () => SavingsAccountTransactionsService.getV1SavingsaccountsBySavingsIdTransactionsTemplate({ savingsId }) as TData, ...options });
export const useSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsByTransactionId = <TData = Common.SavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ savingsId, transactionId }: {
  savingsId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsByTransactionIdKeyFn({ savingsId, transactionId }, queryKey), queryFn: () => SavingsAccountTransactionsService.getV1SavingsaccountsBySavingsIdTransactionsByTransactionId({ savingsId, transactionId }) as TData, ...options });
export const useSavingsProductServiceGetV1Savingsproducts = <TData = Common.SavingsProductServiceGetV1SavingsproductsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSavingsProductServiceGetV1SavingsproductsKeyFn(queryKey), queryFn: () => SavingsProductService.getV1Savingsproducts() as TData, ...options });
export const useSavingsProductServiceGetV1SavingsproductsTemplate = <TData = Common.SavingsProductServiceGetV1SavingsproductsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSavingsProductServiceGetV1SavingsproductsTemplateKeyFn(queryKey), queryFn: () => SavingsProductService.getV1SavingsproductsTemplate() as TData, ...options });
export const useSavingsProductServiceGetV1SavingsproductsByProductId = <TData = Common.SavingsProductServiceGetV1SavingsproductsByProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ productId }: {
  productId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSavingsProductServiceGetV1SavingsproductsByProductIdKeyFn({ productId }, queryKey), queryFn: () => SavingsProductService.getV1SavingsproductsByProductId({ productId }) as TData, ...options });
export const useSchedulerServiceGetV1Scheduler = <TData = Common.SchedulerServiceGetV1SchedulerDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSchedulerServiceGetV1SchedulerKeyFn(queryKey), queryFn: () => SchedulerService.getV1Scheduler() as TData, ...options });
export const useSearchApiServiceGetV1Search = <TData = Common.SearchApiServiceGetV1SearchDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ exactMatch, query, resource }: {
  exactMatch?: boolean;
  query?: string;
  resource?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSearchApiServiceGetV1SearchKeyFn({ exactMatch, query, resource }, queryKey), queryFn: () => SearchApiService.getV1Search({ exactMatch, query, resource }) as TData, ...options });
export const useSearchApiServiceGetV1SearchTemplate = <TData = Common.SearchApiServiceGetV1SearchTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSearchApiServiceGetV1SearchTemplateKeyFn(queryKey), queryFn: () => SearchApiService.getV1SearchTemplate() as TData, ...options });
export const useSelfAccountTransferServiceGetV1SelfAccounttransfersTemplate = <TData = Common.SelfAccountTransferServiceGetV1SelfAccounttransfersTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ type }: {
  type?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfAccountTransferServiceGetV1SelfAccounttransfersTemplateKeyFn({ type }, queryKey), queryFn: () => SelfAccountTransferService.getV1SelfAccounttransfersTemplate({ type }) as TData, ...options });
export const useSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTpt = <TData = Common.SelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptKeyFn(queryKey), queryFn: () => SelfThirdPartyTransferService.getV1SelfBeneficiariesTpt() as TData, ...options });
export const useSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptTemplate = <TData = Common.SelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptTemplateKeyFn(queryKey), queryFn: () => SelfThirdPartyTransferService.getV1SelfBeneficiariesTptTemplate() as TData, ...options });
export const useSelfClientServiceGetV1SelfClients = <TData = Common.SelfClientServiceGetV1SelfClientsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ displayName, firstName, lastName, legalForm, limit, offset, orderBy, sortOrder, status }: {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  legalForm?: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  status?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsKeyFn({ displayName, firstName, lastName, legalForm, limit, offset, orderBy, sortOrder, status }, queryKey), queryFn: () => SelfClientService.getV1SelfClients({ displayName, firstName, lastName, legalForm, limit, offset, orderBy, sortOrder, status }) as TData, ...options });
export const useSelfClientServiceGetV1SelfClientsByClientId = <TData = Common.SelfClientServiceGetV1SelfClientsByClientIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdKeyFn({ clientId }, queryKey), queryFn: () => SelfClientService.getV1SelfClientsByClientId({ clientId }) as TData, ...options });
export const useSelfClientServiceGetV1SelfClientsByClientIdAccounts = <TData = Common.SelfClientServiceGetV1SelfClientsByClientIdAccountsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdAccountsKeyFn({ clientId }, queryKey), queryFn: () => SelfClientService.getV1SelfClientsByClientIdAccounts({ clientId }) as TData, ...options });
export const useSelfClientServiceGetV1SelfClientsByClientIdCharges = <TData = Common.SelfClientServiceGetV1SelfClientsByClientIdChargesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chargeStatus, clientId, limit, offset, pendingPayment }: {
  chargeStatus?: string;
  clientId: number;
  limit?: number;
  offset?: number;
  pendingPayment?: boolean;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdChargesKeyFn({ chargeStatus, clientId, limit, offset, pendingPayment }, queryKey), queryFn: () => SelfClientService.getV1SelfClientsByClientIdCharges({ chargeStatus, clientId, limit, offset, pendingPayment }) as TData, ...options });
export const useSelfClientServiceGetV1SelfClientsByClientIdChargesByChargeId = <TData = Common.SelfClientServiceGetV1SelfClientsByClientIdChargesByChargeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chargeId, clientId }: {
  chargeId: number;
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdChargesByChargeIdKeyFn({ chargeId, clientId }, queryKey), queryFn: () => SelfClientService.getV1SelfClientsByClientIdChargesByChargeId({ chargeId, clientId }) as TData, ...options });
export const useSelfClientServiceGetV1SelfClientsByClientIdImages = <TData = Common.SelfClientServiceGetV1SelfClientsByClientIdImagesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, maxHeight, maxWidth, output }: {
  clientId: number;
  maxHeight?: number;
  maxWidth?: number;
  output?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdImagesKeyFn({ clientId, maxHeight, maxWidth, output }, queryKey), queryFn: () => SelfClientService.getV1SelfClientsByClientIdImages({ clientId, maxHeight, maxWidth, output }) as TData, ...options });
export const useSelfClientServiceGetV1SelfClientsByClientIdObligeedetails = <TData = Common.SelfClientServiceGetV1SelfClientsByClientIdObligeedetailsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdObligeedetailsKeyFn({ clientId }, queryKey), queryFn: () => SelfClientService.getV1SelfClientsByClientIdObligeedetails({ clientId }) as TData, ...options });
export const useSelfClientServiceGetV1SelfClientsByClientIdTransactions = <TData = Common.SelfClientServiceGetV1SelfClientsByClientIdTransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, limit, offset }: {
  clientId: number;
  limit?: number;
  offset?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdTransactionsKeyFn({ clientId, limit, offset }, queryKey), queryFn: () => SelfClientService.getV1SelfClientsByClientIdTransactions({ clientId, limit, offset }) as TData, ...options });
export const useSelfClientServiceGetV1SelfClientsByClientIdTransactionsByTransactionId = <TData = Common.SelfClientServiceGetV1SelfClientsByClientIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, transactionId }: {
  clientId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdTransactionsByTransactionIdKeyFn({ clientId, transactionId }, queryKey), queryFn: () => SelfClientService.getV1SelfClientsByClientIdTransactionsByTransactionId({ clientId, transactionId }) as TData, ...options });
export const useDeviceRegistrationServiceGetV1SelfDeviceRegistration = <TData = Common.DeviceRegistrationServiceGetV1SelfDeviceRegistrationDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDeviceRegistrationServiceGetV1SelfDeviceRegistrationKeyFn(queryKey), queryFn: () => DeviceRegistrationService.getV1SelfDeviceRegistration() as TData, ...options });
export const useDeviceRegistrationServiceGetV1SelfDeviceRegistrationClientByClientId = <TData = Common.DeviceRegistrationServiceGetV1SelfDeviceRegistrationClientByClientIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDeviceRegistrationServiceGetV1SelfDeviceRegistrationClientByClientIdKeyFn({ clientId }, queryKey), queryFn: () => DeviceRegistrationService.getV1SelfDeviceRegistrationClientByClientId({ clientId }) as TData, ...options });
export const useDeviceRegistrationServiceGetV1SelfDeviceRegistrationById = <TData = Common.DeviceRegistrationServiceGetV1SelfDeviceRegistrationByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDeviceRegistrationServiceGetV1SelfDeviceRegistrationByIdKeyFn({ id }, queryKey), queryFn: () => DeviceRegistrationService.getV1SelfDeviceRegistrationById({ id }) as TData, ...options });
export const useSelfLoanProductsServiceGetV1SelfLoanproducts = <TData = Common.SelfLoanProductsServiceGetV1SelfLoanproductsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfLoanProductsServiceGetV1SelfLoanproductsKeyFn({ clientId }, queryKey), queryFn: () => SelfLoanProductsService.getV1SelfLoanproducts({ clientId }) as TData, ...options });
export const useSelfLoanProductsServiceGetV1SelfLoanproductsByProductId = <TData = Common.SelfLoanProductsServiceGetV1SelfLoanproductsByProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, productId }: {
  clientId?: number;
  productId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfLoanProductsServiceGetV1SelfLoanproductsByProductIdKeyFn({ clientId, productId }, queryKey), queryFn: () => SelfLoanProductsService.getV1SelfLoanproductsByProductId({ clientId, productId }) as TData, ...options });
export const useSelfLoansServiceGetV1SelfLoansTemplate = <TData = Common.SelfLoansServiceGetV1SelfLoansTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, productId, templateType }: {
  clientId?: number;
  productId?: number;
  templateType?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansTemplateKeyFn({ clientId, productId, templateType }, queryKey), queryFn: () => SelfLoansService.getV1SelfLoansTemplate({ clientId, productId, templateType }) as TData, ...options });
export const useSelfLoansServiceGetV1SelfLoansByLoanId = <TData = Common.SelfLoansServiceGetV1SelfLoansByLoanIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdKeyFn({ loanId }, queryKey), queryFn: () => SelfLoansService.getV1SelfLoansByLoanId({ loanId }) as TData, ...options });
export const useSelfLoansServiceGetV1SelfLoansByLoanIdCharges = <TData = Common.SelfLoansServiceGetV1SelfLoansByLoanIdChargesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdChargesKeyFn({ loanId }, queryKey), queryFn: () => SelfLoansService.getV1SelfLoansByLoanIdCharges({ loanId }) as TData, ...options });
export const useSelfLoansServiceGetV1SelfLoansByLoanIdChargesByChargeId = <TData = Common.SelfLoansServiceGetV1SelfLoansByLoanIdChargesByChargeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ chargeId, loanId }: {
  chargeId: number;
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdChargesByChargeIdKeyFn({ chargeId, loanId }, queryKey), queryFn: () => SelfLoansService.getV1SelfLoansByLoanIdChargesByChargeId({ chargeId, loanId }) as TData, ...options });
export const useSelfLoansServiceGetV1SelfLoansByLoanIdGuarantors = <TData = Common.SelfLoansServiceGetV1SelfLoansByLoanIdGuarantorsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanId }: {
  loanId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdGuarantorsKeyFn({ loanId }, queryKey), queryFn: () => SelfLoansService.getV1SelfLoansByLoanIdGuarantors({ loanId }) as TData, ...options });
export const useSelfLoansServiceGetV1SelfLoansByLoanIdTransactionsByTransactionId = <TData = Common.SelfLoansServiceGetV1SelfLoansByLoanIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fields, loanId, transactionId }: {
  fields?: string;
  loanId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdTransactionsByTransactionIdKeyFn({ fields, loanId, transactionId }, queryKey), queryFn: () => SelfLoansService.getV1SelfLoansByLoanIdTransactionsByTransactionId({ fields, loanId, transactionId }) as TData, ...options });
export const usePocketServiceGetV1SelfPockets = <TData = Common.PocketServiceGetV1SelfPocketsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UsePocketServiceGetV1SelfPocketsKeyFn(queryKey), queryFn: () => PocketService.getV1SelfPockets() as TData, ...options });
export const useSelfShareProductsServiceGetV1SelfProductsShare = <TData = Common.SelfShareProductsServiceGetV1SelfProductsShareDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, limit, offset }: {
  clientId?: number;
  limit?: number;
  offset?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfShareProductsServiceGetV1SelfProductsShareKeyFn({ clientId, limit, offset }, queryKey), queryFn: () => SelfShareProductsService.getV1SelfProductsShare({ clientId, limit, offset }) as TData, ...options });
export const useSelfShareProductsServiceGetV1SelfProductsShareByProductId = <TData = Common.SelfShareProductsServiceGetV1SelfProductsShareByProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, productId, type }: {
  clientId?: number;
  productId: number;
  type: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfShareProductsServiceGetV1SelfProductsShareByProductIdKeyFn({ clientId, productId, type }, queryKey), queryFn: () => SelfShareProductsService.getV1SelfProductsShareByProductId({ clientId, productId, type }) as TData, ...options });
export const useSelfRunReportServiceGetV1SelfRunreportsByReportName = <TData = Common.SelfRunReportServiceGetV1SelfRunreportsByReportNameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ reportName }: {
  reportName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfRunReportServiceGetV1SelfRunreportsByReportNameKeyFn({ reportName }, queryKey), queryFn: () => SelfRunReportService.getV1SelfRunreportsByReportName({ reportName }) as TData, ...options });
export const useSelfSavingsAccountServiceGetV1SelfSavingsaccountsTemplate = <TData = Common.SelfSavingsAccountServiceGetV1SelfSavingsaccountsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, productId }: {
  clientId?: number;
  productId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsTemplateKeyFn({ clientId, productId }, queryKey), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsTemplate({ clientId, productId }) as TData, ...options });
export const useSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountId = <TData = Common.SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, associations, chargeStatus }: {
  accountId: number;
  associations?: string;
  chargeStatus?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdKeyFn({ accountId, associations, chargeStatus }, queryKey), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountId({ accountId, associations, chargeStatus }) as TData, ...options });
export const useSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdCharges = <TData = Common.SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, chargeStatus }: {
  accountId: number;
  chargeStatus?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesKeyFn({ accountId, chargeStatus }, queryKey), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountIdCharges({ accountId, chargeStatus }) as TData, ...options });
export const useSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeId = <TData = Common.SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, savingsAccountChargeId }: {
  accountId: number;
  savingsAccountChargeId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeIdKeyFn({ accountId, savingsAccountChargeId }, queryKey), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeId({ accountId, savingsAccountChargeId }) as TData, ...options });
export const useSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdTransactionsByTransactionId = <TData = Common.SelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId, transactionId }: {
  accountId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdTransactionsByTransactionIdKeyFn({ accountId, transactionId }, queryKey), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountIdTransactionsByTransactionId({ accountId, transactionId }) as TData, ...options });
export const useSelfSavingsProductsServiceGetV1SelfSavingsproducts = <TData = Common.SelfSavingsProductsServiceGetV1SelfSavingsproductsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfSavingsProductsServiceGetV1SelfSavingsproductsKeyFn({ clientId }, queryKey), queryFn: () => SelfSavingsProductsService.getV1SelfSavingsproducts({ clientId }) as TData, ...options });
export const useSelfSavingsProductsServiceGetV1SelfSavingsproductsByProductId = <TData = Common.SelfSavingsProductsServiceGetV1SelfSavingsproductsByProductIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, productId }: {
  clientId?: number;
  productId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfSavingsProductsServiceGetV1SelfSavingsproductsByProductIdKeyFn({ clientId, productId }, queryKey), queryFn: () => SelfSavingsProductsService.getV1SelfSavingsproductsByProductId({ clientId, productId }) as TData, ...options });
export const useSelfShareAccountsServiceGetV1SelfShareaccountsTemplate = <TData = Common.SelfShareAccountsServiceGetV1SelfShareaccountsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, productId }: {
  clientId?: number;
  productId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfShareAccountsServiceGetV1SelfShareaccountsTemplateKeyFn({ clientId, productId }, queryKey), queryFn: () => SelfShareAccountsService.getV1SelfShareaccountsTemplate({ clientId, productId }) as TData, ...options });
export const useSelfShareAccountsServiceGetV1SelfShareaccountsByAccountId = <TData = Common.SelfShareAccountsServiceGetV1SelfShareaccountsByAccountIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountId }: {
  accountId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfShareAccountsServiceGetV1SelfShareaccountsByAccountIdKeyFn({ accountId }, queryKey), queryFn: () => SelfShareAccountsService.getV1SelfShareaccountsByAccountId({ accountId }) as TData, ...options });
export const useSelfSpmServiceGetV1SelfSurveys = <TData = Common.SelfSpmServiceGetV1SelfSurveysDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfSpmServiceGetV1SelfSurveysKeyFn(queryKey), queryFn: () => SelfSpmService.getV1SelfSurveys() as TData, ...options });
export const useSelfScoreCardServiceGetV1SelfSurveysScorecardsClientsByClientId = <TData = Common.SelfScoreCardServiceGetV1SelfSurveysScorecardsClientsByClientIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfScoreCardServiceGetV1SelfSurveysScorecardsClientsByClientIdKeyFn({ clientId }, queryKey), queryFn: () => SelfScoreCardService.getV1SelfSurveysScorecardsClientsByClientId({ clientId }) as TData, ...options });
export const useSelfUserDetailsServiceGetV1SelfUserdetails = <TData = Common.SelfUserDetailsServiceGetV1SelfUserdetailsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfUserDetailsServiceGetV1SelfUserdetailsKeyFn(queryKey), queryFn: () => SelfUserDetailsService.getV1SelfUserdetails() as TData, ...options });
export const useSelfDividendServiceGetV1ShareproductByProductIdDividend = <TData = Common.SelfDividendServiceGetV1ShareproductByProductIdDividendDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ limit, offset, orderBy, productId, sortOrder, status }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  productId: number;
  sortOrder?: string;
  status?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfDividendServiceGetV1ShareproductByProductIdDividendKeyFn({ limit, offset, orderBy, productId, sortOrder, status }, queryKey), queryFn: () => SelfDividendService.getV1ShareproductByProductIdDividend({ limit, offset, orderBy, productId, sortOrder, status }) as TData, ...options });
export const useSelfDividendServiceGetV1ShareproductByProductIdDividendByDividendId = <TData = Common.SelfDividendServiceGetV1ShareproductByProductIdDividendByDividendIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ accountNo, dividendId, limit, offset, orderBy, productId, sortOrder }: {
  accountNo?: string;
  dividendId: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  productId: number;
  sortOrder?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSelfDividendServiceGetV1ShareproductByProductIdDividendByDividendIdKeyFn({ accountNo, dividendId, limit, offset, orderBy, productId, sortOrder }, queryKey), queryFn: () => SelfDividendService.getV1ShareproductByProductIdDividendByDividendId({ accountNo, dividendId, limit, offset, orderBy, productId, sortOrder }) as TData, ...options });
export const useSmsServiceGetV1Sms = <TData = Common.SmsServiceGetV1SmsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSmsServiceGetV1SmsKeyFn(queryKey), queryFn: () => SmsService.getV1Sms() as TData, ...options });
export const useSmsServiceGetV1SmsByCampaignIdMessageByStatus = <TData = Common.SmsServiceGetV1SmsByCampaignIdMessageByStatusDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ campaignId, dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }: {
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
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSmsServiceGetV1SmsByCampaignIdMessageByStatusKeyFn({ campaignId, dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }, queryKey), queryFn: () => SmsService.getV1SmsByCampaignIdMessageByStatus({ campaignId, dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }) as TData, ...options });
export const useSmsServiceGetV1SmsByResourceId = <TData = Common.SmsServiceGetV1SmsByResourceIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId }: {
  resourceId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSmsServiceGetV1SmsByResourceIdKeyFn({ resourceId }, queryKey), queryFn: () => SmsService.getV1SmsByResourceId({ resourceId }) as TData, ...options });
export const useStaffServiceGetV1Staff = <TData = Common.StaffServiceGetV1StaffDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ loanOfficersOnly, officeId, staffInOfficeHierarchy, status }: {
  loanOfficersOnly?: boolean;
  officeId?: number;
  staffInOfficeHierarchy?: boolean;
  status?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseStaffServiceGetV1StaffKeyFn({ loanOfficersOnly, officeId, staffInOfficeHierarchy, status }, queryKey), queryFn: () => StaffService.getV1Staff({ loanOfficersOnly, officeId, staffInOfficeHierarchy, status }) as TData, ...options });
export const useStaffServiceGetV1StaffDownloadtemplate = <TData = Common.StaffServiceGetV1StaffDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseStaffServiceGetV1StaffDownloadtemplateKeyFn({ dateFormat, officeId }, queryKey), queryFn: () => StaffService.getV1StaffDownloadtemplate({ dateFormat, officeId }) as TData, ...options });
export const useStaffServiceGetV1StaffByStaffId = <TData = Common.StaffServiceGetV1StaffByStaffIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ staffId }: {
  staffId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseStaffServiceGetV1StaffByStaffIdKeyFn({ staffId }, queryKey), queryFn: () => StaffService.getV1StaffByStaffId({ staffId }) as TData, ...options });
export const useStandingInstructionsHistoryServiceGetV1Standinginstructionrunhistory = <TData = Common.StandingInstructionsHistoryServiceGetV1StandinginstructionrunhistoryDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, clientName, dateFormat, externalId, fromAccountId, fromAccountType, fromDate, limit, locale, offset, orderBy, sortOrder, toDate, transferType }: {
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
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseStandingInstructionsHistoryServiceGetV1StandinginstructionrunhistoryKeyFn({ clientId, clientName, dateFormat, externalId, fromAccountId, fromAccountType, fromDate, limit, locale, offset, orderBy, sortOrder, toDate, transferType }, queryKey), queryFn: () => StandingInstructionsHistoryService.getV1Standinginstructionrunhistory({ clientId, clientName, dateFormat, externalId, fromAccountId, fromAccountType, fromDate, limit, locale, offset, orderBy, sortOrder, toDate, transferType }) as TData, ...options });
export const useStandingInstructionsServiceGetV1Standinginstructions = <TData = Common.StandingInstructionsServiceGetV1StandinginstructionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, clientName, externalId, fromAccountId, fromAccountType, limit, offset, orderBy, sortOrder, transferType }: {
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
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseStandingInstructionsServiceGetV1StandinginstructionsKeyFn({ clientId, clientName, externalId, fromAccountId, fromAccountType, limit, offset, orderBy, sortOrder, transferType }, queryKey), queryFn: () => StandingInstructionsService.getV1Standinginstructions({ clientId, clientName, externalId, fromAccountId, fromAccountType, limit, offset, orderBy, sortOrder, transferType }) as TData, ...options });
export const useStandingInstructionsServiceGetV1StandinginstructionsTemplate = <TData = Common.StandingInstructionsServiceGetV1StandinginstructionsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId, transferType }: {
  fromAccountId?: number;
  fromAccountType?: number;
  fromClientId?: number;
  fromOfficeId?: number;
  toAccountId?: number;
  toAccountType?: number;
  toClientId?: number;
  toOfficeId?: number;
  transferType?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseStandingInstructionsServiceGetV1StandinginstructionsTemplateKeyFn({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId, transferType }, queryKey), queryFn: () => StandingInstructionsService.getV1StandinginstructionsTemplate({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId, transferType }) as TData, ...options });
export const useStandingInstructionsServiceGetV1StandinginstructionsByStandingInstructionId = <TData = Common.StandingInstructionsServiceGetV1StandinginstructionsByStandingInstructionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ externalId, limit, offset, orderBy, sortOrder, standingInstructionId }: {
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  standingInstructionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseStandingInstructionsServiceGetV1StandinginstructionsByStandingInstructionIdKeyFn({ externalId, limit, offset, orderBy, sortOrder, standingInstructionId }, queryKey), queryFn: () => StandingInstructionsService.getV1StandinginstructionsByStandingInstructionId({ externalId, limit, offset, orderBy, sortOrder, standingInstructionId }) as TData, ...options });
export const useSurveyServiceGetV1Survey = <TData = Common.SurveyServiceGetV1SurveyDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSurveyServiceGetV1SurveyKeyFn(queryKey), queryFn: () => SurveyService.getV1Survey() as TData, ...options });
export const useSurveyServiceGetV1SurveyBySurveyName = <TData = Common.SurveyServiceGetV1SurveyBySurveyNameDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ surveyName }: {
  surveyName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSurveyServiceGetV1SurveyBySurveyNameKeyFn({ surveyName }, queryKey), queryFn: () => SurveyService.getV1SurveyBySurveyName({ surveyName }) as TData, ...options });
export const useSurveyServiceGetV1SurveyBySurveyNameByClientId = <TData = Common.SurveyServiceGetV1SurveyBySurveyNameByClientIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, surveyName }: {
  clientId: number;
  surveyName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSurveyServiceGetV1SurveyBySurveyNameByClientIdKeyFn({ clientId, surveyName }, queryKey), queryFn: () => SurveyService.getV1SurveyBySurveyNameByClientId({ clientId, surveyName }) as TData, ...options });
export const useSurveyServiceGetV1SurveyBySurveyNameByClientIdByEntryId = <TData = Common.SurveyServiceGetV1SurveyBySurveyNameByClientIdByEntryIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, entryId, surveyName }: {
  clientId: number;
  entryId: number;
  surveyName: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSurveyServiceGetV1SurveyBySurveyNameByClientIdByEntryIdKeyFn({ clientId, entryId, surveyName }, queryKey), queryFn: () => SurveyService.getV1SurveyBySurveyNameByClientIdByEntryId({ clientId, entryId, surveyName }) as TData, ...options });
export const useSpmSurveysServiceGetV1Surveys = <TData = Common.SpmSurveysServiceGetV1SurveysDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ isActive }: {
  isActive?: boolean;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSpmSurveysServiceGetV1SurveysKeyFn({ isActive }, queryKey), queryFn: () => SpmSurveysService.getV1Surveys({ isActive }) as TData, ...options });
export const useSpmSurveysServiceGetV1SurveysById = <TData = Common.SpmSurveysServiceGetV1SurveysByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSpmSurveysServiceGetV1SurveysByIdKeyFn({ id }, queryKey), queryFn: () => SpmSurveysService.getV1SurveysById({ id }) as TData, ...options });
export const useScoreCardServiceGetV1SurveysScorecardsClientsByClientId = <TData = Common.ScoreCardServiceGetV1SurveysScorecardsClientsByClientIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId }: {
  clientId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseScoreCardServiceGetV1SurveysScorecardsClientsByClientIdKeyFn({ clientId }, queryKey), queryFn: () => ScoreCardService.getV1SurveysScorecardsClientsByClientId({ clientId }) as TData, ...options });
export const useScoreCardServiceGetV1SurveysScorecardsBySurveyId = <TData = Common.ScoreCardServiceGetV1SurveysScorecardsBySurveyIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ surveyId }: {
  surveyId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseScoreCardServiceGetV1SurveysScorecardsBySurveyIdKeyFn({ surveyId }, queryKey), queryFn: () => ScoreCardService.getV1SurveysScorecardsBySurveyId({ surveyId }) as TData, ...options });
export const useScoreCardServiceGetV1SurveysScorecardsBySurveyIdClientsByClientId = <TData = Common.ScoreCardServiceGetV1SurveysScorecardsBySurveyIdClientsByClientIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ clientId, surveyId }: {
  clientId: number;
  surveyId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseScoreCardServiceGetV1SurveysScorecardsBySurveyIdClientsByClientIdKeyFn({ clientId, surveyId }, queryKey), queryFn: () => ScoreCardService.getV1SurveysScorecardsBySurveyIdClientsByClientId({ clientId, surveyId }) as TData, ...options });
export const useSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptables = <TData = Common.SpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ surveyId }: {
  surveyId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesKeyFn({ surveyId }, queryKey), queryFn: () => SpmApiLookUpTableService.getV1SurveysBySurveyIdLookuptables({ surveyId }) as TData, ...options });
export const useSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesByKey = <TData = Common.SpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesByKeyDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ key, surveyId }: {
  key: string;
  surveyId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesByKeyKeyFn({ key, surveyId }, queryKey), queryFn: () => SpmApiLookUpTableService.getV1SurveysBySurveyIdLookuptablesByKey({ key, surveyId }) as TData, ...options });
export const useTaxComponentsServiceGetV1TaxesComponent = <TData = Common.TaxComponentsServiceGetV1TaxesComponentDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTaxComponentsServiceGetV1TaxesComponentKeyFn(queryKey), queryFn: () => TaxComponentsService.getV1TaxesComponent() as TData, ...options });
export const useTaxComponentsServiceGetV1TaxesComponentTemplate = <TData = Common.TaxComponentsServiceGetV1TaxesComponentTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTaxComponentsServiceGetV1TaxesComponentTemplateKeyFn(queryKey), queryFn: () => TaxComponentsService.getV1TaxesComponentTemplate() as TData, ...options });
export const useTaxComponentsServiceGetV1TaxesComponentByTaxComponentId = <TData = Common.TaxComponentsServiceGetV1TaxesComponentByTaxComponentIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ taxComponentId }: {
  taxComponentId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTaxComponentsServiceGetV1TaxesComponentByTaxComponentIdKeyFn({ taxComponentId }, queryKey), queryFn: () => TaxComponentsService.getV1TaxesComponentByTaxComponentId({ taxComponentId }) as TData, ...options });
export const useTaxGroupServiceGetV1TaxesGroup = <TData = Common.TaxGroupServiceGetV1TaxesGroupDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTaxGroupServiceGetV1TaxesGroupKeyFn(queryKey), queryFn: () => TaxGroupService.getV1TaxesGroup() as TData, ...options });
export const useTaxGroupServiceGetV1TaxesGroupTemplate = <TData = Common.TaxGroupServiceGetV1TaxesGroupTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTaxGroupServiceGetV1TaxesGroupTemplateKeyFn(queryKey), queryFn: () => TaxGroupService.getV1TaxesGroupTemplate() as TData, ...options });
export const useTaxGroupServiceGetV1TaxesGroupByTaxGroupId = <TData = Common.TaxGroupServiceGetV1TaxesGroupByTaxGroupIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ taxGroupId }: {
  taxGroupId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTaxGroupServiceGetV1TaxesGroupByTaxGroupIdKeyFn({ taxGroupId }, queryKey), queryFn: () => TaxGroupService.getV1TaxesGroupByTaxGroupId({ taxGroupId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1Tellers = <TData = Common.TellerCashManagementServiceGetV1TellersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ officeId }: {
  officeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersKeyFn({ officeId }, queryKey), queryFn: () => TellerCashManagementService.getV1Tellers({ officeId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerId = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ tellerId }: {
  tellerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdKeyFn({ tellerId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerId({ tellerId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiers = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdCashiersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ fromdate, tellerId, todate }: {
  fromdate?: string;
  tellerId: number;
  todate?: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersKeyFn({ fromdate, tellerId, todate }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiers({ fromdate, tellerId, todate }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplate = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ tellerId }: {
  tellerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplateKeyFn({ tellerId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersTemplate({ tellerId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierId = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ cashierId, tellerId }: {
  cashierId: number;
  tellerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdKeyFn({ cashierId, tellerId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierId({ cashierId, tellerId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactions = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }: {
  cashierId: number;
  currencyCode?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  tellerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactionsKeyFn({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdSummaryandtransactions({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactions = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }: {
  cashierId: number;
  currencyCode?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  tellerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsKeyFn({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdTransactions({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplate = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ cashierId, tellerId }: {
  cashierId: number;
  tellerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplateKeyFn({ cashierId, tellerId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdTransactionsTemplate({ cashierId, tellerId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdJournals = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdJournalsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ cashierId, dateRange, tellerId }: {
  cashierId?: number;
  dateRange?: string;
  tellerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdJournalsKeyFn({ cashierId, dateRange, tellerId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdJournals({ cashierId, dateRange, tellerId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdTransactions = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdTransactionsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateRange, tellerId }: {
  dateRange?: string;
  tellerId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdTransactionsKeyFn({ dateRange, tellerId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdTransactions({ dateRange, tellerId }) as TData, ...options });
export const useTellerCashManagementServiceGetV1TellersByTellerIdTransactionsByTransactionId = <TData = Common.TellerCashManagementServiceGetV1TellersByTellerIdTransactionsByTransactionIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ tellerId, transactionId }: {
  tellerId: number;
  transactionId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdTransactionsByTransactionIdKeyFn({ tellerId, transactionId }, queryKey), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdTransactionsByTransactionId({ tellerId, transactionId }) as TData, ...options });
export const useUserGeneratedDocumentsServiceGetV1Templates = <TData = Common.UserGeneratedDocumentsServiceGetV1TemplatesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entityId, typeId }: {
  entityId?: number;
  typeId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUserGeneratedDocumentsServiceGetV1TemplatesKeyFn({ entityId, typeId }, queryKey), queryFn: () => UserGeneratedDocumentsService.getV1Templates({ entityId, typeId }) as TData, ...options });
export const useUserGeneratedDocumentsServiceGetV1TemplatesTemplate = <TData = Common.UserGeneratedDocumentsServiceGetV1TemplatesTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUserGeneratedDocumentsServiceGetV1TemplatesTemplateKeyFn(queryKey), queryFn: () => UserGeneratedDocumentsService.getV1TemplatesTemplate() as TData, ...options });
export const useUserGeneratedDocumentsServiceGetV1TemplatesByTemplateId = <TData = Common.UserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ templateId }: {
  templateId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdKeyFn({ templateId }, queryKey), queryFn: () => UserGeneratedDocumentsService.getV1TemplatesByTemplateId({ templateId }) as TData, ...options });
export const useUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdTemplate = <TData = Common.UserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ templateId }: {
  templateId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdTemplateKeyFn({ templateId }, queryKey), queryFn: () => UserGeneratedDocumentsService.getV1TemplatesByTemplateIdTemplate({ templateId }) as TData, ...options });
export const useTwoFactorServiceGetV1Twofactor = <TData = Common.TwoFactorServiceGetV1TwofactorDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseTwoFactorServiceGetV1TwofactorKeyFn(queryKey), queryFn: () => TwoFactorService.getV1Twofactor() as TData, ...options });
export const useFetchAuthenticatedUserDetailsServiceGetV1Userdetails = <TData = Common.FetchAuthenticatedUserDetailsServiceGetV1UserdetailsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseFetchAuthenticatedUserDetailsServiceGetV1UserdetailsKeyFn(queryKey), queryFn: () => FetchAuthenticatedUserDetailsService.getV1Userdetails() as TData, ...options });
export const useUsersServiceGetV1Users = <TData = Common.UsersServiceGetV1UsersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetV1UsersKeyFn(queryKey), queryFn: () => UsersService.getV1Users() as TData, ...options });
export const useUsersServiceGetV1UsersDownloadtemplate = <TData = Common.UsersServiceGetV1UsersDownloadtemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetV1UsersDownloadtemplateKeyFn({ dateFormat, officeId, staffId }, queryKey), queryFn: () => UsersService.getV1UsersDownloadtemplate({ dateFormat, officeId, staffId }) as TData, ...options });
export const useUsersServiceGetV1UsersTemplate = <TData = Common.UsersServiceGetV1UsersTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetV1UsersTemplateKeyFn(queryKey), queryFn: () => UsersService.getV1UsersTemplate() as TData, ...options });
export const useUsersServiceGetV1UsersByUserId = <TData = Common.UsersServiceGetV1UsersByUserIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ userId }: {
  userId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseUsersServiceGetV1UsersByUserIdKeyFn({ userId }, queryKey), queryFn: () => UsersService.getV1UsersByUserId({ userId }) as TData, ...options });
export const useWorkingDaysServiceGetV1Workingdays = <TData = Common.WorkingDaysServiceGetV1WorkingdaysDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseWorkingDaysServiceGetV1WorkingdaysKeyFn(queryKey), queryFn: () => WorkingDaysService.getV1Workingdays() as TData, ...options });
export const useWorkingDaysServiceGetV1WorkingdaysTemplate = <TData = Common.WorkingDaysServiceGetV1WorkingdaysTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseWorkingDaysServiceGetV1WorkingdaysTemplateKeyFn(queryKey), queryFn: () => WorkingDaysService.getV1WorkingdaysTemplate() as TData, ...options });
export const useCalendarServiceGetV1ByEntityTypeByEntityIdCalendars = <TData = Common.CalendarServiceGetV1ByEntityTypeByEntityIdCalendarsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ calendarType, entityId, entityType }: {
  calendarType?: string;
  entityId: number;
  entityType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsKeyFn({ calendarType, entityId, entityType }, queryKey), queryFn: () => CalendarService.getV1ByEntityTypeByEntityIdCalendars({ calendarType, entityId, entityType }) as TData, ...options });
export const useCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsTemplate = <TData = Common.CalendarServiceGetV1ByEntityTypeByEntityIdCalendarsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entityId, entityType }: {
  entityId: number;
  entityType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsTemplateKeyFn({ entityId, entityType }, queryKey), queryFn: () => CalendarService.getV1ByEntityTypeByEntityIdCalendarsTemplate({ entityId, entityType }) as TData, ...options });
export const useCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsByCalendarId = <TData = Common.CalendarServiceGetV1ByEntityTypeByEntityIdCalendarsByCalendarIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ calendarId, entityId, entityType }: {
  calendarId: number;
  entityId: number;
  entityType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsByCalendarIdKeyFn({ calendarId, entityId, entityType }, queryKey), queryFn: () => CalendarService.getV1ByEntityTypeByEntityIdCalendarsByCalendarId({ calendarId, entityId, entityType }) as TData, ...options });
export const useDocumentsServiceGetV1ByEntityTypeByEntityIdDocuments = <TData = Common.DocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entityId, entityType }: {
  entityId: number;
  entityType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsKeyFn({ entityId, entityType }, queryKey), queryFn: () => DocumentsService.getV1ByEntityTypeByEntityIdDocuments({ entityId, entityType }) as TData, ...options });
export const useDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentId = <TData = Common.DocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ documentId, entityId, entityType }: {
  documentId: number;
  entityId: number;
  entityType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdKeyFn({ documentId, entityId, entityType }, queryKey), queryFn: () => DocumentsService.getV1ByEntityTypeByEntityIdDocumentsByDocumentId({ documentId, entityId, entityType }) as TData, ...options });
export const useDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachment = <TData = Common.DocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachmentDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ documentId, entityId, entityType }: {
  documentId: number;
  entityId: number;
  entityType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachmentKeyFn({ documentId, entityId, entityType }, queryKey), queryFn: () => DocumentsService.getV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachment({ documentId, entityId, entityType }) as TData, ...options });
export const useMeetingsServiceGetV1ByEntityTypeByEntityIdMeetings = <TData = Common.MeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entityId, entityType, limit }: {
  entityId: number;
  entityType: string;
  limit?: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsKeyFn({ entityId, entityType, limit }, queryKey), queryFn: () => MeetingsService.getV1ByEntityTypeByEntityIdMeetings({ entityId, entityType, limit }) as TData, ...options });
export const useMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsTemplate = <TData = Common.MeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsTemplateDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ calendarId, entityId, entityType }: {
  calendarId?: number;
  entityId: number;
  entityType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsTemplateKeyFn({ calendarId, entityId, entityType }, queryKey), queryFn: () => MeetingsService.getV1ByEntityTypeByEntityIdMeetingsTemplate({ calendarId, entityId, entityType }) as TData, ...options });
export const useMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsByMeetingId = <TData = Common.MeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsByMeetingIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ entityId, entityType, meetingId }: {
  entityId: number;
  entityType: string;
  meetingId: number;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsByMeetingIdKeyFn({ entityId, entityType, meetingId }, queryKey), queryFn: () => MeetingsService.getV1ByEntityTypeByEntityIdMeetingsByMeetingId({ entityId, entityType, meetingId }) as TData, ...options });
export const useNotesServiceGetV1ByResourceTypeByResourceIdNotes = <TData = Common.NotesServiceGetV1ByResourceTypeByResourceIdNotesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ resourceId, resourceType }: {
  resourceId: number;
  resourceType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseNotesServiceGetV1ByResourceTypeByResourceIdNotesKeyFn({ resourceId, resourceType }, queryKey), queryFn: () => NotesService.getV1ByResourceTypeByResourceIdNotes({ resourceId, resourceType }) as TData, ...options });
export const useNotesServiceGetV1ByResourceTypeByResourceIdNotesByNoteId = <TData = Common.NotesServiceGetV1ByResourceTypeByResourceIdNotesByNoteIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ noteId, resourceId, resourceType }: {
  noteId: number;
  resourceId: number;
  resourceType: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseNotesServiceGetV1ByResourceTypeByResourceIdNotesByNoteIdKeyFn({ noteId, resourceId, resourceType }, queryKey), queryFn: () => NotesService.getV1ByResourceTypeByResourceIdNotesByNoteId({ noteId, resourceId, resourceType }) as TData, ...options });
export const useDefaultServicePostV1CreditBureauIntegrationAddCreditReport = <TData = Common.DefaultServicePostV1CreditBureauIntegrationAddCreditReportMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  creditBureauId?: number;
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  creditBureauId?: number;
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ creditBureauId, formData }) => DefaultService.postV1CreditBureauIntegrationAddCreditReport({ creditBureauId, formData }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePostV1CreditBureauIntegrationCreditReport = <TData = Common.DefaultServicePostV1CreditBureauIntegrationCreditReportMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: { [key: string]: unknown; };
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: { [key: string]: unknown; };
}, TContext>({ mutationFn: ({ requestBody }) => DefaultService.postV1CreditBureauIntegrationCreditReport({ requestBody }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePostV1CreditBureauIntegrationSaveCreditReport = <TData = Common.DefaultServicePostV1CreditBureauIntegrationSaveCreditReportMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  creditBureauId?: number;
  nationalId?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  creditBureauId?: number;
  nationalId?: string;
}, TContext>({ mutationFn: ({ creditBureauId, nationalId }) => DefaultService.postV1CreditBureauIntegrationSaveCreditReport({ creditBureauId, nationalId }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePostV1Email = <TData = Common.DefaultServicePostV1EmailMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
}, TContext>({ mutationFn: ({ requestBody }) => DefaultService.postV1Email({ requestBody }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePostV1EmailCampaign = <TData = Common.DefaultServicePostV1EmailCampaignMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
}, TContext>({ mutationFn: ({ requestBody }) => DefaultService.postV1EmailCampaign({ requestBody }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePostV1EmailCampaignPreview = <TData = Common.DefaultServicePostV1EmailCampaignPreviewMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
}, TContext>({ mutationFn: ({ requestBody }) => DefaultService.postV1EmailCampaignPreview({ requestBody }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePostV1EmailCampaignByResourceId = <TData = Common.DefaultServicePostV1EmailCampaignByResourceIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  requestBody?: string;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  requestBody?: string;
  resourceId: number;
}, TContext>({ mutationFn: ({ command, requestBody, resourceId }) => DefaultService.postV1EmailCampaignByResourceId({ command, requestBody, resourceId }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePostV1InternalCobFastForwardCobDateOfLoanByLoanId = <TData = Common.DefaultServicePostV1InternalCobFastForwardCobDateOfLoanByLoanIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanId: number;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanId: number;
  requestBody?: string;
}, TContext>({ mutationFn: ({ loanId, requestBody }) => DefaultService.postV1InternalCobFastForwardCobDateOfLoanByLoanId({ loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePostV1InternalLoansByLoanIdPlaceLockByLockOwner = <TData = Common.DefaultServicePostV1InternalLoansByLoanIdPlaceLockByLockOwnerMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanId: number;
  lockOwner: string;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanId: number;
  lockOwner: string;
  requestBody?: string;
}, TContext>({ mutationFn: ({ loanId, lockOwner, requestBody }) => DefaultService.postV1InternalLoansByLoanIdPlaceLockByLockOwner({ loanId, lockOwner, requestBody }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePostV1Officetransactions = <TData = Common.DefaultServicePostV1OfficetransactionsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
}, TContext>({ mutationFn: ({ requestBody }) => DefaultService.postV1Officetransactions({ requestBody }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePostV1Smscampaigns = <TData = Common.DefaultServicePostV1SmscampaignsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: CommandWrapper;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: CommandWrapper;
}, TContext>({ mutationFn: ({ requestBody }) => DefaultService.postV1Smscampaigns({ requestBody }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePostV1SmscampaignsPreview = <TData = Common.DefaultServicePostV1SmscampaignsPreviewMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: SmsCampaignPreviewDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: SmsCampaignPreviewDto;
}, TContext>({ mutationFn: ({ requestBody }) => DefaultService.postV1SmscampaignsPreview({ requestBody }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePostV1SmscampaignsByCampaignId = <TData = Common.DefaultServicePostV1SmscampaignsByCampaignIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  campaignId: number;
  command?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  campaignId: number;
  command?: string;
}, TContext>({ mutationFn: ({ campaignId, command }) => DefaultService.postV1SmscampaignsByCampaignId({ campaignId, command }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePostV1ByEntityByEntityIdImages = <TData = Common.DefaultServicePostV1ByEntityByEntityIdImagesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  contentLength?: number;
  entity: string;
  entityId: number;
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  contentLength?: number;
  entity: string;
  entityId: number;
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ contentLength, entity, entityId, formData }) => DefaultService.postV1ByEntityByEntityIdImages({ contentLength, entity, entityId, formData }) as unknown as Promise<TData>, ...options });
export const useCreditBureauConfigurationServicePostV1CreditBureauConfigurationConfigurationByCreditBureauId = <TData = Common.CreditBureauConfigurationServicePostV1CreditBureauConfigurationConfigurationByCreditBureauIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  creditBureauId: number;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  creditBureauId: number;
  requestBody?: string;
}, TContext>({ mutationFn: ({ creditBureauId, requestBody }) => CreditBureauConfigurationService.postV1CreditBureauConfigurationConfigurationByCreditBureauId({ creditBureauId, requestBody }) as unknown as Promise<TData>, ...options });
export const useCreditBureauConfigurationServicePostV1CreditBureauConfigurationMappingsByOrganisationCreditBureauId = <TData = Common.CreditBureauConfigurationServicePostV1CreditBureauConfigurationMappingsByOrganisationCreditBureauIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  organisationCreditBureauId: number;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  organisationCreditBureauId: number;
  requestBody?: string;
}, TContext>({ mutationFn: ({ organisationCreditBureauId, requestBody }) => CreditBureauConfigurationService.postV1CreditBureauConfigurationMappingsByOrganisationCreditBureauId({ organisationCreditBureauId, requestBody }) as unknown as Promise<TData>, ...options });
export const useCreditBureauConfigurationServicePostV1CreditBureauConfigurationOrganisationCreditBureauByOrganisationCreditBureauId = <TData = Common.CreditBureauConfigurationServicePostV1CreditBureauConfigurationOrganisationCreditBureauByOrganisationCreditBureauIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  organisationCreditBureauId: number;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  organisationCreditBureauId: number;
  requestBody?: string;
}, TContext>({ mutationFn: ({ organisationCreditBureauId, requestBody }) => CreditBureauConfigurationService.postV1CreditBureauConfigurationOrganisationCreditBureauByOrganisationCreditBureauId({ organisationCreditBureauId, requestBody }) as unknown as Promise<TData>, ...options });
export const useAccountingRulesServicePostV1Accountingrules = <TData = Common.AccountingRulesServicePostV1AccountingrulesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: AccountRuleRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: AccountRuleRequest;
}, TContext>({ mutationFn: ({ requestBody }) => AccountingRulesService.postV1Accountingrules({ requestBody }) as unknown as Promise<TData>, ...options });
export const useAccountNumberFormatServicePostV1Accountnumberformats = <TData = Common.AccountNumberFormatServicePostV1AccountnumberformatsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: PostAccountNumberFormatsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: PostAccountNumberFormatsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => AccountNumberFormatService.postV1Accountnumberformats({ requestBody }) as unknown as Promise<TData>, ...options });
export const useShareAccountServicePostV1AccountsByType = <TData = Common.ShareAccountServicePostV1AccountsByTypeMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: AccountRequest;
  type: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: AccountRequest;
  type: string;
}, TContext>({ mutationFn: ({ requestBody, type }) => ShareAccountService.postV1AccountsByType({ requestBody, type }) as unknown as Promise<TData>, ...options });
export const useShareAccountServicePostV1AccountsByTypeUploadtemplate = <TData = Common.ShareAccountServicePostV1AccountsByTypeUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
  type: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
  type: string;
}, TContext>({ mutationFn: ({ formData, type }) => ShareAccountService.postV1AccountsByTypeUploadtemplate({ formData, type }) as unknown as Promise<TData>, ...options });
export const useShareAccountServicePostV1AccountsByTypeByAccountId = <TData = Common.ShareAccountServicePostV1AccountsByTypeByAccountIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountId: number;
  command?: string;
  requestBody: PostAccountsTypeAccountIdRequest;
  type: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountId: number;
  command?: string;
  requestBody: PostAccountsTypeAccountIdRequest;
  type: string;
}, TContext>({ mutationFn: ({ accountId, command, requestBody, type }) => ShareAccountService.postV1AccountsByTypeByAccountId({ accountId, command, requestBody, type }) as unknown as Promise<TData>, ...options });
export const useAccountTransfersServicePostV1Accounttransfers = <TData = Common.AccountTransfersServicePostV1AccounttransfersMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: AccountTransferRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: AccountTransferRequest;
}, TContext>({ mutationFn: ({ requestBody }) => AccountTransfersService.postV1Accounttransfers({ requestBody }) as unknown as Promise<TData>, ...options });
export const useAccountTransfersServicePostV1AccounttransfersRefundByTransfer = <TData = Common.AccountTransfersServicePostV1AccounttransfersRefundByTransferMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: AccountTransferRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: AccountTransferRequest;
}, TContext>({ mutationFn: ({ requestBody }) => AccountTransfersService.postV1AccounttransfersRefundByTransfer({ requestBody }) as unknown as Promise<TData>, ...options });
export const useAdhocQueryApiServicePostV1Adhocquery = <TData = Common.AdhocQueryApiServicePostV1AdhocqueryMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: AdHocRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: AdHocRequest;
}, TContext>({ mutationFn: ({ requestBody }) => AdhocQueryApiService.postV1Adhocquery({ requestBody }) as unknown as Promise<TData>, ...options });
export const useAuthenticationHttpBasicServicePostV1Authentication = <TData = Common.AuthenticationHttpBasicServicePostV1AuthenticationMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostAuthenticationRequest;
  returnClientList?: boolean;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostAuthenticationRequest;
  returnClientList?: boolean;
}, TContext>({ mutationFn: ({ requestBody, returnClientList }) => AuthenticationHttpBasicService.postV1Authentication({ requestBody, returnClientList }) as unknown as Promise<TData>, ...options });
export const useBatchApiServicePostV1Batches = <TData = Common.BatchApiServicePostV1BatchesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  enclosingTransaction?: boolean;
  requestBody: BatchRequest[];
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  enclosingTransaction?: boolean;
  requestBody: BatchRequest[];
}, TContext>({ mutationFn: ({ enclosingTransaction, requestBody }) => BatchApiService.postV1Batches({ enclosingTransaction, requestBody }) as unknown as Promise<TData>, ...options });
export const useBusinessDateManagementServicePostV1Businessdate = <TData = Common.BusinessDateManagementServicePostV1BusinessdateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  idempotencyKey?: string;
  requestBody?: BusinessDateUpdateRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  idempotencyKey?: string;
  requestBody?: BusinessDateUpdateRequest;
}, TContext>({ mutationFn: ({ idempotencyKey, requestBody }) => BusinessDateManagementService.postV1Businessdate({ idempotencyKey, requestBody }) as unknown as Promise<TData>, ...options });
export const useCentersServicePostV1Centers = <TData = Common.CentersServicePostV1CentersMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostCentersRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostCentersRequest;
}, TContext>({ mutationFn: ({ requestBody }) => CentersService.postV1Centers({ requestBody }) as unknown as Promise<TData>, ...options });
export const useCentersServicePostV1CentersUploadtemplate = <TData = Common.CentersServicePostV1CentersUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ formData }) => CentersService.postV1CentersUploadtemplate({ formData }) as unknown as Promise<TData>, ...options });
export const useCentersServicePostV1CentersByCenterId = <TData = Common.CentersServicePostV1CentersByCenterIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  centerId: number;
  command?: string;
  requestBody: PostCentersCenterIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  centerId: number;
  command?: string;
  requestBody: PostCentersCenterIdRequest;
}, TContext>({ mutationFn: ({ centerId, command, requestBody }) => CentersService.postV1CentersByCenterId({ centerId, command, requestBody }) as unknown as Promise<TData>, ...options });
export const useChargesServicePostV1Charges = <TData = Common.ChargesServicePostV1ChargesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: ChargeRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: ChargeRequest;
}, TContext>({ mutationFn: ({ requestBody }) => ChargesService.postV1Charges({ requestBody }) as unknown as Promise<TData>, ...options });
export const useClientsAddressServicePostV1ClientByClientidAddresses = <TData = Common.ClientsAddressServicePostV1ClientByClientidAddressesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientid: number;
  requestBody: ClientAddressRequest;
  type?: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientid: number;
  requestBody: ClientAddressRequest;
  type?: number;
}, TContext>({ mutationFn: ({ clientid, requestBody, type }) => ClientsAddressService.postV1ClientByClientidAddresses({ clientid, requestBody, type }) as unknown as Promise<TData>, ...options });
export const useClientServicePostV1Clients = <TData = Common.ClientServicePostV1ClientsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostClientsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostClientsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => ClientService.postV1Clients({ requestBody }) as unknown as Promise<TData>, ...options });
export const useClientServicePostV1ClientsExternalIdByExternalId = <TData = Common.ClientServicePostV1ClientsExternalIdByExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  externalId: string;
  requestBody: PostClientsClientIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  externalId: string;
  requestBody: PostClientsClientIdRequest;
}, TContext>({ mutationFn: ({ command, externalId, requestBody }) => ClientService.postV1ClientsExternalIdByExternalId({ command, externalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useClientServicePostV1ClientsUploadtemplate = <TData = Common.ClientServicePostV1ClientsUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
  legalFormType?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
  legalFormType?: string;
}, TContext>({ mutationFn: ({ formData, legalFormType }) => ClientService.postV1ClientsUploadtemplate({ formData, legalFormType }) as unknown as Promise<TData>, ...options });
export const useClientServicePostV1ClientsByClientId = <TData = Common.ClientServicePostV1ClientsByClientIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
  command?: string;
  requestBody: PostClientsClientIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
  command?: string;
  requestBody: PostClientsClientIdRequest;
}, TContext>({ mutationFn: ({ clientId, command, requestBody }) => ClientService.postV1ClientsByClientId({ clientId, command, requestBody }) as unknown as Promise<TData>, ...options });
export const useClientTransactionServicePostV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalId = <TData = Common.ClientTransactionServicePostV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientExternalId: string;
  command?: string;
  transactionExternalId: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientExternalId: string;
  command?: string;
  transactionExternalId: string;
}, TContext>({ mutationFn: ({ clientExternalId, command, transactionExternalId }) => ClientTransactionService.postV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalId({ clientExternalId, command, transactionExternalId }) as unknown as Promise<TData>, ...options });
export const useClientTransactionServicePostV1ClientsExternalIdByClientExternalIdTransactionsByTransactionId = <TData = Common.ClientTransactionServicePostV1ClientsExternalIdByClientExternalIdTransactionsByTransactionIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientExternalId: string;
  command?: string;
  transactionId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientExternalId: string;
  command?: string;
  transactionId: number;
}, TContext>({ mutationFn: ({ clientExternalId, command, transactionId }) => ClientTransactionService.postV1ClientsExternalIdByClientExternalIdTransactionsByTransactionId({ clientExternalId, command, transactionId }) as unknown as Promise<TData>, ...options });
export const useClientTransactionServicePostV1ClientsByClientIdTransactionsExternalIdByTransactionExternalId = <TData = Common.ClientTransactionServicePostV1ClientsByClientIdTransactionsExternalIdByTransactionExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
  command?: string;
  transactionExternalId: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
  command?: string;
  transactionExternalId: string;
}, TContext>({ mutationFn: ({ clientId, command, transactionExternalId }) => ClientTransactionService.postV1ClientsByClientIdTransactionsExternalIdByTransactionExternalId({ clientId, command, transactionExternalId }) as unknown as Promise<TData>, ...options });
export const useClientTransactionServicePostV1ClientsByClientIdTransactionsByTransactionId = <TData = Common.ClientTransactionServicePostV1ClientsByClientIdTransactionsByTransactionIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
  command?: string;
  transactionId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
  command?: string;
  transactionId: number;
}, TContext>({ mutationFn: ({ clientId, command, transactionId }) => ClientTransactionService.postV1ClientsByClientIdTransactionsByTransactionId({ clientId, command, transactionId }) as unknown as Promise<TData>, ...options });
export const useClientChargesServicePostV1ClientsByClientIdCharges = <TData = Common.ClientChargesServicePostV1ClientsByClientIdChargesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
  requestBody: PostClientsClientIdChargesRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
  requestBody: PostClientsClientIdChargesRequest;
}, TContext>({ mutationFn: ({ clientId, requestBody }) => ClientChargesService.postV1ClientsByClientIdCharges({ clientId, requestBody }) as unknown as Promise<TData>, ...options });
export const useClientChargesServicePostV1ClientsByClientIdChargesByChargeId = <TData = Common.ClientChargesServicePostV1ClientsByClientIdChargesByChargeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  chargeId: number;
  clientId: number;
  command?: string;
  requestBody: PostClientsClientIdChargesChargeIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  chargeId: number;
  clientId: number;
  command?: string;
  requestBody: PostClientsClientIdChargesChargeIdRequest;
}, TContext>({ mutationFn: ({ chargeId, clientId, command, requestBody }) => ClientChargesService.postV1ClientsByClientIdChargesByChargeId({ chargeId, clientId, command, requestBody }) as unknown as Promise<TData>, ...options });
export const useClientCollateralManagementServicePostV1ClientsByClientIdCollaterals = <TData = Common.ClientCollateralManagementServicePostV1ClientsByClientIdCollateralsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
  requestBody: ClientCollateralRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
  requestBody: ClientCollateralRequest;
}, TContext>({ mutationFn: ({ clientId, requestBody }) => ClientCollateralManagementService.postV1ClientsByClientIdCollaterals({ clientId, requestBody }) as unknown as Promise<TData>, ...options });
export const useClientFamilyMemberServicePostV1ClientsByClientIdFamilymembers = <TData = Common.ClientFamilyMemberServicePostV1ClientsByClientIdFamilymembersMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
  requestBody?: ClientFamilyMemberRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
  requestBody?: ClientFamilyMemberRequest;
}, TContext>({ mutationFn: ({ clientId, requestBody }) => ClientFamilyMemberService.postV1ClientsByClientIdFamilymembers({ clientId, requestBody }) as unknown as Promise<TData>, ...options });
export const useClientIdentifierServicePostV1ClientsByClientIdIdentifiers = <TData = Common.ClientIdentifierServicePostV1ClientsByClientIdIdentifiersMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
  requestBody: PostClientsClientIdIdentifiersRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
  requestBody: PostClientsClientIdIdentifiersRequest;
}, TContext>({ mutationFn: ({ clientId, requestBody }) => ClientIdentifierService.postV1ClientsByClientIdIdentifiers({ clientId, requestBody }) as unknown as Promise<TData>, ...options });
export const useCodesServicePostV1Codes = <TData = Common.CodesServicePostV1CodesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostCodesRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostCodesRequest;
}, TContext>({ mutationFn: ({ requestBody }) => CodesService.postV1Codes({ requestBody }) as unknown as Promise<TData>, ...options });
export const useCodeValuesServicePostV1CodesByCodeIdCodevalues = <TData = Common.CodeValuesServicePostV1CodesByCodeIdCodevaluesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  codeId: number;
  requestBody: PostCodeValuesDataRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  codeId: number;
  requestBody: PostCodeValuesDataRequest;
}, TContext>({ mutationFn: ({ codeId, requestBody }) => CodeValuesService.postV1CodesByCodeIdCodevalues({ codeId, requestBody }) as unknown as Promise<TData>, ...options });
export const useCollateralManagementServicePostV1CollateralManagement = <TData = Common.CollateralManagementServicePostV1CollateralManagementMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: CollateralManagementProductRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: CollateralManagementProductRequest;
}, TContext>({ mutationFn: ({ requestBody }) => CollateralManagementService.postV1CollateralManagement({ requestBody }) as unknown as Promise<TData>, ...options });
export const useCollectionSheetServicePostV1Collectionsheet = <TData = Common.CollectionSheetServicePostV1CollectionsheetMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  requestBody: CollectionSheetRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  requestBody: CollectionSheetRequest;
}, TContext>({ mutationFn: ({ command, requestBody }) => CollectionSheetService.postV1Collectionsheet({ command, requestBody }) as unknown as Promise<TData>, ...options });
export const useDataTablesServicePostV1Datatables = <TData = Common.DataTablesServicePostV1DatatablesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostDataTablesRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostDataTablesRequest;
}, TContext>({ mutationFn: ({ requestBody }) => DataTablesService.postV1Datatables({ requestBody }) as unknown as Promise<TData>, ...options });
export const useDataTablesServicePostV1DatatablesDeregisterByDatatable = <TData = Common.DataTablesServicePostV1DatatablesDeregisterByDatatableMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  datatable: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  datatable: string;
}, TContext>({ mutationFn: ({ datatable }) => DataTablesService.postV1DatatablesDeregisterByDatatable({ datatable }) as unknown as Promise<TData>, ...options });
export const useDataTablesServicePostV1DatatablesRegisterByDatatableByApptable = <TData = Common.DataTablesServicePostV1DatatablesRegisterByDatatableByApptableMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  apptable: string;
  datatable: string;
  requestBody?: PostDataTablesRegisterDatatableAppTable;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  apptable: string;
  datatable: string;
  requestBody?: PostDataTablesRegisterDatatableAppTable;
}, TContext>({ mutationFn: ({ apptable, datatable, requestBody }) => DataTablesService.postV1DatatablesRegisterByDatatableByApptable({ apptable, datatable, requestBody }) as unknown as Promise<TData>, ...options });
export const useDataTablesServicePostV1DatatablesByDatatableQuery = <TData = Common.DataTablesServicePostV1DatatablesByDatatableQueryMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  datatable: string;
  requestBody?: PagedLocalRequestAdvancedQueryData;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  datatable: string;
  requestBody?: PagedLocalRequestAdvancedQueryData;
}, TContext>({ mutationFn: ({ datatable, requestBody }) => DataTablesService.postV1DatatablesByDatatableQuery({ datatable, requestBody }) as unknown as Promise<TData>, ...options });
export const useDataTablesServicePostV1DatatablesByDatatableByApptableId = <TData = Common.DataTablesServicePostV1DatatablesByDatatableByApptableIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  apptableId: number;
  datatable: string;
  requestBody: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  apptableId: number;
  datatable: string;
  requestBody: string;
}, TContext>({ mutationFn: ({ apptableId, datatable, requestBody }) => DataTablesService.postV1DatatablesByDatatableByApptableId({ apptableId, datatable, requestBody }) as unknown as Promise<TData>, ...options });
export const useDelinquencyRangeAndBucketsManagementServicePostV1DelinquencyBuckets = <TData = Common.DelinquencyRangeAndBucketsManagementServicePostV1DelinquencyBucketsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: DelinquencyBucketRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: DelinquencyBucketRequest;
}, TContext>({ mutationFn: ({ requestBody }) => DelinquencyRangeAndBucketsManagementService.postV1DelinquencyBuckets({ requestBody }) as unknown as Promise<TData>, ...options });
export const useDelinquencyRangeAndBucketsManagementServicePostV1DelinquencyRanges = <TData = Common.DelinquencyRangeAndBucketsManagementServicePostV1DelinquencyRangesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: DelinquencyRangeRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: DelinquencyRangeRequest;
}, TContext>({ mutationFn: ({ requestBody }) => DelinquencyRangeAndBucketsManagementService.postV1DelinquencyRanges({ requestBody }) as unknown as Promise<TData>, ...options });
export const useEntityDataTableServicePostV1EntityDatatableChecks = <TData = Common.EntityDataTableServicePostV1EntityDatatableChecksMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostEntityDatatableChecksTemplateRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostEntityDatatableChecksTemplateRequest;
}, TContext>({ mutationFn: ({ requestBody }) => EntityDataTableService.postV1EntityDatatableChecks({ requestBody }) as unknown as Promise<TData>, ...options });
export const useFineractEntityServicePostV1EntitytoentitymappingByRelId = <TData = Common.FineractEntityServicePostV1EntitytoentitymappingByRelIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  relId: number;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  relId: number;
  requestBody?: string;
}, TContext>({ mutationFn: ({ relId, requestBody }) => FineractEntityService.postV1EntitytoentitymappingByRelId({ relId, requestBody }) as unknown as Promise<TData>, ...options });
export const useExternalAssetOwnerLoanProductAttributesServicePostV1ExternalAssetOwnersLoanProductByLoanProductIdAttributes = <TData = Common.ExternalAssetOwnerLoanProductAttributesServicePostV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanProductId: number;
  requestBody: PostExternalAssetOwnerLoanProductAttributeRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanProductId: number;
  requestBody: PostExternalAssetOwnerLoanProductAttributeRequest;
}, TContext>({ mutationFn: ({ loanProductId, requestBody }) => ExternalAssetOwnerLoanProductAttributesService.postV1ExternalAssetOwnersLoanProductByLoanProductIdAttributes({ loanProductId, requestBody }) as unknown as Promise<TData>, ...options });
export const useExternalAssetOwnersServicePostV1ExternalAssetOwnersSearch = <TData = Common.ExternalAssetOwnersServicePostV1ExternalAssetOwnersSearchMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: PagedRequestExternalAssetOwnerSearchRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: PagedRequestExternalAssetOwnerSearchRequest;
}, TContext>({ mutationFn: ({ requestBody }) => ExternalAssetOwnersService.postV1ExternalAssetOwnersSearch({ requestBody }) as unknown as Promise<TData>, ...options });
export const useExternalAssetOwnersServicePostV1ExternalAssetOwnersTransfersExternalIdByExternalId = <TData = Common.ExternalAssetOwnersServicePostV1ExternalAssetOwnersTransfersExternalIdByExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  externalId: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  externalId: string;
}, TContext>({ mutationFn: ({ command, externalId }) => ExternalAssetOwnersService.postV1ExternalAssetOwnersTransfersExternalIdByExternalId({ command, externalId }) as unknown as Promise<TData>, ...options });
export const useExternalAssetOwnersServicePostV1ExternalAssetOwnersTransfersLoansExternalIdByLoanExternalId = <TData = Common.ExternalAssetOwnersServicePostV1ExternalAssetOwnersTransfersLoansExternalIdByLoanExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanExternalId: string;
  requestBody: ExternalAssetOwnerRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanExternalId: string;
  requestBody: ExternalAssetOwnerRequest;
}, TContext>({ mutationFn: ({ command, loanExternalId, requestBody }) => ExternalAssetOwnersService.postV1ExternalAssetOwnersTransfersLoansExternalIdByLoanExternalId({ command, loanExternalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useExternalAssetOwnersServicePostV1ExternalAssetOwnersTransfersLoansByLoanId = <TData = Common.ExternalAssetOwnersServicePostV1ExternalAssetOwnersTransfersLoansByLoanIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanId: number;
  requestBody: ExternalAssetOwnerRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanId: number;
  requestBody: ExternalAssetOwnerRequest;
}, TContext>({ mutationFn: ({ command, loanId, requestBody }) => ExternalAssetOwnersService.postV1ExternalAssetOwnersTransfersLoansByLoanId({ command, loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useExternalAssetOwnersServicePostV1ExternalAssetOwnersTransfersById = <TData = Common.ExternalAssetOwnersServicePostV1ExternalAssetOwnersTransfersByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  id: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  id: number;
}, TContext>({ mutationFn: ({ command, id }) => ExternalAssetOwnersService.postV1ExternalAssetOwnersTransfersById({ command, id }) as unknown as Promise<TData>, ...options });
export const useMappingFinancialActivitiesToAccountsServicePostV1Financialactivityaccounts = <TData = Common.MappingFinancialActivitiesToAccountsServicePostV1FinancialactivityaccountsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: PostFinancialActivityAccountsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: PostFinancialActivityAccountsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => MappingFinancialActivitiesToAccountsService.postV1Financialactivityaccounts({ requestBody }) as unknown as Promise<TData>, ...options });
export const useFixedDepositAccountServicePostV1Fixeddepositaccounts = <TData = Common.FixedDepositAccountServicePostV1FixeddepositaccountsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostFixedDepositAccountsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostFixedDepositAccountsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => FixedDepositAccountService.postV1Fixeddepositaccounts({ requestBody }) as unknown as Promise<TData>, ...options });
export const useFixedDepositAccountServicePostV1FixeddepositaccountsTransactionUploadtemplate = <TData = Common.FixedDepositAccountServicePostV1FixeddepositaccountsTransactionUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ formData }) => FixedDepositAccountService.postV1FixeddepositaccountsTransactionUploadtemplate({ formData }) as unknown as Promise<TData>, ...options });
export const useFixedDepositAccountServicePostV1FixeddepositaccountsUploadtemplate = <TData = Common.FixedDepositAccountServicePostV1FixeddepositaccountsUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ formData }) => FixedDepositAccountService.postV1FixeddepositaccountsUploadtemplate({ formData }) as unknown as Promise<TData>, ...options });
export const useFixedDepositAccountServicePostV1FixeddepositaccountsByAccountId = <TData = Common.FixedDepositAccountServicePostV1FixeddepositaccountsByAccountIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountId: number;
  command?: string;
  requestBody: PostFixedDepositAccountsAccountIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountId: number;
  command?: string;
  requestBody: PostFixedDepositAccountsAccountIdRequest;
}, TContext>({ mutationFn: ({ accountId, command, requestBody }) => FixedDepositAccountService.postV1FixeddepositaccountsByAccountId({ accountId, command, requestBody }) as unknown as Promise<TData>, ...options });
export const useFixedDepositAccountTransactionsServicePostV1FixeddepositaccountsByFixedDepositAccountIdTransactions = <TData = Common.FixedDepositAccountTransactionsServicePostV1FixeddepositaccountsByFixedDepositAccountIdTransactionsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  fixedDepositAccountId: number;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  fixedDepositAccountId: number;
  requestBody?: string;
}, TContext>({ mutationFn: ({ command, fixedDepositAccountId, requestBody }) => FixedDepositAccountTransactionsService.postV1FixeddepositaccountsByFixedDepositAccountIdTransactions({ command, fixedDepositAccountId, requestBody }) as unknown as Promise<TData>, ...options });
export const useFixedDepositAccountTransactionsServicePostV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionId = <TData = Common.FixedDepositAccountTransactionsServicePostV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  fixedDepositAccountId: number;
  requestBody?: string;
  transactionId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  fixedDepositAccountId: number;
  requestBody?: string;
  transactionId: number;
}, TContext>({ mutationFn: ({ command, fixedDepositAccountId, requestBody, transactionId }) => FixedDepositAccountTransactionsService.postV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionId({ command, fixedDepositAccountId, requestBody, transactionId }) as unknown as Promise<TData>, ...options });
export const useFixedDepositProductServicePostV1Fixeddepositproducts = <TData = Common.FixedDepositProductServicePostV1FixeddepositproductsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostFixedDepositProductsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostFixedDepositProductsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => FixedDepositProductService.postV1Fixeddepositproducts({ requestBody }) as unknown as Promise<TData>, ...options });
export const useFloatingRatesServicePostV1Floatingrates = <TData = Common.FloatingRatesServicePostV1FloatingratesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: FloatingRateRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: FloatingRateRequest;
}, TContext>({ mutationFn: ({ requestBody }) => FloatingRatesService.postV1Floatingrates({ requestBody }) as unknown as Promise<TData>, ...options });
export const useFundsServicePostV1Funds = <TData = Common.FundsServicePostV1FundsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: FundRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: FundRequest;
}, TContext>({ mutationFn: ({ requestBody }) => FundsService.postV1Funds({ requestBody }) as unknown as Promise<TData>, ...options });
export const useGeneralLedgerAccountServicePostV1Glaccounts = <TData = Common.GeneralLedgerAccountServicePostV1GlaccountsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: PostGLAccountsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: PostGLAccountsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => GeneralLedgerAccountService.postV1Glaccounts({ requestBody }) as unknown as Promise<TData>, ...options });
export const useGeneralLedgerAccountServicePostV1GlaccountsUploadtemplate = <TData = Common.GeneralLedgerAccountServicePostV1GlaccountsUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ formData }) => GeneralLedgerAccountService.postV1GlaccountsUploadtemplate({ formData }) as unknown as Promise<TData>, ...options });
export const useAccountingClosureServicePostV1Glclosures = <TData = Common.AccountingClosureServicePostV1GlclosuresMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostGlClosuresRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostGlClosuresRequest;
}, TContext>({ mutationFn: ({ requestBody }) => AccountingClosureService.postV1Glclosures({ requestBody }) as unknown as Promise<TData>, ...options });
export const useGroupsServicePostV1Groups = <TData = Common.GroupsServicePostV1GroupsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostGroupsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostGroupsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => GroupsService.postV1Groups({ requestBody }) as unknown as Promise<TData>, ...options });
export const useGroupsServicePostV1GroupsUploadtemplate = <TData = Common.GroupsServicePostV1GroupsUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ formData }) => GroupsService.postV1GroupsUploadtemplate({ formData }) as unknown as Promise<TData>, ...options });
export const useGroupsServicePostV1GroupsByGroupId = <TData = Common.GroupsServicePostV1GroupsByGroupIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  groupId: number;
  requestBody: PostGroupsGroupIdRequest;
  roleId?: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  groupId: number;
  requestBody: PostGroupsGroupIdRequest;
  roleId?: number;
}, TContext>({ mutationFn: ({ command, groupId, requestBody, roleId }) => GroupsService.postV1GroupsByGroupId({ command, groupId, requestBody, roleId }) as unknown as Promise<TData>, ...options });
export const useGroupsServicePostV1GroupsByGroupIdCommandUnassignStaff = <TData = Common.GroupsServicePostV1GroupsByGroupIdCommandUnassignStaffMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  groupId: number;
  requestBody: PostGroupsGroupIdCommandUnassignStaffRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  groupId: number;
  requestBody: PostGroupsGroupIdCommandUnassignStaffRequest;
}, TContext>({ mutationFn: ({ groupId, requestBody }) => GroupsService.postV1GroupsByGroupIdCommandUnassignStaff({ groupId, requestBody }) as unknown as Promise<TData>, ...options });
export const useHolidaysServicePostV1Holidays = <TData = Common.HolidaysServicePostV1HolidaysMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostHolidaysRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostHolidaysRequest;
}, TContext>({ mutationFn: ({ requestBody }) => HolidaysService.postV1Holidays({ requestBody }) as unknown as Promise<TData>, ...options });
export const useHolidaysServicePostV1HolidaysByHolidayId = <TData = Common.HolidaysServicePostV1HolidaysByHolidayIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  holidayId: number;
  requestBody: PostHolidaysHolidayIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  holidayId: number;
  requestBody: PostHolidaysHolidayIdRequest;
}, TContext>({ mutationFn: ({ command, holidayId, requestBody }) => HolidaysService.postV1HolidaysByHolidayId({ command, holidayId, requestBody }) as unknown as Promise<TData>, ...options });
export const useHooksServicePostV1Hooks = <TData = Common.HooksServicePostV1HooksMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostHookRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostHookRequest;
}, TContext>({ mutationFn: ({ requestBody }) => HooksService.postV1Hooks({ requestBody }) as unknown as Promise<TData>, ...options });
export const useInterestRateChartServicePostV1Interestratecharts = <TData = Common.InterestRateChartServicePostV1InterestratechartsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostInterestRateChartsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostInterestRateChartsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => InterestRateChartService.postV1Interestratecharts({ requestBody }) as unknown as Promise<TData>, ...options });
export const useInterestRateSlabAKAInterestBandsServicePostV1InterestratechartsByChartIdChartslabs = <TData = Common.InterestRateSlabAKAInterestBandsServicePostV1InterestratechartsByChartIdChartslabsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  chartId: number;
  requestBody: InterestRateChartStabRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  chartId: number;
  requestBody: InterestRateChartStabRequest;
}, TContext>({ mutationFn: ({ chartId, requestBody }) => InterestRateSlabAKAInterestBandsService.postV1InterestratechartsByChartIdChartslabs({ chartId, requestBody }) as unknown as Promise<TData>, ...options });
export const useProgressiveLoanServicePostV1InternalLoanProgressiveByLoanIdModel = <TData = Common.ProgressiveLoanServicePostV1InternalLoanProgressiveByLoanIdModelMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanId: number;
}, TContext>({ mutationFn: ({ loanId }) => ProgressiveLoanService.postV1InternalLoanProgressiveByLoanIdModel({ loanId }) as unknown as Promise<TData>, ...options });
export const useInterOperationServicePostV1InteroperationPartiesByIdTypeByIdValue = <TData = Common.InterOperationServicePostV1InteroperationPartiesByIdTypeByIdValueMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
  requestBody: InteropIdentifierRequestData;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
  requestBody: InteropIdentifierRequestData;
}, TContext>({ mutationFn: ({ idType, idValue, requestBody }) => InterOperationService.postV1InteroperationPartiesByIdTypeByIdValue({ idType, idValue, requestBody }) as unknown as Promise<TData>, ...options });
export const useInterOperationServicePostV1InteroperationPartiesByIdTypeByIdValueBySubIdOrType = <TData = Common.InterOperationServicePostV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
  requestBody: InteropIdentifierRequestData;
  subIdOrType: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
  requestBody: InteropIdentifierRequestData;
  subIdOrType: string;
}, TContext>({ mutationFn: ({ idType, idValue, requestBody, subIdOrType }) => InterOperationService.postV1InteroperationPartiesByIdTypeByIdValueBySubIdOrType({ idType, idValue, requestBody, subIdOrType }) as unknown as Promise<TData>, ...options });
export const useInterOperationServicePostV1InteroperationQuotes = <TData = Common.InterOperationServicePostV1InteroperationQuotesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: InteropQuoteRequestData;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: InteropQuoteRequestData;
}, TContext>({ mutationFn: ({ requestBody }) => InterOperationService.postV1InteroperationQuotes({ requestBody }) as unknown as Promise<TData>, ...options });
export const useInterOperationServicePostV1InteroperationRequests = <TData = Common.InterOperationServicePostV1InteroperationRequestsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: InteropTransactionRequestData;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: InteropTransactionRequestData;
}, TContext>({ mutationFn: ({ requestBody }) => InterOperationService.postV1InteroperationRequests({ requestBody }) as unknown as Promise<TData>, ...options });
export const useInterOperationServicePostV1InteroperationTransactionsByAccountIdDisburse = <TData = Common.InterOperationServicePostV1InteroperationTransactionsByAccountIdDisburseMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountId: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountId: string;
}, TContext>({ mutationFn: ({ accountId }) => InterOperationService.postV1InteroperationTransactionsByAccountIdDisburse({ accountId }) as unknown as Promise<TData>, ...options });
export const useInterOperationServicePostV1InteroperationTransactionsByAccountIdLoanrepayment = <TData = Common.InterOperationServicePostV1InteroperationTransactionsByAccountIdLoanrepaymentMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountId: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountId: string;
}, TContext>({ mutationFn: ({ accountId }) => InterOperationService.postV1InteroperationTransactionsByAccountIdLoanrepayment({ accountId }) as unknown as Promise<TData>, ...options });
export const useInterOperationServicePostV1InteroperationTransfers = <TData = Common.InterOperationServicePostV1InteroperationTransfersMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  action?: string;
  requestBody: InteropTransferRequestData;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  action?: string;
  requestBody: InteropTransferRequestData;
}, TContext>({ mutationFn: ({ action, requestBody }) => InterOperationService.postV1InteroperationTransfers({ action, requestBody }) as unknown as Promise<TData>, ...options });
export const useSchedulerJobServicePostV1JobsShortNameByShortName = <TData = Common.SchedulerJobServicePostV1JobsShortNameByShortNameMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  requestBody?: ExecuteJobRequest;
  shortName: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  requestBody?: ExecuteJobRequest;
  shortName: string;
}, TContext>({ mutationFn: ({ command, requestBody, shortName }) => SchedulerJobService.postV1JobsShortNameByShortName({ command, requestBody, shortName }) as unknown as Promise<TData>, ...options });
export const useSchedulerJobServicePostV1JobsByJobId = <TData = Common.SchedulerJobServicePostV1JobsByJobIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  jobId: number;
  requestBody?: ExecuteJobRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  jobId: number;
  requestBody?: ExecuteJobRequest;
}, TContext>({ mutationFn: ({ command, jobId, requestBody }) => SchedulerJobService.postV1JobsByJobId({ command, jobId, requestBody }) as unknown as Promise<TData>, ...options });
export const useInlineJobServicePostV1JobsByJobNameInline = <TData = Common.InlineJobServicePostV1JobsByJobNameInlineMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  jobName: string;
  requestBody?: InlineJobRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  jobName: string;
  requestBody?: InlineJobRequest;
}, TContext>({ mutationFn: ({ jobName, requestBody }) => InlineJobService.postV1JobsByJobNameInline({ jobName, requestBody }) as unknown as Promise<TData>, ...options });
export const useJournalEntriesServicePostV1Journalentries = <TData = Common.JournalEntriesServicePostV1JournalentriesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  requestBody?: JournalEntryCommand;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  requestBody?: JournalEntryCommand;
}, TContext>({ mutationFn: ({ command, requestBody }) => JournalEntriesService.postV1Journalentries({ command, requestBody }) as unknown as Promise<TData>, ...options });
export const useJournalEntriesServicePostV1JournalentriesUploadtemplate = <TData = Common.JournalEntriesServicePostV1JournalentriesUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ formData }) => JournalEntriesService.postV1JournalentriesUploadtemplate({ formData }) as unknown as Promise<TData>, ...options });
export const useJournalEntriesServicePostV1JournalentriesByTransactionId = <TData = Common.JournalEntriesServicePostV1JournalentriesByTransactionIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  requestBody?: PostJournalEntriesTransactionIdRequest;
  transactionId: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  requestBody?: PostJournalEntriesTransactionIdRequest;
  transactionId: string;
}, TContext>({ mutationFn: ({ command, requestBody, transactionId }) => JournalEntriesService.postV1JournalentriesByTransactionId({ command, requestBody, transactionId }) as unknown as Promise<TData>, ...options });
export const useLoanProductsServicePostV1Loanproducts = <TData = Common.LoanProductsServicePostV1LoanproductsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostLoanProductsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostLoanProductsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => LoanProductsService.postV1Loanproducts({ requestBody }) as unknown as Promise<TData>, ...options });
export const useProductMixServicePostV1LoanproductsByProductIdProductmix = <TData = Common.ProductMixServicePostV1LoanproductsByProductIdProductmixMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  productId: number;
  requestBody?: ProductMixRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  productId: number;
  requestBody?: ProductMixRequest;
}, TContext>({ mutationFn: ({ productId, requestBody }) => ProductMixService.postV1LoanproductsByProductIdProductmix({ productId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoansServicePostV1Loans = <TData = Common.LoansServicePostV1LoansMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  requestBody: PostLoansRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  requestBody: PostLoansRequest;
}, TContext>({ mutationFn: ({ command, requestBody }) => LoansService.postV1Loans({ command, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoansServicePostV1LoansExternalIdByLoanExternalId = <TData = Common.LoansServicePostV1LoansExternalIdByLoanExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanExternalId: string;
  requestBody: PostLoansLoanIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanExternalId: string;
  requestBody: PostLoansLoanIdRequest;
}, TContext>({ mutationFn: ({ command, loanExternalId, requestBody }) => LoansService.postV1LoansExternalIdByLoanExternalId({ command, loanExternalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoansServicePostV1LoansExternalIdByLoanExternalIdDelinquencyActions = <TData = Common.LoansServicePostV1LoansExternalIdByLoanExternalIdDelinquencyActionsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanExternalId: string;
  requestBody: PostLoansDelinquencyActionRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanExternalId: string;
  requestBody: PostLoansDelinquencyActionRequest;
}, TContext>({ mutationFn: ({ loanExternalId, requestBody }) => LoansService.postV1LoansExternalIdByLoanExternalIdDelinquencyActions({ loanExternalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoansServicePostV1LoansGlimAccountByGlimId = <TData = Common.LoansServicePostV1LoansGlimAccountByGlimIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  glimId: number;
  requestBody: PostLoansLoanIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  glimId: number;
  requestBody: PostLoansLoanIdRequest;
}, TContext>({ mutationFn: ({ command, glimId, requestBody }) => LoansService.postV1LoansGlimAccountByGlimId({ command, glimId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoansServicePostV1LoansRepaymentsUploadtemplate = <TData = Common.LoansServicePostV1LoansRepaymentsUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ formData }) => LoansService.postV1LoansRepaymentsUploadtemplate({ formData }) as unknown as Promise<TData>, ...options });
export const useLoansServicePostV1LoansUploadtemplate = <TData = Common.LoansServicePostV1LoansUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ formData }) => LoansService.postV1LoansUploadtemplate({ formData }) as unknown as Promise<TData>, ...options });
export const useLoansServicePostV1LoansByLoanId = <TData = Common.LoansServicePostV1LoansByLoanIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanId: number;
  requestBody: PostLoansLoanIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanId: number;
  requestBody: PostLoansLoanIdRequest;
}, TContext>({ mutationFn: ({ command, loanId, requestBody }) => LoansService.postV1LoansByLoanId({ command, loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoansServicePostV1LoansByLoanIdDelinquencyActions = <TData = Common.LoansServicePostV1LoansByLoanIdDelinquencyActionsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanId: number;
  requestBody: PostLoansDelinquencyActionRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanId: number;
  requestBody: PostLoansDelinquencyActionRequest;
}, TContext>({ mutationFn: ({ loanId, requestBody }) => LoansService.postV1LoansByLoanIdDelinquencyActions({ loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoansPointInTimeServicePostV1LoansAtDateSearch = <TData = Common.LoansPointInTimeServicePostV1LoansAtDateSearchMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: RetrieveLoansPointInTimeRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: RetrieveLoansPointInTimeRequest;
}, TContext>({ mutationFn: ({ requestBody }) => LoansPointInTimeService.postV1LoansAtDateSearch({ requestBody }) as unknown as Promise<TData>, ...options });
export const useLoansPointInTimeServicePostV1LoansAtDateSearchExternalId = <TData = Common.LoansPointInTimeServicePostV1LoansAtDateSearchExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: RetrieveLoansPointInTimeExternalIdsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: RetrieveLoansPointInTimeExternalIdsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => LoansPointInTimeService.postV1LoansAtDateSearchExternalId({ requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanCobCatchUpServicePostV1LoansCatchUp = <TData = Common.LoanCobCatchUpServicePostV1LoansCatchUpMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => LoanCobCatchUpService.postV1LoansCatchUp() as unknown as Promise<TData>, ...options });
export const useLoanChargesServicePostV1LoansExternalIdByLoanExternalIdCharges = <TData = Common.LoanChargesServicePostV1LoansExternalIdByLoanExternalIdChargesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanExternalId: string;
  requestBody: PostLoansLoanIdChargesRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanExternalId: string;
  requestBody: PostLoansLoanIdChargesRequest;
}, TContext>({ mutationFn: ({ command, loanExternalId, requestBody }) => LoanChargesService.postV1LoansExternalIdByLoanExternalIdCharges({ command, loanExternalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanChargesServicePostV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalId = <TData = Common.LoanChargesServicePostV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanChargeExternalId: string;
  loanExternalId: string;
  requestBody: PostLoansLoanIdChargesChargeIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanChargeExternalId: string;
  loanExternalId: string;
  requestBody: PostLoansLoanIdChargesChargeIdRequest;
}, TContext>({ mutationFn: ({ command, loanChargeExternalId, loanExternalId, requestBody }) => LoanChargesService.postV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalId({ command, loanChargeExternalId, loanExternalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanChargesServicePostV1LoansExternalIdByLoanExternalIdChargesByLoanChargeId = <TData = Common.LoanChargesServicePostV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanChargeId: number;
  loanExternalId: string;
  requestBody: PostLoansLoanIdChargesChargeIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanChargeId: number;
  loanExternalId: string;
  requestBody: PostLoansLoanIdChargesChargeIdRequest;
}, TContext>({ mutationFn: ({ command, loanChargeId, loanExternalId, requestBody }) => LoanChargesService.postV1LoansExternalIdByLoanExternalIdChargesByLoanChargeId({ command, loanChargeId, loanExternalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanChargesServicePostV1LoansByLoanIdCharges = <TData = Common.LoanChargesServicePostV1LoansByLoanIdChargesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanId: number;
  requestBody: PostLoansLoanIdChargesRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanId: number;
  requestBody: PostLoansLoanIdChargesRequest;
}, TContext>({ mutationFn: ({ command, loanId, requestBody }) => LoanChargesService.postV1LoansByLoanIdCharges({ command, loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanChargesServicePostV1LoansByLoanIdChargesExternalIdByLoanChargeExternalId = <TData = Common.LoanChargesServicePostV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanChargeExternalId: string;
  loanId: number;
  requestBody: PostLoansLoanIdChargesChargeIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanChargeExternalId: string;
  loanId: number;
  requestBody: PostLoansLoanIdChargesChargeIdRequest;
}, TContext>({ mutationFn: ({ command, loanChargeExternalId, loanId, requestBody }) => LoanChargesService.postV1LoansByLoanIdChargesExternalIdByLoanChargeExternalId({ command, loanChargeExternalId, loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanChargesServicePostV1LoansByLoanIdChargesByLoanChargeId = <TData = Common.LoanChargesServicePostV1LoansByLoanIdChargesByLoanChargeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanChargeId: number;
  loanId: number;
  requestBody: PostLoansLoanIdChargesChargeIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanChargeId: number;
  loanId: number;
  requestBody: PostLoansLoanIdChargesChargeIdRequest;
}, TContext>({ mutationFn: ({ command, loanChargeId, loanId, requestBody }) => LoanChargesService.postV1LoansByLoanIdChargesByLoanChargeId({ command, loanChargeId, loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanInterestPauseServicePostV1LoansExternalIdByLoanExternalIdInterestPauses = <TData = Common.LoanInterestPauseServicePostV1LoansExternalIdByLoanExternalIdInterestPausesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanExternalId: string;
  requestBody: InterestPauseRequestDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanExternalId: string;
  requestBody: InterestPauseRequestDto;
}, TContext>({ mutationFn: ({ loanExternalId, requestBody }) => LoanInterestPauseService.postV1LoansExternalIdByLoanExternalIdInterestPauses({ loanExternalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanInterestPauseServicePostV1LoansByLoanIdInterestPauses = <TData = Common.LoanInterestPauseServicePostV1LoansByLoanIdInterestPausesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanId: number;
  requestBody: InterestPauseRequestDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanId: number;
  requestBody: InterestPauseRequestDto;
}, TContext>({ mutationFn: ({ loanId, requestBody }) => LoanInterestPauseService.postV1LoansByLoanIdInterestPauses({ loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanTransactionsServicePostV1LoansExternalIdByLoanExternalIdTransactions = <TData = Common.LoanTransactionsServicePostV1LoansExternalIdByLoanExternalIdTransactionsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanExternalId: string;
  requestBody: PostLoansLoanIdTransactionsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanExternalId: string;
  requestBody: PostLoansLoanIdTransactionsRequest;
}, TContext>({ mutationFn: ({ command, loanExternalId, requestBody }) => LoanTransactionsService.postV1LoansExternalIdByLoanExternalIdTransactions({ command, loanExternalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanTransactionsServicePostV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionId = <TData = Common.LoanTransactionsServicePostV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  externalTransactionId: string;
  loanExternalId: string;
  requestBody: PostLoansLoanIdTransactionsTransactionIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  externalTransactionId: string;
  loanExternalId: string;
  requestBody: PostLoansLoanIdTransactionsTransactionIdRequest;
}, TContext>({ mutationFn: ({ command, externalTransactionId, loanExternalId, requestBody }) => LoanTransactionsService.postV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionId({ command, externalTransactionId, loanExternalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanTransactionsServicePostV1LoansExternalIdByLoanExternalIdTransactionsByTransactionId = <TData = Common.LoanTransactionsServicePostV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanExternalId: string;
  requestBody: PostLoansLoanIdTransactionsTransactionIdRequest;
  transactionId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanExternalId: string;
  requestBody: PostLoansLoanIdTransactionsTransactionIdRequest;
  transactionId: number;
}, TContext>({ mutationFn: ({ command, loanExternalId, requestBody, transactionId }) => LoanTransactionsService.postV1LoansExternalIdByLoanExternalIdTransactionsByTransactionId({ command, loanExternalId, requestBody, transactionId }) as unknown as Promise<TData>, ...options });
export const useLoanTransactionsServicePostV1LoansByLoanIdTransactions = <TData = Common.LoanTransactionsServicePostV1LoansByLoanIdTransactionsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanId: number;
  requestBody: PostLoansLoanIdTransactionsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanId: number;
  requestBody: PostLoansLoanIdTransactionsRequest;
}, TContext>({ mutationFn: ({ command, loanId, requestBody }) => LoanTransactionsService.postV1LoansByLoanIdTransactions({ command, loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanTransactionsServicePostV1LoansByLoanIdTransactionsExternalIdByExternalTransactionId = <TData = Common.LoanTransactionsServicePostV1LoansByLoanIdTransactionsExternalIdByExternalTransactionIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  externalTransactionId: string;
  loanId: number;
  requestBody: PostLoansLoanIdTransactionsTransactionIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  externalTransactionId: string;
  loanId: number;
  requestBody: PostLoansLoanIdTransactionsTransactionIdRequest;
}, TContext>({ mutationFn: ({ command, externalTransactionId, loanId, requestBody }) => LoanTransactionsService.postV1LoansByLoanIdTransactionsExternalIdByExternalTransactionId({ command, externalTransactionId, loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanTransactionsServicePostV1LoansByLoanIdTransactionsByTransactionId = <TData = Common.LoanTransactionsServicePostV1LoansByLoanIdTransactionsByTransactionIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanId: number;
  requestBody: PostLoansLoanIdTransactionsTransactionIdRequest;
  transactionId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanId: number;
  requestBody: PostLoansLoanIdTransactionsTransactionIdRequest;
  transactionId: number;
}, TContext>({ mutationFn: ({ command, loanId, requestBody, transactionId }) => LoanTransactionsService.postV1LoansByLoanIdTransactionsByTransactionId({ command, loanId, requestBody, transactionId }) as unknown as Promise<TData>, ...options });
export const useBulkLoansServicePostV1LoansLoanreassignment = <TData = Common.BulkLoansServicePostV1LoansLoanreassignmentMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
}, TContext>({ mutationFn: ({ requestBody }) => BulkLoansService.postV1LoansLoanreassignment({ requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanCollateralServicePostV1LoansByLoanIdCollaterals = <TData = Common.LoanCollateralServicePostV1LoansByLoanIdCollateralsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanId: number;
  requestBody: LoansLoanIdCollateralsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanId: number;
  requestBody: LoansLoanIdCollateralsRequest;
}, TContext>({ mutationFn: ({ loanId, requestBody }) => LoanCollateralService.postV1LoansByLoanIdCollaterals({ loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useGuarantorsServicePostV1LoansByLoanIdGuarantors = <TData = Common.GuarantorsServicePostV1LoansByLoanIdGuarantorsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanId: number;
  requestBody?: GuarantorsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanId: number;
  requestBody?: GuarantorsRequest;
}, TContext>({ mutationFn: ({ loanId, requestBody }) => GuarantorsService.postV1LoansByLoanIdGuarantors({ loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useGuarantorsServicePostV1LoansByLoanIdGuarantorsUploadtemplate = <TData = Common.GuarantorsServicePostV1LoansByLoanIdGuarantorsUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
  loanId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
  loanId: number;
}, TContext>({ mutationFn: ({ formData, loanId }) => GuarantorsService.postV1LoansByLoanIdGuarantorsUploadtemplate({ formData, loanId }) as unknown as Promise<TData>, ...options });
export const useLoanReschedulingServicePostV1LoansByLoanIdSchedule = <TData = Common.LoanReschedulingServicePostV1LoansByLoanIdScheduleMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanId: number;
  requestBody: PostLoansLoanIdScheduleRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanId: number;
  requestBody: PostLoansLoanIdScheduleRequest;
}, TContext>({ mutationFn: ({ command, loanId, requestBody }) => LoanReschedulingService.postV1LoansByLoanIdSchedule({ command, loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useMakerCheckerOr4EyeFunctionalityServicePostV1MakercheckersByAuditId = <TData = Common.MakerCheckerOr4EyeFunctionalityServicePostV1MakercheckersByAuditIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  auditId: number;
  command?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  auditId: number;
  command?: string;
}, TContext>({ mutationFn: ({ auditId, command }) => MakerCheckerOr4EyeFunctionalityService.postV1MakercheckersByAuditId({ auditId, command }) as unknown as Promise<TData>, ...options });
export const useOfficesServicePostV1Offices = <TData = Common.OfficesServicePostV1OfficesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostOfficesRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostOfficesRequest;
}, TContext>({ mutationFn: ({ requestBody }) => OfficesService.postV1Offices({ requestBody }) as unknown as Promise<TData>, ...options });
export const useOfficesServicePostV1OfficesUploadtemplate = <TData = Common.OfficesServicePostV1OfficesUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ formData }) => OfficesService.postV1OfficesUploadtemplate({ formData }) as unknown as Promise<TData>, ...options });
export const usePaymentTypeServicePostV1Paymenttypes = <TData = Common.PaymentTypeServicePostV1PaymenttypesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PaymentTypeRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PaymentTypeRequest;
}, TContext>({ mutationFn: ({ requestBody }) => PaymentTypeService.postV1Paymenttypes({ requestBody }) as unknown as Promise<TData>, ...options });
export const useProductsServicePostV1ProductsByType = <TData = Common.ProductsServicePostV1ProductsByTypeMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostProductsTypeRequest;
  type: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostProductsTypeRequest;
  type: string;
}, TContext>({ mutationFn: ({ requestBody, type }) => ProductsService.postV1ProductsByType({ requestBody, type }) as unknown as Promise<TData>, ...options });
export const useProductsServicePostV1ProductsByTypeByProductId = <TData = Common.ProductsServicePostV1ProductsByTypeByProductIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  productId: number;
  type: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  productId: number;
  type: string;
}, TContext>({ mutationFn: ({ command, productId, type }) => ProductsService.postV1ProductsByTypeByProductId({ command, productId, type }) as unknown as Promise<TData>, ...options });
export const useProvisioningCategoryServicePostV1Provisioningcategory = <TData = Common.ProvisioningCategoryServicePostV1ProvisioningcategoryMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
}, TContext>({ mutationFn: ({ requestBody }) => ProvisioningCategoryService.postV1Provisioningcategory({ requestBody }) as unknown as Promise<TData>, ...options });
export const useProvisioningCriteriaServicePostV1Provisioningcriteria = <TData = Common.ProvisioningCriteriaServicePostV1ProvisioningcriteriaMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostProvisioningCriteriaRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostProvisioningCriteriaRequest;
}, TContext>({ mutationFn: ({ requestBody }) => ProvisioningCriteriaService.postV1Provisioningcriteria({ requestBody }) as unknown as Promise<TData>, ...options });
export const useProvisioningEntriesServicePostV1Provisioningentries = <TData = Common.ProvisioningEntriesServicePostV1ProvisioningentriesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: ProvisionEntryRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: ProvisionEntryRequest;
}, TContext>({ mutationFn: ({ requestBody }) => ProvisioningEntriesService.postV1Provisioningentries({ requestBody }) as unknown as Promise<TData>, ...options });
export const useProvisioningEntriesServicePostV1ProvisioningentriesByEntryId = <TData = Common.ProvisioningEntriesServicePostV1ProvisioningentriesByEntryIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  entryId: number;
  requestBody?: PutProvisioningEntriesRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  entryId: number;
  requestBody?: PutProvisioningEntriesRequest;
}, TContext>({ mutationFn: ({ command, entryId, requestBody }) => ProvisioningEntriesService.postV1ProvisioningentriesByEntryId({ command, entryId, requestBody }) as unknown as Promise<TData>, ...options });
export const useRateServicePostV1Rates = <TData = Common.RateServicePostV1RatesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: RateRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: RateRequest;
}, TContext>({ mutationFn: ({ requestBody }) => RateService.postV1Rates({ requestBody }) as unknown as Promise<TData>, ...options });
export const useRecurringDepositAccountServicePostV1Recurringdepositaccounts = <TData = Common.RecurringDepositAccountServicePostV1RecurringdepositaccountsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostRecurringDepositAccountsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostRecurringDepositAccountsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => RecurringDepositAccountService.postV1Recurringdepositaccounts({ requestBody }) as unknown as Promise<TData>, ...options });
export const useRecurringDepositAccountServicePostV1RecurringdepositaccountsTransactionsUploadtemplate = <TData = Common.RecurringDepositAccountServicePostV1RecurringdepositaccountsTransactionsUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ formData }) => RecurringDepositAccountService.postV1RecurringdepositaccountsTransactionsUploadtemplate({ formData }) as unknown as Promise<TData>, ...options });
export const useRecurringDepositAccountServicePostV1RecurringdepositaccountsUploadtemplate = <TData = Common.RecurringDepositAccountServicePostV1RecurringdepositaccountsUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ formData }) => RecurringDepositAccountService.postV1RecurringdepositaccountsUploadtemplate({ formData }) as unknown as Promise<TData>, ...options });
export const useRecurringDepositAccountServicePostV1RecurringdepositaccountsByAccountId = <TData = Common.RecurringDepositAccountServicePostV1RecurringdepositaccountsByAccountIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountId: number;
  command?: string;
  requestBody: PostRecurringDepositAccountsAccountIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountId: number;
  command?: string;
  requestBody: PostRecurringDepositAccountsAccountIdRequest;
}, TContext>({ mutationFn: ({ accountId, command, requestBody }) => RecurringDepositAccountService.postV1RecurringdepositaccountsByAccountId({ accountId, command, requestBody }) as unknown as Promise<TData>, ...options });
export const useRecurringDepositAccountTransactionsServicePostV1RecurringdepositaccountsByRecurringDepositAccountIdTransactions = <TData = Common.RecurringDepositAccountTransactionsServicePostV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  recurringDepositAccountId: number;
  requestBody: PostRecurringDepositAccountsRecurringDepositAccountIdTransactionsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  recurringDepositAccountId: number;
  requestBody: PostRecurringDepositAccountsRecurringDepositAccountIdTransactionsRequest;
}, TContext>({ mutationFn: ({ command, recurringDepositAccountId, requestBody }) => RecurringDepositAccountTransactionsService.postV1RecurringdepositaccountsByRecurringDepositAccountIdTransactions({ command, recurringDepositAccountId, requestBody }) as unknown as Promise<TData>, ...options });
export const useRecurringDepositAccountTransactionsServicePostV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionId = <TData = Common.RecurringDepositAccountTransactionsServicePostV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  recurringDepositAccountId: number;
  requestBody: PostRecurringDepositAccountsRecurringDepositAccountIdTransactionsRequest;
  transactionId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  recurringDepositAccountId: number;
  requestBody: PostRecurringDepositAccountsRecurringDepositAccountIdTransactionsRequest;
  transactionId: number;
}, TContext>({ mutationFn: ({ command, recurringDepositAccountId, requestBody, transactionId }) => RecurringDepositAccountTransactionsService.postV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionId({ command, recurringDepositAccountId, requestBody, transactionId }) as unknown as Promise<TData>, ...options });
export const useRecurringDepositProductServicePostV1Recurringdepositproducts = <TData = Common.RecurringDepositProductServicePostV1RecurringdepositproductsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostRecurringDepositProductsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostRecurringDepositProductsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => RecurringDepositProductService.postV1Recurringdepositproducts({ requestBody }) as unknown as Promise<TData>, ...options });
export const useReportMailingJobsServicePostV1Reportmailingjobs = <TData = Common.ReportMailingJobsServicePostV1ReportmailingjobsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostReportMailingJobsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostReportMailingJobsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => ReportMailingJobsService.postV1Reportmailingjobs({ requestBody }) as unknown as Promise<TData>, ...options });
export const useReportsServicePostV1Reports = <TData = Common.ReportsServicePostV1ReportsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostRepostRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostRepostRequest;
}, TContext>({ mutationFn: ({ requestBody }) => ReportsService.postV1Reports({ requestBody }) as unknown as Promise<TData>, ...options });
export const useRescheduleLoansServicePostV1Rescheduleloans = <TData = Common.RescheduleLoansServicePostV1RescheduleloansMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostCreateRescheduleLoansRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostCreateRescheduleLoansRequest;
}, TContext>({ mutationFn: ({ requestBody }) => RescheduleLoansService.postV1Rescheduleloans({ requestBody }) as unknown as Promise<TData>, ...options });
export const useRescheduleLoansServicePostV1RescheduleloansByScheduleId = <TData = Common.RescheduleLoansServicePostV1RescheduleloansByScheduleIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  requestBody: PostUpdateRescheduleLoansRequest;
  scheduleId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  requestBody: PostUpdateRescheduleLoansRequest;
  scheduleId: number;
}, TContext>({ mutationFn: ({ command, requestBody, scheduleId }) => RescheduleLoansService.postV1RescheduleloansByScheduleId({ command, requestBody, scheduleId }) as unknown as Promise<TData>, ...options });
export const useRolesServicePostV1Roles = <TData = Common.RolesServicePostV1RolesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostRolesRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostRolesRequest;
}, TContext>({ mutationFn: ({ requestBody }) => RolesService.postV1Roles({ requestBody }) as unknown as Promise<TData>, ...options });
export const useRolesServicePostV1RolesByRoleId = <TData = Common.RolesServicePostV1RolesByRoleIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  roleId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  roleId: number;
}, TContext>({ mutationFn: ({ command, roleId }) => RolesService.postV1RolesByRoleId({ command, roleId }) as unknown as Promise<TData>, ...options });
export const usePeriodicAccrualAccountingServicePostV1Runaccruals = <TData = Common.PeriodicAccrualAccountingServicePostV1RunaccrualsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostRunaccrualsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostRunaccrualsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => PeriodicAccrualAccountingService.postV1Runaccruals({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSavingsAccountServicePostV1Savingsaccounts = <TData = Common.SavingsAccountServicePostV1SavingsaccountsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostSavingsAccountsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostSavingsAccountsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => SavingsAccountService.postV1Savingsaccounts({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSavingsAccountServicePostV1SavingsaccountsExternalIdByExternalId = <TData = Common.SavingsAccountServicePostV1SavingsaccountsExternalIdByExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  externalId: string;
  requestBody: PostSavingsAccountsAccountIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  externalId: string;
  requestBody: PostSavingsAccountsAccountIdRequest;
}, TContext>({ mutationFn: ({ command, externalId, requestBody }) => SavingsAccountService.postV1SavingsaccountsExternalIdByExternalId({ command, externalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useSavingsAccountServicePostV1SavingsaccountsGsim = <TData = Common.SavingsAccountServicePostV1SavingsaccountsGsimMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
}, TContext>({ mutationFn: ({ requestBody }) => SavingsAccountService.postV1SavingsaccountsGsim({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSavingsAccountServicePostV1SavingsaccountsGsimcommandsByParentAccountId = <TData = Common.SavingsAccountServicePostV1SavingsaccountsGsimcommandsByParentAccountIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  parentAccountId: number;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  parentAccountId: number;
  requestBody?: string;
}, TContext>({ mutationFn: ({ command, parentAccountId, requestBody }) => SavingsAccountService.postV1SavingsaccountsGsimcommandsByParentAccountId({ command, parentAccountId, requestBody }) as unknown as Promise<TData>, ...options });
export const useSavingsAccountServicePostV1SavingsaccountsTransactionsUploadtemplate = <TData = Common.SavingsAccountServicePostV1SavingsaccountsTransactionsUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ formData }) => SavingsAccountService.postV1SavingsaccountsTransactionsUploadtemplate({ formData }) as unknown as Promise<TData>, ...options });
export const useSavingsAccountServicePostV1SavingsaccountsUploadtemplate = <TData = Common.SavingsAccountServicePostV1SavingsaccountsUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ formData }) => SavingsAccountService.postV1SavingsaccountsUploadtemplate({ formData }) as unknown as Promise<TData>, ...options });
export const useSavingsAccountServicePostV1SavingsaccountsByAccountId = <TData = Common.SavingsAccountServicePostV1SavingsaccountsByAccountIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountId: number;
  command?: string;
  requestBody: PostSavingsAccountsAccountIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountId: number;
  command?: string;
  requestBody: PostSavingsAccountsAccountIdRequest;
}, TContext>({ mutationFn: ({ accountId, command, requestBody }) => SavingsAccountService.postV1SavingsaccountsByAccountId({ accountId, command, requestBody }) as unknown as Promise<TData>, ...options });
export const useSavingsChargesServicePostV1SavingsaccountsBySavingsAccountIdCharges = <TData = Common.SavingsChargesServicePostV1SavingsaccountsBySavingsAccountIdChargesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostSavingsAccountsSavingsAccountIdChargesRequest;
  savingsAccountId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostSavingsAccountsSavingsAccountIdChargesRequest;
  savingsAccountId: number;
}, TContext>({ mutationFn: ({ requestBody, savingsAccountId }) => SavingsChargesService.postV1SavingsaccountsBySavingsAccountIdCharges({ requestBody, savingsAccountId }) as unknown as Promise<TData>, ...options });
export const useSavingsChargesServicePostV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeId = <TData = Common.SavingsChargesServicePostV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  requestBody: PostSavingsAccountsSavingsAccountIdChargesSavingsAccountChargeIdRequest;
  savingsAccountChargeId: number;
  savingsAccountId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  requestBody: PostSavingsAccountsSavingsAccountIdChargesSavingsAccountChargeIdRequest;
  savingsAccountChargeId: number;
  savingsAccountId: number;
}, TContext>({ mutationFn: ({ command, requestBody, savingsAccountChargeId, savingsAccountId }) => SavingsChargesService.postV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeId({ command, requestBody, savingsAccountChargeId, savingsAccountId }) as unknown as Promise<TData>, ...options });
export const useSavingsAccountTransactionsServicePostV1SavingsaccountsBySavingsIdTransactions = <TData = Common.SavingsAccountTransactionsServicePostV1SavingsaccountsBySavingsIdTransactionsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  requestBody: PostSavingsAccountTransactionsRequest;
  savingsId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  requestBody: PostSavingsAccountTransactionsRequest;
  savingsId: number;
}, TContext>({ mutationFn: ({ command, requestBody, savingsId }) => SavingsAccountTransactionsService.postV1SavingsaccountsBySavingsIdTransactions({ command, requestBody, savingsId }) as unknown as Promise<TData>, ...options });
export const useSavingsAccountTransactionsServicePostV1SavingsaccountsBySavingsIdTransactionsQuery = <TData = Common.SavingsAccountTransactionsServicePostV1SavingsaccountsBySavingsIdTransactionsQueryMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: PagedLocalRequestAdvancedQueryRequest;
  savingsId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: PagedLocalRequestAdvancedQueryRequest;
  savingsId: number;
}, TContext>({ mutationFn: ({ requestBody, savingsId }) => SavingsAccountTransactionsService.postV1SavingsaccountsBySavingsIdTransactionsQuery({ requestBody, savingsId }) as unknown as Promise<TData>, ...options });
export const useSavingsAccountTransactionsServicePostV1SavingsaccountsBySavingsIdTransactionsByTransactionId = <TData = Common.SavingsAccountTransactionsServicePostV1SavingsaccountsBySavingsIdTransactionsByTransactionIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  requestBody: PostSavingsAccountBulkReversalTransactionsRequest;
  savingsId: number;
  transactionId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  requestBody: PostSavingsAccountBulkReversalTransactionsRequest;
  savingsId: number;
  transactionId: number;
}, TContext>({ mutationFn: ({ command, requestBody, savingsId, transactionId }) => SavingsAccountTransactionsService.postV1SavingsaccountsBySavingsIdTransactionsByTransactionId({ command, requestBody, savingsId, transactionId }) as unknown as Promise<TData>, ...options });
export const useSavingsProductServicePostV1Savingsproducts = <TData = Common.SavingsProductServicePostV1SavingsproductsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostSavingsProductsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostSavingsProductsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => SavingsProductService.postV1Savingsproducts({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSchedulerServicePostV1Scheduler = <TData = Common.SchedulerServicePostV1SchedulerMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
}, TContext>({ mutationFn: ({ command }) => SchedulerService.postV1Scheduler({ command }) as unknown as Promise<TData>, ...options });
export const useSearchApiServicePostV1SearchAdvance = <TData = Common.SearchApiServicePostV1SearchAdvanceMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostAdhocQuerySearchRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostAdhocQuerySearchRequest;
}, TContext>({ mutationFn: ({ requestBody }) => SearchApiService.postV1SearchAdvance({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSelfAccountTransferServicePostV1SelfAccounttransfers = <TData = Common.SelfAccountTransferServicePostV1SelfAccounttransfersMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: AccountTransferRequest;
  type?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: AccountTransferRequest;
  type?: string;
}, TContext>({ mutationFn: ({ requestBody, type }) => SelfAccountTransferService.postV1SelfAccounttransfers({ requestBody, type }) as unknown as Promise<TData>, ...options });
export const useSelfAuthenticationServicePostV1SelfAuthentication = <TData = Common.SelfAuthenticationServicePostV1SelfAuthenticationMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostAuthenticationRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostAuthenticationRequest;
}, TContext>({ mutationFn: ({ requestBody }) => SelfAuthenticationService.postV1SelfAuthentication({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSelfThirdPartyTransferServicePostV1SelfBeneficiariesTpt = <TData = Common.SelfThirdPartyTransferServicePostV1SelfBeneficiariesTptMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostSelfBeneficiariesTPTRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostSelfBeneficiariesTPTRequest;
}, TContext>({ mutationFn: ({ requestBody }) => SelfThirdPartyTransferService.postV1SelfBeneficiariesTpt({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSelfClientServicePostV1SelfClientsByClientIdImages = <TData = Common.SelfClientServicePostV1SelfClientsByClientIdImagesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
  contentLength?: number;
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
  contentLength?: number;
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ clientId, contentLength, formData }) => SelfClientService.postV1SelfClientsByClientIdImages({ clientId, contentLength, formData }) as unknown as Promise<TData>, ...options });
export const useDeviceRegistrationServicePostV1SelfDeviceRegistration = <TData = Common.DeviceRegistrationServicePostV1SelfDeviceRegistrationMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
}, TContext>({ mutationFn: ({ requestBody }) => DeviceRegistrationService.postV1SelfDeviceRegistration({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSelfLoansServicePostV1SelfLoans = <TData = Common.SelfLoansServicePostV1SelfLoansMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  requestBody: PostSelfLoansRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  requestBody: PostSelfLoansRequest;
}, TContext>({ mutationFn: ({ command, requestBody }) => SelfLoansService.postV1SelfLoans({ command, requestBody }) as unknown as Promise<TData>, ...options });
export const useSelfLoansServicePostV1SelfLoansByLoanId = <TData = Common.SelfLoansServicePostV1SelfLoansByLoanIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanId: number;
  requestBody: PostSelfLoansLoanIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanId: number;
  requestBody: PostSelfLoansLoanIdRequest;
}, TContext>({ mutationFn: ({ command, loanId, requestBody }) => SelfLoansService.postV1SelfLoansByLoanId({ command, loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const usePocketServicePostV1SelfPockets = <TData = Common.PocketServicePostV1SelfPocketsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  requestBody?: string;
}, TContext>({ mutationFn: ({ command, requestBody }) => PocketService.postV1SelfPockets({ command, requestBody }) as unknown as Promise<TData>, ...options });
export const useSelfServiceRegistrationServicePostV1SelfRegistration = <TData = Common.SelfServiceRegistrationServicePostV1SelfRegistrationMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
}, TContext>({ mutationFn: ({ requestBody }) => SelfServiceRegistrationService.postV1SelfRegistration({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSelfServiceRegistrationServicePostV1SelfRegistrationUser = <TData = Common.SelfServiceRegistrationServicePostV1SelfRegistrationUserMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
}, TContext>({ mutationFn: ({ requestBody }) => SelfServiceRegistrationService.postV1SelfRegistrationUser({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSelfSavingsAccountServicePostV1SelfSavingsaccounts = <TData = Common.SelfSavingsAccountServicePostV1SelfSavingsaccountsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  requestBody?: string;
}, TContext>({ mutationFn: ({ command, requestBody }) => SelfSavingsAccountService.postV1SelfSavingsaccounts({ command, requestBody }) as unknown as Promise<TData>, ...options });
export const useSelfShareAccountsServicePostV1SelfShareaccounts = <TData = Common.SelfShareAccountsServicePostV1SelfShareaccountsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: AccountRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: AccountRequest;
}, TContext>({ mutationFn: ({ requestBody }) => SelfShareAccountsService.postV1SelfShareaccounts({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSelfScoreCardServicePostV1SelfSurveysScorecardsBySurveyId = <TData = Common.SelfScoreCardServicePostV1SelfSurveysScorecardsBySurveyIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: ScorecardData;
  surveyId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: ScorecardData;
  surveyId: number;
}, TContext>({ mutationFn: ({ requestBody, surveyId }) => SelfScoreCardService.postV1SelfSurveysScorecardsBySurveyId({ requestBody, surveyId }) as unknown as Promise<TData>, ...options });
export const useSelfDividendServicePostV1ShareproductByProductIdDividend = <TData = Common.SelfDividendServicePostV1ShareproductByProductIdDividendMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  productId: number;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  productId: number;
  requestBody?: string;
}, TContext>({ mutationFn: ({ productId, requestBody }) => SelfDividendService.postV1ShareproductByProductIdDividend({ productId, requestBody }) as unknown as Promise<TData>, ...options });
export const useSmsServicePostV1Sms = <TData = Common.SmsServicePostV1SmsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: SmsCreationRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: SmsCreationRequest;
}, TContext>({ mutationFn: ({ requestBody }) => SmsService.postV1Sms({ requestBody }) as unknown as Promise<TData>, ...options });
export const useStaffServicePostV1Staff = <TData = Common.StaffServicePostV1StaffMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: StaffRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: StaffRequest;
}, TContext>({ mutationFn: ({ requestBody }) => StaffService.postV1Staff({ requestBody }) as unknown as Promise<TData>, ...options });
export const useStaffServicePostV1StaffUploadtemplate = <TData = Common.StaffServicePostV1StaffUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ formData }) => StaffService.postV1StaffUploadtemplate({ formData }) as unknown as Promise<TData>, ...options });
export const useStandingInstructionsServicePostV1Standinginstructions = <TData = Common.StandingInstructionsServicePostV1StandinginstructionsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: StandingInstructionCreationRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: StandingInstructionCreationRequest;
}, TContext>({ mutationFn: ({ requestBody }) => StandingInstructionsService.postV1Standinginstructions({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSurveyServicePostV1SurveyBySurveyNameByApptableId = <TData = Common.SurveyServicePostV1SurveyBySurveyNameByApptableIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  apptableId: number;
  requestBody: PostSurveySurveyNameApptableIdRequest;
  surveyName: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  apptableId: number;
  requestBody: PostSurveySurveyNameApptableIdRequest;
  surveyName: string;
}, TContext>({ mutationFn: ({ apptableId, requestBody, surveyName }) => SurveyService.postV1SurveyBySurveyNameByApptableId({ apptableId, requestBody, surveyName }) as unknown as Promise<TData>, ...options });
export const useSpmSurveysServicePostV1Surveys = <TData = Common.SpmSurveysServicePostV1SurveysMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: SurveyData;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: SurveyData;
}, TContext>({ mutationFn: ({ requestBody }) => SpmSurveysService.postV1Surveys({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSpmSurveysServicePostV1SurveysById = <TData = Common.SpmSurveysServicePostV1SurveysByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  id: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  id: number;
}, TContext>({ mutationFn: ({ command, id }) => SpmSurveysService.postV1SurveysById({ command, id }) as unknown as Promise<TData>, ...options });
export const useScoreCardServicePostV1SurveysScorecardsBySurveyId = <TData = Common.ScoreCardServicePostV1SurveysScorecardsBySurveyIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: ScorecardData;
  surveyId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: ScorecardData;
  surveyId: number;
}, TContext>({ mutationFn: ({ requestBody, surveyId }) => ScoreCardService.postV1SurveysScorecardsBySurveyId({ requestBody, surveyId }) as unknown as Promise<TData>, ...options });
export const useSpmApiLookUpTableServicePostV1SurveysBySurveyIdLookuptables = <TData = Common.SpmApiLookUpTableServicePostV1SurveysBySurveyIdLookuptablesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: LookupTableData;
  surveyId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: LookupTableData;
  surveyId: number;
}, TContext>({ mutationFn: ({ requestBody, surveyId }) => SpmApiLookUpTableService.postV1SurveysBySurveyIdLookuptables({ requestBody, surveyId }) as unknown as Promise<TData>, ...options });
export const useTaxComponentsServicePostV1TaxesComponent = <TData = Common.TaxComponentsServicePostV1TaxesComponentMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostTaxesComponentsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostTaxesComponentsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => TaxComponentsService.postV1TaxesComponent({ requestBody }) as unknown as Promise<TData>, ...options });
export const useTaxGroupServicePostV1TaxesGroup = <TData = Common.TaxGroupServicePostV1TaxesGroupMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostTaxesGroupRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostTaxesGroupRequest;
}, TContext>({ mutationFn: ({ requestBody }) => TaxGroupService.postV1TaxesGroup({ requestBody }) as unknown as Promise<TData>, ...options });
export const useTellerCashManagementServicePostV1Tellers = <TData = Common.TellerCashManagementServicePostV1TellersMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostTellersRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostTellersRequest;
}, TContext>({ mutationFn: ({ requestBody }) => TellerCashManagementService.postV1Tellers({ requestBody }) as unknown as Promise<TData>, ...options });
export const useTellerCashManagementServicePostV1TellersByTellerIdCashiers = <TData = Common.TellerCashManagementServicePostV1TellersByTellerIdCashiersMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostTellersTellerIdCashiersRequest;
  tellerId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostTellersTellerIdCashiersRequest;
  tellerId: number;
}, TContext>({ mutationFn: ({ requestBody, tellerId }) => TellerCashManagementService.postV1TellersByTellerIdCashiers({ requestBody, tellerId }) as unknown as Promise<TData>, ...options });
export const useTellerCashManagementServicePostV1TellersByTellerIdCashiersByCashierIdAllocate = <TData = Common.TellerCashManagementServicePostV1TellersByTellerIdCashiersByCashierIdAllocateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  cashierId: number;
  requestBody: PostTellersTellerIdCashiersCashierIdAllocateRequest;
  tellerId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  cashierId: number;
  requestBody: PostTellersTellerIdCashiersCashierIdAllocateRequest;
  tellerId: number;
}, TContext>({ mutationFn: ({ cashierId, requestBody, tellerId }) => TellerCashManagementService.postV1TellersByTellerIdCashiersByCashierIdAllocate({ cashierId, requestBody, tellerId }) as unknown as Promise<TData>, ...options });
export const useTellerCashManagementServicePostV1TellersByTellerIdCashiersByCashierIdSettle = <TData = Common.TellerCashManagementServicePostV1TellersByTellerIdCashiersByCashierIdSettleMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  cashierId: number;
  requestBody: PostTellersTellerIdCashiersCashierIdSettleRequest;
  tellerId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  cashierId: number;
  requestBody: PostTellersTellerIdCashiersCashierIdSettleRequest;
  tellerId: number;
}, TContext>({ mutationFn: ({ cashierId, requestBody, tellerId }) => TellerCashManagementService.postV1TellersByTellerIdCashiersByCashierIdSettle({ cashierId, requestBody, tellerId }) as unknown as Promise<TData>, ...options });
export const useUserGeneratedDocumentsServicePostV1Templates = <TData = Common.UserGeneratedDocumentsServicePostV1TemplatesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostTemplatesRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostTemplatesRequest;
}, TContext>({ mutationFn: ({ requestBody }) => UserGeneratedDocumentsService.postV1Templates({ requestBody }) as unknown as Promise<TData>, ...options });
export const useUserGeneratedDocumentsServicePostV1TemplatesByTemplateId = <TData = Common.UserGeneratedDocumentsServicePostV1TemplatesByTemplateIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
  templateId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
  templateId: number;
}, TContext>({ mutationFn: ({ requestBody, templateId }) => UserGeneratedDocumentsService.postV1TemplatesByTemplateId({ requestBody, templateId }) as unknown as Promise<TData>, ...options });
export const useTwoFactorServicePostV1Twofactor = <TData = Common.TwoFactorServicePostV1TwofactorMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  deliveryMethod?: string;
  extendedToken?: boolean;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  deliveryMethod?: string;
  extendedToken?: boolean;
}, TContext>({ mutationFn: ({ deliveryMethod, extendedToken }) => TwoFactorService.postV1Twofactor({ deliveryMethod, extendedToken }) as unknown as Promise<TData>, ...options });
export const useTwoFactorServicePostV1TwofactorInvalidate = <TData = Common.TwoFactorServicePostV1TwofactorInvalidateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
}, TContext>({ mutationFn: ({ requestBody }) => TwoFactorService.postV1TwofactorInvalidate({ requestBody }) as unknown as Promise<TData>, ...options });
export const useTwoFactorServicePostV1TwofactorValidate = <TData = Common.TwoFactorServicePostV1TwofactorValidateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  token?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  token?: string;
}, TContext>({ mutationFn: ({ token }) => TwoFactorService.postV1TwofactorValidate({ token }) as unknown as Promise<TData>, ...options });
export const useUsersServicePostV1Users = <TData = Common.UsersServicePostV1UsersMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PostUsersRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PostUsersRequest;
}, TContext>({ mutationFn: ({ requestBody }) => UsersService.postV1Users({ requestBody }) as unknown as Promise<TData>, ...options });
export const useUsersServicePostV1UsersUploadtemplate = <TData = Common.UsersServicePostV1UsersUploadtemplateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ formData }) => UsersService.postV1UsersUploadtemplate({ formData }) as unknown as Promise<TData>, ...options });
export const useUsersServicePostV1UsersByUserIdPwd = <TData = Common.UsersServicePostV1UsersByUserIdPwdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: ChangePwdUsersUserIdRequest;
  userId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: ChangePwdUsersUserIdRequest;
  userId: number;
}, TContext>({ mutationFn: ({ requestBody, userId }) => UsersService.postV1UsersByUserIdPwd({ requestBody, userId }) as unknown as Promise<TData>, ...options });
export const useCalendarServicePostV1ByEntityTypeByEntityIdCalendars = <TData = Common.CalendarServicePostV1ByEntityTypeByEntityIdCalendarsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  entityId: number;
  entityType: string;
  requestBody?: CalendarRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  entityId: number;
  entityType: string;
  requestBody?: CalendarRequest;
}, TContext>({ mutationFn: ({ entityId, entityType, requestBody }) => CalendarService.postV1ByEntityTypeByEntityIdCalendars({ entityId, entityType, requestBody }) as unknown as Promise<TData>, ...options });
export const useDocumentsServicePostV1ByEntityTypeByEntityIdDocuments = <TData = Common.DocumentsServicePostV1ByEntityTypeByEntityIdDocumentsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  contentLength?: number;
  entityId: number;
  entityType: string;
  formData?: DocumentUploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  contentLength?: number;
  entityId: number;
  entityType: string;
  formData?: DocumentUploadRequest;
}, TContext>({ mutationFn: ({ contentLength, entityId, entityType, formData }) => DocumentsService.postV1ByEntityTypeByEntityIdDocuments({ contentLength, entityId, entityType, formData }) as unknown as Promise<TData>, ...options });
export const useMeetingsServicePostV1ByEntityTypeByEntityIdMeetings = <TData = Common.MeetingsServicePostV1ByEntityTypeByEntityIdMeetingsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  entityId: number;
  entityType: string;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  entityId: number;
  entityType: string;
  requestBody?: string;
}, TContext>({ mutationFn: ({ entityId, entityType, requestBody }) => MeetingsService.postV1ByEntityTypeByEntityIdMeetings({ entityId, entityType, requestBody }) as unknown as Promise<TData>, ...options });
export const useMeetingsServicePostV1ByEntityTypeByEntityIdMeetingsByMeetingId = <TData = Common.MeetingsServicePostV1ByEntityTypeByEntityIdMeetingsByMeetingIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  entityId: number;
  entityType: string;
  meetingId: number;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  entityId: number;
  entityType: string;
  meetingId: number;
  requestBody?: string;
}, TContext>({ mutationFn: ({ command, entityId, entityType, meetingId, requestBody }) => MeetingsService.postV1ByEntityTypeByEntityIdMeetingsByMeetingId({ command, entityId, entityType, meetingId, requestBody }) as unknown as Promise<TData>, ...options });
export const useNotesServicePostV1ByResourceTypeByResourceIdNotes = <TData = Common.NotesServicePostV1ByResourceTypeByResourceIdNotesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: NoteRequest;
  resourceId: number;
  resourceType: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: NoteRequest;
  resourceId: number;
  resourceType: string;
}, TContext>({ mutationFn: ({ requestBody, resourceId, resourceType }) => NotesService.postV1ByResourceTypeByResourceIdNotes({ requestBody, resourceId, resourceType }) as unknown as Promise<TData>, ...options });
export const useClientSearchV2ServicePostV2ClientsSearch = <TData = Common.ClientSearchV2ServicePostV2ClientsSearchMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: PagedRequestClientTextSearch;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: PagedRequestClientTextSearch;
}, TContext>({ mutationFn: ({ requestBody }) => ClientSearchV2Service.postV2ClientsSearch({ requestBody }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePutV1EmailCampaignByResourceId = <TData = Common.DefaultServicePutV1EmailCampaignByResourceIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
  resourceId: number;
}, TContext>({ mutationFn: ({ requestBody, resourceId }) => DefaultService.putV1EmailCampaignByResourceId({ requestBody, resourceId }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePutV1EmailConfiguration = <TData = Common.DefaultServicePutV1EmailConfigurationMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
}, TContext>({ mutationFn: ({ requestBody }) => DefaultService.putV1EmailConfiguration({ requestBody }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePutV1EmailByResourceId = <TData = Common.DefaultServicePutV1EmailByResourceIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
  resourceId: number;
}, TContext>({ mutationFn: ({ requestBody, resourceId }) => DefaultService.putV1EmailByResourceId({ requestBody, resourceId }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePutV1InternalConfigurationsNameByConfigNameValueByConfigValue = <TData = Common.DefaultServicePutV1InternalConfigurationsNameByConfigNameValueByConfigValueMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  configName: string;
  configValue: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  configName: string;
  configValue: number;
}, TContext>({ mutationFn: ({ configName, configValue }) => DefaultService.putV1InternalConfigurationsNameByConfigNameValueByConfigValue({ configName, configValue }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePutV1SmscampaignsByCampaignId = <TData = Common.DefaultServicePutV1SmscampaignsByCampaignIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  campaignId: number;
  requestBody: CommandWrapper;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  campaignId: number;
  requestBody: CommandWrapper;
}, TContext>({ mutationFn: ({ campaignId, requestBody }) => DefaultService.putV1SmscampaignsByCampaignId({ campaignId, requestBody }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePutV1TwofactorConfigure = <TData = Common.DefaultServicePutV1TwofactorConfigureMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
}, TContext>({ mutationFn: ({ requestBody }) => DefaultService.putV1TwofactorConfigure({ requestBody }) as unknown as Promise<TData>, ...options });
export const useDefaultServicePutV1ByEntityByEntityIdImages = <TData = Common.DefaultServicePutV1ByEntityByEntityIdImagesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  contentLength?: number;
  entity: string;
  entityId: number;
  formData?: UploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  contentLength?: number;
  entity: string;
  entityId: number;
  formData?: UploadRequest;
}, TContext>({ mutationFn: ({ contentLength, entity, entityId, formData }) => DefaultService.putV1ByEntityByEntityIdImages({ contentLength, entity, entityId, formData }) as unknown as Promise<TData>, ...options });
export const useCreditBureauConfigurationServicePutV1CreditBureauConfigurationConfigurationByConfigurationId = <TData = Common.CreditBureauConfigurationServicePutV1CreditBureauConfigurationConfigurationByConfigurationIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  configurationId: number;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  configurationId: number;
  requestBody?: string;
}, TContext>({ mutationFn: ({ configurationId, requestBody }) => CreditBureauConfigurationService.putV1CreditBureauConfigurationConfigurationByConfigurationId({ configurationId, requestBody }) as unknown as Promise<TData>, ...options });
export const useCreditBureauConfigurationServicePutV1CreditBureauConfigurationMappings = <TData = Common.CreditBureauConfigurationServicePutV1CreditBureauConfigurationMappingsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
}, TContext>({ mutationFn: ({ requestBody }) => CreditBureauConfigurationService.putV1CreditBureauConfigurationMappings({ requestBody }) as unknown as Promise<TData>, ...options });
export const useCreditBureauConfigurationServicePutV1CreditBureauConfigurationOrganisationCreditBureau = <TData = Common.CreditBureauConfigurationServicePutV1CreditBureauConfigurationOrganisationCreditBureauMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: string;
}, TContext>({ mutationFn: ({ requestBody }) => CreditBureauConfigurationService.putV1CreditBureauConfigurationOrganisationCreditBureau({ requestBody }) as unknown as Promise<TData>, ...options });
export const useAccountingRulesServicePutV1AccountingrulesByAccountingRuleId = <TData = Common.AccountingRulesServicePutV1AccountingrulesByAccountingRuleIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountingRuleId: number;
  requestBody?: AccountRuleRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountingRuleId: number;
  requestBody?: AccountRuleRequest;
}, TContext>({ mutationFn: ({ accountingRuleId, requestBody }) => AccountingRulesService.putV1AccountingrulesByAccountingRuleId({ accountingRuleId, requestBody }) as unknown as Promise<TData>, ...options });
export const useAccountNumberFormatServicePutV1AccountnumberformatsByAccountNumberFormatId = <TData = Common.AccountNumberFormatServicePutV1AccountnumberformatsByAccountNumberFormatIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountNumberFormatId: number;
  requestBody: PutAccountNumberFormatsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountNumberFormatId: number;
  requestBody: PutAccountNumberFormatsRequest;
}, TContext>({ mutationFn: ({ accountNumberFormatId, requestBody }) => AccountNumberFormatService.putV1AccountnumberformatsByAccountNumberFormatId({ accountNumberFormatId, requestBody }) as unknown as Promise<TData>, ...options });
export const useShareAccountServicePutV1AccountsByTypeByAccountId = <TData = Common.ShareAccountServicePutV1AccountsByTypeByAccountIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountId: number;
  requestBody: PutAccountsTypeAccountIdRequest;
  type: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountId: number;
  requestBody: PutAccountsTypeAccountIdRequest;
  type: string;
}, TContext>({ mutationFn: ({ accountId, requestBody, type }) => ShareAccountService.putV1AccountsByTypeByAccountId({ accountId, requestBody, type }) as unknown as Promise<TData>, ...options });
export const useAdhocQueryApiServicePutV1AdhocqueryByAdHocId = <TData = Common.AdhocQueryApiServicePutV1AdhocqueryByAdHocIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  adHocId: number;
  requestBody?: AdHocRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  adHocId: number;
  requestBody?: AdHocRequest;
}, TContext>({ mutationFn: ({ adHocId, requestBody }) => AdhocQueryApiService.putV1AdhocqueryByAdHocId({ adHocId, requestBody }) as unknown as Promise<TData>, ...options });
export const useCacheServicePutV1Caches = <TData = Common.CacheServicePutV1CachesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: CacheSwitchRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: CacheSwitchRequest;
}, TContext>({ mutationFn: ({ requestBody }) => CacheService.putV1Caches({ requestBody }) as unknown as Promise<TData>, ...options });
export const useCentersServicePutV1CentersByCenterId = <TData = Common.CentersServicePutV1CentersByCenterIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  centerId: number;
  requestBody: PutCentersCenterIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  centerId: number;
  requestBody: PutCentersCenterIdRequest;
}, TContext>({ mutationFn: ({ centerId, requestBody }) => CentersService.putV1CentersByCenterId({ centerId, requestBody }) as unknown as Promise<TData>, ...options });
export const useChargesServicePutV1ChargesByChargeId = <TData = Common.ChargesServicePutV1ChargesByChargeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  chargeId: number;
  requestBody: ChargeRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  chargeId: number;
  requestBody: ChargeRequest;
}, TContext>({ mutationFn: ({ chargeId, requestBody }) => ChargesService.putV1ChargesByChargeId({ chargeId, requestBody }) as unknown as Promise<TData>, ...options });
export const useClientsAddressServicePutV1ClientByClientidAddresses = <TData = Common.ClientsAddressServicePutV1ClientByClientidAddressesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientid: number;
  requestBody: ClientAddressRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientid: number;
  requestBody: ClientAddressRequest;
}, TContext>({ mutationFn: ({ clientid, requestBody }) => ClientsAddressService.putV1ClientByClientidAddresses({ clientid, requestBody }) as unknown as Promise<TData>, ...options });
export const useClientServicePutV1ClientsExternalIdByExternalId = <TData = Common.ClientServicePutV1ClientsExternalIdByExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  externalId: string;
  requestBody: PutClientsClientIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  externalId: string;
  requestBody: PutClientsClientIdRequest;
}, TContext>({ mutationFn: ({ externalId, requestBody }) => ClientService.putV1ClientsExternalIdByExternalId({ externalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useClientServicePutV1ClientsByClientId = <TData = Common.ClientServicePutV1ClientsByClientIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
  requestBody: PutClientsClientIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
  requestBody: PutClientsClientIdRequest;
}, TContext>({ mutationFn: ({ clientId, requestBody }) => ClientService.putV1ClientsByClientId({ clientId, requestBody }) as unknown as Promise<TData>, ...options });
export const useClientCollateralManagementServicePutV1ClientsByClientIdCollateralsByCollateralId = <TData = Common.ClientCollateralManagementServicePutV1ClientsByClientIdCollateralsByCollateralIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
  collateralId: number;
  requestBody: UpdateClientCollateralRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
  collateralId: number;
  requestBody: UpdateClientCollateralRequest;
}, TContext>({ mutationFn: ({ clientId, collateralId, requestBody }) => ClientCollateralManagementService.putV1ClientsByClientIdCollateralsByCollateralId({ clientId, collateralId, requestBody }) as unknown as Promise<TData>, ...options });
export const useClientFamilyMemberServicePutV1ClientsByClientIdFamilymembersByFamilyMemberId = <TData = Common.ClientFamilyMemberServicePutV1ClientsByClientIdFamilymembersByFamilyMemberIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
  familyMemberId: number;
  requestBody?: ClientFamilyMemberRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
  familyMemberId: number;
  requestBody?: ClientFamilyMemberRequest;
}, TContext>({ mutationFn: ({ clientId, familyMemberId, requestBody }) => ClientFamilyMemberService.putV1ClientsByClientIdFamilymembersByFamilyMemberId({ clientId, familyMemberId, requestBody }) as unknown as Promise<TData>, ...options });
export const useClientIdentifierServicePutV1ClientsByClientIdIdentifiersByIdentifierId = <TData = Common.ClientIdentifierServicePutV1ClientsByClientIdIdentifiersByIdentifierIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
  identifierId: number;
  requestBody: ClientIdentifierRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
  identifierId: number;
  requestBody: ClientIdentifierRequest;
}, TContext>({ mutationFn: ({ clientId, identifierId, requestBody }) => ClientIdentifierService.putV1ClientsByClientIdIdentifiersByIdentifierId({ clientId, identifierId, requestBody }) as unknown as Promise<TData>, ...options });
export const useCodesServicePutV1CodesByCodeId = <TData = Common.CodesServicePutV1CodesByCodeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  codeId: number;
  requestBody: PutCodesRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  codeId: number;
  requestBody: PutCodesRequest;
}, TContext>({ mutationFn: ({ codeId, requestBody }) => CodesService.putV1CodesByCodeId({ codeId, requestBody }) as unknown as Promise<TData>, ...options });
export const useCodeValuesServicePutV1CodesByCodeIdCodevaluesByCodeValueId = <TData = Common.CodeValuesServicePutV1CodesByCodeIdCodevaluesByCodeValueIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  codeId: number;
  codeValueId: number;
  requestBody: PutCodeValuesDataRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  codeId: number;
  codeValueId: number;
  requestBody: PutCodeValuesDataRequest;
}, TContext>({ mutationFn: ({ codeId, codeValueId, requestBody }) => CodeValuesService.putV1CodesByCodeIdCodevaluesByCodeValueId({ codeId, codeValueId, requestBody }) as unknown as Promise<TData>, ...options });
export const useCollateralManagementServicePutV1CollateralManagementByCollateralId = <TData = Common.CollateralManagementServicePutV1CollateralManagementByCollateralIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  collateralId: number;
  requestBody: CollateralProductRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  collateralId: number;
  requestBody: CollateralProductRequest;
}, TContext>({ mutationFn: ({ collateralId, requestBody }) => CollateralManagementService.putV1CollateralManagementByCollateralId({ collateralId, requestBody }) as unknown as Promise<TData>, ...options });
export const useGlobalConfigurationServicePutV1ConfigurationsNameByConfigName = <TData = Common.GlobalConfigurationServicePutV1ConfigurationsNameByConfigNameMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  configName: string;
  requestBody: PutGlobalConfigurationsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  configName: string;
  requestBody: PutGlobalConfigurationsRequest;
}, TContext>({ mutationFn: ({ configName, requestBody }) => GlobalConfigurationService.putV1ConfigurationsNameByConfigName({ configName, requestBody }) as unknown as Promise<TData>, ...options });
export const useGlobalConfigurationServicePutV1ConfigurationsByConfigId = <TData = Common.GlobalConfigurationServicePutV1ConfigurationsByConfigIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  configId: number;
  requestBody: PutGlobalConfigurationsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  configId: number;
  requestBody: PutGlobalConfigurationsRequest;
}, TContext>({ mutationFn: ({ configId, requestBody }) => GlobalConfigurationService.putV1ConfigurationsByConfigId({ configId, requestBody }) as unknown as Promise<TData>, ...options });
export const useCurrencyServicePutV1Currencies = <TData = Common.CurrencyServicePutV1CurrenciesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: CurrencyUpdateRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: CurrencyUpdateRequest;
}, TContext>({ mutationFn: ({ requestBody }) => CurrencyService.putV1Currencies({ requestBody }) as unknown as Promise<TData>, ...options });
export const useDataTablesServicePutV1DatatablesByDatatableName = <TData = Common.DataTablesServicePutV1DatatablesByDatatableNameMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  datatableName: string;
  requestBody: PutDataTablesRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  datatableName: string;
  requestBody: PutDataTablesRequest;
}, TContext>({ mutationFn: ({ datatableName, requestBody }) => DataTablesService.putV1DatatablesByDatatableName({ datatableName, requestBody }) as unknown as Promise<TData>, ...options });
export const useDataTablesServicePutV1DatatablesByDatatableByApptableId = <TData = Common.DataTablesServicePutV1DatatablesByDatatableByApptableIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  apptableId: number;
  datatable: string;
  requestBody: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  apptableId: number;
  datatable: string;
  requestBody: string;
}, TContext>({ mutationFn: ({ apptableId, datatable, requestBody }) => DataTablesService.putV1DatatablesByDatatableByApptableId({ apptableId, datatable, requestBody }) as unknown as Promise<TData>, ...options });
export const useDataTablesServicePutV1DatatablesByDatatableByApptableIdByDatatableId = <TData = Common.DataTablesServicePutV1DatatablesByDatatableByApptableIdByDatatableIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  apptableId: number;
  datatable: string;
  datatableId: number;
  requestBody: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  apptableId: number;
  datatable: string;
  datatableId: number;
  requestBody: string;
}, TContext>({ mutationFn: ({ apptableId, datatable, datatableId, requestBody }) => DataTablesService.putV1DatatablesByDatatableByApptableIdByDatatableId({ apptableId, datatable, datatableId, requestBody }) as unknown as Promise<TData>, ...options });
export const useDelinquencyRangeAndBucketsManagementServicePutV1DelinquencyBucketsByDelinquencyBucketId = <TData = Common.DelinquencyRangeAndBucketsManagementServicePutV1DelinquencyBucketsByDelinquencyBucketIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  delinquencyBucketId: number;
  requestBody: DelinquencyBucketRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  delinquencyBucketId: number;
  requestBody: DelinquencyBucketRequest;
}, TContext>({ mutationFn: ({ delinquencyBucketId, requestBody }) => DelinquencyRangeAndBucketsManagementService.putV1DelinquencyBucketsByDelinquencyBucketId({ delinquencyBucketId, requestBody }) as unknown as Promise<TData>, ...options });
export const useDelinquencyRangeAndBucketsManagementServicePutV1DelinquencyRangesByDelinquencyRangeId = <TData = Common.DelinquencyRangeAndBucketsManagementServicePutV1DelinquencyRangesByDelinquencyRangeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  delinquencyRangeId: number;
  requestBody: DelinquencyRangeRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  delinquencyRangeId: number;
  requestBody: DelinquencyRangeRequest;
}, TContext>({ mutationFn: ({ delinquencyRangeId, requestBody }) => DelinquencyRangeAndBucketsManagementService.putV1DelinquencyRangesByDelinquencyRangeId({ delinquencyRangeId, requestBody }) as unknown as Promise<TData>, ...options });
export const useFineractEntityServicePutV1EntitytoentitymappingByMapId = <TData = Common.FineractEntityServicePutV1EntitytoentitymappingByMapIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  mapId: number;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  mapId: number;
  requestBody?: string;
}, TContext>({ mutationFn: ({ mapId, requestBody }) => FineractEntityService.putV1EntitytoentitymappingByMapId({ mapId, requestBody }) as unknown as Promise<TData>, ...options });
export const useExternalAssetOwnerLoanProductAttributesServicePutV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesById = <TData = Common.ExternalAssetOwnerLoanProductAttributesServicePutV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  loanProductId: number;
  requestBody: PutExternalAssetOwnerLoanProductAttributeRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  loanProductId: number;
  requestBody: PutExternalAssetOwnerLoanProductAttributeRequest;
}, TContext>({ mutationFn: ({ id, loanProductId, requestBody }) => ExternalAssetOwnerLoanProductAttributesService.putV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesById({ id, loanProductId, requestBody }) as unknown as Promise<TData>, ...options });
export const useExternalEventConfigurationServicePutV1ExternaleventsConfiguration = <TData = Common.ExternalEventConfigurationServicePutV1ExternaleventsConfigurationMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  idempotencyKey?: string;
  requestBody?: ExternalEventConfigurationUpdateRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  idempotencyKey?: string;
  requestBody?: ExternalEventConfigurationUpdateRequest;
}, TContext>({ mutationFn: ({ idempotencyKey, requestBody }) => ExternalEventConfigurationService.putV1ExternaleventsConfiguration({ idempotencyKey, requestBody }) as unknown as Promise<TData>, ...options });
export const useExternalServicesServicePutV1ExternalserviceByServicename = <TData = Common.ExternalServicesServicePutV1ExternalserviceByServicenameMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PutExternalServiceRequest;
  servicename: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PutExternalServiceRequest;
  servicename: string;
}, TContext>({ mutationFn: ({ requestBody, servicename }) => ExternalServicesService.putV1ExternalserviceByServicename({ requestBody, servicename }) as unknown as Promise<TData>, ...options });
export const useMappingFinancialActivitiesToAccountsServicePutV1FinancialactivityaccountsByMappingId = <TData = Common.MappingFinancialActivitiesToAccountsServicePutV1FinancialactivityaccountsByMappingIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  mappingId: number;
  requestBody?: PostFinancialActivityAccountsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  mappingId: number;
  requestBody?: PostFinancialActivityAccountsRequest;
}, TContext>({ mutationFn: ({ mappingId, requestBody }) => MappingFinancialActivitiesToAccountsService.putV1FinancialactivityaccountsByMappingId({ mappingId, requestBody }) as unknown as Promise<TData>, ...options });
export const useFixedDepositAccountServicePutV1FixeddepositaccountsByAccountId = <TData = Common.FixedDepositAccountServicePutV1FixeddepositaccountsByAccountIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountId: number;
  requestBody: PutFixedDepositAccountsAccountIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountId: number;
  requestBody: PutFixedDepositAccountsAccountIdRequest;
}, TContext>({ mutationFn: ({ accountId, requestBody }) => FixedDepositAccountService.putV1FixeddepositaccountsByAccountId({ accountId, requestBody }) as unknown as Promise<TData>, ...options });
export const useFixedDepositProductServicePutV1FixeddepositproductsByProductId = <TData = Common.FixedDepositProductServicePutV1FixeddepositproductsByProductIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  productId: number;
  requestBody: PutFixedDepositProductsProductIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  productId: number;
  requestBody: PutFixedDepositProductsProductIdRequest;
}, TContext>({ mutationFn: ({ productId, requestBody }) => FixedDepositProductService.putV1FixeddepositproductsByProductId({ productId, requestBody }) as unknown as Promise<TData>, ...options });
export const useFloatingRatesServicePutV1FloatingratesByFloatingRateId = <TData = Common.FloatingRatesServicePutV1FloatingratesByFloatingRateIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  floatingRateId: number;
  requestBody: FloatingRateRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  floatingRateId: number;
  requestBody: FloatingRateRequest;
}, TContext>({ mutationFn: ({ floatingRateId, requestBody }) => FloatingRatesService.putV1FloatingratesByFloatingRateId({ floatingRateId, requestBody }) as unknown as Promise<TData>, ...options });
export const useFundsServicePutV1FundsByFundId = <TData = Common.FundsServicePutV1FundsByFundIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  fundId: number;
  requestBody: FundRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  fundId: number;
  requestBody: FundRequest;
}, TContext>({ mutationFn: ({ fundId, requestBody }) => FundsService.putV1FundsByFundId({ fundId, requestBody }) as unknown as Promise<TData>, ...options });
export const useGeneralLedgerAccountServicePutV1GlaccountsByGlAccountId = <TData = Common.GeneralLedgerAccountServicePutV1GlaccountsByGlAccountIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  glAccountId: number;
  requestBody?: PutGLAccountsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  glAccountId: number;
  requestBody?: PutGLAccountsRequest;
}, TContext>({ mutationFn: ({ glAccountId, requestBody }) => GeneralLedgerAccountService.putV1GlaccountsByGlAccountId({ glAccountId, requestBody }) as unknown as Promise<TData>, ...options });
export const useAccountingClosureServicePutV1GlclosuresByGlClosureId = <TData = Common.AccountingClosureServicePutV1GlclosuresByGlClosureIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  glClosureId: number;
  requestBody?: PutGlClosuresRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  glClosureId: number;
  requestBody?: PutGlClosuresRequest;
}, TContext>({ mutationFn: ({ glClosureId, requestBody }) => AccountingClosureService.putV1GlclosuresByGlClosureId({ glClosureId, requestBody }) as unknown as Promise<TData>, ...options });
export const useGroupsServicePutV1GroupsByGroupId = <TData = Common.GroupsServicePutV1GroupsByGroupIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  groupId: number;
  requestBody: PutGroupsGroupIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  groupId: number;
  requestBody: PutGroupsGroupIdRequest;
}, TContext>({ mutationFn: ({ groupId, requestBody }) => GroupsService.putV1GroupsByGroupId({ groupId, requestBody }) as unknown as Promise<TData>, ...options });
export const useHolidaysServicePutV1HolidaysByHolidayId = <TData = Common.HolidaysServicePutV1HolidaysByHolidayIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  holidayId: number;
  requestBody: PutHolidaysHolidayIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  holidayId: number;
  requestBody: PutHolidaysHolidayIdRequest;
}, TContext>({ mutationFn: ({ holidayId, requestBody }) => HolidaysService.putV1HolidaysByHolidayId({ holidayId, requestBody }) as unknown as Promise<TData>, ...options });
export const useHooksServicePutV1HooksByHookId = <TData = Common.HooksServicePutV1HooksByHookIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  hookId: number;
  requestBody: PutHookRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  hookId: number;
  requestBody: PutHookRequest;
}, TContext>({ mutationFn: ({ hookId, requestBody }) => HooksService.putV1HooksByHookId({ hookId, requestBody }) as unknown as Promise<TData>, ...options });
export const useInstanceModeServicePutV1InstanceMode = <TData = Common.InstanceModeServicePutV1InstanceModeMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: ChangeInstanceModeRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: ChangeInstanceModeRequest;
}, TContext>({ mutationFn: ({ requestBody }) => InstanceModeService.putV1InstanceMode({ requestBody }) as unknown as Promise<TData>, ...options });
export const useInterestRateChartServicePutV1InterestratechartsByChartId = <TData = Common.InterestRateChartServicePutV1InterestratechartsByChartIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  chartId: number;
  requestBody: PutInterestRateChartsChartIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  chartId: number;
  requestBody: PutInterestRateChartsChartIdRequest;
}, TContext>({ mutationFn: ({ chartId, requestBody }) => InterestRateChartService.putV1InterestratechartsByChartId({ chartId, requestBody }) as unknown as Promise<TData>, ...options });
export const useInterestRateSlabAKAInterestBandsServicePutV1InterestratechartsByChartIdChartslabsByChartSlabId = <TData = Common.InterestRateSlabAKAInterestBandsServicePutV1InterestratechartsByChartIdChartslabsByChartSlabIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  chartId: number;
  chartSlabId: number;
  requestBody: InterestRateChartStabRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  chartId: number;
  chartSlabId: number;
  requestBody: InterestRateChartStabRequest;
}, TContext>({ mutationFn: ({ chartId, chartSlabId, requestBody }) => InterestRateSlabAKAInterestBandsService.putV1InterestratechartsByChartIdChartslabsByChartSlabId({ chartId, chartSlabId, requestBody }) as unknown as Promise<TData>, ...options });
export const useSchedulerJobServicePutV1JobsShortNameByShortName = <TData = Common.SchedulerJobServicePutV1JobsShortNameByShortNameMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PutJobsJobIDRequest;
  shortName: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PutJobsJobIDRequest;
  shortName: string;
}, TContext>({ mutationFn: ({ requestBody, shortName }) => SchedulerJobService.putV1JobsShortNameByShortName({ requestBody, shortName }) as unknown as Promise<TData>, ...options });
export const useSchedulerJobServicePutV1JobsByJobId = <TData = Common.SchedulerJobServicePutV1JobsByJobIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  jobId: number;
  requestBody: PutJobsJobIDRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  jobId: number;
  requestBody: PutJobsJobIDRequest;
}, TContext>({ mutationFn: ({ jobId, requestBody }) => SchedulerJobService.putV1JobsByJobId({ jobId, requestBody }) as unknown as Promise<TData>, ...options });
export const useBusinessStepConfigurationServicePutV1JobsByJobNameSteps = <TData = Common.BusinessStepConfigurationServicePutV1JobsByJobNameStepsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  jobName: string;
  requestBody?: BusinessStepRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  jobName: string;
  requestBody?: BusinessStepRequest;
}, TContext>({ mutationFn: ({ jobName, requestBody }) => BusinessStepConfigurationService.putV1JobsByJobNameSteps({ jobName, requestBody }) as unknown as Promise<TData>, ...options });
export const useLikelihoodServicePutV1LikelihoodByPpiNameByLikelihoodId = <TData = Common.LikelihoodServicePutV1LikelihoodByPpiNameByLikelihoodIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  likelihoodId: number;
  ppiName: string;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  likelihoodId: number;
  ppiName: string;
  requestBody?: string;
}, TContext>({ mutationFn: ({ likelihoodId, ppiName, requestBody }) => LikelihoodService.putV1LikelihoodByPpiNameByLikelihoodId({ likelihoodId, ppiName, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanProductsServicePutV1LoanproductsExternalIdByExternalProductId = <TData = Common.LoanProductsServicePutV1LoanproductsExternalIdByExternalProductIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  externalProductId: string;
  requestBody: PutLoanProductsProductIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  externalProductId: string;
  requestBody: PutLoanProductsProductIdRequest;
}, TContext>({ mutationFn: ({ externalProductId, requestBody }) => LoanProductsService.putV1LoanproductsExternalIdByExternalProductId({ externalProductId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanProductsServicePutV1LoanproductsByProductId = <TData = Common.LoanProductsServicePutV1LoanproductsByProductIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  productId: number;
  requestBody: PutLoanProductsProductIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  productId: number;
  requestBody: PutLoanProductsProductIdRequest;
}, TContext>({ mutationFn: ({ productId, requestBody }) => LoanProductsService.putV1LoanproductsByProductId({ productId, requestBody }) as unknown as Promise<TData>, ...options });
export const useProductMixServicePutV1LoanproductsByProductIdProductmix = <TData = Common.ProductMixServicePutV1LoanproductsByProductIdProductmixMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  productId: number;
  requestBody?: ProductMixRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  productId: number;
  requestBody?: ProductMixRequest;
}, TContext>({ mutationFn: ({ productId, requestBody }) => ProductMixService.putV1LoanproductsByProductIdProductmix({ productId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoansServicePutV1LoansExternalIdByLoanExternalId = <TData = Common.LoansServicePutV1LoansExternalIdByLoanExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanExternalId: string;
  requestBody: PutLoansLoanIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanExternalId: string;
  requestBody: PutLoansLoanIdRequest;
}, TContext>({ mutationFn: ({ command, loanExternalId, requestBody }) => LoansService.putV1LoansExternalIdByLoanExternalId({ command, loanExternalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoansServicePutV1LoansExternalIdByLoanExternalIdApprovedAmount = <TData = Common.LoansServicePutV1LoansExternalIdByLoanExternalIdApprovedAmountMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanExternalId: string;
  requestBody: PutLoansApprovedAmountRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanExternalId: string;
  requestBody: PutLoansApprovedAmountRequest;
}, TContext>({ mutationFn: ({ loanExternalId, requestBody }) => LoansService.putV1LoansExternalIdByLoanExternalIdApprovedAmount({ loanExternalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoansServicePutV1LoansExternalIdByLoanExternalIdAvailableDisbursementAmount = <TData = Common.LoansServicePutV1LoansExternalIdByLoanExternalIdAvailableDisbursementAmountMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanExternalId: string;
  requestBody: PutLoansAvailableDisbursementAmountRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanExternalId: string;
  requestBody: PutLoansAvailableDisbursementAmountRequest;
}, TContext>({ mutationFn: ({ loanExternalId, requestBody }) => LoansService.putV1LoansExternalIdByLoanExternalIdAvailableDisbursementAmount({ loanExternalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoansServicePutV1LoansByLoanId = <TData = Common.LoansServicePutV1LoansByLoanIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  loanId: number;
  requestBody: PutLoansLoanIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  loanId: number;
  requestBody: PutLoansLoanIdRequest;
}, TContext>({ mutationFn: ({ command, loanId, requestBody }) => LoansService.putV1LoansByLoanId({ command, loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoansServicePutV1LoansByLoanIdApprovedAmount = <TData = Common.LoansServicePutV1LoansByLoanIdApprovedAmountMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanId: number;
  requestBody: PutLoansApprovedAmountRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanId: number;
  requestBody: PutLoansApprovedAmountRequest;
}, TContext>({ mutationFn: ({ loanId, requestBody }) => LoansService.putV1LoansByLoanIdApprovedAmount({ loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoansServicePutV1LoansByLoanIdAvailableDisbursementAmount = <TData = Common.LoansServicePutV1LoansByLoanIdAvailableDisbursementAmountMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanId: number;
  requestBody: PutLoansAvailableDisbursementAmountRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanId: number;
  requestBody: PutLoansAvailableDisbursementAmountRequest;
}, TContext>({ mutationFn: ({ loanId, requestBody }) => LoansService.putV1LoansByLoanIdAvailableDisbursementAmount({ loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanChargesServicePutV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalId = <TData = Common.LoanChargesServicePutV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanChargeExternalId: string;
  loanExternalId: string;
  requestBody: PutLoansLoanIdChargesChargeIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanChargeExternalId: string;
  loanExternalId: string;
  requestBody: PutLoansLoanIdChargesChargeIdRequest;
}, TContext>({ mutationFn: ({ loanChargeExternalId, loanExternalId, requestBody }) => LoanChargesService.putV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalId({ loanChargeExternalId, loanExternalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanChargesServicePutV1LoansExternalIdByLoanExternalIdChargesByLoanChargeId = <TData = Common.LoanChargesServicePutV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanChargeId: number;
  loanExternalId: string;
  requestBody: PutLoansLoanIdChargesChargeIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanChargeId: number;
  loanExternalId: string;
  requestBody: PutLoansLoanIdChargesChargeIdRequest;
}, TContext>({ mutationFn: ({ loanChargeId, loanExternalId, requestBody }) => LoanChargesService.putV1LoansExternalIdByLoanExternalIdChargesByLoanChargeId({ loanChargeId, loanExternalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanChargesServicePutV1LoansByLoanIdChargesExternalIdByLoanChargeExternalId = <TData = Common.LoanChargesServicePutV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanChargeExternalId: string;
  loanId: number;
  requestBody: PutLoansLoanIdChargesChargeIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanChargeExternalId: string;
  loanId: number;
  requestBody: PutLoansLoanIdChargesChargeIdRequest;
}, TContext>({ mutationFn: ({ loanChargeExternalId, loanId, requestBody }) => LoanChargesService.putV1LoansByLoanIdChargesExternalIdByLoanChargeExternalId({ loanChargeExternalId, loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanChargesServicePutV1LoansByLoanIdChargesByLoanChargeId = <TData = Common.LoanChargesServicePutV1LoansByLoanIdChargesByLoanChargeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanChargeId: number;
  loanId: number;
  requestBody: PutLoansLoanIdChargesChargeIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanChargeId: number;
  loanId: number;
  requestBody: PutLoansLoanIdChargesChargeIdRequest;
}, TContext>({ mutationFn: ({ loanChargeId, loanId, requestBody }) => LoanChargesService.putV1LoansByLoanIdChargesByLoanChargeId({ loanChargeId, loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanInterestPauseServicePutV1LoansExternalIdByLoanExternalIdInterestPausesByVariationId = <TData = Common.LoanInterestPauseServicePutV1LoansExternalIdByLoanExternalIdInterestPausesByVariationIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanExternalId: string;
  requestBody: InterestPauseRequestDto;
  variationId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanExternalId: string;
  requestBody: InterestPauseRequestDto;
  variationId: number;
}, TContext>({ mutationFn: ({ loanExternalId, requestBody, variationId }) => LoanInterestPauseService.putV1LoansExternalIdByLoanExternalIdInterestPausesByVariationId({ loanExternalId, requestBody, variationId }) as unknown as Promise<TData>, ...options });
export const useLoanInterestPauseServicePutV1LoansByLoanIdInterestPausesByVariationId = <TData = Common.LoanInterestPauseServicePutV1LoansByLoanIdInterestPausesByVariationIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanId: number;
  requestBody: InterestPauseRequestDto;
  variationId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanId: number;
  requestBody: InterestPauseRequestDto;
  variationId: number;
}, TContext>({ mutationFn: ({ loanId, requestBody, variationId }) => LoanInterestPauseService.putV1LoansByLoanIdInterestPausesByVariationId({ loanId, requestBody, variationId }) as unknown as Promise<TData>, ...options });
export const useLoanTransactionsServicePutV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByTransactionExternalId = <TData = Common.LoanTransactionsServicePutV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByTransactionExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanExternalId: string;
  requestBody: PutChargeTransactionChangesRequest;
  transactionExternalId: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanExternalId: string;
  requestBody: PutChargeTransactionChangesRequest;
  transactionExternalId: string;
}, TContext>({ mutationFn: ({ loanExternalId, requestBody, transactionExternalId }) => LoanTransactionsService.putV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByTransactionExternalId({ loanExternalId, requestBody, transactionExternalId }) as unknown as Promise<TData>, ...options });
export const useLoanTransactionsServicePutV1LoansExternalIdByLoanExternalIdTransactionsByTransactionId = <TData = Common.LoanTransactionsServicePutV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanExternalId: string;
  requestBody: PutChargeTransactionChangesRequest;
  transactionId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanExternalId: string;
  requestBody: PutChargeTransactionChangesRequest;
  transactionId: number;
}, TContext>({ mutationFn: ({ loanExternalId, requestBody, transactionId }) => LoanTransactionsService.putV1LoansExternalIdByLoanExternalIdTransactionsByTransactionId({ loanExternalId, requestBody, transactionId }) as unknown as Promise<TData>, ...options });
export const useLoanTransactionsServicePutV1LoansByLoanIdTransactionsExternalIdByTransactionExternalId = <TData = Common.LoanTransactionsServicePutV1LoansByLoanIdTransactionsExternalIdByTransactionExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanId: number;
  requestBody: PutChargeTransactionChangesRequest;
  transactionExternalId: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanId: number;
  requestBody: PutChargeTransactionChangesRequest;
  transactionExternalId: string;
}, TContext>({ mutationFn: ({ loanId, requestBody, transactionExternalId }) => LoanTransactionsService.putV1LoansByLoanIdTransactionsExternalIdByTransactionExternalId({ loanId, requestBody, transactionExternalId }) as unknown as Promise<TData>, ...options });
export const useLoanTransactionsServicePutV1LoansByLoanIdTransactionsByTransactionId = <TData = Common.LoanTransactionsServicePutV1LoansByLoanIdTransactionsByTransactionIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanId: number;
  requestBody: PutChargeTransactionChangesRequest;
  transactionId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanId: number;
  requestBody: PutChargeTransactionChangesRequest;
  transactionId: number;
}, TContext>({ mutationFn: ({ loanId, requestBody, transactionId }) => LoanTransactionsService.putV1LoansByLoanIdTransactionsByTransactionId({ loanId, requestBody, transactionId }) as unknown as Promise<TData>, ...options });
export const useLoanCollateralServicePutV1LoansByLoanIdCollateralsByCollateralId = <TData = Common.LoanCollateralServicePutV1LoansByLoanIdCollateralsByCollateralIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  collateralId: number;
  loanId: number;
  requestBody: LoansLoandIdCollateralsCollateralIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  collateralId: number;
  loanId: number;
  requestBody: LoansLoandIdCollateralsCollateralIdRequest;
}, TContext>({ mutationFn: ({ collateralId, loanId, requestBody }) => LoanCollateralService.putV1LoansByLoanIdCollateralsByCollateralId({ collateralId, loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanDisbursementDetailsServicePutV1LoansByLoanIdDisbursementsEditDisbursements = <TData = Common.LoanDisbursementDetailsServicePutV1LoansByLoanIdDisbursementsEditDisbursementsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanId: number;
  requestBody: PostAddAndDeleteDisbursementDetailRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanId: number;
  requestBody: PostAddAndDeleteDisbursementDetailRequest;
}, TContext>({ mutationFn: ({ loanId, requestBody }) => LoanDisbursementDetailsService.putV1LoansByLoanIdDisbursementsEditDisbursements({ loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useLoanDisbursementDetailsServicePutV1LoansByLoanIdDisbursementsByDisbursementId = <TData = Common.LoanDisbursementDetailsServicePutV1LoansByLoanIdDisbursementsByDisbursementIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  disbursementId: number;
  loanId: number;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  disbursementId: number;
  loanId: number;
  requestBody?: string;
}, TContext>({ mutationFn: ({ disbursementId, loanId, requestBody }) => LoanDisbursementDetailsService.putV1LoansByLoanIdDisbursementsByDisbursementId({ disbursementId, loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useGuarantorsServicePutV1LoansByLoanIdGuarantorsByGuarantorId = <TData = Common.GuarantorsServicePutV1LoansByLoanIdGuarantorsByGuarantorIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  guarantorId: number;
  loanId: number;
  requestBody?: GuarantorsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  guarantorId: number;
  loanId: number;
  requestBody?: GuarantorsRequest;
}, TContext>({ mutationFn: ({ guarantorId, loanId, requestBody }) => GuarantorsService.putV1LoansByLoanIdGuarantorsByGuarantorId({ guarantorId, loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useRepaymentWithPostDatedChecksServicePutV1LoansByLoanIdPostdatedchecksByPostDatedCheckId = <TData = Common.RepaymentWithPostDatedChecksServicePutV1LoansByLoanIdPostdatedchecksByPostDatedCheckIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  editType?: string;
  loanId: number;
  postDatedCheckId: number;
  requestBody: UpdatePostDatedCheckRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  editType?: string;
  loanId: number;
  postDatedCheckId: number;
  requestBody: UpdatePostDatedCheckRequest;
}, TContext>({ mutationFn: ({ editType, loanId, postDatedCheckId, requestBody }) => RepaymentWithPostDatedChecksService.putV1LoansByLoanIdPostdatedchecksByPostDatedCheckId({ editType, loanId, postDatedCheckId, requestBody }) as unknown as Promise<TData>, ...options });
export const useMixMappingServicePutV1Mixmapping = <TData = Common.MixMappingServicePutV1MixmappingMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: MixTaxonomyRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: MixTaxonomyRequest;
}, TContext>({ mutationFn: ({ requestBody }) => MixMappingService.putV1Mixmapping({ requestBody }) as unknown as Promise<TData>, ...options });
export const useNotificationServicePutV1Notifications = <TData = Common.NotificationServicePutV1NotificationsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => NotificationService.putV1Notifications() as unknown as Promise<TData>, ...options });
export const useOfficesServicePutV1OfficesExternalIdByExternalId = <TData = Common.OfficesServicePutV1OfficesExternalIdByExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  externalId: string;
  requestBody: PutOfficesOfficeIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  externalId: string;
  requestBody: PutOfficesOfficeIdRequest;
}, TContext>({ mutationFn: ({ externalId, requestBody }) => OfficesService.putV1OfficesExternalIdByExternalId({ externalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useOfficesServicePutV1OfficesByOfficeId = <TData = Common.OfficesServicePutV1OfficesByOfficeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  officeId: number;
  requestBody: PutOfficesOfficeIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  officeId: number;
  requestBody: PutOfficesOfficeIdRequest;
}, TContext>({ mutationFn: ({ officeId, requestBody }) => OfficesService.putV1OfficesByOfficeId({ officeId, requestBody }) as unknown as Promise<TData>, ...options });
export const usePasswordPreferencesServicePutV1Passwordpreferences = <TData = Common.PasswordPreferencesServicePutV1PasswordpreferencesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PutPasswordPreferencesTemplateRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PutPasswordPreferencesTemplateRequest;
}, TContext>({ mutationFn: ({ requestBody }) => PasswordPreferencesService.putV1Passwordpreferences({ requestBody }) as unknown as Promise<TData>, ...options });
export const usePaymentTypeServicePutV1PaymenttypesByPaymentTypeId = <TData = Common.PaymentTypeServicePutV1PaymenttypesByPaymentTypeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  paymentTypeId: number;
  requestBody: PutPaymentTypesPaymentTypeIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  paymentTypeId: number;
  requestBody: PutPaymentTypesPaymentTypeIdRequest;
}, TContext>({ mutationFn: ({ paymentTypeId, requestBody }) => PaymentTypeService.putV1PaymenttypesByPaymentTypeId({ paymentTypeId, requestBody }) as unknown as Promise<TData>, ...options });
export const usePermissionsServicePutV1Permissions = <TData = Common.PermissionsServicePutV1PermissionsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PutPermissionsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PutPermissionsRequest;
}, TContext>({ mutationFn: ({ requestBody }) => PermissionsService.putV1Permissions({ requestBody }) as unknown as Promise<TData>, ...options });
export const useProductsServicePutV1ProductsByTypeByProductId = <TData = Common.ProductsServicePutV1ProductsByTypeByProductIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  productId: number;
  requestBody: PutProductsTypeProductIdRequest;
  type: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  productId: number;
  requestBody: PutProductsTypeProductIdRequest;
  type: string;
}, TContext>({ mutationFn: ({ productId, requestBody, type }) => ProductsService.putV1ProductsByTypeByProductId({ productId, requestBody, type }) as unknown as Promise<TData>, ...options });
export const useProvisioningCategoryServicePutV1ProvisioningcategoryByCategoryId = <TData = Common.ProvisioningCategoryServicePutV1ProvisioningcategoryByCategoryIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  categoryId: number;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  categoryId: number;
  requestBody?: string;
}, TContext>({ mutationFn: ({ categoryId, requestBody }) => ProvisioningCategoryService.putV1ProvisioningcategoryByCategoryId({ categoryId, requestBody }) as unknown as Promise<TData>, ...options });
export const useProvisioningCriteriaServicePutV1ProvisioningcriteriaByCriteriaId = <TData = Common.ProvisioningCriteriaServicePutV1ProvisioningcriteriaByCriteriaIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  criteriaId: number;
  requestBody: PutProvisioningCriteriaRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  criteriaId: number;
  requestBody: PutProvisioningCriteriaRequest;
}, TContext>({ mutationFn: ({ criteriaId, requestBody }) => ProvisioningCriteriaService.putV1ProvisioningcriteriaByCriteriaId({ criteriaId, requestBody }) as unknown as Promise<TData>, ...options });
export const useRateServicePutV1RatesByRateId = <TData = Common.RateServicePutV1RatesByRateIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  rateId: number;
  requestBody?: RateRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  rateId: number;
  requestBody?: RateRequest;
}, TContext>({ mutationFn: ({ rateId, requestBody }) => RateService.putV1RatesByRateId({ rateId, requestBody }) as unknown as Promise<TData>, ...options });
export const useRecurringDepositAccountServicePutV1RecurringdepositaccountsByAccountId = <TData = Common.RecurringDepositAccountServicePutV1RecurringdepositaccountsByAccountIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountId: number;
  requestBody: PutRecurringDepositAccountsAccountIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountId: number;
  requestBody: PutRecurringDepositAccountsAccountIdRequest;
}, TContext>({ mutationFn: ({ accountId, requestBody }) => RecurringDepositAccountService.putV1RecurringdepositaccountsByAccountId({ accountId, requestBody }) as unknown as Promise<TData>, ...options });
export const useRecurringDepositProductServicePutV1RecurringdepositproductsByProductId = <TData = Common.RecurringDepositProductServicePutV1RecurringdepositproductsByProductIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  productId: number;
  requestBody: PutRecurringDepositProductsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  productId: number;
  requestBody: PutRecurringDepositProductsRequest;
}, TContext>({ mutationFn: ({ productId, requestBody }) => RecurringDepositProductService.putV1RecurringdepositproductsByProductId({ productId, requestBody }) as unknown as Promise<TData>, ...options });
export const useReportMailingJobsServicePutV1ReportmailingjobsByEntityId = <TData = Common.ReportMailingJobsServicePutV1ReportmailingjobsByEntityIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  entityId: number;
  requestBody: PutReportMailingJobsRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  entityId: number;
  requestBody: PutReportMailingJobsRequest;
}, TContext>({ mutationFn: ({ entityId, requestBody }) => ReportMailingJobsService.putV1ReportmailingjobsByEntityId({ entityId, requestBody }) as unknown as Promise<TData>, ...options });
export const useReportsServicePutV1ReportsById = <TData = Common.ReportsServicePutV1ReportsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  requestBody: PutReportRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  requestBody: PutReportRequest;
}, TContext>({ mutationFn: ({ id, requestBody }) => ReportsService.putV1ReportsById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useRolesServicePutV1RolesByRoleId = <TData = Common.RolesServicePutV1RolesByRoleIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PutRolesRoleIdRequest;
  roleId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PutRolesRoleIdRequest;
  roleId: number;
}, TContext>({ mutationFn: ({ requestBody, roleId }) => RolesService.putV1RolesByRoleId({ requestBody, roleId }) as unknown as Promise<TData>, ...options });
export const useRolesServicePutV1RolesByRoleIdPermissions = <TData = Common.RolesServicePutV1RolesByRoleIdPermissionsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PutRolesRoleIdPermissionsRequest;
  roleId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PutRolesRoleIdPermissionsRequest;
  roleId: number;
}, TContext>({ mutationFn: ({ requestBody, roleId }) => RolesService.putV1RolesByRoleIdPermissions({ requestBody, roleId }) as unknown as Promise<TData>, ...options });
export const useSavingsAccountServicePutV1SavingsaccountsExternalIdByExternalId = <TData = Common.SavingsAccountServicePutV1SavingsaccountsExternalIdByExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  externalId: string;
  requestBody: PutSavingsAccountsAccountIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  externalId: string;
  requestBody: PutSavingsAccountsAccountIdRequest;
}, TContext>({ mutationFn: ({ command, externalId, requestBody }) => SavingsAccountService.putV1SavingsaccountsExternalIdByExternalId({ command, externalId, requestBody }) as unknown as Promise<TData>, ...options });
export const useSavingsAccountServicePutV1SavingsaccountsGsimByParentAccountId = <TData = Common.SavingsAccountServicePutV1SavingsaccountsGsimByParentAccountIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  parentAccountId: number;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  parentAccountId: number;
  requestBody?: string;
}, TContext>({ mutationFn: ({ parentAccountId, requestBody }) => SavingsAccountService.putV1SavingsaccountsGsimByParentAccountId({ parentAccountId, requestBody }) as unknown as Promise<TData>, ...options });
export const useSavingsAccountServicePutV1SavingsaccountsByAccountId = <TData = Common.SavingsAccountServicePutV1SavingsaccountsByAccountIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountId: number;
  command?: string;
  requestBody: PutSavingsAccountsAccountIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountId: number;
  command?: string;
  requestBody: PutSavingsAccountsAccountIdRequest;
}, TContext>({ mutationFn: ({ accountId, command, requestBody }) => SavingsAccountService.putV1SavingsaccountsByAccountId({ accountId, command, requestBody }) as unknown as Promise<TData>, ...options });
export const useSavingsChargesServicePutV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeId = <TData = Common.SavingsChargesServicePutV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PutSavingsAccountsSavingsAccountIdChargesSavingsAccountChargeIdRequest;
  savingsAccountChargeId: number;
  savingsAccountId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PutSavingsAccountsSavingsAccountIdChargesSavingsAccountChargeIdRequest;
  savingsAccountChargeId: number;
  savingsAccountId: number;
}, TContext>({ mutationFn: ({ requestBody, savingsAccountChargeId, savingsAccountId }) => SavingsChargesService.putV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeId({ requestBody, savingsAccountChargeId, savingsAccountId }) as unknown as Promise<TData>, ...options });
export const useSavingsProductServicePutV1SavingsproductsByProductId = <TData = Common.SavingsProductServicePutV1SavingsproductsByProductIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  productId: number;
  requestBody: PutSavingsProductsProductIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  productId: number;
  requestBody: PutSavingsProductsProductIdRequest;
}, TContext>({ mutationFn: ({ productId, requestBody }) => SavingsProductService.putV1SavingsproductsByProductId({ productId, requestBody }) as unknown as Promise<TData>, ...options });
export const useSelfThirdPartyTransferServicePutV1SelfBeneficiariesTptByBeneficiaryId = <TData = Common.SelfThirdPartyTransferServicePutV1SelfBeneficiariesTptByBeneficiaryIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  beneficiaryId: number;
  requestBody: PutSelfBeneficiariesTPTBeneficiaryIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  beneficiaryId: number;
  requestBody: PutSelfBeneficiariesTPTBeneficiaryIdRequest;
}, TContext>({ mutationFn: ({ beneficiaryId, requestBody }) => SelfThirdPartyTransferService.putV1SelfBeneficiariesTptByBeneficiaryId({ beneficiaryId, requestBody }) as unknown as Promise<TData>, ...options });
export const useDeviceRegistrationServicePutV1SelfDeviceRegistrationById = <TData = Common.DeviceRegistrationServicePutV1SelfDeviceRegistrationByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  requestBody?: string;
}, TContext>({ mutationFn: ({ id, requestBody }) => DeviceRegistrationService.putV1SelfDeviceRegistrationById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useSelfLoansServicePutV1SelfLoansByLoanId = <TData = Common.SelfLoansServicePutV1SelfLoansByLoanIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanId: number;
  requestBody: PutSelfLoansLoanIdRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanId: number;
  requestBody: PutSelfLoansLoanIdRequest;
}, TContext>({ mutationFn: ({ loanId, requestBody }) => SelfLoansService.putV1SelfLoansByLoanId({ loanId, requestBody }) as unknown as Promise<TData>, ...options });
export const useSelfSavingsAccountServicePutV1SelfSavingsaccountsByAccountId = <TData = Common.SelfSavingsAccountServicePutV1SelfSavingsaccountsByAccountIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountId: number;
  command?: string;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountId: number;
  command?: string;
  requestBody?: string;
}, TContext>({ mutationFn: ({ accountId, command, requestBody }) => SelfSavingsAccountService.putV1SelfSavingsaccountsByAccountId({ accountId, command, requestBody }) as unknown as Promise<TData>, ...options });
export const useSelfUserServicePutV1SelfUser = <TData = Common.SelfUserServicePutV1SelfUserMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PutSelfUserRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PutSelfUserRequest;
}, TContext>({ mutationFn: ({ requestBody }) => SelfUserService.putV1SelfUser({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSelfDividendServicePutV1ShareproductByProductIdDividendByDividendId = <TData = Common.SelfDividendServicePutV1ShareproductByProductIdDividendByDividendIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  dividendId: number;
  productId: number;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  dividendId: number;
  productId: number;
  requestBody?: string;
}, TContext>({ mutationFn: ({ command, dividendId, productId, requestBody }) => SelfDividendService.putV1ShareproductByProductIdDividendByDividendId({ command, dividendId, productId, requestBody }) as unknown as Promise<TData>, ...options });
export const useSmsServicePutV1SmsByResourceId = <TData = Common.SmsServicePutV1SmsByResourceIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody?: SmsUpdateRequest;
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody?: SmsUpdateRequest;
  resourceId: number;
}, TContext>({ mutationFn: ({ requestBody, resourceId }) => SmsService.putV1SmsByResourceId({ requestBody, resourceId }) as unknown as Promise<TData>, ...options });
export const useStaffServicePutV1StaffByStaffId = <TData = Common.StaffServicePutV1StaffByStaffIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PutStaffRequest;
  staffId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PutStaffRequest;
  staffId: number;
}, TContext>({ mutationFn: ({ requestBody, staffId }) => StaffService.putV1StaffByStaffId({ requestBody, staffId }) as unknown as Promise<TData>, ...options });
export const useStandingInstructionsServicePutV1StandinginstructionsByStandingInstructionId = <TData = Common.StandingInstructionsServicePutV1StandinginstructionsByStandingInstructionIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  command?: string;
  requestBody?: StandingInstructionUpdatesRequest;
  standingInstructionId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  command?: string;
  requestBody?: StandingInstructionUpdatesRequest;
  standingInstructionId: number;
}, TContext>({ mutationFn: ({ command, requestBody, standingInstructionId }) => StandingInstructionsService.putV1StandinginstructionsByStandingInstructionId({ command, requestBody, standingInstructionId }) as unknown as Promise<TData>, ...options });
export const useSurveyServicePutV1SurveyRegisterBySurveyNameByApptable = <TData = Common.SurveyServicePutV1SurveyRegisterBySurveyNameByApptableMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  apptable: string;
  requestBody?: string;
  surveyName: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  apptable: string;
  requestBody?: string;
  surveyName: string;
}, TContext>({ mutationFn: ({ apptable, requestBody, surveyName }) => SurveyService.putV1SurveyRegisterBySurveyNameByApptable({ apptable, requestBody, surveyName }) as unknown as Promise<TData>, ...options });
export const useSpmSurveysServicePutV1SurveysById = <TData = Common.SpmSurveysServicePutV1SurveysByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  requestBody?: SurveyData;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  requestBody?: SurveyData;
}, TContext>({ mutationFn: ({ id, requestBody }) => SpmSurveysService.putV1SurveysById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useTaxComponentsServicePutV1TaxesComponentByTaxComponentId = <TData = Common.TaxComponentsServicePutV1TaxesComponentByTaxComponentIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PutTaxesComponentsTaxComponentIdRequest;
  taxComponentId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PutTaxesComponentsTaxComponentIdRequest;
  taxComponentId: number;
}, TContext>({ mutationFn: ({ requestBody, taxComponentId }) => TaxComponentsService.putV1TaxesComponentByTaxComponentId({ requestBody, taxComponentId }) as unknown as Promise<TData>, ...options });
export const useTaxGroupServicePutV1TaxesGroupByTaxGroupId = <TData = Common.TaxGroupServicePutV1TaxesGroupByTaxGroupIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PutTaxesGroupTaxGroupIdRequest;
  taxGroupId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PutTaxesGroupTaxGroupIdRequest;
  taxGroupId: number;
}, TContext>({ mutationFn: ({ requestBody, taxGroupId }) => TaxGroupService.putV1TaxesGroupByTaxGroupId({ requestBody, taxGroupId }) as unknown as Promise<TData>, ...options });
export const useTellerCashManagementServicePutV1TellersByTellerId = <TData = Common.TellerCashManagementServicePutV1TellersByTellerIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PutTellersRequest;
  tellerId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PutTellersRequest;
  tellerId: number;
}, TContext>({ mutationFn: ({ requestBody, tellerId }) => TellerCashManagementService.putV1TellersByTellerId({ requestBody, tellerId }) as unknown as Promise<TData>, ...options });
export const useTellerCashManagementServicePutV1TellersByTellerIdCashiersByCashierId = <TData = Common.TellerCashManagementServicePutV1TellersByTellerIdCashiersByCashierIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  cashierId: number;
  requestBody: PutTellersTellerIdCashiersCashierIdRequest;
  tellerId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  cashierId: number;
  requestBody: PutTellersTellerIdCashiersCashierIdRequest;
  tellerId: number;
}, TContext>({ mutationFn: ({ cashierId, requestBody, tellerId }) => TellerCashManagementService.putV1TellersByTellerIdCashiersByCashierId({ cashierId, requestBody, tellerId }) as unknown as Promise<TData>, ...options });
export const useUserGeneratedDocumentsServicePutV1TemplatesByTemplateId = <TData = Common.UserGeneratedDocumentsServicePutV1TemplatesByTemplateIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PutTemplatesTemplateIdRequest;
  templateId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PutTemplatesTemplateIdRequest;
  templateId: number;
}, TContext>({ mutationFn: ({ requestBody, templateId }) => UserGeneratedDocumentsService.putV1TemplatesByTemplateId({ requestBody, templateId }) as unknown as Promise<TData>, ...options });
export const useUsersServicePutV1UsersByUserId = <TData = Common.UsersServicePutV1UsersByUserIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PutUsersUserIdRequest;
  userId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PutUsersUserIdRequest;
  userId: number;
}, TContext>({ mutationFn: ({ requestBody, userId }) => UsersService.putV1UsersByUserId({ requestBody, userId }) as unknown as Promise<TData>, ...options });
export const useWorkingDaysServicePutV1Workingdays = <TData = Common.WorkingDaysServicePutV1WorkingdaysMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PutWorkingDaysRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PutWorkingDaysRequest;
}, TContext>({ mutationFn: ({ requestBody }) => WorkingDaysService.putV1Workingdays({ requestBody }) as unknown as Promise<TData>, ...options });
export const useCalendarServicePutV1ByEntityTypeByEntityIdCalendarsByCalendarId = <TData = Common.CalendarServicePutV1ByEntityTypeByEntityIdCalendarsByCalendarIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  calendarId: number;
  entityId: number;
  entityType: string;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  calendarId: number;
  entityId: number;
  entityType: string;
  requestBody?: string;
}, TContext>({ mutationFn: ({ calendarId, entityId, entityType, requestBody }) => CalendarService.putV1ByEntityTypeByEntityIdCalendarsByCalendarId({ calendarId, entityId, entityType, requestBody }) as unknown as Promise<TData>, ...options });
export const useDocumentsServicePutV1ByEntityTypeByEntityIdDocumentsByDocumentId = <TData = Common.DocumentsServicePutV1ByEntityTypeByEntityIdDocumentsByDocumentIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  contentLength?: number;
  documentId: number;
  entityId: number;
  entityType: string;
  formData?: DocumentUploadRequest;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  contentLength?: number;
  documentId: number;
  entityId: number;
  entityType: string;
  formData?: DocumentUploadRequest;
}, TContext>({ mutationFn: ({ contentLength, documentId, entityId, entityType, formData }) => DocumentsService.putV1ByEntityTypeByEntityIdDocumentsByDocumentId({ contentLength, documentId, entityId, entityType, formData }) as unknown as Promise<TData>, ...options });
export const useMeetingsServicePutV1ByEntityTypeByEntityIdMeetingsByMeetingId = <TData = Common.MeetingsServicePutV1ByEntityTypeByEntityIdMeetingsByMeetingIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  entityId: number;
  entityType: string;
  meetingId: number;
  requestBody?: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  entityId: number;
  entityType: string;
  meetingId: number;
  requestBody?: string;
}, TContext>({ mutationFn: ({ entityId, entityType, meetingId, requestBody }) => MeetingsService.putV1ByEntityTypeByEntityIdMeetingsByMeetingId({ entityId, entityType, meetingId, requestBody }) as unknown as Promise<TData>, ...options });
export const useNotesServicePutV1ByResourceTypeByResourceIdNotesByNoteId = <TData = Common.NotesServicePutV1ByResourceTypeByResourceIdNotesByNoteIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  noteId: number;
  requestBody: NoteRequest;
  resourceId: number;
  resourceType: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  noteId: number;
  requestBody: NoteRequest;
  resourceId: number;
  resourceType: string;
}, TContext>({ mutationFn: ({ noteId, requestBody, resourceId, resourceType }) => NotesService.putV1ByResourceTypeByResourceIdNotesByNoteId({ noteId, requestBody, resourceId, resourceType }) as unknown as Promise<TData>, ...options });
export const useDefaultServiceDeleteV1CreditBureauIntegrationDeleteCreditReportByCreditBureauId = <TData = Common.DefaultServiceDeleteV1CreditBureauIntegrationDeleteCreditReportByCreditBureauIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  creditBureauId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  creditBureauId: number;
}, TContext>({ mutationFn: ({ creditBureauId }) => DefaultService.deleteV1CreditBureauIntegrationDeleteCreditReportByCreditBureauId({ creditBureauId }) as unknown as Promise<TData>, ...options });
export const useDefaultServiceDeleteV1EmailCampaignByResourceId = <TData = Common.DefaultServiceDeleteV1EmailCampaignByResourceIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  resourceId: number;
}, TContext>({ mutationFn: ({ resourceId }) => DefaultService.deleteV1EmailCampaignByResourceId({ resourceId }) as unknown as Promise<TData>, ...options });
export const useDefaultServiceDeleteV1EmailByResourceId = <TData = Common.DefaultServiceDeleteV1EmailByResourceIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  resourceId: number;
}, TContext>({ mutationFn: ({ resourceId }) => DefaultService.deleteV1EmailByResourceId({ resourceId }) as unknown as Promise<TData>, ...options });
export const useDefaultServiceDeleteV1InternalExternalevents = <TData = Common.DefaultServiceDeleteV1InternalExternaleventsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => DefaultService.deleteV1InternalExternalevents() as unknown as Promise<TData>, ...options });
export const useDefaultServiceDeleteV1OfficetransactionsByTransactionId = <TData = Common.DefaultServiceDeleteV1OfficetransactionsByTransactionIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  transactionId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  transactionId: number;
}, TContext>({ mutationFn: ({ transactionId }) => DefaultService.deleteV1OfficetransactionsByTransactionId({ transactionId }) as unknown as Promise<TData>, ...options });
export const useDefaultServiceDeleteV1SmscampaignsByCampaignId = <TData = Common.DefaultServiceDeleteV1SmscampaignsByCampaignIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  campaignId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  campaignId: number;
}, TContext>({ mutationFn: ({ campaignId }) => DefaultService.deleteV1SmscampaignsByCampaignId({ campaignId }) as unknown as Promise<TData>, ...options });
export const useDefaultServiceDeleteV1ByEntityByEntityIdImages = <TData = Common.DefaultServiceDeleteV1ByEntityByEntityIdImagesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  entity: string;
  entityId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  entity: string;
  entityId: number;
}, TContext>({ mutationFn: ({ entity, entityId }) => DefaultService.deleteV1ByEntityByEntityIdImages({ entity, entityId }) as unknown as Promise<TData>, ...options });
export const useAccountingRulesServiceDeleteV1AccountingrulesByAccountingRuleId = <TData = Common.AccountingRulesServiceDeleteV1AccountingrulesByAccountingRuleIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountingRuleId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountingRuleId: number;
}, TContext>({ mutationFn: ({ accountingRuleId }) => AccountingRulesService.deleteV1AccountingrulesByAccountingRuleId({ accountingRuleId }) as unknown as Promise<TData>, ...options });
export const useAccountNumberFormatServiceDeleteV1AccountnumberformatsByAccountNumberFormatId = <TData = Common.AccountNumberFormatServiceDeleteV1AccountnumberformatsByAccountNumberFormatIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountNumberFormatId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountNumberFormatId: number;
}, TContext>({ mutationFn: ({ accountNumberFormatId }) => AccountNumberFormatService.deleteV1AccountnumberformatsByAccountNumberFormatId({ accountNumberFormatId }) as unknown as Promise<TData>, ...options });
export const useAdhocQueryApiServiceDeleteV1AdhocqueryByAdHocId = <TData = Common.AdhocQueryApiServiceDeleteV1AdhocqueryByAdHocIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  adHocId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  adHocId: number;
}, TContext>({ mutationFn: ({ adHocId }) => AdhocQueryApiService.deleteV1AdhocqueryByAdHocId({ adHocId }) as unknown as Promise<TData>, ...options });
export const useCentersServiceDeleteV1CentersByCenterId = <TData = Common.CentersServiceDeleteV1CentersByCenterIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  centerId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  centerId: number;
}, TContext>({ mutationFn: ({ centerId }) => CentersService.deleteV1CentersByCenterId({ centerId }) as unknown as Promise<TData>, ...options });
export const useChargesServiceDeleteV1ChargesByChargeId = <TData = Common.ChargesServiceDeleteV1ChargesByChargeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  chargeId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  chargeId: number;
}, TContext>({ mutationFn: ({ chargeId }) => ChargesService.deleteV1ChargesByChargeId({ chargeId }) as unknown as Promise<TData>, ...options });
export const useClientServiceDeleteV1ClientsExternalIdByExternalId = <TData = Common.ClientServiceDeleteV1ClientsExternalIdByExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  externalId: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  externalId: string;
}, TContext>({ mutationFn: ({ externalId }) => ClientService.deleteV1ClientsExternalIdByExternalId({ externalId }) as unknown as Promise<TData>, ...options });
export const useClientServiceDeleteV1ClientsByClientId = <TData = Common.ClientServiceDeleteV1ClientsByClientIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
}, TContext>({ mutationFn: ({ clientId }) => ClientService.deleteV1ClientsByClientId({ clientId }) as unknown as Promise<TData>, ...options });
export const useClientChargesServiceDeleteV1ClientsByClientIdChargesByChargeId = <TData = Common.ClientChargesServiceDeleteV1ClientsByClientIdChargesByChargeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  chargeId: number;
  clientId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  chargeId: number;
  clientId: number;
}, TContext>({ mutationFn: ({ chargeId, clientId }) => ClientChargesService.deleteV1ClientsByClientIdChargesByChargeId({ chargeId, clientId }) as unknown as Promise<TData>, ...options });
export const useClientCollateralManagementServiceDeleteV1ClientsByClientIdCollateralsByCollateralId = <TData = Common.ClientCollateralManagementServiceDeleteV1ClientsByClientIdCollateralsByCollateralIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
  collateralId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
  collateralId: number;
}, TContext>({ mutationFn: ({ clientId, collateralId }) => ClientCollateralManagementService.deleteV1ClientsByClientIdCollateralsByCollateralId({ clientId, collateralId }) as unknown as Promise<TData>, ...options });
export const useClientFamilyMemberServiceDeleteV1ClientsByClientIdFamilymembersByFamilyMemberId = <TData = Common.ClientFamilyMemberServiceDeleteV1ClientsByClientIdFamilymembersByFamilyMemberIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
  familyMemberId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
  familyMemberId: number;
}, TContext>({ mutationFn: ({ clientId, familyMemberId }) => ClientFamilyMemberService.deleteV1ClientsByClientIdFamilymembersByFamilyMemberId({ clientId, familyMemberId }) as unknown as Promise<TData>, ...options });
export const useClientIdentifierServiceDeleteV1ClientsByClientIdIdentifiersByIdentifierId = <TData = Common.ClientIdentifierServiceDeleteV1ClientsByClientIdIdentifiersByIdentifierIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
  identifierId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
  identifierId: number;
}, TContext>({ mutationFn: ({ clientId, identifierId }) => ClientIdentifierService.deleteV1ClientsByClientIdIdentifiersByIdentifierId({ clientId, identifierId }) as unknown as Promise<TData>, ...options });
export const useCodesServiceDeleteV1CodesByCodeId = <TData = Common.CodesServiceDeleteV1CodesByCodeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  codeId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  codeId: number;
}, TContext>({ mutationFn: ({ codeId }) => CodesService.deleteV1CodesByCodeId({ codeId }) as unknown as Promise<TData>, ...options });
export const useCodeValuesServiceDeleteV1CodesByCodeIdCodevaluesByCodeValueId = <TData = Common.CodeValuesServiceDeleteV1CodesByCodeIdCodevaluesByCodeValueIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  codeId: number;
  codeValueId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  codeId: number;
  codeValueId: number;
}, TContext>({ mutationFn: ({ codeId, codeValueId }) => CodeValuesService.deleteV1CodesByCodeIdCodevaluesByCodeValueId({ codeId, codeValueId }) as unknown as Promise<TData>, ...options });
export const useCollateralManagementServiceDeleteV1CollateralManagementByCollateralId = <TData = Common.CollateralManagementServiceDeleteV1CollateralManagementByCollateralIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  collateralId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  collateralId: number;
}, TContext>({ mutationFn: ({ collateralId }) => CollateralManagementService.deleteV1CollateralManagementByCollateralId({ collateralId }) as unknown as Promise<TData>, ...options });
export const useDataTablesServiceDeleteV1DatatablesByDatatableName = <TData = Common.DataTablesServiceDeleteV1DatatablesByDatatableNameMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  datatableName: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  datatableName: string;
}, TContext>({ mutationFn: ({ datatableName }) => DataTablesService.deleteV1DatatablesByDatatableName({ datatableName }) as unknown as Promise<TData>, ...options });
export const useDataTablesServiceDeleteV1DatatablesByDatatableByApptableId = <TData = Common.DataTablesServiceDeleteV1DatatablesByDatatableByApptableIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  apptableId: number;
  datatable: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  apptableId: number;
  datatable: string;
}, TContext>({ mutationFn: ({ apptableId, datatable }) => DataTablesService.deleteV1DatatablesByDatatableByApptableId({ apptableId, datatable }) as unknown as Promise<TData>, ...options });
export const useDataTablesServiceDeleteV1DatatablesByDatatableByApptableIdByDatatableId = <TData = Common.DataTablesServiceDeleteV1DatatablesByDatatableByApptableIdByDatatableIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  apptableId: number;
  datatable: string;
  datatableId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  apptableId: number;
  datatable: string;
  datatableId: number;
}, TContext>({ mutationFn: ({ apptableId, datatable, datatableId }) => DataTablesService.deleteV1DatatablesByDatatableByApptableIdByDatatableId({ apptableId, datatable, datatableId }) as unknown as Promise<TData>, ...options });
export const useDelinquencyRangeAndBucketsManagementServiceDeleteV1DelinquencyBucketsByDelinquencyBucketId = <TData = Common.DelinquencyRangeAndBucketsManagementServiceDeleteV1DelinquencyBucketsByDelinquencyBucketIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  delinquencyBucketId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  delinquencyBucketId: number;
}, TContext>({ mutationFn: ({ delinquencyBucketId }) => DelinquencyRangeAndBucketsManagementService.deleteV1DelinquencyBucketsByDelinquencyBucketId({ delinquencyBucketId }) as unknown as Promise<TData>, ...options });
export const useDelinquencyRangeAndBucketsManagementServiceDeleteV1DelinquencyRangesByDelinquencyRangeId = <TData = Common.DelinquencyRangeAndBucketsManagementServiceDeleteV1DelinquencyRangesByDelinquencyRangeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  delinquencyRangeId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  delinquencyRangeId: number;
}, TContext>({ mutationFn: ({ delinquencyRangeId }) => DelinquencyRangeAndBucketsManagementService.deleteV1DelinquencyRangesByDelinquencyRangeId({ delinquencyRangeId }) as unknown as Promise<TData>, ...options });
export const useEntityDataTableServiceDeleteV1EntityDatatableChecksByEntityDatatableCheckId = <TData = Common.EntityDataTableServiceDeleteV1EntityDatatableChecksByEntityDatatableCheckIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  entityDatatableCheckId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  entityDatatableCheckId: number;
}, TContext>({ mutationFn: ({ entityDatatableCheckId }) => EntityDataTableService.deleteV1EntityDatatableChecksByEntityDatatableCheckId({ entityDatatableCheckId }) as unknown as Promise<TData>, ...options });
export const useFineractEntityServiceDeleteV1EntitytoentitymappingByMapId = <TData = Common.FineractEntityServiceDeleteV1EntitytoentitymappingByMapIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  mapId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  mapId: number;
}, TContext>({ mutationFn: ({ mapId }) => FineractEntityService.deleteV1EntitytoentitymappingByMapId({ mapId }) as unknown as Promise<TData>, ...options });
export const useMappingFinancialActivitiesToAccountsServiceDeleteV1FinancialactivityaccountsByMappingId = <TData = Common.MappingFinancialActivitiesToAccountsServiceDeleteV1FinancialactivityaccountsByMappingIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  mappingId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  mappingId: number;
}, TContext>({ mutationFn: ({ mappingId }) => MappingFinancialActivitiesToAccountsService.deleteV1FinancialactivityaccountsByMappingId({ mappingId }) as unknown as Promise<TData>, ...options });
export const useFixedDepositAccountServiceDeleteV1FixeddepositaccountsByAccountId = <TData = Common.FixedDepositAccountServiceDeleteV1FixeddepositaccountsByAccountIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountId: number;
}, TContext>({ mutationFn: ({ accountId }) => FixedDepositAccountService.deleteV1FixeddepositaccountsByAccountId({ accountId }) as unknown as Promise<TData>, ...options });
export const useFixedDepositProductServiceDeleteV1FixeddepositproductsByProductId = <TData = Common.FixedDepositProductServiceDeleteV1FixeddepositproductsByProductIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  productId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  productId: number;
}, TContext>({ mutationFn: ({ productId }) => FixedDepositProductService.deleteV1FixeddepositproductsByProductId({ productId }) as unknown as Promise<TData>, ...options });
export const useGeneralLedgerAccountServiceDeleteV1GlaccountsByGlAccountId = <TData = Common.GeneralLedgerAccountServiceDeleteV1GlaccountsByGlAccountIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  glAccountId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  glAccountId: number;
}, TContext>({ mutationFn: ({ glAccountId }) => GeneralLedgerAccountService.deleteV1GlaccountsByGlAccountId({ glAccountId }) as unknown as Promise<TData>, ...options });
export const useAccountingClosureServiceDeleteV1GlclosuresByGlClosureId = <TData = Common.AccountingClosureServiceDeleteV1GlclosuresByGlClosureIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  glClosureId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  glClosureId: number;
}, TContext>({ mutationFn: ({ glClosureId }) => AccountingClosureService.deleteV1GlclosuresByGlClosureId({ glClosureId }) as unknown as Promise<TData>, ...options });
export const useGroupsServiceDeleteV1GroupsByGroupId = <TData = Common.GroupsServiceDeleteV1GroupsByGroupIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  groupId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  groupId: number;
}, TContext>({ mutationFn: ({ groupId }) => GroupsService.deleteV1GroupsByGroupId({ groupId }) as unknown as Promise<TData>, ...options });
export const useHolidaysServiceDeleteV1HolidaysByHolidayId = <TData = Common.HolidaysServiceDeleteV1HolidaysByHolidayIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  holidayId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  holidayId: number;
}, TContext>({ mutationFn: ({ holidayId }) => HolidaysService.deleteV1HolidaysByHolidayId({ holidayId }) as unknown as Promise<TData>, ...options });
export const useHooksServiceDeleteV1HooksByHookId = <TData = Common.HooksServiceDeleteV1HooksByHookIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  hookId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  hookId: number;
}, TContext>({ mutationFn: ({ hookId }) => HooksService.deleteV1HooksByHookId({ hookId }) as unknown as Promise<TData>, ...options });
export const useInterestRateChartServiceDeleteV1InterestratechartsByChartId = <TData = Common.InterestRateChartServiceDeleteV1InterestratechartsByChartIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  chartId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  chartId: number;
}, TContext>({ mutationFn: ({ chartId }) => InterestRateChartService.deleteV1InterestratechartsByChartId({ chartId }) as unknown as Promise<TData>, ...options });
export const useInterestRateSlabAKAInterestBandsServiceDeleteV1InterestratechartsByChartIdChartslabsByChartSlabId = <TData = Common.InterestRateSlabAKAInterestBandsServiceDeleteV1InterestratechartsByChartIdChartslabsByChartSlabIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  chartId: number;
  chartSlabId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  chartId: number;
  chartSlabId: number;
}, TContext>({ mutationFn: ({ chartId, chartSlabId }) => InterestRateSlabAKAInterestBandsService.deleteV1InterestratechartsByChartIdChartslabsByChartSlabId({ chartId, chartSlabId }) as unknown as Promise<TData>, ...options });
export const useInterOperationServiceDeleteV1InteroperationPartiesByIdTypeByIdValue = <TData = Common.InterOperationServiceDeleteV1InteroperationPartiesByIdTypeByIdValueMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
  requestBody: InteropIdentifierRequestData;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
  requestBody: InteropIdentifierRequestData;
}, TContext>({ mutationFn: ({ idType, idValue, requestBody }) => InterOperationService.deleteV1InteroperationPartiesByIdTypeByIdValue({ idType, idValue, requestBody }) as unknown as Promise<TData>, ...options });
export const useInterOperationServiceDeleteV1InteroperationPartiesByIdTypeByIdValueBySubIdOrType = <TData = Common.InterOperationServiceDeleteV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
  requestBody: InteropIdentifierRequestData;
  subIdOrType: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
  requestBody: InteropIdentifierRequestData;
  subIdOrType: string;
}, TContext>({ mutationFn: ({ idType, idValue, requestBody, subIdOrType }) => InterOperationService.deleteV1InteroperationPartiesByIdTypeByIdValueBySubIdOrType({ idType, idValue, requestBody, subIdOrType }) as unknown as Promise<TData>, ...options });
export const useLoanCollateralManagementServiceDeleteV1LoanCollateralManagementById = <TData = Common.LoanCollateralManagementServiceDeleteV1LoanCollateralManagementByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
  loanId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
  loanId: number;
}, TContext>({ mutationFn: ({ id, loanId }) => LoanCollateralManagementService.deleteV1LoanCollateralManagementById({ id, loanId }) as unknown as Promise<TData>, ...options });
export const useProductMixServiceDeleteV1LoanproductsByProductIdProductmix = <TData = Common.ProductMixServiceDeleteV1LoanproductsByProductIdProductmixMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  productId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  productId: number;
}, TContext>({ mutationFn: ({ productId }) => ProductMixService.deleteV1LoanproductsByProductIdProductmix({ productId }) as unknown as Promise<TData>, ...options });
export const useLoansServiceDeleteV1LoansExternalIdByLoanExternalId = <TData = Common.LoansServiceDeleteV1LoansExternalIdByLoanExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanExternalId: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanExternalId: string;
}, TContext>({ mutationFn: ({ loanExternalId }) => LoansService.deleteV1LoansExternalIdByLoanExternalId({ loanExternalId }) as unknown as Promise<TData>, ...options });
export const useLoansServiceDeleteV1LoansByLoanId = <TData = Common.LoansServiceDeleteV1LoansByLoanIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanId: number;
}, TContext>({ mutationFn: ({ loanId }) => LoansService.deleteV1LoansByLoanId({ loanId }) as unknown as Promise<TData>, ...options });
export const useLoanChargesServiceDeleteV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalId = <TData = Common.LoanChargesServiceDeleteV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanChargeExternalId: string;
  loanExternalId: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanChargeExternalId: string;
  loanExternalId: string;
}, TContext>({ mutationFn: ({ loanChargeExternalId, loanExternalId }) => LoanChargesService.deleteV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalId({ loanChargeExternalId, loanExternalId }) as unknown as Promise<TData>, ...options });
export const useLoanChargesServiceDeleteV1LoansExternalIdByLoanExternalIdChargesByLoanChargeId = <TData = Common.LoanChargesServiceDeleteV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanChargeId: number;
  loanExternalId: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanChargeId: number;
  loanExternalId: string;
}, TContext>({ mutationFn: ({ loanChargeId, loanExternalId }) => LoanChargesService.deleteV1LoansExternalIdByLoanExternalIdChargesByLoanChargeId({ loanChargeId, loanExternalId }) as unknown as Promise<TData>, ...options });
export const useLoanChargesServiceDeleteV1LoansByLoanIdChargesExternalIdByLoanChargeExternalId = <TData = Common.LoanChargesServiceDeleteV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanChargeExternalId: string;
  loanId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanChargeExternalId: string;
  loanId: number;
}, TContext>({ mutationFn: ({ loanChargeExternalId, loanId }) => LoanChargesService.deleteV1LoansByLoanIdChargesExternalIdByLoanChargeExternalId({ loanChargeExternalId, loanId }) as unknown as Promise<TData>, ...options });
export const useLoanChargesServiceDeleteV1LoansByLoanIdChargesByLoanChargeId = <TData = Common.LoanChargesServiceDeleteV1LoansByLoanIdChargesByLoanChargeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanChargeId: number;
  loanId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanChargeId: number;
  loanId: number;
}, TContext>({ mutationFn: ({ loanChargeId, loanId }) => LoanChargesService.deleteV1LoansByLoanIdChargesByLoanChargeId({ loanChargeId, loanId }) as unknown as Promise<TData>, ...options });
export const useLoanInterestPauseServiceDeleteV1LoansExternalIdByLoanExternalIdInterestPausesByVariationId = <TData = Common.LoanInterestPauseServiceDeleteV1LoansExternalIdByLoanExternalIdInterestPausesByVariationIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanExternalId: string;
  variationId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanExternalId: string;
  variationId: number;
}, TContext>({ mutationFn: ({ loanExternalId, variationId }) => LoanInterestPauseService.deleteV1LoansExternalIdByLoanExternalIdInterestPausesByVariationId({ loanExternalId, variationId }) as unknown as Promise<TData>, ...options });
export const useLoanInterestPauseServiceDeleteV1LoansByLoanIdInterestPausesByVariationId = <TData = Common.LoanInterestPauseServiceDeleteV1LoansByLoanIdInterestPausesByVariationIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanId: number;
  variationId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanId: number;
  variationId: number;
}, TContext>({ mutationFn: ({ loanId, variationId }) => LoanInterestPauseService.deleteV1LoansByLoanIdInterestPausesByVariationId({ loanId, variationId }) as unknown as Promise<TData>, ...options });
export const useLoanCollateralServiceDeleteV1LoansByLoanIdCollateralsByCollateralId = <TData = Common.LoanCollateralServiceDeleteV1LoansByLoanIdCollateralsByCollateralIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  collateralId: number;
  loanId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  collateralId: number;
  loanId: number;
}, TContext>({ mutationFn: ({ collateralId, loanId }) => LoanCollateralService.deleteV1LoansByLoanIdCollateralsByCollateralId({ collateralId, loanId }) as unknown as Promise<TData>, ...options });
export const useGuarantorsServiceDeleteV1LoansByLoanIdGuarantorsByGuarantorId = <TData = Common.GuarantorsServiceDeleteV1LoansByLoanIdGuarantorsByGuarantorIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  guarantorFundingId?: number;
  guarantorId: number;
  loanId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  guarantorFundingId?: number;
  guarantorId: number;
  loanId: number;
}, TContext>({ mutationFn: ({ guarantorFundingId, guarantorId, loanId }) => GuarantorsService.deleteV1LoansByLoanIdGuarantorsByGuarantorId({ guarantorFundingId, guarantorId, loanId }) as unknown as Promise<TData>, ...options });
export const useRepaymentWithPostDatedChecksServiceDeleteV1LoansByLoanIdPostdatedchecksByPostDatedCheckId = <TData = Common.RepaymentWithPostDatedChecksServiceDeleteV1LoansByLoanIdPostdatedchecksByPostDatedCheckIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  loanId: number;
  postDatedCheckId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  loanId: number;
  postDatedCheckId: number;
}, TContext>({ mutationFn: ({ loanId, postDatedCheckId }) => RepaymentWithPostDatedChecksService.deleteV1LoansByLoanIdPostdatedchecksByPostDatedCheckId({ loanId, postDatedCheckId }) as unknown as Promise<TData>, ...options });
export const useMakerCheckerOr4EyeFunctionalityServiceDeleteV1MakercheckersByAuditId = <TData = Common.MakerCheckerOr4EyeFunctionalityServiceDeleteV1MakercheckersByAuditIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  auditId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  auditId: number;
}, TContext>({ mutationFn: ({ auditId }) => MakerCheckerOr4EyeFunctionalityService.deleteV1MakercheckersByAuditId({ auditId }) as unknown as Promise<TData>, ...options });
export const usePaymentTypeServiceDeleteV1PaymenttypesByPaymentTypeId = <TData = Common.PaymentTypeServiceDeleteV1PaymenttypesByPaymentTypeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  paymentTypeId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  paymentTypeId: number;
}, TContext>({ mutationFn: ({ paymentTypeId }) => PaymentTypeService.deleteV1PaymenttypesByPaymentTypeId({ paymentTypeId }) as unknown as Promise<TData>, ...options });
export const useProvisioningCategoryServiceDeleteV1ProvisioningcategoryByCategoryId = <TData = Common.ProvisioningCategoryServiceDeleteV1ProvisioningcategoryByCategoryIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  categoryId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  categoryId: number;
}, TContext>({ mutationFn: ({ categoryId }) => ProvisioningCategoryService.deleteV1ProvisioningcategoryByCategoryId({ categoryId }) as unknown as Promise<TData>, ...options });
export const useProvisioningCriteriaServiceDeleteV1ProvisioningcriteriaByCriteriaId = <TData = Common.ProvisioningCriteriaServiceDeleteV1ProvisioningcriteriaByCriteriaIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  criteriaId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  criteriaId: number;
}, TContext>({ mutationFn: ({ criteriaId }) => ProvisioningCriteriaService.deleteV1ProvisioningcriteriaByCriteriaId({ criteriaId }) as unknown as Promise<TData>, ...options });
export const useRecurringDepositAccountServiceDeleteV1RecurringdepositaccountsByAccountId = <TData = Common.RecurringDepositAccountServiceDeleteV1RecurringdepositaccountsByAccountIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountId: number;
}, TContext>({ mutationFn: ({ accountId }) => RecurringDepositAccountService.deleteV1RecurringdepositaccountsByAccountId({ accountId }) as unknown as Promise<TData>, ...options });
export const useRecurringDepositProductServiceDeleteV1RecurringdepositproductsByProductId = <TData = Common.RecurringDepositProductServiceDeleteV1RecurringdepositproductsByProductIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  productId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  productId: number;
}, TContext>({ mutationFn: ({ productId }) => RecurringDepositProductService.deleteV1RecurringdepositproductsByProductId({ productId }) as unknown as Promise<TData>, ...options });
export const useReportMailingJobsServiceDeleteV1ReportmailingjobsByEntityId = <TData = Common.ReportMailingJobsServiceDeleteV1ReportmailingjobsByEntityIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  entityId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  entityId: number;
}, TContext>({ mutationFn: ({ entityId }) => ReportMailingJobsService.deleteV1ReportmailingjobsByEntityId({ entityId }) as unknown as Promise<TData>, ...options });
export const useReportsServiceDeleteV1ReportsById = <TData = Common.ReportsServiceDeleteV1ReportsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
}, TContext>({ mutationFn: ({ id }) => ReportsService.deleteV1ReportsById({ id }) as unknown as Promise<TData>, ...options });
export const useRolesServiceDeleteV1RolesByRoleId = <TData = Common.RolesServiceDeleteV1RolesByRoleIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  roleId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  roleId: number;
}, TContext>({ mutationFn: ({ roleId }) => RolesService.deleteV1RolesByRoleId({ roleId }) as unknown as Promise<TData>, ...options });
export const useSavingsAccountServiceDeleteV1SavingsaccountsExternalIdByExternalId = <TData = Common.SavingsAccountServiceDeleteV1SavingsaccountsExternalIdByExternalIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  externalId: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  externalId: string;
}, TContext>({ mutationFn: ({ externalId }) => SavingsAccountService.deleteV1SavingsaccountsExternalIdByExternalId({ externalId }) as unknown as Promise<TData>, ...options });
export const useSavingsAccountServiceDeleteV1SavingsaccountsByAccountId = <TData = Common.SavingsAccountServiceDeleteV1SavingsaccountsByAccountIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  accountId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  accountId: number;
}, TContext>({ mutationFn: ({ accountId }) => SavingsAccountService.deleteV1SavingsaccountsByAccountId({ accountId }) as unknown as Promise<TData>, ...options });
export const useSavingsChargesServiceDeleteV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeId = <TData = Common.SavingsChargesServiceDeleteV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  savingsAccountChargeId: number;
  savingsAccountId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  savingsAccountChargeId: number;
  savingsAccountId: number;
}, TContext>({ mutationFn: ({ savingsAccountChargeId, savingsAccountId }) => SavingsChargesService.deleteV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeId({ savingsAccountChargeId, savingsAccountId }) as unknown as Promise<TData>, ...options });
export const useSavingsProductServiceDeleteV1SavingsproductsByProductId = <TData = Common.SavingsProductServiceDeleteV1SavingsproductsByProductIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  productId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  productId: number;
}, TContext>({ mutationFn: ({ productId }) => SavingsProductService.deleteV1SavingsproductsByProductId({ productId }) as unknown as Promise<TData>, ...options });
export const useSelfThirdPartyTransferServiceDeleteV1SelfBeneficiariesTptByBeneficiaryId = <TData = Common.SelfThirdPartyTransferServiceDeleteV1SelfBeneficiariesTptByBeneficiaryIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  beneficiaryId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  beneficiaryId: number;
}, TContext>({ mutationFn: ({ beneficiaryId }) => SelfThirdPartyTransferService.deleteV1SelfBeneficiariesTptByBeneficiaryId({ beneficiaryId }) as unknown as Promise<TData>, ...options });
export const useSelfClientServiceDeleteV1SelfClientsByClientIdImages = <TData = Common.SelfClientServiceDeleteV1SelfClientsByClientIdImagesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
}, TContext>({ mutationFn: ({ clientId }) => SelfClientService.deleteV1SelfClientsByClientIdImages({ clientId }) as unknown as Promise<TData>, ...options });
export const useDeviceRegistrationServiceDeleteV1SelfDeviceRegistrationById = <TData = Common.DeviceRegistrationServiceDeleteV1SelfDeviceRegistrationByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: number;
}, TContext>({ mutationFn: ({ id }) => DeviceRegistrationService.deleteV1SelfDeviceRegistrationById({ id }) as unknown as Promise<TData>, ...options });
export const useSelfDividendServiceDeleteV1ShareproductByProductIdDividendByDividendId = <TData = Common.SelfDividendServiceDeleteV1ShareproductByProductIdDividendByDividendIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  dividendId: number;
  productId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  dividendId: number;
  productId: number;
}, TContext>({ mutationFn: ({ dividendId, productId }) => SelfDividendService.deleteV1ShareproductByProductIdDividendByDividendId({ dividendId, productId }) as unknown as Promise<TData>, ...options });
export const useSmsServiceDeleteV1SmsByResourceId = <TData = Common.SmsServiceDeleteV1SmsByResourceIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  resourceId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  resourceId: number;
}, TContext>({ mutationFn: ({ resourceId }) => SmsService.deleteV1SmsByResourceId({ resourceId }) as unknown as Promise<TData>, ...options });
export const useSurveyServiceDeleteV1SurveyBySurveyNameByClientIdByFulfilledId = <TData = Common.SurveyServiceDeleteV1SurveyBySurveyNameByClientIdByFulfilledIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  clientId: number;
  fulfilledId: number;
  surveyName: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  clientId: number;
  fulfilledId: number;
  surveyName: string;
}, TContext>({ mutationFn: ({ clientId, fulfilledId, surveyName }) => SurveyService.deleteV1SurveyBySurveyNameByClientIdByFulfilledId({ clientId, fulfilledId, surveyName }) as unknown as Promise<TData>, ...options });
export const useTellerCashManagementServiceDeleteV1TellersByTellerId = <TData = Common.TellerCashManagementServiceDeleteV1TellersByTellerIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  tellerId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  tellerId: number;
}, TContext>({ mutationFn: ({ tellerId }) => TellerCashManagementService.deleteV1TellersByTellerId({ tellerId }) as unknown as Promise<TData>, ...options });
export const useTellerCashManagementServiceDeleteV1TellersByTellerIdCashiersByCashierId = <TData = Common.TellerCashManagementServiceDeleteV1TellersByTellerIdCashiersByCashierIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  cashierId: number;
  tellerId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  cashierId: number;
  tellerId: number;
}, TContext>({ mutationFn: ({ cashierId, tellerId }) => TellerCashManagementService.deleteV1TellersByTellerIdCashiersByCashierId({ cashierId, tellerId }) as unknown as Promise<TData>, ...options });
export const useUserGeneratedDocumentsServiceDeleteV1TemplatesByTemplateId = <TData = Common.UserGeneratedDocumentsServiceDeleteV1TemplatesByTemplateIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  templateId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  templateId: number;
}, TContext>({ mutationFn: ({ templateId }) => UserGeneratedDocumentsService.deleteV1TemplatesByTemplateId({ templateId }) as unknown as Promise<TData>, ...options });
export const useUsersServiceDeleteV1UsersByUserId = <TData = Common.UsersServiceDeleteV1UsersByUserIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  userId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  userId: number;
}, TContext>({ mutationFn: ({ userId }) => UsersService.deleteV1UsersByUserId({ userId }) as unknown as Promise<TData>, ...options });
export const useCalendarServiceDeleteV1ByEntityTypeByEntityIdCalendarsByCalendarId = <TData = Common.CalendarServiceDeleteV1ByEntityTypeByEntityIdCalendarsByCalendarIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  calendarId: number;
  entityId: number;
  entityType: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  calendarId: number;
  entityId: number;
  entityType: string;
}, TContext>({ mutationFn: ({ calendarId, entityId, entityType }) => CalendarService.deleteV1ByEntityTypeByEntityIdCalendarsByCalendarId({ calendarId, entityId, entityType }) as unknown as Promise<TData>, ...options });
export const useDocumentsServiceDeleteV1ByEntityTypeByEntityIdDocumentsByDocumentId = <TData = Common.DocumentsServiceDeleteV1ByEntityTypeByEntityIdDocumentsByDocumentIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  documentId: number;
  entityId: number;
  entityType: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  documentId: number;
  entityId: number;
  entityType: string;
}, TContext>({ mutationFn: ({ documentId, entityId, entityType }) => DocumentsService.deleteV1ByEntityTypeByEntityIdDocumentsByDocumentId({ documentId, entityId, entityType }) as unknown as Promise<TData>, ...options });
export const useMeetingsServiceDeleteV1ByEntityTypeByEntityIdMeetingsByMeetingId = <TData = Common.MeetingsServiceDeleteV1ByEntityTypeByEntityIdMeetingsByMeetingIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  entityId: number;
  entityType: string;
  meetingId: number;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  entityId: number;
  entityType: string;
  meetingId: number;
}, TContext>({ mutationFn: ({ entityId, entityType, meetingId }) => MeetingsService.deleteV1ByEntityTypeByEntityIdMeetingsByMeetingId({ entityId, entityType, meetingId }) as unknown as Promise<TData>, ...options });
export const useNotesServiceDeleteV1ByResourceTypeByResourceIdNotesByNoteId = <TData = Common.NotesServiceDeleteV1ByResourceTypeByResourceIdNotesByNoteIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  noteId: number;
  resourceId: number;
  resourceType: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  noteId: number;
  resourceId: number;
  resourceType: string;
}, TContext>({ mutationFn: ({ noteId, resourceId, resourceType }) => NotesService.deleteV1ByResourceTypeByResourceIdNotesByNoteId({ noteId, resourceId, resourceType }) as unknown as Promise<TData>, ...options });
