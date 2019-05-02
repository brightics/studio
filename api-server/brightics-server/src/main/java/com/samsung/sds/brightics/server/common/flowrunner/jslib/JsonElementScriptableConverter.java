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

package com.samsung.sds.brightics.server.common.flowrunner.jslib;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import java.util.Map.Entry;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;

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
