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

package com.samsung.sds.brightics.common.core.legacy.util;

import java.util.Map.Entry;
import java.util.StringJoiner;
import java.util.stream.Stream;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class LegacyFunctionUtil {

    private final static JsonParser PARSER = new JsonParser();

    public static String getLegacyFuncParamToScalaString(String parameters, String attributes) {
        JsonObject params = PARSER.parse(parameters).getAsJsonObject();
        JsonObject attrs = PARSER.parse(attributes).getAsJsonObject();

        Stream.of("inData", "outData").filter(attrs::has).forEach((key) -> {
            params.add(key.replace("Data", "-table"), attrs.get(key));
        });

        return getJsonAsScalaString(params);
    }

    // TODO extract as new util class's method
    public static String getJsonAsScalaString(JsonElement value) {
        if (value.isJsonObject()) {
            StringJoiner sj = new StringJoiner(", ", "Map[String, Any](", ")");
            for (Entry<String, JsonElement> entry : value.getAsJsonObject().entrySet()) {
                sj.add("\"" + entry.getKey() + "\" -> " + getJsonAsScalaString(entry.getValue()));
            }
            return sj.toString();
        } else if (value.isJsonArray()) {
            StringJoiner sj = new StringJoiner(", ", "Array(", ")");
            value.getAsJsonArray().forEach(elem -> {
                sj.add(getJsonAsScalaString(elem));
            });
            return sj.toString();
        } else if (value.isJsonPrimitive()) {
            return value.getAsJsonPrimitive().toString();
        } else if (value.isJsonNull()) {
            return "null";
        } else {
            return "";
        }
    }
}
