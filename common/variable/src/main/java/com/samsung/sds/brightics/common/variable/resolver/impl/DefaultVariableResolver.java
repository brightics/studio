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

package com.samsung.sds.brightics.common.variable.resolver.impl;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.variable.resolver.ExpressionPattern;
import com.samsung.sds.brightics.common.variable.resolver.IVariableResolver;
import com.samsung.sds.brightics.common.variable.resolver.RhinoExceptionHandler;

import java.util.Map.Entry;
import java.util.regex.Matcher;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.RhinoException;

public class DefaultVariableResolver implements IVariableResolver{

    private final VariableContext variableContext;

    public DefaultVariableResolver(VariableContext variableContext) {
        this.variableContext = variableContext;
    }

    @Override
    public JsonElement resolve(JsonElement jsonElement) {
        if (jsonElement.isJsonPrimitive()) {
            return resolvePrimitive(jsonElement.getAsJsonPrimitive());
        } else if (jsonElement.isJsonArray()) {
            return resolveArray(jsonElement.getAsJsonArray());
        } else if (jsonElement.isJsonNull()) {
            return JsonNull.INSTANCE;
        } else if (jsonElement.isJsonObject()) {
            return resolveObject(jsonElement.getAsJsonObject());
        }
        return resolvePrimitive(new JsonPrimitive(jsonElement.getAsString()));
    }

    private JsonElement resolvePrimitive(JsonPrimitive jsonPrimitive) {
        if (jsonPrimitive == null) {
            return null;
        } else if (jsonPrimitive.isBoolean() || jsonPrimitive.isNumber()) {
            return jsonPrimitive;
        }

        String value = jsonPrimitive.getAsString();
        if (ExpressionPattern.containsExpression(value)) {
            return resolveValue(value);
        }
        return new JsonPrimitive(value);
    }

    private JsonArray resolveArray(JsonArray jsonArray) {
        JsonArray result = new JsonArray();
        jsonArray.forEach(elem -> result.add(resolve(elem)));
        return result;
    }

    private JsonObject resolveObject(JsonObject jsonObject) {
        JsonObject result = new JsonObject();
        jsonObject.entrySet().forEach(entry -> {
            JsonElement val = entry.getValue();
            result.add(entry.getKey(), resolve(val));
        });
        return result;
    }

    private JsonElement resolveValue(String value) {
        if (ExpressionPattern.isExpressionOnly(value)) {
            String expression = ExpressionPattern.extractBody(value);
            return convertToJsonElement(getValue(expression));
        } else {
            Matcher m = ExpressionPattern.getExtractPattern().matcher(value);

            StringBuffer sb = new StringBuffer();
            while (m.find()) {
                String expression = m.group(1);
                m.appendReplacement(sb, convertJsonElementToString(convertToJsonElement(getValue(expression))));
            }
            m.appendTail(sb);
            return new JsonPrimitive(sb.toString());
        }
    }

    private Object getValue(String expression) {
        try {
            return variableContext.getValue(expression);
        } catch (RhinoException e) {
            throw RhinoExceptionHandler.handle(e, expression);
        }
    }

    private JsonElement convertToJsonElement(Object value) {
        if (value == null) {
            return null;
        } else if (value instanceof Number) {
            return new JsonPrimitive((Number) value);
        } else if (value instanceof Boolean) {
            return new JsonPrimitive((Boolean) value);
        } else if (value instanceof NativeArray) {
            NativeArray array = (NativeArray) value;
            JsonArray resultArray = new JsonArray();
            for (Object elem : array) {
                resultArray.add(convertToJsonElement(elem));
            }
            return resultArray;
        } else if (value instanceof NativeObject) {
            NativeObject obj = (NativeObject) value;
            JsonObject resultObj = new JsonObject();
            for (Entry<Object, Object> entry : obj.entrySet()) {
                resultObj.add(entry.getKey().toString(), convertToJsonElement(entry.getValue()));
            }
            return resultObj;
        } else if (value instanceof String) {
            return new JsonPrimitive(value.toString());
        }
        throw new BrighticsCoreException("3107").addDetailMessage(value.getClass().getName());
    }

    private String convertJsonElementToString(JsonElement jsonElement) {
        if (jsonElement == null) {
            return "null";
        } else if (jsonElement.isJsonArray()) {
            StringBuilder sb = new StringBuilder();
            for (JsonElement element : jsonElement.getAsJsonArray()) {
                sb.append(element.getAsString()).append(",");
            }
            return sb.toString().substring(0, sb.length() - 1);
        }
        return jsonElement.getAsString();
    }
}
