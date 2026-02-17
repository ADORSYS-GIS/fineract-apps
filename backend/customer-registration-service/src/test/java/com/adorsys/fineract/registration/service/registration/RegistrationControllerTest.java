package com.adorsys.fineract.registration.service.registration;

import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.service.FineractService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@SuppressWarnings("null")
class RegistrationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private FineractService fineractService;

    @Test
    @WithMockUser(authorities = "ROLE_KYC_MANAGER")
    void register_success() throws Exception {
        RegistrationRequest request = new RegistrationRequest();
        request.setEmail("test@example.com");
        request.setExternalId("external-id");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPhone("1234567890");

        when(fineractService.createClient(any(RegistrationRequest.class))).thenReturn(1L);
        when(fineractService.createSavingsAccount(anyLong())).thenReturn(2L);

        mockMvc.perform(post("/api/registration/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    void register_unauthorized() throws Exception {
        RegistrationRequest request = new RegistrationRequest();
        request.setEmail("test@example.com");
        request.setExternalId("external-id");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPhone("1234567890");


        mockMvc.perform(post("/api/registration/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }


    @Test
    @WithMockUser(authorities = "ROLE_KYC_MANAGER")
    void register_badRequest() throws Exception {
        RegistrationRequest request = new RegistrationRequest();
        // Missing required fields

        mockMvc.perform(post("/api/registration/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
