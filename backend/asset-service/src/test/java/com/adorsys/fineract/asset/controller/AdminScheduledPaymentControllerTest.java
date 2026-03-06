package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.PaymentResultResponse;
import com.adorsys.fineract.asset.scheduler.IncomeDistributionScheduler;
import com.adorsys.fineract.asset.scheduler.InterestPaymentScheduler;
import com.adorsys.fineract.asset.service.ScheduledPaymentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminScheduledPaymentController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminScheduledPaymentControllerTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private ScheduledPaymentService scheduledPaymentService;
    @MockBean private InterestPaymentScheduler interestPaymentScheduler;
    @MockBean private IncomeDistributionScheduler incomeDistributionScheduler;

    @Test
    void results_returns200WithPaginatedResults() throws Exception {
        PaymentResultResponse result = PaymentResultResponse.fromCoupon(
                1L, 42L, new BigDecimal("10"), new BigDecimal("2900"),
                "SUCCESS", null, Instant.now(),
                new BigDecimal("10000"), new BigDecimal("5.80"), 6);

        when(scheduledPaymentService.getPaymentResults(eq(1L), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(result)));

        mockMvc.perform(get("/api/admin/scheduled-payments/1/results")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].userId").value(42))
                .andExpect(jsonPath("$.content[0].amount").value(2900))
                .andExpect(jsonPath("$.content[0].status").value("SUCCESS"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(scheduledPaymentService).getPaymentResults(eq(1L), any(Pageable.class));
    }

    @Test
    void results_pageSizeTooLarge_returns400() throws Exception {
        mockMvc.perform(get("/api/admin/scheduled-payments/1/results")
                        .param("size", "200"))
                .andExpect(status().isBadRequest());
    }
}
