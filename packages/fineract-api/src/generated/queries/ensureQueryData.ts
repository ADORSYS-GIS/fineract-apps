// generated with @7nohe/openapi-react-query-codegen@1.6.2 

import { type QueryClient } from "@tanstack/react-query";
import { AccountNumberFormatService, AccountTransfersService, AccountingClosureService, AccountingRulesService, AdhocQueryApiService, AuditsService, BulkImportService, BulkLoansService, BusinessDateManagementService, BusinessStepConfigurationService, CacheService, CalendarService, CashierJournalsService, CashiersService, CentersService, ChargesService, ClientChargesService, ClientCollateralManagementService, ClientFamilyMemberService, ClientIdentifierService, ClientService, ClientTransactionService, ClientsAddressService, CodeValuesService, CodesService, CollateralManagementService, CreditBureauConfigurationService, CurrencyService, DataTablesService, DefaultService, DelinquencyRangeAndBucketsManagementService, DepositAccountOnHoldFundTransactionsService, DeviceRegistrationService, DocumentsService, EntityDataTableService, EntityFieldConfigurationService, ExternalAssetOwnerLoanProductAttributesService, ExternalAssetOwnersService, ExternalEventConfigurationService, ExternalServicesService, FetchAuthenticatedUserDetailsService, FineractEntityService, FixedDepositAccountService, FixedDepositAccountTransactionsService, FixedDepositProductService, FloatingRatesService, FundsService, GeneralLedgerAccountService, GlobalConfigurationService, GroupsLevelService, GroupsService, GuarantorsService, HolidaysService, HooksService, InterOperationService, InterestRateChartService, InterestRateSlabAKAInterestBandsService, JournalEntriesService, LikelihoodService, ListReportMailingJobHistoryService, LoanAccountLockService, LoanBuyDownFeesService, LoanCapitalizedIncomeService, LoanChargesService, LoanCobCatchUpService, LoanCollateralManagementService, LoanCollateralService, LoanDisbursementDetailsService, LoanInterestPauseService, LoanProductsService, LoanTransactionsService, LoansPointInTimeService, LoansService, MakerCheckerOr4EyeFunctionalityService, MappingFinancialActivitiesToAccountsService, MeetingsService, MixMappingService, MixReportService, MixTaxonomyService, NotesService, NotificationService, OfficesService, PasswordPreferencesService, PaymentTypeService, PermissionsService, PocketService, PovertyLineService, ProductMixService, ProductsService, ProgressiveLoanService, ProvisioningCategoryService, ProvisioningCriteriaService, ProvisioningEntriesService, RateService, RecurringDepositAccountService, RecurringDepositAccountTransactionsService, RecurringDepositProductService, RepaymentWithPostDatedChecksService, ReportMailingJobsService, ReportsService, RescheduleLoansService, RolesService, RunReportsService, SavingsAccountService, SavingsAccountTransactionsService, SavingsChargesService, SavingsProductService, SchedulerJobService, SchedulerService, ScoreCardService, SearchApiService, SelfAccountTransferService, SelfClientService, SelfDividendService, SelfLoanProductsService, SelfLoansService, SelfRunReportService, SelfSavingsAccountService, SelfSavingsProductsService, SelfScoreCardService, SelfShareAccountsService, SelfShareProductsService, SelfSpmService, SelfThirdPartyTransferService, SelfUserDetailsService, ShareAccountService, SmsService, SpmApiLookUpTableService, SpmSurveysService, StaffService, StandingInstructionsHistoryService, StandingInstructionsService, SurveyService, TaxComponentsService, TaxGroupService, TellerCashManagementService, TwoFactorService, UserGeneratedDocumentsService, UsersService, WorkingDaysService } from "../requests/services.gen";
import { DateParam, TransactionType } from "../requests/types.gen";
import * as Common from "./common";
export const ensureUseDefaultServiceGetApplicationWadlData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetApplicationWadlKeyFn(), queryFn: () => DefaultService.getApplicationWadl() });
export const ensureUseDefaultServiceGetApplicationWadlByPathData = (queryClient: QueryClient, { path }: {
  path: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetApplicationWadlByPathKeyFn({ path }), queryFn: () => DefaultService.getApplicationWadlByPath({ path }) });
export const ensureUseDefaultServiceGetV1CreditBureauIntegrationCreditReportByCreditBureauIdData = (queryClient: QueryClient, { creditBureauId }: {
  creditBureauId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1CreditBureauIntegrationCreditReportByCreditBureauIdKeyFn({ creditBureauId }), queryFn: () => DefaultService.getV1CreditBureauIntegrationCreditReportByCreditBureauId({ creditBureauId }) });
export const ensureUseDefaultServiceGetV1EchoData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1EchoKeyFn(), queryFn: () => DefaultService.getV1Echo() });
export const ensureUseDefaultServiceGetV1EmailData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1EmailKeyFn(), queryFn: () => DefaultService.getV1Email() });
export const ensureUseDefaultServiceGetV1EmailCampaignData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1EmailCampaignKeyFn(), queryFn: () => DefaultService.getV1EmailCampaign() });
export const ensureUseDefaultServiceGetV1EmailCampaignTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1EmailCampaignTemplateKeyFn(), queryFn: () => DefaultService.getV1EmailCampaignTemplate() });
export const ensureUseDefaultServiceGetV1EmailCampaignTemplateByResourceIdData = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1EmailCampaignTemplateByResourceIdKeyFn({ resourceId }), queryFn: () => DefaultService.getV1EmailCampaignTemplateByResourceId({ resourceId }) });
export const ensureUseDefaultServiceGetV1EmailCampaignByResourceIdData = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1EmailCampaignByResourceIdKeyFn({ resourceId }), queryFn: () => DefaultService.getV1EmailCampaignByResourceId({ resourceId }) });
export const ensureUseDefaultServiceGetV1EmailConfigurationData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1EmailConfigurationKeyFn(), queryFn: () => DefaultService.getV1EmailConfiguration() });
export const ensureUseDefaultServiceGetV1EmailFailedEmailData = (queryClient: QueryClient, { limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1EmailFailedEmailKeyFn({ limit, offset, orderBy, sortOrder }), queryFn: () => DefaultService.getV1EmailFailedEmail({ limit, offset, orderBy, sortOrder }) });
export const ensureUseDefaultServiceGetV1EmailMessageByStatusData = (queryClient: QueryClient, { dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }: {
  dateFormat?: string;
  fromDate?: DateParam;
  limit?: number;
  locale?: string;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  status?: number;
  toDate?: DateParam;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1EmailMessageByStatusKeyFn({ dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }), queryFn: () => DefaultService.getV1EmailMessageByStatus({ dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }) });
export const ensureUseDefaultServiceGetV1EmailPendingEmailData = (queryClient: QueryClient, { limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1EmailPendingEmailKeyFn({ limit, offset, orderBy, sortOrder }), queryFn: () => DefaultService.getV1EmailPendingEmail({ limit, offset, orderBy, sortOrder }) });
export const ensureUseDefaultServiceGetV1EmailSentEmailData = (queryClient: QueryClient, { limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1EmailSentEmailKeyFn({ limit, offset, orderBy, sortOrder }), queryFn: () => DefaultService.getV1EmailSentEmail({ limit, offset, orderBy, sortOrder }) });
export const ensureUseDefaultServiceGetV1EmailByResourceIdData = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1EmailByResourceIdKeyFn({ resourceId }), queryFn: () => DefaultService.getV1EmailByResourceId({ resourceId }) });
export const ensureUseDefaultServiceGetV1InternalClientByClientIdAuditData = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1InternalClientByClientIdAuditKeyFn({ clientId }), queryFn: () => DefaultService.getV1InternalClientByClientIdAudit({ clientId }) });
export const ensureUseDefaultServiceGetV1InternalCobPartitionsByPartitionSizeData = (queryClient: QueryClient, { partitionSize }: {
  partitionSize: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1InternalCobPartitionsByPartitionSizeKeyFn({ partitionSize }), queryFn: () => DefaultService.getV1InternalCobPartitionsByPartitionSize({ partitionSize }) });
export const ensureUseDefaultServiceGetV1InternalExternaleventsData = (queryClient: QueryClient, { aggregateRootId, category, idempotencyKey, type }: {
  aggregateRootId?: number;
  category?: string;
  idempotencyKey?: string;
  type?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1InternalExternaleventsKeyFn({ aggregateRootId, category, idempotencyKey, type }), queryFn: () => DefaultService.getV1InternalExternalevents({ aggregateRootId, category, idempotencyKey, type }) });
export const ensureUseDefaultServiceGetV1InternalLoanStatusByStatusIdData = (queryClient: QueryClient, { statusId }: {
  statusId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1InternalLoanStatusByStatusIdKeyFn({ statusId }), queryFn: () => DefaultService.getV1InternalLoanStatusByStatusId({ statusId }) });
export const ensureUseDefaultServiceGetV1InternalLoanByLoanIdAdvancedPaymentAllocationRulesData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1InternalLoanByLoanIdAdvancedPaymentAllocationRulesKeyFn({ loanId }), queryFn: () => DefaultService.getV1InternalLoanByLoanIdAdvancedPaymentAllocationRules({ loanId }) });
export const ensureUseDefaultServiceGetV1InternalLoanByLoanIdAuditData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1InternalLoanByLoanIdAuditKeyFn({ loanId }), queryFn: () => DefaultService.getV1InternalLoanByLoanIdAudit({ loanId }) });
export const ensureUseDefaultServiceGetV1InternalLoanByLoanIdTransactionByTransactionIdAuditData = (queryClient: QueryClient, { loanId, transactionId }: {
  loanId: number;
  transactionId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1InternalLoanByLoanIdTransactionByTransactionIdAuditKeyFn({ loanId, transactionId }), queryFn: () => DefaultService.getV1InternalLoanByLoanIdTransactionByTransactionIdAudit({ loanId, transactionId }) });
export const ensureUseDefaultServiceGetV1OfficetransactionsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1OfficetransactionsKeyFn(), queryFn: () => DefaultService.getV1Officetransactions() });
export const ensureUseDefaultServiceGetV1OfficetransactionsTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1OfficetransactionsTemplateKeyFn(), queryFn: () => DefaultService.getV1OfficetransactionsTemplate() });
export const ensureUseDefaultServiceGetV1SmscampaignsData = (queryClient: QueryClient, { limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1SmscampaignsKeyFn({ limit, offset, orderBy, sortOrder }), queryFn: () => DefaultService.getV1Smscampaigns({ limit, offset, orderBy, sortOrder }) });
export const ensureUseDefaultServiceGetV1SmscampaignsTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1SmscampaignsTemplateKeyFn(), queryFn: () => DefaultService.getV1SmscampaignsTemplate() });
export const ensureUseDefaultServiceGetV1SmscampaignsByResourceIdData = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1SmscampaignsByResourceIdKeyFn({ resourceId }), queryFn: () => DefaultService.getV1SmscampaignsByResourceId({ resourceId }) });
export const ensureUseDefaultServiceGetV1TwofactorConfigureData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1TwofactorConfigureKeyFn(), queryFn: () => DefaultService.getV1TwofactorConfigure() });
export const ensureUseDefaultServiceGetV1ByEntityByEntityIdImagesData = (queryClient: QueryClient, { accept, entity, entityId, maxHeight, maxWidth, output }: {
  accept?: string;
  entity: string;
  entityId: number;
  maxHeight?: number;
  maxWidth?: number;
  output?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDefaultServiceGetV1ByEntityByEntityIdImagesKeyFn({ accept, entity, entityId, maxHeight, maxWidth, output }), queryFn: () => DefaultService.getV1ByEntityByEntityIdImages({ accept, entity, entityId, maxHeight, maxWidth, output }) });
export const ensureUseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationKeyFn(), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfiguration() });
export const ensureUseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationConfigByOrganisationCreditBureauIdData = (queryClient: QueryClient, { organisationCreditBureauId }: {
  organisationCreditBureauId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationConfigByOrganisationCreditBureauIdKeyFn({ organisationCreditBureauId }), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationConfigByOrganisationCreditBureauId({ organisationCreditBureauId }) });
export const ensureUseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductKeyFn(), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationLoanProduct() });
export const ensureUseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductByLoanProductIdData = (queryClient: QueryClient, { loanProductId }: {
  loanProductId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationLoanProductByLoanProductIdKeyFn({ loanProductId }), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationLoanProductByLoanProductId({ loanProductId }) });
export const ensureUseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationMappingsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationMappingsKeyFn(), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationMappings() });
export const ensureUseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationOrganisationCreditBureauData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseCreditBureauConfigurationServiceGetV1CreditBureauConfigurationOrganisationCreditBureauKeyFn(), queryFn: () => CreditBureauConfigurationService.getV1CreditBureauConfigurationOrganisationCreditBureau() });
export const ensureUseAccountingRulesServiceGetV1AccountingrulesData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseAccountingRulesServiceGetV1AccountingrulesKeyFn(), queryFn: () => AccountingRulesService.getV1Accountingrules() });
export const ensureUseAccountingRulesServiceGetV1AccountingrulesTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseAccountingRulesServiceGetV1AccountingrulesTemplateKeyFn(), queryFn: () => AccountingRulesService.getV1AccountingrulesTemplate() });
export const ensureUseAccountingRulesServiceGetV1AccountingrulesByAccountingRuleIdData = (queryClient: QueryClient, { accountingRuleId }: {
  accountingRuleId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseAccountingRulesServiceGetV1AccountingrulesByAccountingRuleIdKeyFn({ accountingRuleId }), queryFn: () => AccountingRulesService.getV1AccountingrulesByAccountingRuleId({ accountingRuleId }) });
export const ensureUseAccountNumberFormatServiceGetV1AccountnumberformatsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseAccountNumberFormatServiceGetV1AccountnumberformatsKeyFn(), queryFn: () => AccountNumberFormatService.getV1Accountnumberformats() });
export const ensureUseAccountNumberFormatServiceGetV1AccountnumberformatsTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseAccountNumberFormatServiceGetV1AccountnumberformatsTemplateKeyFn(), queryFn: () => AccountNumberFormatService.getV1AccountnumberformatsTemplate() });
export const ensureUseAccountNumberFormatServiceGetV1AccountnumberformatsByAccountNumberFormatIdData = (queryClient: QueryClient, { accountNumberFormatId }: {
  accountNumberFormatId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseAccountNumberFormatServiceGetV1AccountnumberformatsByAccountNumberFormatIdKeyFn({ accountNumberFormatId }), queryFn: () => AccountNumberFormatService.getV1AccountnumberformatsByAccountNumberFormatId({ accountNumberFormatId }) });
export const ensureUseShareAccountServiceGetV1AccountsByTypeData = (queryClient: QueryClient, { limit, offset, type }: {
  limit?: number;
  offset?: number;
  type: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseShareAccountServiceGetV1AccountsByTypeKeyFn({ limit, offset, type }), queryFn: () => ShareAccountService.getV1AccountsByType({ limit, offset, type }) });
export const ensureUseShareAccountServiceGetV1AccountsByTypeDownloadtemplateData = (queryClient: QueryClient, { dateFormat, officeId, type }: {
  dateFormat?: string;
  officeId?: number;
  type: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseShareAccountServiceGetV1AccountsByTypeDownloadtemplateKeyFn({ dateFormat, officeId, type }), queryFn: () => ShareAccountService.getV1AccountsByTypeDownloadtemplate({ dateFormat, officeId, type }) });
export const ensureUseShareAccountServiceGetV1AccountsByTypeTemplateData = (queryClient: QueryClient, { clientId, productId, type }: {
  clientId?: number;
  productId?: number;
  type: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseShareAccountServiceGetV1AccountsByTypeTemplateKeyFn({ clientId, productId, type }), queryFn: () => ShareAccountService.getV1AccountsByTypeTemplate({ clientId, productId, type }) });
export const ensureUseShareAccountServiceGetV1AccountsByTypeByAccountIdData = (queryClient: QueryClient, { accountId, type }: {
  accountId: number;
  type: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseShareAccountServiceGetV1AccountsByTypeByAccountIdKeyFn({ accountId, type }), queryFn: () => ShareAccountService.getV1AccountsByTypeByAccountId({ accountId, type }) });
export const ensureUseAccountTransfersServiceGetV1AccounttransfersData = (queryClient: QueryClient, { accountDetailId, externalId, limit, offset, orderBy, sortOrder }: {
  accountDetailId?: number;
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseAccountTransfersServiceGetV1AccounttransfersKeyFn({ accountDetailId, externalId, limit, offset, orderBy, sortOrder }), queryFn: () => AccountTransfersService.getV1Accounttransfers({ accountDetailId, externalId, limit, offset, orderBy, sortOrder }) });
export const ensureUseAccountTransfersServiceGetV1AccounttransfersTemplateData = (queryClient: QueryClient, { fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }: {
  fromAccountId?: number;
  fromAccountType?: number;
  fromClientId?: number;
  fromOfficeId?: number;
  toAccountId?: number;
  toAccountType?: number;
  toClientId?: number;
  toOfficeId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseAccountTransfersServiceGetV1AccounttransfersTemplateKeyFn({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }), queryFn: () => AccountTransfersService.getV1AccounttransfersTemplate({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }) });
export const ensureUseAccountTransfersServiceGetV1AccounttransfersTemplateRefundByTransferData = (queryClient: QueryClient, { fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }: {
  fromAccountId?: number;
  fromAccountType?: number;
  fromClientId?: number;
  fromOfficeId?: number;
  toAccountId?: number;
  toAccountType?: number;
  toClientId?: number;
  toOfficeId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseAccountTransfersServiceGetV1AccounttransfersTemplateRefundByTransferKeyFn({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }), queryFn: () => AccountTransfersService.getV1AccounttransfersTemplateRefundByTransfer({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId }) });
export const ensureUseAccountTransfersServiceGetV1AccounttransfersByTransferIdData = (queryClient: QueryClient, { transferId }: {
  transferId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseAccountTransfersServiceGetV1AccounttransfersByTransferIdKeyFn({ transferId }), queryFn: () => AccountTransfersService.getV1AccounttransfersByTransferId({ transferId }) });
export const ensureUseAdhocQueryApiServiceGetV1AdhocqueryData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseAdhocQueryApiServiceGetV1AdhocqueryKeyFn(), queryFn: () => AdhocQueryApiService.getV1Adhocquery() });
export const ensureUseAdhocQueryApiServiceGetV1AdhocqueryTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseAdhocQueryApiServiceGetV1AdhocqueryTemplateKeyFn(), queryFn: () => AdhocQueryApiService.getV1AdhocqueryTemplate() });
export const ensureUseAdhocQueryApiServiceGetV1AdhocqueryByAdHocIdData = (queryClient: QueryClient, { adHocId }: {
  adHocId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseAdhocQueryApiServiceGetV1AdhocqueryByAdHocIdKeyFn({ adHocId }), queryFn: () => AdhocQueryApiService.getV1AdhocqueryByAdHocId({ adHocId }) });
export const ensureUseAuditsServiceGetV1AuditsData = (queryClient: QueryClient, { actionName, checkerDateTimeFrom, checkerDateTimeTo, checkerId, clientId, dateFormat, entityName, groupId, limit, loanId, locale, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, offset, orderBy, paged, processingResult, resourceId, savingsAccountId, sortOrder, status }: {
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
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseAuditsServiceGetV1AuditsKeyFn({ actionName, checkerDateTimeFrom, checkerDateTimeTo, checkerId, clientId, dateFormat, entityName, groupId, limit, loanId, locale, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, offset, orderBy, paged, processingResult, resourceId, savingsAccountId, sortOrder, status }), queryFn: () => AuditsService.getV1Audits({ actionName, checkerDateTimeFrom, checkerDateTimeTo, checkerId, clientId, dateFormat, entityName, groupId, limit, loanId, locale, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, offset, orderBy, paged, processingResult, resourceId, savingsAccountId, sortOrder, status }) });
export const ensureUseAuditsServiceGetV1AuditsSearchtemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseAuditsServiceGetV1AuditsSearchtemplateKeyFn(), queryFn: () => AuditsService.getV1AuditsSearchtemplate() });
export const ensureUseAuditsServiceGetV1AuditsByAuditIdData = (queryClient: QueryClient, { auditId }: {
  auditId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseAuditsServiceGetV1AuditsByAuditIdKeyFn({ auditId }), queryFn: () => AuditsService.getV1AuditsByAuditId({ auditId }) });
export const ensureUseBusinessDateManagementServiceGetV1BusinessdateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseBusinessDateManagementServiceGetV1BusinessdateKeyFn(), queryFn: () => BusinessDateManagementService.getV1Businessdate() });
export const ensureUseBusinessDateManagementServiceGetV1BusinessdateByTypeData = (queryClient: QueryClient, { type }: {
  type: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseBusinessDateManagementServiceGetV1BusinessdateByTypeKeyFn({ type }), queryFn: () => BusinessDateManagementService.getV1BusinessdateByType({ type }) });
export const ensureUseCacheServiceGetV1CachesData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseCacheServiceGetV1CachesKeyFn(), queryFn: () => CacheService.getV1Caches() });
export const ensureUseCashiersServiceGetV1CashiersData = (queryClient: QueryClient, { date, officeId, staffId, tellerId }: {
  date?: string;
  officeId?: number;
  staffId?: number;
  tellerId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseCashiersServiceGetV1CashiersKeyFn({ date, officeId, staffId, tellerId }), queryFn: () => CashiersService.getV1Cashiers({ date, officeId, staffId, tellerId }) });
export const ensureUseCashierJournalsServiceGetV1CashiersjournalData = (queryClient: QueryClient, { cashierId, dateRange, officeId, tellerId }: {
  cashierId?: number;
  dateRange?: string;
  officeId?: number;
  tellerId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseCashierJournalsServiceGetV1CashiersjournalKeyFn({ cashierId, dateRange, officeId, tellerId }), queryFn: () => CashierJournalsService.getV1Cashiersjournal({ cashierId, dateRange, officeId, tellerId }) });
export const ensureUseCentersServiceGetV1CentersData = (queryClient: QueryClient, { dateFormat, externalId, limit, locale, meetingDate, name, officeId, offset, orderBy, paged, sortOrder, staffId, underHierarchy }: {
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
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseCentersServiceGetV1CentersKeyFn({ dateFormat, externalId, limit, locale, meetingDate, name, officeId, offset, orderBy, paged, sortOrder, staffId, underHierarchy }), queryFn: () => CentersService.getV1Centers({ dateFormat, externalId, limit, locale, meetingDate, name, officeId, offset, orderBy, paged, sortOrder, staffId, underHierarchy }) });
export const ensureUseCentersServiceGetV1CentersDownloadtemplateData = (queryClient: QueryClient, { dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseCentersServiceGetV1CentersDownloadtemplateKeyFn({ dateFormat, officeId, staffId }), queryFn: () => CentersService.getV1CentersDownloadtemplate({ dateFormat, officeId, staffId }) });
export const ensureUseCentersServiceGetV1CentersTemplateData = (queryClient: QueryClient, { command, officeId, staffInSelectedOfficeOnly }: {
  command?: string;
  officeId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseCentersServiceGetV1CentersTemplateKeyFn({ command, officeId, staffInSelectedOfficeOnly }), queryFn: () => CentersService.getV1CentersTemplate({ command, officeId, staffInSelectedOfficeOnly }) });
export const ensureUseCentersServiceGetV1CentersByCenterIdData = (queryClient: QueryClient, { centerId, staffInSelectedOfficeOnly }: {
  centerId: number;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.ensureQueryData({ queryKey: Common.UseCentersServiceGetV1CentersByCenterIdKeyFn({ centerId, staffInSelectedOfficeOnly }), queryFn: () => CentersService.getV1CentersByCenterId({ centerId, staffInSelectedOfficeOnly }) });
export const ensureUseCentersServiceGetV1CentersByCenterIdAccountsData = (queryClient: QueryClient, { centerId }: {
  centerId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseCentersServiceGetV1CentersByCenterIdAccountsKeyFn({ centerId }), queryFn: () => CentersService.getV1CentersByCenterIdAccounts({ centerId }) });
export const ensureUseChargesServiceGetV1ChargesData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseChargesServiceGetV1ChargesKeyFn(), queryFn: () => ChargesService.getV1Charges() });
export const ensureUseChargesServiceGetV1ChargesTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseChargesServiceGetV1ChargesTemplateKeyFn(), queryFn: () => ChargesService.getV1ChargesTemplate() });
export const ensureUseChargesServiceGetV1ChargesByChargeIdData = (queryClient: QueryClient, { chargeId }: {
  chargeId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseChargesServiceGetV1ChargesByChargeIdKeyFn({ chargeId }), queryFn: () => ChargesService.getV1ChargesByChargeId({ chargeId }) });
export const ensureUseClientsAddressServiceGetV1ClientAddressesTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseClientsAddressServiceGetV1ClientAddressesTemplateKeyFn(), queryFn: () => ClientsAddressService.getV1ClientAddressesTemplate() });
export const ensureUseClientsAddressServiceGetV1ClientByClientidAddressesData = (queryClient: QueryClient, { clientid, status, type }: {
  clientid: number;
  status?: string;
  type?: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientsAddressServiceGetV1ClientByClientidAddressesKeyFn({ clientid, status, type }), queryFn: () => ClientsAddressService.getV1ClientByClientidAddresses({ clientid, status, type }) });
export const ensureUseClientServiceGetV1ClientsData = (queryClient: QueryClient, { displayName, externalId, firstName, lastName, legalForm, limit, officeId, offset, orderBy, orphansOnly, sortOrder, status, underHierarchy }: {
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
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseClientServiceGetV1ClientsKeyFn({ displayName, externalId, firstName, lastName, legalForm, limit, officeId, offset, orderBy, orphansOnly, sortOrder, status, underHierarchy }), queryFn: () => ClientService.getV1Clients({ displayName, externalId, firstName, lastName, legalForm, limit, officeId, offset, orderBy, orphansOnly, sortOrder, status, underHierarchy }) });
export const ensureUseClientServiceGetV1ClientsDownloadtemplateData = (queryClient: QueryClient, { dateFormat, legalFormType, officeId, staffId }: {
  dateFormat?: string;
  legalFormType?: string;
  officeId?: number;
  staffId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseClientServiceGetV1ClientsDownloadtemplateKeyFn({ dateFormat, legalFormType, officeId, staffId }), queryFn: () => ClientService.getV1ClientsDownloadtemplate({ dateFormat, legalFormType, officeId, staffId }) });
export const ensureUseClientServiceGetV1ClientsExternalIdByExternalIdData = (queryClient: QueryClient, { externalId, staffInSelectedOfficeOnly }: {
  externalId: string;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientServiceGetV1ClientsExternalIdByExternalIdKeyFn({ externalId, staffInSelectedOfficeOnly }), queryFn: () => ClientService.getV1ClientsExternalIdByExternalId({ externalId, staffInSelectedOfficeOnly }) });
export const ensureUseClientServiceGetV1ClientsExternalIdByExternalIdAccountsData = (queryClient: QueryClient, { externalId }: {
  externalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientServiceGetV1ClientsExternalIdByExternalIdAccountsKeyFn({ externalId }), queryFn: () => ClientService.getV1ClientsExternalIdByExternalIdAccounts({ externalId }) });
export const ensureUseClientServiceGetV1ClientsExternalIdByExternalIdObligeedetailsData = (queryClient: QueryClient, { externalId }: {
  externalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientServiceGetV1ClientsExternalIdByExternalIdObligeedetailsKeyFn({ externalId }), queryFn: () => ClientService.getV1ClientsExternalIdByExternalIdObligeedetails({ externalId }) });
export const ensureUseClientServiceGetV1ClientsExternalIdByExternalIdTransferproposaldateData = (queryClient: QueryClient, { externalId }: {
  externalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientServiceGetV1ClientsExternalIdByExternalIdTransferproposaldateKeyFn({ externalId }), queryFn: () => ClientService.getV1ClientsExternalIdByExternalIdTransferproposaldate({ externalId }) });
export const ensureUseClientServiceGetV1ClientsTemplateData = (queryClient: QueryClient, { commandParam, officeId, staffInSelectedOfficeOnly }: {
  commandParam?: string;
  officeId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseClientServiceGetV1ClientsTemplateKeyFn({ commandParam, officeId, staffInSelectedOfficeOnly }), queryFn: () => ClientService.getV1ClientsTemplate({ commandParam, officeId, staffInSelectedOfficeOnly }) });
export const ensureUseClientServiceGetV1ClientsByClientIdData = (queryClient: QueryClient, { clientId, staffInSelectedOfficeOnly }: {
  clientId: number;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientServiceGetV1ClientsByClientIdKeyFn({ clientId, staffInSelectedOfficeOnly }), queryFn: () => ClientService.getV1ClientsByClientId({ clientId, staffInSelectedOfficeOnly }) });
export const ensureUseClientServiceGetV1ClientsByClientIdAccountsData = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientServiceGetV1ClientsByClientIdAccountsKeyFn({ clientId }), queryFn: () => ClientService.getV1ClientsByClientIdAccounts({ clientId }) });
export const ensureUseClientServiceGetV1ClientsByClientIdObligeedetailsData = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientServiceGetV1ClientsByClientIdObligeedetailsKeyFn({ clientId }), queryFn: () => ClientService.getV1ClientsByClientIdObligeedetails({ clientId }) });
export const ensureUseClientServiceGetV1ClientsByClientIdTransferproposaldateData = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientServiceGetV1ClientsByClientIdTransferproposaldateKeyFn({ clientId }), queryFn: () => ClientService.getV1ClientsByClientIdTransferproposaldate({ clientId }) });
export const ensureUseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsData = (queryClient: QueryClient, { clientExternalId, limit, offset }: {
  clientExternalId: string;
  limit?: number;
  offset?: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsKeyFn({ clientExternalId, limit, offset }), queryFn: () => ClientTransactionService.getV1ClientsExternalIdByClientExternalIdTransactions({ clientExternalId, limit, offset }) });
export const ensureUseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalIdData = (queryClient: QueryClient, { clientExternalId, transactionExternalId }: {
  clientExternalId: string;
  transactionExternalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalIdKeyFn({ clientExternalId, transactionExternalId }), queryFn: () => ClientTransactionService.getV1ClientsExternalIdByClientExternalIdTransactionsExternalIdByTransactionExternalId({ clientExternalId, transactionExternalId }) });
export const ensureUseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsByTransactionIdData = (queryClient: QueryClient, { clientExternalId, transactionId }: {
  clientExternalId: string;
  transactionId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientTransactionServiceGetV1ClientsExternalIdByClientExternalIdTransactionsByTransactionIdKeyFn({ clientExternalId, transactionId }), queryFn: () => ClientTransactionService.getV1ClientsExternalIdByClientExternalIdTransactionsByTransactionId({ clientExternalId, transactionId }) });
export const ensureUseClientTransactionServiceGetV1ClientsByClientIdTransactionsData = (queryClient: QueryClient, { clientId, limit, offset }: {
  clientId: number;
  limit?: number;
  offset?: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientTransactionServiceGetV1ClientsByClientIdTransactionsKeyFn({ clientId, limit, offset }), queryFn: () => ClientTransactionService.getV1ClientsByClientIdTransactions({ clientId, limit, offset }) });
export const ensureUseClientTransactionServiceGetV1ClientsByClientIdTransactionsExternalIdByTransactionExternalIdData = (queryClient: QueryClient, { clientId, transactionExternalId }: {
  clientId: number;
  transactionExternalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientTransactionServiceGetV1ClientsByClientIdTransactionsExternalIdByTransactionExternalIdKeyFn({ clientId, transactionExternalId }), queryFn: () => ClientTransactionService.getV1ClientsByClientIdTransactionsExternalIdByTransactionExternalId({ clientId, transactionExternalId }) });
export const ensureUseClientTransactionServiceGetV1ClientsByClientIdTransactionsByTransactionIdData = (queryClient: QueryClient, { clientId, transactionId }: {
  clientId: number;
  transactionId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientTransactionServiceGetV1ClientsByClientIdTransactionsByTransactionIdKeyFn({ clientId, transactionId }), queryFn: () => ClientTransactionService.getV1ClientsByClientIdTransactionsByTransactionId({ clientId, transactionId }) });
export const ensureUseClientChargesServiceGetV1ClientsByClientIdChargesData = (queryClient: QueryClient, { chargeStatus, clientId, limit, offset, pendingPayment }: {
  chargeStatus?: string;
  clientId: number;
  limit?: number;
  offset?: number;
  pendingPayment?: boolean;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientChargesServiceGetV1ClientsByClientIdChargesKeyFn({ chargeStatus, clientId, limit, offset, pendingPayment }), queryFn: () => ClientChargesService.getV1ClientsByClientIdCharges({ chargeStatus, clientId, limit, offset, pendingPayment }) });
export const ensureUseClientChargesServiceGetV1ClientsByClientIdChargesTemplateData = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientChargesServiceGetV1ClientsByClientIdChargesTemplateKeyFn({ clientId }), queryFn: () => ClientChargesService.getV1ClientsByClientIdChargesTemplate({ clientId }) });
export const ensureUseClientChargesServiceGetV1ClientsByClientIdChargesByChargeIdData = (queryClient: QueryClient, { chargeId, clientId }: {
  chargeId: number;
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientChargesServiceGetV1ClientsByClientIdChargesByChargeIdKeyFn({ chargeId, clientId }), queryFn: () => ClientChargesService.getV1ClientsByClientIdChargesByChargeId({ chargeId, clientId }) });
export const ensureUseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsData = (queryClient: QueryClient, { clientId, prodId }: {
  clientId: number;
  prodId?: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsKeyFn({ clientId, prodId }), queryFn: () => ClientCollateralManagementService.getV1ClientsByClientIdCollaterals({ clientId, prodId }) });
export const ensureUseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsTemplateData = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsTemplateKeyFn({ clientId }), queryFn: () => ClientCollateralManagementService.getV1ClientsByClientIdCollateralsTemplate({ clientId }) });
export const ensureUseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsByClientCollateralIdData = (queryClient: QueryClient, { clientCollateralId, clientId }: {
  clientCollateralId: number;
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientCollateralManagementServiceGetV1ClientsByClientIdCollateralsByClientCollateralIdKeyFn({ clientCollateralId, clientId }), queryFn: () => ClientCollateralManagementService.getV1ClientsByClientIdCollateralsByClientCollateralId({ clientCollateralId, clientId }) });
export const ensureUseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersData = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersKeyFn({ clientId }), queryFn: () => ClientFamilyMemberService.getV1ClientsByClientIdFamilymembers({ clientId }) });
export const ensureUseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersTemplateData = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersTemplateKeyFn({ clientId }), queryFn: () => ClientFamilyMemberService.getV1ClientsByClientIdFamilymembersTemplate({ clientId }) });
export const ensureUseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersByFamilyMemberIdData = (queryClient: QueryClient, { clientId, familyMemberId }: {
  clientId: number;
  familyMemberId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientFamilyMemberServiceGetV1ClientsByClientIdFamilymembersByFamilyMemberIdKeyFn({ clientId, familyMemberId }), queryFn: () => ClientFamilyMemberService.getV1ClientsByClientIdFamilymembersByFamilyMemberId({ clientId, familyMemberId }) });
export const ensureUseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersData = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersKeyFn({ clientId }), queryFn: () => ClientIdentifierService.getV1ClientsByClientIdIdentifiers({ clientId }) });
export const ensureUseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersTemplateData = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersTemplateKeyFn({ clientId }), queryFn: () => ClientIdentifierService.getV1ClientsByClientIdIdentifiersTemplate({ clientId }) });
export const ensureUseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersByIdentifierIdData = (queryClient: QueryClient, { clientId, identifierId }: {
  clientId: number;
  identifierId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseClientIdentifierServiceGetV1ClientsByClientIdIdentifiersByIdentifierIdKeyFn({ clientId, identifierId }), queryFn: () => ClientIdentifierService.getV1ClientsByClientIdIdentifiersByIdentifierId({ clientId, identifierId }) });
export const ensureUseCodesServiceGetV1CodesData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseCodesServiceGetV1CodesKeyFn(), queryFn: () => CodesService.getV1Codes() });
export const ensureUseCodesServiceGetV1CodesByCodeIdData = (queryClient: QueryClient, { codeId }: {
  codeId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseCodesServiceGetV1CodesByCodeIdKeyFn({ codeId }), queryFn: () => CodesService.getV1CodesByCodeId({ codeId }) });
export const ensureUseCodeValuesServiceGetV1CodesByCodeIdCodevaluesData = (queryClient: QueryClient, { codeId }: {
  codeId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseCodeValuesServiceGetV1CodesByCodeIdCodevaluesKeyFn({ codeId }), queryFn: () => CodeValuesService.getV1CodesByCodeIdCodevalues({ codeId }) });
export const ensureUseCodeValuesServiceGetV1CodesByCodeIdCodevaluesByCodeValueIdData = (queryClient: QueryClient, { codeId, codeValueId }: {
  codeId: number;
  codeValueId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseCodeValuesServiceGetV1CodesByCodeIdCodevaluesByCodeValueIdKeyFn({ codeId, codeValueId }), queryFn: () => CodeValuesService.getV1CodesByCodeIdCodevaluesByCodeValueId({ codeId, codeValueId }) });
export const ensureUseCollateralManagementServiceGetV1CollateralManagementData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseCollateralManagementServiceGetV1CollateralManagementKeyFn(), queryFn: () => CollateralManagementService.getV1CollateralManagement() });
export const ensureUseCollateralManagementServiceGetV1CollateralManagementTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseCollateralManagementServiceGetV1CollateralManagementTemplateKeyFn(), queryFn: () => CollateralManagementService.getV1CollateralManagementTemplate() });
export const ensureUseCollateralManagementServiceGetV1CollateralManagementByCollateralIdData = (queryClient: QueryClient, { collateralId }: {
  collateralId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseCollateralManagementServiceGetV1CollateralManagementByCollateralIdKeyFn({ collateralId }), queryFn: () => CollateralManagementService.getV1CollateralManagementByCollateralId({ collateralId }) });
export const ensureUseGlobalConfigurationServiceGetV1ConfigurationsData = (queryClient: QueryClient, { survey }: {
  survey?: boolean;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseGlobalConfigurationServiceGetV1ConfigurationsKeyFn({ survey }), queryFn: () => GlobalConfigurationService.getV1Configurations({ survey }) });
export const ensureUseGlobalConfigurationServiceGetV1ConfigurationsNameByNameData = (queryClient: QueryClient, { name }: {
  name: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseGlobalConfigurationServiceGetV1ConfigurationsNameByNameKeyFn({ name }), queryFn: () => GlobalConfigurationService.getV1ConfigurationsNameByName({ name }) });
export const ensureUseGlobalConfigurationServiceGetV1ConfigurationsByConfigIdData = (queryClient: QueryClient, { configId }: {
  configId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseGlobalConfigurationServiceGetV1ConfigurationsByConfigIdKeyFn({ configId }), queryFn: () => GlobalConfigurationService.getV1ConfigurationsByConfigId({ configId }) });
export const ensureUseCurrencyServiceGetV1CurrenciesData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseCurrencyServiceGetV1CurrenciesKeyFn(), queryFn: () => CurrencyService.getV1Currencies() });
export const ensureUseDataTablesServiceGetV1DatatablesData = (queryClient: QueryClient, { apptable }: {
  apptable?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseDataTablesServiceGetV1DatatablesKeyFn({ apptable }), queryFn: () => DataTablesService.getV1Datatables({ apptable }) });
export const ensureUseDataTablesServiceGetV1DatatablesByDatatableData = (queryClient: QueryClient, { datatable }: {
  datatable: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDataTablesServiceGetV1DatatablesByDatatableKeyFn({ datatable }), queryFn: () => DataTablesService.getV1DatatablesByDatatable({ datatable }) });
export const ensureUseDataTablesServiceGetV1DatatablesByDatatableQueryData = (queryClient: QueryClient, { columnFilter, datatable, resultColumns, valueFilter }: {
  columnFilter?: string;
  datatable: string;
  resultColumns?: string;
  valueFilter?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDataTablesServiceGetV1DatatablesByDatatableQueryKeyFn({ columnFilter, datatable, resultColumns, valueFilter }), queryFn: () => DataTablesService.getV1DatatablesByDatatableQuery({ columnFilter, datatable, resultColumns, valueFilter }) });
export const ensureUseDataTablesServiceGetV1DatatablesByDatatableByApptableIdData = (queryClient: QueryClient, { apptableId, datatable, order }: {
  apptableId: number;
  datatable: string;
  order?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDataTablesServiceGetV1DatatablesByDatatableByApptableIdKeyFn({ apptableId, datatable, order }), queryFn: () => DataTablesService.getV1DatatablesByDatatableByApptableId({ apptableId, datatable, order }) });
export const ensureUseDataTablesServiceGetV1DatatablesByDatatableByApptableIdByDatatableIdData = (queryClient: QueryClient, { apptableId, datatable, datatableId, genericResultSet, order }: {
  apptableId: number;
  datatable: string;
  datatableId: number;
  genericResultSet?: boolean;
  order?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDataTablesServiceGetV1DatatablesByDatatableByApptableIdByDatatableIdKeyFn({ apptableId, datatable, datatableId, genericResultSet, order }), queryFn: () => DataTablesService.getV1DatatablesByDatatableByApptableIdByDatatableId({ apptableId, datatable, datatableId, genericResultSet, order }) });
export const ensureUseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsKeyFn(), queryFn: () => DelinquencyRangeAndBucketsManagementService.getV1DelinquencyBuckets() });
export const ensureUseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsByDelinquencyBucketIdData = (queryClient: QueryClient, { delinquencyBucketId }: {
  delinquencyBucketId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyBucketsByDelinquencyBucketIdKeyFn({ delinquencyBucketId }), queryFn: () => DelinquencyRangeAndBucketsManagementService.getV1DelinquencyBucketsByDelinquencyBucketId({ delinquencyBucketId }) });
export const ensureUseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesKeyFn(), queryFn: () => DelinquencyRangeAndBucketsManagementService.getV1DelinquencyRanges() });
export const ensureUseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesByDelinquencyRangeIdData = (queryClient: QueryClient, { delinquencyRangeId }: {
  delinquencyRangeId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDelinquencyRangeAndBucketsManagementServiceGetV1DelinquencyRangesByDelinquencyRangeIdKeyFn({ delinquencyRangeId }), queryFn: () => DelinquencyRangeAndBucketsManagementService.getV1DelinquencyRangesByDelinquencyRangeId({ delinquencyRangeId }) });
export const ensureUseEntityDataTableServiceGetV1EntityDatatableChecksData = (queryClient: QueryClient, { entity, limit, offset, productId, status }: {
  entity?: string;
  limit?: number;
  offset?: number;
  productId?: number;
  status?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseEntityDataTableServiceGetV1EntityDatatableChecksKeyFn({ entity, limit, offset, productId, status }), queryFn: () => EntityDataTableService.getV1EntityDatatableChecks({ entity, limit, offset, productId, status }) });
export const ensureUseEntityDataTableServiceGetV1EntityDatatableChecksTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseEntityDataTableServiceGetV1EntityDatatableChecksTemplateKeyFn(), queryFn: () => EntityDataTableService.getV1EntityDatatableChecksTemplate() });
export const ensureUseFineractEntityServiceGetV1EntitytoentitymappingData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseFineractEntityServiceGetV1EntitytoentitymappingKeyFn(), queryFn: () => FineractEntityService.getV1Entitytoentitymapping() });
export const ensureUseFineractEntityServiceGetV1EntitytoentitymappingByMapIdData = (queryClient: QueryClient, { mapId }: {
  mapId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseFineractEntityServiceGetV1EntitytoentitymappingByMapIdKeyFn({ mapId }), queryFn: () => FineractEntityService.getV1EntitytoentitymappingByMapId({ mapId }) });
export const ensureUseFineractEntityServiceGetV1EntitytoentitymappingByMapIdByFromIdByToIdData = (queryClient: QueryClient, { fromId, mapId, toId }: {
  fromId: number;
  mapId: number;
  toId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseFineractEntityServiceGetV1EntitytoentitymappingByMapIdByFromIdByToIdKeyFn({ fromId, mapId, toId }), queryFn: () => FineractEntityService.getV1EntitytoentitymappingByMapIdByFromIdByToId({ fromId, mapId, toId }) });
export const ensureUseExternalAssetOwnerLoanProductAttributesServiceGetV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesData = (queryClient: QueryClient, { attributeKey, loanProductId }: {
  attributeKey?: string;
  loanProductId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseExternalAssetOwnerLoanProductAttributesServiceGetV1ExternalAssetOwnersLoanProductByLoanProductIdAttributesKeyFn({ attributeKey, loanProductId }), queryFn: () => ExternalAssetOwnerLoanProductAttributesService.getV1ExternalAssetOwnersLoanProductByLoanProductIdAttributes({ attributeKey, loanProductId }) });
export const ensureUseExternalAssetOwnersServiceGetV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntriesData = (queryClient: QueryClient, { limit, offset, ownerExternalId }: {
  limit?: number;
  offset?: number;
  ownerExternalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntriesKeyFn({ limit, offset, ownerExternalId }), queryFn: () => ExternalAssetOwnersService.getV1ExternalAssetOwnersOwnersExternalIdByOwnerExternalIdJournalEntries({ limit, offset, ownerExternalId }) });
export const ensureUseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersData = (queryClient: QueryClient, { limit, loanExternalId, loanId, offset, transferExternalId }: {
  limit?: number;
  loanExternalId?: string;
  loanId?: number;
  offset?: number;
  transferExternalId?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersKeyFn({ limit, loanExternalId, loanId, offset, transferExternalId }), queryFn: () => ExternalAssetOwnersService.getV1ExternalAssetOwnersTransfers({ limit, loanExternalId, loanId, offset, transferExternalId }) });
export const ensureUseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersActiveTransferData = (queryClient: QueryClient, { loanExternalId, loanId, transferExternalId }: {
  loanExternalId?: string;
  loanId?: number;
  transferExternalId?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersActiveTransferKeyFn({ loanExternalId, loanId, transferExternalId }), queryFn: () => ExternalAssetOwnersService.getV1ExternalAssetOwnersTransfersActiveTransfer({ loanExternalId, loanId, transferExternalId }) });
export const ensureUseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersByTransferIdJournalEntriesData = (queryClient: QueryClient, { limit, offset, transferId }: {
  limit?: number;
  offset?: number;
  transferId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseExternalAssetOwnersServiceGetV1ExternalAssetOwnersTransfersByTransferIdJournalEntriesKeyFn({ limit, offset, transferId }), queryFn: () => ExternalAssetOwnersService.getV1ExternalAssetOwnersTransfersByTransferIdJournalEntries({ limit, offset, transferId }) });
export const ensureUseExternalEventConfigurationServiceGetV1ExternaleventsConfigurationData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseExternalEventConfigurationServiceGetV1ExternaleventsConfigurationKeyFn(), queryFn: () => ExternalEventConfigurationService.getV1ExternaleventsConfiguration() });
export const ensureUseExternalServicesServiceGetV1ExternalserviceByServicenameData = (queryClient: QueryClient, { servicename }: {
  servicename: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseExternalServicesServiceGetV1ExternalserviceByServicenameKeyFn({ servicename }), queryFn: () => ExternalServicesService.getV1ExternalserviceByServicename({ servicename }) });
export const ensureUseEntityFieldConfigurationServiceGetV1FieldconfigurationByEntityData = (queryClient: QueryClient, { entity }: {
  entity: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseEntityFieldConfigurationServiceGetV1FieldconfigurationByEntityKeyFn({ entity }), queryFn: () => EntityFieldConfigurationService.getV1FieldconfigurationByEntity({ entity }) });
export const ensureUseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsKeyFn(), queryFn: () => MappingFinancialActivitiesToAccountsService.getV1Financialactivityaccounts() });
export const ensureUseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsTemplateKeyFn(), queryFn: () => MappingFinancialActivitiesToAccountsService.getV1FinancialactivityaccountsTemplate() });
export const ensureUseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsByMappingIdData = (queryClient: QueryClient, { mappingId }: {
  mappingId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseMappingFinancialActivitiesToAccountsServiceGetV1FinancialactivityaccountsByMappingIdKeyFn({ mappingId }), queryFn: () => MappingFinancialActivitiesToAccountsService.getV1FinancialactivityaccountsByMappingId({ mappingId }) });
export const ensureUseFixedDepositAccountServiceGetV1FixeddepositaccountsData = (queryClient: QueryClient, { limit, offset, orderBy, paged, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  paged?: boolean;
  sortOrder?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsKeyFn({ limit, offset, orderBy, paged, sortOrder }), queryFn: () => FixedDepositAccountService.getV1Fixeddepositaccounts({ limit, offset, orderBy, paged, sortOrder }) });
export const ensureUseFixedDepositAccountServiceGetV1FixeddepositaccountsCalculateFdInterestData = (queryClient: QueryClient, { annualInterestRate, interestCompoundingPeriodInMonths, interestPostingPeriodInMonths, principalAmount, tenureInMonths }: {
  annualInterestRate?: number;
  interestCompoundingPeriodInMonths?: number;
  interestPostingPeriodInMonths?: number;
  principalAmount?: number;
  tenureInMonths?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsCalculateFdInterestKeyFn({ annualInterestRate, interestCompoundingPeriodInMonths, interestPostingPeriodInMonths, principalAmount, tenureInMonths }), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsCalculateFdInterest({ annualInterestRate, interestCompoundingPeriodInMonths, interestPostingPeriodInMonths, principalAmount, tenureInMonths }) });
export const ensureUseFixedDepositAccountServiceGetV1FixeddepositaccountsDownloadtemplateData = (queryClient: QueryClient, { dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsDownloadtemplateKeyFn({ dateFormat, officeId, staffId }), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsDownloadtemplate({ dateFormat, officeId, staffId }) });
export const ensureUseFixedDepositAccountServiceGetV1FixeddepositaccountsTemplateData = (queryClient: QueryClient, { clientId, groupId, productId, staffInSelectedOfficeOnly }: {
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsTemplateKeyFn({ clientId, groupId, productId, staffInSelectedOfficeOnly }), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsTemplate({ clientId, groupId, productId, staffInSelectedOfficeOnly }) });
export const ensureUseFixedDepositAccountServiceGetV1FixeddepositaccountsTransactionDownloadtemplateData = (queryClient: QueryClient, { dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsTransactionDownloadtemplateKeyFn({ dateFormat, officeId }), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsTransactionDownloadtemplate({ dateFormat, officeId }) });
export const ensureUseFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdData = (queryClient: QueryClient, { accountId, chargeStatus, staffInSelectedOfficeOnly }: {
  accountId: number;
  chargeStatus?: string;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.ensureQueryData({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdKeyFn({ accountId, chargeStatus, staffInSelectedOfficeOnly }), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsByAccountId({ accountId, chargeStatus, staffInSelectedOfficeOnly }) });
export const ensureUseFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdTemplateData = (queryClient: QueryClient, { accountId, command }: {
  accountId: number;
  command?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseFixedDepositAccountServiceGetV1FixeddepositaccountsByAccountIdTemplateKeyFn({ accountId, command }), queryFn: () => FixedDepositAccountService.getV1FixeddepositaccountsByAccountIdTemplate({ accountId, command }) });
export const ensureUseFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplateData = (queryClient: QueryClient, { fixedDepositAccountId }: {
  fixedDepositAccountId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplateKeyFn({ fixedDepositAccountId }), queryFn: () => FixedDepositAccountTransactionsService.getV1FixeddepositaccountsByFixedDepositAccountIdTransactionsTemplate({ fixedDepositAccountId }) });
export const ensureUseFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionIdData = (queryClient: QueryClient, { fixedDepositAccountId, transactionId }: {
  fixedDepositAccountId: number;
  transactionId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseFixedDepositAccountTransactionsServiceGetV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionIdKeyFn({ fixedDepositAccountId, transactionId }), queryFn: () => FixedDepositAccountTransactionsService.getV1FixeddepositaccountsByFixedDepositAccountIdTransactionsByTransactionId({ fixedDepositAccountId, transactionId }) });
export const ensureUseFixedDepositProductServiceGetV1FixeddepositproductsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseFixedDepositProductServiceGetV1FixeddepositproductsKeyFn(), queryFn: () => FixedDepositProductService.getV1Fixeddepositproducts() });
export const ensureUseFixedDepositProductServiceGetV1FixeddepositproductsTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseFixedDepositProductServiceGetV1FixeddepositproductsTemplateKeyFn(), queryFn: () => FixedDepositProductService.getV1FixeddepositproductsTemplate() });
export const ensureUseFixedDepositProductServiceGetV1FixeddepositproductsByProductIdData = (queryClient: QueryClient, { productId }: {
  productId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseFixedDepositProductServiceGetV1FixeddepositproductsByProductIdKeyFn({ productId }), queryFn: () => FixedDepositProductService.getV1FixeddepositproductsByProductId({ productId }) });
export const ensureUseFloatingRatesServiceGetV1FloatingratesData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseFloatingRatesServiceGetV1FloatingratesKeyFn(), queryFn: () => FloatingRatesService.getV1Floatingrates() });
export const ensureUseFloatingRatesServiceGetV1FloatingratesByFloatingRateIdData = (queryClient: QueryClient, { floatingRateId }: {
  floatingRateId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseFloatingRatesServiceGetV1FloatingratesByFloatingRateIdKeyFn({ floatingRateId }), queryFn: () => FloatingRatesService.getV1FloatingratesByFloatingRateId({ floatingRateId }) });
export const ensureUseFundsServiceGetV1FundsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseFundsServiceGetV1FundsKeyFn(), queryFn: () => FundsService.getV1Funds() });
export const ensureUseFundsServiceGetV1FundsByFundIdData = (queryClient: QueryClient, { fundId }: {
  fundId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseFundsServiceGetV1FundsByFundIdKeyFn({ fundId }), queryFn: () => FundsService.getV1FundsByFundId({ fundId }) });
export const ensureUseGeneralLedgerAccountServiceGetV1GlaccountsData = (queryClient: QueryClient, { disabled, fetchRunningBalance, manualEntriesAllowed, searchParam, type, usage }: {
  disabled?: boolean;
  fetchRunningBalance?: boolean;
  manualEntriesAllowed?: boolean;
  searchParam?: string;
  type?: number;
  usage?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseGeneralLedgerAccountServiceGetV1GlaccountsKeyFn({ disabled, fetchRunningBalance, manualEntriesAllowed, searchParam, type, usage }), queryFn: () => GeneralLedgerAccountService.getV1Glaccounts({ disabled, fetchRunningBalance, manualEntriesAllowed, searchParam, type, usage }) });
export const ensureUseGeneralLedgerAccountServiceGetV1GlaccountsDownloadtemplateData = (queryClient: QueryClient, { dateFormat }: {
  dateFormat?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseGeneralLedgerAccountServiceGetV1GlaccountsDownloadtemplateKeyFn({ dateFormat }), queryFn: () => GeneralLedgerAccountService.getV1GlaccountsDownloadtemplate({ dateFormat }) });
export const ensureUseGeneralLedgerAccountServiceGetV1GlaccountsTemplateData = (queryClient: QueryClient, { type }: {
  type?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseGeneralLedgerAccountServiceGetV1GlaccountsTemplateKeyFn({ type }), queryFn: () => GeneralLedgerAccountService.getV1GlaccountsTemplate({ type }) });
export const ensureUseGeneralLedgerAccountServiceGetV1GlaccountsByGlAccountIdData = (queryClient: QueryClient, { fetchRunningBalance, glAccountId }: {
  fetchRunningBalance?: boolean;
  glAccountId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseGeneralLedgerAccountServiceGetV1GlaccountsByGlAccountIdKeyFn({ fetchRunningBalance, glAccountId }), queryFn: () => GeneralLedgerAccountService.getV1GlaccountsByGlAccountId({ fetchRunningBalance, glAccountId }) });
export const ensureUseAccountingClosureServiceGetV1GlclosuresData = (queryClient: QueryClient, { officeId }: {
  officeId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseAccountingClosureServiceGetV1GlclosuresKeyFn({ officeId }), queryFn: () => AccountingClosureService.getV1Glclosures({ officeId }) });
export const ensureUseAccountingClosureServiceGetV1GlclosuresByGlClosureIdData = (queryClient: QueryClient, { glClosureId }: {
  glClosureId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseAccountingClosureServiceGetV1GlclosuresByGlClosureIdKeyFn({ glClosureId }), queryFn: () => AccountingClosureService.getV1GlclosuresByGlClosureId({ glClosureId }) });
export const ensureUseGroupsLevelServiceGetV1GrouplevelsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseGroupsLevelServiceGetV1GrouplevelsKeyFn(), queryFn: () => GroupsLevelService.getV1Grouplevels() });
export const ensureUseGroupsServiceGetV1GroupsData = (queryClient: QueryClient, { externalId, limit, name, officeId, offset, orderBy, orphansOnly, paged, sortOrder, staffId, underHierarchy }: {
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
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseGroupsServiceGetV1GroupsKeyFn({ externalId, limit, name, officeId, offset, orderBy, orphansOnly, paged, sortOrder, staffId, underHierarchy }), queryFn: () => GroupsService.getV1Groups({ externalId, limit, name, officeId, offset, orderBy, orphansOnly, paged, sortOrder, staffId, underHierarchy }) });
export const ensureUseGroupsServiceGetV1GroupsDownloadtemplateData = (queryClient: QueryClient, { dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseGroupsServiceGetV1GroupsDownloadtemplateKeyFn({ dateFormat, officeId, staffId }), queryFn: () => GroupsService.getV1GroupsDownloadtemplate({ dateFormat, officeId, staffId }) });
export const ensureUseGroupsServiceGetV1GroupsTemplateData = (queryClient: QueryClient, { center, centerId, command, officeId, staffInSelectedOfficeOnly }: {
  center?: boolean;
  centerId?: number;
  command?: string;
  officeId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseGroupsServiceGetV1GroupsTemplateKeyFn({ center, centerId, command, officeId, staffInSelectedOfficeOnly }), queryFn: () => GroupsService.getV1GroupsTemplate({ center, centerId, command, officeId, staffInSelectedOfficeOnly }) });
export const ensureUseGroupsServiceGetV1GroupsByGroupIdData = (queryClient: QueryClient, { groupId, roleId, staffInSelectedOfficeOnly }: {
  groupId: number;
  roleId?: number;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.ensureQueryData({ queryKey: Common.UseGroupsServiceGetV1GroupsByGroupIdKeyFn({ groupId, roleId, staffInSelectedOfficeOnly }), queryFn: () => GroupsService.getV1GroupsByGroupId({ groupId, roleId, staffInSelectedOfficeOnly }) });
export const ensureUseGroupsServiceGetV1GroupsByGroupIdAccountsData = (queryClient: QueryClient, { groupId }: {
  groupId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseGroupsServiceGetV1GroupsByGroupIdAccountsKeyFn({ groupId }), queryFn: () => GroupsService.getV1GroupsByGroupIdAccounts({ groupId }) });
export const ensureUseGroupsServiceGetV1GroupsByGroupIdGlimaccountsData = (queryClient: QueryClient, { groupId, parentLoanAccountNo }: {
  groupId: number;
  parentLoanAccountNo?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseGroupsServiceGetV1GroupsByGroupIdGlimaccountsKeyFn({ groupId, parentLoanAccountNo }), queryFn: () => GroupsService.getV1GroupsByGroupIdGlimaccounts({ groupId, parentLoanAccountNo }) });
export const ensureUseGroupsServiceGetV1GroupsByGroupIdGsimaccountsData = (queryClient: QueryClient, { groupId, parentGsimAccountNo, parentGsimId }: {
  groupId: number;
  parentGsimAccountNo?: string;
  parentGsimId?: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseGroupsServiceGetV1GroupsByGroupIdGsimaccountsKeyFn({ groupId, parentGsimAccountNo, parentGsimId }), queryFn: () => GroupsService.getV1GroupsByGroupIdGsimaccounts({ groupId, parentGsimAccountNo, parentGsimId }) });
export const ensureUseHolidaysServiceGetV1HolidaysData = (queryClient: QueryClient, { dateFormat, fromDate, locale, officeId, toDate }: {
  dateFormat?: string;
  fromDate?: DateParam;
  locale?: string;
  officeId?: number;
  toDate?: DateParam;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseHolidaysServiceGetV1HolidaysKeyFn({ dateFormat, fromDate, locale, officeId, toDate }), queryFn: () => HolidaysService.getV1Holidays({ dateFormat, fromDate, locale, officeId, toDate }) });
export const ensureUseHolidaysServiceGetV1HolidaysTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseHolidaysServiceGetV1HolidaysTemplateKeyFn(), queryFn: () => HolidaysService.getV1HolidaysTemplate() });
export const ensureUseHolidaysServiceGetV1HolidaysByHolidayIdData = (queryClient: QueryClient, { holidayId }: {
  holidayId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseHolidaysServiceGetV1HolidaysByHolidayIdKeyFn({ holidayId }), queryFn: () => HolidaysService.getV1HolidaysByHolidayId({ holidayId }) });
export const ensureUseHooksServiceGetV1HooksData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseHooksServiceGetV1HooksKeyFn(), queryFn: () => HooksService.getV1Hooks() });
export const ensureUseHooksServiceGetV1HooksTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseHooksServiceGetV1HooksTemplateKeyFn(), queryFn: () => HooksService.getV1HooksTemplate() });
export const ensureUseHooksServiceGetV1HooksByHookIdData = (queryClient: QueryClient, { hookId }: {
  hookId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseHooksServiceGetV1HooksByHookIdKeyFn({ hookId }), queryFn: () => HooksService.getV1HooksByHookId({ hookId }) });
export const ensureUseBulkImportServiceGetV1ImportsData = (queryClient: QueryClient, { entityType }: {
  entityType?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseBulkImportServiceGetV1ImportsKeyFn({ entityType }), queryFn: () => BulkImportService.getV1Imports({ entityType }) });
export const ensureUseBulkImportServiceGetV1ImportsDownloadOutputTemplateData = (queryClient: QueryClient, { importDocumentId }: {
  importDocumentId?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseBulkImportServiceGetV1ImportsDownloadOutputTemplateKeyFn({ importDocumentId }), queryFn: () => BulkImportService.getV1ImportsDownloadOutputTemplate({ importDocumentId }) });
export const ensureUseBulkImportServiceGetV1ImportsGetOutputTemplateLocationData = (queryClient: QueryClient, { importDocumentId }: {
  importDocumentId?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseBulkImportServiceGetV1ImportsGetOutputTemplateLocationKeyFn({ importDocumentId }), queryFn: () => BulkImportService.getV1ImportsGetOutputTemplateLocation({ importDocumentId }) });
export const ensureUseInterestRateChartServiceGetV1InterestratechartsData = (queryClient: QueryClient, { productId }: {
  productId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseInterestRateChartServiceGetV1InterestratechartsKeyFn({ productId }), queryFn: () => InterestRateChartService.getV1Interestratecharts({ productId }) });
export const ensureUseInterestRateChartServiceGetV1InterestratechartsTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseInterestRateChartServiceGetV1InterestratechartsTemplateKeyFn(), queryFn: () => InterestRateChartService.getV1InterestratechartsTemplate() });
export const ensureUseInterestRateChartServiceGetV1InterestratechartsByChartIdData = (queryClient: QueryClient, { chartId }: {
  chartId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseInterestRateChartServiceGetV1InterestratechartsByChartIdKeyFn({ chartId }), queryFn: () => InterestRateChartService.getV1InterestratechartsByChartId({ chartId }) });
export const ensureUseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsData = (queryClient: QueryClient, { chartId }: {
  chartId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsKeyFn({ chartId }), queryFn: () => InterestRateSlabAKAInterestBandsService.getV1InterestratechartsByChartIdChartslabs({ chartId }) });
export const ensureUseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsTemplateData = (queryClient: QueryClient, { chartId }: {
  chartId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsTemplateKeyFn({ chartId }), queryFn: () => InterestRateSlabAKAInterestBandsService.getV1InterestratechartsByChartIdChartslabsTemplate({ chartId }) });
export const ensureUseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsByChartSlabIdData = (queryClient: QueryClient, { chartId, chartSlabId }: {
  chartId: number;
  chartSlabId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseInterestRateSlabAKAInterestBandsServiceGetV1InterestratechartsByChartIdChartslabsByChartSlabIdKeyFn({ chartId, chartSlabId }), queryFn: () => InterestRateSlabAKAInterestBandsService.getV1InterestratechartsByChartIdChartslabsByChartSlabId({ chartId, chartSlabId }) });
export const ensureUseProgressiveLoanServiceGetV1InternalLoanProgressiveByLoanIdModelData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseProgressiveLoanServiceGetV1InternalLoanProgressiveByLoanIdModelKeyFn({ loanId }), queryFn: () => ProgressiveLoanService.getV1InternalLoanProgressiveByLoanIdModel({ loanId }) });
export const ensureUseInterOperationServiceGetV1InteroperationAccountsByAccountIdData = (queryClient: QueryClient, { accountId }: {
  accountId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseInterOperationServiceGetV1InteroperationAccountsByAccountIdKeyFn({ accountId }), queryFn: () => InterOperationService.getV1InteroperationAccountsByAccountId({ accountId }) });
export const ensureUseInterOperationServiceGetV1InteroperationAccountsByAccountIdIdentifiersData = (queryClient: QueryClient, { accountId }: {
  accountId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseInterOperationServiceGetV1InteroperationAccountsByAccountIdIdentifiersKeyFn({ accountId }), queryFn: () => InterOperationService.getV1InteroperationAccountsByAccountIdIdentifiers({ accountId }) });
export const ensureUseInterOperationServiceGetV1InteroperationAccountsByAccountIdKycData = (queryClient: QueryClient, { accountId }: {
  accountId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseInterOperationServiceGetV1InteroperationAccountsByAccountIdKycKeyFn({ accountId }), queryFn: () => InterOperationService.getV1InteroperationAccountsByAccountIdKyc({ accountId }) });
export const ensureUseInterOperationServiceGetV1InteroperationAccountsByAccountIdTransactionsData = (queryClient: QueryClient, { accountId, credit, debit, fromBookingDateTime, toBookingDateTime }: {
  accountId: string;
  credit?: boolean;
  debit?: boolean;
  fromBookingDateTime?: string;
  toBookingDateTime?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseInterOperationServiceGetV1InteroperationAccountsByAccountIdTransactionsKeyFn({ accountId, credit, debit, fromBookingDateTime, toBookingDateTime }), queryFn: () => InterOperationService.getV1InteroperationAccountsByAccountIdTransactions({ accountId, credit, debit, fromBookingDateTime, toBookingDateTime }) });
export const ensureUseInterOperationServiceGetV1InteroperationHealthData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseInterOperationServiceGetV1InteroperationHealthKeyFn(), queryFn: () => InterOperationService.getV1InteroperationHealth() });
export const ensureUseInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueData = (queryClient: QueryClient, { idType, idValue }: {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueKeyFn({ idType, idValue }), queryFn: () => InterOperationService.getV1InteroperationPartiesByIdTypeByIdValue({ idType, idValue }) });
export const ensureUseInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeData = (queryClient: QueryClient, { idType, idValue, subIdOrType }: {
  idType: "MSISDN" | "EMAIL" | "PERSONAL_ID" | "BUSINESS" | "DEVICE" | "ACCOUNT_ID" | "IBAN" | "ALIAS" | "BBAN";
  idValue: string;
  subIdOrType: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseInterOperationServiceGetV1InteroperationPartiesByIdTypeByIdValueBySubIdOrTypeKeyFn({ idType, idValue, subIdOrType }), queryFn: () => InterOperationService.getV1InteroperationPartiesByIdTypeByIdValueBySubIdOrType({ idType, idValue, subIdOrType }) });
export const ensureUseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCodeData = (queryClient: QueryClient, { quoteCode, transactionCode }: {
  quoteCode: string;
  transactionCode: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCodeKeyFn({ quoteCode, transactionCode }), queryFn: () => InterOperationService.getV1InteroperationTransactionsByTransactionCodeQuotesByQuoteCode({ quoteCode, transactionCode }) });
export const ensureUseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeRequestsByRequestCodeData = (queryClient: QueryClient, { requestCode, transactionCode }: {
  requestCode: string;
  transactionCode: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeRequestsByRequestCodeKeyFn({ requestCode, transactionCode }), queryFn: () => InterOperationService.getV1InteroperationTransactionsByTransactionCodeRequestsByRequestCode({ requestCode, transactionCode }) });
export const ensureUseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeTransfersByTransferCodeData = (queryClient: QueryClient, { transactionCode, transferCode }: {
  transactionCode: string;
  transferCode: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseInterOperationServiceGetV1InteroperationTransactionsByTransactionCodeTransfersByTransferCodeKeyFn({ transactionCode, transferCode }), queryFn: () => InterOperationService.getV1InteroperationTransactionsByTransactionCodeTransfersByTransferCode({ transactionCode, transferCode }) });
export const ensureUseSchedulerJobServiceGetV1JobsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseSchedulerJobServiceGetV1JobsKeyFn(), queryFn: () => SchedulerJobService.getV1Jobs() });
export const ensureUseSchedulerJobServiceGetV1JobsShortNameByShortNameData = (queryClient: QueryClient, { shortName }: {
  shortName: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSchedulerJobServiceGetV1JobsShortNameByShortNameKeyFn({ shortName }), queryFn: () => SchedulerJobService.getV1JobsShortNameByShortName({ shortName }) });
export const ensureUseSchedulerJobServiceGetV1JobsShortNameByShortNameRunhistoryData = (queryClient: QueryClient, { limit, offset, orderBy, shortName, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  shortName: string;
  sortOrder?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSchedulerJobServiceGetV1JobsShortNameByShortNameRunhistoryKeyFn({ limit, offset, orderBy, shortName, sortOrder }), queryFn: () => SchedulerJobService.getV1JobsShortNameByShortNameRunhistory({ limit, offset, orderBy, shortName, sortOrder }) });
export const ensureUseSchedulerJobServiceGetV1JobsByJobIdData = (queryClient: QueryClient, { jobId }: {
  jobId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSchedulerJobServiceGetV1JobsByJobIdKeyFn({ jobId }), queryFn: () => SchedulerJobService.getV1JobsByJobId({ jobId }) });
export const ensureUseSchedulerJobServiceGetV1JobsByJobIdRunhistoryData = (queryClient: QueryClient, { jobId, limit, offset, orderBy, sortOrder }: {
  jobId: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSchedulerJobServiceGetV1JobsByJobIdRunhistoryKeyFn({ jobId, limit, offset, orderBy, sortOrder }), queryFn: () => SchedulerJobService.getV1JobsByJobIdRunhistory({ jobId, limit, offset, orderBy, sortOrder }) });
export const ensureUseBusinessStepConfigurationServiceGetV1JobsNamesData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseBusinessStepConfigurationServiceGetV1JobsNamesKeyFn(), queryFn: () => BusinessStepConfigurationService.getV1JobsNames() });
export const ensureUseBusinessStepConfigurationServiceGetV1JobsByJobNameAvailableStepsData = (queryClient: QueryClient, { jobName }: {
  jobName: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseBusinessStepConfigurationServiceGetV1JobsByJobNameAvailableStepsKeyFn({ jobName }), queryFn: () => BusinessStepConfigurationService.getV1JobsByJobNameAvailableSteps({ jobName }) });
export const ensureUseBusinessStepConfigurationServiceGetV1JobsByJobNameStepsData = (queryClient: QueryClient, { jobName }: {
  jobName: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseBusinessStepConfigurationServiceGetV1JobsByJobNameStepsKeyFn({ jobName }), queryFn: () => BusinessStepConfigurationService.getV1JobsByJobNameSteps({ jobName }) });
export const ensureUseJournalEntriesServiceGetV1JournalentriesData = (queryClient: QueryClient, { dateFormat, entityType, fromDate, glAccountId, limit, loanId, locale, manualEntriesOnly, officeId, offset, orderBy, runningBalance, savingsId, sortOrder, submittedOnDateFrom, submittedOnDateTo, toDate, transactionDetails, transactionId }: {
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
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesKeyFn({ dateFormat, entityType, fromDate, glAccountId, limit, loanId, locale, manualEntriesOnly, officeId, offset, orderBy, runningBalance, savingsId, sortOrder, submittedOnDateFrom, submittedOnDateTo, toDate, transactionDetails, transactionId }), queryFn: () => JournalEntriesService.getV1Journalentries({ dateFormat, entityType, fromDate, glAccountId, limit, loanId, locale, manualEntriesOnly, officeId, offset, orderBy, runningBalance, savingsId, sortOrder, submittedOnDateFrom, submittedOnDateTo, toDate, transactionDetails, transactionId }) });
export const ensureUseJournalEntriesServiceGetV1JournalentriesDownloadtemplateData = (queryClient: QueryClient, { dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesDownloadtemplateKeyFn({ dateFormat, officeId }), queryFn: () => JournalEntriesService.getV1JournalentriesDownloadtemplate({ dateFormat, officeId }) });
export const ensureUseJournalEntriesServiceGetV1JournalentriesOpeningbalanceData = (queryClient: QueryClient, { currencyCode, officeId }: {
  currencyCode?: string;
  officeId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesOpeningbalanceKeyFn({ currencyCode, officeId }), queryFn: () => JournalEntriesService.getV1JournalentriesOpeningbalance({ currencyCode, officeId }) });
export const ensureUseJournalEntriesServiceGetV1JournalentriesProvisioningData = (queryClient: QueryClient, { entryId, limit, offset }: {
  entryId?: number;
  limit?: number;
  offset?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesProvisioningKeyFn({ entryId, limit, offset }), queryFn: () => JournalEntriesService.getV1JournalentriesProvisioning({ entryId, limit, offset }) });
export const ensureUseJournalEntriesServiceGetV1JournalentriesByJournalEntryIdData = (queryClient: QueryClient, { journalEntryId, runningBalance, transactionDetails }: {
  journalEntryId: number;
  runningBalance?: boolean;
  transactionDetails?: boolean;
}) => queryClient.ensureQueryData({ queryKey: Common.UseJournalEntriesServiceGetV1JournalentriesByJournalEntryIdKeyFn({ journalEntryId, runningBalance, transactionDetails }), queryFn: () => JournalEntriesService.getV1JournalentriesByJournalEntryId({ journalEntryId, runningBalance, transactionDetails }) });
export const ensureUseLikelihoodServiceGetV1LikelihoodByPpiNameData = (queryClient: QueryClient, { ppiName }: {
  ppiName: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLikelihoodServiceGetV1LikelihoodByPpiNameKeyFn({ ppiName }), queryFn: () => LikelihoodService.getV1LikelihoodByPpiName({ ppiName }) });
export const ensureUseLikelihoodServiceGetV1LikelihoodByPpiNameByLikelihoodIdData = (queryClient: QueryClient, { likelihoodId, ppiName }: {
  likelihoodId: number;
  ppiName: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLikelihoodServiceGetV1LikelihoodByPpiNameByLikelihoodIdKeyFn({ likelihoodId, ppiName }), queryFn: () => LikelihoodService.getV1LikelihoodByPpiNameByLikelihoodId({ likelihoodId, ppiName }) });
export const ensureUseLoanCollateralManagementServiceGetV1LoanCollateralManagementByCollateralIdData = (queryClient: QueryClient, { collateralId }: {
  collateralId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanCollateralManagementServiceGetV1LoanCollateralManagementByCollateralIdKeyFn({ collateralId }), queryFn: () => LoanCollateralManagementService.getV1LoanCollateralManagementByCollateralId({ collateralId }) });
export const ensureUseLoanProductsServiceGetV1LoanproductsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseLoanProductsServiceGetV1LoanproductsKeyFn(), queryFn: () => LoanProductsService.getV1Loanproducts() });
export const ensureUseLoanProductsServiceGetV1LoanproductsExternalIdByExternalProductIdData = (queryClient: QueryClient, { externalProductId }: {
  externalProductId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanProductsServiceGetV1LoanproductsExternalIdByExternalProductIdKeyFn({ externalProductId }), queryFn: () => LoanProductsService.getV1LoanproductsExternalIdByExternalProductId({ externalProductId }) });
export const ensureUseLoanProductsServiceGetV1LoanproductsTemplateData = (queryClient: QueryClient, { isProductMixTemplate }: {
  isProductMixTemplate?: boolean;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanProductsServiceGetV1LoanproductsTemplateKeyFn({ isProductMixTemplate }), queryFn: () => LoanProductsService.getV1LoanproductsTemplate({ isProductMixTemplate }) });
export const ensureUseLoanProductsServiceGetV1LoanproductsByProductIdData = (queryClient: QueryClient, { productId }: {
  productId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanProductsServiceGetV1LoanproductsByProductIdKeyFn({ productId }), queryFn: () => LoanProductsService.getV1LoanproductsByProductId({ productId }) });
export const ensureUseProductMixServiceGetV1LoanproductsByProductIdProductmixData = (queryClient: QueryClient, { productId }: {
  productId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseProductMixServiceGetV1LoanproductsByProductIdProductmixKeyFn({ productId }), queryFn: () => ProductMixService.getV1LoanproductsByProductIdProductmix({ productId }) });
export const ensureUseLoansServiceGetV1LoansData = (queryClient: QueryClient, { accountNo, associations, clientId, externalId, limit, offset, orderBy, sortOrder, status }: {
  accountNo?: string;
  associations?: string;
  clientId?: number;
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  status?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseLoansServiceGetV1LoansKeyFn({ accountNo, associations, clientId, externalId, limit, offset, orderBy, sortOrder, status }), queryFn: () => LoansService.getV1Loans({ accountNo, associations, clientId, externalId, limit, offset, orderBy, sortOrder, status }) });
export const ensureUseLoansServiceGetV1LoansDownloadtemplateData = (queryClient: QueryClient, { dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseLoansServiceGetV1LoansDownloadtemplateKeyFn({ dateFormat, officeId, staffId }), queryFn: () => LoansService.getV1LoansDownloadtemplate({ dateFormat, officeId, staffId }) });
export const ensureUseLoansServiceGetV1LoansExternalIdByLoanExternalIdData = (queryClient: QueryClient, { associations, exclude, fields, loanExternalId, staffInSelectedOfficeOnly }: {
  associations?: string;
  exclude?: string;
  fields?: string;
  loanExternalId: string;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdKeyFn({ associations, exclude, fields, loanExternalId, staffInSelectedOfficeOnly }), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalId({ associations, exclude, fields, loanExternalId, staffInSelectedOfficeOnly }) });
export const ensureUseLoansServiceGetV1LoansExternalIdByLoanExternalIdApprovedAmountData = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdApprovedAmountKeyFn({ loanExternalId }), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalIdApprovedAmount({ loanExternalId }) });
export const ensureUseLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencyActionsData = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencyActionsKeyFn({ loanExternalId }), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalIdDelinquencyActions({ loanExternalId }) });
export const ensureUseLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencytagsData = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdDelinquencytagsKeyFn({ loanExternalId }), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalIdDelinquencytags({ loanExternalId }) });
export const ensureUseLoansServiceGetV1LoansExternalIdByLoanExternalIdTemplateData = (queryClient: QueryClient, { loanExternalId, templateType }: {
  loanExternalId: string;
  templateType?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoansServiceGetV1LoansExternalIdByLoanExternalIdTemplateKeyFn({ loanExternalId, templateType }), queryFn: () => LoansService.getV1LoansExternalIdByLoanExternalIdTemplate({ loanExternalId, templateType }) });
export const ensureUseLoansServiceGetV1LoansGlimAccountByGlimIdData = (queryClient: QueryClient, { glimId }: {
  glimId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoansServiceGetV1LoansGlimAccountByGlimIdKeyFn({ glimId }), queryFn: () => LoansService.getV1LoansGlimAccountByGlimId({ glimId }) });
export const ensureUseLoansServiceGetV1LoansRepaymentsDownloadtemplateData = (queryClient: QueryClient, { dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseLoansServiceGetV1LoansRepaymentsDownloadtemplateKeyFn({ dateFormat, officeId }), queryFn: () => LoansService.getV1LoansRepaymentsDownloadtemplate({ dateFormat, officeId }) });
export const ensureUseLoansServiceGetV1LoansTemplateData = (queryClient: QueryClient, { activeOnly, clientId, groupId, productId, staffInSelectedOfficeOnly, templateType }: {
  activeOnly?: boolean;
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
  templateType?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseLoansServiceGetV1LoansTemplateKeyFn({ activeOnly, clientId, groupId, productId, staffInSelectedOfficeOnly, templateType }), queryFn: () => LoansService.getV1LoansTemplate({ activeOnly, clientId, groupId, productId, staffInSelectedOfficeOnly, templateType }) });
export const ensureUseLoansServiceGetV1LoansByLoanIdData = (queryClient: QueryClient, { associations, exclude, fields, loanId, staffInSelectedOfficeOnly }: {
  associations?: string;
  exclude?: string;
  fields?: string;
  loanId: number;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdKeyFn({ associations, exclude, fields, loanId, staffInSelectedOfficeOnly }), queryFn: () => LoansService.getV1LoansByLoanId({ associations, exclude, fields, loanId, staffInSelectedOfficeOnly }) });
export const ensureUseLoansServiceGetV1LoansByLoanIdApprovedAmountData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdApprovedAmountKeyFn({ loanId }), queryFn: () => LoansService.getV1LoansByLoanIdApprovedAmount({ loanId }) });
export const ensureUseLoansServiceGetV1LoansByLoanIdDelinquencyActionsData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdDelinquencyActionsKeyFn({ loanId }), queryFn: () => LoansService.getV1LoansByLoanIdDelinquencyActions({ loanId }) });
export const ensureUseLoansServiceGetV1LoansByLoanIdDelinquencytagsData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdDelinquencytagsKeyFn({ loanId }), queryFn: () => LoansService.getV1LoansByLoanIdDelinquencytags({ loanId }) });
export const ensureUseLoansServiceGetV1LoansByLoanIdTemplateData = (queryClient: QueryClient, { loanId, templateType }: {
  loanId: number;
  templateType?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoansServiceGetV1LoansByLoanIdTemplateKeyFn({ loanId, templateType }), queryFn: () => LoansService.getV1LoansByLoanIdTemplate({ loanId, templateType }) });
export const ensureUseLoansPointInTimeServiceGetV1LoansAtDateExternalIdByLoanExternalIdData = (queryClient: QueryClient, { date, dateFormat, loanExternalId, locale }: {
  date: DateParam;
  dateFormat?: string;
  loanExternalId: string;
  locale?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoansPointInTimeServiceGetV1LoansAtDateExternalIdByLoanExternalIdKeyFn({ date, dateFormat, loanExternalId, locale }), queryFn: () => LoansPointInTimeService.getV1LoansAtDateExternalIdByLoanExternalId({ date, dateFormat, loanExternalId, locale }) });
export const ensureUseLoansPointInTimeServiceGetV1LoansAtDateByLoanIdData = (queryClient: QueryClient, { date, dateFormat, loanId, locale }: {
  date: DateParam;
  dateFormat?: string;
  loanId: number;
  locale?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoansPointInTimeServiceGetV1LoansAtDateByLoanIdKeyFn({ date, dateFormat, loanId, locale }), queryFn: () => LoansPointInTimeService.getV1LoansAtDateByLoanId({ date, dateFormat, loanId, locale }) });
export const ensureUseLoanCobCatchUpServiceGetV1LoansIsCatchUpRunningData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseLoanCobCatchUpServiceGetV1LoansIsCatchUpRunningKeyFn(), queryFn: () => LoanCobCatchUpService.getV1LoansIsCatchUpRunning() });
export const ensureUseLoanCobCatchUpServiceGetV1LoansOldestCobClosedData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseLoanCobCatchUpServiceGetV1LoansOldestCobClosedKeyFn(), queryFn: () => LoanCobCatchUpService.getV1LoansOldestCobClosed() });
export const ensureUseLoanBuyDownFeesServiceGetV1LoansExternalIdByLoanExternalIdBuydownFeesData = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanBuyDownFeesServiceGetV1LoansExternalIdByLoanExternalIdBuydownFeesKeyFn({ loanExternalId }), queryFn: () => LoanBuyDownFeesService.getV1LoansExternalIdByLoanExternalIdBuydownFees({ loanExternalId }) });
export const ensureUseLoanBuyDownFeesServiceGetV1LoansByLoanIdBuydownFeesData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanBuyDownFeesServiceGetV1LoansByLoanIdBuydownFeesKeyFn({ loanId }), queryFn: () => LoanBuyDownFeesService.getV1LoansByLoanIdBuydownFees({ loanId }) });
export const ensureUseLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdCapitalizedIncomesData = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdCapitalizedIncomesKeyFn({ loanExternalId }), queryFn: () => LoanCapitalizedIncomeService.getV1LoansExternalIdByLoanExternalIdCapitalizedIncomes({ loanExternalId }) });
export const ensureUseLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdDeferredincomeData = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanCapitalizedIncomeServiceGetV1LoansExternalIdByLoanExternalIdDeferredincomeKeyFn({ loanExternalId }), queryFn: () => LoanCapitalizedIncomeService.getV1LoansExternalIdByLoanExternalIdDeferredincome({ loanExternalId }) });
export const ensureUseLoanCapitalizedIncomeServiceGetV1LoansByLoanIdCapitalizedIncomesData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanCapitalizedIncomeServiceGetV1LoansByLoanIdCapitalizedIncomesKeyFn({ loanId }), queryFn: () => LoanCapitalizedIncomeService.getV1LoansByLoanIdCapitalizedIncomes({ loanId }) });
export const ensureUseLoanCapitalizedIncomeServiceGetV1LoansByLoanIdDeferredincomeData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanCapitalizedIncomeServiceGetV1LoansByLoanIdDeferredincomeKeyFn({ loanId }), queryFn: () => LoanCapitalizedIncomeService.getV1LoansByLoanIdDeferredincome({ loanId }) });
export const ensureUseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesData = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesKeyFn({ loanExternalId }), queryFn: () => LoanChargesService.getV1LoansExternalIdByLoanExternalIdCharges({ loanExternalId }) });
export const ensureUseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdData = (queryClient: QueryClient, { loanChargeExternalId, loanExternalId }: {
  loanChargeExternalId: string;
  loanExternalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalIdKeyFn({ loanChargeExternalId, loanExternalId }), queryFn: () => LoanChargesService.getV1LoansExternalIdByLoanExternalIdChargesExternalIdByLoanChargeExternalId({ loanChargeExternalId, loanExternalId }) });
export const ensureUseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesTemplateData = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesTemplateKeyFn({ loanExternalId }), queryFn: () => LoanChargesService.getV1LoansExternalIdByLoanExternalIdChargesTemplate({ loanExternalId }) });
export const ensureUseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdData = (queryClient: QueryClient, { loanChargeId, loanExternalId }: {
  loanChargeId: number;
  loanExternalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanChargesServiceGetV1LoansExternalIdByLoanExternalIdChargesByLoanChargeIdKeyFn({ loanChargeId, loanExternalId }), queryFn: () => LoanChargesService.getV1LoansExternalIdByLoanExternalIdChargesByLoanChargeId({ loanChargeId, loanExternalId }) });
export const ensureUseLoanChargesServiceGetV1LoansByLoanIdChargesData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanChargesServiceGetV1LoansByLoanIdChargesKeyFn({ loanId }), queryFn: () => LoanChargesService.getV1LoansByLoanIdCharges({ loanId }) });
export const ensureUseLoanChargesServiceGetV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdData = (queryClient: QueryClient, { loanChargeExternalId, loanId }: {
  loanChargeExternalId: string;
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanChargesServiceGetV1LoansByLoanIdChargesExternalIdByLoanChargeExternalIdKeyFn({ loanChargeExternalId, loanId }), queryFn: () => LoanChargesService.getV1LoansByLoanIdChargesExternalIdByLoanChargeExternalId({ loanChargeExternalId, loanId }) });
export const ensureUseLoanChargesServiceGetV1LoansByLoanIdChargesTemplateData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanChargesServiceGetV1LoansByLoanIdChargesTemplateKeyFn({ loanId }), queryFn: () => LoanChargesService.getV1LoansByLoanIdChargesTemplate({ loanId }) });
export const ensureUseLoanChargesServiceGetV1LoansByLoanIdChargesByLoanChargeIdData = (queryClient: QueryClient, { loanChargeId, loanId }: {
  loanChargeId: number;
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanChargesServiceGetV1LoansByLoanIdChargesByLoanChargeIdKeyFn({ loanChargeId, loanId }), queryFn: () => LoanChargesService.getV1LoansByLoanIdChargesByLoanChargeId({ loanChargeId, loanId }) });
export const ensureUseLoanInterestPauseServiceGetV1LoansExternalIdByLoanExternalIdInterestPausesData = (queryClient: QueryClient, { loanExternalId }: {
  loanExternalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanInterestPauseServiceGetV1LoansExternalIdByLoanExternalIdInterestPausesKeyFn({ loanExternalId }), queryFn: () => LoanInterestPauseService.getV1LoansExternalIdByLoanExternalIdInterestPauses({ loanExternalId }) });
export const ensureUseLoanInterestPauseServiceGetV1LoansByLoanIdInterestPausesData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanInterestPauseServiceGetV1LoansByLoanIdInterestPausesKeyFn({ loanId }), queryFn: () => LoanInterestPauseService.getV1LoansByLoanIdInterestPauses({ loanId }) });
export const ensureUseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsData = (queryClient: QueryClient, { excludedTypes, loanExternalId, page, size, sort }: {
  excludedTypes?: TransactionType[];
  loanExternalId: string;
  page?: number;
  size?: number;
  sort?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsKeyFn({ excludedTypes, loanExternalId, page, size, sort }), queryFn: () => LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactions({ excludedTypes, loanExternalId, page, size, sort }) });
export const ensureUseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionIdData = (queryClient: QueryClient, { externalTransactionId, fields, loanExternalId }: {
  externalTransactionId: string;
  fields?: string;
  loanExternalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionIdKeyFn({ externalTransactionId, fields, loanExternalId }), queryFn: () => LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactionsExternalIdByExternalTransactionId({ externalTransactionId, fields, loanExternalId }) });
export const ensureUseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsTemplateData = (queryClient: QueryClient, { command, dateFormat, loanExternalId, locale, transactionDate, transactionId }: {
  command?: string;
  dateFormat?: string;
  loanExternalId: string;
  locale?: string;
  transactionDate?: DateParam;
  transactionId?: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsTemplateKeyFn({ command, dateFormat, loanExternalId, locale, transactionDate, transactionId }), queryFn: () => LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactionsTemplate({ command, dateFormat, loanExternalId, locale, transactionDate, transactionId }) });
export const ensureUseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdData = (queryClient: QueryClient, { fields, loanExternalId, transactionId }: {
  fields?: string;
  loanExternalId: string;
  transactionId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansExternalIdByLoanExternalIdTransactionsByTransactionIdKeyFn({ fields, loanExternalId, transactionId }), queryFn: () => LoanTransactionsService.getV1LoansExternalIdByLoanExternalIdTransactionsByTransactionId({ fields, loanExternalId, transactionId }) });
export const ensureUseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsData = (queryClient: QueryClient, { excludedTypes, loanId, page, size, sort }: {
  excludedTypes?: TransactionType[];
  loanId: number;
  page?: number;
  size?: number;
  sort?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsKeyFn({ excludedTypes, loanId, page, size, sort }), queryFn: () => LoanTransactionsService.getV1LoansByLoanIdTransactions({ excludedTypes, loanId, page, size, sort }) });
export const ensureUseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsExternalIdByExternalTransactionIdData = (queryClient: QueryClient, { externalTransactionId, fields, loanId }: {
  externalTransactionId: string;
  fields?: string;
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsExternalIdByExternalTransactionIdKeyFn({ externalTransactionId, fields, loanId }), queryFn: () => LoanTransactionsService.getV1LoansByLoanIdTransactionsExternalIdByExternalTransactionId({ externalTransactionId, fields, loanId }) });
export const ensureUseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsTemplateData = (queryClient: QueryClient, { command, dateFormat, loanId, locale, transactionDate, transactionId }: {
  command?: string;
  dateFormat?: string;
  loanId: number;
  locale?: string;
  transactionDate?: DateParam;
  transactionId?: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsTemplateKeyFn({ command, dateFormat, loanId, locale, transactionDate, transactionId }), queryFn: () => LoanTransactionsService.getV1LoansByLoanIdTransactionsTemplate({ command, dateFormat, loanId, locale, transactionDate, transactionId }) });
export const ensureUseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsByTransactionIdData = (queryClient: QueryClient, { fields, loanId, transactionId }: {
  fields?: string;
  loanId: number;
  transactionId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanTransactionsServiceGetV1LoansByLoanIdTransactionsByTransactionIdKeyFn({ fields, loanId, transactionId }), queryFn: () => LoanTransactionsService.getV1LoansByLoanIdTransactionsByTransactionId({ fields, loanId, transactionId }) });
export const ensureUseBulkLoansServiceGetV1LoansLoanreassignmentTemplateData = (queryClient: QueryClient, { fromLoanOfficerId, officeId }: {
  fromLoanOfficerId?: number;
  officeId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseBulkLoansServiceGetV1LoansLoanreassignmentTemplateKeyFn({ fromLoanOfficerId, officeId }), queryFn: () => BulkLoansService.getV1LoansLoanreassignmentTemplate({ fromLoanOfficerId, officeId }) });
export const ensureUseLoanAccountLockServiceGetV1LoansLockedData = (queryClient: QueryClient, { limit, page }: {
  limit?: number;
  page?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanAccountLockServiceGetV1LoansLockedKeyFn({ limit, page }), queryFn: () => LoanAccountLockService.getV1LoansLocked({ limit, page }) });
export const ensureUseLoanCollateralServiceGetV1LoansByLoanIdCollateralsData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanCollateralServiceGetV1LoansByLoanIdCollateralsKeyFn({ loanId }), queryFn: () => LoanCollateralService.getV1LoansByLoanIdCollaterals({ loanId }) });
export const ensureUseLoanCollateralServiceGetV1LoansByLoanIdCollateralsTemplateData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanCollateralServiceGetV1LoansByLoanIdCollateralsTemplateKeyFn({ loanId }), queryFn: () => LoanCollateralService.getV1LoansByLoanIdCollateralsTemplate({ loanId }) });
export const ensureUseLoanCollateralServiceGetV1LoansByLoanIdCollateralsByCollateralIdData = (queryClient: QueryClient, { collateralId, loanId }: {
  collateralId: number;
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanCollateralServiceGetV1LoansByLoanIdCollateralsByCollateralIdKeyFn({ collateralId, loanId }), queryFn: () => LoanCollateralService.getV1LoansByLoanIdCollateralsByCollateralId({ collateralId, loanId }) });
export const ensureUseLoanDisbursementDetailsServiceGetV1LoansByLoanIdDisbursementsByDisbursementIdData = (queryClient: QueryClient, { disbursementId, loanId }: {
  disbursementId: number;
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseLoanDisbursementDetailsServiceGetV1LoansByLoanIdDisbursementsByDisbursementIdKeyFn({ disbursementId, loanId }), queryFn: () => LoanDisbursementDetailsService.getV1LoansByLoanIdDisbursementsByDisbursementId({ disbursementId, loanId }) });
export const ensureUseGuarantorsServiceGetV1LoansByLoanIdGuarantorsData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsKeyFn({ loanId }), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantors({ loanId }) });
export const ensureUseGuarantorsServiceGetV1LoansByLoanIdGuarantorsAccountsTemplateData = (queryClient: QueryClient, { clientId, loanId }: {
  clientId?: number;
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsAccountsTemplateKeyFn({ clientId, loanId }), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantorsAccountsTemplate({ clientId, loanId }) });
export const ensureUseGuarantorsServiceGetV1LoansByLoanIdGuarantorsDownloadtemplateData = (queryClient: QueryClient, { dateFormat, loanId, officeId }: {
  dateFormat?: string;
  loanId: number;
  officeId?: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsDownloadtemplateKeyFn({ dateFormat, loanId, officeId }), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantorsDownloadtemplate({ dateFormat, loanId, officeId }) });
export const ensureUseGuarantorsServiceGetV1LoansByLoanIdGuarantorsTemplateData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsTemplateKeyFn({ loanId }), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantorsTemplate({ loanId }) });
export const ensureUseGuarantorsServiceGetV1LoansByLoanIdGuarantorsByGuarantorIdData = (queryClient: QueryClient, { guarantorId, loanId }: {
  guarantorId: number;
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseGuarantorsServiceGetV1LoansByLoanIdGuarantorsByGuarantorIdKeyFn({ guarantorId, loanId }), queryFn: () => GuarantorsService.getV1LoansByLoanIdGuarantorsByGuarantorId({ guarantorId, loanId }) });
export const ensureUseRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksKeyFn({ loanId }), queryFn: () => RepaymentWithPostDatedChecksService.getV1LoansByLoanIdPostdatedchecks({ loanId }) });
export const ensureUseRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksByInstallmentIdData = (queryClient: QueryClient, { installmentId, loanId }: {
  installmentId: number;
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseRepaymentWithPostDatedChecksServiceGetV1LoansByLoanIdPostdatedchecksByInstallmentIdKeyFn({ installmentId, loanId }), queryFn: () => RepaymentWithPostDatedChecksService.getV1LoansByLoanIdPostdatedchecksByInstallmentId({ installmentId, loanId }) });
export const ensureUseMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersData = (queryClient: QueryClient, { actionName, clientId, entityName, groupId, loanid, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, resourceId, savingsAccountId }: {
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
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersKeyFn({ actionName, clientId, entityName, groupId, loanid, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, resourceId, savingsAccountId }), queryFn: () => MakerCheckerOr4EyeFunctionalityService.getV1Makercheckers({ actionName, clientId, entityName, groupId, loanid, makerDateTimeFrom, makerDateTimeTo, makerId, officeId, resourceId, savingsAccountId }) });
export const ensureUseMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSearchtemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseMakerCheckerOr4EyeFunctionalityServiceGetV1MakercheckersSearchtemplateKeyFn(), queryFn: () => MakerCheckerOr4EyeFunctionalityService.getV1MakercheckersSearchtemplate() });
export const ensureUseMixMappingServiceGetV1MixmappingData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseMixMappingServiceGetV1MixmappingKeyFn(), queryFn: () => MixMappingService.getV1Mixmapping() });
export const ensureUseMixReportServiceGetV1MixreportData = (queryClient: QueryClient, { currency, endDate, startDate }: {
  currency?: string;
  endDate?: string;
  startDate?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseMixReportServiceGetV1MixreportKeyFn({ currency, endDate, startDate }), queryFn: () => MixReportService.getV1Mixreport({ currency, endDate, startDate }) });
export const ensureUseMixTaxonomyServiceGetV1MixtaxonomyData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseMixTaxonomyServiceGetV1MixtaxonomyKeyFn(), queryFn: () => MixTaxonomyService.getV1Mixtaxonomy() });
export const ensureUseNotificationServiceGetV1NotificationsData = (queryClient: QueryClient, { isRead, limit, offset, orderBy, sortOrder }: {
  isRead?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseNotificationServiceGetV1NotificationsKeyFn({ isRead, limit, offset, orderBy, sortOrder }), queryFn: () => NotificationService.getV1Notifications({ isRead, limit, offset, orderBy, sortOrder }) });
export const ensureUseOfficesServiceGetV1OfficesData = (queryClient: QueryClient, { includeAllOffices, orderBy, sortOrder }: {
  includeAllOffices?: boolean;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseOfficesServiceGetV1OfficesKeyFn({ includeAllOffices, orderBy, sortOrder }), queryFn: () => OfficesService.getV1Offices({ includeAllOffices, orderBy, sortOrder }) });
export const ensureUseOfficesServiceGetV1OfficesDownloadtemplateData = (queryClient: QueryClient, { dateFormat }: {
  dateFormat?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseOfficesServiceGetV1OfficesDownloadtemplateKeyFn({ dateFormat }), queryFn: () => OfficesService.getV1OfficesDownloadtemplate({ dateFormat }) });
export const ensureUseOfficesServiceGetV1OfficesExternalIdByExternalIdData = (queryClient: QueryClient, { externalId }: {
  externalId: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseOfficesServiceGetV1OfficesExternalIdByExternalIdKeyFn({ externalId }), queryFn: () => OfficesService.getV1OfficesExternalIdByExternalId({ externalId }) });
export const ensureUseOfficesServiceGetV1OfficesTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseOfficesServiceGetV1OfficesTemplateKeyFn(), queryFn: () => OfficesService.getV1OfficesTemplate() });
export const ensureUseOfficesServiceGetV1OfficesByOfficeIdData = (queryClient: QueryClient, { officeId }: {
  officeId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseOfficesServiceGetV1OfficesByOfficeIdKeyFn({ officeId }), queryFn: () => OfficesService.getV1OfficesByOfficeId({ officeId }) });
export const ensureUsePasswordPreferencesServiceGetV1PasswordpreferencesData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UsePasswordPreferencesServiceGetV1PasswordpreferencesKeyFn(), queryFn: () => PasswordPreferencesService.getV1Passwordpreferences() });
export const ensureUsePasswordPreferencesServiceGetV1PasswordpreferencesTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UsePasswordPreferencesServiceGetV1PasswordpreferencesTemplateKeyFn(), queryFn: () => PasswordPreferencesService.getV1PasswordpreferencesTemplate() });
export const ensureUsePaymentTypeServiceGetV1PaymenttypesData = (queryClient: QueryClient, { onlyWithCode }: {
  onlyWithCode?: boolean;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UsePaymentTypeServiceGetV1PaymenttypesKeyFn({ onlyWithCode }), queryFn: () => PaymentTypeService.getV1Paymenttypes({ onlyWithCode }) });
export const ensureUsePaymentTypeServiceGetV1PaymenttypesByPaymentTypeIdData = (queryClient: QueryClient, { paymentTypeId }: {
  paymentTypeId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UsePaymentTypeServiceGetV1PaymenttypesByPaymentTypeIdKeyFn({ paymentTypeId }), queryFn: () => PaymentTypeService.getV1PaymenttypesByPaymentTypeId({ paymentTypeId }) });
export const ensureUsePermissionsServiceGetV1PermissionsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UsePermissionsServiceGetV1PermissionsKeyFn(), queryFn: () => PermissionsService.getV1Permissions() });
export const ensureUsePovertyLineServiceGetV1PovertyLineByPpiNameData = (queryClient: QueryClient, { ppiName }: {
  ppiName: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UsePovertyLineServiceGetV1PovertyLineByPpiNameKeyFn({ ppiName }), queryFn: () => PovertyLineService.getV1PovertyLineByPpiName({ ppiName }) });
export const ensureUsePovertyLineServiceGetV1PovertyLineByPpiNameByLikelihoodIdData = (queryClient: QueryClient, { likelihoodId, ppiName }: {
  likelihoodId: number;
  ppiName: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UsePovertyLineServiceGetV1PovertyLineByPpiNameByLikelihoodIdKeyFn({ likelihoodId, ppiName }), queryFn: () => PovertyLineService.getV1PovertyLineByPpiNameByLikelihoodId({ likelihoodId, ppiName }) });
export const ensureUseProductsServiceGetV1ProductsByTypeData = (queryClient: QueryClient, { limit, offset, type }: {
  limit?: number;
  offset?: number;
  type: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseProductsServiceGetV1ProductsByTypeKeyFn({ limit, offset, type }), queryFn: () => ProductsService.getV1ProductsByType({ limit, offset, type }) });
export const ensureUseProductsServiceGetV1ProductsByTypeTemplateData = (queryClient: QueryClient, { type }: {
  type: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseProductsServiceGetV1ProductsByTypeTemplateKeyFn({ type }), queryFn: () => ProductsService.getV1ProductsByTypeTemplate({ type }) });
export const ensureUseProductsServiceGetV1ProductsByTypeByProductIdData = (queryClient: QueryClient, { productId, type }: {
  productId: number;
  type: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseProductsServiceGetV1ProductsByTypeByProductIdKeyFn({ productId, type }), queryFn: () => ProductsService.getV1ProductsByTypeByProductId({ productId, type }) });
export const ensureUseProvisioningCategoryServiceGetV1ProvisioningcategoryData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseProvisioningCategoryServiceGetV1ProvisioningcategoryKeyFn(), queryFn: () => ProvisioningCategoryService.getV1Provisioningcategory() });
export const ensureUseProvisioningCriteriaServiceGetV1ProvisioningcriteriaData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseProvisioningCriteriaServiceGetV1ProvisioningcriteriaKeyFn(), queryFn: () => ProvisioningCriteriaService.getV1Provisioningcriteria() });
export const ensureUseProvisioningCriteriaServiceGetV1ProvisioningcriteriaTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseProvisioningCriteriaServiceGetV1ProvisioningcriteriaTemplateKeyFn(), queryFn: () => ProvisioningCriteriaService.getV1ProvisioningcriteriaTemplate() });
export const ensureUseProvisioningCriteriaServiceGetV1ProvisioningcriteriaByCriteriaIdData = (queryClient: QueryClient, { criteriaId }: {
  criteriaId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseProvisioningCriteriaServiceGetV1ProvisioningcriteriaByCriteriaIdKeyFn({ criteriaId }), queryFn: () => ProvisioningCriteriaService.getV1ProvisioningcriteriaByCriteriaId({ criteriaId }) });
export const ensureUseProvisioningEntriesServiceGetV1ProvisioningentriesData = (queryClient: QueryClient, { limit, offset }: {
  limit?: number;
  offset?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseProvisioningEntriesServiceGetV1ProvisioningentriesKeyFn({ limit, offset }), queryFn: () => ProvisioningEntriesService.getV1Provisioningentries({ limit, offset }) });
export const ensureUseProvisioningEntriesServiceGetV1ProvisioningentriesEntriesData = (queryClient: QueryClient, { categoryId, entryId, limit, officeId, offset, productId }: {
  categoryId?: number;
  entryId?: number;
  limit?: number;
  officeId?: number;
  offset?: number;
  productId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseProvisioningEntriesServiceGetV1ProvisioningentriesEntriesKeyFn({ categoryId, entryId, limit, officeId, offset, productId }), queryFn: () => ProvisioningEntriesService.getV1ProvisioningentriesEntries({ categoryId, entryId, limit, officeId, offset, productId }) });
export const ensureUseProvisioningEntriesServiceGetV1ProvisioningentriesByEntryIdData = (queryClient: QueryClient, { entryId }: {
  entryId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseProvisioningEntriesServiceGetV1ProvisioningentriesByEntryIdKeyFn({ entryId }), queryFn: () => ProvisioningEntriesService.getV1ProvisioningentriesByEntryId({ entryId }) });
export const ensureUseRateServiceGetV1RatesData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseRateServiceGetV1RatesKeyFn(), queryFn: () => RateService.getV1Rates() });
export const ensureUseRateServiceGetV1RatesByRateIdData = (queryClient: QueryClient, { rateId }: {
  rateId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseRateServiceGetV1RatesByRateIdKeyFn({ rateId }), queryFn: () => RateService.getV1RatesByRateId({ rateId }) });
export const ensureUseRecurringDepositAccountServiceGetV1RecurringdepositaccountsData = (queryClient: QueryClient, { limit, offset, orderBy, paged, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  paged?: boolean;
  sortOrder?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsKeyFn({ limit, offset, orderBy, paged, sortOrder }), queryFn: () => RecurringDepositAccountService.getV1Recurringdepositaccounts({ limit, offset, orderBy, paged, sortOrder }) });
export const ensureUseRecurringDepositAccountServiceGetV1RecurringdepositaccountsDownloadtemplateData = (queryClient: QueryClient, { dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsDownloadtemplateKeyFn({ dateFormat, officeId, staffId }), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsDownloadtemplate({ dateFormat, officeId, staffId }) });
export const ensureUseRecurringDepositAccountServiceGetV1RecurringdepositaccountsTemplateData = (queryClient: QueryClient, { clientId, groupId, productId, staffInSelectedOfficeOnly }: {
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsTemplateKeyFn({ clientId, groupId, productId, staffInSelectedOfficeOnly }), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsTemplate({ clientId, groupId, productId, staffInSelectedOfficeOnly }) });
export const ensureUseRecurringDepositAccountServiceGetV1RecurringdepositaccountsTransactionsDownloadtemplateData = (queryClient: QueryClient, { dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsTransactionsDownloadtemplateKeyFn({ dateFormat, officeId }), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsTransactionsDownloadtemplate({ dateFormat, officeId }) });
export const ensureUseRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdData = (queryClient: QueryClient, { accountId, chargeStatus, staffInSelectedOfficeOnly }: {
  accountId: number;
  chargeStatus?: string;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.ensureQueryData({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdKeyFn({ accountId, chargeStatus, staffInSelectedOfficeOnly }), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsByAccountId({ accountId, chargeStatus, staffInSelectedOfficeOnly }) });
export const ensureUseRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdTemplateData = (queryClient: QueryClient, { accountId, command }: {
  accountId: number;
  command?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseRecurringDepositAccountServiceGetV1RecurringdepositaccountsByAccountIdTemplateKeyFn({ accountId, command }), queryFn: () => RecurringDepositAccountService.getV1RecurringdepositaccountsByAccountIdTemplate({ accountId, command }) });
export const ensureUseRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplateData = (queryClient: QueryClient, { command, recurringDepositAccountId }: {
  command?: string;
  recurringDepositAccountId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplateKeyFn({ command, recurringDepositAccountId }), queryFn: () => RecurringDepositAccountTransactionsService.getV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsTemplate({ command, recurringDepositAccountId }) });
export const ensureUseRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionIdData = (queryClient: QueryClient, { recurringDepositAccountId, transactionId }: {
  recurringDepositAccountId: number;
  transactionId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseRecurringDepositAccountTransactionsServiceGetV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionIdKeyFn({ recurringDepositAccountId, transactionId }), queryFn: () => RecurringDepositAccountTransactionsService.getV1RecurringdepositaccountsByRecurringDepositAccountIdTransactionsByTransactionId({ recurringDepositAccountId, transactionId }) });
export const ensureUseRecurringDepositProductServiceGetV1RecurringdepositproductsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseRecurringDepositProductServiceGetV1RecurringdepositproductsKeyFn(), queryFn: () => RecurringDepositProductService.getV1Recurringdepositproducts() });
export const ensureUseRecurringDepositProductServiceGetV1RecurringdepositproductsTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseRecurringDepositProductServiceGetV1RecurringdepositproductsTemplateKeyFn(), queryFn: () => RecurringDepositProductService.getV1RecurringdepositproductsTemplate() });
export const ensureUseRecurringDepositProductServiceGetV1RecurringdepositproductsByProductIdData = (queryClient: QueryClient, { productId }: {
  productId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseRecurringDepositProductServiceGetV1RecurringdepositproductsByProductIdKeyFn({ productId }), queryFn: () => RecurringDepositProductService.getV1RecurringdepositproductsByProductId({ productId }) });
export const ensureUseListReportMailingJobHistoryServiceGetV1ReportmailingjobrunhistoryData = (queryClient: QueryClient, { limit, offset, orderBy, reportMailingJobId, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  reportMailingJobId?: number;
  sortOrder?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseListReportMailingJobHistoryServiceGetV1ReportmailingjobrunhistoryKeyFn({ limit, offset, orderBy, reportMailingJobId, sortOrder }), queryFn: () => ListReportMailingJobHistoryService.getV1Reportmailingjobrunhistory({ limit, offset, orderBy, reportMailingJobId, sortOrder }) });
export const ensureUseReportMailingJobsServiceGetV1ReportmailingjobsData = (queryClient: QueryClient, { limit, offset, orderBy, sortOrder }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseReportMailingJobsServiceGetV1ReportmailingjobsKeyFn({ limit, offset, orderBy, sortOrder }), queryFn: () => ReportMailingJobsService.getV1Reportmailingjobs({ limit, offset, orderBy, sortOrder }) });
export const ensureUseReportMailingJobsServiceGetV1ReportmailingjobsTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseReportMailingJobsServiceGetV1ReportmailingjobsTemplateKeyFn(), queryFn: () => ReportMailingJobsService.getV1ReportmailingjobsTemplate() });
export const ensureUseReportMailingJobsServiceGetV1ReportmailingjobsByEntityIdData = (queryClient: QueryClient, { entityId }: {
  entityId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseReportMailingJobsServiceGetV1ReportmailingjobsByEntityIdKeyFn({ entityId }), queryFn: () => ReportMailingJobsService.getV1ReportmailingjobsByEntityId({ entityId }) });
export const ensureUseReportsServiceGetV1ReportsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseReportsServiceGetV1ReportsKeyFn(), queryFn: () => ReportsService.getV1Reports() });
export const ensureUseReportsServiceGetV1ReportsTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseReportsServiceGetV1ReportsTemplateKeyFn(), queryFn: () => ReportsService.getV1ReportsTemplate() });
export const ensureUseReportsServiceGetV1ReportsByIdData = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseReportsServiceGetV1ReportsByIdKeyFn({ id }), queryFn: () => ReportsService.getV1ReportsById({ id }) });
export const ensureUseRescheduleLoansServiceGetV1RescheduleloansData = (queryClient: QueryClient, { command, loanId }: {
  command?: string;
  loanId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseRescheduleLoansServiceGetV1RescheduleloansKeyFn({ command, loanId }), queryFn: () => RescheduleLoansService.getV1Rescheduleloans({ command, loanId }) });
export const ensureUseRescheduleLoansServiceGetV1RescheduleloansTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseRescheduleLoansServiceGetV1RescheduleloansTemplateKeyFn(), queryFn: () => RescheduleLoansService.getV1RescheduleloansTemplate() });
export const ensureUseRescheduleLoansServiceGetV1RescheduleloansByScheduleIdData = (queryClient: QueryClient, { command, scheduleId }: {
  command?: string;
  scheduleId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseRescheduleLoansServiceGetV1RescheduleloansByScheduleIdKeyFn({ command, scheduleId }), queryFn: () => RescheduleLoansService.getV1RescheduleloansByScheduleId({ command, scheduleId }) });
export const ensureUseRolesServiceGetV1RolesData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseRolesServiceGetV1RolesKeyFn(), queryFn: () => RolesService.getV1Roles() });
export const ensureUseRolesServiceGetV1RolesByRoleIdData = (queryClient: QueryClient, { roleId }: {
  roleId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseRolesServiceGetV1RolesByRoleIdKeyFn({ roleId }), queryFn: () => RolesService.getV1RolesByRoleId({ roleId }) });
export const ensureUseRolesServiceGetV1RolesByRoleIdPermissionsData = (queryClient: QueryClient, { roleId }: {
  roleId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseRolesServiceGetV1RolesByRoleIdPermissionsKeyFn({ roleId }), queryFn: () => RolesService.getV1RolesByRoleIdPermissions({ roleId }) });
export const ensureUseRunReportsServiceGetV1RunreportsAvailableExportsByReportNameData = (queryClient: QueryClient, { isSelfServiceUserReport, reportName }: {
  isSelfServiceUserReport?: boolean;
  reportName: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseRunReportsServiceGetV1RunreportsAvailableExportsByReportNameKeyFn({ isSelfServiceUserReport, reportName }), queryFn: () => RunReportsService.getV1RunreportsAvailableExportsByReportName({ isSelfServiceUserReport, reportName }) });
export const ensureUseRunReportsServiceGetV1RunreportsByReportNameData = (queryClient: QueryClient, { isSelfServiceUserReport, reportName }: {
  isSelfServiceUserReport?: boolean;
  reportName: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseRunReportsServiceGetV1RunreportsByReportNameKeyFn({ isSelfServiceUserReport, reportName }), queryFn: () => RunReportsService.getV1RunreportsByReportName({ isSelfServiceUserReport, reportName }) });
export const ensureUseSavingsAccountServiceGetV1SavingsaccountsData = (queryClient: QueryClient, { externalId, limit, offset, orderBy, sortOrder }: {
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsKeyFn({ externalId, limit, offset, orderBy, sortOrder }), queryFn: () => SavingsAccountService.getV1Savingsaccounts({ externalId, limit, offset, orderBy, sortOrder }) });
export const ensureUseSavingsAccountServiceGetV1SavingsaccountsDownloadtemplateData = (queryClient: QueryClient, { dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsDownloadtemplateKeyFn({ dateFormat, officeId, staffId }), queryFn: () => SavingsAccountService.getV1SavingsaccountsDownloadtemplate({ dateFormat, officeId, staffId }) });
export const ensureUseSavingsAccountServiceGetV1SavingsaccountsExternalIdByExternalIdData = (queryClient: QueryClient, { associations, chargeStatus, externalId, staffInSelectedOfficeOnly }: {
  associations?: string;
  chargeStatus?: string;
  externalId: string;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsExternalIdByExternalIdKeyFn({ associations, chargeStatus, externalId, staffInSelectedOfficeOnly }), queryFn: () => SavingsAccountService.getV1SavingsaccountsExternalIdByExternalId({ associations, chargeStatus, externalId, staffInSelectedOfficeOnly }) });
export const ensureUseSavingsAccountServiceGetV1SavingsaccountsTemplateData = (queryClient: QueryClient, { clientId, groupId, productId, staffInSelectedOfficeOnly }: {
  clientId?: number;
  groupId?: number;
  productId?: number;
  staffInSelectedOfficeOnly?: boolean;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsTemplateKeyFn({ clientId, groupId, productId, staffInSelectedOfficeOnly }), queryFn: () => SavingsAccountService.getV1SavingsaccountsTemplate({ clientId, groupId, productId, staffInSelectedOfficeOnly }) });
export const ensureUseSavingsAccountServiceGetV1SavingsaccountsTransactionsDownloadtemplateData = (queryClient: QueryClient, { dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsTransactionsDownloadtemplateKeyFn({ dateFormat, officeId }), queryFn: () => SavingsAccountService.getV1SavingsaccountsTransactionsDownloadtemplate({ dateFormat, officeId }) });
export const ensureUseSavingsAccountServiceGetV1SavingsaccountsByAccountIdData = (queryClient: QueryClient, { accountId, associations, chargeStatus, staffInSelectedOfficeOnly }: {
  accountId: number;
  associations?: string;
  chargeStatus?: string;
  staffInSelectedOfficeOnly?: boolean;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSavingsAccountServiceGetV1SavingsaccountsByAccountIdKeyFn({ accountId, associations, chargeStatus, staffInSelectedOfficeOnly }), queryFn: () => SavingsAccountService.getV1SavingsaccountsByAccountId({ accountId, associations, chargeStatus, staffInSelectedOfficeOnly }) });
export const ensureUseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesData = (queryClient: QueryClient, { chargeStatus, savingsAccountId }: {
  chargeStatus?: string;
  savingsAccountId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesKeyFn({ chargeStatus, savingsAccountId }), queryFn: () => SavingsChargesService.getV1SavingsaccountsBySavingsAccountIdCharges({ chargeStatus, savingsAccountId }) });
export const ensureUseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesTemplateData = (queryClient: QueryClient, { savingsAccountId }: {
  savingsAccountId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesTemplateKeyFn({ savingsAccountId }), queryFn: () => SavingsChargesService.getV1SavingsaccountsBySavingsAccountIdChargesTemplate({ savingsAccountId }) });
export const ensureUseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdData = (queryClient: QueryClient, { savingsAccountChargeId, savingsAccountId }: {
  savingsAccountChargeId: number;
  savingsAccountId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSavingsChargesServiceGetV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeIdKeyFn({ savingsAccountChargeId, savingsAccountId }), queryFn: () => SavingsChargesService.getV1SavingsaccountsBySavingsAccountIdChargesBySavingsAccountChargeId({ savingsAccountChargeId, savingsAccountId }) });
export const ensureUseDepositAccountOnHoldFundTransactionsServiceGetV1SavingsaccountsBySavingsIdOnholdtransactionsData = (queryClient: QueryClient, { guarantorFundingId, limit, offset, orderBy, savingsId, sortOrder }: {
  guarantorFundingId?: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  savingsId: number;
  sortOrder?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDepositAccountOnHoldFundTransactionsServiceGetV1SavingsaccountsBySavingsIdOnholdtransactionsKeyFn({ guarantorFundingId, limit, offset, orderBy, savingsId, sortOrder }), queryFn: () => DepositAccountOnHoldFundTransactionsService.getV1SavingsaccountsBySavingsIdOnholdtransactions({ guarantorFundingId, limit, offset, orderBy, savingsId, sortOrder }) });
export const ensureUseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsSearchData = (queryClient: QueryClient, { credit, dateFormat, debit, fromAmount, fromDate, fromSubmittedDate, limit, locale, offset, orderBy, savingsId, sortOrder, toAmount, toDate, toSubmittedDate, types }: {
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
}) => queryClient.ensureQueryData({ queryKey: Common.UseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsSearchKeyFn({ credit, dateFormat, debit, fromAmount, fromDate, fromSubmittedDate, limit, locale, offset, orderBy, savingsId, sortOrder, toAmount, toDate, toSubmittedDate, types }), queryFn: () => SavingsAccountTransactionsService.getV1SavingsaccountsBySavingsIdTransactionsSearch({ credit, dateFormat, debit, fromAmount, fromDate, fromSubmittedDate, limit, locale, offset, orderBy, savingsId, sortOrder, toAmount, toDate, toSubmittedDate, types }) });
export const ensureUseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsTemplateData = (queryClient: QueryClient, { savingsId }: {
  savingsId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsTemplateKeyFn({ savingsId }), queryFn: () => SavingsAccountTransactionsService.getV1SavingsaccountsBySavingsIdTransactionsTemplate({ savingsId }) });
export const ensureUseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsByTransactionIdData = (queryClient: QueryClient, { savingsId, transactionId }: {
  savingsId: number;
  transactionId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSavingsAccountTransactionsServiceGetV1SavingsaccountsBySavingsIdTransactionsByTransactionIdKeyFn({ savingsId, transactionId }), queryFn: () => SavingsAccountTransactionsService.getV1SavingsaccountsBySavingsIdTransactionsByTransactionId({ savingsId, transactionId }) });
export const ensureUseSavingsProductServiceGetV1SavingsproductsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseSavingsProductServiceGetV1SavingsproductsKeyFn(), queryFn: () => SavingsProductService.getV1Savingsproducts() });
export const ensureUseSavingsProductServiceGetV1SavingsproductsTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseSavingsProductServiceGetV1SavingsproductsTemplateKeyFn(), queryFn: () => SavingsProductService.getV1SavingsproductsTemplate() });
export const ensureUseSavingsProductServiceGetV1SavingsproductsByProductIdData = (queryClient: QueryClient, { productId }: {
  productId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSavingsProductServiceGetV1SavingsproductsByProductIdKeyFn({ productId }), queryFn: () => SavingsProductService.getV1SavingsproductsByProductId({ productId }) });
export const ensureUseSchedulerServiceGetV1SchedulerData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseSchedulerServiceGetV1SchedulerKeyFn(), queryFn: () => SchedulerService.getV1Scheduler() });
export const ensureUseSearchApiServiceGetV1SearchData = (queryClient: QueryClient, { exactMatch, query, resource }: {
  exactMatch?: boolean;
  query?: string;
  resource?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseSearchApiServiceGetV1SearchKeyFn({ exactMatch, query, resource }), queryFn: () => SearchApiService.getV1Search({ exactMatch, query, resource }) });
export const ensureUseSearchApiServiceGetV1SearchTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseSearchApiServiceGetV1SearchTemplateKeyFn(), queryFn: () => SearchApiService.getV1SearchTemplate() });
export const ensureUseSelfAccountTransferServiceGetV1SelfAccounttransfersTemplateData = (queryClient: QueryClient, { type }: {
  type?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfAccountTransferServiceGetV1SelfAccounttransfersTemplateKeyFn({ type }), queryFn: () => SelfAccountTransferService.getV1SelfAccounttransfersTemplate({ type }) });
export const ensureUseSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptKeyFn(), queryFn: () => SelfThirdPartyTransferService.getV1SelfBeneficiariesTpt() });
export const ensureUseSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseSelfThirdPartyTransferServiceGetV1SelfBeneficiariesTptTemplateKeyFn(), queryFn: () => SelfThirdPartyTransferService.getV1SelfBeneficiariesTptTemplate() });
export const ensureUseSelfClientServiceGetV1SelfClientsData = (queryClient: QueryClient, { displayName, firstName, lastName, legalForm, limit, offset, orderBy, sortOrder, status }: {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  legalForm?: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  status?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsKeyFn({ displayName, firstName, lastName, legalForm, limit, offset, orderBy, sortOrder, status }), queryFn: () => SelfClientService.getV1SelfClients({ displayName, firstName, lastName, legalForm, limit, offset, orderBy, sortOrder, status }) });
export const ensureUseSelfClientServiceGetV1SelfClientsByClientIdData = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdKeyFn({ clientId }), queryFn: () => SelfClientService.getV1SelfClientsByClientId({ clientId }) });
export const ensureUseSelfClientServiceGetV1SelfClientsByClientIdAccountsData = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdAccountsKeyFn({ clientId }), queryFn: () => SelfClientService.getV1SelfClientsByClientIdAccounts({ clientId }) });
export const ensureUseSelfClientServiceGetV1SelfClientsByClientIdChargesData = (queryClient: QueryClient, { chargeStatus, clientId, limit, offset, pendingPayment }: {
  chargeStatus?: string;
  clientId: number;
  limit?: number;
  offset?: number;
  pendingPayment?: boolean;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdChargesKeyFn({ chargeStatus, clientId, limit, offset, pendingPayment }), queryFn: () => SelfClientService.getV1SelfClientsByClientIdCharges({ chargeStatus, clientId, limit, offset, pendingPayment }) });
export const ensureUseSelfClientServiceGetV1SelfClientsByClientIdChargesByChargeIdData = (queryClient: QueryClient, { chargeId, clientId }: {
  chargeId: number;
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdChargesByChargeIdKeyFn({ chargeId, clientId }), queryFn: () => SelfClientService.getV1SelfClientsByClientIdChargesByChargeId({ chargeId, clientId }) });
export const ensureUseSelfClientServiceGetV1SelfClientsByClientIdImagesData = (queryClient: QueryClient, { clientId, maxHeight, maxWidth, output }: {
  clientId: number;
  maxHeight?: number;
  maxWidth?: number;
  output?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdImagesKeyFn({ clientId, maxHeight, maxWidth, output }), queryFn: () => SelfClientService.getV1SelfClientsByClientIdImages({ clientId, maxHeight, maxWidth, output }) });
export const ensureUseSelfClientServiceGetV1SelfClientsByClientIdObligeedetailsData = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdObligeedetailsKeyFn({ clientId }), queryFn: () => SelfClientService.getV1SelfClientsByClientIdObligeedetails({ clientId }) });
export const ensureUseSelfClientServiceGetV1SelfClientsByClientIdTransactionsData = (queryClient: QueryClient, { clientId, limit, offset }: {
  clientId: number;
  limit?: number;
  offset?: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdTransactionsKeyFn({ clientId, limit, offset }), queryFn: () => SelfClientService.getV1SelfClientsByClientIdTransactions({ clientId, limit, offset }) });
export const ensureUseSelfClientServiceGetV1SelfClientsByClientIdTransactionsByTransactionIdData = (queryClient: QueryClient, { clientId, transactionId }: {
  clientId: number;
  transactionId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfClientServiceGetV1SelfClientsByClientIdTransactionsByTransactionIdKeyFn({ clientId, transactionId }), queryFn: () => SelfClientService.getV1SelfClientsByClientIdTransactionsByTransactionId({ clientId, transactionId }) });
export const ensureUseDeviceRegistrationServiceGetV1SelfDeviceRegistrationData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseDeviceRegistrationServiceGetV1SelfDeviceRegistrationKeyFn(), queryFn: () => DeviceRegistrationService.getV1SelfDeviceRegistration() });
export const ensureUseDeviceRegistrationServiceGetV1SelfDeviceRegistrationClientByClientIdData = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDeviceRegistrationServiceGetV1SelfDeviceRegistrationClientByClientIdKeyFn({ clientId }), queryFn: () => DeviceRegistrationService.getV1SelfDeviceRegistrationClientByClientId({ clientId }) });
export const ensureUseDeviceRegistrationServiceGetV1SelfDeviceRegistrationByIdData = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDeviceRegistrationServiceGetV1SelfDeviceRegistrationByIdKeyFn({ id }), queryFn: () => DeviceRegistrationService.getV1SelfDeviceRegistrationById({ id }) });
export const ensureUseSelfLoanProductsServiceGetV1SelfLoanproductsData = (queryClient: QueryClient, { clientId }: {
  clientId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfLoanProductsServiceGetV1SelfLoanproductsKeyFn({ clientId }), queryFn: () => SelfLoanProductsService.getV1SelfLoanproducts({ clientId }) });
export const ensureUseSelfLoanProductsServiceGetV1SelfLoanproductsByProductIdData = (queryClient: QueryClient, { clientId, productId }: {
  clientId?: number;
  productId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfLoanProductsServiceGetV1SelfLoanproductsByProductIdKeyFn({ clientId, productId }), queryFn: () => SelfLoanProductsService.getV1SelfLoanproductsByProductId({ clientId, productId }) });
export const ensureUseSelfLoansServiceGetV1SelfLoansTemplateData = (queryClient: QueryClient, { clientId, productId, templateType }: {
  clientId?: number;
  productId?: number;
  templateType?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansTemplateKeyFn({ clientId, productId, templateType }), queryFn: () => SelfLoansService.getV1SelfLoansTemplate({ clientId, productId, templateType }) });
export const ensureUseSelfLoansServiceGetV1SelfLoansByLoanIdData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdKeyFn({ loanId }), queryFn: () => SelfLoansService.getV1SelfLoansByLoanId({ loanId }) });
export const ensureUseSelfLoansServiceGetV1SelfLoansByLoanIdChargesData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdChargesKeyFn({ loanId }), queryFn: () => SelfLoansService.getV1SelfLoansByLoanIdCharges({ loanId }) });
export const ensureUseSelfLoansServiceGetV1SelfLoansByLoanIdChargesByChargeIdData = (queryClient: QueryClient, { chargeId, loanId }: {
  chargeId: number;
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdChargesByChargeIdKeyFn({ chargeId, loanId }), queryFn: () => SelfLoansService.getV1SelfLoansByLoanIdChargesByChargeId({ chargeId, loanId }) });
export const ensureUseSelfLoansServiceGetV1SelfLoansByLoanIdGuarantorsData = (queryClient: QueryClient, { loanId }: {
  loanId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdGuarantorsKeyFn({ loanId }), queryFn: () => SelfLoansService.getV1SelfLoansByLoanIdGuarantors({ loanId }) });
export const ensureUseSelfLoansServiceGetV1SelfLoansByLoanIdTransactionsByTransactionIdData = (queryClient: QueryClient, { fields, loanId, transactionId }: {
  fields?: string;
  loanId: number;
  transactionId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfLoansServiceGetV1SelfLoansByLoanIdTransactionsByTransactionIdKeyFn({ fields, loanId, transactionId }), queryFn: () => SelfLoansService.getV1SelfLoansByLoanIdTransactionsByTransactionId({ fields, loanId, transactionId }) });
export const ensureUsePocketServiceGetV1SelfPocketsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UsePocketServiceGetV1SelfPocketsKeyFn(), queryFn: () => PocketService.getV1SelfPockets() });
export const ensureUseSelfShareProductsServiceGetV1SelfProductsShareData = (queryClient: QueryClient, { clientId, limit, offset }: {
  clientId?: number;
  limit?: number;
  offset?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfShareProductsServiceGetV1SelfProductsShareKeyFn({ clientId, limit, offset }), queryFn: () => SelfShareProductsService.getV1SelfProductsShare({ clientId, limit, offset }) });
export const ensureUseSelfShareProductsServiceGetV1SelfProductsShareByProductIdData = (queryClient: QueryClient, { clientId, productId, type }: {
  clientId?: number;
  productId: number;
  type: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfShareProductsServiceGetV1SelfProductsShareByProductIdKeyFn({ clientId, productId, type }), queryFn: () => SelfShareProductsService.getV1SelfProductsShareByProductId({ clientId, productId, type }) });
export const ensureUseSelfRunReportServiceGetV1SelfRunreportsByReportNameData = (queryClient: QueryClient, { reportName }: {
  reportName: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfRunReportServiceGetV1SelfRunreportsByReportNameKeyFn({ reportName }), queryFn: () => SelfRunReportService.getV1SelfRunreportsByReportName({ reportName }) });
export const ensureUseSelfSavingsAccountServiceGetV1SelfSavingsaccountsTemplateData = (queryClient: QueryClient, { clientId, productId }: {
  clientId?: number;
  productId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsTemplateKeyFn({ clientId, productId }), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsTemplate({ clientId, productId }) });
export const ensureUseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdData = (queryClient: QueryClient, { accountId, associations, chargeStatus }: {
  accountId: number;
  associations?: string;
  chargeStatus?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdKeyFn({ accountId, associations, chargeStatus }), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountId({ accountId, associations, chargeStatus }) });
export const ensureUseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesData = (queryClient: QueryClient, { accountId, chargeStatus }: {
  accountId: number;
  chargeStatus?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesKeyFn({ accountId, chargeStatus }), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountIdCharges({ accountId, chargeStatus }) });
export const ensureUseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeIdData = (queryClient: QueryClient, { accountId, savingsAccountChargeId }: {
  accountId: number;
  savingsAccountChargeId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeIdKeyFn({ accountId, savingsAccountChargeId }), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountIdChargesBySavingsAccountChargeId({ accountId, savingsAccountChargeId }) });
export const ensureUseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdTransactionsByTransactionIdData = (queryClient: QueryClient, { accountId, transactionId }: {
  accountId: number;
  transactionId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfSavingsAccountServiceGetV1SelfSavingsaccountsByAccountIdTransactionsByTransactionIdKeyFn({ accountId, transactionId }), queryFn: () => SelfSavingsAccountService.getV1SelfSavingsaccountsByAccountIdTransactionsByTransactionId({ accountId, transactionId }) });
export const ensureUseSelfSavingsProductsServiceGetV1SelfSavingsproductsData = (queryClient: QueryClient, { clientId }: {
  clientId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfSavingsProductsServiceGetV1SelfSavingsproductsKeyFn({ clientId }), queryFn: () => SelfSavingsProductsService.getV1SelfSavingsproducts({ clientId }) });
export const ensureUseSelfSavingsProductsServiceGetV1SelfSavingsproductsByProductIdData = (queryClient: QueryClient, { clientId, productId }: {
  clientId?: number;
  productId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfSavingsProductsServiceGetV1SelfSavingsproductsByProductIdKeyFn({ clientId, productId }), queryFn: () => SelfSavingsProductsService.getV1SelfSavingsproductsByProductId({ clientId, productId }) });
export const ensureUseSelfShareAccountsServiceGetV1SelfShareaccountsTemplateData = (queryClient: QueryClient, { clientId, productId }: {
  clientId?: number;
  productId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfShareAccountsServiceGetV1SelfShareaccountsTemplateKeyFn({ clientId, productId }), queryFn: () => SelfShareAccountsService.getV1SelfShareaccountsTemplate({ clientId, productId }) });
export const ensureUseSelfShareAccountsServiceGetV1SelfShareaccountsByAccountIdData = (queryClient: QueryClient, { accountId }: {
  accountId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfShareAccountsServiceGetV1SelfShareaccountsByAccountIdKeyFn({ accountId }), queryFn: () => SelfShareAccountsService.getV1SelfShareaccountsByAccountId({ accountId }) });
export const ensureUseSelfSpmServiceGetV1SelfSurveysData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseSelfSpmServiceGetV1SelfSurveysKeyFn(), queryFn: () => SelfSpmService.getV1SelfSurveys() });
export const ensureUseSelfScoreCardServiceGetV1SelfSurveysScorecardsClientsByClientIdData = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfScoreCardServiceGetV1SelfSurveysScorecardsClientsByClientIdKeyFn({ clientId }), queryFn: () => SelfScoreCardService.getV1SelfSurveysScorecardsClientsByClientId({ clientId }) });
export const ensureUseSelfUserDetailsServiceGetV1SelfUserdetailsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseSelfUserDetailsServiceGetV1SelfUserdetailsKeyFn(), queryFn: () => SelfUserDetailsService.getV1SelfUserdetails() });
export const ensureUseSelfDividendServiceGetV1ShareproductByProductIdDividendData = (queryClient: QueryClient, { limit, offset, orderBy, productId, sortOrder, status }: {
  limit?: number;
  offset?: number;
  orderBy?: string;
  productId: number;
  sortOrder?: string;
  status?: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfDividendServiceGetV1ShareproductByProductIdDividendKeyFn({ limit, offset, orderBy, productId, sortOrder, status }), queryFn: () => SelfDividendService.getV1ShareproductByProductIdDividend({ limit, offset, orderBy, productId, sortOrder, status }) });
export const ensureUseSelfDividendServiceGetV1ShareproductByProductIdDividendByDividendIdData = (queryClient: QueryClient, { accountNo, dividendId, limit, offset, orderBy, productId, sortOrder }: {
  accountNo?: string;
  dividendId: number;
  limit?: number;
  offset?: number;
  orderBy?: string;
  productId: number;
  sortOrder?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSelfDividendServiceGetV1ShareproductByProductIdDividendByDividendIdKeyFn({ accountNo, dividendId, limit, offset, orderBy, productId, sortOrder }), queryFn: () => SelfDividendService.getV1ShareproductByProductIdDividendByDividendId({ accountNo, dividendId, limit, offset, orderBy, productId, sortOrder }) });
export const ensureUseSmsServiceGetV1SmsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseSmsServiceGetV1SmsKeyFn(), queryFn: () => SmsService.getV1Sms() });
export const ensureUseSmsServiceGetV1SmsByCampaignIdMessageByStatusData = (queryClient: QueryClient, { campaignId, dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }: {
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
}) => queryClient.ensureQueryData({ queryKey: Common.UseSmsServiceGetV1SmsByCampaignIdMessageByStatusKeyFn({ campaignId, dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }), queryFn: () => SmsService.getV1SmsByCampaignIdMessageByStatus({ campaignId, dateFormat, fromDate, limit, locale, offset, orderBy, sortOrder, status, toDate }) });
export const ensureUseSmsServiceGetV1SmsByResourceIdData = (queryClient: QueryClient, { resourceId }: {
  resourceId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSmsServiceGetV1SmsByResourceIdKeyFn({ resourceId }), queryFn: () => SmsService.getV1SmsByResourceId({ resourceId }) });
export const ensureUseStaffServiceGetV1StaffData = (queryClient: QueryClient, { loanOfficersOnly, officeId, staffInOfficeHierarchy, status }: {
  loanOfficersOnly?: boolean;
  officeId?: number;
  staffInOfficeHierarchy?: boolean;
  status?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseStaffServiceGetV1StaffKeyFn({ loanOfficersOnly, officeId, staffInOfficeHierarchy, status }), queryFn: () => StaffService.getV1Staff({ loanOfficersOnly, officeId, staffInOfficeHierarchy, status }) });
export const ensureUseStaffServiceGetV1StaffDownloadtemplateData = (queryClient: QueryClient, { dateFormat, officeId }: {
  dateFormat?: string;
  officeId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseStaffServiceGetV1StaffDownloadtemplateKeyFn({ dateFormat, officeId }), queryFn: () => StaffService.getV1StaffDownloadtemplate({ dateFormat, officeId }) });
export const ensureUseStaffServiceGetV1StaffByStaffIdData = (queryClient: QueryClient, { staffId }: {
  staffId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseStaffServiceGetV1StaffByStaffIdKeyFn({ staffId }), queryFn: () => StaffService.getV1StaffByStaffId({ staffId }) });
export const ensureUseStandingInstructionsHistoryServiceGetV1StandinginstructionrunhistoryData = (queryClient: QueryClient, { clientId, clientName, dateFormat, externalId, fromAccountId, fromAccountType, fromDate, limit, locale, offset, orderBy, sortOrder, toDate, transferType }: {
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
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseStandingInstructionsHistoryServiceGetV1StandinginstructionrunhistoryKeyFn({ clientId, clientName, dateFormat, externalId, fromAccountId, fromAccountType, fromDate, limit, locale, offset, orderBy, sortOrder, toDate, transferType }), queryFn: () => StandingInstructionsHistoryService.getV1Standinginstructionrunhistory({ clientId, clientName, dateFormat, externalId, fromAccountId, fromAccountType, fromDate, limit, locale, offset, orderBy, sortOrder, toDate, transferType }) });
export const ensureUseStandingInstructionsServiceGetV1StandinginstructionsData = (queryClient: QueryClient, { clientId, clientName, externalId, fromAccountId, fromAccountType, limit, offset, orderBy, sortOrder, transferType }: {
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
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseStandingInstructionsServiceGetV1StandinginstructionsKeyFn({ clientId, clientName, externalId, fromAccountId, fromAccountType, limit, offset, orderBy, sortOrder, transferType }), queryFn: () => StandingInstructionsService.getV1Standinginstructions({ clientId, clientName, externalId, fromAccountId, fromAccountType, limit, offset, orderBy, sortOrder, transferType }) });
export const ensureUseStandingInstructionsServiceGetV1StandinginstructionsTemplateData = (queryClient: QueryClient, { fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId, transferType }: {
  fromAccountId?: number;
  fromAccountType?: number;
  fromClientId?: number;
  fromOfficeId?: number;
  toAccountId?: number;
  toAccountType?: number;
  toClientId?: number;
  toOfficeId?: number;
  transferType?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseStandingInstructionsServiceGetV1StandinginstructionsTemplateKeyFn({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId, transferType }), queryFn: () => StandingInstructionsService.getV1StandinginstructionsTemplate({ fromAccountId, fromAccountType, fromClientId, fromOfficeId, toAccountId, toAccountType, toClientId, toOfficeId, transferType }) });
export const ensureUseStandingInstructionsServiceGetV1StandinginstructionsByStandingInstructionIdData = (queryClient: QueryClient, { externalId, limit, offset, orderBy, sortOrder, standingInstructionId }: {
  externalId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  standingInstructionId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseStandingInstructionsServiceGetV1StandinginstructionsByStandingInstructionIdKeyFn({ externalId, limit, offset, orderBy, sortOrder, standingInstructionId }), queryFn: () => StandingInstructionsService.getV1StandinginstructionsByStandingInstructionId({ externalId, limit, offset, orderBy, sortOrder, standingInstructionId }) });
export const ensureUseSurveyServiceGetV1SurveyData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseSurveyServiceGetV1SurveyKeyFn(), queryFn: () => SurveyService.getV1Survey() });
export const ensureUseSurveyServiceGetV1SurveyBySurveyNameData = (queryClient: QueryClient, { surveyName }: {
  surveyName: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSurveyServiceGetV1SurveyBySurveyNameKeyFn({ surveyName }), queryFn: () => SurveyService.getV1SurveyBySurveyName({ surveyName }) });
export const ensureUseSurveyServiceGetV1SurveyBySurveyNameByClientIdData = (queryClient: QueryClient, { clientId, surveyName }: {
  clientId: number;
  surveyName: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSurveyServiceGetV1SurveyBySurveyNameByClientIdKeyFn({ clientId, surveyName }), queryFn: () => SurveyService.getV1SurveyBySurveyNameByClientId({ clientId, surveyName }) });
export const ensureUseSurveyServiceGetV1SurveyBySurveyNameByClientIdByEntryIdData = (queryClient: QueryClient, { clientId, entryId, surveyName }: {
  clientId: number;
  entryId: number;
  surveyName: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSurveyServiceGetV1SurveyBySurveyNameByClientIdByEntryIdKeyFn({ clientId, entryId, surveyName }), queryFn: () => SurveyService.getV1SurveyBySurveyNameByClientIdByEntryId({ clientId, entryId, surveyName }) });
export const ensureUseSpmSurveysServiceGetV1SurveysData = (queryClient: QueryClient, { isActive }: {
  isActive?: boolean;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseSpmSurveysServiceGetV1SurveysKeyFn({ isActive }), queryFn: () => SpmSurveysService.getV1Surveys({ isActive }) });
export const ensureUseSpmSurveysServiceGetV1SurveysByIdData = (queryClient: QueryClient, { id }: {
  id: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSpmSurveysServiceGetV1SurveysByIdKeyFn({ id }), queryFn: () => SpmSurveysService.getV1SurveysById({ id }) });
export const ensureUseScoreCardServiceGetV1SurveysScorecardsClientsByClientIdData = (queryClient: QueryClient, { clientId }: {
  clientId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseScoreCardServiceGetV1SurveysScorecardsClientsByClientIdKeyFn({ clientId }), queryFn: () => ScoreCardService.getV1SurveysScorecardsClientsByClientId({ clientId }) });
export const ensureUseScoreCardServiceGetV1SurveysScorecardsBySurveyIdData = (queryClient: QueryClient, { surveyId }: {
  surveyId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseScoreCardServiceGetV1SurveysScorecardsBySurveyIdKeyFn({ surveyId }), queryFn: () => ScoreCardService.getV1SurveysScorecardsBySurveyId({ surveyId }) });
export const ensureUseScoreCardServiceGetV1SurveysScorecardsBySurveyIdClientsByClientIdData = (queryClient: QueryClient, { clientId, surveyId }: {
  clientId: number;
  surveyId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseScoreCardServiceGetV1SurveysScorecardsBySurveyIdClientsByClientIdKeyFn({ clientId, surveyId }), queryFn: () => ScoreCardService.getV1SurveysScorecardsBySurveyIdClientsByClientId({ clientId, surveyId }) });
export const ensureUseSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesData = (queryClient: QueryClient, { surveyId }: {
  surveyId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesKeyFn({ surveyId }), queryFn: () => SpmApiLookUpTableService.getV1SurveysBySurveyIdLookuptables({ surveyId }) });
export const ensureUseSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesByKeyData = (queryClient: QueryClient, { key, surveyId }: {
  key: string;
  surveyId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSpmApiLookUpTableServiceGetV1SurveysBySurveyIdLookuptablesByKeyKeyFn({ key, surveyId }), queryFn: () => SpmApiLookUpTableService.getV1SurveysBySurveyIdLookuptablesByKey({ key, surveyId }) });
export const ensureUseTaxComponentsServiceGetV1TaxesComponentData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseTaxComponentsServiceGetV1TaxesComponentKeyFn(), queryFn: () => TaxComponentsService.getV1TaxesComponent() });
export const ensureUseTaxComponentsServiceGetV1TaxesComponentTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseTaxComponentsServiceGetV1TaxesComponentTemplateKeyFn(), queryFn: () => TaxComponentsService.getV1TaxesComponentTemplate() });
export const ensureUseTaxComponentsServiceGetV1TaxesComponentByTaxComponentIdData = (queryClient: QueryClient, { taxComponentId }: {
  taxComponentId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseTaxComponentsServiceGetV1TaxesComponentByTaxComponentIdKeyFn({ taxComponentId }), queryFn: () => TaxComponentsService.getV1TaxesComponentByTaxComponentId({ taxComponentId }) });
export const ensureUseTaxGroupServiceGetV1TaxesGroupData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseTaxGroupServiceGetV1TaxesGroupKeyFn(), queryFn: () => TaxGroupService.getV1TaxesGroup() });
export const ensureUseTaxGroupServiceGetV1TaxesGroupTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseTaxGroupServiceGetV1TaxesGroupTemplateKeyFn(), queryFn: () => TaxGroupService.getV1TaxesGroupTemplate() });
export const ensureUseTaxGroupServiceGetV1TaxesGroupByTaxGroupIdData = (queryClient: QueryClient, { taxGroupId }: {
  taxGroupId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseTaxGroupServiceGetV1TaxesGroupByTaxGroupIdKeyFn({ taxGroupId }), queryFn: () => TaxGroupService.getV1TaxesGroupByTaxGroupId({ taxGroupId }) });
export const ensureUseTellerCashManagementServiceGetV1TellersData = (queryClient: QueryClient, { officeId }: {
  officeId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersKeyFn({ officeId }), queryFn: () => TellerCashManagementService.getV1Tellers({ officeId }) });
export const ensureUseTellerCashManagementServiceGetV1TellersByTellerIdData = (queryClient: QueryClient, { tellerId }: {
  tellerId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdKeyFn({ tellerId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerId({ tellerId }) });
export const ensureUseTellerCashManagementServiceGetV1TellersByTellerIdCashiersData = (queryClient: QueryClient, { fromdate, tellerId, todate }: {
  fromdate?: string;
  tellerId: number;
  todate?: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersKeyFn({ fromdate, tellerId, todate }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiers({ fromdate, tellerId, todate }) });
export const ensureUseTellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplateData = (queryClient: QueryClient, { tellerId }: {
  tellerId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersTemplateKeyFn({ tellerId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersTemplate({ tellerId }) });
export const ensureUseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdData = (queryClient: QueryClient, { cashierId, tellerId }: {
  cashierId: number;
  tellerId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdKeyFn({ cashierId, tellerId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierId({ cashierId, tellerId }) });
export const ensureUseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactionsData = (queryClient: QueryClient, { cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }: {
  cashierId: number;
  currencyCode?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  tellerId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactionsKeyFn({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdSummaryandtransactions({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }) });
export const ensureUseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsData = (queryClient: QueryClient, { cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }: {
  cashierId: number;
  currencyCode?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  sortOrder?: string;
  tellerId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsKeyFn({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdTransactions({ cashierId, currencyCode, limit, offset, orderBy, sortOrder, tellerId }) });
export const ensureUseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplateData = (queryClient: QueryClient, { cashierId, tellerId }: {
  cashierId: number;
  tellerId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdTransactionsTemplateKeyFn({ cashierId, tellerId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdTransactionsTemplate({ cashierId, tellerId }) });
export const ensureUseTellerCashManagementServiceGetV1TellersByTellerIdJournalsData = (queryClient: QueryClient, { cashierId, dateRange, tellerId }: {
  cashierId?: number;
  dateRange?: string;
  tellerId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdJournalsKeyFn({ cashierId, dateRange, tellerId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdJournals({ cashierId, dateRange, tellerId }) });
export const ensureUseTellerCashManagementServiceGetV1TellersByTellerIdTransactionsData = (queryClient: QueryClient, { dateRange, tellerId }: {
  dateRange?: string;
  tellerId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdTransactionsKeyFn({ dateRange, tellerId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdTransactions({ dateRange, tellerId }) });
export const ensureUseTellerCashManagementServiceGetV1TellersByTellerIdTransactionsByTransactionIdData = (queryClient: QueryClient, { tellerId, transactionId }: {
  tellerId: number;
  transactionId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseTellerCashManagementServiceGetV1TellersByTellerIdTransactionsByTransactionIdKeyFn({ tellerId, transactionId }), queryFn: () => TellerCashManagementService.getV1TellersByTellerIdTransactionsByTransactionId({ tellerId, transactionId }) });
export const ensureUseUserGeneratedDocumentsServiceGetV1TemplatesData = (queryClient: QueryClient, { entityId, typeId }: {
  entityId?: number;
  typeId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseUserGeneratedDocumentsServiceGetV1TemplatesKeyFn({ entityId, typeId }), queryFn: () => UserGeneratedDocumentsService.getV1Templates({ entityId, typeId }) });
export const ensureUseUserGeneratedDocumentsServiceGetV1TemplatesTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseUserGeneratedDocumentsServiceGetV1TemplatesTemplateKeyFn(), queryFn: () => UserGeneratedDocumentsService.getV1TemplatesTemplate() });
export const ensureUseUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdData = (queryClient: QueryClient, { templateId }: {
  templateId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdKeyFn({ templateId }), queryFn: () => UserGeneratedDocumentsService.getV1TemplatesByTemplateId({ templateId }) });
export const ensureUseUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdTemplateData = (queryClient: QueryClient, { templateId }: {
  templateId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseUserGeneratedDocumentsServiceGetV1TemplatesByTemplateIdTemplateKeyFn({ templateId }), queryFn: () => UserGeneratedDocumentsService.getV1TemplatesByTemplateIdTemplate({ templateId }) });
export const ensureUseTwoFactorServiceGetV1TwofactorData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseTwoFactorServiceGetV1TwofactorKeyFn(), queryFn: () => TwoFactorService.getV1Twofactor() });
export const ensureUseFetchAuthenticatedUserDetailsServiceGetV1UserdetailsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseFetchAuthenticatedUserDetailsServiceGetV1UserdetailsKeyFn(), queryFn: () => FetchAuthenticatedUserDetailsService.getV1Userdetails() });
export const ensureUseUsersServiceGetV1UsersData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseUsersServiceGetV1UsersKeyFn(), queryFn: () => UsersService.getV1Users() });
export const ensureUseUsersServiceGetV1UsersDownloadtemplateData = (queryClient: QueryClient, { dateFormat, officeId, staffId }: {
  dateFormat?: string;
  officeId?: number;
  staffId?: number;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseUsersServiceGetV1UsersDownloadtemplateKeyFn({ dateFormat, officeId, staffId }), queryFn: () => UsersService.getV1UsersDownloadtemplate({ dateFormat, officeId, staffId }) });
export const ensureUseUsersServiceGetV1UsersTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseUsersServiceGetV1UsersTemplateKeyFn(), queryFn: () => UsersService.getV1UsersTemplate() });
export const ensureUseUsersServiceGetV1UsersByUserIdData = (queryClient: QueryClient, { userId }: {
  userId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseUsersServiceGetV1UsersByUserIdKeyFn({ userId }), queryFn: () => UsersService.getV1UsersByUserId({ userId }) });
export const ensureUseWorkingDaysServiceGetV1WorkingdaysData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseWorkingDaysServiceGetV1WorkingdaysKeyFn(), queryFn: () => WorkingDaysService.getV1Workingdays() });
export const ensureUseWorkingDaysServiceGetV1WorkingdaysTemplateData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseWorkingDaysServiceGetV1WorkingdaysTemplateKeyFn(), queryFn: () => WorkingDaysService.getV1WorkingdaysTemplate() });
export const ensureUseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsData = (queryClient: QueryClient, { calendarType, entityId, entityType }: {
  calendarType?: string;
  entityId: number;
  entityType: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsKeyFn({ calendarType, entityId, entityType }), queryFn: () => CalendarService.getV1ByEntityTypeByEntityIdCalendars({ calendarType, entityId, entityType }) });
export const ensureUseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsTemplateData = (queryClient: QueryClient, { entityId, entityType }: {
  entityId: number;
  entityType: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsTemplateKeyFn({ entityId, entityType }), queryFn: () => CalendarService.getV1ByEntityTypeByEntityIdCalendarsTemplate({ entityId, entityType }) });
export const ensureUseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsByCalendarIdData = (queryClient: QueryClient, { calendarId, entityId, entityType }: {
  calendarId: number;
  entityId: number;
  entityType: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseCalendarServiceGetV1ByEntityTypeByEntityIdCalendarsByCalendarIdKeyFn({ calendarId, entityId, entityType }), queryFn: () => CalendarService.getV1ByEntityTypeByEntityIdCalendarsByCalendarId({ calendarId, entityId, entityType }) });
export const ensureUseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsData = (queryClient: QueryClient, { entityId, entityType }: {
  entityId: number;
  entityType: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsKeyFn({ entityId, entityType }), queryFn: () => DocumentsService.getV1ByEntityTypeByEntityIdDocuments({ entityId, entityType }) });
export const ensureUseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdData = (queryClient: QueryClient, { documentId, entityId, entityType }: {
  documentId: number;
  entityId: number;
  entityType: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdKeyFn({ documentId, entityId, entityType }), queryFn: () => DocumentsService.getV1ByEntityTypeByEntityIdDocumentsByDocumentId({ documentId, entityId, entityType }) });
export const ensureUseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachmentData = (queryClient: QueryClient, { documentId, entityId, entityType }: {
  documentId: number;
  entityId: number;
  entityType: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseDocumentsServiceGetV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachmentKeyFn({ documentId, entityId, entityType }), queryFn: () => DocumentsService.getV1ByEntityTypeByEntityIdDocumentsByDocumentIdAttachment({ documentId, entityId, entityType }) });
export const ensureUseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsData = (queryClient: QueryClient, { entityId, entityType, limit }: {
  entityId: number;
  entityType: string;
  limit?: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsKeyFn({ entityId, entityType, limit }), queryFn: () => MeetingsService.getV1ByEntityTypeByEntityIdMeetings({ entityId, entityType, limit }) });
export const ensureUseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsTemplateData = (queryClient: QueryClient, { calendarId, entityId, entityType }: {
  calendarId?: number;
  entityId: number;
  entityType: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsTemplateKeyFn({ calendarId, entityId, entityType }), queryFn: () => MeetingsService.getV1ByEntityTypeByEntityIdMeetingsTemplate({ calendarId, entityId, entityType }) });
export const ensureUseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsByMeetingIdData = (queryClient: QueryClient, { entityId, entityType, meetingId }: {
  entityId: number;
  entityType: string;
  meetingId: number;
}) => queryClient.ensureQueryData({ queryKey: Common.UseMeetingsServiceGetV1ByEntityTypeByEntityIdMeetingsByMeetingIdKeyFn({ entityId, entityType, meetingId }), queryFn: () => MeetingsService.getV1ByEntityTypeByEntityIdMeetingsByMeetingId({ entityId, entityType, meetingId }) });
export const ensureUseNotesServiceGetV1ByResourceTypeByResourceIdNotesData = (queryClient: QueryClient, { resourceId, resourceType }: {
  resourceId: number;
  resourceType: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseNotesServiceGetV1ByResourceTypeByResourceIdNotesKeyFn({ resourceId, resourceType }), queryFn: () => NotesService.getV1ByResourceTypeByResourceIdNotes({ resourceId, resourceType }) });
export const ensureUseNotesServiceGetV1ByResourceTypeByResourceIdNotesByNoteIdData = (queryClient: QueryClient, { noteId, resourceId, resourceType }: {
  noteId: number;
  resourceId: number;
  resourceType: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseNotesServiceGetV1ByResourceTypeByResourceIdNotesByNoteIdKeyFn({ noteId, resourceId, resourceType }), queryFn: () => NotesService.getV1ByResourceTypeByResourceIdNotesByNoteId({ noteId, resourceId, resourceType }) });
