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
