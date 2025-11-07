import {
	AuthenticationHttpBasicService,
	ClientIdentifierService,
	ClientSearchV2Service,
	ClientService,
	DefaultService,
	DocumentsService,
	LoansService,
	LoanTransactionsService,
	OfficesService,
	OpenAPI,
	SavingsAccountService,
	SelfClientService,
	SelfUserDetailsService,
} from "@fineract-apps/fineract-api";

OpenAPI.BASE = import.meta.env.VITE_FINERACT_API_URL;
OpenAPI.USERNAME = import.meta.env.VITE_FINERACT_USERNAME;
OpenAPI.PASSWORD = import.meta.env.VITE_FINERACT_PASSWORD;

OpenAPI.interceptors.request.use((request) => {
	request.headers = {
		...request.headers,
		"Fineract-Platform-TenantId": import.meta.env.VITE_FINERACT_TENANT_ID,
	};
	return request;
});

export const fineractApi = {
	authentication: AuthenticationHttpBasicService,
	clients: ClientService,
	clientSearchV2: ClientSearchV2Service,
	savingsAccounts: SavingsAccountService,
	loans: LoansService,
	loanTransactions: LoanTransactionsService,
	offices: OfficesService,
	self: SelfClientService,
	ClientIdentifierService: ClientIdentifierService,
	DocumentsService: DocumentsService,
	default: DefaultService,
	selfUserDetails: SelfUserDetailsService,
};
