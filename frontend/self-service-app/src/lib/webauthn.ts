/**
 * WebAuthn utilities for passwordless authentication and step-up verification
 */

import {
  startAuthentication,
  startRegistration,
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill,
} from "@simplewebauthn/browser";
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/types";

export interface WebAuthnConfig {
  rpName: string;
  rpId: string;
  timeout: number;
}

const DEFAULT_CONFIG: WebAuthnConfig = {
  rpName: "Webank Self-Service",
  rpId: window.location.hostname,
  timeout: 60000,
};

/**
 * Check if WebAuthn is supported in this browser
 */
export function isWebAuthnSupported(): boolean {
  return browserSupportsWebAuthn();
}

/**
 * Check if WebAuthn autofill (conditional UI) is supported
 */
export async function isAutofillSupported(): Promise<boolean> {
  return browserSupportsWebAuthnAutofill();
}

/**
 * Initiate WebAuthn registration
 * This is typically called after user registration to set up passwordless login
 */
export async function registerWebAuthnCredential(
  options: PublicKeyCredentialCreationOptionsJSON
): Promise<RegistrationResponseJSON> {
  if (!isWebAuthnSupported()) {
    throw new Error("WebAuthn is not supported in this browser");
  }

  try {
    const response = await startRegistration({ optionsJSON: options });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "NotAllowedError") {
        throw new Error("User cancelled the registration or the operation timed out");
      }
      if (error.name === "InvalidStateError") {
        throw new Error("A credential already exists for this user");
      }
    }
    throw error;
  }
}

/**
 * Initiate WebAuthn authentication
 * Used for login and step-up authentication
 */
export async function authenticateWithWebAuthn(
  options: PublicKeyCredentialRequestOptionsJSON
): Promise<AuthenticationResponseJSON> {
  if (!isWebAuthnSupported()) {
    throw new Error("WebAuthn is not supported in this browser");
  }

  try {
    const response = await startAuthentication({ optionsJSON: options });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "NotAllowedError") {
        throw new Error("User cancelled the authentication or the operation timed out");
      }
      if (error.name === "InvalidStateError") {
        throw new Error("No credentials available for this user");
      }
    }
    throw error;
  }
}

/**
 * Request step-up authentication for sensitive operations
 * This fetches challenge options from the server and verifies the user
 */
export async function requestStepUpAuth(
  accessToken: string,
  apiBaseUrl: string = "/api"
): Promise<{ verified: boolean; token?: string }> {
  try {
    // 1. Get authentication options from server
    const optionsResponse = await fetch(`${apiBaseUrl}/webauthn/authenticate/options`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!optionsResponse.ok) {
      throw new Error("Failed to get authentication options");
    }

    const options: PublicKeyCredentialRequestOptionsJSON = await optionsResponse.json();

    // 2. Perform WebAuthn authentication
    const authResponse = await authenticateWithWebAuthn(options);

    // 3. Verify with server
    const verifyResponse = await fetch(`${apiBaseUrl}/webauthn/authenticate/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(authResponse),
    });

    if (!verifyResponse.ok) {
      return { verified: false };
    }

    const result = await verifyResponse.json();
    return {
      verified: result.verified,
      token: result.stepUpToken,
    };
  } catch (error) {
    console.error("Step-up authentication failed:", error);
    return { verified: false };
  }
}

/**
 * Check if the device supports platform authenticator (Face ID, Touch ID, Windows Hello)
 */
export async function hasPlatformAuthenticator(): Promise<boolean> {
  if (!isWebAuthnSupported()) {
    return false;
  }

  try {
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch {
    return false;
  }
}

/**
 * Get a human-readable description of the authenticator type
 */
export function getAuthenticatorTypeLabel(hasPlatform: boolean): string {
  if (!hasPlatform) {
    return "Security Key";
  }

  // Try to detect the platform
  const userAgent = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "Face ID / Touch ID";
  }

  if (/macintosh|mac os x/.test(userAgent)) {
    return "Touch ID";
  }

  if (/android/.test(userAgent)) {
    return "Fingerprint / Face Unlock";
  }

  if (/windows/.test(userAgent)) {
    return "Windows Hello";
  }

  return "Biometric / PIN";
}

/**
 * Format WebAuthn error for user display
 */
export function formatWebAuthnError(error: unknown): string {
  if (error instanceof Error) {
    switch (error.name) {
      case "NotAllowedError":
        return "Authentication was cancelled or timed out. Please try again.";
      case "NotSupportedError":
        return "Your device does not support this authentication method.";
      case "SecurityError":
        return "Security error. Please ensure you're on a secure connection.";
      case "InvalidStateError":
        return "No credentials found. Please register a new authenticator.";
      case "AbortError":
        return "Authentication was aborted. Please try again.";
      default:
        return error.message || "An unknown error occurred.";
    }
  }
  return "An unknown error occurred during authentication.";
}
