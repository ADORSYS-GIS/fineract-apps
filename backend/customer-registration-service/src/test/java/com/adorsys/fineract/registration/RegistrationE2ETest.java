package com.adorsys.fineract.registration;

import com.adorsys.fineract.registration.dto.RegistrationRequest;
import com.adorsys.fineract.registration.service.FineractService;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class RegistrationE2ETest {

    @LocalServerPort
    private int port;

    @MockBean
    private FineractService fineractService;


    @BeforeEach
    void resetMocks() {
        Mockito.reset(fineractService);
    }

    @Test
    @Order(1)
    void testSuccessfulRegistration() {
        when(fineractService.createClient(any(), any())).thenReturn(1L);

        RegistrationRequest request = new RegistrationRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        String uniqueEmail = "john.doe." + System.currentTimeMillis() + "@example.com";
        request.setEmail(uniqueEmail);
        request.setPhone("+1234567890");
        request.setExternalId("test-external-id");

        given()
                .port(port)
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post("/api/registration/register")
                .then()
                .statusCode(201)
                .body("status", equalTo("success"));
    }


    @Test
    @Order(2)
    void testRegistrationFailsWhenFineractFails() {
        doThrow(new RuntimeException("Fineract is down"))
                .when(fineractService).createClient(any(), any());

        RegistrationRequest request = new RegistrationRequest();
        request.setFirstName("Test");
        request.setLastName("User");
        request.setEmail("fineract-fail-" + System.currentTimeMillis() + "@example.com");
        request.setPhone("+1987654321");
        request.setExternalId("another-test-id");

        given()
                .port(port)
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post("/api/registration/register")
                .then()
                .statusCode(500);

    }

}
