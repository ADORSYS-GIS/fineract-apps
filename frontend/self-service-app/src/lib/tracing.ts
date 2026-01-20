import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";
import { Resource } from "@opentelemetry/resources";
import {
  BatchSpanProcessor,
  WebTracerProvider,
} from "@opentelemetry/sdk-trace-web";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
  ATTR_DEPLOYMENT_ENVIRONMENT,
} from "@opentelemetry/semantic-conventions";
import { registerInstrumentations } from "@opentelemetry/instrumentation";

/**
 * Initialize OpenTelemetry tracing for the browser.
 * This sets up automatic instrumentation for:
 * - Document load (page navigation)
 * - Fetch API calls
 * - XMLHttpRequest calls
 */
export function initTracing() {
  // Skip tracing in development if OTEL endpoint is not configured
  const otlpEndpoint = import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT;
  const environment = import.meta.env.MODE || "development";

  // Only enable tracing if endpoint is configured
  if (!otlpEndpoint) {
    console.log("[Tracing] OTEL endpoint not configured, tracing disabled");
    return;
  }

  console.log(`[Tracing] Initializing with endpoint: ${otlpEndpoint}`);

  // Create resource with service information
  const resource = new Resource({
    [ATTR_SERVICE_NAME]: "self-service-app",
    [ATTR_SERVICE_VERSION]: import.meta.env.VITE_APP_VERSION || "0.1.0",
    [ATTR_DEPLOYMENT_ENVIRONMENT]: environment,
  });

  // Create OTLP exporter
  const exporter = new OTLPTraceExporter({
    url: `${otlpEndpoint}/v1/traces`,
    headers: {},
  });

  // Create provider with batch processor for better performance
  const provider = new WebTracerProvider({
    resource,
    spanProcessors: [new BatchSpanProcessor(exporter)],
  });

  // Use ZoneContextManager for async context propagation
  provider.register({
    contextManager: new ZoneContextManager(),
  });

  // Register automatic instrumentations
  registerInstrumentations({
    instrumentations: [
      // Track page load performance
      new DocumentLoadInstrumentation(),
      // Track fetch API calls
      new FetchInstrumentation({
        // Propagate trace context to backend
        propagateTraceHeaderCorsUrls: [
          /\/api\//,
          new RegExp(`${import.meta.env.VITE_API_BASE_URL || ""}`),
        ],
        // Clear timing for security
        clearTimingResources: true,
        // Add custom attributes to spans
        applyCustomAttributesOnSpan: (span, request, result) => {
          // Add URL path as attribute
          if (request instanceof Request) {
            const url = new URL(request.url);
            span.setAttribute("http.url.path", url.pathname);
          }
          // Add response status
          if (result instanceof Response) {
            span.setAttribute("http.response.status_code", result.status);
          }
        },
      }),
      // Track XMLHttpRequest calls (for older APIs)
      new XMLHttpRequestInstrumentation({
        propagateTraceHeaderCorsUrls: [
          /\/api\//,
          new RegExp(`${import.meta.env.VITE_API_BASE_URL || ""}`),
        ],
      }),
    ],
  });

  console.log("[Tracing] OpenTelemetry initialized successfully");
}

/**
 * Get the tracer for manual instrumentation
 */
export function getTracer() {
  const { trace } = require("@opentelemetry/api");
  return trace.getTracer("self-service-app");
}
