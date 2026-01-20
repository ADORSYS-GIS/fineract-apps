/**
 * API Configuration
 *
 * Base configuration for API clients used throughout the application.
 */

export const API_CONFIG = {
  fineract: {
    baseUrl: import.meta.env.VITE_FINERACT_API_URL || "/fineract-provider/api/v1",
    tenantId: import.meta.env.VITE_FINERACT_TENANT_ID || "default",
  },
  registration: {
    baseUrl: import.meta.env.VITE_REGISTRATION_API_URL || "/api",
  },
};

/**
 * Creates headers for Fineract API requests
 */
export function createFineractHeaders(accessToken: string): HeadersInit {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "Fineract-Platform-TenantId": API_CONFIG.fineract.tenantId,
  };
}

/**
 * Creates headers for Registration API requests
 */
export function createRegistrationHeaders(accessToken?: string): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

/**
 * Generic API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    let message = `API Error: ${response.status}`;
    let code: string | undefined;
    let details: unknown;

    try {
      const data = await response.json();
      message = data.message || data.error || message;
      code = data.code;
      details = data;
    } catch {
      // Ignore JSON parsing errors
    }

    return new ApiError(message, response.status, code, details);
  }
}

/**
 * Generic fetch wrapper with error handling
 */
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw await ApiError.fromResponse(response);
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text);
}
