package com.samsung.sds.brightics.common.network.util;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.gson.BrighticsGsonBuilder;

public class ParameterBuilder {

    private static final Gson GSON = BrighticsGsonBuilder.getGsonInstance();
    private JsonObject jsonObject;

    public static ParameterBuilder newBuild() {
        return new ParameterBuilder().init();
    }

    private ParameterBuilder init() {
        this.jsonObject = new JsonObject();
        return this;
    }

    public ParameterBuilder addProperty(String name, Object value) {
        if (value instanceof String) {
            jsonObject.addProperty(name, (String) value);
        } else if (value instanceof Boolean) {
            jsonObject.addProperty(name, (Boolean) value);
        } else if (value instanceof Number) {
            jsonObject.addProperty(name, (Number) value);
        } else {
            jsonObject.addProperty(name, GSON.toJson(value));
        }
        return this;
    }

    public String build() {
        return jsonObject.toString();
    }
}
