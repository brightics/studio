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

package com.samsung.sds.brightics.common.workflow.context.parameter;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

/**
 * Immutable parameter map.
 * It is different with a variable.
 * The variables are controlled by outer class and it is mutable.
 * Client must resolve their variables then make own parameter map before creating this class.
 *
 * @author jb.jung
 */
public class Parameters {

    private final Map<String, JsonElement> parameterMap;

    public Parameters(Map<String, JsonElement> map) {
        parameterMap = new HashMap<>();
        parameterMap.putAll(map);
    }

    public boolean contains(String key) {
        return parameterMap.containsKey(key);
    }

    public JsonElement getParam(String key) {
        return parameterMap.get(key);
    }

    public <T extends JsonElement> T getParamAs(String key, Class<T> clazz) {
        Object some = parameterMap.get(key);
        if (clazz.isInstance(some)) {
            return (T) some;
        } else {
            return null;
        }
    }

    public Number getNumber(String key) {
        return ((JsonPrimitive) getParamAs(key, JsonPrimitive.class)).getAsNumber();
    }

    public Number[] getNumericArray(String key) {
        return convertToArray(getParamAs(key, JsonArray.class), Number.class);
    }

    private <T> T[] convertToArray(JsonArray source, Class<T> clazz) {
        List<T> list = new ArrayList<>();
        source.forEach(elem -> {
            if (elem.isJsonPrimitive()) {
                if (clazz.equals(Number.class)) {
                    list.add((T) elem.getAsJsonPrimitive().getAsNumber());
                } else if (clazz.equals(String.class)) {
                    list.add((T) elem.getAsJsonPrimitive().getAsString());
                }
            } else {
                list.add(null);
            }
        });
        T[] result = (T[]) Array.newInstance(clazz, list.size());
        return list.toArray(result);
    }

    public Number[][] getNumeric2dArray(String key) {
        JsonArray array = getParamAs(key, JsonArray.class);
        List<Number[]> list = new ArrayList<>();
        array.forEach(elem -> {
            if (elem.isJsonArray()) {
                list.add(convertToArray(elem.getAsJsonArray(), Number.class));
            } else {
                list.add(null);
            }
        });
        Number[][] result = new Number[list.size()][];
        return list.toArray(result);
    }

    public String getString(String key) {
        try {
            return getParam(key).getAsString();
        } catch (Exception e) {
            return null;
        }
    }

    public String[] getStringArray(String key) {
        return convertToArray(getParamAs(key, JsonArray.class), String.class);
    }

    public String[][] getString2dArray(String key) {
        List<String[]> list = new ArrayList<>();
        getParamAs(key, JsonArray.class).forEach(elem -> {
            if (elem.isJsonArray()) {
                list.add(convertToArray(elem.getAsJsonArray(), String.class));
            } else {
                list.add(null);
            }
        });
        String[][] result = new String[list.size()][];
        return list.toArray(result);
    }

    @SuppressWarnings("unchecked")
    public Map<String, JsonElement> getMap(String key) {
        Map<String, JsonElement> result = new HashMap<>();
        for (Entry<String, JsonElement> entry : getParamAs(key, JsonObject.class).entrySet()) {
            result.put(entry.getKey(), entry.getValue());
        }
        return result;
    }

    @Override
    public String toString() {
        return "Parameters [" + parameterMap + "]";
    }

    public Set<String> keys() {
        return parameterMap.keySet();
    }

    public Set<Entry<String, JsonElement>> entrySet() {
        return parameterMap.entrySet();
    }

    public JsonObject toJsonObject() {
        JsonObject result = new JsonObject();
        for (Entry<String, JsonElement> entry : parameterMap.entrySet()) {
            result.add(entry.getKey(), entry.getValue());
        }
        return result;
    }

    public String toJsonString() {
        return toJsonObject().toString();
    }
}
