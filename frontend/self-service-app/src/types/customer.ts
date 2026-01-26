/**
 * Customer/Client types for Fineract integration
 */

export interface Customer {
	id: string;
	accountNo: string;
	externalId: string;
	status: CustomerStatus;
	active: boolean;
	activationDate?: string;
	firstName: string;
	lastName: string;
	displayName: string;
	mobileNo?: string;
	emailAddress?: string;
	dateOfBirth?: string;
	gender?: Gender;
	officeId: number;
	officeName: string;
}

export interface CustomerStatus {
	id: number;
	code: string;
	value: string;
}

export interface Gender {
	id: number;
	name: string;
	isActive: boolean;
}

export interface CustomerCreateRequest {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	dateOfBirth: string;
	gender: "male" | "female";
}

export interface CustomerProfile {
	customer: Customer;
	kycTier: number;
	kycStatus: KycStatus;
	limits: TransactionLimits;
}

export type KycStatus = "pending" | "under_review" | "approved" | "rejected";

export interface TransactionLimits {
	daily: number;
	perTransaction: number;
	monthly: number;
	remaining: {
		daily: number;
		monthly: number;
	};
}

export interface KycDocument {
	type: KycDocumentType;
	status: KycDocumentStatus;
	uploadedAt?: string;
	rejectionReason?: string;
}

export type KycDocumentType =
	| "id_front"
	| "id_back"
	| "selfie_with_id"
	| "proof_of_address";

export type KycDocumentStatus =
	| "pending"
	| "uploaded"
	| "verified"
	| "rejected";
