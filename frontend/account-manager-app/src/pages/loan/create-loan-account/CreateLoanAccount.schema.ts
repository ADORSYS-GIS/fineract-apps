import { z } from "zod";

export const loanDetailsSchema = z.object({
	loanProductId: z.number().min(1, "Loan product is required"),
	currencyCode: z.string().optional(),
	externalId: z.string().optional(),
	linkAccountId: z.number().optional(),
	loanPurposeId: z.number().optional(),
	loanOfficerId: z.number().optional(),
	fundId: z.number().optional(),
	submittedOnDate: z.string().optional(),
	expectedDisbursementDate: z.string().optional(),
	principal: z.number().optional(),
	loanTermFrequency: z.number().optional(),
	loanTermFrequencyType: z.number().optional(),
	numberOfRepayments: z.number().optional(),
	repaymentEvery: z.number().optional(),
	repaymentFrequencyType: z.number().optional(),
	interestRatePerPeriod: z.number().optional(),
	amortizationType: z.number().optional(),
	interestType: z.number().optional(),
	interestCalculationPeriodType: z.number().optional(),
	transactionProcessingStrategyCode: z.string().optional(),
	charges: z
		.array(
			z.object({
				id: z.number(),
				name: z.string(),
				amount: z.number(),
				chargeTimeType: z.object({
					code: z.string().optional(),
					id: z.number().optional(),
					value: z.string().optional(),
				}),
				chargeCalculationType: z.object({
					code: z.string().optional(),
					id: z.number().optional(),
					value: z.string().optional(),
				}),
			}),
		)
		.optional(),
});

export type LoanDetailsFormValues = z.infer<typeof loanDetailsSchema>;
