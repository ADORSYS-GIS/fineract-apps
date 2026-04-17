package com.adorsys.fineract.gateway.controller;

import com.adorsys.fineract.gateway.config.MtnMomoConfig;
import com.adorsys.fineract.gateway.dto.CinetPayCallbackRequest;
import com.adorsys.fineract.gateway.dto.OrangeCallbackRequest;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import com.adorsys.fineract.gateway.service.PaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import org.junit.jupiter.api.BeforeEach;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CallbackController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class CallbackControllerTest {

    private static final String MTN_SUBSCRIPTION_KEY = "test-collection-key";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentService paymentService;

    @MockBean
    private MtnMomoConfig mtnConfig;

    @MockBean
    private PaymentMetrics paymentMetrics;

    @MockBean
    private JwtDecoder jwtDecoder;

    @BeforeEach
    void setUp() {
        when(mtnConfig.getCollectionSubscriptionKey()).thenReturn(MTN_SUBSCRIPTION_KEY);
        when(mtnConfig.getDisbursementSubscriptionKey()).thenReturn("test-disbursement-key");
    }

    // =========================================================================
    // MTN Callbacks
    // =========================================================================

    @Test
    @DisplayName("should process MTN collection callback successfully")
    void mtnCollection_success_returns200() throws Exception {
        mockMvc.perform(post("/api/callbacks/mtn/collection/ref-123")
                        .header("Ocp-Apim-Subscription-Key", MTN_SUBSCRIPTION_KEY))
                .andExpect(status().isOk());

        verify(paymentService).handleMtnCollectionCallbackByRef("ref-123");
    }

    @Test
    @DisplayName("should return 200 even when processing error occurs")
    void mtnCollection_processingError_stillReturns200() throws Exception {
        doThrow(new RuntimeException("Processing error"))
                .when(paymentService).handleMtnCollectionCallbackByRef(anyString());

        mockMvc.perform(post("/api/callbacks/mtn/collection/ref-789")
                        .header("Ocp-Apim-Subscription-Key", MTN_SUBSCRIPTION_KEY))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("should reject MTN collection callback with missing subscription key")
    void mtnCollection_missingSubscriptionKey_doesNotProcess() throws Exception {
        mockMvc.perform(post("/api/callbacks/mtn/collection/ref-123"))
                .andExpect(status().isOk());

        verify(paymentService, never()).handleMtnCollectionCallbackByRef(anyString());
    }

    @Test
    @DisplayName("should reject MTN collection callback with wrong subscription key")
    void mtnCollection_wrongSubscriptionKey_doesNotProcess() throws Exception {
        mockMvc.perform(post("/api/callbacks/mtn/collection/ref-123")
                        .header("Ocp-Apim-Subscription-Key", "wrong-key"))
                .andExpect(status().isOk());

        verify(paymentService, never()).handleMtnCollectionCallbackByRef(anyString());
    }

    @Test
    @DisplayName("should process MTN disbursement callback")
    void mtnDisbursement_success_returns200() throws Exception {
        mockMvc.perform(post("/api/callbacks/mtn/disbursement/ref-123")
                        .header("Ocp-Apim-Subscription-Key", MTN_SUBSCRIPTION_KEY))
                .andExpect(status().isOk());

        verify(paymentService).handleMtnDisbursementCallbackByRef("ref-123");
    }

    @Test
    @DisplayName("should reject MTN disbursement callback with missing subscription key")
    void mtnDisbursement_missingSubscriptionKey_doesNotProcess() throws Exception {
        mockMvc.perform(post("/api/callbacks/mtn/disbursement/ref-123"))
                .andExpect(status().isOk());

        verify(paymentService, never()).handleMtnDisbursementCallbackByRef(anyString());
    }

    @Test
    @DisplayName("should reject MTN disbursement callback with wrong subscription key")
    void mtnDisbursement_wrongSubscriptionKey_doesNotProcess() throws Exception {
        mockMvc.perform(post("/api/callbacks/mtn/disbursement/ref-123")
                        .header("Ocp-Apim-Subscription-Key", "wrong-key"))
                .andExpect(status().isOk());

        verify(paymentService, never()).handleMtnDisbursementCallbackByRef(anyString());
    }

    // =========================================================================
    // Orange Callbacks
    // =========================================================================

    @Test
    @DisplayName("should process Orange payment callback")
    void orangePayment_success_returns200() throws Exception {
        OrangeCallbackRequest callback = OrangeCallbackRequest.builder()
                .orderId("order-123")
                .status("SUCCESS")
                .transactionId("txn-123")
                .payToken("pay-token-123")
                .build();

        mockMvc.perform(post("/api/callbacks/orange/payment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callback)))
                .andExpect(status().isOk());

        verify(paymentService).handleOrangeCallback(any(OrangeCallbackRequest.class));
    }

    @Test
    @DisplayName("should process Orange cashout callback")
    void orangeCashout_success_returns200() throws Exception {
        OrangeCallbackRequest callback = OrangeCallbackRequest.builder()
                .orderId("order-789")
                .status("SUCCESS")
                .transactionId("txn-789")
                .build();

        mockMvc.perform(post("/api/callbacks/orange/cashout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callback)))
                .andExpect(status().isOk());

        verify(paymentService).handleOrangeCallback(any(OrangeCallbackRequest.class));
    }

    // =========================================================================
    // CinetPay Callbacks
    // =========================================================================

    @Test
    @DisplayName("should process CinetPay payment callback (JSON)")
    void cinetPayPayment_json_returns200() throws Exception {
        CinetPayCallbackRequest callback = CinetPayCallbackRequest.builder()
                .siteId("test-site")
                .transactionId("cp-txn-123")
                .resultCode("00")
                .paymentMethod("MOMO")
                .amount("10000")
                .currency("XAF")
                .build();

        mockMvc.perform(post("/api/callbacks/cinetpay/payment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callback)))
                .andExpect(status().isOk());

        verify(paymentService).handleCinetPayCallback(any(CinetPayCallbackRequest.class));
    }

    @Test
    @DisplayName("should process CinetPay payment callback (form-urlencoded)")
    void cinetPayPayment_form_returns200() throws Exception {
        mockMvc.perform(post("/api/callbacks/cinetpay/payment")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .param("cpm_site_id", "test-site")
                        .param("cpm_trans_id", "cp-txn-456")
                        .param("cpm_result", "00")
                        .param("cpm_payment_method", "OM")
                        .param("cpm_amount", "10000")
                        .param("cpm_currency", "XAF"))
                .andExpect(status().isOk());

        verify(paymentService).handleCinetPayCallback(any(CinetPayCallbackRequest.class));
    }

    @Test
    @DisplayName("should process CinetPay transfer callback (JSON)")
    void cinetPayTransfer_json_returns200() throws Exception {
        CinetPayCallbackRequest callback = CinetPayCallbackRequest.builder()
                .clientTransactionId("cp-transfer-123")
                .treatmentStatus("VAL")
                .amount("5000")
                .receiver("237612345678")
                .build();

        mockMvc.perform(post("/api/callbacks/cinetpay/transfer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(callback)))
                .andExpect(status().isOk());

        verify(paymentService).handleCinetPayCallback(any(CinetPayCallbackRequest.class));
    }
}
