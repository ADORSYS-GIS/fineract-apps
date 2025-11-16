/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { Injectable } from '@angular/core';

/**
 * Service to map Keycloak roles to Fineract permissions.
 *
 * Keycloak provides roles (e.g., "Super User", "loan-officer"),
 * while Fineract expects specific permissions (e.g., "ALL_FUNCTIONS", "READ_CLIENT").
 *
 * This service bridges the gap by mapping role names to their corresponding
 * Fineract permission strings.
 */
@Injectable({ providedIn: 'root' })
export class RolePermissionMapperService {
  /**
   * Map of Keycloak role names to Fineract permissions.
   *
   * Permission format: {ACTION}_{ENTITY}
   * - Actions: READ, CREATE, UPDATE, DELETE, APPROVE, etc.
   * - Entities: CLIENT, LOAN, SAVINGSACCOUNT, OFFICE, etc.
   *
   * Special permissions:
   * - ALL_FUNCTIONS: Super admin access (all permissions)
   * - ALL_FUNCTIONS_READ: Read-only access to everything
   */
  private rolePermissionMap: Map<string, string[]> = new Map([
    // Super User - Full administrative access
    [
      'Super User',
      ['ALL_FUNCTIONS']
    ],
    [
      'Super user',
      ['ALL_FUNCTIONS']
    ], // Handle case variation
    [
      'admin',
      ['ALL_FUNCTIONS']
    ],

    // Loan Officer - Client and loan management
    [
      'loan-officer',
      [
        'READ_CLIENT',
        'CREATE_CLIENT',
        'UPDATE_CLIENT',
        'DELETE_CLIENT',
        'READ_LOAN',
        'CREATE_LOAN',
        'UPDATE_LOAN',
        'APPROVE_LOAN',
        'DISBURSE_LOAN',
        'REJECT_LOAN',
        'WITHDRAW_LOAN',
        'READ_SAVINGSACCOUNT',
        'CREATE_SAVINGSACCOUNT',
        'UPDATE_SAVINGSACCOUNT'
      ]
    ],

    // Teller/Cashier - Transaction processing
    [
      'teller',
      [
        'READ_CLIENT',
        'READ_SAVINGSACCOUNT',
        'DEPOSIT_SAVINGSACCOUNT',
        'WITHDRAWAL_SAVINGSACCOUNT',
        'READ_LOAN',
        'REPAYMENT_LOAN'
      ]
    ],

    // Branch Manager - Supervisory access
    [
      'branch-manager',
      [
        'READ_CLIENT',
        'CREATE_CLIENT',
        'UPDATE_CLIENT',
        'READ_LOAN',
        'CREATE_LOAN',
        'UPDATE_LOAN',
        'APPROVE_LOAN',
        'DISBURSE_LOAN',
        'READ_SAVINGSACCOUNT',
        'CREATE_SAVINGSACCOUNT',
        'UPDATE_SAVINGSACCOUNT',
        'APPROVE_SAVINGSACCOUNT',
        'READ_OFFICE',
        'UPDATE_OFFICE',
        'READ_STAFF',
        'UPDATE_STAFF'
      ]
    ],

    // Staff - Basic operational access
    [
      'staff',
      [
        'READ_CLIENT',
        'READ_LOAN',
        'READ_SAVINGSACCOUNT',
        'READ_OFFICE',
        'READ_STAFF'
      ]
    ],

    // Accountant - Financial operations
    [
      'accountant',
      [
        'READ_CLIENT',
        'READ_LOAN',
        'READ_SAVINGSACCOUNT',
        'READ_OFFICE',
        'CREATE_JOURNALENTRY',
        'READ_JOURNALENTRY',
        'UPDATE_JOURNALENTRY',
        'READ_GLACCOUNT',
        'CREATE_GLACCOUNT',
        'UPDATE_GLACCOUNT'
      ]
    ],

    // Field Officer - Field operations
    [
      'field-officer',
      [
        'READ_CLIENT',
        'CREATE_CLIENT',
        'UPDATE_CLIENT',
        'READ_LOAN',
        'READ_SAVINGSACCOUNT'
      ]
    ],

    // Read-only - View-only access
    [
      'readonly',
      ['ALL_FUNCTIONS_READ']
    ],
    [
      'read-only',
      ['ALL_FUNCTIONS_READ']
    ]
  ]);

  /**
   * Maps an array of role objects to Fineract permissions.
   *
   * @param roles Array of role objects from /userdetails endpoint
   *              Format: [{"id": 1, "name": "Super user", "description": "..."}]
   * @returns Array of Fineract permission strings
   */
  mapRolesToPermissions(roles: any[]): string[] {
    if (!roles || !Array.isArray(roles)) {
      console.warn('[RolePermissionMapper] No roles provided or roles is not an array');
      return [];
    }

    const permissions = new Set<string>();

    roles.forEach((role) => {
      // Extract role name from role object
      const roleName = typeof role === 'string' ? role : role.name;

      if (!roleName) {
        console.warn('[RolePermissionMapper] Role object missing name property:', role);
        return;
      }

      // Look up permissions for this role (case-insensitive search)
      const rolePerms = this.findRolePermissions(roleName);

      if (rolePerms && rolePerms.length > 0) {
        console.log(`[RolePermissionMapper] Mapped role "${roleName}" to permissions:`, rolePerms);
        rolePerms.forEach((perm) => permissions.add(perm));
      } else {
        console.warn(`[RolePermissionMapper] No permission mapping found for role: "${roleName}"`);
      }
    });

    const result = Array.from(permissions);
    console.log('[RolePermissionMapper] Final mapped permissions:', result);
    return result;
  }

  /**
   * Find permissions for a role name (case-insensitive).
   *
   * @param roleName Name of the role to look up
   * @returns Array of permission strings, or undefined if not found
   */
  private findRolePermissions(roleName: string): string[] | undefined {
    // Try exact match first
    if (this.rolePermissionMap.has(roleName)) {
      return this.rolePermissionMap.get(roleName);
    }

    // Try case-insensitive match
    const lowerRoleName = roleName.toLowerCase();
    for (const [
      key,
      value
    ] of this.rolePermissionMap.entries()) {
      if (key.toLowerCase() === lowerRoleName) {
        return value;
      }
    }

    return undefined;
  }

  /**
   * Check if a role has a specific permission.
   *
   * @param roles Array of role objects
   * @param permission Permission string to check
   * @returns true if any role has the permission
   */
  hasPermission(roles: any[], permission: string): boolean {
    const permissions = this.mapRolesToPermissions(roles);
    return (
      permissions.includes('ALL_FUNCTIONS') ||
      permissions.includes(permission) ||
      (permission.startsWith('READ_') && permissions.includes('ALL_FUNCTIONS_READ'))
    );
  }

  /**
   * Add or update a role-to-permission mapping.
   * Useful for custom roles or runtime configuration.
   *
   * @param roleName Name of the role
   * @param permissions Array of permission strings
   */
  addRoleMapping(roleName: string, permissions: string[]): void {
    this.rolePermissionMap.set(roleName, permissions);
    console.log(`[RolePermissionMapper] Added/updated role mapping for "${roleName}":`, permissions);
  }

  /**
   * Get all available role mappings.
   *
   * @returns Map of role names to permissions
   */
  getAllMappings(): Map<string, string[]> {
    return new Map(this.rolePermissionMap);
  }
}
