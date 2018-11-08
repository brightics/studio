package com.samsung.sds.brightics.common.data.client.impl;

import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.common.data.client.KVStoreClient;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public class RedisClient extends KVStoreClient {

    private static JedisPool pool;

    public RedisClient() {
        if (pool == null) {
            pool = new JedisPool(new JedisPoolConfig(), SystemEnvUtil.getEnvOrPropOrElse("REDIS_SERVER_HOST", "brightics.redis.server.host", "localhost"),
                    Integer.parseInt(SystemEnvUtil.getEnvOrPropOrElse("REDIS_SERVER_PORT", "brightics.redis.server.port","6379")));
        }
    }

    @Override
    protected void putImpl(String key, Object data) {
        try (Jedis jedis = pool.getResource()) {
            jedis.set(key.getBytes("UTF-8"), serialize(data));
        } catch (Exception e) {
            LOGGER.error("failed to put data to redis", e);
        }
    }

    @Override
    protected <T> T getImpl(String key, Class<T> clazz) {
        try (Jedis jedis = pool.getResource()) {
            byte[] data = jedis.get(key.getBytes("UTF-8"));
            if (data != null) {
                return deserialize(data, clazz);
            }
        } catch (Exception e) {
            LOGGER.error("failed to get data from redis", e);
        }
        return null;
    }

    @Override
    protected long deleteImpl(String key) {
        try (Jedis jedis = pool.getResource()) {
            return jedis.del(key);
        }
    }
}
