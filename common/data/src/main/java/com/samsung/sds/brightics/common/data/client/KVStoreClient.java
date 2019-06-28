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

package com.samsung.sds.brightics.common.data.client;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Optional;

import org.apache.commons.lang3.EnumUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.module.scala.DefaultScalaModule;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.common.data.client.impl.H2Client;
import com.samsung.sds.brightics.common.data.client.impl.RedisClient;
import com.samsung.sds.brightics.common.data.databind.KVStoredDataModule;

public abstract class KVStoreClient {

    protected static final Logger LOGGER = LoggerFactory.getLogger(KVStoreClient.class);
    private ObjectMapper objectMapper;
    private static KVStoreClient instance;
    private final Object lock = new Object();

    public static synchronized KVStoreClient getInstance() {
        if (instance == null) {
            String typeName = SystemEnvUtil.getEnvOrPropOrElse("KV_STORE", "brightics.kv.store", "REDIS");
            KVStoreType kvStoreType = Optional.ofNullable(EnumUtils.getEnum(KVStoreType.class, typeName.toUpperCase())).orElse(KVStoreType.REDIS);
            instance = kvStoreType.factory.create();
            instance.initMapper();
        }
        return instance;
    }

    private void initMapper() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModules(new DefaultScalaModule(), new KVStoredDataModule());
    }

    public final void put(String user, String mid, String tid, Object data) {
        put(String.join("/", user, mid, tid), data);
    }

    public final void put(String key, Object data) {
        synchronized (lock) {
            putImpl(key, data);
        }
    }

    protected abstract void putImpl(String key, Object data);

    public final Object get(String user, String mid, String tid) {
        return get(user, mid, tid, Object.class);
    }

    public final <T> T get(String user, String mid, String tid, Class<T> clazz) {
        return get(String.join("/", user, mid, tid), clazz);
    }

    public final Object get(String key) {
        return get(key, Object.class);
    }

    public final <T> T get(String key, Class<T> clazz) {
        synchronized (lock) {
            return getImpl(key, clazz);
        }
    }

    public final String getJsonForClientView(String key) {
        try {
            String rawJson = get(key, String.class);
            if (rawJson.contains("__pickled__")) {
                return JsonUtil.toJson(objectMapper.readValue(rawJson, Object.class));
            }
            return rawJson;
        } catch (Exception e) {
            return null;
        }
    }

    protected abstract <T> T getImpl(String key, Class<T> clazz);

    public final long delete(String key) {
        synchronized (lock) {
            return deleteImpl(key);
        }
    }

    protected abstract long deleteImpl(String key);

    public final synchronized byte[] serialize(Object obj) throws JsonProcessingException, UnsupportedEncodingException {
        if (obj instanceof String) {
            return ((String) obj).getBytes("UTF-8");
        }
        return objectMapper.writeValueAsBytes(obj);
    }

    public final synchronized Object deserialize(byte[] data) throws IOException {
        return objectMapper.readValue(data, Object.class);
    }

    public final synchronized <T> T deserialize(byte[] data, Class<T> clazz) throws IOException {
        if (clazz == String.class) {
            return clazz.cast(new String(data, "UTF-8"));
        }
        return objectMapper.readValue(data, clazz);
    }

    enum KVStoreType {
        REDIS(RedisClient::new),
        H2(H2Client::new);

        KVStoreType(Factory factory) {
            this.factory = factory;
        }

        private Factory factory;
    }

    interface Factory {
        KVStoreClient create();
    }
}
