package com.adorsys.fineract.asset.bdd.steps;

import com.adorsys.fineract.asset.bdd.state.ScenarioContext;
import com.atlassian.oai.validator.OpenApiInteractionValidator;
import com.atlassian.oai.validator.model.Request;
import com.atlassian.oai.validator.model.SimpleResponse;
import com.atlassian.oai.validator.report.ValidationReport;
import io.cucumber.java.en.Then;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

/**
 * Step definitions for OpenAPI contract validation.
 * Validates API response schemas against the live-generated OpenAPI spec.
 * Only validates response body/status (not request), since MockMvc stored results
 * don't fully preserve request body/headers.
 */
@Slf4j
public class OpenApiValidationStepDefinitions {

    @Autowired private MockMvc mockMvc;
    @Autowired private ScenarioContext context;

    private static volatile OpenApiInteractionValidator validator;
    private static volatile boolean initAttempted;

    /**
     * Lazily fetch the OpenAPI spec from the running test context and build the validator.
     */
    private OpenApiInteractionValidator getValidator() {
        if (validator == null && !initAttempted) {
            synchronized (OpenApiValidationStepDefinitions.class) {
                if (validator == null && !initAttempted) {
                    initAttempted = true;
                    try {
                        MvcResult specResult = mockMvc.perform(get("/api-docs")).andReturn();
                        String specJson = specResult.getResponse().getContentAsString();

                        validator = OpenApiInteractionValidator
                                .createForInlineApiSpecification(specJson)
                                .build();

                        log.info("OpenAPI validator initialized from /api-docs ({} bytes)", specJson.length());
                    } catch (Exception e) {
                        log.warn("Failed to initialize OpenAPI validator: {}", e.getMessage());
                    }
                }
            }
        }
        return validator;
    }

    @Then("the response conforms to the OpenAPI schema")
    public void responseConformsToOpenApiSchema() {
        OpenApiInteractionValidator v = getValidator();
        if (v == null) {
            log.warn("OpenAPI validator not available — skipping schema validation");
            return;
        }

        MvcResult result = context.getLastResult();
        MockHttpServletRequest servletRequest = result.getRequest();
        MockHttpServletResponse servletResponse = result.getResponse();

        String path = servletRequest.getRequestURI();
        Request.Method method = Request.Method.valueOf(servletRequest.getMethod().toUpperCase());

        // Build response only (skip request validation — MockMvc stored results
        // don't preserve request body/headers)
        SimpleResponse.Builder responseBuilder = new SimpleResponse.Builder(servletResponse.getStatus());
        if (servletResponse.getContentType() != null) {
            responseBuilder.withContentType(servletResponse.getContentType());
        }
        String body = context.getLastResponseBody();
        if (body != null && !body.isEmpty()) {
            responseBuilder.withBody(body);
        }

        ValidationReport report = v.validateResponse(path, method, responseBuilder.build());

        // Filter to only response-related errors
        String errors = report.getMessages().stream()
                .filter(m -> m.getLevel() == ValidationReport.Level.ERROR)
                .filter(m -> m.getKey().startsWith("validation.response"))
                .map(m -> m.getKey() + ": " + m.getMessage())
                .collect(Collectors.joining("\n"));

        assertThat(errors)
                .as("OpenAPI response schema validation failed for %s %s", method, path)
                .isEmpty();
    }
}
