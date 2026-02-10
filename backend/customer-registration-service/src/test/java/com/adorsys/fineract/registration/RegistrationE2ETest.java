package com.adorsys.fineract.registration;

import com.adorsys.fineract.registration.dto.RegistrationRequest;
import com.adorsys.fineract.registration.exception.RegistrationException;
import com.adorsys.fineract.registration.service.FineractService;
import com.adorsys.fineract.registration.service.KeycloakService;
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
import static org.hamcrest.Matchers.notNullValue;
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

    @MockBean
    private KeycloakService keycloakService;

    @BeforeEach
    void resetMocks() {
        Mockito.reset(fineractService, keycloakService);
    }

    @Test
    @Order(1)
    void testSuccessfulRegistration() {
        when(fineractService.createClient(any(), any())).thenReturn(1L);
        when(keycloakService.createUser(any(), any())).thenReturn("mock-user-id");

        RegistrationRequest request = new RegistrationRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        String uniqueEmail = "john.doe." + System.currentTimeMillis() + "@example.com";
        request.setEmail(uniqueEmail);
        request.setPhone("+1234567890");

        given()
                .port(port)
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post("/api/registration/register")
                .then()
                .statusCode(201)
                .body("status", equalTo("pending_verification"))
                .body("externalId", notNullValue());
    }

    @Test
    @Order(2)
    void testRegistrationFailsWhenEmailExists() {
        String existingEmail = "jane.doe." + System.currentTimeMillis() + "@example.com";

        RegistrationRequest request = new RegistrationRequest();
        request.setEmail(existingEmail);
        request.setFirstName("Jane");
        request.setLastName("Doe");
        request.setPhone("+1234567891");

        when(fineractService.createClient(any(), any())).thenReturn(2L);
        doThrow(new RegistrationException("EMAIL_ALREADY_EXISTS", "Email is already registered", "email"))
                .when(keycloakService).createUser(any(), any());


        given()
                .port(port)
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post("/api/registration/register")
                .then()
                .statusCode(400);

        verify(fineractService, times(1)).deleteClient(2L);
    }

    @Test
    @Order(3)
    void testRollbackWhenFineractFails() {
        doThrow(new RuntimeException("Fineract is down"))
                .when(fineractService).createClient(any(), any());

        RegistrationRequest request = new RegistrationRequest();
        request.setFirstName("Test");
        request.setLastName("User");
        request.setEmail("fineract-fail-" + System.currentTimeMillis() + "@example.com");
        request.setPhone("+1987654321");

        given()
                .port(port)
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post("/api/registration/register")
                .then()
                .statusCode(500);

        verify(keycloakService, never()).createUser(any(), any());
        verify(keycloakService, never()).deleteUser(any());
    }

    @Test
    @Order(4)
    void testRollbackWhenKeycloakFails() {
        when(fineractService.createClient(any(), any())).thenReturn(123L);
        doThrow(new RuntimeException("Keycloak is down"))
                .when(keycloakService).createUser(any(), any());

        RegistrationRequest request = new RegistrationRequest();
        request.setFirstName("Another");
        request.setLastName("User");
        request.setEmail("keycloak-fail-" + System.currentTimeMillis() + "@example.com");
        request.setPhone("+1987654322");

        given()
                .port(port)
                .contentType(ContentType.JSON)
                .body(request)
                .when()
                .post("/api/registration/register")
                .then()
                .statusCode(500);

        verify(fineractService, times(1)).deleteClient(123L);
    }
}
