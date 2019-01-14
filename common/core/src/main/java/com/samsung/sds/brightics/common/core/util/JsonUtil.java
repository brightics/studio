package com.samsung.sds.brightics.common.core.util;

import java.io.FileReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.Map;
import java.util.Set;

import com.google.common.collect.Sets;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.gson.BrighticsGsonBuilder;

public class JsonUtil {

    private static final Gson gson = BrighticsGsonBuilder.getGsonInstance();

    public static class JsonParam {

        public JsonObject internalData;

        JsonParam(JsonObject internalData) {
            this.internalData = internalData;
        }

        public Number getOrDefault(String key, Number defaultValue) {
            JsonElement elem = internalData.get(key);
            if (elem == null) {
                return defaultValue;
            } else {
                return elem.getAsNumber();
            }
        }

        public String getOrDefault(String key, String defaultValue) {
            JsonElement elem = internalData.get(key);
            if (elem == null) {
                return defaultValue;
            } else {
                return elem.getAsString();
            }
        }

        public Boolean getOrDefault(String key, Boolean defaultValue) {
            JsonElement elem = internalData.get(key);
            if (elem == null) {
                return defaultValue;
            } else {
                return elem.getAsBoolean();
            }
        }

        public JsonObject getOrDefault(String key, JsonObject defaultValue) {
            JsonElement elem = internalData.get(key);
            if (elem == null || !elem.isJsonObject()) {
                return defaultValue;
            } else {
                return elem.getAsJsonObject();
            }
        }

        public JsonArray getOrDefault(String key, JsonArray defaultValue) {
            JsonElement elem = internalData.get(key);
            if (elem == null || !elem.isJsonArray()) {
                return defaultValue;
            } else {
                return elem.getAsJsonArray();
            }
        }

        public String getOrException(String key) {
            JsonElement elem = internalData.get(key);
            if (elem == null) {
                throw new BrighticsCoreException("3002", key);
            } else {
                return elem.getAsString();
            }
        }

        public String getOrException(String key, String code, String... params) {
            JsonElement elem = internalData.get(key);
            if (elem == null) {
                throw new BrighticsCoreException(code, params);
            } else {
                return elem.getAsString();
            }
        }

        public JsonObject getAsJsonObjectOrException(String key) {
            JsonElement elem = internalData.get(key);
            if (elem == null) {
                throw new BrighticsCoreException("3002", key);
            } else {
                return elem.getAsJsonObject();
            }
        }

        /**
         * Return new json object except keys elements
         *
         * @param except Keys to except from internal data
         * @return New JsonObject except keys elements
         */
        public JsonObject newJsonObjectExcept(String... except) {
            JsonObject newObject = new JsonObject();
            Set<String> exceptKeys = Sets.newHashSet(except);

            for (Map.Entry<String, JsonElement> e : internalData.entrySet()) {
                if (!exceptKeys.contains(e.getKey())) {
                    newObject.add(e.getKey(), e.getValue());
                }
            }

            return newObject;
        }

        public String toString() {
            return gson.toJson(internalData);
        }
    }

    public static JsonParam jsonToParam(String json) {
        return new JsonParam(jsonToObject(json));
    }

    public static JsonObject jsonToObject(String json) {
        return fromJson(json, JsonObject.class);
    }

    public static JsonElement jsonToElement(String json) {
        return fromJson(json, JsonElement.class);
    }

    public static <K, V> Map<K, V> jsonToMap(String json) {
        Type mapType = new TypeToken<Map<K, V>>() {}.getType();
        return gson.fromJson(json, mapType);
    }

    public static String toJson(Object obj) {
        return gson.toJson(obj);
    }

    public static JsonObject toJsonObject(Object obj) {
        if (obj == null) {
            return null;
        }
        return gson.toJsonTree(obj).getAsJsonObject();
    }

    public static <T> T fromJson(String json, Class<T> classOfT) {
        return gson.fromJson(json, classOfT);
    }

    public static <T> T fromJson(JsonElement json, Class<T> classOfT) {
        return gson.fromJson(json, classOfT);
    }

    public static <T> T fromJson(FileReader fileReader, Class<T> classOfT) {
        JsonReader reader = new JsonReader(fileReader);
        return gson.fromJson(reader, classOfT);
    }
    
    public static <T> T fromJson(InputStream inputStream, Class<T> classOfT) {
    	JsonReader reader = new JsonReader(new InputStreamReader(inputStream));
    	return gson.fromJson(reader, classOfT);
    }
}
