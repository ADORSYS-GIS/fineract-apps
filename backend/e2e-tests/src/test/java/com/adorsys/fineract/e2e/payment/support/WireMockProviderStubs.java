package com.adorsys.fineract.e2e.payment.support;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.core.WireMockConfiguration;

import static com.github.tomakehurst.wiremock.client.WireMock.*;

/**
 * Embedded WireMock server for simulating external payment provider APIs.
 * Started once (static) and shared across all payment E2E scenarios.
 *
 * <p>Stubs are reset before each scenario via {@code resetAll()}.
 *
 * <p>Mocked provider APIs:
 * <ul>
 *   <li>MTN MoMo: OAuth token, RequestToPay, Transfer, status polling</li>
 *   <li>Orange Money: OAuth token, WebPayment, CashOut, status polling</li>
 *   <li>CinetPay: Payment init, Transfer auth/init, status verification</li>
 * </ul>
 */
public final class WireMockProviderStubs {

    private static final WireMockServer WIRE_MOCK;
    private static final int PORT;

    static {
        WIRE_MOCK = new WireMockServer(WireMockConfiguration.wireMockConfig().dynamicPort());
        WIRE_MOCK.start();
        PORT = WIRE_MOCK.port();
        WireMock.configureFor("localhost", PORT);
    }

    private WireMockProviderStubs() {}

    public static int getPort() { return PORT; }

    public static String getBaseUrl() { return "http://localhost:" + PORT; }

    /** Reset all stubs — call before each scenario. */
    public static void resetAll() {
        WIRE_MOCK.resetAll();
    }

    // ---------------------------------------------------------------
    // MTN MoMo Stubs
    // ---------------------------------------------------------------

    /** Stub MTN collection OAuth token endpoint. */
    public static void stubMtnCollectionToken() {
        WIRE_MOCK.stubFor(post(urlPathEqualTo("/collection/token/"))
                .willReturn(okJson("{\"access_token\":\"mtn-test-token\",\"token_type\":\"access_token\",\"expires_in\":3600}")));
    }

    /** Stub MTN disbursement OAuth token endpoint. */
    public static void stubMtnDisbursementToken() {
        WIRE_MOCK.stubFor(post(urlPathEqualTo("/disbursement/token/"))
                .willReturn(okJson("{\"access_token\":\"mtn-disb-test-token\",\"token_type\":\"access_token\",\"expires_in\":3600}")));
    }

    /** Stub MTN RequestToPay (collection/deposit) — returns 202 Accepted. */
    public static void stubMtnRequestToPaySuccess() {
        stubMtnCollectionToken();
        WIRE_MOCK.stubFor(post(urlPathEqualTo("/collection/v1_0/requesttopay"))
                .willReturn(aResponse().withStatus(202)));
    }

    /** Stub MTN Transfer (disbursement/withdrawal) — returns 202 Accepted. */
    public static void stubMtnTransferSuccess() {
        stubMtnDisbursementToken();
        WIRE_MOCK.stubFor(post(urlPathEqualTo("/disbursement/v1_0/transfer"))
                .willReturn(aResponse().withStatus(202)));
    }

    /** Stub MTN Transfer to fail (e.g., insufficient balance on provider side). */
    public static void stubMtnTransferFailed() {
        stubMtnDisbursementToken();
        WIRE_MOCK.stubFor(post(urlPathEqualTo("/disbursement/v1_0/transfer"))
                .willReturn(aResponse().withStatus(500)
                        .withBody("{\"error\":\"INTERNAL_PROCESSING_ERROR\"}")));
    }

    /** Stub MTN collection status poll returning SUCCESSFUL. */
    public static void stubMtnGetCollectionStatusSuccess(String referenceId) {
        stubMtnCollectionToken();
        WIRE_MOCK.stubFor(get(urlPathEqualTo("/collection/v1_0/requesttopay/" + referenceId))
                .willReturn(okJson("{\"status\":\"SUCCESSFUL\",\"amount\":\"5000\",\"currency\":\"XAF\"}")));
    }

    /** Stub MTN disbursement status poll returning SUCCESSFUL. */
    public static void stubMtnGetDisbursementStatusSuccess(String referenceId) {
        stubMtnDisbursementToken();
        WIRE_MOCK.stubFor(get(urlPathEqualTo("/disbursement/v1_0/requesttopay/" + referenceId))
                .willReturn(okJson("{\"status\":\"SUCCESSFUL\",\"amount\":\"5000\",\"currency\":\"XAF\"}")));
    }

    // ---------------------------------------------------------------
    // Orange Money Stubs
    // ---------------------------------------------------------------

    /** Stub Orange OAuth token endpoint. */
    public static void stubOrangeOAuthToken() {
        WIRE_MOCK.stubFor(post(urlPathEqualTo("/oauth/v3/token"))
                .willReturn(okJson("{\"access_token\":\"orange-test-token\",\"token_type\":\"Bearer\",\"expires_in\":3600}")));
    }

    /** Stub Orange WebPayment init — returns payment URL + notif_token. */
    public static void stubOrangeInitPaymentSuccess(String notifToken) {
        stubOrangeOAuthToken();
        WIRE_MOCK.stubFor(post(urlPathEqualTo("/webpayment"))
                .willReturn(okJson(String.format(
                        "{\"status\":\"201\",\"payment_url\":\"https://example.com/pay\",\"pay_token\":\"orange-pay-token\",\"notif_token\":\"%s\"}",
                        notifToken))));
    }

    /** Stub Orange CashOut — returns 201 with txnid. */
    public static void stubOrangeCashOutSuccess(String txnId) {
        stubOrangeOAuthToken();
        WIRE_MOCK.stubFor(post(urlPathEqualTo("/cashout"))
                .willReturn(okJson(String.format(
                        "{\"status\":\"201\",\"txnid\":\"%s\"}", txnId))));
    }

    /** Stub Orange transaction status. */
    public static void stubOrangeGetStatusSuccess() {
        stubOrangeOAuthToken();
        WIRE_MOCK.stubFor(get(urlPathEqualTo("/transactionstatus"))
                .willReturn(okJson("{\"status\":\"SUCCESS\"}")));
    }

    // ---------------------------------------------------------------
    // CinetPay Stubs
    // ---------------------------------------------------------------

    /** Stub CinetPay payment initialization. */
    public static void stubCinetPayInitPaymentSuccess() {
        WIRE_MOCK.stubFor(post(urlPathEqualTo("/v2/payment"))
                .willReturn(okJson(
                        "{\"code\":\"201\",\"message\":\"CREATED\",\"data\":{\"payment_url\":\"https://checkout.cinetpay.com/pay\",\"payment_token\":\"cinetpay-pay-token\"}}")));
    }

    /** Stub CinetPay payment verification. */
    public static void stubCinetPayVerifySuccess() {
        WIRE_MOCK.stubFor(post(urlPathEqualTo("/v2/payment/check"))
                .willReturn(okJson("{\"code\":\"00\",\"message\":\"PAYMENT_SUCCESS\"}")));
    }

    /** Stub CinetPay transfer auth login. */
    public static void stubCinetPayAuthLogin() {
        WIRE_MOCK.stubFor(post(urlPathEqualTo("/v1/auth/login"))
                .willReturn(okJson("{\"code\":\"0\",\"message\":\"OK\",\"data\":{\"token\":\"cinetpay-transfer-token\"}}")));
    }

    /** Stub CinetPay transfer initiation. */
    public static void stubCinetPayTransferSuccess(String transactionId) {
        stubCinetPayAuthLogin();
        WIRE_MOCK.stubFor(post(urlPathMatching("/v1/transfer/money/send/contact.*"))
                .willReturn(okJson(String.format(
                        "{\"code\":\"0\",\"message\":\"OK\",\"data\":[{\"transaction_id\":\"%s\",\"status\":\"PENDING\"}]}",
                        transactionId))));
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private static com.github.tomakehurst.wiremock.client.ResponseDefinitionBuilder okJson(String body) {
        return aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody(body);
    }
}
