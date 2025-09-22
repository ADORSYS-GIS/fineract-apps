// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { type QueryClient } from "@tanstack/react-query";
import { AccountNumberFormatService, AccountTransfersService, AccountingClosureService, AccountingRulesService, AdhocQueryApiService, AuditsService, BulkImportService, BulkLoansService, BusinessDateManagementService, BusinessStepConfigurationService, CacheService, CalendarService, CashierJournalsService, CashiersService, CentersService, ChargesService, ClientChargesService, ClientCollateralManagementService, ClientFamilyMemberService, ClientIdentifierService, ClientService, ClientTransactionService, ClientsAddressService, CodeValuesService, CodesService, CollateralManagementService, CreditBureauConfigurationService, CurrencyService, DataTablesService, DefaultService, DelinquencyRangeAndBucketsManagementService, DepositAccountOnHoldFundTransactionsService, DeviceRegistrationService, DocumentsService, EntityDataTableService, EntityFieldConfigurationService, ExternalAssetOwnerLoanProductAttributesService, ExternalAssetOwnersService, ExternalEventConfigurationService, ExternalServicesService, FetchAuthenticatedUserDetailsService, FineractEntityService, FixedDepositAccountService, FixedDepositAccountTransactionsService, FixedDepositProductService, FloatingRatesService, FundsService, GeneralLedgerAccountService, GlobalConfigurationService, GroupsLevelService, GroupsService, GuarantorsService, HolidaysService, HooksService, InterOperationService, InterestRateChartService, InterestRateSlabAKAInterestBandsService, JournalEntriesService, LikelihoodService, ListReportMailingJobHistoryService, LoanAccountLockService, LoanBuyDownFeesService, LoanCapitalizedIncomeService, LoanChargesService, LoanCobCatchUpService, LoanCollateralManagementService, LoanCollateralService, LoanDisbursementDetailsService, LoanInterestPauseService, LoanProductsService, LoanTransactionsService, LoansPointInTimeService, LoansService, MakerCheckerOr4EyeFunctionalityService, MappingFinancialActivitiesToAccountsService, MeetingsService, MixMappingService, MixReportService, MixTaxonomyService, NotesService, NotificationService, OfficesService, PasswordPreferencesService, PaymentTypeService, PermissionsService, PocketService, PovertyLineService, ProductMixService, ProductsService, ProgressiveLoanService, ProvisioningCategoryService, ProvisioningCriteriaService, ProvisioningEntriesService, RateService, RecurringDepositAccountService, RecurringDepositAccountTransactionsService, RecurringDepositProductService, RepaymentWithPostDatedChecksService, ReportMailingJobsService, ReportsService, RescheduleLoansService, RolesService, RunReportsService, SavingsAccountService, SavingsAccountTransactionsService, SavingsChargesService, SavingsProductService, SchedulerJobService, SchedulerService, ScoreCardService, SearchApiService, SelfAccountTransferService, SelfClientService, SelfDividendService, SelfLoanProductsService, SelfLoansService, SelfRunReportService, SelfSavingsAccountService, SelfSavingsProductsService, SelfScoreCardService, SelfShareAccountsService, SelfShareProductsService, SelfSpmService, SelfThirdPartyTransferService, SelfUserDetailsService, ShareAccountService, SmsService, SpmApiLookUpTableService, SpmSurveysService, StaffService, StandingInstructionsHistoryService, StandingInstructionsService, SurveyService, TaxComponentsService, TaxGroupService, TellerCashManagementService, TwoFactorService, UserGeneratedDocumentsService, UsersService, WorkingDaysService } from "../requests/services.gen";
import { DateParam, TransactionType } from "../requests/types.gen";
import * as Common from "./common";
export const prefetchUseDefaultServiceGetApplicationWadl = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetApplicationWadlKeyFn(), queryFn: () => DefaultService.getApplicationWadl() });
export const prefetchUseDefaultServiceGetApplicationWadlByPath = (queryClient: QueryClient, { path }: {
  path: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetApplicationWadlByPathKeyFn({ path }), queryFn: () => DefaultService.getApplicationWadlByPath({ path }) });
export const prefetchUseDefaultServiceGetV1CreditBureauIntegrationCreditReportByCreditBureauId = (queryClient: QueryClient, { creditBureauId }: {
  creditBureauId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1CreditBureauIntegrationCreditReportByCreditBureauIdKeyFn({ creditBureauId }), queryFn: () => DefaultService.getV1CreditBureauIntegrationCreditReportByCreditBureauId({ creditBureauId }) });
export const prefetchUseDefaultServiceGetV1Echo = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1EchoKeyFn(), queryFn: () => DefaultService.getV1Echo() });
export const prefetchUseDefaultServiceGetV1Email = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1EmailKeyFn(), queryFn: () => DefaultService.getV1Email() });
export const prefetchUseDefaultServiceGetV1EmailCampaign = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1EmailCampaignKeyFn(), queryFn: () => DefaultService.getV1EmailCampaign() });
export const prefetchUseDefaultServiceGetV1EmailCampaignTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1EmailCampaignTemplateKeyFn(), queryFn: () => DefaultService.getV1EmailCampaignTemplate() });
export const prefetchUseDefaultServiceGetV1EmailCampaignTemplateByResourceId = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1EmailCampaignTemplateByResourceIdKeyFn({ resourceId }), queryFn: () => DefaultService.getV1EmailCampaignTemplateByResourceId({ resourceId }) });
export const prefetchUseDefaultServiceGetV1EmailCampaignByResourceId = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1EmailCampaignByResourceIdKeyFn({ resourceId }), queryFn: () => DefaultService.getV1EmailCampaignByResourceId({ resourceId }) });
export const prefetchUseDefaultServiceGetV1EmailConfiguration = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1EmailConfigurationKeyFn(), queryFn: () => DefaultService.getV1EmailConfiguration() });
export const prefetchUseDefaultServiceGetV1EmailFailedEmail = (queryClient: QueryClient, { limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1EmailFailedEmailKeyFn({ limit, offset, orderBy, sortOrder }), queryFn: () => DefaultService.getV1EmailFailedEmail({ limit, offset, orderBy, sortOrder }) });
export const prefetchUseDefaultServiceGetV1EmailMessageByStatus = (queryClient: QueryClient, { dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }: {
  dateFormat?: string;
  fromDate?: DateParam;
  limit?: number;
  locale?: string;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  status?: number;
  toDate?: DateParam;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1EmailMessageByStatusKeyFn({ dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }), queryFn: () => DefaultService.getV1EmailMessageByStatus({ dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }) });
export const prefetchUseDefaultServiceGetV1EmailPendingEmail = (queryClient: QueryClient, { limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1EmailPendingEmailKeyFn({ limit, offset, orderBy, sortOrder }), queryFn: () => DefaultService.getV1EmailPendingEmail({ limit, offset, orderBy, sortOrder }) });
export const prefetchUseDefaultServiceGetV1EmailSentEmail = (queryClient: QueryClient, { limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1EmailSentEmailKeyFn({ limit, offset, orderBy, sortOrder }), queryFn: () => DefaultService.getV1EmailSentEmail({ limit, offset, orderBy, sortOrder }) });
export const prefetchUseDefaultServiceGetV1EmailByResourceId = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1EmailByResourceIdKeyFn({ resourceId }), queryFn: () => DefaultService.getV1EmailByResourceId({ resourceId }) });
export const prefetchUseDefaultServiceGetV1InternalClientByClientIdAudit = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1InternalClientByClientIdAuditKeyFn({ clientId }), queryFn: () => DefaultService.getV1InternalClientByClientIdAudit({ clientId }) });
export const prefetchUseDefaultServiceGetV1InternalCobPartitionsByPartitionSize = (queryClient: QueryClient, { partitionSize }: {
  partitionSize: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1InternalCobPartitionsByPartitionSizeKeyFn({ partitionSize }), queryFn: () => DefaultService.getV1InternalCobPartitionsByPartitionSize({ partitionSize }) });
export const prefetchUseDefaultServiceGetV1InternalExternalevents = (queryClient: QueryClient, { aggregateRootId, category, idempotencyKey, type }: {
  aggregateRootId?: number;
  category?: string;
  idempotencyKey?: string;
  type?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1InternalExternaleventsKeyFn({ aggregateRootId, category, idempotencyKey, type }), queryFn: () => DefaultService.getV1InternalExternalevents({ aggregateRootId, category, idempotencyKey, type }) });
export const prefetchUseDefaultServiceGetV1InternalLoanStatusByStatusId = (queryClient: QueryClient, { statusId }: {
  statusId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1InternalLoanStatusByStatusIdKeyFn({ statusId }), queryFn: () => DefaultService.getV1InternalLoanStatusByStatusId({ statusId }) });
export const prefetchUseDefaultServiceGetV1InternalLoanByLoanIdAdvancedPaymentAllocationRules = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1InternalLoanByLoanIdAdvancedPaymentAllocationRulesKeyFn({ loanId }), queryFn: () => DefaultService.getV1InternalLoanByLoanIdAdvancedPaymentAllocationRules({ loanId }) });
export const prefetchUseDefaultServiceGetV1InternalLoanByLoanIdAudit = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1InternalLoanByLoanIdAuditKeyFn({ loanId }), queryFn: () => DefaultService.getV1InternalLoanByLoanIdAudit({ loanId }) });
export const prefetchUseDefaultServiceGetV1InternalLoanByLoanIdTransactionByTransactionIdAudit = (queryClient: QueryClient, { loanId, transactionId }: {
  loanId: number;
  transactionId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1InternalLoanByLoanIdTransactionByTransactionIdAuditKeyFn({ loanId, transactionId }), queryFn: () => DefaultService.getV1InternalLoanByLoanIdTransactionByTransactionIdAudit({ loanId, transactionId }) });
export const prefetchUseDefaultServiceGetV1Officetransactions = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1OfficetransactionsKeyFn(), queryFn: () => DefaultService.getV1Officetransactions() });
export const prefetchUseDefaultServiceGetV1OfficetransactionsTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1OfficetransactionsTemplateKeyFn(), queryFn: () => DefaultService.getV1OfficetransactionsTemplate() });
export const prefetchUseDefaultServiceGetV1Smscampaigns = (queryClient: QueryClient, { limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1SmscampaignsKeyFn({ limit, offset, orderBy, sortOrder }), queryFn: () => DefaultService.getV1Smscampaigns({ limit, offset, orderBy, sortOrder }) });
export const prefetchUseDefaultServiceGetV1SmscampaignsTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1SmscampaignsTemplateKeyFn(), queryFn: () => DefaultService.getV1SmscampaignsTemplate() });
export const prefetchUseDefaultServiceGetV1SmscampaignsByResourceId = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1SmscampaignsByResourceIdKeyFn({ resourceId }), queryFn: () => DefaultService.getV1SmscampaignsByResourceId({ resourceId }) });
export const prefetchUseDefaultServiceGetV1TwofactorConfigure = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1TwofactorConfigureKeyFn(), queryFn: () => DefaultService.getV1TwofactorConfigure() });
export const prefetchUseDefaultServiceGetV1ByEntityByEntityIdImages = (queryClient: QueryClient, { accept, entity, entityId, maxHeight, maxWidth, output }: {
  accept?: string;
  entity: string;
  entityId: number;
  maxHeight?: number;
  maxWidth?: number;
  output?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDefaultServiceGetV1ByEntityByEntityIdImagesKeyFn({ accept, entity, entityId, maxHeight, maxWidth, output }), queryFn: () => DefaultService.getV1ByEntityByEntityIdImages({ accept, entity, entityId, maxHeight, maxWidth, output }) });
export const prefetchUseCreditBureauConfigurationServiceGetV1CreditBureauConfiguration = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationKeyFn(), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfiguration() });
export const prefetchUseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationConfigByOrganisationCreditBureauId = (queryClient: QueryClient, { organisationCreditBureauId }: {
  organisationCreditBureauId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationConfigByOrganisationCreditBureauIdKeyFn({ organisationCreditBureauId }), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationConfigByOrganisationCreditBureauId({ organisationCreditBureauId }) });
export const prefetchUseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProduct = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductKeyFn(), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationLoanProduct() });
export const prefetchUseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductByLoanProductId = (queryClient: QueryClient, { loanProductId }: {
  loanProductId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductByLoanProductIdKeyFn({ loanProductId }), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationLoanProductByLoanProductId({ loanProductId }) });
export const prefetchUseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationMappings = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationMappingsKeyFn(), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationMappings() });
export const prefetchUseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationOrganisationCreditBureau = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationOrganisationCreditBureauKeyFn(), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationOrganisationCreditBureau() });
export const prefetchUseAccountingRulesServiceGetV1Accountingrules = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseAccountingRulesServiceGetV1AccountingrulesKeyFn(), queryFn: () => AccountingRulesService.getV1Accountingrules() });
export const prefetchUseAccountingRulesServiceGetV1AccountingrulesTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseAccountingRulesServiceGetV1AccountingrulesTemplateKeyFn(), queryFn: () => AccountingRulesService.getV1AccountingrulesTemplate() });
export const prefetchUseAccountingRulesServiceGetV1AccountingrulesByAccountingRuleId = (queryClient: QueryClient, { accountingRuleId }: {
  accountingRuleId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseAccountingRulesServiceGetV1AccountingrulesByAccountingRuleIdKeyFn({ accountingRuleId }), queryFn: () => AccountingRulesService.getV1AccountingrulesByAccountingRuleId({ accountingRuleId }) });
export const prefetchUseAccountNumberFormatServiceGetV1Accountnumberformats = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseAccountNumberFormatServiceGetV1AccountnumberformatsKeyFn(), queryFn: () => AccountNumberFormatService.getV1Accountnumberformats() });
export const prefetchUseAccountNumberFormatServiceGetV1AccountnumberformatsTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseAccountNumberFormatServiceGetV1AccountnumberformatsTemplateKeyFn(), queryFn: () => AccountNumberFormatService.getV1AccountnumberformatsTemplate() });
export const prefetchUseAccountNumberFormatServiceGetV1AccountnumberformatsByAccountNumberFormatId = (queryClient: QueryClient, { accountNumberFormatId }: {
  accountNumberFormatId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseAccountNumberFormatServiceGetV1AccountnumberformatsByAccountNumberFormatIdKeyFn({ accountNumberFormatId }), queryFn: () => AccountNumberFormatService.getV1AccountnumberformatsByAccountNumberFormatId({ accountNumberFormatId }) });
export const prefetchUseShareAccountServiceGetV1AccountsByType = (queryClient: QueryClient, { limit, offset, type }: {
  limit?: number;
  offset?: number;
  type: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseShareAccountServiceGetV1AccountsByTypeKeyFn({ limit, offset, type }), queryFn: () => ShareAccountService.getV1AccountsByType({ limit, offset, type }) });
export const prefetchUseShareAccountServiceGetV1AccountsByTypeDownloadtemplate = (queryClient: QueryClient, { dateFormat, officeId, type }: {
  dateFormat?: string;
  officeId?: number;
  type: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseShareAccountServiceGetV1AccountsByTypeDownloadtemplateKeyFn({ dateFormat, officeId, type }), queryFn: () => ShareAccountService.getV1AccountsByTypeDownloadtemplate({ dateFormat, officeId, type }) });
export const prefetchUseShareAccountServiceGetV1AccountsByTypeTemplate = (queryClient: QueryClient, { clientId, productId, type }: {
  clientId?: number;
  productId?: number;
  type: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseShareAccountServiceGetV1AccountsByTypeTemplateKeyFn({ clientId, productId, type }), queryFn: () => ShareAccountService.getV1AccountsByTypeTemplate({ clientId, productId, type }) });
export const prefetchUseShareAccountServiceGetV1AccountsByTypeByAccountId = (queryClient: QueryClient, { accountId, type }: {
  accountId: number;
  type: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseShareAccountServiceGetV1AccountsByTypeByAccountIdKeyFn({ accountId, type }), queryFn: () => ShareAccountService.getV1AccountsByTypeByAccountId({ accountId, type }) });
export const prefetchUseAccountTransfersServiceGetV1Accounttransfers = (queryClient: QueryClient, { accountDetailId, externalId, limit, offset, orderBy, sortOrder }: {
  accountDetailId?: number;
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseAccountTransfersServiceGetV1AccounttransfersKeyFn({ accountDetailId, externalId, limit, offset, orderBy, sortOrder }), queryFn: () => AccountTransfersService.getV1Accounttransfers({ accountDetailId, externalId, limit, offset, orderBy, sortOrder }) });
export const prefetchUseAccountTransfersServiceGetV1AccounttransfersTemplate = (queryClient: QueryClient, { fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }: {
  fromAccountId?: number;
  fromAccountType?: number;
  fromClientId?: number;
  fromOfficeId?: number;
  toAccountId?: number;
  toAccountType?: number;
  toClientId?: number;
  toOfficeId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseAccountTransfersServiceGetV1AccounttransfersTemplateKeyFn({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }), queryFn: () => AccountTransfersService.getV1AccounttransfersTemplate({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }) });
export const prefetchUseAccountTransfersServiceGetV1AccounttransfersTemplateRefundByTransfer = (queryClient: QueryClient, { fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }: {
  fromAccountId?: number;
  fromAccountType?: number;
  fromClientId?: number;
  fromOfficeId?: number;
  toAccountId?: number;
  toAccountType?: number;
  toClientId?: number;
  toOfficeId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseAccountTransfersServiceGetV1AccounttransfersTemplateRefundByTransferKeyFn({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }), queryFn: () => AccountTransfersService.getV1AccounttransfersTemplateRefundByTransfer({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }) });
export const prefetchUseAccountTransfersServiceGetV1AccounttransfersByTransferId = (queryClient: QueryClient, { transferId }: {
  transferId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseAccountTransfersServiceGetV1AccounttransfersByTransferIdKeyFn({ transferId }), queryFn: () => AccountTransfersService.getV1AccounttransfersByTransferId({ transferId }) });
export const prefetchUseAdhocQueryApiServiceGetV1Adhocquery = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseAdhocQueryApiServiceGetV1AdhocqueryKeyFn(), queryFn: () => AdhocQueryApiService.getV1Adhocquery() });
export const prefetchUseAdhocQueryApiServiceGetV1AdhocqueryTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseAdhocQueryApiServiceGetV1AdhocqueryTemplateKeyFn(), queryFn: () => AdhocQueryApiService.getV1AdhocqueryTemplate() });
export const prefetchUseAdhocQueryApiServiceGetV1AdhocqueryByAdHocId = (queryClient: QueryClient, { adHocId }: {
  adHocId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseAdhocQueryApiServiceGetV1AdhocqueryByAdHocIdKeyFn({ adHocId }), queryFn: () => AdhocQueryApiService.getV1AdhocqueryByAdHocId({ adHocId }) });
export const prefetchUseAuditsServiceGetV1Audits = (queryClient: QueryClient, { actionName, checkerDateTimeFrom, checkerDateTimeTo, checkerId, clientId, dateFormat, entityName, groupId, limit, loanId, locale, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, offset, orderBy, paged, processingResult, resourceId, savingsAccountId, sortOrder, status }: {
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
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseAuditsServiceGetV1AuditsKeyFn({ actionName, checkerDateTimeFrom, checkerDateTimeTo, checkerId, clientId, dateFormat, entityName, groupId, limit, loanId, locale, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, offset, orderBy, paged, processingResult, resourceId, savingsAccountId, sortOrder, status }), queryFn: () => AuditsService.getV1Audits({ actionName, checkerDateTimeFrom, checkerDateTimeTo, checkerId, clientId, dateFormat, entityName, groupId, limit, loanId, locale, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, offset, orderBy, paged, processingResult, resourceId, savingsAccountId, sortOrder, status }) });
export const prefetchUseAuditsServiceGetV1AuditsSearchtemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseAuditsServiceGetV1AuditsSearchtemplateKeyFn(), queryFn: () => AuditsService.getV1AuditsSearchtemplate() });
export const prefetchUseAuditsServiceGetV1AuditsByAuditId = (queryClient: QueryClient, { auditId }: {
  auditId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseAuditsServiceGetV1AuditsByAuditIdKeyFn({ auditId }), queryFn: () => AuditsService.getV1AuditsByAuditId({ auditId }) });
export const prefetchUseBusinessDateManagementServiceGetV1Businessdate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseBusinessDateManagementServiceGetV1BusinessdateKeyFn(), queryFn: () => BusinessDateManagementService.getV1Businessdate() });
export const prefetchUseBusinessDateManagementServiceGetV1BusinessdateByType = (queryClient: QueryClient, { type }: {
  type: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseBusinessDateManagementServiceGetV1BusinessdateByTypeKeyFn({ type }), queryFn: () => BusinessDateManagementService.getV1BusinessdateByType({ type }) });
export const prefetchUseCacheServiceGetV1Caches = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseCacheServiceGetV1CachesKeyFn(), queryFn: () => CacheService.getV1Caches() });
export const prefetchUseCashiersServiceGetV1Cashiers = (queryClient: QueryClient, { date, officeId, staffId, tellerId }: {
  date?: string;
  officeId?: number;
  staffId?: number;
  tellerId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseCashiersServiceGetV1CashiersKeyFn({ date, officeId, staffId, tellerId }), queryFn: () => CashiersService.getV1Cashiers({ date, officeId, staffId, tellerId }) });
export const prefetchUseCashierJournalsServiceGetV1Cashiersjournal = (queryClient: QueryClient, { cashierId, dateRange, officeId, tellerId }: {
  cashierId?: number;
  dateRange?: string;
  officeId?: number;
  tellerId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseCashierJournalsServiceGetV1CashiersjournalKeyFn({ cashierId, dateRange, officeId, tellerId }), queryFn: () => CashierJournalsService.getV1Cashiersjournal({ cashierId, dateRange, officeId, tellerId }) });
export const prefetchUseCentersServiceGetV1Centers = (queryClient: QueryClient, { dateFormat, externalId, limit, locale, meetingDate, name, officeId, offset, orderBy, paged, sortOrder, staffId, underHierarchy }: {
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
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseCentersServiceGetV1CentersKeyFn({ dateFormat, externalId, limit, locale, meetingDate, name, officeId, offset, orderBy, paged, sortOrder, staffId, underHierarchy }), queryFn: () => CentersService.getV1Centers({ dateFormat, externalId, limit, locale, meetingDate, name, officeId, offset, orderBy, paged, sortOrder, staffId, underHierarchy }) });
export const prefetchUseCentersServiceGetV1CentersDownloadtemplate = (queryClient: QueryClient, { dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseCentersServiceGetV1CentersDownloadtemplateKeyFn({ dateFormat, officeId, staffId }), queryFn: () => CentersService.getV1CentersDownloadtemplate({ dateFormat, officeId, staffId }) });
export const prefetchUseCentersServiceGetV1CentersTemplate = (queryClient: QueryClient, { command, officeId, staffInSelectedOfficeOnly }: {
  command?: string;
  officeId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseCentersServiceGetV1CentersTemplateKeyFn({ command, officeId, staffInSelectedOfficeOnly }), queryFn: () => CentersService.getV1CentersTemplate({ command, officeId, staffInSelectedOfficeOnly }) });
export const prefetchUseCentersServiceGetV1CentersByCenterId = (queryClient: QueryClient, { centerId, staffInSelectedOfficeOnly }: {
  centerId: number;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.prefetchQuery({ queryKey: Common.UseCentersServiceGetV1CentersByCenterIdKeyFn({ centerId, staffInSelectedOfficeOnly }), queryFn: () => CentersService.getV1CentersByCenterId({ centerId, staffInSelectedOfficeOnly }) });
export const prefetchUseCentersServiceGetV1CentersByCenterIdAccounts = (queryClient: QueryClient, { centerId }: {
  centerId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseCentersServiceGetV1CentersByCenterIdAccountsKeyFn({ centerId }), queryFn: () => CentersService.getV1CentersByCenterIdAccounts({ centerId }) });
export const prefetchUseChargesServiceGetV1Charges = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseChargesServiceGetV1ChargesKeyFn(), queryFn: () => ChargesService.getV1Charges() });
export const prefetchUseChargesServiceGetV1ChargesTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseChargesServiceGetV1ChargesTemplateKeyFn(), queryFn: () => ChargesService.getV1ChargesTemplate() });
export const prefetchUseChargesServiceGetV1ChargesByChargeId = (queryClient: QueryClient, { chargeId }: {
  chargeId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseChargesServiceGetV1ChargesByChargeIdKeyFn({ chargeId }), queryFn: () => ChargesService.getV1ChargesByChargeId({ chargeId }) });
export const prefetchUseClientsAddressServiceGetV1ClientAddressesTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseClientsAddressServiceGetV1ClientAddressesTemplateKeyFn(), queryFn: () => ClientsAddressService.getV1ClientAddressesTemplate() });
export const prefetchUseClientsAddressServiceGetV1ClientByClientidAddresses = (queryClient: QueryClient, { clientid, status, type }: {
  clientid: number;
  status?: string;
  type?: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientsAddressServiceGetV1ClientByClientidAddressesKeyFn({ clientid, status, type }), queryFn: () => ClientsAddressService.getV1ClientByClientidAddresses({ clientid, status, type }) });
export const prefetchUseClientServiceGetV1Clients = (queryClient: QueryClient, { displayName, externalId, firstName, lastName, legalForm, limit, officeId, offset, orderBy, orphansOnly, sortOrder, status, underHierarchy }: {
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
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseClientServiceGetV1ClientsKeyFn({ displayName, externalId, firstName, lastName, legalForm, limit, officeId, offset, orderBy, orphansOnly, sortOrder, status, underHierarchy }), queryFn: () => ClientService.getV1Clients({ displayName, externalId, firstName, lastName, legalForm, limit, officeId, offset, orderBy, orphansOnly, sortOrder, status, underHierarchy }) });
export const prefetchUseClientServiceGetV1ClientsDownloadtemplate = (queryClient: QueryClient, { dateFormat, legalFormType, officeId, staffId }: {
  dateFormat?: string;
  legalFormType?: string;
  officeId?: number;
  staffId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseClientServiceGetV1ClientsDownloadtemplateKeyFn({ dateFormat, legalFormType, officeId, staffId }), queryFn: () => ClientService.getV1ClientsDownloadtemplate({ dateFormat, legalFormType, officeId, staffId }) });
export const prefetchUseClientServiceGetV1ClientsExternalIdByExternalId = (queryClient: QueryClient, { externalId, staffInSelectedOfficeOnly }: {
  externalId: string;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientServiceGetV1ClientsExternalIdByExternalIdKeyFn({ externalId, staffInSelectedOfficeOnly }), queryFn: () => ClientService.getV1ClientsExternalIdByExternalId({ externalId, staffInSelectedOfficeOnly }) });
export const prefetchUseClientServiceGetV1ClientsExternalIdByExternalIdAccounts = (queryClient: QueryClient, { externalId }: {
  externalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientServiceGetV1ClientsExternalIdByExternalIdAccountsKeyFn({ externalId }), queryFn: () => ClientService.getV1ClientsExternalIdByExternalIdAccounts({ externalId }) });
export const prefetchUseClientServiceGetV1ClientsExternalIdByExternalIdObligeedetails = (queryClient: QueryClient, { externalId }: {
  externalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientServiceGetV1ClientsExternalIdByExternalIdObligeedetailsKeyFn({ externalId }), queryFn: () => ClientService.getV1ClientsExternalIdByExternalIdObligeedetails({ externalId }) });
export const prefetchUseClientServiceGetV1ClientsExternalIdByExternalIdTransferproposaldate = (queryClient: QueryClient, { externalId }: {
  externalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientServiceGetV1ClientsExternalIdByExternalIdTransferproposaldateKeyFn({ externalId }), queryFn: () => ClientService.getV1ClientsExternalIdByExternalIdTransferproposaldate({ externalId }) });
export const prefetchUseClientServiceGetV1ClientsTemplate = (queryClient: QueryClient, { commandParam, officeId, staffInSelectedOfficeOnly }: {
  commandParam?: string;
  officeId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseClientServiceGetV1ClientsTemplateKeyFn({ commandParam, officeId, staffInSelectedOfficeOnly }), queryFn: () => ClientService.getV1ClientsTemplate({ commandParam, officeId, staffInSelectedOfficeOnly }) });
export const prefetchUseClientServiceGetV1ClientsByClientId = (queryClient: QueryClient, { clientId, staffInSelectedOfficeOnly }: {
  clientId: number;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientServiceGetV1ClientsByClientIdKeyFn({ clientId, staffInSelectedOfficeOnly }), queryFn: () => ClientService.getV1ClientsByClientId({ clientId, staffInSelectedOfficeOnly }) });
export const prefetchUseClientServiceGetV1ClientsByClientIdAccounts = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientServiceGetV1ClientsByClientIdAccountsKeyFn({ clientId }), queryFn: () => ClientService.getV1ClientsByClientIdAccounts({ clientId }) });
export const prefetchUseClientServiceGetV1ClientsByClientIdObligeedetails = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientServiceGetV1ClientsByClientIdObligeedetailsKeyFn({ clientId }), queryFn: () => ClientService.getV1ClientsByClientIdObligeedetails({ clientId }) });
export const prefetchUseClientServiceGetV1ClientsByClientIdTransferproposaldate = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientServiceGetV1ClientsByClientIdTransferproposaldateKeyFn({ clientId }), queryFn: () => ClientService.getV1ClientsByClientIdTransferproposaldate({ clientId }) });
export const prefetchUseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactions = (queryClient: QueryClient, { clientExternalId, limit, offset }: {
  clientExternalId: string;
  limit?: number;
  offset?: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsKeyFn({ clientExternalId, limit, offset }), queryFn: () => ClientTransactionService.getV1ClientsExternalIdByClientExternalIdTransactions({ clientExternalId, limit, offset }) });
export const prefetchUseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalId = (queryClient: QueryClient, { clientExternalId, transactionExternalId }: {
  clientExternalId: string;
  transactionExternalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalIdKeyFn({ clientExternalId, transactionExternalId }), queryFn: () => ClientTransactionService.getV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalId({ clientExternalId, transactionExternalId }) });
export const prefetchUseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsByTransactionId = (queryClient: QueryClient, { clientExternalId, transactionId }: {
  clientExternalId: string;
  transactionId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsByTransactionIdKeyFn({ clientExternalId, transactionId }), queryFn: () => ClientTransactionService.getV1ClientsExternalIdByClientExternalIdTransactionsByTransactionId({ clientExternalId, transactionId }) });
export const prefetchUseClientTransactionServiceGetV1ClientsByClientIdTransactions = (queryClient: QueryClient, { clientId, limit, offset }: {
  clientId: number;
  limit?: number;
  offset?: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientTransactionServiceGetV1ClientsByClientIdTransactionsKeyFn({ clientId, limit, offset }), queryFn: () => ClientTransactionService.getV1ClientsByClientIdTransactions({ clientId, limit, offset }) });
export const prefetchUseClientTransactionServiceGetV1ClientsByClientIdTransactionsExternalIdByTransactionExternalId = (queryClient: QueryClient, { clientId, transactionExternalId }: {
  clientId: number;
  transactionExternalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientTransactionServiceGetV1ClientsByClientIdTransactionsExternalIdByTransactionExternalIdKeyFn({ clientId, transactionExternalId }), queryFn: () => ClientTransactionService.getV1ClientsByClientIdTransactionsExternalIdByTransactionExternalId({ clientId, transactionExternalId }) });
export const prefetchUseClientTransactionServiceGetV1ClientsByClientIdTransactionsByTransactionId = (queryClient: QueryClient, { clientId, transactionId }: {
  clientId: number;
  transactionId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientTransactionServiceGetV1ClientsByClientIdTransactionsByTransactionIdKeyFn({ clientId, transactionId }), queryFn: () => ClientTransactionService.getV1ClientsByClientIdTransactionsByTransactionId({ clientId, transactionId }) });
export const prefetchUseClientChargesServiceGetV1ClientsByClientIdCharges = (queryClient: QueryClient, { chargeStatus, clientId, limit, offset, pendingPayment }: {
  chargeStatus?: string;
  clientId: number;
  limit?: number;
  offset?: number;
  pendingPayment?: boolean;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientChargesServiceGetV1ClientsByClientIdChargesKeyFn({ chargeStatus, clientId, limit, offset, pendingPayment }), queryFn: () => ClientChargesService.getV1ClientsByClientIdCharges({ chargeStatus, clientId, limit, offset, pendingPayment }) });
export const prefetchUseClientChargesServiceGetV1ClientsByClientIdChargesTemplate = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientChargesServiceGetV1ClientsByClientIdChargesTemplateKeyFn({ clientId }), queryFn: () => ClientChargesService.getV1ClientsByClientIdChargesTemplate({ clientId }) });
export const prefetchUseClientChargesServiceGetV1ClientsByClientIdChargesByChargeId = (queryClient: QueryClient, { chargeId, clientId }: {
  chargeId: number;
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientChargesServiceGetV1ClientsByClientIdChargesByChargeIdKeyFn({ chargeId, clientId }), queryFn: () => ClientChargesService.getV1ClientsByClientIdChargesByChargeId({ chargeId, clientId }) });
export const prefetchUseClientCollateralManagementServiceGetV1ClientsByClientIdCollaterals = (queryClient: QueryClient, { clientId, prodId }: {
  clientId: number;
  prodId?: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsKeyFn({ clientId, prodId }), queryFn: () => ClientCollateralManagementService.getV1ClientsByClientIdCollaterals({ clientId, prodId }) });
export const prefetchUseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsTemplate = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsTemplateKeyFn({ clientId }), queryFn: () => ClientCollateralManagementService.getV1ClientsByClientIdCollateralsTemplate({ clientId }) });
export const prefetchUseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsByClientCollateralId = (queryClient: QueryClient, { clientCollateralId, clientId }: {
  clientCollateralId: number;
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsByClientCollateralIdKeyFn({ clientCollateralId, clientId }), queryFn: () => ClientCollateralManagementService.getV1ClientsByClientIdCollateralsByClientCollateralId({ clientCollateralId, clientId }) });
export const prefetchUseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembers = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersKeyFn({ clientId }), queryFn: () => ClientFamilyMemberService.getV1ClientsByClientIdFamilymembers({ clientId }) });
export const prefetchUseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersTemplate = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersTemplateKeyFn({ clientId }), queryFn: () => ClientFamilyMemberService.getV1ClientsByClientIdFamilymembersTemplate({ clientId }) });
export const prefetchUseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersByFamilyMemberId = (queryClient: QueryClient, { clientId, familyMemberId }: {
  clientId: number;
  familyMemberId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersByFamilyMemberIdKeyFn({ clientId, familyMemberId }), queryFn: () => ClientFamilyMemberService.getV1ClientsByClientIdFamilymembersByFamilyMemberId({ clientId, familyMemberId }) });
export const prefetchUseClientIdentifierServiceGetV1ClientsByClientIdIdentifiers = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersKeyFn({ clientId }), queryFn: () => ClientIdentifierService.getV1ClientsByClientIdIdentifiers({ clientId }) });
export const prefetchUseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersTemplate = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersTemplateKeyFn({ clientId }), queryFn: () => ClientIdentifierService.getV1ClientsByClientIdIdentifiersTemplate({ clientId }) });
export const prefetchUseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersByIdentifierId = (queryClient: QueryClient, { clientId, identifierId }: {
  clientId: number;
  identifierId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersByIdentifierIdKeyFn({ clientId, identifierId }), queryFn: () => ClientIdentifierService.getV1ClientsByClientIdIdentifiersByIdentifierId({ clientId, identifierId }) });
export const prefetchUseCodesServiceGetV1Codes = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseCodesServiceGetV1CodesKeyFn(), queryFn: () => CodesService.getV1Codes() });
export const prefetchUseCodesServiceGetV1CodesByCodeId = (queryClient: QueryClient, { codeId }: {
  codeId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseCodesServiceGetV1CodesByCodeIdKeyFn({ codeId }), queryFn: () => CodesService.getV1CodesByCodeId({ codeId }) });
export const prefetchUseCodeValuesServiceGetV1CodesByCodeIdCodevalues = (queryClient: QueryClient, { codeId }: {
  codeId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseCodeValuesServiceGetV1CodesByCodeIdCodevaluesKeyFn({ codeId }), queryFn: () => CodeValuesService.getV1CodesByCodeIdCodevalues({ codeId }) });
export const prefetchUseCodeValuesServiceGetV1CodesByCodeIdCodevaluesByCodeValueId = (queryClient: QueryClient, { codeId, codeValueId }: {
  codeId: number;
  codeValueId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseCodeValuesServiceGetV1CodesByCodeIdCodevaluesByCodeValueIdKeyFn({ codeId, codeValueId }), queryFn: () => CodeValuesService.getV1CodesByCodeIdCodevaluesByCodeValueId({ codeId, codeValueId }) });
export const prefetchUseCollateralManagementServiceGetV1CollateralManagement = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseCollateralManagementServiceGetV1CollateralManagementKeyFn(), queryFn: () => CollateralManagementService.getV1CollateralManagement() });
export const prefetchUseCollateralManagementServiceGetV1CollateralManagementTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseCollateralManagementServiceGetV1CollateralManagementTemplateKeyFn(), queryFn: () => CollateralManagementService.getV1CollateralManagementTemplate() });
export const prefetchUseCollateralManagementServiceGetV1CollateralManagementByCollateralId = (queryClient: QueryClient, { collateralId }: {
  collateralId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseCollateralManagementServiceGetV1CollateralManagementByCollateralIdKeyFn({ collateralId }), queryFn: () => CollateralManagementService.getV1CollateralManagementByCollateralId({ collateralId }) });
export const prefetchUseGlobalConfigurationServiceGetV1Configurations = (queryClient: QueryClient, { survey }: {
  survey?: boolean;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseGlobalConfigurationServiceGetV1ConfigurationsKeyFn({ survey }), queryFn: () => GlobalConfigurationService.getV1Configurations({ survey }) });
export const prefetchUseGlobalConfigurationServiceGetV1ConfigurationsNameByName = (queryClient: QueryClient, { name }: {
  name: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseGlobalConfigurationServiceGetV1ConfigurationsNameByNameKeyFn({ name }), queryFn: () => GlobalConfigurationService.getV1ConfigurationsNameByName({ name }) });
export const prefetchUseGlobalConfigurationServiceGetV1ConfigurationsByConfigId = (queryClient: QueryClient, { configId }: {
  configId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseGlobalConfigurationServiceGetV1ConfigurationsByConfigIdKeyFn({ configId }), queryFn: () => GlobalConfigurationService.getV1ConfigurationsByConfigId({ configId }) });
export const prefetchUseCurrencyServiceGetV1Currencies = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseCurrencyServiceGetV1CurrenciesKeyFn(), queryFn: () => CurrencyService.getV1Currencies() });
export const prefetchUseDataTablesServiceGetV1Datatables = (queryClient: QueryClient, { apptable }: {
  apptable?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseDataTablesServiceGetV1DatatablesKeyFn({ apptable }), queryFn: () => DataTablesService.getV1Datatables({ apptable }) });
export const prefetchUseDataTablesServiceGetV1DatatablesByDatatable = (queryClient: QueryClient, { datatable }: {
  datatable: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDataTablesServiceGetV1DatatablesByDatatableKeyFn({ datatable }), queryFn: () => DataTablesService.getV1DatatablesByDatatable({ datatable }) });
export const prefetchUseDataTablesServiceGetV1DatatablesByDatatableQuery = (queryClient: QueryClient, { columnFilter, datatable, resultColumns, valueFilter }: {
  columnFilter?: string;
  datatable: string;
  resultColumns?: string;
  valueFilter?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDataTablesServiceGetV1DatatablesByDatatableQueryKeyFn({ columnFilter, datatable, resultColumns, valueFilter }), queryFn: () => DataTablesService.getV1DatatablesByDatatableQuery({ columnFilter, datatable, resultColumns, valueFilter }) });
export const prefetchUseDataTablesServiceGetV1DatatablesByDatatableByApptableId = (queryClient: QueryClient, { apptableId, datatable, order }: {
  apptableId: number;
  datatable: string;
  order?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDataTablesServiceGetV1DatatablesByDatatableByApptableIdKeyFn({ apptableId, datatable, order }), queryFn: () => DataTablesService.getV1DatatablesByDatatableByApptableId({ apptableId, datatable, order }) });
export const prefetchUseDataTablesServiceGetV1DatatablesByDatatableByApptableIdByDatatableId = (queryClient: QueryClient, { apptableId, datatable, datatableId, genericResultSet, order }: {
  apptableId: number;
  datatable: string;
  datatableId: number;
  genericResultSet?: boolean;
  order?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDataTablesServiceGetV1DatatablesByDatatableByApptableIdByDatatableIdKeyFn({ apptableId, datatable, datatableId, genericResultSet, order }), queryFn: () => DataTablesService.getV1DatatablesByDatatableByApptableIdByDatatableId({ apptableId, datatable, datatableId, genericResultSet, order }) });
export const prefetchUseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBuckets = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsKeyFn(), queryFn: () => DelinquencyRangeAndBucketsManagementService.getV1DelinquencyBuckets() });
export const prefetchUseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsByDelinquencyBucketId = (queryClient: QueryClient, { delinquencyBucketId }: {
  delinquencyBucketId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsByDelinquencyBucketIdKeyFn({ delinquencyBucketId }), queryFn: () => DelinquencyRangeAndBucketsManagementService.getV1DelinquencyBucketsByDelinquencyBucketId({ delinquencyBucketId }) });
export const prefetchUseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRanges = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesKeyFn(), queryFn: () => DelinquencyRangeAndBucketsManagementService.getV1DelinquencyRanges() });
export const prefetchUseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesByDelinquencyRangeId = (queryClient: QueryClient, { delinquencyRangeId }: {
  delinquencyRangeId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesByDelinquencyRangeIdKeyFn({ delinquencyRangeId }), queryFn: () => DelinquencyRangeAndBucketsManagementService.getV1DelinquencyRangesByDelinquencyRangeId({ delinquencyRangeId }) });
export const prefetchUseEntityDataTableServiceGetV1EntityDatatableChecks = (queryClient: QueryClient, { entity, limit, offset, productId, status }: {
  entity?: string;
  limit?: number;
  offset?: number;
  productId?: number;
  status?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseEntityDataTableServiceGetV1EntityDatatableChecksKeyFn({ entity, limit, offset, productId, status }), queryFn: () => EntityDataTableService.getV1EntityDatatableChecks({ entity, limit, offset, productId, status }) });
export const prefetchUseEntityDataTableServiceGetV1EntityDatatableChecksTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseEntityDataTableServiceGetV1EntityDatatableChecksTemplateKeyFn(), queryFn: () => EntityDataTableService.getV1EntityDatatableChecksTemplate() });
export const prefetchUseFineractEntityServiceGetV1Entitytoentitymapping = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseFineractEntityServiceGetV1EntitytoentitymappingKeyFn(), queryFn: () => FineractEntityService.getV1Entitytoentitymapping() });
export const prefetchUseFineractEntityServiceGetV1EntitytoentitymappingByMapId = (queryClient: QueryClient, { mapId }: {
  mapId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseFineractEntityServiceGetV1EntitytoentitymappingByMapIdKeyFn({ mapId }), queryFn: () => FineractEntityService.getV1EntitytoentitymappingByMapId({ mapId }) });
export const prefetchUseFineractEntityServiceGetV1EntitytoentitymappingByMapIdByFromIdByToId = (queryClient: QueryClient, { fromId, mapId, toId }: {
  fromId: number;
  mapId: number;
  toId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseFineractEntityServiceGetV1EntitytoentitymappingByMapIdByFromIdByToIdKeyFn({ fromId, mapId, toId }), queryFn: () => FineractEntityService.getV1EntitytoentitymappingByMapIdByFromIdByToId({ fromId, mapId, toId }) });
export const prefetchUseExternalAssetOwnerLoanProductAttributesServiceGetV1ExternalAssetOwnersLoanProductByLoanProductIdAttributes = (queryClient: QueryClient, { attributeKey, loanProductId }: {
  attributeKey?: string;
  loanProductId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseExternalAssetOwnerLoanProductAttributesServiceGetV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesKeyFn({ attributeKey, loanProductId }), queryFn: () => ExternalAssetOwnerLoanProductAttributesService.getV1ExternalAssetOwnersLoanProductByLoanProductIdAttributes({ attributeKey, loanProductId }) });
export const prefetchUseExternalAssetOwnersServiceGetV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntries = (queryClient: QueryClient, { limit, offset, ownerExternalId }: {
  limit?: number;
  offset?: number;
  ownerExternalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntriesKeyFn({ limit, offset, ownerExternalId }), queryFn: () => ExternalAssetOwnersService.getV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntries({ limit, offset, ownerExternalId }) });
export const prefetchUseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfers = (queryClient: QueryClient, { limit, loanExternalId, loanId, offset, transferExternalId }: {
  limit?: number;
  loanExternalId?: string;
  loanId?: number;
  offset?: number;
  transferExternalId?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersKeyFn({ limit, loanExternalId, loanId, offset, transferExternalId }), queryFn: () => ExternalAssetOwnersService.getV1ExternalAssetOwnersTransfers({ limit, loanExternalId, loanId, offset, transferExternalId }) });
export const prefetchUseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersActiveTransfer = (queryClient: QueryClient, { loanExternalId, loanId, transferExternalId }: {
  loanExternalId?: string;
  loanId?: number;
  transferExternalId?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersActiveTransferKeyFn({ loanExternalId, loanId, transferExternalId }), queryFn: () => ExternalAssetOwnersService.getV1ExternalAssetOwnersTransfersActiveTransfer({ loanExternalId, loanId, transferExternalId }) });
export const prefetchUseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersByTransferIdJournalEntries = (queryClient: QueryClient, { limit, offset, transferId }: {
  limit?: number;
  offset?: number;
  transferId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersByTransferIdJournalEntriesKeyFn({ limit, offset, transferId }), queryFn: () => ExternalAssetOwnersService.getV1ExternalAssetOwnersTransfersByTransferIdJournalEntries({ limit, offset, transferId }) });
export const prefetchUseExternalEventConfigurationServiceGetV1ExternaleventsConfiguration = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseExternalEventConfigurationServiceGetV1ExternaleventsConfigurationKeyFn(), queryFn: () => ExternalEventConfigurationService.getV1ExternaleventsConfiguration() });
export const prefetchUseExternalServicesServiceGetV1ExternalserviceByServicename = (queryClient: QueryClient, { servicename }: {
  servicename: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseExternalServicesServiceGetV1ExternalserviceByServicenameKeyFn({ servicename }), queryFn: () => ExternalServicesService.getV1ExternalserviceByServicename({ servicename }) });
export const prefetchUseEntityFieldConfigurationServiceGetV1FieldconfigurationByEntity = (queryClient: QueryClient, { entity }: {
  entity: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseEntityFieldConfigurationServiceGetV1FieldconfigurationByEntityKeyFn({ entity }), queryFn: () => EntityFieldConfigurationService.getV1FieldconfigurationByEntity({ entity }) });
export const prefetchUseMappingFinancialActivitiesToAccountsServiceGetV1Financialactivityaccounts = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsKeyFn(), queryFn: () => MappingFinancialActivitiesToAccountsService.getV1Financialactivityaccounts() });
export const prefetchUseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsTemplateKeyFn(), queryFn: () => MappingFinancialActivitiesToAccountsService.getV1FinancialactivityaccountsTemplate() });
export const prefetchUseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsByMappingId = (queryClient: QueryClient, { mappingId }: {
  mappingId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsByMappingIdKeyFn({ mappingId }), queryFn: () => MappingFinancialActivitiesToAccountsService.getV1FinancialactivityaccountsByMappingId({ mappingId }) });
export const prefetchUseFixedDepositAccountServiceGetV1Fixeddepositaccounts = (queryClient: QueryClient, { limit, offset, orderBy, paged, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  paged?: boolean;
  sortOrder?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsKeyFn({ limit, offset, orderBy, paged, sortOrder }), queryFn: () => FixedDepositAccountService.getV1Fixeddepositaccounts({ limit, offset, orderBy, paged, sortOrder }) });
export const prefetchUseFixedDepositAccountServiceGetV1FixeddepositaccountsCalculateFdInterest = (queryClient: QueryClient, { annualInterestRate, interestCompoundingPeriodInMonths, interestPostingPeriodInMonths, principalAmount, tenureInMonths }: {
  annualInterestRate?: number;
  interestCompoundingPeriodInMonths?: number;
  interestPostingPeriodInMonths?: number;
  principalAmount?: number;
  tenureInMonths?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsCalculateFdInterestKeyFn({ annualInterestRate, interestCompoundingPeriodInMonths, interestPostingPeriodInMonths, principalAmount, tenureInMonths }), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsCalculateFdInterest({ annualInterestRate, interestCompoundingPeriodInMonths, interestPostingPeriodInMonths, principalAmount, tenureInMonths }) });
export const prefetchUseFixedDepositAccountServiceGetV1FixeddepositaccountsDownloadtemplate = (queryClient: QueryClient, { dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsDownloadtemplateKeyFn({ dateFormat, officeId, staffId }), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsDownloadtemplate({ dateFormat, officeId, staffId }) });
export const prefetchUseFixedDepositAccountServiceGetV1FixeddepositaccountsTemplate = (queryClient: QueryClient, { clientId, groupId, productId, staffInSelectedOfficeOnly }: {
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsTemplateKeyFn({ clientId, groupId, productId, staffInSelectedOfficeOnly }), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsTemplate({ clientId, groupId, productId, staffInSelectedOfficeOnly }) });
export const prefetchUseFixedDepositAccountServiceGetV1FixeddepositaccountsTransactionDownloadtemplate = (queryClient: QueryClient, { dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsTransactionDownloadtemplateKeyFn({ dateFormat, officeId }), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsTransactionDownloadtemplate({ dateFormat, officeId }) });
export const prefetchUseFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountId = (queryClient: QueryClient, { accountId, chargeStatus, staffInSelectedOfficeOnly }: {
  accountId: number;
  chargeStatus?: string;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.prefetchQuery({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdKeyFn({ accountId, chargeStatus, staffInSelectedOfficeOnly }), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsByAccountId({ accountId, chargeStatus, staffInSelectedOfficeOnly }) });
export const prefetchUseFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdTemplate = (queryClient: QueryClient, { accountId, command }: {
  accountId: number;
  command?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdTemplateKeyFn({ accountId, command }), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsByAccountIdTemplate({ accountId, command }) });
export const prefetchUseFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplate = (queryClient: QueryClient, { fixedDepositAccountId }: {
  fixedDepositAccountId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplateKeyFn({ fixedDepositAccountId }), queryFn: () => FixedDepositAccountTransactionsService.getV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplate({ fixedDepositAccountId }) });
export const prefetchUseFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionId = (queryClient: QueryClient, { fixedDepositAccountId, transactionId }: {
  fixedDepositAccountId: number;
  transactionId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionIdKeyFn({ fixedDepositAccountId, transactionId }), queryFn: () => FixedDepositAccountTransactionsService.getV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionId({ fixedDepositAccountId, transactionId }) });
export const prefetchUseFixedDepositProductServiceGetV1Fixeddepositproducts = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseFixedDepositProductServiceGetV1FixeddepositproductsKeyFn(), queryFn: () => FixedDepositProductService.getV1Fixeddepositproducts() });
export const prefetchUseFixedDepositProductServiceGetV1FixeddepositproductsTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseFixedDepositProductServiceGetV1FixeddepositproductsTemplateKeyFn(), queryFn: () => FixedDepositProductService.getV1FixeddepositproductsTemplate() });
export const prefetchUseFixedDepositProductServiceGetV1FixeddepositproductsByProductId = (queryClient: QueryClient, { productId }: {
  productId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseFixedDepositProductServiceGetV1FixeddepositproductsByProductIdKeyFn({ productId }), queryFn: () => FixedDepositProductService.getV1FixeddepositproductsByProductId({ productId }) });
export const prefetchUseFloatingRatesServiceGetV1Floatingrates = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseFloatingRatesServiceGetV1FloatingratesKeyFn(), queryFn: () => FloatingRatesService.getV1Floatingrates() });
export const prefetchUseFloatingRatesServiceGetV1FloatingratesByFloatingRateId = (queryClient: QueryClient, { floatingRateId }: {
  floatingRateId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseFloatingRatesServiceGetV1FloatingratesByFloatingRateIdKeyFn({ floatingRateId }), queryFn: () => FloatingRatesService.getV1FloatingratesByFloatingRateId({ floatingRateId }) });
export const prefetchUseFundsServiceGetV1Funds = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseFundsServiceGetV1FundsKeyFn(), queryFn: () => FundsService.getV1Funds() });
export const prefetchUseFundsServiceGetV1FundsByFundId = (queryClient: QueryClient, { fundId }: {
  fundId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseFundsServiceGetV1FundsByFundIdKeyFn({ fundId }), queryFn: () => FundsService.getV1FundsByFundId({ fundId }) });
export const prefetchUseGeneralLedgerAccountServiceGetV1Glaccounts = (queryClient: QueryClient, { disabled, fetchRunningBalance, manualEntriesAllowed, searchParam, type, usage }: {
  disabled?: boolean;
  fetchRunningBalance?: boolean;
  manualEntriesAllowed?: boolean;
  searchParam?: string;
  type?: number;
  usage?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseGeneralLedgerAccountServiceGetV1GlaccountsKeyFn({ disabled, fetchRunningBalance, manualEntriesAllowed, searchParam, type, usage }), queryFn: () => GeneralLedgerAccountService.getV1Glaccounts({ disabled, fetchRunningBalance, manualEntriesAllowed, searchParam, type, usage }) });
export const prefetchUseGeneralLedgerAccountServiceGetV1GlaccountsDownloadtemplate = (queryClient: QueryClient, { dateFormat }: {
  dateFormat?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseGeneralLedgerAccountServiceGetV1GlaccountsDownloadtemplateKeyFn({ dateFormat }), queryFn: () => GeneralLedgerAccountService.getV1GlaccountsDownloadtemplate({ dateFormat }) });
export const prefetchUseGeneralLedgerAccountServiceGetV1GlaccountsTemplate = (queryClient: QueryClient, { type }: {
  type?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseGeneralLedgerAccountServiceGetV1GlaccountsTemplateKeyFn({ type }), queryFn: () => GeneralLedgerAccountService.getV1GlaccountsTemplate({ type }) });
export const prefetchUseGeneralLedgerAccountServiceGetV1GlaccountsByGlAccountId = (queryClient: QueryClient, { fetchRunningBalance, glAccountId }: {
  fetchRunningBalance?: boolean;
  glAccountId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseGeneralLedgerAccountServiceGetV1GlaccountsByGlAccountIdKeyFn({ fetchRunningBalance, glAccountId }), queryFn: () => GeneralLedgerAccountService.getV1GlaccountsByGlAccountId({ fetchRunningBalance, glAccountId }) });
export const prefetchUseAccountingClosureServiceGetV1Glclosures = (queryClient: QueryClient, { officeId }: {
  officeId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseAccountingClosureServiceGetV1GlclosuresKeyFn({ officeId }), queryFn: () => AccountingClosureService.getV1Glclosures({ officeId }) });
export const prefetchUseAccountingClosureServiceGetV1GlclosuresByGlClosureId = (queryClient: QueryClient, { glClosureId }: {
  glClosureId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseAccountingClosureServiceGetV1GlclosuresByGlClosureIdKeyFn({ glClosureId }), queryFn: () => AccountingClosureService.getV1GlclosuresByGlClosureId({ glClosureId }) });
export const prefetchUseGroupsLevelServiceGetV1Grouplevels = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseGroupsLevelServiceGetV1GrouplevelsKeyFn(), queryFn: () => GroupsLevelService.getV1Grouplevels() });
export const prefetchUseGroupsServiceGetV1Groups = (queryClient: QueryClient, { externalId, limit, name, officeId, offset, orderBy, orphansOnly, paged, sortOrder, staffId, underHierarchy }: {
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
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseGroupsServiceGetV1GroupsKeyFn({ externalId, limit, name, officeId, offset, orderBy, orphansOnly, paged, sortOrder, staffId, underHierarchy }), queryFn: () => GroupsService.getV1Groups({ externalId, limit, name, officeId, offset, orderBy, orphansOnly, paged, sortOrder, staffId, underHierarchy }) });
export const prefetchUseGroupsServiceGetV1GroupsDownloadtemplate = (queryClient: QueryClient, { dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseGroupsServiceGetV1GroupsDownloadtemplateKeyFn({ dateFormat, officeId, staffId }), queryFn: () => GroupsService.getV1GroupsDownloadtemplate({ dateFormat, officeId, staffId }) });
export const prefetchUseGroupsServiceGetV1GroupsTemplate = (queryClient: QueryClient, { center, centerId, command, officeId, staffInSelectedOfficeOnly }: {
  center?: boolean;
  centerId?: number;
  command?: string;
  officeId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseGroupsServiceGetV1GroupsTemplateKeyFn({ center, centerId, command, officeId, staffInSelectedOfficeOnly }), queryFn: () => GroupsService.getV1GroupsTemplate({ center, centerId, command, officeId, staffInSelectedOfficeOnly }) });
export const prefetchUseGroupsServiceGetV1GroupsByGroupId = (queryClient: QueryClient, { groupId, roleId, staffInSelectedOfficeOnly }: {
  groupId: number;
  roleId?: number;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.prefetchQuery({ queryKey: Common.UseGroupsServiceGetV1GroupsByGroupIdKeyFn({ groupId, roleId, staffInSelectedOfficeOnly }), queryFn: () => GroupsService.getV1GroupsByGroupId({ groupId, roleId, staffInSelectedOfficeOnly }) });
export const prefetchUseGroupsServiceGetV1GroupsByGroupIdAccounts = (queryClient: QueryClient, { groupId }: {
  groupId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseGroupsServiceGetV1GroupsByGroupIdAccountsKeyFn({ groupId }), queryFn: () => GroupsService.getV1GroupsByGroupIdAccounts({ groupId }) });
export const prefetchUseGroupsServiceGetV1GroupsByGroupIdGlimaccounts = (queryClient: QueryClient, { groupId, parentLoanAccountNo }: {
  groupId: number;
  parentLoanAccountNo?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseGroupsServiceGetV1GroupsByGroupIdGlimaccountsKeyFn({ groupId, parentLoanAccountNo }), queryFn: () => GroupsService.getV1GroupsByGroupIdGlimaccounts({ groupId, parentLoanAccountNo }) });
export const prefetchUseGroupsServiceGetV1GroupsByGroupIdGsimaccounts = (queryClient: QueryClient, { groupId, parentGsimAccountNo, parentGsimId }: {
  groupId: number;
  parentGsimAccountNo?: string;
  parentGsimId?: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseGroupsServiceGetV1GroupsByGroupIdGsimaccountsKeyFn({ groupId, parentGsimAccountNo, parentGsimId }), queryFn: () => GroupsService.getV1GroupsByGroupIdGsimaccounts({ groupId, parentGsimAccountNo, parentGsimId }) });
export const prefetchUseHolidaysServiceGetV1Holidays = (queryClient: QueryClient, { dateFormat, fromDate, locale, officeId, toDate }: {
  dateFormat?: string;
  fromDate?: DateParam;
  locale?: string;
  officeId?: number;
  toDate?: DateParam;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseHolidaysServiceGetV1HolidaysKeyFn({ dateFormat, fromDate, locale, officeId, toDate }), queryFn: () => HolidaysService.getV1Holidays({ dateFormat, fromDate, locale, officeId, toDate }) });
export const prefetchUseHolidaysServiceGetV1HolidaysTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseHolidaysServiceGetV1HolidaysTemplateKeyFn(), queryFn: () => HolidaysService.getV1HolidaysTemplate() });
export const prefetchUseHolidaysServiceGetV1HolidaysByHolidayId = (queryClient: QueryClient, { holidayId }: {
  holidayId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseHolidaysServiceGetV1HolidaysByHolidayIdKeyFn({ holidayId }), queryFn: () => HolidaysService.getV1HolidaysByHolidayId({ holidayId }) });
export const prefetchUseHooksServiceGetV1Hooks = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseHooksServiceGetV1HooksKeyFn(), queryFn: () => HooksService.getV1Hooks() });
export const prefetchUseHooksServiceGetV1HooksTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseHooksServiceGetV1HooksTemplateKeyFn(), queryFn: () => HooksService.getV1HooksTemplate() });
export const prefetchUseHooksServiceGetV1HooksByHookId = (queryClient: QueryClient, { hookId }: {
  hookId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseHooksServiceGetV1HooksByHookIdKeyFn({ hookId }), queryFn: () => HooksService.getV1HooksByHookId({ hookId }) });
export const prefetchUseBulkImportServiceGetV1Imports = (queryClient: QueryClient, { entityType }: {
  entityType?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseBulkImportServiceGetV1ImportsKeyFn({ entityType }), queryFn: () => BulkImportService.getV1Imports({ entityType }) });
export const prefetchUseBulkImportServiceGetV1ImportsDownloadOutputTemplate = (queryClient: QueryClient, { importDocumentId }: {
  importDocumentId?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseBulkImportServiceGetV1ImportsDownloadOutputTemplateKeyFn({ importDocumentId }), queryFn: () => BulkImportService.getV1ImportsDownloadOutputTemplate({ importDocumentId }) });
export const prefetchUseBulkImportServiceGetV1ImportsGetOutputTemplateLocation = (queryClient: QueryClient, { importDocumentId }: {
  importDocumentId?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseBulkImportServiceGetV1ImportsGetOutputTemplateLocationKeyFn({ importDocumentId }), queryFn: () => BulkImportService.getV1ImportsGetOutputTemplateLocation({ importDocumentId }) });
export const prefetchUseInterestRateChartServiceGetV1Interestratecharts = (queryClient: QueryClient, { productId }: {
  productId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseInterestRateChartServiceGetV1InterestratechartsKeyFn({ productId }), queryFn: () => InterestRateChartService.getV1Interestratecharts({ productId }) });
export const prefetchUseInterestRateChartServiceGetV1InterestratechartsTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseInterestRateChartServiceGetV1InterestratechartsTemplateKeyFn(), queryFn: () => InterestRateChartService.getV1InterestratechartsTemplate() });
export const prefetchUseInterestRateChartServiceGetV1InterestratechartsByChartId = (queryClient: QueryClient, { chartId }: {
  chartId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseInterestRateChartServiceGetV1InterestratechartsByChartIdKeyFn({ chartId }), queryFn: () => InterestRateChartService.getV1InterestratechartsByChartId({ chartId }) });
export const prefetchUseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabs = (queryClient: QueryClient, { chartId }: {
  chartId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsKeyFn({ chartId }), queryFn: () => InterestRateSlabAKAInterestBandsService.getV1InterestratechartsByChartIdChartslabs({ chartId }) });
export const prefetchUseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsTemplate = (queryClient: QueryClient, { chartId }: {
  chartId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsTemplateKeyFn({ chartId }), queryFn: () => InterestRateSlabAKAInterestBandsService.getV1InterestratechartsByChartIdChartslabsTemplate({ chartId }) });
export const prefetchUseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsByChartSlabId = (queryClient: QueryClient, { chartId, chartSlabId }: {
  chartId: number;
  chartSlabId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsByChartSlabIdKeyFn({ chartId, chartSlabId }), queryFn: () => InterestRateSlabAKAInterestBandsService.getV1InterestratechartsByChartIdChartslabsByChartSlabId({ chartId, chartSlabId }) });
export const prefetchUseProgressiveLoanServiceGetV1InternalLoanProgressiveByLoanIdModel = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseProgressiveLoanServiceGetV1InternalLoanProgressiveByLoanIdModelKeyFn({ loanId }), queryFn: () => ProgressiveLoanService.getV1InternalLoanProgressiveByLoanIdModel({ loanId }) });
export const prefetchUseInterOperationServiceGetV1InteroperationAccountsByAccountId = (queryClient: QueryClient, { accountId }: {
  accountId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseInterOperationServiceGetV1InteroperationAccountsByAccountIdKeyFn({ accountId }), queryFn: () => InterOperationService.getV1InteroperationAccountsByAccountId({ accountId }) });
export const prefetchUseInterOperationServiceGetV1InteroperationAccountsByAccountIdIdentifiers = (queryClient: QueryClient, { accountId }: {
  accountId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseInterOperationServiceGetV1InteroperationAccountsByAccountIdIdentifiersKeyFn({ accountId }), queryFn: () => InterOperationService.getV1InteroperationAccountsByAccountIdIdentifiers({ accountId }) });
export const prefetchUseInterOperationServiceGetV1InteroperationAccountsByAccountIdKyc = (queryClient: QueryClient, { accountId }: {
  accountId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseInterOperationServiceGetV1InteroperationAccountsByAccountIdKycKeyFn({ accountId }), queryFn: () => InterOperationService.getV1InteroperationAccountsByAccountIdKyc({ accountId }) });
export const prefetchUseInterOperationServiceGetV1InteroperationAccountsByAccountIdTransactions = (queryClient: QueryClient, { accountId, credit, debit, fromBookingDateTime, toBookingDateTime }: {
  accountId: string;
  credit?: boolean;
  debit?: boolean;
  fromBookingDateTime?: string;
  toBookingDateTime?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseInterOperationServiceGetV1InteroperationAccountsByAccountIdTransactionsKeyFn({ accountId, credit, debit, fromBookingDateTime, toBookingDateTime }), queryFn: () => InterOperationService.getV1InteroperationAccountsByAccountIdTransactions({ accountId, credit, debit, fromBookingDateTime, toBookingDateTime }) });
export const prefetchUseInterOperationServiceGetV1InteroperationHealth = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseInterOperationServiceGetV1InteroperationHealthKeyFn(), queryFn: () => InterOperationService.getV1InteroperationHealth() });
export const prefetchUseInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValue = (queryClient: QueryClient, { idType, idValue }: {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueKeyFn({ idType, idValue }), queryFn: () => InterOperationService.getV1InteroperationPartiesByIdTypeByIdValue({ idType, idValue }) });
export const prefetchUseInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueBySubIdOrType = (queryClient: QueryClient, { idType, idValue, subIdOrType }: {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
  subIdOrType: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeKeyFn({ idType, idValue, subIdOrType }), queryFn: () => InterOperationService.getV1InteroperationPartiesByIdTypeByIdValueBySubIdOrType({ idType, idValue, subIdOrType }) });
export const prefetchUseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCode = (queryClient: QueryClient, { quoteCode, transactionCode }: {
  quoteCode: string;
  transactionCode: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCodeKeyFn({ quoteCode, transactionCode }), queryFn: () => InterOperationService.getV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCode({ quoteCode, transactionCode }) });
export const prefetchUseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeRequestsByRequestCode = (queryClient: QueryClient, { requestCode, transactionCode }: {
  requestCode: string;
  transactionCode: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeRequestsByRequestCodeKeyFn({ requestCode, transactionCode }), queryFn: () => InterOperationService.getV1InteroperationTransactionsByTransactionCodeRequestsByRequestCode({ requestCode, transactionCode }) });
export const prefetchUseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeTransfersByTransferCode = (queryClient: QueryClient, { transactionCode, transferCode }: {
  transactionCode: string;
  transferCode: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeTransfersByTransferCodeKeyFn({ transactionCode, transferCode }), queryFn: () => InterOperationService.getV1InteroperationTransactionsByTransactionCodeTransfersByTransferCode({ transactionCode, transferCode }) });
export const prefetchUseSchedulerJobServiceGetV1Jobs = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseSchedulerJobServiceGetV1JobsKeyFn(), queryFn: () => SchedulerJobService.getV1Jobs() });
export const prefetchUseSchedulerJobServiceGetV1JobsShortNameByShortName = (queryClient: QueryClient, { shortName }: {
  shortName: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSchedulerJobServiceGetV1JobsShortNameByShortNameKeyFn({ shortName }), queryFn: () => SchedulerJobService.getV1JobsShortNameByShortName({ shortName }) });
export const prefetchUseSchedulerJobServiceGetV1JobsShortNameByShortNameRunhistory = (queryClient: QueryClient, { limit, offset, orderBy, shortName, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  shortName: string;
  sortOrder?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSchedulerJobServiceGetV1JobsShortNameByShortNameRunhistoryKeyFn({ limit, offset, orderBy, shortName, sortOrder }), queryFn: () => SchedulerJobService.getV1JobsShortNameByShortNameRunhistory({ limit, offset, orderBy, shortName, sortOrder }) });
export const prefetchUseSchedulerJobServiceGetV1JobsByJobId = (queryClient: QueryClient, { jobId }: {
  jobId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSchedulerJobServiceGetV1JobsByJobIdKeyFn({ jobId }), queryFn: () => SchedulerJobService.getV1JobsByJobId({ jobId }) });
export const prefetchUseSchedulerJobServiceGetV1JobsByJobIdRunhistory = (queryClient: QueryClient, { jobId, limit, offset, orderBy, sortOrder }: {
  jobId: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSchedulerJobServiceGetV1JobsByJobIdRunhistoryKeyFn({ jobId, limit, offset, orderBy, sortOrder }), queryFn: () => SchedulerJobService.getV1JobsByJobIdRunhistory({ jobId, limit, offset, orderBy, sortOrder }) });
export const prefetchUseBusinessStepConfigurationServiceGetV1JobsNames = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseBusinessStepConfigurationServiceGetV1JobsNamesKeyFn(), queryFn: () => BusinessStepConfigurationService.getV1JobsNames() });
export const prefetchUseBusinessStepConfigurationServiceGetV1JobsByJobNameAvailableSteps = (queryClient: QueryClient, { jobName }: {
  jobName: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseBusinessStepConfigurationServiceGetV1JobsByJobNameAvailableStepsKeyFn({ jobName }), queryFn: () => BusinessStepConfigurationService.getV1JobsByJobNameAvailableSteps({ jobName }) });
export const prefetchUseBusinessStepConfigurationServiceGetV1JobsByJobNameSteps = (queryClient: QueryClient, { jobName }: {
  jobName: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseBusinessStepConfigurationServiceGetV1JobsByJobNameStepsKeyFn({ jobName }), queryFn: () => BusinessStepConfigurationService.getV1JobsByJobNameSteps({ jobName }) });
export const prefetchUseJournalEntriesServiceGetV1Journalentries = (queryClient: QueryClient, { dateFormat, entityType, fromDate, glAccountId, limit, loanId, locale, manualEntriesOnly, officeId, offset, orderBy, runningBalance, savingsId, sortOrder, submittedOnDateFrom, submittedOnDateTo, toDate, transactionDetails, transactionId }: {
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
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesKeyFn({ dateFormat, entityType, fromDate, glAccountId, limit, loanId, locale, manualEntriesOnly, officeId, offset, orderBy, runningBalance, savingsId, sortOrder, submittedOnDateFrom, submittedOnDateTo, toDate, transactionDetails, transactionId }), queryFn: () => JournalEntriesService.getV1Journalentries({ dateFormat, entityType, fromDate, glAccountId, limit, loanId, locale, manualEntriesOnly, officeId, offset, orderBy, runningBalance, savingsId, sortOrder, submittedOnDateFrom, submittedOnDateTo, toDate, transactionDetails, transactionId }) });
export const prefetchUseJournalEntriesServiceGetV1JournalentriesDownloadtemplate = (queryClient: QueryClient, { dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesDownloadtemplateKeyFn({ dateFormat, officeId }), queryFn: () => JournalEntriesService.getV1JournalentriesDownloadtemplate({ dateFormat, officeId }) });
export const prefetchUseJournalEntriesServiceGetV1JournalentriesOpeningbalance = (queryClient: QueryClient, { currencyCode, officeId }: {
  currencyCode?: string;
  officeId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesOpeningbalanceKeyFn({ currencyCode, officeId }), queryFn: () => JournalEntriesService.getV1JournalentriesOpeningbalance({ currencyCode, officeId }) });
export const prefetchUseJournalEntriesServiceGetV1JournalentriesProvisioning = (queryClient: QueryClient, { entryId, limit, offset }: {
  entryId?: number;
  limit?: number;
  offset?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesProvisioningKeyFn({ entryId, limit, offset }), queryFn: () => JournalEntriesService.getV1JournalentriesProvisioning({ entryId, limit, offset }) });
export const prefetchUseJournalEntriesServiceGetV1JournalentriesByJournalEntryId = (queryClient: QueryClient, { journalEntryId, runningBalance, transactionDetails }: {
  journalEntryId: number;
  runningBalance?: boolean;
  transactionDetails?: boolean;
}) => queryClient.prefetchQuery({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesByJournalEntryIdKeyFn({ journalEntryId, runningBalance, transactionDetails }), queryFn: () => JournalEntriesService.getV1JournalentriesByJournalEntryId({ journalEntryId, runningBalance, transactionDetails }) });
export const prefetchUseLikelihoodServiceGetV1LikelihoodByPpiName = (queryClient: QueryClient, { ppiName }: {
  ppiName: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLikelihoodServiceGetV1LikelihoodByPpiNameKeyFn({ ppiName }), queryFn: () => LikelihoodService.getV1LikelihoodByPpiName({ ppiName }) });
export const prefetchUseLikelihoodServiceGetV1LikelihoodByPpiNameByLikelihoodId = (queryClient: QueryClient, { likelihoodId, ppiName }: {
  likelihoodId: number;
  ppiName: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLikelihoodServiceGetV1LikelihoodByPpiNameByLikelihoodIdKeyFn({ likelihoodId, ppiName }), queryFn: () => LikelihoodService.getV1LikelihoodByPpiNameByLikelihoodId({ likelihoodId, ppiName }) });
export const prefetchUseLoanCollateralManagementServiceGetV1LoanCollateralManagementByCollateralId = (queryClient: QueryClient, { collateralId }: {
  collateralId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanCollateralManagementServiceGetV1LoanCollateralManagementByCollateralIdKeyFn({ collateralId }), queryFn: () => LoanCollateralManagementService.getV1LoanCollateralManagementByCollateralId({ collateralId }) });
export const prefetchUseLoanProductsServiceGetV1Loanproducts = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseLoanProductsServiceGetV1LoanproductsKeyFn(), queryFn: () => LoanProductsService.getV1Loanproducts() });
export const prefetchUseLoanProductsServiceGetV1LoanproductsExternalIdByExternalProductId = (queryClient: QueryClient, { externalProductId }: {
  externalProductId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanProductsServiceGetV1LoanproductsExternalIdByExternalProductIdKeyFn({ externalProductId }), queryFn: () => LoanProductsService.getV1LoanproductsExternalIdByExternalProductId({ externalProductId }) });
export const prefetchUseLoanProductsServiceGetV1LoanproductsTemplate = (queryClient: QueryClient, { isProductMixTemplate }: {
  isProductMixTemplate?: boolean;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanProductsServiceGetV1LoanproductsTemplateKeyFn({ isProductMixTemplate }), queryFn: () => LoanProductsService.getV1LoanproductsTemplate({ isProductMixTemplate }) });
export const prefetchUseLoanProductsServiceGetV1LoanproductsByProductId = (queryClient: QueryClient, { productId }: {
  productId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanProductsServiceGetV1LoanproductsByProductIdKeyFn({ productId }), queryFn: () => LoanProductsService.getV1LoanproductsByProductId({ productId }) });
export const prefetchUseProductMixServiceGetV1LoanproductsByProductIdProductmix = (queryClient: QueryClient, { productId }: {
  productId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseProductMixServiceGetV1LoanproductsByProductIdProductmixKeyFn({ productId }), queryFn: () => ProductMixService.getV1LoanproductsByProductIdProductmix({ productId }) });
export const prefetchUseLoansServiceGetV1Loans = (queryClient: QueryClient, { accountNo, associations, clientId, externalId, limit, offset, orderBy, sortOrder, status }: {
  accountNo?: string;
  associations?: string;
  clientId?: number;
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  status?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseLoansServiceGetV1LoansKeyFn({ accountNo, associations, clientId, externalId, limit, offset, orderBy, sortOrder, status }), queryFn: () => LoansService.getV1Loans({ accountNo, associations, clientId, externalId, limit, offset, orderBy, sortOrder, status }) });
export const prefetchUseLoansServiceGetV1LoansDownloadtemplate = (queryClient: QueryClient, { dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseLoansServiceGetV1LoansDownloadtemplateKeyFn({ dateFormat, officeId, staffId }), queryFn: () => LoansService.getV1LoansDownloadtemplate({ dateFormat, officeId, staffId }) });
export const prefetchUseLoansServiceGetV1LoansExternalIdByLoanExternalId = (queryClient: QueryClient, { associations, exclude, fields, loanExternalId, staffInSelectedOfficeOnly }: {
  associations?: string;
  exclude?: string;
  fields?: string;
  loanExternalId: string;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdKeyFn({ associations, exclude, fields, loanExternalId, staffInSelectedOfficeOnly }), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalId({ associations, exclude, fields, loanExternalId, staffInSelectedOfficeOnly }) });
export const prefetchUseLoansServiceGetV1LoansExternalIdByLoanExternalIdApprovedAmount = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdApprovedAmountKeyFn({ loanExternalId }), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalIdApprovedAmount({ loanExternalId }) });
export const prefetchUseLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencyActions = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencyActionsKeyFn({ loanExternalId }), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalIdDelinquencyActions({ loanExternalId }) });
export const prefetchUseLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencytags = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencytagsKeyFn({ loanExternalId }), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalIdDelinquencytags({ loanExternalId }) });
export const prefetchUseLoansServiceGetV1LoansExternalIdByLoanExternalIdTemplate = (queryClient: QueryClient, { loanExternalId, templateType }: {
  loanExternalId: string;
  templateType?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdTemplateKeyFn({ loanExternalId, templateType }), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalIdTemplate({ loanExternalId, templateType }) });
export const prefetchUseLoansServiceGetV1LoansGlimAccountByGlimId = (queryClient: QueryClient, { glimId }: {
  glimId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoansServiceGetV1LoansGlimAccountByGlimIdKeyFn({ glimId }), queryFn: () => LoansService.getV1LoansGlimAccountByGlimId({ glimId }) });
export const prefetchUseLoansServiceGetV1LoansRepaymentsDownloadtemplate = (queryClient: QueryClient, { dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseLoansServiceGetV1LoansRepaymentsDownloadtemplateKeyFn({ dateFormat, officeId }), queryFn: () => LoansService.getV1LoansRepaymentsDownloadtemplate({ dateFormat, officeId }) });
export const prefetchUseLoansServiceGetV1LoansTemplate = (queryClient: QueryClient, { activeOnly, clientId, groupId, productId, staffInSelectedOfficeOnly, templateType }: {
  activeOnly?: boolean;
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
  templateType?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseLoansServiceGetV1LoansTemplateKeyFn({ activeOnly, clientId, groupId, productId, staffInSelectedOfficeOnly, templateType }), queryFn: () => LoansService.getV1LoansTemplate({ activeOnly, clientId, groupId, productId, staffInSelectedOfficeOnly, templateType }) });
export const prefetchUseLoansServiceGetV1LoansByLoanId = (queryClient: QueryClient, { associations, exclude, fields, loanId, staffInSelectedOfficeOnly }: {
  associations?: string;
  exclude?: string;
  fields?: string;
  loanId: number;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdKeyFn({ associations, exclude, fields, loanId, staffInSelectedOfficeOnly }), queryFn: () => LoansService.getV1LoansByLoanId({ associations, exclude, fields, loanId, staffInSelectedOfficeOnly }) });
export const prefetchUseLoansServiceGetV1LoansByLoanIdApprovedAmount = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdApprovedAmountKeyFn({ loanId }), queryFn: () => LoansService.getV1LoansByLoanIdApprovedAmount({ loanId }) });
export const prefetchUseLoansServiceGetV1LoansByLoanIdDelinquencyActions = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdDelinquencyActionsKeyFn({ loanId }), queryFn: () => LoansService.getV1LoansByLoanIdDelinquencyActions({ loanId }) });
export const prefetchUseLoansServiceGetV1LoansByLoanIdDelinquencytags = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdDelinquencytagsKeyFn({ loanId }), queryFn: () => LoansService.getV1LoansByLoanIdDelinquencytags({ loanId }) });
export const prefetchUseLoansServiceGetV1LoansByLoanIdTemplate = (queryClient: QueryClient, { loanId, templateType }: {
  loanId: number;
  templateType?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdTemplateKeyFn({ loanId, templateType }), queryFn: () => LoansService.getV1LoansByLoanIdTemplate({ loanId, templateType }) });
export const prefetchUseLoansPointInTimeServiceGetV1LoansAtDateExternalIdByLoanExternalId = (queryClient: QueryClient, { date, dateFormat, loanExternalId, locale }: {
  date: DateParam;
  dateFormat?: string;
  loanExternalId: string;
  locale?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoansPointInTimeServiceGetV1LoansAtDateExternalIdByLoanExternalIdKeyFn({ date, dateFormat, loanExternalId, locale }), queryFn: () => LoansPointInTimeService.getV1LoansAtDateExternalIdByLoanExternalId({ date, dateFormat, loanExternalId, locale }) });
export const prefetchUseLoansPointInTimeServiceGetV1LoansAtDateByLoanId = (queryClient: QueryClient, { date, dateFormat, loanId, locale }: {
  date: DateParam;
  dateFormat?: string;
  loanId: number;
  locale?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoansPointInTimeServiceGetV1LoansAtDateByLoanIdKeyFn({ date, dateFormat, loanId, locale }), queryFn: () => LoansPointInTimeService.getV1LoansAtDateByLoanId({ date, dateFormat, loanId, locale }) });
export const prefetchUseLoanCobCatchUpServiceGetV1LoansIsCatchUpRunning = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseLoanCobCatchUpServiceGetV1LoansIsCatchUpRunningKeyFn(), queryFn: () => LoanCobCatchUpService.getV1LoansIsCatchUpRunning() });
export const prefetchUseLoanCobCatchUpServiceGetV1LoansOldestCobClosed = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseLoanCobCatchUpServiceGetV1LoansOldestCobClosedKeyFn(), queryFn: () => LoanCobCatchUpService.getV1LoansOldestCobClosed() });
export const prefetchUseLoanBuyDownFeesServiceGetV1LoansExternalIdByLoanExternalIdBuydownFees = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanBuyDownFeesServiceGetV1LoansExternalIdByLoanExternalIdBuydownFeesKeyFn({ loanExternalId }), queryFn: () => LoanBuyDownFeesService.getV1LoansExternalIdByLoanExternalIdBuydownFees({ loanExternalId }) });
export const prefetchUseLoanBuyDownFeesServiceGetV1LoansByLoanIdBuydownFees = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanBuyDownFeesServiceGetV1LoansByLoanIdBuydownFeesKeyFn({ loanId }), queryFn: () => LoanBuyDownFeesService.getV1LoansByLoanIdBuydownFees({ loanId }) });
export const prefetchUseLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdCapitalizedIncomes = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdCapitalizedIncomesKeyFn({ loanExternalId }), queryFn: () => LoanCapitalizedIncomeService.getV1LoansExternalIdByLoanExternalIdCapitalizedIncomes({ loanExternalId }) });
export const prefetchUseLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdDeferredincome = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdDeferredincomeKeyFn({ loanExternalId }), queryFn: () => LoanCapitalizedIncomeService.getV1LoansExternalIdByLoanExternalIdDeferredincome({ loanExternalId }) });
export const prefetchUseLoanCapitalizedIncomeServiceGetV1LoansByLoanIdCapitalizedIncomes = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanCapitalizedIncomeServiceGetV1LoansByLoanIdCapitalizedIncomesKeyFn({ loanId }), queryFn: () => LoanCapitalizedIncomeService.getV1LoansByLoanIdCapitalizedIncomes({ loanId }) });
export const prefetchUseLoanCapitalizedIncomeServiceGetV1LoansByLoanIdDeferredincome = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanCapitalizedIncomeServiceGetV1LoansByLoanIdDeferredincomeKeyFn({ loanId }), queryFn: () => LoanCapitalizedIncomeService.getV1LoansByLoanIdDeferredincome({ loanId }) });
export const prefetchUseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdCharges = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesKeyFn({ loanExternalId }), queryFn: () => LoanChargesService.getV1LoansExternalIdByLoanExternalIdCharges({ loanExternalId }) });
export const prefetchUseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalId = (queryClient: QueryClient, { loanChargeExternalId, loanExternalId }: {
  loanChargeExternalId: string;
  loanExternalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdKeyFn({ loanChargeExternalId, loanExternalId }), queryFn: () => LoanChargesService.getV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalId({ loanChargeExternalId, loanExternalId }) });
export const prefetchUseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesTemplate = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesTemplateKeyFn({ loanExternalId }), queryFn: () => LoanChargesService.getV1LoansExternalIdByLoanExternalIdChargesTemplate({ loanExternalId }) });
export const prefetchUseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesByLoanChargeId = (queryClient: QueryClient, { loanChargeId, loanExternalId }: {
  loanChargeId: number;
  loanExternalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdKeyFn({ loanChargeId, loanExternalId }), queryFn: () => LoanChargesService.getV1LoansExternalIdByLoanExternalIdChargesByLoanChargeId({ loanChargeId, loanExternalId }) });
export const prefetchUseLoanChargesServiceGetV1LoansByLoanIdCharges = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanChargesServiceGetV1LoansByLoanIdChargesKeyFn({ loanId }), queryFn: () => LoanChargesService.getV1LoansByLoanIdCharges({ loanId }) });
export const prefetchUseLoanChargesServiceGetV1LoansByLoanIdChargesExternalIdByLoanChargeExternalId = (queryClient: QueryClient, { loanChargeExternalId, loanId }: {
  loanChargeExternalId: string;
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanChargesServiceGetV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdKeyFn({ loanChargeExternalId, loanId }), queryFn: () => LoanChargesService.getV1LoansByLoanIdChargesExternalIdByLoanChargeExternalId({ loanChargeExternalId, loanId }) });
export const prefetchUseLoanChargesServiceGetV1LoansByLoanIdChargesTemplate = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanChargesServiceGetV1LoansByLoanIdChargesTemplateKeyFn({ loanId }), queryFn: () => LoanChargesService.getV1LoansByLoanIdChargesTemplate({ loanId }) });
export const prefetchUseLoanChargesServiceGetV1LoansByLoanIdChargesByLoanChargeId = (queryClient: QueryClient, { loanChargeId, loanId }: {
  loanChargeId: number;
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanChargesServiceGetV1LoansByLoanIdChargesByLoanChargeIdKeyFn({ loanChargeId, loanId }), queryFn: () => LoanChargesService.getV1LoansByLoanIdChargesByLoanChargeId({ loanChargeId, loanId }) });
export const prefetchUseLoanInterestPauseServiceGetV1LoansExternalIdByLoanExternalIdInterestPauses = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanInterestPauseServiceGetV1LoansExternalIdByLoanExternalIdInterestPausesKeyFn({ loanExternalId }), queryFn: () => LoanInterestPauseService.getV1LoansExternalIdByLoanExternalIdInterestPauses({ loanExternalId }) });
export const prefetchUseLoanInterestPauseServiceGetV1LoansByLoanIdInterestPauses = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanInterestPauseServiceGetV1LoansByLoanIdInterestPausesKeyFn({ loanId }), queryFn: () => LoanInterestPauseService.getV1LoansByLoanIdInterestPauses({ loanId }) });
export const prefetchUseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactions = (queryClient: QueryClient, { excludedTypes, loanExternalId, page, size, sort }: {
  excludedTypes?: TransactionType[];
  loanExternalId: string;
  page?: number;
  size?: number;
  sort?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsKeyFn({ excludedTypes, loanExternalId, page, size, sort }), queryFn: () => LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactions({ excludedTypes, loanExternalId, page, size, sort }) });
export const prefetchUseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionId = (queryClient: QueryClient, { externalTransactionId, fields, loanExternalId }: {
  externalTransactionId: string;
  fields?: string;
  loanExternalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionIdKeyFn({ externalTransactionId, fields, loanExternalId }), queryFn: () => LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionId({ externalTransactionId, fields, loanExternalId }) });
export const prefetchUseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsTemplate = (queryClient: QueryClient, { command, dateFormat, loanExternalId, locale, transactionDate, transactionId }: {
  command?: string;
  dateFormat?: string;
  loanExternalId: string;
  locale?: string;
  transactionDate?: DateParam;
  transactionId?: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsTemplateKeyFn({ command, dateFormat, loanExternalId, locale, transactionDate, transactionId }), queryFn: () => LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactionsTemplate({ command, dateFormat, loanExternalId, locale, transactionDate, transactionId }) });
export const prefetchUseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsByTransactionId = (queryClient: QueryClient, { fields, loanExternalId, transactionId }: {
  fields?: string;
  loanExternalId: string;
  transactionId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdKeyFn({ fields, loanExternalId, transactionId }), queryFn: () => LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactionsByTransactionId({ fields, loanExternalId, transactionId }) });
export const prefetchUseLoanTransactionsServiceGetV1LoansByLoanIdTransactions = (queryClient: QueryClient, { excludedTypes, loanId, page, size, sort }: {
  excludedTypes?: TransactionType[];
  loanId: number;
  page?: number;
  size?: number;
  sort?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsKeyFn({ excludedTypes, loanId, page, size, sort }), queryFn: () => LoanTransactionsService.getV1LoansByLoanIdTransactions({ excludedTypes, loanId, page, size, sort }) });
export const prefetchUseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsExternalIdByExternalTransactionId = (queryClient: QueryClient, { externalTransactionId, fields, loanId }: {
  externalTransactionId: string;
  fields?: string;
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsExternalIdByExternalTransactionIdKeyFn({ externalTransactionId, fields, loanId }), queryFn: () => LoanTransactionsService.getV1LoansByLoanIdTransactionsExternalIdByExternalTransactionId({ externalTransactionId, fields, loanId }) });
export const prefetchUseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsTemplate = (queryClient: QueryClient, { command, dateFormat, loanId, locale, transactionDate, transactionId }: {
  command?: string;
  dateFormat?: string;
  loanId: number;
  locale?: string;
  transactionDate?: DateParam;
  transactionId?: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsTemplateKeyFn({ command, dateFormat, loanId, locale, transactionDate, transactionId }), queryFn: () => LoanTransactionsService.getV1LoansByLoanIdTransactionsTemplate({ command, dateFormat, loanId, locale, transactionDate, transactionId }) });
export const prefetchUseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsByTransactionId = (queryClient: QueryClient, { fields, loanId, transactionId }: {
  fields?: string;
  loanId: number;
  transactionId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsByTransactionIdKeyFn({ fields, loanId, transactionId }), queryFn: () => LoanTransactionsService.getV1LoansByLoanIdTransactionsByTransactionId({ fields, loanId, transactionId }) });
export const prefetchUseBulkLoansServiceGetV1LoansLoanreassignmentTemplate = (queryClient: QueryClient, { fromLoanOfficerId, officeId }: {
  fromLoanOfficerId?: number;
  officeId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseBulkLoansServiceGetV1LoansLoanreassignmentTemplateKeyFn({ fromLoanOfficerId, officeId }), queryFn: () => BulkLoansService.getV1LoansLoanreassignmentTemplate({ fromLoanOfficerId, officeId }) });
export const prefetchUseLoanAccountLockServiceGetV1LoansLocked = (queryClient: QueryClient, { limit, page }: {
  limit?: number;
  page?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanAccountLockServiceGetV1LoansLockedKeyFn({ limit, page }), queryFn: () => LoanAccountLockService.getV1LoansLocked({ limit, page }) });
export const prefetchUseLoanCollateralServiceGetV1LoansByLoanIdCollaterals = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanCollateralServiceGetV1LoansByLoanIdCollateralsKeyFn({ loanId }), queryFn: () => LoanCollateralService.getV1LoansByLoanIdCollaterals({ loanId }) });
export const prefetchUseLoanCollateralServiceGetV1LoansByLoanIdCollateralsTemplate = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanCollateralServiceGetV1LoansByLoanIdCollateralsTemplateKeyFn({ loanId }), queryFn: () => LoanCollateralService.getV1LoansByLoanIdCollateralsTemplate({ loanId }) });
export const prefetchUseLoanCollateralServiceGetV1LoansByLoanIdCollateralsByCollateralId = (queryClient: QueryClient, { collateralId, loanId }: {
  collateralId: number;
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanCollateralServiceGetV1LoansByLoanIdCollateralsByCollateralIdKeyFn({ collateralId, loanId }), queryFn: () => LoanCollateralService.getV1LoansByLoanIdCollateralsByCollateralId({ collateralId, loanId }) });
export const prefetchUseLoanDisbursementDetailsServiceGetV1LoansByLoanIdDisbursementsByDisbursementId = (queryClient: QueryClient, { disbursementId, loanId }: {
  disbursementId: number;
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseLoanDisbursementDetailsServiceGetV1LoansByLoanIdDisbursementsByDisbursementIdKeyFn({ disbursementId, loanId }), queryFn: () => LoanDisbursementDetailsService.getV1LoansByLoanIdDisbursementsByDisbursementId({ disbursementId, loanId }) });
export const prefetchUseGuarantorsServiceGetV1LoansByLoanIdGuarantors = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsKeyFn({ loanId }), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantors({ loanId }) });
export const prefetchUseGuarantorsServiceGetV1LoansByLoanIdGuarantorsAccountsTemplate = (queryClient: QueryClient, { clientId, loanId }: {
  clientId?: number;
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsAccountsTemplateKeyFn({ clientId, loanId }), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantorsAccountsTemplate({ clientId, loanId }) });
export const prefetchUseGuarantorsServiceGetV1LoansByLoanIdGuarantorsDownloadtemplate = (queryClient: QueryClient, { dateFormat, loanId, officeId }: {
  dateFormat?: string;
  loanId: number;
  officeId?: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsDownloadtemplateKeyFn({ dateFormat, loanId, officeId }), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantorsDownloadtemplate({ dateFormat, loanId, officeId }) });
export const prefetchUseGuarantorsServiceGetV1LoansByLoanIdGuarantorsTemplate = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsTemplateKeyFn({ loanId }), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantorsTemplate({ loanId }) });
export const prefetchUseGuarantorsServiceGetV1LoansByLoanIdGuarantorsByGuarantorId = (queryClient: QueryClient, { guarantorId, loanId }: {
  guarantorId: number;
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsByGuarantorIdKeyFn({ guarantorId, loanId }), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantorsByGuarantorId({ guarantorId, loanId }) });
export const prefetchUseRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecks = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksKeyFn({ loanId }), queryFn: () => RepaymentWithPostDatedChecksService.getV1LoansByLoanIdPostdatedchecks({ loanId }) });
export const prefetchUseRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksByInstallmentId = (queryClient: QueryClient, { installmentId, loanId }: {
  installmentId: number;
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksByInstallmentIdKeyFn({ installmentId, loanId }), queryFn: () => RepaymentWithPostDatedChecksService.getV1LoansByLoanIdPostdatedchecksByInstallmentId({ installmentId, loanId }) });
export const prefetchUseMakerCheckerOr4EyeFunctionalityServiceGetV1Makercheckers = (queryClient: QueryClient, { actionName, clientId, entityName, groupId, loanid, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, resourceId, savingsAccountId }: {
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
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersKeyFn({ actionName, clientId, entityName, groupId, loanid, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, resourceId, savingsAccountId }), queryFn: () => MakerCheckerOr4EyeFunctionalityService.getV1Makercheckers({ actionName, clientId, entityName, groupId, loanid, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, resourceId, savingsAccountId }) });
export const prefetchUseMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSearchtemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSearchtemplateKeyFn(), queryFn: () => MakerCheckerOr4EyeFunctionalityService.getV1MakercheckersSearchtemplate() });
export const prefetchUseMixMappingServiceGetV1Mixmapping = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseMixMappingServiceGetV1MixmappingKeyFn(), queryFn: () => MixMappingService.getV1Mixmapping() });
export const prefetchUseMixReportServiceGetV1Mixreport = (queryClient: QueryClient, { currency, endDate, startDate }: {
  currency?: string;
  endDate?: string;
  startDate?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseMixReportServiceGetV1MixreportKeyFn({ currency, endDate, startDate }), queryFn: () => MixReportService.getV1Mixreport({ currency, endDate, startDate }) });
export const prefetchUseMixTaxonomyServiceGetV1Mixtaxonomy = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseMixTaxonomyServiceGetV1MixtaxonomyKeyFn(), queryFn: () => MixTaxonomyService.getV1Mixtaxonomy() });
export const prefetchUseNotificationServiceGetV1Notifications = (queryClient: QueryClient, { isRead, limit, offset, orderBy, sortOrder }: {
  isRead?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseNotificationServiceGetV1NotificationsKeyFn({ isRead, limit, offset, orderBy, sortOrder }), queryFn: () => NotificationService.getV1Notifications({ isRead, limit, offset, orderBy, sortOrder }) });
export const prefetchUseOfficesServiceGetV1Offices = (queryClient: QueryClient, { includeAllOffices, orderBy, sortOrder }: {
  includeAllOffices?: boolean;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseOfficesServiceGetV1OfficesKeyFn({ includeAllOffices, orderBy, sortOrder }), queryFn: () => OfficesService.getV1Offices({ includeAllOffices, orderBy, sortOrder }) });
export const prefetchUseOfficesServiceGetV1OfficesDownloadtemplate = (queryClient: QueryClient, { dateFormat }: {
  dateFormat?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseOfficesServiceGetV1OfficesDownloadtemplateKeyFn({ dateFormat }), queryFn: () => OfficesService.getV1OfficesDownloadtemplate({ dateFormat }) });
export const prefetchUseOfficesServiceGetV1OfficesExternalIdByExternalId = (queryClient: QueryClient, { externalId }: {
  externalId: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseOfficesServiceGetV1OfficesExternalIdByExternalIdKeyFn({ externalId }), queryFn: () => OfficesService.getV1OfficesExternalIdByExternalId({ externalId }) });
export const prefetchUseOfficesServiceGetV1OfficesTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseOfficesServiceGetV1OfficesTemplateKeyFn(), queryFn: () => OfficesService.getV1OfficesTemplate() });
export const prefetchUseOfficesServiceGetV1OfficesByOfficeId = (queryClient: QueryClient, { officeId }: {
  officeId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseOfficesServiceGetV1OfficesByOfficeIdKeyFn({ officeId }), queryFn: () => OfficesService.getV1OfficesByOfficeId({ officeId }) });
export const prefetchUsePasswordPreferencesServiceGetV1Passwordpreferences = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UsePasswordPreferencesServiceGetV1PasswordpreferencesKeyFn(), queryFn: () => PasswordPreferencesService.getV1Passwordpreferences() });
export const prefetchUsePasswordPreferencesServiceGetV1PasswordpreferencesTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UsePasswordPreferencesServiceGetV1PasswordpreferencesTemplateKeyFn(), queryFn: () => PasswordPreferencesService.getV1PasswordpreferencesTemplate() });
export const prefetchUsePaymentTypeServiceGetV1Paymenttypes = (queryClient: QueryClient, { onlyWithCode }: {
  onlyWithCode?: boolean;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UsePaymentTypeServiceGetV1PaymenttypesKeyFn({ onlyWithCode }), queryFn: () => PaymentTypeService.getV1Paymenttypes({ onlyWithCode }) });
export const prefetchUsePaymentTypeServiceGetV1PaymenttypesByPaymentTypeId = (queryClient: QueryClient, { paymentTypeId }: {
  paymentTypeId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UsePaymentTypeServiceGetV1PaymenttypesByPaymentTypeIdKeyFn({ paymentTypeId }), queryFn: () => PaymentTypeService.getV1PaymenttypesByPaymentTypeId({ paymentTypeId }) });
export const prefetchUsePermissionsServiceGetV1Permissions = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UsePermissionsServiceGetV1PermissionsKeyFn(), queryFn: () => PermissionsService.getV1Permissions() });
export const prefetchUsePovertyLineServiceGetV1PovertyLineByPpiName = (queryClient: QueryClient, { ppiName }: {
  ppiName: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UsePovertyLineServiceGetV1PovertyLineByPpiNameKeyFn({ ppiName }), queryFn: () => PovertyLineService.getV1PovertyLineByPpiName({ ppiName }) });
export const prefetchUsePovertyLineServiceGetV1PovertyLineByPpiNameByLikelihoodId = (queryClient: QueryClient, { likelihoodId, ppiName }: {
  likelihoodId: number;
  ppiName: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UsePovertyLineServiceGetV1PovertyLineByPpiNameByLikelihoodIdKeyFn({ likelihoodId, ppiName }), queryFn: () => PovertyLineService.getV1PovertyLineByPpiNameByLikelihoodId({ likelihoodId, ppiName }) });
export const prefetchUseProductsServiceGetV1ProductsByType = (queryClient: QueryClient, { limit, offset, type }: {
  limit?: number;
  offset?: number;
  type: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseProductsServiceGetV1ProductsByTypeKeyFn({ limit, offset, type }), queryFn: () => ProductsService.getV1ProductsByType({ limit, offset, type }) });
export const prefetchUseProductsServiceGetV1ProductsByTypeTemplate = (queryClient: QueryClient, { type }: {
  type: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseProductsServiceGetV1ProductsByTypeTemplateKeyFn({ type }), queryFn: () => ProductsService.getV1ProductsByTypeTemplate({ type }) });
export const prefetchUseProductsServiceGetV1ProductsByTypeByProductId = (queryClient: QueryClient, { productId, type }: {
  productId: number;
  type: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseProductsServiceGetV1ProductsByTypeByProductIdKeyFn({ productId, type }), queryFn: () => ProductsService.getV1ProductsByTypeByProductId({ productId, type }) });
export const prefetchUseProvisioningCategoryServiceGetV1Provisioningcategory = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseProvisioningCategoryServiceGetV1ProvisioningcategoryKeyFn(), queryFn: () => ProvisioningCategoryService.getV1Provisioningcategory() });
export const prefetchUseProvisioningCriteriaServiceGetV1Provisioningcriteria = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseProvisioningCriteriaServiceGetV1ProvisioningcriteriaKeyFn(), queryFn: () => ProvisioningCriteriaService.getV1Provisioningcriteria() });
export const prefetchUseProvisioningCriteriaServiceGetV1ProvisioningcriteriaTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseProvisioningCriteriaServiceGetV1ProvisioningcriteriaTemplateKeyFn(), queryFn: () => ProvisioningCriteriaService.getV1ProvisioningcriteriaTemplate() });
export const prefetchUseProvisioningCriteriaServiceGetV1ProvisioningcriteriaByCriteriaId = (queryClient: QueryClient, { criteriaId }: {
  criteriaId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseProvisioningCriteriaServiceGetV1ProvisioningcriteriaByCriteriaIdKeyFn({ criteriaId }), queryFn: () => ProvisioningCriteriaService.getV1ProvisioningcriteriaByCriteriaId({ criteriaId }) });
export const prefetchUseProvisioningEntriesServiceGetV1Provisioningentries = (queryClient: QueryClient, { limit, offset }: {
  limit?: number;
  offset?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseProvisioningEntriesServiceGetV1ProvisioningentriesKeyFn({ limit, offset }), queryFn: () => ProvisioningEntriesService.getV1Provisioningentries({ limit, offset }) });
export const prefetchUseProvisioningEntriesServiceGetV1ProvisioningentriesEntries = (queryClient: QueryClient, { categoryId, entryId, limit, officeId, offset, productId }: {
  categoryId?: number;
  entryId?: number;
  limit?: number;
  officeId?: number;
  offset?: number;
  productId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseProvisioningEntriesServiceGetV1ProvisioningentriesEntriesKeyFn({ categoryId, entryId, limit, officeId, offset, productId }), queryFn: () => ProvisioningEntriesService.getV1ProvisioningentriesEntries({ categoryId, entryId, limit, officeId, offset, productId }) });
export const prefetchUseProvisioningEntriesServiceGetV1ProvisioningentriesByEntryId = (queryClient: QueryClient, { entryId }: {
  entryId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseProvisioningEntriesServiceGetV1ProvisioningentriesByEntryIdKeyFn({ entryId }), queryFn: () => ProvisioningEntriesService.getV1ProvisioningentriesByEntryId({ entryId }) });
export const prefetchUseRateServiceGetV1Rates = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseRateServiceGetV1RatesKeyFn(), queryFn: () => RateService.getV1Rates() });
export const prefetchUseRateServiceGetV1RatesByRateId = (queryClient: QueryClient, { rateId }: {
  rateId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseRateServiceGetV1RatesByRateIdKeyFn({ rateId }), queryFn: () => RateService.getV1RatesByRateId({ rateId }) });
export const prefetchUseRecurringDepositAccountServiceGetV1Recurringdepositaccounts = (queryClient: QueryClient, { limit, offset, orderBy, paged, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  paged?: boolean;
  sortOrder?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsKeyFn({ limit, offset, orderBy, paged, sortOrder }), queryFn: () => RecurringDepositAccountService.getV1Recurringdepositaccounts({ limit, offset, orderBy, paged, sortOrder }) });
export const prefetchUseRecurringDepositAccountServiceGetV1RecurringdepositaccountsDownloadtemplate = (queryClient: QueryClient, { dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsDownloadtemplateKeyFn({ dateFormat, officeId, staffId }), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsDownloadtemplate({ dateFormat, officeId, staffId }) });
export const prefetchUseRecurringDepositAccountServiceGetV1RecurringdepositaccountsTemplate = (queryClient: QueryClient, { clientId, groupId, productId, staffInSelectedOfficeOnly }: {
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsTemplateKeyFn({ clientId, groupId, productId, staffInSelectedOfficeOnly }), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsTemplate({ clientId, groupId, productId, staffInSelectedOfficeOnly }) });
export const prefetchUseRecurringDepositAccountServiceGetV1RecurringdepositaccountsTransactionsDownloadtemplate = (queryClient: QueryClient, { dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsTransactionsDownloadtemplateKeyFn({ dateFormat, officeId }), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsTransactionsDownloadtemplate({ dateFormat, officeId }) });
export const prefetchUseRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountId = (queryClient: QueryClient, { accountId, chargeStatus, staffInSelectedOfficeOnly }: {
  accountId: number;
  chargeStatus?: string;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.prefetchQuery({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdKeyFn({ accountId, chargeStatus, staffInSelectedOfficeOnly }), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsByAccountId({ accountId, chargeStatus, staffInSelectedOfficeOnly }) });
export const prefetchUseRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdTemplate = (queryClient: QueryClient, { accountId, command }: {
  accountId: number;
  command?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdTemplateKeyFn({ accountId, command }), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsByAccountIdTemplate({ accountId, command }) });
export const prefetchUseRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplate = (queryClient: QueryClient, { command, recurringDepositAccountId }: {
  command?: string;
  recurringDepositAccountId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplateKeyFn({ command, recurringDepositAccountId }), queryFn: () => RecurringDepositAccountTransactionsService.getV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplate({ command, recurringDepositAccountId }) });
export const prefetchUseRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionId = (queryClient: QueryClient, { recurringDepositAccountId, transactionId }: {
  recurringDepositAccountId: number;
  transactionId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionIdKeyFn({ recurringDepositAccountId, transactionId }), queryFn: () => RecurringDepositAccountTransactionsService.getV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionId({ recurringDepositAccountId, transactionId }) });
export const prefetchUseRecurringDepositProductServiceGetV1Recurringdepositproducts = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseRecurringDepositProductServiceGetV1RecurringdepositproductsKeyFn(), queryFn: () => RecurringDepositProductService.getV1Recurringdepositproducts() });
export const prefetchUseRecurringDepositProductServiceGetV1RecurringdepositproductsTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseRecurringDepositProductServiceGetV1RecurringdepositproductsTemplateKeyFn(), queryFn: () => RecurringDepositProductService.getV1RecurringdepositproductsTemplate() });
export const prefetchUseRecurringDepositProductServiceGetV1RecurringdepositproductsByProductId = (queryClient: QueryClient, { productId }: {
  productId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseRecurringDepositProductServiceGetV1RecurringdepositproductsByProductIdKeyFn({ productId }), queryFn: () => RecurringDepositProductService.getV1RecurringdepositproductsByProductId({ productId }) });
export const prefetchUseListReportMailingJobHistoryServiceGetV1Reportmailingjobrunhistory = (queryClient: QueryClient, { limit, offset, orderBy, reportMailingJobId, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  reportMailingJobId?: number;
  sortOrder?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseListReportMailingJobHistoryServiceGetV1ReportmailingjobrunhistoryKeyFn({ limit, offset, orderBy, reportMailingJobId, sortOrder }), queryFn: () => ListReportMailingJobHistoryService.getV1Reportmailingjobrunhistory({ limit, offset, orderBy, reportMailingJobId, sortOrder }) });
export const prefetchUseReportMailingJobsServiceGetV1Reportmailingjobs = (queryClient: QueryClient, { limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseReportMailingJobsServiceGetV1ReportmailingjobsKeyFn({ limit, offset, orderBy, sortOrder }), queryFn: () => ReportMailingJobsService.getV1Reportmailingjobs({ limit, offset, orderBy, sortOrder }) });
export const prefetchUseReportMailingJobsServiceGetV1ReportmailingjobsTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseReportMailingJobsServiceGetV1ReportmailingjobsTemplateKeyFn(), queryFn: () => ReportMailingJobsService.getV1ReportmailingjobsTemplate() });
export const prefetchUseReportMailingJobsServiceGetV1ReportmailingjobsByEntityId = (queryClient: QueryClient, { entityId }: {
  entityId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseReportMailingJobsServiceGetV1ReportmailingjobsByEntityIdKeyFn({ entityId }), queryFn: () => ReportMailingJobsService.getV1ReportmailingjobsByEntityId({ entityId }) });
export const prefetchUseReportsServiceGetV1Reports = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseReportsServiceGetV1ReportsKeyFn(), queryFn: () => ReportsService.getV1Reports() });
export const prefetchUseReportsServiceGetV1ReportsTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseReportsServiceGetV1ReportsTemplateKeyFn(), queryFn: () => ReportsService.getV1ReportsTemplate() });
export const prefetchUseReportsServiceGetV1ReportsById = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseReportsServiceGetV1ReportsByIdKeyFn({ id }), queryFn: () => ReportsService.getV1ReportsById({ id }) });
export const prefetchUseRescheduleLoansServiceGetV1Rescheduleloans = (queryClient: QueryClient, { command, loanId }: {
  command?: string;
  loanId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseRescheduleLoansServiceGetV1RescheduleloansKeyFn({ command, loanId }), queryFn: () => RescheduleLoansService.getV1Rescheduleloans({ command, loanId }) });
export const prefetchUseRescheduleLoansServiceGetV1RescheduleloansTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseRescheduleLoansServiceGetV1RescheduleloansTemplateKeyFn(), queryFn: () => RescheduleLoansService.getV1RescheduleloansTemplate() });
export const prefetchUseRescheduleLoansServiceGetV1RescheduleloansByScheduleId = (queryClient: QueryClient, { command, scheduleId }: {
  command?: string;
  scheduleId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseRescheduleLoansServiceGetV1RescheduleloansByScheduleIdKeyFn({ command, scheduleId }), queryFn: () => RescheduleLoansService.getV1RescheduleloansByScheduleId({ command, scheduleId }) });
export const prefetchUseRolesServiceGetV1Roles = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseRolesServiceGetV1RolesKeyFn(), queryFn: () => RolesService.getV1Roles() });
export const prefetchUseRolesServiceGetV1RolesByRoleId = (queryClient: QueryClient, { roleId }: {
  roleId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseRolesServiceGetV1RolesByRoleIdKeyFn({ roleId }), queryFn: () => RolesService.getV1RolesByRoleId({ roleId }) });
export const prefetchUseRolesServiceGetV1RolesByRoleIdPermissions = (queryClient: QueryClient, { roleId }: {
  roleId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseRolesServiceGetV1RolesByRoleIdPermissionsKeyFn({ roleId }), queryFn: () => RolesService.getV1RolesByRoleIdPermissions({ roleId }) });
export const prefetchUseRunReportsServiceGetV1RunreportsAvailableExportsByReportName = (queryClient: QueryClient, { isSelfServiceUserReport, reportName }: {
  isSelfServiceUserReport?: boolean;
  reportName: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseRunReportsServiceGetV1RunreportsAvailableExportsByReportNameKeyFn({ isSelfServiceUserReport, reportName }), queryFn: () => RunReportsService.getV1RunreportsAvailableExportsByReportName({ isSelfServiceUserReport, reportName }) });
export const prefetchUseRunReportsServiceGetV1RunreportsByReportName = (queryClient: QueryClient, { isSelfServiceUserReport, reportName }: {
  isSelfServiceUserReport?: boolean;
  reportName: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseRunReportsServiceGetV1RunreportsByReportNameKeyFn({ isSelfServiceUserReport, reportName }), queryFn: () => RunReportsService.getV1RunreportsByReportName({ isSelfServiceUserReport, reportName }) });
export const prefetchUseSavingsAccountServiceGetV1Savingsaccounts = (queryClient: QueryClient, { externalId, limit, offset, orderBy, sortOrder }: {
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsKeyFn({ externalId, limit, offset, orderBy, sortOrder }), queryFn: () => SavingsAccountService.getV1Savingsaccounts({ externalId, limit, offset, orderBy, sortOrder }) });
export const prefetchUseSavingsAccountServiceGetV1SavingsaccountsDownloadtemplate = (queryClient: QueryClient, { dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsDownloadtemplateKeyFn({ dateFormat, officeId, staffId }), queryFn: () => SavingsAccountService.getV1SavingsaccountsDownloadtemplate({ dateFormat, officeId, staffId }) });
export const prefetchUseSavingsAccountServiceGetV1SavingsaccountsExternalIdByExternalId = (queryClient: QueryClient, { associations, chargeStatus, externalId, staffInSelectedOfficeOnly }: {
  associations?: string;
  chargeStatus?: string;
  externalId: string;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsExternalIdByExternalIdKeyFn({ associations, chargeStatus, externalId, staffInSelectedOfficeOnly }), queryFn: () => SavingsAccountService.getV1SavingsaccountsExternalIdByExternalId({ associations, chargeStatus, externalId, staffInSelectedOfficeOnly }) });
export const prefetchUseSavingsAccountServiceGetV1SavingsaccountsTemplate = (queryClient: QueryClient, { clientId, groupId, productId, staffInSelectedOfficeOnly }: {
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsTemplateKeyFn({ clientId, groupId, productId, staffInSelectedOfficeOnly }), queryFn: () => SavingsAccountService.getV1SavingsaccountsTemplate({ clientId, groupId, productId, staffInSelectedOfficeOnly }) });
export const prefetchUseSavingsAccountServiceGetV1SavingsaccountsTransactionsDownloadtemplate = (queryClient: QueryClient, { dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsTransactionsDownloadtemplateKeyFn({ dateFormat, officeId }), queryFn: () => SavingsAccountService.getV1SavingsaccountsTransactionsDownloadtemplate({ dateFormat, officeId }) });
export const prefetchUseSavingsAccountServiceGetV1SavingsaccountsByAccountId = (queryClient: QueryClient, { accountId, associations, chargeStatus, staffInSelectedOfficeOnly }: {
  accountId: number;
  associations?: string;
  chargeStatus?: string;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsByAccountIdKeyFn({ accountId, associations, chargeStatus, staffInSelectedOfficeOnly }), queryFn: () => SavingsAccountService.getV1SavingsaccountsByAccountId({ accountId, associations, chargeStatus, staffInSelectedOfficeOnly }) });
export const prefetchUseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdCharges = (queryClient: QueryClient, { chargeStatus, savingsAccountId }: {
  chargeStatus?: string;
  savingsAccountId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesKeyFn({ chargeStatus, savingsAccountId }), queryFn: () => SavingsChargesService.getV1SavingsaccountsBySavingsAccountIdCharges({ chargeStatus, savingsAccountId }) });
export const prefetchUseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesTemplate = (queryClient: QueryClient, { savingsAccountId }: {
  savingsAccountId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesTemplateKeyFn({ savingsAccountId }), queryFn: () => SavingsChargesService.getV1SavingsaccountsBySavingsAccountIdChargesTemplate({ savingsAccountId }) });
export const prefetchUseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeId = (queryClient: QueryClient, { savingsAccountChargeId, savingsAccountId }: {
  savingsAccountChargeId: number;
  savingsAccountId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdKeyFn({ savingsAccountChargeId, savingsAccountId }), queryFn: () => SavingsChargesService.getV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeId({ savingsAccountChargeId, savingsAccountId }) });
export const prefetchUseDepositAccountOnHoldFundTransactionsServiceGetV1SavingsaccountsBySavingsIdOnholdtransactions = (queryClient: QueryClient, { guarantorFundingId, limit, offset, orderBy, savingsId, sortOrder }: {
  guarantorFundingId?: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  savingsId: number;
  sortOrder?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDepositAccountOnHoldFundTransactionsServiceGetV1SavingsaccountsBySavingsIdOnholdtransactionsKeyFn({ guarantorFundingId, limit, offset, orderBy, savingsId, sortOrder }), queryFn: () => DepositAccountOnHoldFundTransactionsService.getV1SavingsaccountsBySavingsIdOnholdtransactions({ guarantorFundingId, limit, offset, orderBy, savingsId, sortOrder }) });
export const prefetchUseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsSearch = (queryClient: QueryClient, { credit, dateFormat, debit, fromAmount, fromDate, fromSubmittedDate, limit, locale, offset, orderBy, savingsId, sortOrder, toAmount, toDate, toSubmittedDate, types }: {
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
}) => queryClient.prefetchQuery({ queryKey: Common.UseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsSearchKeyFn({ credit, dateFormat, debit, fromAmount, fromDate, fromSubmittedDate, limit, locale, offset, orderBy, savingsId, sortOrder, toAmount, toDate, toSubmittedDate, types }), queryFn: () => SavingsAccountTransactionsService.getV1SavingsaccountsBySavingsIdTransactionsSearch({ credit, dateFormat, debit, fromAmount, fromDate, fromSubmittedDate, limit, locale, offset, orderBy, savingsId, sortOrder, toAmount, toDate, toSubmittedDate, types }) });
export const prefetchUseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsTemplate = (queryClient: QueryClient, { savingsId }: {
  savingsId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsTemplateKeyFn({ savingsId }), queryFn: () => SavingsAccountTransactionsService.getV1SavingsaccountsBySavingsIdTransactionsTemplate({ savingsId }) });
export const prefetchUseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsByTransactionId = (queryClient: QueryClient, { savingsId, transactionId }: {
  savingsId: number;
  transactionId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsByTransactionIdKeyFn({ savingsId, transactionId }), queryFn: () => SavingsAccountTransactionsService.getV1SavingsaccountsBySavingsIdTransactionsByTransactionId({ savingsId, transactionId }) });
export const prefetchUseSavingsProductServiceGetV1Savingsproducts = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseSavingsProductServiceGetV1SavingsproductsKeyFn(), queryFn: () => SavingsProductService.getV1Savingsproducts() });
export const prefetchUseSavingsProductServiceGetV1SavingsproductsTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseSavingsProductServiceGetV1SavingsproductsTemplateKeyFn(), queryFn: () => SavingsProductService.getV1SavingsproductsTemplate() });
export const prefetchUseSavingsProductServiceGetV1SavingsproductsByProductId = (queryClient: QueryClient, { productId }: {
  productId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSavingsProductServiceGetV1SavingsproductsByProductIdKeyFn({ productId }), queryFn: () => SavingsProductService.getV1SavingsproductsByProductId({ productId }) });
export const prefetchUseSchedulerServiceGetV1Scheduler = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseSchedulerServiceGetV1SchedulerKeyFn(), queryFn: () => SchedulerService.getV1Scheduler() });
export const prefetchUseSearchApiServiceGetV1Search = (queryClient: QueryClient, { exactMatch, query, resource }: {
  exactMatch?: boolean;
  query?: string;
  resource?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseSearchApiServiceGetV1SearchKeyFn({ exactMatch, query, resource }), queryFn: () => SearchApiService.getV1Search({ exactMatch, query, resource }) });
export const prefetchUseSearchApiServiceGetV1SearchTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseSearchApiServiceGetV1SearchTemplateKeyFn(), queryFn: () => SearchApiService.getV1SearchTemplate() });
export const prefetchUseSelfAccountTransferServiceGetV1SelfAccounttransfersTemplate = (queryClient: QueryClient, { type }: {
  type?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfAccountTransferServiceGetV1SelfAccounttransfersTemplateKeyFn({ type }), queryFn: () => SelfAccountTransferService.getV1SelfAccounttransfersTemplate({ type }) });
export const prefetchUseSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTpt = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptKeyFn(), queryFn: () => SelfThirdPartyTransferService.getV1SelfBeneficiariesTpt() });
export const prefetchUseSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptTemplateKeyFn(), queryFn: () => SelfThirdPartyTransferService.getV1SelfBeneficiariesTptTemplate() });
export const prefetchUseSelfClientServiceGetV1SelfClients = (queryClient: QueryClient, { displayName, firstName, lastName, legalForm, limit, offset, orderBy, sortOrder, status }: {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  legalForm?: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  status?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsKeyFn({ displayName, firstName, lastName, legalForm, limit, offset, orderBy, sortOrder, status }), queryFn: () => SelfClientService.getV1SelfClients({ displayName, firstName, lastName, legalForm, limit, offset, orderBy, sortOrder, status }) });
export const prefetchUseSelfClientServiceGetV1SelfClientsByClientId = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdKeyFn({ clientId }), queryFn: () => SelfClientService.getV1SelfClientsByClientId({ clientId }) });
export const prefetchUseSelfClientServiceGetV1SelfClientsByClientIdAccounts = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdAccountsKeyFn({ clientId }), queryFn: () => SelfClientService.getV1SelfClientsByClientIdAccounts({ clientId }) });
export const prefetchUseSelfClientServiceGetV1SelfClientsByClientIdCharges = (queryClient: QueryClient, { chargeStatus, clientId, limit, offset, pendingPayment }: {
  chargeStatus?: string;
  clientId: number;
  limit?: number;
  offset?: number;
  pendingPayment?: boolean;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdChargesKeyFn({ chargeStatus, clientId, limit, offset, pendingPayment }), queryFn: () => SelfClientService.getV1SelfClientsByClientIdCharges({ chargeStatus, clientId, limit, offset, pendingPayment }) });
export const prefetchUseSelfClientServiceGetV1SelfClientsByClientIdChargesByChargeId = (queryClient: QueryClient, { chargeId, clientId }: {
  chargeId: number;
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdChargesByChargeIdKeyFn({ chargeId, clientId }), queryFn: () => SelfClientService.getV1SelfClientsByClientIdChargesByChargeId({ chargeId, clientId }) });
export const prefetchUseSelfClientServiceGetV1SelfClientsByClientIdImages = (queryClient: QueryClient, { clientId, maxHeight, maxWidth, output }: {
  clientId: number;
  maxHeight?: number;
  maxWidth?: number;
  output?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdImagesKeyFn({ clientId, maxHeight, maxWidth, output }), queryFn: () => SelfClientService.getV1SelfClientsByClientIdImages({ clientId, maxHeight, maxWidth, output }) });
export const prefetchUseSelfClientServiceGetV1SelfClientsByClientIdObligeedetails = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdObligeedetailsKeyFn({ clientId }), queryFn: () => SelfClientService.getV1SelfClientsByClientIdObligeedetails({ clientId }) });
export const prefetchUseSelfClientServiceGetV1SelfClientsByClientIdTransactions = (queryClient: QueryClient, { clientId, limit, offset }: {
  clientId: number;
  limit?: number;
  offset?: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdTransactionsKeyFn({ clientId, limit, offset }), queryFn: () => SelfClientService.getV1SelfClientsByClientIdTransactions({ clientId, limit, offset }) });
export const prefetchUseSelfClientServiceGetV1SelfClientsByClientIdTransactionsByTransactionId = (queryClient: QueryClient, { clientId, transactionId }: {
  clientId: number;
  transactionId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdTransactionsByTransactionIdKeyFn({ clientId, transactionId }), queryFn: () => SelfClientService.getV1SelfClientsByClientIdTransactionsByTransactionId({ clientId, transactionId }) });
export const prefetchUseDeviceRegistrationServiceGetV1SelfDeviceRegistration = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseDeviceRegistrationServiceGetV1SelfDeviceRegistrationKeyFn(), queryFn: () => DeviceRegistrationService.getV1SelfDeviceRegistration() });
export const prefetchUseDeviceRegistrationServiceGetV1SelfDeviceRegistrationClientByClientId = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDeviceRegistrationServiceGetV1SelfDeviceRegistrationClientByClientIdKeyFn({ clientId }), queryFn: () => DeviceRegistrationService.getV1SelfDeviceRegistrationClientByClientId({ clientId }) });
export const prefetchUseDeviceRegistrationServiceGetV1SelfDeviceRegistrationById = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDeviceRegistrationServiceGetV1SelfDeviceRegistrationByIdKeyFn({ id }), queryFn: () => DeviceRegistrationService.getV1SelfDeviceRegistrationById({ id }) });
export const prefetchUseSelfLoanProductsServiceGetV1SelfLoanproducts = (queryClient: QueryClient, { clientId }: {
  clientId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfLoanProductsServiceGetV1SelfLoanproductsKeyFn({ clientId }), queryFn: () => SelfLoanProductsService.getV1SelfLoanproducts({ clientId }) });
export const prefetchUseSelfLoanProductsServiceGetV1SelfLoanproductsByProductId = (queryClient: QueryClient, { clientId, productId }: {
  clientId?: number;
  productId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfLoanProductsServiceGetV1SelfLoanproductsByProductIdKeyFn({ clientId, productId }), queryFn: () => SelfLoanProductsService.getV1SelfLoanproductsByProductId({ clientId, productId }) });
export const prefetchUseSelfLoansServiceGetV1SelfLoansTemplate = (queryClient: QueryClient, { clientId, productId, templateType }: {
  clientId?: number;
  productId?: number;
  templateType?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansTemplateKeyFn({ clientId, productId, templateType }), queryFn: () => SelfLoansService.getV1SelfLoansTemplate({ clientId, productId, templateType }) });
export const prefetchUseSelfLoansServiceGetV1SelfLoansByLoanId = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdKeyFn({ loanId }), queryFn: () => SelfLoansService.getV1SelfLoansByLoanId({ loanId }) });
export const prefetchUseSelfLoansServiceGetV1SelfLoansByLoanIdCharges = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdChargesKeyFn({ loanId }), queryFn: () => SelfLoansService.getV1SelfLoansByLoanIdCharges({ loanId }) });
export const prefetchUseSelfLoansServiceGetV1SelfLoansByLoanIdChargesByChargeId = (queryClient: QueryClient, { chargeId, loanId }: {
  chargeId: number;
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdChargesByChargeIdKeyFn({ chargeId, loanId }), queryFn: () => SelfLoansService.getV1SelfLoansByLoanIdChargesByChargeId({ chargeId, loanId }) });
export const prefetchUseSelfLoansServiceGetV1SelfLoansByLoanIdGuarantors = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdGuarantorsKeyFn({ loanId }), queryFn: () => SelfLoansService.getV1SelfLoansByLoanIdGuarantors({ loanId }) });
export const prefetchUseSelfLoansServiceGetV1SelfLoansByLoanIdTransactionsByTransactionId = (queryClient: QueryClient, { fields, loanId, transactionId }: {
  fields?: string;
  loanId: number;
  transactionId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdTransactionsByTransactionIdKeyFn({ fields, loanId, transactionId }), queryFn: () => SelfLoansService.getV1SelfLoansByLoanIdTransactionsByTransactionId({ fields, loanId, transactionId }) });
export const prefetchUsePocketServiceGetV1SelfPockets = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UsePocketServiceGetV1SelfPocketsKeyFn(), queryFn: () => PocketService.getV1SelfPockets() });
export const prefetchUseSelfShareProductsServiceGetV1SelfProductsShare = (queryClient: QueryClient, { clientId, limit, offset }: {
  clientId?: number;
  limit?: number;
  offset?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfShareProductsServiceGetV1SelfProductsShareKeyFn({ clientId, limit, offset }), queryFn: () => SelfShareProductsService.getV1SelfProductsShare({ clientId, limit, offset }) });
export const prefetchUseSelfShareProductsServiceGetV1SelfProductsShareByProductId = (queryClient: QueryClient, { clientId, productId, type }: {
  clientId?: number;
  productId: number;
  type: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfShareProductsServiceGetV1SelfProductsShareByProductIdKeyFn({ clientId, productId, type }), queryFn: () => SelfShareProductsService.getV1SelfProductsShareByProductId({ clientId, productId, type }) });
export const prefetchUseSelfRunReportServiceGetV1SelfRunreportsByReportName = (queryClient: QueryClient, { reportName }: {
  reportName: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfRunReportServiceGetV1SelfRunreportsByReportNameKeyFn({ reportName }), queryFn: () => SelfRunReportService.getV1SelfRunreportsByReportName({ reportName }) });
export const prefetchUseSelfSavingsAccountServiceGetV1SelfSavingsaccountsTemplate = (queryClient: QueryClient, { clientId, productId }: {
  clientId?: number;
  productId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsTemplateKeyFn({ clientId, productId }), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsTemplate({ clientId, productId }) });
export const prefetchUseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountId = (queryClient: QueryClient, { accountId, associations, chargeStatus }: {
  accountId: number;
  associations?: string;
  chargeStatus?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdKeyFn({ accountId, associations, chargeStatus }), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountId({ accountId, associations, chargeStatus }) });
export const prefetchUseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdCharges = (queryClient: QueryClient, { accountId, chargeStatus }: {
  accountId: number;
  chargeStatus?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesKeyFn({ accountId, chargeStatus }), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountIdCharges({ accountId, chargeStatus }) });
export const prefetchUseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeId = (queryClient: QueryClient, { accountId, savingsAccountChargeId }: {
  accountId: number;
  savingsAccountChargeId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeIdKeyFn({ accountId, savingsAccountChargeId }), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeId({ accountId, savingsAccountChargeId }) });
export const prefetchUseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdTransactionsByTransactionId = (queryClient: QueryClient, { accountId, transactionId }: {
  accountId: number;
  transactionId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdTransactionsByTransactionIdKeyFn({ accountId, transactionId }), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountIdTransactionsByTransactionId({ accountId, transactionId }) });
export const prefetchUseSelfSavingsProductsServiceGetV1SelfSavingsproducts = (queryClient: QueryClient, { clientId }: {
  clientId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfSavingsProductsServiceGetV1SelfSavingsproductsKeyFn({ clientId }), queryFn: () => SelfSavingsProductsService.getV1SelfSavingsproducts({ clientId }) });
export const prefetchUseSelfSavingsProductsServiceGetV1SelfSavingsproductsByProductId = (queryClient: QueryClient, { clientId, productId }: {
  clientId?: number;
  productId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfSavingsProductsServiceGetV1SelfSavingsproductsByProductIdKeyFn({ clientId, productId }), queryFn: () => SelfSavingsProductsService.getV1SelfSavingsproductsByProductId({ clientId, productId }) });
export const prefetchUseSelfShareAccountsServiceGetV1SelfShareaccountsTemplate = (queryClient: QueryClient, { clientId, productId }: {
  clientId?: number;
  productId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfShareAccountsServiceGetV1SelfShareaccountsTemplateKeyFn({ clientId, productId }), queryFn: () => SelfShareAccountsService.getV1SelfShareaccountsTemplate({ clientId, productId }) });
export const prefetchUseSelfShareAccountsServiceGetV1SelfShareaccountsByAccountId = (queryClient: QueryClient, { accountId }: {
  accountId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfShareAccountsServiceGetV1SelfShareaccountsByAccountIdKeyFn({ accountId }), queryFn: () => SelfShareAccountsService.getV1SelfShareaccountsByAccountId({ accountId }) });
export const prefetchUseSelfSpmServiceGetV1SelfSurveys = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseSelfSpmServiceGetV1SelfSurveysKeyFn(), queryFn: () => SelfSpmService.getV1SelfSurveys() });
export const prefetchUseSelfScoreCardServiceGetV1SelfSurveysScorecardsClientsByClientId = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfScoreCardServiceGetV1SelfSurveysScorecardsClientsByClientIdKeyFn({ clientId }), queryFn: () => SelfScoreCardService.getV1SelfSurveysScorecardsClientsByClientId({ clientId }) });
export const prefetchUseSelfUserDetailsServiceGetV1SelfUserdetails = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseSelfUserDetailsServiceGetV1SelfUserdetailsKeyFn(), queryFn: () => SelfUserDetailsService.getV1SelfUserdetails() });
export const prefetchUseSelfDividendServiceGetV1ShareproductByProductIdDividend = (queryClient: QueryClient, { limit, offset, orderBy, productId, sortOrder, status }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  productId: number;
  sortOrder?: string;
  status?: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfDividendServiceGetV1ShareproductByProductIdDividendKeyFn({ limit, offset, orderBy, productId, sortOrder, status }), queryFn: () => SelfDividendService.getV1ShareproductByProductIdDividend({ limit, offset, orderBy, productId, sortOrder, status }) });
export const prefetchUseSelfDividendServiceGetV1ShareproductByProductIdDividendByDividendId = (queryClient: QueryClient, { accountNo, dividendId, limit, offset, orderBy, productId, sortOrder }: {
  accountNo?: string;
  dividendId: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  productId: number;
  sortOrder?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSelfDividendServiceGetV1ShareproductByProductIdDividendByDividendIdKeyFn({ accountNo, dividendId, limit, offset, orderBy, productId, sortOrder }), queryFn: () => SelfDividendService.getV1ShareproductByProductIdDividendByDividendId({ accountNo, dividendId, limit, offset, orderBy, productId, sortOrder }) });
export const prefetchUseSmsServiceGetV1Sms = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseSmsServiceGetV1SmsKeyFn(), queryFn: () => SmsService.getV1Sms() });
export const prefetchUseSmsServiceGetV1SmsByCampaignIdMessageByStatus = (queryClient: QueryClient, { campaignId, dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }: {
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
}) => queryClient.prefetchQuery({ queryKey: Common.UseSmsServiceGetV1SmsByCampaignIdMessageByStatusKeyFn({ campaignId, dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }), queryFn: () => SmsService.getV1SmsByCampaignIdMessageByStatus({ campaignId, dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }) });
export const prefetchUseSmsServiceGetV1SmsByResourceId = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSmsServiceGetV1SmsByResourceIdKeyFn({ resourceId }), queryFn: () => SmsService.getV1SmsByResourceId({ resourceId }) });
export const prefetchUseStaffServiceGetV1Staff = (queryClient: QueryClient, { loanOfficersOnly, officeId, staffInOfficeHierarchy, status }: {
  loanOfficersOnly?: boolean;
  officeId?: number;
  staffInOfficeHierarchy?: boolean;
  status?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseStaffServiceGetV1StaffKeyFn({ loanOfficersOnly, officeId, staffInOfficeHierarchy, status }), queryFn: () => StaffService.getV1Staff({ loanOfficersOnly, officeId, staffInOfficeHierarchy, status }) });
export const prefetchUseStaffServiceGetV1StaffDownloadtemplate = (queryClient: QueryClient, { dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseStaffServiceGetV1StaffDownloadtemplateKeyFn({ dateFormat, officeId }), queryFn: () => StaffService.getV1StaffDownloadtemplate({ dateFormat, officeId }) });
export const prefetchUseStaffServiceGetV1StaffByStaffId = (queryClient: QueryClient, { staffId }: {
  staffId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseStaffServiceGetV1StaffByStaffIdKeyFn({ staffId }), queryFn: () => StaffService.getV1StaffByStaffId({ staffId }) });
export const prefetchUseStandingInstructionsHistoryServiceGetV1Standinginstructionrunhistory = (queryClient: QueryClient, { clientId, clientName, dateFormat, externalId, fromAccountId, fromAccountType, fromDate, limit, locale, offset, orderBy, sortOrder, toDate, transferType }: {
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
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseStandingInstructionsHistoryServiceGetV1StandinginstructionrunhistoryKeyFn({ clientId, clientName, dateFormat, externalId, fromAccountId, fromAccountType, fromDate, limit, locale, offset, orderBy, sortOrder, toDate, transferType }), queryFn: () => StandingInstructionsHistoryService.getV1Standinginstructionrunhistory({ clientId, clientName, dateFormat, externalId, fromAccountId, fromAccountType, fromDate, limit, locale, offset, orderBy, sortOrder, toDate, transferType }) });
export const prefetchUseStandingInstructionsServiceGetV1Standinginstructions = (queryClient: QueryClient, { clientId, clientName, externalId, fromAccountId, fromAccountType, limit, offset, orderBy, sortOrder, transferType }: {
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
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseStandingInstructionsServiceGetV1StandinginstructionsKeyFn({ clientId, clientName, externalId, fromAccountId, fromAccountType, limit, offset, orderBy, sortOrder, transferType }), queryFn: () => StandingInstructionsService.getV1Standinginstructions({ clientId, clientName, externalId, fromAccountId, fromAccountType, limit, offset, orderBy, sortOrder, transferType }) });
export const prefetchUseStandingInstructionsServiceGetV1StandinginstructionsTemplate = (queryClient: QueryClient, { fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId, transferType }: {
  fromAccountId?: number;
  fromAccountType?: number;
  fromClientId?: number;
  fromOfficeId?: number;
  toAccountId?: number;
  toAccountType?: number;
  toClientId?: number;
  toOfficeId?: number;
  transferType?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseStandingInstructionsServiceGetV1StandinginstructionsTemplateKeyFn({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId, transferType }), queryFn: () => StandingInstructionsService.getV1StandinginstructionsTemplate({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId, transferType }) });
export const prefetchUseStandingInstructionsServiceGetV1StandinginstructionsByStandingInstructionId = (queryClient: QueryClient, { externalId, limit, offset, orderBy, sortOrder, standingInstructionId }: {
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  standingInstructionId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseStandingInstructionsServiceGetV1StandinginstructionsByStandingInstructionIdKeyFn({ externalId, limit, offset, orderBy, sortOrder, standingInstructionId }), queryFn: () => StandingInstructionsService.getV1StandinginstructionsByStandingInstructionId({ externalId, limit, offset, orderBy, sortOrder, standingInstructionId }) });
export const prefetchUseSurveyServiceGetV1Survey = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseSurveyServiceGetV1SurveyKeyFn(), queryFn: () => SurveyService.getV1Survey() });
export const prefetchUseSurveyServiceGetV1SurveyBySurveyName = (queryClient: QueryClient, { surveyName }: {
  surveyName: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSurveyServiceGetV1SurveyBySurveyNameKeyFn({ surveyName }), queryFn: () => SurveyService.getV1SurveyBySurveyName({ surveyName }) });
export const prefetchUseSurveyServiceGetV1SurveyBySurveyNameByClientId = (queryClient: QueryClient, { clientId, surveyName }: {
  clientId: number;
  surveyName: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSurveyServiceGetV1SurveyBySurveyNameByClientIdKeyFn({ clientId, surveyName }), queryFn: () => SurveyService.getV1SurveyBySurveyNameByClientId({ clientId, surveyName }) });
export const prefetchUseSurveyServiceGetV1SurveyBySurveyNameByClientIdByEntryId = (queryClient: QueryClient, { clientId, entryId, surveyName }: {
  clientId: number;
  entryId: number;
  surveyName: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSurveyServiceGetV1SurveyBySurveyNameByClientIdByEntryIdKeyFn({ clientId, entryId, surveyName }), queryFn: () => SurveyService.getV1SurveyBySurveyNameByClientIdByEntryId({ clientId, entryId, surveyName }) });
export const prefetchUseSpmSurveysServiceGetV1Surveys = (queryClient: QueryClient, { isActive }: {
  isActive?: boolean;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseSpmSurveysServiceGetV1SurveysKeyFn({ isActive }), queryFn: () => SpmSurveysService.getV1Surveys({ isActive }) });
export const prefetchUseSpmSurveysServiceGetV1SurveysById = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSpmSurveysServiceGetV1SurveysByIdKeyFn({ id }), queryFn: () => SpmSurveysService.getV1SurveysById({ id }) });
export const prefetchUseScoreCardServiceGetV1SurveysScorecardsClientsByClientId = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseScoreCardServiceGetV1SurveysScorecardsClientsByClientIdKeyFn({ clientId }), queryFn: () => ScoreCardService.getV1SurveysScorecardsClientsByClientId({ clientId }) });
export const prefetchUseScoreCardServiceGetV1SurveysScorecardsBySurveyId = (queryClient: QueryClient, { surveyId }: {
  surveyId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseScoreCardServiceGetV1SurveysScorecardsBySurveyIdKeyFn({ surveyId }), queryFn: () => ScoreCardService.getV1SurveysScorecardsBySurveyId({ surveyId }) });
export const prefetchUseScoreCardServiceGetV1SurveysScorecardsBySurveyIdClientsByClientId = (queryClient: QueryClient, { clientId, surveyId }: {
  clientId: number;
  surveyId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseScoreCardServiceGetV1SurveysScorecardsBySurveyIdClientsByClientIdKeyFn({ clientId, surveyId }), queryFn: () => ScoreCardService.getV1SurveysScorecardsBySurveyIdClientsByClientId({ clientId, surveyId }) });
export const prefetchUseSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptables = (queryClient: QueryClient, { surveyId }: {
  surveyId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesKeyFn({ surveyId }), queryFn: () => SpmApiLookUpTableService.getV1SurveysBySurveyIdLookuptables({ surveyId }) });
export const prefetchUseSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesByKey = (queryClient: QueryClient, { key, surveyId }: {
  key: string;
  surveyId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesByKeyKeyFn({ key, surveyId }), queryFn: () => SpmApiLookUpTableService.getV1SurveysBySurveyIdLookuptablesByKey({ key, surveyId }) });
export const prefetchUseTaxComponentsServiceGetV1TaxesComponent = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseTaxComponentsServiceGetV1TaxesComponentKeyFn(), queryFn: () => TaxComponentsService.getV1TaxesComponent() });
export const prefetchUseTaxComponentsServiceGetV1TaxesComponentTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseTaxComponentsServiceGetV1TaxesComponentTemplateKeyFn(), queryFn: () => TaxComponentsService.getV1TaxesComponentTemplate() });
export const prefetchUseTaxComponentsServiceGetV1TaxesComponentByTaxComponentId = (queryClient: QueryClient, { taxComponentId }: {
  taxComponentId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseTaxComponentsServiceGetV1TaxesComponentByTaxComponentIdKeyFn({ taxComponentId }), queryFn: () => TaxComponentsService.getV1TaxesComponentByTaxComponentId({ taxComponentId }) });
export const prefetchUseTaxGroupServiceGetV1TaxesGroup = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseTaxGroupServiceGetV1TaxesGroupKeyFn(), queryFn: () => TaxGroupService.getV1TaxesGroup() });
export const prefetchUseTaxGroupServiceGetV1TaxesGroupTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseTaxGroupServiceGetV1TaxesGroupTemplateKeyFn(), queryFn: () => TaxGroupService.getV1TaxesGroupTemplate() });
export const prefetchUseTaxGroupServiceGetV1TaxesGroupByTaxGroupId = (queryClient: QueryClient, { taxGroupId }: {
  taxGroupId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseTaxGroupServiceGetV1TaxesGroupByTaxGroupIdKeyFn({ taxGroupId }), queryFn: () => TaxGroupService.getV1TaxesGroupByTaxGroupId({ taxGroupId }) });
export const prefetchUseTellerCashManagementServiceGetV1Tellers = (queryClient: QueryClient, { officeId }: {
  officeId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersKeyFn({ officeId }), queryFn: () => TellerCashManagementService.getV1Tellers({ officeId }) });
export const prefetchUseTellerCashManagementServiceGetV1TellersByTellerId = (queryClient: QueryClient, { tellerId }: {
  tellerId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdKeyFn({ tellerId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerId({ tellerId }) });
export const prefetchUseTellerCashManagementServiceGetV1TellersByTellerIdCashiers = (queryClient: QueryClient, { fromdate, tellerId, todate }: {
  fromdate?: string;
  tellerId: number;
  todate?: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersKeyFn({ fromdate, tellerId, todate }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiers({ fromdate, tellerId, todate }) });
export const prefetchUseTellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplate = (queryClient: QueryClient, { tellerId }: {
  tellerId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplateKeyFn({ tellerId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersTemplate({ tellerId }) });
export const prefetchUseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierId = (queryClient: QueryClient, { cashierId, tellerId }: {
  cashierId: number;
  tellerId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdKeyFn({ cashierId, tellerId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierId({ cashierId, tellerId }) });
export const prefetchUseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactions = (queryClient: QueryClient, { cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }: {
  cashierId: number;
  currencyCode?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  tellerId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactionsKeyFn({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdSummaryandtransactions({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }) });
export const prefetchUseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactions = (queryClient: QueryClient, { cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }: {
  cashierId: number;
  currencyCode?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  tellerId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsKeyFn({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdTransactions({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }) });
export const prefetchUseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplate = (queryClient: QueryClient, { cashierId, tellerId }: {
  cashierId: number;
  tellerId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplateKeyFn({ cashierId, tellerId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdTransactionsTemplate({ cashierId, tellerId }) });
export const prefetchUseTellerCashManagementServiceGetV1TellersByTellerIdJournals = (queryClient: QueryClient, { cashierId, dateRange, tellerId }: {
  cashierId?: number;
  dateRange?: string;
  tellerId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdJournalsKeyFn({ cashierId, dateRange, tellerId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdJournals({ cashierId, dateRange, tellerId }) });
export const prefetchUseTellerCashManagementServiceGetV1TellersByTellerIdTransactions = (queryClient: QueryClient, { dateRange, tellerId }: {
  dateRange?: string;
  tellerId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdTransactionsKeyFn({ dateRange, tellerId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdTransactions({ dateRange, tellerId }) });
export const prefetchUseTellerCashManagementServiceGetV1TellersByTellerIdTransactionsByTransactionId = (queryClient: QueryClient, { tellerId, transactionId }: {
  tellerId: number;
  transactionId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdTransactionsByTransactionIdKeyFn({ tellerId, transactionId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdTransactionsByTransactionId({ tellerId, transactionId }) });
export const prefetchUseUserGeneratedDocumentsServiceGetV1Templates = (queryClient: QueryClient, { entityId, typeId }: {
  entityId?: number;
  typeId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseUserGeneratedDocumentsServiceGetV1TemplatesKeyFn({ entityId, typeId }), queryFn: () => UserGeneratedDocumentsService.getV1Templates({ entityId, typeId }) });
export const prefetchUseUserGeneratedDocumentsServiceGetV1TemplatesTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseUserGeneratedDocumentsServiceGetV1TemplatesTemplateKeyFn(), queryFn: () => UserGeneratedDocumentsService.getV1TemplatesTemplate() });
export const prefetchUseUserGeneratedDocumentsServiceGetV1TemplatesByTemplateId = (queryClient: QueryClient, { templateId }: {
  templateId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdKeyFn({ templateId }), queryFn: () => UserGeneratedDocumentsService.getV1TemplatesByTemplateId({ templateId }) });
export const prefetchUseUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdTemplate = (queryClient: QueryClient, { templateId }: {
  templateId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdTemplateKeyFn({ templateId }), queryFn: () => UserGeneratedDocumentsService.getV1TemplatesByTemplateIdTemplate({ templateId }) });
export const prefetchUseTwoFactorServiceGetV1Twofactor = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseTwoFactorServiceGetV1TwofactorKeyFn(), queryFn: () => TwoFactorService.getV1Twofactor() });
export const prefetchUseFetchAuthenticatedUserDetailsServiceGetV1Userdetails = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseFetchAuthenticatedUserDetailsServiceGetV1UserdetailsKeyFn(), queryFn: () => FetchAuthenticatedUserDetailsService.getV1Userdetails() });
export const prefetchUseUsersServiceGetV1Users = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseUsersServiceGetV1UsersKeyFn(), queryFn: () => UsersService.getV1Users() });
export const prefetchUseUsersServiceGetV1UsersDownloadtemplate = (queryClient: QueryClient, { dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseUsersServiceGetV1UsersDownloadtemplateKeyFn({ dateFormat, officeId, staffId }), queryFn: () => UsersService.getV1UsersDownloadtemplate({ dateFormat, officeId, staffId }) });
export const prefetchUseUsersServiceGetV1UsersTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseUsersServiceGetV1UsersTemplateKeyFn(), queryFn: () => UsersService.getV1UsersTemplate() });
export const prefetchUseUsersServiceGetV1UsersByUserId = (queryClient: QueryClient, { userId }: {
  userId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseUsersServiceGetV1UsersByUserIdKeyFn({ userId }), queryFn: () => UsersService.getV1UsersByUserId({ userId }) });
export const prefetchUseWorkingDaysServiceGetV1Workingdays = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseWorkingDaysServiceGetV1WorkingdaysKeyFn(), queryFn: () => WorkingDaysService.getV1Workingdays() });
export const prefetchUseWorkingDaysServiceGetV1WorkingdaysTemplate = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseWorkingDaysServiceGetV1WorkingdaysTemplateKeyFn(), queryFn: () => WorkingDaysService.getV1WorkingdaysTemplate() });
export const prefetchUseCalendarServiceGetV1ByEntityTypeByEntityIdCalendars = (queryClient: QueryClient, { calendarType, entityId, entityType }: {
  calendarType?: string;
  entityId: number;
  entityType: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsKeyFn({ calendarType, entityId, entityType }), queryFn: () => CalendarService.getV1ByEntityTypeByEntityIdCalendars({ calendarType, entityId, entityType }) });
export const prefetchUseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsTemplate = (queryClient: QueryClient, { entityId, entityType }: {
  entityId: number;
  entityType: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsTemplateKeyFn({ entityId, entityType }), queryFn: () => CalendarService.getV1ByEntityTypeByEntityIdCalendarsTemplate({ entityId, entityType }) });
export const prefetchUseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsByCalendarId = (queryClient: QueryClient, { calendarId, entityId, entityType }: {
  calendarId: number;
  entityId: number;
  entityType: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsByCalendarIdKeyFn({ calendarId, entityId, entityType }), queryFn: () => CalendarService.getV1ByEntityTypeByEntityIdCalendarsByCalendarId({ calendarId, entityId, entityType }) });
export const prefetchUseDocumentsServiceGetV1ByEntityTypeByEntityIdDocuments = (queryClient: QueryClient, { entityId, entityType }: {
  entityId: number;
  entityType: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsKeyFn({ entityId, entityType }), queryFn: () => DocumentsService.getV1ByEntityTypeByEntityIdDocuments({ entityId, entityType }) });
export const prefetchUseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentId = (queryClient: QueryClient, { documentId, entityId, entityType }: {
  documentId: number;
  entityId: number;
  entityType: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdKeyFn({ documentId, entityId, entityType }), queryFn: () => DocumentsService.getV1ByEntityTypeByEntityIdDocumentsByDocumentId({ documentId, entityId, entityType }) });
export const prefetchUseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachment = (queryClient: QueryClient, { documentId, entityId, entityType }: {
  documentId: number;
  entityId: number;
  entityType: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachmentKeyFn({ documentId, entityId, entityType }), queryFn: () => DocumentsService.getV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachment({ documentId, entityId, entityType }) });
export const prefetchUseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetings = (queryClient: QueryClient, { entityId, entityType, limit }: {
  entityId: number;
  entityType: string;
  limit?: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsKeyFn({ entityId, entityType, limit }), queryFn: () => MeetingsService.getV1ByEntityTypeByEntityIdMeetings({ entityId, entityType, limit }) });
export const prefetchUseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsTemplate = (queryClient: QueryClient, { calendarId, entityId, entityType }: {
  calendarId?: number;
  entityId: number;
  entityType: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsTemplateKeyFn({ calendarId, entityId, entityType }), queryFn: () => MeetingsService.getV1ByEntityTypeByEntityIdMeetingsTemplate({ calendarId, entityId, entityType }) });
export const prefetchUseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsByMeetingId = (queryClient: QueryClient, { entityId, entityType, meetingId }: {
  entityId: number;
  entityType: string;
  meetingId: number;
}) => queryClient.prefetchQuery({ queryKey: Common.UseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsByMeetingIdKeyFn({ entityId, entityType, meetingId }), queryFn: () => MeetingsService.getV1ByEntityTypeByEntityIdMeetingsByMeetingId({ entityId, entityType, meetingId }) });
export const prefetchUseNotesServiceGetV1ByResourceTypeByResourceIdNotes = (queryClient: QueryClient, { resourceId, resourceType }: {
  resourceId: number;
  resourceType: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseNotesServiceGetV1ByResourceTypeByResourceIdNotesKeyFn({ resourceId, resourceType }), queryFn: () => NotesService.getV1ByResourceTypeByResourceIdNotes({ resourceId, resourceType }) });
export const prefetchUseNotesServiceGetV1ByResourceTypeByResourceIdNotesByNoteId = (queryClient: QueryClient, { noteId, resourceId, resourceType }: {
  noteId: number;
  resourceId: number;
  resourceType: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseNotesServiceGetV1ByResourceTypeByResourceIdNotesByNoteIdKeyFn({ noteId, resourceId, resourceType }), queryFn: () => NotesService.getV1ByResourceTypeByResourceIdNotesByNoteId({ noteId, resourceId, resourceType }) });
