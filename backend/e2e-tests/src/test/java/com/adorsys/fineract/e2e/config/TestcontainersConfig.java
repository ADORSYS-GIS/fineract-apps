package com.adorsys.fineract.e2e.config;

import com.adorsys.fineract.e2e.support.FineractWaitStrategy;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.lifecycle.Startables;
import org.testcontainers.utility.DockerImageName;

import java.time.Duration;

/**
 * Singleton Testcontainers for E2E tests.
 * All containers are started once and shared across the entire test suite.
 *
 * <p>Container topology:
 * <ul>
 *   <li>assetServicePostgres - PostgreSQL for asset-service (Flyway migrations run on Spring Boot startup)</li>
 *   <li>fineractPostgres - PostgreSQL for Fineract (init script creates fineract_tenants + fineract_default)</li>
 *   <li>redis - Redis for distributed locks and price cache</li>
 *   <li>fineract - Apache Fineract with basic auth (no Keycloak needed)</li>
 * </ul>
 */
public final class TestcontainersConfig {

    private TestcontainersConfig() {}

    /** Shared Docker network for container-to-container communication. */
    public static final Network SHARED_NETWORK = Network.newNetwork();

    /** PostgreSQL for the asset-service database. */
    public static final PostgreSQLContainer<?> ASSET_SERVICE_POSTGRES =
            new PostgreSQLContainer<>(DockerImageName.parse("postgres:15-alpine"))
                    .withDatabaseName("asset_service")
                    .withUsername("asset_service")
                    .withPassword("password")
                    .withNetwork(SHARED_NETWORK)
                    .withNetworkAliases("asset-service-postgres");

    /** PostgreSQL for Fineract (hosts fineract_default + fineract_tenants). */
    public static final PostgreSQLContainer<?> FINERACT_POSTGRES =
            new PostgreSQLContainer<>(DockerImageName.parse("postgres:15-alpine"))
                    .withDatabaseName("fineract_default")
                    .withUsername("fineract")
                    .withPassword("fineract_password")
                    .withInitScript("fineract/init-fineract-dbs.sql")
                    .withNetwork(SHARED_NETWORK)
                    .withNetworkAliases("fineract-postgres");

    /** Redis for trade locks and price cache. */
    @SuppressWarnings("resource")
    public static final GenericContainer<?> REDIS =
            new GenericContainer<>(DockerImageName.parse("redis:7.2-alpine"))
                    .withExposedPorts(6379)
                    .withNetwork(SHARED_NETWORK)
                    .withNetworkAliases("redis");

    /** Apache Fineract with basic auth enabled and custom currency plugin. */
    @SuppressWarnings("resource")
    public static final GenericContainer<?> FINERACT =
            new GenericContainer<>(
                    DockerImageName.parse(System.getProperty("fineract.image",
                            "fineract-custom:latest")))
                    .withExposedPorts(8443)
                    .withNetwork(SHARED_NETWORK)
                    .withNetworkAliases("fineract")
                    // Database connection (uses Docker-internal network aliases)
                    .withEnv("FINERACT_HIKARI_DRIVER_SOURCE_CLASS_NAME",
                            "org.postgresql.Driver")
                    .withEnv("FINERACT_HIKARI_JDBC_URL",
                            "jdbc:postgresql://fineract-postgres:5432/fineract_tenants")
                    .withEnv("FINERACT_HIKARI_USERNAME", "fineract")
                    .withEnv("FINERACT_HIKARI_PASSWORD", "fineract_password")
                    .withEnv("FINERACT_DEFAULT_TENANTDB_HOSTNAME", "fineract-postgres")
                    .withEnv("FINERACT_DEFAULT_TENANTDB_PORT", "5432")
                    .withEnv("FINERACT_DEFAULT_TENANTDB_UID", "fineract")
                    .withEnv("FINERACT_DEFAULT_TENANTDB_PWD", "fineract_password")
                    .withEnv("FINERACT_DEFAULT_TENANTDB_IDENTIFIER", "default")
                    .withEnv("FINERACT_DEFAULT_TENANTDB_NAME", "fineract_default")
                    // HikariCP (conservative for tests)
                    .withEnv("FINERACT_HIKARI_MINIMUM_IDLE", "2")
                    .withEnv("FINERACT_HIKARI_MAXIMUM_POOL_SIZE", "5")
                    .withEnv("FINERACT_HIKARI_CONNECTION_TIMEOUT", "20000")
                    // Basic auth (no Keycloak needed)
                    .withEnv("FINERACT_SECURITY_BASICAUTH_ENABLED", "true")
                    .withEnv("FINERACT_SECURITY_OAUTH_ENABLED", "false")
                    // Liquibase auto-migration
                    .withEnv("FINERACT_LIQUIBASE_ENABLED", "true")
                    // Custom currency plugin
                    .withEnv("ADORSYS_CURRENCY_ENABLED", "true")
                    // Combined mode
                    .withEnv("FINERACT_MODE_READ_ENABLED", "true")
                    .withEnv("FINERACT_MODE_WRITE_ENABLED", "true")
                    .withEnv("FINERACT_MODE_BATCH_ENABLED", "true")
                    // Disable S3
                    .withEnv("FINERACT_CONTENT_S3_ENABLED", "false")
                    // Redis (for cache + custom currency plugin)
                    .withEnv("SPRING_CACHE_TYPE", "redis")
                    .withEnv("SPRING_REDIS_HOST", "redis")
                    .withEnv("SPRING_REDIS_PORT", "6379")
                    .withEnv("SPRING_REDIS_PASSWORD", "")
                    // JVM settings
                    .withEnv("JAVA_OPTS", "-Xmx1024m -Xms512m")
                    // Wait strategy and timeout
                    .waitingFor(new FineractWaitStrategy())
                    .withStartupTimeout(Duration.ofMinutes(5));

    static {
        // Start Postgres + Redis first (Fineract depends on fineractPostgres)
        Startables.deepStart(ASSET_SERVICE_POSTGRES, FINERACT_POSTGRES, REDIS).join();
        // Then start Fineract (needs fineractPostgres via shared network)
        FINERACT.start();
    }

    /** Get the Fineract base URL accessible from the host (for REST-Assured and FineractClient). */
    public static String getFineractBaseUrl() {
        return "https://" + FINERACT.getHost() + ":" + FINERACT.getMappedPort(8443);
    }
}
