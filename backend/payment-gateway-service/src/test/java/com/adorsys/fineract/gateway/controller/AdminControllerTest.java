// package com.adorsys.fineract.gateway.controller;

// import com.adorsys.fineract.gateway.dto.PaymentProvider;
// import com.adorsys.fineract.gateway.entity.ReversalDeadLetter;
// import com.adorsys.fineract.gateway.repository.ReversalDeadLetterRepository;
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Nested;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// import org.springframework.boot.test.mock.bean.MockBean;
// import org.springframework.http.MediaType;
// import org.springframework.security.oauth2.jwt.JwtDecoder;
// import org.springframework.test.web.servlet.MockMvc;

// import java.math.BigDecimal;
// import java.util.List;
// import java.util.Optional;

// import static org.hamcrest.Matchers.*;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.*;
// import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// @WebMvcTest(AdminController.class)
// class AdminControllerTest {

//     @Autowired
//     private MockMvc mockMvc;

//     @MockBean
//     private ReversalDeadLetterRepository deadLetterRepository;

//     @MockBean
//     private JwtDecoder jwtDecoder;

//     @Nested
//     @DisplayName("GET /api/admin/reversals/dlq")
//     class ListUnresolvedReversals {

//         @Test
//         @DisplayName("returns list with ADMIN role")
//         void returnsListWithAdminRole() throws Exception {
//             ReversalDeadLetter entry = new ReversalDeadLetter(
//                     "txn-001", 42L, 123L,
//                     BigDecimal.valueOf(5000), "XAF",
//                     PaymentProvider.MTN_MOMO, "Connection timeout");

//             when(deadLetterRepository.findByResolvedFalseOrderByCreatedAtAsc())
//                     .thenReturn(List.of(entry));

//             mockMvc.perform(get("/api/admin/reversals/dlq")
//                             .with(adminJwt()))
//                     .andExpect(status().isOk())
//                     .andExpect(jsonPath("$", hasSize(1)))
//                     .andExpect(jsonPath("$[0].transactionId", is("txn-001")))
//                     .andExpect(jsonPath("$[0].provider", is("MTN_MOMO")));
//         }

//         @Test
//         @DisplayName("returns 401 without auth")
//         void returns401WithoutAuth() throws Exception {
//             mockMvc.perform(get("/api/admin/reversals/dlq"))
//                     .andExpect(status().isUnauthorized());

//             verifyNoInteractions(deadLetterRepository);
//         }
//     }

//     @Nested
//     @DisplayName("PATCH /api/admin/reversals/dlq/{id}")
//     class ResolveDeadLetter {

//         @Test
//         @DisplayName("marks entry as resolved")
//         void marksAsResolved() throws Exception {
//             ReversalDeadLetter entry = new ReversalDeadLetter(
//                     "txn-001", 42L, 123L,
//                     BigDecimal.valueOf(5000), "XAF",
//                     PaymentProvider.MTN_MOMO, "Connection timeout");

//             when(deadLetterRepository.findById(1L)).thenReturn(Optional.of(entry));
//             when(deadLetterRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

//             mockMvc.perform(patch("/api/admin/reversals/dlq/1")
//                             .with(adminJwt())
//                             .contentType(MediaType.APPLICATION_JSON)
//                             .content("{\"resolvedBy\":\"ops-admin\",\"notes\":\"Manually reversed via Fineract UI\"}"))
//                     .andExpect(status().isOk())
//                     .andExpect(jsonPath("$.resolved", is(true)))
//                     .andExpect(jsonPath("$.resolvedBy", is("ops-admin")))
//                     .andExpect(jsonPath("$.notes", is("Manually reversed via Fineract UI")));

//             verify(deadLetterRepository).save(any());
//         }

//         @Test
//         @DisplayName("returns 404 for unknown id")
//         void returns404ForUnknownId() throws Exception {
//             when(deadLetterRepository.findById(999L)).thenReturn(Optional.empty());

//             mockMvc.perform(patch("/api/admin/reversals/dlq/999")
//                             .with(adminJwt())
//                             .contentType(MediaType.APPLICATION_JSON)
//                             .content("{\"resolvedBy\":\"admin\"}"))
//                     .andExpect(status().isNotFound());

//             verify(deadLetterRepository, never()).save(any());
//         }
//     }

//     @Nested
//     @DisplayName("GET /api/admin/reversals/dlq/count")
//     class CountUnresolved {

//         @Test
//         @DisplayName("returns count")
//         void returnsCount() throws Exception {
//             when(deadLetterRepository.countByResolvedFalse()).thenReturn(5L);

//             mockMvc.perform(get("/api/admin/reversals/dlq/count")
//                             .with(adminJwt()))
//                     .andExpect(status().isOk())
//                     .andExpect(jsonPath("$.count", is(5)));
//         }
//     }

//     @Nested
//     @DisplayName("Access Control")
//     class AccessControl {

//         @Test
//         @DisplayName("returns 403 with USER role (not ADMIN)")
//         void returns403WithUserRole() throws Exception {
//             mockMvc.perform(get("/api/admin/reversals/dlq")
//                             .with(userJwt()))
//                     .andExpect(status().isForbidden());

//             verifyNoInteractions(deadLetterRepository);
//         }
//     }

//     // Helper: JWT with ADMIN role
//     private static org.springframework.test.web.servlet.request.RequestPostProcessor adminJwt() {
//         return jwt().jwt(builder -> builder
//                 .claim("realm_access", java.util.Map.of("roles", List.of("ADMIN")))
//                 .claim("sub", "admin-user-id"));
//     }

//     // Helper: JWT with USER role (not ADMIN)
//     private static org.springframework.test.web.servlet.request.RequestPostProcessor userJwt() {
//         return jwt().jwt(builder -> builder
//                 .claim("realm_access", java.util.Map.of("roles", List.of("USER")))
//                 .claim("sub", "regular-user-id"));
//     }
// }
