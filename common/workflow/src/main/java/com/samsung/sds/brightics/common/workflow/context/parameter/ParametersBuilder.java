package com.samsung.sds.brightics.common.workflow.context.parameter;

import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import java.util.HashMap;
import java.util.Map;

/**
 * Parameters builder
 *
 * @author jb.jung
 */
public class ParametersBuilder {

    private final Map<String, JsonElement> parameters = new HashMap<>();

    public ParametersBuilder() {
        // nothing to do
    }

    public ParametersBuilder(Parameters params) {
        this.addAll(params);
    }

    public Parameters build() {
        return new Parameters(parameters);
    }

    public ParametersBuilder add(String key, JsonElement value) {
        parameters.put(key, value);
        return this;
    }

    public ParametersBuilder add(String key, Boolean value) {
        return add(key, new JsonPrimitive(value));
    }

    public ParametersBuilder add(String key, Number value) {
        return add(key, new JsonPrimitive(value));
    }

    public ParametersBuilder add(String key, String value) {
        return add(key, new JsonPrimitive(value));
    }

    public final ParametersBuilder addAll(Parameters params) {
        for (String key : params.keys()) {
            parameters.put(key, params.getParam(key));
        }
        return this;
    }

    public ParametersBuilder remove(String key) {
        parameters.remove(key);
        return this;
    }

    public ParametersBuilder clear() {
        parameters.clear();
        return this;
    }
}
