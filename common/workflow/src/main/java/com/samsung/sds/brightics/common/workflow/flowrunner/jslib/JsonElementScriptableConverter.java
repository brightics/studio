package com.samsung.sds.brightics.common.workflow.flowrunner.jslib;

import java.util.Map.Entry;

import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

public class JsonElementScriptableConverter {

    public static Object convert(JsonElement element) {
        if (element.isJsonPrimitive()) {
            return convertAsPrimitive(element.getAsJsonPrimitive());
        } else if (element.isJsonArray()) {
            return convertAsArray(element.getAsJsonArray());
        } else if (element.isJsonObject()) {
            return convertAsObject(element.getAsJsonObject());
        }
        return null;
    }

    private static NativeObject convertAsObject(JsonObject object) {
        NativeObject result = new NativeObject();
        for (Entry<String, JsonElement> entry : object.entrySet()) {
            result.put(entry.getKey(), convert(entry.getValue()));
        }
        return result;
    }

    private static NativeArray convertAsArray(JsonArray array) {
        NativeArray result = new NativeArray(array.size());
        for (int i = 0; i < array.size(); i++) {
            result.add(convert(array.get(i)));
        }
        return result;
    }

    private static Object convertAsPrimitive(JsonPrimitive primitive) {
        if (primitive.isNumber()) {
            return primitive.getAsNumber();
        } else if (primitive.isBoolean()) {
            return primitive.getAsBoolean();
        }
        return primitive.getAsString();
    }
}
