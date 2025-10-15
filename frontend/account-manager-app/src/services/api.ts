import {
	ClientIdentifierService,
	ClientSearchV2Service,
	ClientService,
	DefaultService,
	DocumentsService,
	OfficesService,
	// OpenAPI,
	SavingsAccountService,
	SelfClientService,
} from "@fineract-apps/fineract-api";

// OpenAPI.BASE = import.meta.env.VITE_FINERACT_API_URL;
// OpenAPI.USERNAME = import.meta.env.VITE_FINERACT_USERNAME;
// OpenAPI.PASSWORD = import.meta.env.VITE_FINERACT_PASSWORD;

// OpenAPI.HEADERS = {
// 	"Fineract-Platform-TenantId": import.meta.env.VITE_FINERACT_TENANT_ID,
// };

export const fineractApi = {
	clients: ClientService,
	clientSearchV2: ClientSearchV2Service,
	savingsAccounts: SavingsAccountService,
	offices: OfficesService,
	self: SelfClientService,
	ClientIdentifierService: ClientIdentifierService,
	DocumentsService: DocumentsService,
	default: DefaultService,
};
