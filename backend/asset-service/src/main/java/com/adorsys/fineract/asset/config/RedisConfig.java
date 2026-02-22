package com.adorsys.fineract.asset.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * Redis configuration for price caching and distributed trade locks.
 */
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new StringRedisSerializer());
        template.afterPropertiesSet();
        return template;
    }

    /**
     * Lua script to atomically acquire dual trade locks (user + treasury).
     * If both locks are acquired, returns 1. If only one succeeds, releases it and returns 0.
     */
    @Bean
    public DefaultRedisScript<Long> acquireTradeLockScript() {
        DefaultRedisScript<Long> script = new DefaultRedisScript<>();
        script.setScriptText("""
            local userKey = KEYS[1]
            local treasuryKey = KEYS[2]
            local value = ARGV[1]
            local ttl = tonumber(ARGV[2])

            local userLock = redis.call('SET', userKey, value, 'NX', 'EX', ttl)
            if not userLock then
                return 0
            end

            local treasuryLock = redis.call('SET', treasuryKey, value, 'NX', 'EX', ttl)
            if not treasuryLock then
                redis.call('DEL', userKey)
                return 0
            end

            return 1
            """);
        script.setResultType(Long.class);
        return script;
    }

    /**
     * Lua script to atomically release both trade locks.
     * Only releases if the lock value matches (prevents releasing someone else's lock).
     */
    @Bean
    public DefaultRedisScript<Long> releaseTradeLockScript() {
        DefaultRedisScript<Long> script = new DefaultRedisScript<>();
        script.setScriptText("""
            local userKey = KEYS[1]
            local treasuryKey = KEYS[2]
            local value = ARGV[1]
            local released = 0

            if redis.call('GET', userKey) == value then
                redis.call('DEL', userKey)
                released = released + 1
            end

            if redis.call('GET', treasuryKey) == value then
                redis.call('DEL', treasuryKey)
                released = released + 1
            end

            return released
            """);
        script.setResultType(Long.class);
        return script;
    }
}
