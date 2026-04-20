package com.adorsys.fineract.asset.config;

import net.javacrumbs.shedlock.core.LockProvider;
import net.javacrumbs.shedlock.provider.jdbctemplate.JdbcTemplateLockProvider;
import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

/**
 * Distributed scheduler lock configuration using ShedLock with a JDBC (PostgreSQL) backend.
 *
 * <p>Ensures that each {@code @Scheduled} task runs on exactly ONE pod when the service
 * is scaled horizontally. Without this, all 15 scheduled jobs would fire on every replica
 * simultaneously, causing duplicate accounting entries and redundant DB writes.
 *
 * <p>Lock state is stored in the {@code shedlock} table (created by Flyway migration
 * {@code V10__add_shedlock_table.sql}). No additional infrastructure is required — the
 * existing PostgreSQL connection is reused.
 *
 * <p>{@code defaultLockAtMostFor = "PT10M"}: safety ceiling — if a pod crashes while
 * holding a lock, the lock is automatically released after 10 minutes so other pods
 * can pick up the next scheduled run.
 */
@Configuration
@EnableSchedulerLock(defaultLockAtMostFor = "PT10M")
public class SchedulerLockConfig {

    @Bean
    public LockProvider lockProvider(DataSource dataSource) {
        return new JdbcTemplateLockProvider(
            JdbcTemplateLockProvider.Configuration.builder()
                .withJdbcTemplate(new JdbcTemplate(dataSource))
                .usingDbTime()  // Use DB clock — avoids clock-skew issues between pods
                .build()
        );
    }
}
