package com.adorsys.fineract.asset.bdd.steps;

/**
 * Step definitions for pricing scenarios.
 * Most pricing assertions use the common steps (response status, field checks).
 * Price endpoints are public (no auth needed) — handled by CommonStepDefinitions.unauthenticatedUserCalls.
 */
public class PricingStepDefinitions {
    // Public price endpoints use CommonStepDefinitions for unauthenticated calls
    // and response assertions. No domain-specific steps needed beyond what
    // CommonStepDefinitions provides.
}
