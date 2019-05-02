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
