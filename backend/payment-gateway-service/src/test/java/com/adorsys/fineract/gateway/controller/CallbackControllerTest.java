// package com.adorsys.fineract.gateway.controller;

// import com.adorsys.fineract.gateway.dto.MtnCallbackRequest;
// import com.adorsys.fineract.gateway.dto.OrangeCallbackRequest;
// import com.adorsys.fineract.gateway.service.PaymentService;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Nested;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.http.MediaType;
// import org.springframework.test.web.servlet.MockMvc;

// import static org.mockito.ArgumentMatchers.*;
// import static org.mockito.Mockito.*;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// @WebMvcTest(CallbackController.class)
// class CallbackControllerTest {

//     @Autowired
//     private MockMvc mockMvc;

//     @Autowired
//     private ObjectMapper objectMapper;

//     @MockBean
//     private PaymentService paymentService;

//     @Nested
//     @DisplayName("POST /api/callbacks/mtn/collection")
//     class MtnCollectionCallback {

//         @Test
//         @DisplayName("should process successful MTN collection callback")
//         void shouldProcessSuccessfulCallback() throws Exception {
//             // Given
//             MtnCallbackRequest callback = MtnCallbackRequest.builder()
//                     .referenceId("ref-123")
//                     .externalId("ext-ref-123")
//                     .status("SUCCESSFUL")
//                     .financialTransactionId("fin-txn-123")
//                     .build();

//             // When/Then
//             mockMvc.perform(post("/api/callbacks/mtn/collection")
//                             .contentType(MediaType.APPLICATION_JSON)
//                             .content(objectMapper.writeValueAsString(callback)))
//                     .andExpect(status().isOk());

//             verify(paymentService).handleMtnCollectionCallback(any(MtnCallbackRequest.class));
//         }

//         @Test
//         @DisplayName("should process failed MTN collection callback")
//         void shouldProcessFailedCallback() throws Exception {
//             // Given
//             MtnCallbackRequest callback = MtnCallbackRequest.builder()
//                     .referenceId("ref-456")
//                     .externalId("ext-ref-456")
//                     .status("FAILED")
//                     .reason("User rejected")
//                     .build();

//             // When/Then
//             mockMvc.perform(post("/api/callbacks/mtn/collection")
//                             .contentType(MediaType.APPLICATION_JSON)
//                             .content(objectMapper.writeValueAsString(callback)))
//                     .andExpect(status().isOk());

//             verify(paymentService).handleMtnCollectionCallback(any(MtnCallbackRequest.class));
//         }

//         @Test
//         @DisplayName("should return 200 even on processing error")
//         void shouldReturn200OnProcessingError() throws Exception {
//             // Given - service throws exception
//             MtnCallbackRequest callback = MtnCallbackRequest.builder()
//                     .referenceId("ref-789")
//                     .status("SUCCESSFUL")
//                     .build();

//             doThrow(new RuntimeException("Processing error"))
//                     .when(paymentService).handleMtnCollectionCallback(any());

//             // When/Then - still return 200 to prevent retries
//             mockMvc.perform(post("/api/callbacks/mtn/collection")
//                             .contentType(MediaType.APPLICATION_JSON)
//                             .content(objectMapper.writeValueAsString(callback)))
//                     .andExpect(status().isOk());
//         }
//     }

//     @Nested
//     @DisplayName("POST /api/callbacks/mtn/disbursement")
//     class MtnDisbursementCallback {

//         @Test
//         @DisplayName("should process MTN disbursement callback")
//         void shouldProcessDisbursementCallback() throws Exception {
//             // Given
//             MtnCallbackRequest callback = MtnCallbackRequest.builder()
//                     .referenceId("ref-123")
//                     .externalId("ext-ref-123")
//                     .status("SUCCESSFUL")
//                     .financialTransactionId("fin-txn-123")
//                     .build();

//             // When/Then
//             mockMvc.perform(post("/api/callbacks/mtn/disbursement")
//                             .contentType(MediaType.APPLICATION_JSON)
//                             .content(objectMapper.writeValueAsString(callback)))
//                     .andExpect(status().isOk());

//             verify(paymentService).handleMtnDisbursementCallback(any(MtnCallbackRequest.class));
//         }
//     }

//     @Nested
//     @DisplayName("POST /api/callbacks/orange/payment")
//     class OrangePaymentCallback {

//         @Test
//         @DisplayName("should process Orange payment callback")
//         void shouldProcessPaymentCallback() throws Exception {
//             // Given
//             OrangeCallbackRequest callback = OrangeCallbackRequest.builder()
//                     .orderId("order-123")
//                     .status("SUCCESS")
//                     .transactionId("txn-123")
//                     .payToken("pay-token-123")
//                     .build();

//             // When/Then
//             mockMvc.perform(post("/api/callbacks/orange/payment")
//                             .contentType(MediaType.APPLICATION_JSON)
//                             .content(objectMapper.writeValueAsString(callback)))
//                     .andExpect(status().isOk());

//             verify(paymentService).handleOrangeCallback(any(OrangeCallbackRequest.class));
//         }

//         @Test
//         @DisplayName("should handle failed Orange callback")
//         void shouldHandleFailedCallback() throws Exception {
//             // Given
//             OrangeCallbackRequest callback = OrangeCallbackRequest.builder()
//                     .orderId("order-456")
//                     .status("FAILED")
//                     .build();

//             // When/Then
//             mockMvc.perform(post("/api/callbacks/orange/payment")
//                             .contentType(MediaType.APPLICATION_JSON)
//                             .content(objectMapper.writeValueAsString(callback)))
//                     .andExpect(status().isOk());

//             verify(paymentService).handleOrangeCallback(any(OrangeCallbackRequest.class));
//         }
//     }

//     @Nested
//     @DisplayName("POST /api/callbacks/orange/cashout")
//     class OrangeCashoutCallback {

//         @Test
//         @DisplayName("should process Orange cashout callback")
//         void shouldProcessCashoutCallback() throws Exception {
//             // Given
//             OrangeCallbackRequest callback = OrangeCallbackRequest.builder()
//                     .orderId("order-789")
//                     .status("SUCCESS")
//                     .transactionId("txn-789")
//                     .build();

//             // When/Then
//             mockMvc.perform(post("/api/callbacks/orange/cashout")
//                             .contentType(MediaType.APPLICATION_JSON)
//                             .content(objectMapper.writeValueAsString(callback)))
//                     .andExpect(status().isOk());

//             verify(paymentService).handleOrangeCallback(any(OrangeCallbackRequest.class));
//         }
//     }
// }
