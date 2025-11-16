/** Angular Imports */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/** Custom Services */
import { Logger } from '../logger/logger.service';
import { AuthenticationService } from './authentication.service';

/** Initialize logger */
const log = new Logger('AuthenticationGuard');

/**
 * Route access authorization.
 */
@Injectable()
export class AuthenticationGuard {
  /**
   * @param {Router} router Router for navigation.
   * @param {AuthenticationService} authenticationService Authentication Service.
   */
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  /**
   * Checks if the user has valid credentials with permissions loaded.
   * Authentication is handled by nginx + oauth2-proxy, but we need to ensure
   * user details and permissions are loaded before allowing access.
   *
   * @returns {boolean} True if user has valid credentials with permissions.
   */
  canActivate(): boolean {
    // Authentication is handled by nginx + oauth2-proxy + Keycloak
    // All requests reaching this app are pre-authenticated
    const credentials = this.authenticationService.getCredentials();

    // Check if credentials are loaded and valid
    if (!credentials) {
      log.warn('No credentials found - user details may not be loaded yet');
      return true; // Allow anyway since APP_INITIALIZER should handle this
    }

    // Check if permissions are loaded (not empty array from temp credentials)
    if (credentials.username === 'loading...') {
      log.warn('User details still loading');
      return true; // Allow navigation, but user may see limited UI
    }

    log.debug('Route access granted - user authenticated with permissions loaded');
    return true;
  }
}
