package com.azamra.loadtest.config

object TestConfig {
  val assetServiceUrl: String = sys.env.getOrElse("ASSET_SERVICE_URL", "http://asset-service:8083")
  val keycloakUrl: String = sys.env.getOrElse("KEYCLOAK_URL", "http://keycloak:8080")
  val keycloakRealm: String = sys.env.getOrElse("KEYCLOAK_REALM", "fineract")
  val clientId: String = sys.env.getOrElse("DEMO_CLIENT_ID", "demo-script")
  val clientSecret: String = sys.env.getOrElse("DEMO_CLIENT_SECRET", "demo-script-secret")
  val username: String = sys.env.getOrElse("DEMO_USERNAME", "investor1")
  val password: String = sys.env.getOrElse("DEMO_PASSWORD", "DemoTest1234")
  val soakDuration: Int = sys.env.getOrElse("SOAK_DURATION_MINUTES", "30").toInt

  val tokenUrl: String = s"$keycloakUrl/realms/$keycloakRealm/protocol/openid-connect/token"
  val baseUrl: String = s"$assetServiceUrl/api/v1"

  // Admin credentials for test data setup
  val adminClientId: String = sys.env.getOrElse("DATA_LOADER_CLIENT_ID", "fineract-data-loader")
  val adminClientSecret: String = sys.env.getOrElse("DATA_LOADER_CLIENT_SECRET", "fineract-data-loader-secret")
}
