package com.samsung.sds.brightics.agent.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class DataAttribute {

    public static final DataAttribute EMPTY_MAP = new DataAttribute();
    private Map<String, Object> internalData = new HashMap<>();

    private DataAttribute() {
    }

    public DataAttribute(JsonObject json) {
        for (Entry<String, JsonElement> entry : json.entrySet()) {
            internalData.put(entry.getKey(), resolveValue(entry.getValue()));
        }
    }

    private Object resolveValue(JsonElement value) {
        if (value.isJsonArray()) {
            List<String> result = new ArrayList<>();
            for (JsonElement element : value.getAsJsonArray()) {
                result.add(element.getAsString());
            }
            return result.toArray(new String[value.getAsJsonArray().size()]);
        } else if (value.isJsonPrimitive() && value.getAsJsonPrimitive().isString()) {
            return value.getAsString();
        }
        throw new IllegalArgumentException("unsupported internalData : " + value.getClass().getName());
    }

    public String[] flatValues() {
        List<String> result = new ArrayList<>();
        for (Object value : internalData.values()) {
            if (value instanceof String) {
                result.add((String) value);
            } else {
                Collections.addAll(result, ((String[]) value));
            }
        }
        return result.toArray(new String[0]);
    }

    public Set<Entry<String, Object>> entrySet() {
        return internalData.entrySet();
    }

    public Set<Entry<String, Collection<String>>> entrySetAsIterableValue() {
        return internalData.entrySet().stream()
                .filter(entry -> isNotEmptyValue(entry.getValue()))
                .collect(Collectors.toMap(Entry::getKey, e -> toCollection(e.getValue())))
                .entrySet();
    }

    public Set<Entry<String, String>> entrySetAsStringValue() {
        return internalData.entrySet().stream()
                .filter(entry -> isNotEmptyValue(entry.getValue()))
                .collect(Collectors.toMap(Entry::getKey, e -> toString(e.getValue())))
                .entrySet();
    }

    private Collection<String> toCollection(Object value) {
        if (value instanceof String[]) {
            return Arrays.asList((String[]) value);
        } else {
            return Collections.singletonList(value.toString());
        }
    }

    private String toString(Object value) {
        if (value instanceof String[]) {
            String[] arr = (String[]) value;
            return arr[0];
        } else {
            return value.toString();
        }
    }

    private boolean isNotEmptyValue(Object value) {
        if (value == null) {
            return false;
        } else if (value instanceof String[]) {
            String[] arr = (String[]) value;
            return arr.length > 0;
        } else {
            return StringUtils.isNotBlank(value.toString());
        }
    }
}
