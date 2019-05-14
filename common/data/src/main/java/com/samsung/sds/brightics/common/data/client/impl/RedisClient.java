/*
    Copyright 2019 Samsung SDS
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

package com.samsung.sds.brightics.common.data.client.impl;

import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.common.data.client.KVStoreClient;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public class RedisClient extends KVStoreClient {

    private final static JedisPool pool = new JedisPool(new JedisPoolConfig(), SystemEnvUtil.getEnvOrPropOrElse("REDIS_SERVER_HOST", "brightics.redis.server.host", "localhost"),
            Integer.parseInt(SystemEnvUtil.getEnvOrPropOrElse("REDIS_SERVER_PORT", "brightics.redis.server.port","6379")));;

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
