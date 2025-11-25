#!/usr/bin/env python3
"""User Sync Service for Fineract to Keycloak."""

import os
import sys
import logging
import secrets
import string
from typing import Dict, List, Optional
from flask import Flask, request, jsonify
from keycloak import KeycloakAdmin, KeycloakError
from dotenv import load_dotenv
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Keycloak configuration
KEYCLOAK_URL = os.getenv("KEYCLOAK_URL")
KEYCLOAK_REALM = os.getenv("KEYCLOAK_REALM")
KEYCLOAK_CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID")
KEYCLOAK_CLIENT_SECRET = os.getenv("KEYCLOAK_CLIENT_SECRET")

# Keycloak Mifos credentials (for password reset and user management)
KEYCLOAK_ADMIN_USER = os.getenv("KEYCLOAK_ADMIN_USER")
KEYCLOAK_ADMIN_PASSWORD = os.getenv("KEYCLOAK_ADMIN_PASSWORD")

# Fineract role → Keycloak role mapping
# Handles Fineract roles with spaces → Keycloak kebab-case roles
# See: operations/keycloak-config/ROLE_MAPPING.md for full documentation
ROLE_MAPPING = {
    # Admin roles (highest privilege)
    "Super user": "admin",         # Fineract default (lowercase 'user')
    "Super User": "admin",         # Alternative capitalization
    "superuser": "admin",          # No space variant
    "Admin": "admin",

    # Loan Officer
    "Loan Officer": "loan-officer",
    "loan officer": "loan-officer",

    # Teller/Cashier

    "Cashier": "cashier",          
    "cashier": "cashier",

    # Branch Manager
    "Branch Manager": "branch-manager",
    "branch manager": "branch-manager",

    # Accountant
    "Accountant": "accountant",
    "accountant": "accountant",
}

# Default role for unmapped Fineract roles
DEFAULT_ROLE = "staff"

# Initialize Keycloak Admin Client
def get_keycloak_admin():
    """Get Keycloak Admin client with mifos credentials"""
    try:
        admin = KeycloakAdmin(
            server_url=KEYCLOAK_URL,
            username=KEYCLOAK_ADMIN_USER,
            password=KEYCLOAK_ADMIN_PASSWORD,
            realm_name=KEYCLOAK_REALM,  # mifos user is in the target realm
            user_realm_name=KEYCLOAK_REALM,  # But operates on fineract realm
            verify=True
        )
        logger.info("Successfully connected to Keycloak with mifos credentials")
        return admin
    except Exception as e:
        logger.error(f"Failed to connect to Keycloak: {str(e)}")
        raise


def generate_temp_password(length=16) -> str:
    """Generate a secure temporary password for a user."""
    if length < 12 or length > 50:
        raise ValueError("Password length must be between 12 and 50 characters")

    # Define character sets
    lower = string.ascii_lowercase
    upper = string.ascii_uppercase
    digits = string.digits
    special = "!@#$%^&*"
    all_chars = lower + upper + digits + special

    while True:
        # Start with one of each required type to guarantee compliance
        password_list = [
            secrets.choice(lower),
            secrets.choice(upper),
            secrets.choice(digits),
            secrets.choice(special),
        ]

        # Fill the rest of the password length with random characters
        remaining_length = length - len(password_list)
        for _ in range(remaining_length):
            password_list.append(secrets.choice(all_chars))

        # Shuffle the list to randomize character positions
        secrets.SystemRandom().shuffle(password_list)
        password = "".join(password_list)

        # Check for consecutive repeating characters
        has_consecutive = False
        for i in range(len(password) - 1):
            if password[i] == password[i+1]:
                has_consecutive = True
                break
        
        # If no consecutive characters are found, the password is valid
        if not has_consecutive:
            return password


def map_fineract_role_to_keycloak(fineract_role: str) -> str:
    """Map Fineract role to its corresponding Keycloak role."""
    if not fineract_role:
        logger.warning("Empty Fineract role provided, defaulting to DEFAULT_ROLE")
        return DEFAULT_ROLE

    # Try exact match first (most common case)
    if fineract_role in ROLE_MAPPING:
        return ROLE_MAPPING[fineract_role]

    # Try lowercase version
    lower_role = fineract_role.lower()
    if lower_role in ROLE_MAPPING:
        return ROLE_MAPPING[lower_role]

    # Try normalized (spaces → hyphens, lowercase)
    normalized = lower_role.replace(" ", "-")

    # Check if normalized version matches a Keycloak role directly
    # Dynamically get the list of valid Keycloak roles from the mapping
    valid_keycloak_roles = set(ROLE_MAPPING.values())

    if normalized in valid_keycloak_roles:
        logger.info(f"Normalized Fineract role '{fineract_role}' to Keycloak role '{normalized}'")
        return normalized

    # If still not found, log warning and use default
    logger.warning(f"Unknown Fineract role '{fineract_role}', defaulting to '{DEFAULT_ROLE}'")
    return DEFAULT_ROLE


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        admin = get_keycloak_admin()
        realm_info = admin.get_realm(KEYCLOAK_REALM)
        return jsonify({
            "status": "healthy",
            "service": "fineract-keycloak-sync",
            "keycloak_connected": True,
            "realm": realm_info.get("realm")
        }), 200
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 503


@app.route('/sync/user', methods=['POST'])
def sync_user():
    """Sync a single user from Fineract to Keycloak."""
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['username', 'email']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "status": "error",
                    "message": f"Missing required field: {field}"
                }), 400

        # Extract user data
        username = data['username']
        email = data['email']
        first_name = data.get('firstName', '')
        last_name = data.get('lastName', '')
        fineract_role = data.get('role', 'Staff')

        logger.info(f"Syncing user: {username}")

        # Get Keycloak admin client
        admin = get_keycloak_admin()

        # Check if user already exists
        existing_users = admin.get_users({"username": username})
        if existing_users:
            logger.warning(f"User {username} already exists in Keycloak")
            return jsonify({
                "status": "exists",
                "message": f"User {username} already exists in Keycloak",
                "keycloak_user_id": existing_users[0]['id']
            }), 200

        # Generate temporary password
        temp_password = generate_temp_password()

        # Map role
        keycloak_role = map_fineract_role_to_keycloak(fineract_role)

        # Prepare user data for Keycloak
        user_data = {
            "username": username,
            "email": email,
            "firstName": first_name,
            "lastName": last_name,
            "enabled": True,
            "emailVerified": True,
            "credentials": [{
            	"type": "password",
            	"value": temp_password,
                "temporary": True  # Force password change on first login
            }],
            "requiredActions": [
                "UPDATE_PASSWORD",      # Must change password
                "VERIFY_EMAIL",         # Must verify email
                "webauthn-register"     # Must register device
            ]
        }

        # Create user in Keycloak
        user_id = admin.create_user(user_data)
        logger.info(f"Created user in Keycloak: {username} (ID: {user_id})")

        # Assign role
        try:
            realm_roles = admin.get_realm_roles()
            role_obj = next((r for r in realm_roles if r['name'] == keycloak_role), None)

            if role_obj:
                admin.assign_realm_roles(user_id, [role_obj])
                logger.info(f"Assigned role '{keycloak_role}' to user {username}")
            else:
                logger.warning(f"Role '{keycloak_role}' not found in Keycloak")
        except Exception as e:
            logger.error(f"Failed to assign role: {str(e)}")

        # Add to appropriate group (based on office)
        try:
            # Group assignment is based on the Keycloak role
            group_map = {
                "admin": "head-office",
                "branch-manager": "branch-managers",
                "loan-officer": "loan-officers",
                "cashier": "cashiers",
                "accountant": "accountants",
            }
            group_name = group_map.get(keycloak_role)

            if group_name:
                groups = admin.get_groups({"search": group_name})
                if groups:
                    admin.group_user_add(user_id, groups[0]['id'])
                    logger.info(f"Added user {username} to group '{group_name}'")
        except Exception as e:
            logger.error(f"Failed to add to group: {str(e)}")

        # Return success with temporary password
        return jsonify({
            "status": "success",
            "message": f"User {username} synced to Keycloak successfully",
            "keycloak_user_id": user_id,
            "temporary_password": temp_password,
            "required_actions": user_data["requiredActions"]
        }), 201

    except KeycloakError as e:
        logger.error(f"Keycloak error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Keycloak error: {str(e)}"
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Unexpected error: {str(e)}"
        }), 500


@app.route('/users/<username>/reset-password', methods=['POST'])
def reset_password(username):
    """Trigger a password reset email for a user via Keycloak."""
    try:
        admin = get_keycloak_admin()

        # Find user by username
        users = admin.get_users({"username": username})
        if not users:
            logger.warning(f"Password reset failed: User {username} not found in Keycloak")
            return jsonify({
                "status": "error",
                "message": f"User {username} not found"
            }), 404

        user = users[0]
        user_id = user['id']
        user_email = user.get('email')

        # Check if user has email
        if not user_email:
            logger.warning(f"Password reset failed: User {username} has no email")
            return jsonify({
                "status": "error",
                "message": "User has no email address configured"
            }), 400

        # Send password reset email via Keycloak
        # This triggers the UPDATE_PASSWORD required action
        admin.send_update_account(
            user_id=user_id,
            payload=['UPDATE_PASSWORD'],  # Required action
            lifespan=86400  # Link valid for 24 hours (in seconds)
        )

        logger.info(f"Password reset email sent to {username} ({user_email})")

        return jsonify({
            "status": "success",
            "message": f"Password reset email sent to {user_email}",
            "username": username,
            "email": user_email
        }), 200

    except KeycloakError as e:
        logger.error(f"Keycloak error during password reset for {username}: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Keycloak error: {str(e)}"
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error during password reset for {username}: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Unexpected error: {str(e)}"
        }), 500


@app.route('/users/<username>/status', methods=['PUT'])
def update_user_status(username):
    """Enable or disable a user in Keycloak."""
    try:
        data = request.get_json()

        if 'enabled' not in data:
            return jsonify({
                "status": "error",
                "message": "Missing 'enabled' field in request body"
            }), 400

        enabled = data['enabled']

        if not isinstance(enabled, bool):
            return jsonify({
                "status": "error",
                "message": "'enabled' must be a boolean value"
            }), 400

        admin = get_keycloak_admin()

        # Find user by username
        users = admin.get_users({"username": username})
        if not users:
            logger.warning(f"Status update failed: User {username} not found in Keycloak")
            return jsonify({
                "status": "error",
                "message": f"User {username} not found"
            }), 404

        user = users[0]
        user_id = user['id']

        # Update user enabled status
        admin.update_user(
            user_id=user_id,
            payload={
                'enabled': enabled
            }
        )

        action = "enabled" if enabled else "disabled"
        logger.info(f"User {username} (ID: {user_id}) {action} in Keycloak")

        return jsonify({
            "status": "success",
            "message": f"User {username} {action} successfully",
            "username": username,
            "enabled": enabled
        }), 200

    except KeycloakError as e:
        logger.error(f"Keycloak error during status update for {username}: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Keycloak error: {str(e)}"
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error during status update for {username}: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Unexpected error: {str(e)}"
        }), 500


@app.route('/users/<username>/force-password-change', methods=['POST'])
def force_password_change(username):
    """Force a user to change their password on the next login."""
    try:
        admin = get_keycloak_admin()

        # Find user by username
        users = admin.get_users({"username": username})
        if not users:
            logger.warning(f"Force password change failed: User {username} not found in Keycloak")
            return jsonify({
                "status": "error",
                "message": f"User {username} not found"
            }), 404

        user = users[0]
        user_id = user['id']

        # Get current required actions
        current_actions = user.get('requiredActions', [])

        # Add UPDATE_PASSWORD if not already present
        if 'UPDATE_PASSWORD' not in current_actions:
            current_actions.append('UPDATE_PASSWORD')

            admin.update_user(
                user_id=user_id,
                payload={
                    'requiredActions': current_actions
                }
            )

            logger.info(f"User {username} will be required to change password on next login")

            return jsonify({
                "status": "success",
                "message": f"User {username} will be required to change password on next login",
                "username": username
            }), 200
        else:
            logger.info(f"User {username} already has UPDATE_PASSWORD required action")
            return jsonify({
                "status": "success",
                "message": f"User {username} already has password change required",
                "username": username
            }), 200

    except KeycloakError as e:
        logger.error(f"Keycloak error during force password change for {username}: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Keycloak error: {str(e)}"
        }), 500
    except Exception as e:
        logger.error(f"Unexpected error during force password change for {username}: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"Unexpected error: {str(e)}"
        }), 500


@app.route('/users/<username>/keycloak-status', methods=['GET'])
def get_keycloak_status(username):
    """Get a user's Keycloak sync status and details."""
    try:
        admin = get_keycloak_admin()

        # Find user by username
        users = admin.get_users({"username": username})
        if not users:
            return jsonify({
                "status": "not_found",
                "message": f"User {username} not found in Keycloak"
            }), 404

        user = users[0]
        user_id = user['id']

        # Get user roles
        try:
            user_roles = admin.get_realm_roles_of_user(user_id)
            role_names = [role['name'] for role in user_roles]
        except Exception:
            role_names = []

        # Get user groups
        try:
            user_groups = admin.get_user_groups(user_id)
            group_names = [group['name'] for group in user_groups]
        except Exception:
            group_names = []

        return jsonify({
            "status": "success",
            "keycloak_user": {
                "id": user.get('id'),
                "username": user.get('username'),
                "email": user.get('email'),
                "firstName": user.get('firstName'),
                "lastName": user.get('lastName'),
                "enabled": user.get('enabled', False),
                "emailVerified": user.get('emailVerified', True),
                "requiredActions": user.get('requiredActions', []),
                "roles": role_names,
                "groups": group_names,
            }
        }), 200

    except Exception as e:
        logger.error(f"Error getting Keycloak status for {username}: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


if __name__ == '__main__':
    # Validate environment variables
    if not KEYCLOAK_CLIENT_SECRET:
        logger.error("KEYCLOAK_CLIENT_SECRET environment variable not set")
        sys.exit(1)

    # Start Flask app
    port = int(os.getenv("PORT", 5000))
    logger.info(f"Starting Fineract-Keycloak User Sync Service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
