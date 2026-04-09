package com.adorsys.fineract.e2e.payment.steps;

import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for CinetPay callback processing E2E tests.
 * Tests both JSON and form-encoded callback variants for payment and transfer endpoints.
 */
public class CinetPayCallbackSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ── Setup ──

    @Given("a pending CinetPay deposit transaction exists in the database")
    public void insertPendingCinetPayDeposit() {
        String txnId = UUID.randomUUID().toString();
        context.storeId("cinetpayTxnId", txnId);
        jdbcTemplate.update(
                "INSERT INTO payment_transactions " +
                "(transaction_id, idempotency_key, external_id, account_id, provider, type, amount, currency, status) " +
                "VALUES (?, ?, ?, ?, 'CINETPAY', 'DEPOSIT', 5000.00, 'XAF', 'PENDING')",
                txnId,
                txnId,
                FineractInitializer.TEST_USER_EXTERNAL_ID,
                FineractInitializer.getTestUserXafAccountId());
    }

    @Given("a pending CinetPay withdrawal transaction exists in the database")
    public void insertPendingCinetPayWithdrawal() {
        String txnId = UUID.randomUUID().toString();
        context.storeId("cinetpayTxnId", txnId);
        jdbcTemplate.update(
                "INSERT INTO payment_transactions " +
                "(transaction_id, idempotency_key, external_id, account_id, provider, type, amount, currency, status) " +
                "VALUES (?, ?, ?, ?, 'CINETPAY', 'WITHDRAWAL', 5000.00, 'XAF', 'PENDING')",
                txnId,
                txnId,
                FineractInitializer.TEST_USER_EXTERNAL_ID,
                FineractInitializer.getTestUserXafAccountId());
    }

    // ── Payment callbacks (JSON) ──

    @When("a CinetPay payment callback is sent as JSON for a non-existent transaction")
    public void cinetPayPaymentJsonNonExistent() {
        Map<String, Object> callback = Map.of(
                "cpm_site_id", "123456",
                "cpm_trans_id", UUID.randomUUID().toString(),
                "cpm_amount", "5000",
                "cpm_currency", "XAF",
                "cpm_result", "00",
                "cpm_payment_method", "MOMO");
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(callback)
                .post("/api/callbacks/cinetpay/payment");
        context.storeValue("cinetpayCallbackResponse", response);
    }

    @When("a CinetPay payment callback is sent as JSON with success status for the pending deposit")
    public void cinetPayPaymentJsonSuccess() {
        String txnId = context.getId("cinetpayTxnId");
        Map<String, Object> callback = Map.of(
                "cpm_site_id", "123456",
                "cpm_trans_id", txnId,
                "cpm_amount", "5000",
                "cpm_currency", "XAF",
                "cpm_result", "00",
                "cpm_payment_method", "MOMO");
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("x-token", "test-token")
                .body(callback)
                .post("/api/callbacks/cinetpay/payment");
        context.storeValue("cinetpayCallbackResponse", response);
    }

    // ── Payment callbacks (Form) ──

    @When("a CinetPay payment callback is sent as form data for a non-existent transaction")
    public void cinetPayPaymentFormNonExistent() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.URLENC)
                .formParam("cpm_site_id", "123456")
                .formParam("cpm_trans_id", UUID.randomUUID().toString())
                .formParam("cpm_amount", "5000")
                .formParam("cpm_currency", "XAF")
                .formParam("cpm_result", "00")
                .formParam("cpm_payment_method", "MOMO")
                .post("/api/callbacks/cinetpay/payment");
        context.storeValue("cinetpayCallbackResponse", response);
    }

    // ── Transfer callbacks (JSON) ──

    @When("a CinetPay transfer callback is sent as JSON for a non-existent transaction")
    public void cinetPayTransferJsonNonExistent() {
        Map<String, Object> callback = Map.of(
                "transaction_id", "cinetpay-" + UUID.randomUUID(),
                "client_transaction_id", UUID.randomUUID().toString(),
                "amount", "5000",
                "treatment_status", "VAL",
                "sending_status", "sent");
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(callback)
                .post("/api/callbacks/cinetpay/transfer");
        context.storeValue("cinetpayCallbackResponse", response);
    }

    @When("a CinetPay transfer callback is sent as JSON with success status for the pending withdrawal")
    public void cinetPayTransferJsonSuccess() {
        String txnId = context.getId("cinetpayTxnId");
        Map<String, Object> callback = Map.of(
                "transaction_id", "cinetpay-" + UUID.randomUUID(),
                "client_transaction_id", txnId,
                "amount", "5000",
                "treatment_status", "VAL",
                "sending_status", "sent");
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("x-token", "test-token")
                .body(callback)
                .post("/api/callbacks/cinetpay/transfer");
        context.storeValue("cinetpayCallbackResponse", response);
    }

    // ── Transfer callbacks (Form) ──

    @When("a CinetPay transfer callback is sent as form data for a non-existent transaction")
    public void cinetPayTransferFormNonExistent() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.URLENC)
                .formParam("transaction_id", "cinetpay-" + UUID.randomUUID())
                .formParam("client_transaction_id", UUID.randomUUID().toString())
                .formParam("amount", "5000")
                .formParam("treatment_status", "VAL")
                .formParam("sending_status", "sent")
                .post("/api/callbacks/cinetpay/transfer");
        context.storeValue("cinetpayCallbackResponse", response);
    }

    // ── Assertions ──

    @Then("the CinetPay callback response status should be {int}")
    public void cinetPayCallbackResponseStatusShouldBe(int expectedStatus) {
        Response response = context.getValue("cinetpayCallbackResponse");
        assertThat(response.statusCode()).isEqualTo(expectedStatus);
    }
}
