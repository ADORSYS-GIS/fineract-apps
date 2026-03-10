export * from "./account";
export * from "./customer";
export * from "./transaction";

export type KycDocumentType =
	| "id_front"
	| "id_back"
	| "selfie_with_id"
	| "proof_of_address"
	| "selfie";

export type KycStatus =
	| "pending"
	| "uploaded"
	| "verified"
	| "rejected"
	| "approved";

export interface TransactionLimits {
	daily: number;
	weekly: number;
	monthly: number;
	perTransaction: number;
	remaining: {
		daily: number;
		monthly: number;
	};
}

export type PaymentMethodId =
	| "mtn_transfer"
	| "orange_transfer"
	| "cinetpay"
	| "uba_bank_transfer"
	| "afriland_bank_transfer";
