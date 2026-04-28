package com.adorsys.fineract.gateway.filter;

import com.adorsys.fineract.gateway.dto.PaymentProvider;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CallbackGuardFilterTest {

    @Mock PaymentMetrics paymentMetrics;
    @Mock FilterChain chain;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @BeforeEach
    void setUp() {
        request  = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
    }

    private CallbackGuardFilter filter(String nokashSecret, String nokashIps) {
        return new CallbackGuardFilter(
            paymentMetrics,
            "", "", "", nokashSecret,
            "", "", "", nokashIps);
    }

    // ── Secret guard tests ────────────────────────────────────────────────────

    @Test
    void noGuardsConfigured_dropsCallback() throws Exception {
        CallbackGuardFilter f = filter("", "");
        request.setRequestURI("/api/callbacks/nokash/some-id");
        request.setMethod("POST");

        f.doFilterInternal(request, response, chain);

        assertThat(response.getStatus()).isEqualTo(200);
        verify(chain, never()).doFilter(any(), any());
    }

    @Test
    void noGuardsConfigured_knownProvider_emitsNoGuardsRejectionMetric() throws Exception {
        CallbackGuardFilter f = filter("", "");
        request.setRequestURI("/api/callbacks/nokash/some-id");
        request.setMethod("POST");

        f.doFilterInternal(request, response, chain);

        verify(paymentMetrics).incrementCallbackRejected(PaymentProvider.NOKASH, "no_guards_configured");
    }

    @Test
    void secretConfigured_headerMissing_dropsCallback() throws Exception {
        CallbackGuardFilter f = filter("my-secret", "");
        request.setRequestURI("/api/callbacks/nokash/some-id");

        f.doFilterInternal(request, response, chain);

        assertThat(response.getStatus()).isEqualTo(200);
        verify(chain, never()).doFilter(any(), any());
    }

    @Test
    void secretConfigured_headerWrong_dropsCallback() throws Exception {
        CallbackGuardFilter f = filter("my-secret", "");
        request.setRequestURI("/api/callbacks/nokash/some-id");
        request.addHeader(CallbackGuardFilter.SECRET_HEADER, "wrong-secret");

        f.doFilterInternal(request, response, chain);

        assertThat(response.getStatus()).isEqualTo(200);
        verify(chain, never()).doFilter(any(), any());
    }

    @Test
    void secretConfigured_headerCorrect_passesThrough() throws Exception {
        CallbackGuardFilter f = filter("my-secret", "");
        request.setRequestURI("/api/callbacks/nokash/some-id");
        request.addHeader(CallbackGuardFilter.SECRET_HEADER, "my-secret");

        f.doFilterInternal(request, response, chain);

        verify(chain).doFilter(request, response);
    }

    // ── IP guard tests ────────────────────────────────────────────────────────

    @Test
    void ipConfigured_wrongIp_dropsCallback() throws Exception {
        CallbackGuardFilter f = filter("", "9.9.9.9");
        request.setRequestURI("/api/callbacks/nokash/some-id");
        request.setRemoteAddr("1.2.3.4");

        f.doFilterInternal(request, response, chain);

        assertThat(response.getStatus()).isEqualTo(200);
        verify(chain, never()).doFilter(any(), any());
    }

    @Test
    void ipConfigured_correctIp_passesThrough() throws Exception {
        CallbackGuardFilter f = filter("", "1.2.3.4");
        request.setRequestURI("/api/callbacks/nokash/some-id");
        request.setRemoteAddr("1.2.3.4");

        f.doFilterInternal(request, response, chain);

        verify(chain).doFilter(request, response);
    }

    @Test
    void ipConfigured_xRealIpPreferredOverRemoteAddr() throws Exception {
        // Simulates nginx Ingress: connection comes from proxy (10.0.0.1),
        // but X-Real-IP contains the actual provider IP.
        CallbackGuardFilter f = filter("", "5.5.5.5");
        request.setRequestURI("/api/callbacks/nokash/some-id");
        request.addHeader("X-Real-IP", "5.5.5.5");
        request.setRemoteAddr("10.0.0.1"); // LB node — not whitelisted

        f.doFilterInternal(request, response, chain);

        verify(chain).doFilter(request, response);
    }

    @Test
    void ipConfigured_xRealIpNotWhitelisted_dropsCallback() throws Exception {
        CallbackGuardFilter f = filter("", "1.2.3.4");
        request.setRequestURI("/api/callbacks/nokash/some-id");
        request.addHeader("X-Real-IP", "9.9.9.9");
        request.setRemoteAddr("1.2.3.4"); // would pass if remoteAddr were used

        f.doFilterInternal(request, response, chain);

        assertThat(response.getStatus()).isEqualTo(200);
        verify(chain, never()).doFilter(any(), any());
    }

    // ── Combined guard tests ──────────────────────────────────────────────────

    @Test
    void bothConfigured_bothPass_passesThrough() throws Exception {
        CallbackGuardFilter f = filter("s3cr3t", "1.2.3.4");
        request.setRequestURI("/api/callbacks/nokash/some-id");
        request.addHeader(CallbackGuardFilter.SECRET_HEADER, "s3cr3t");
        request.setRemoteAddr("1.2.3.4");

        f.doFilterInternal(request, response, chain);

        verify(chain).doFilter(request, response);
    }

    @Test
    void bothConfigured_secretFails_dropsCallback() throws Exception {
        CallbackGuardFilter f = filter("s3cr3t", "1.2.3.4");
        request.setRequestURI("/api/callbacks/nokash/some-id");
        request.addHeader(CallbackGuardFilter.SECRET_HEADER, "wrong");
        request.setRemoteAddr("1.2.3.4");

        f.doFilterInternal(request, response, chain);

        assertThat(response.getStatus()).isEqualTo(200);
        verify(chain, never()).doFilter(any(), any());
    }

    // ── Path matching edge cases ──────────────────────────────────────────────

    @Test
    void nonCallbackPath_skipsFilter() throws Exception {
        CallbackGuardFilter f = filter("s3cr3t", "");
        request.setRequestURI("/api/payments/deposit");

        assertThat(f.shouldNotFilter(request)).isTrue();
    }

    @Test
    void pathStartingWithCallbacksButNoTrailingSlash_skipsFilter() throws Exception {
        // e.g. /api/callbacks-admin must not be caught by the filter
        CallbackGuardFilter f = filter("s3cr3t", "");
        request.setRequestURI("/api/callbacks-admin/anything");

        assertThat(f.shouldNotFilter(request)).isTrue();
    }

    @Test
    void unknownProviderPath_dropsCallbackWithNoGuardEffect() throws Exception {
        // Path under /api/callbacks/ but no matching provider segment.
        // Even though nokash secret is configured, the path resolver returns null
        // → no guards apply → silent drop.
        CallbackGuardFilter f = filter("s3cr3t", "");
        request.setRequestURI("/api/callbacks/newprovider/some-id");
        request.addHeader(CallbackGuardFilter.SECRET_HEADER, "s3cr3t");

        f.doFilterInternal(request, response, chain);

        assertThat(response.getStatus()).isEqualTo(200);
        verify(chain, never()).doFilter(any(), any());
    }
}
