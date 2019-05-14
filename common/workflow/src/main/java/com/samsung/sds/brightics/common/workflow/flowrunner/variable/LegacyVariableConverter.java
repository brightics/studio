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

package com.samsung.sds.brightics.common.workflow.flowrunner.variable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.variable.resolver.ExpressionPattern;

public class LegacyVariableConverter {

    private static final String VALUE = "value";
    private static final String VARIABLES = "variables";
    private final Map<String, JsonObject> literals = new HashMap<>();
    private final Map<String, JsonObject> calVariables = new HashMap<>();

    public void convertCalculationVariable(JsonObject model) {
        literals.clear();
        calVariables.clear();

        // model.variables
        if (model.has(VARIABLES)) {
            handleVariables(model.getAsJsonObject(VARIABLES));
        }

        // model.functions[name=Flow].param.variables
        handleFunctions(model.getAsJsonArray("functions"));
    }

    private void handleFunctions(JsonArray functions) {
        for (JsonElement elem : functions) {
            JsonObject function = elem.getAsJsonObject();
            if ("Flow".equals(function.get("name").getAsString())) {
                handleVariables(function.getAsJsonObject("param").getAsJsonObject(VARIABLES));
            }
        }
    }

    private void handleVariables(JsonObject variables) {
        addVariablesInfo(variables);
        resolveCalculations();
    }

    private void addVariablesInfo(JsonObject variables) {
        for (Entry<String, JsonElement> entry : variables.entrySet()) {
            String k = entry.getKey();
            JsonObject v = entry.getValue().getAsJsonObject();
            if (v.has("type") && "calculation".equals(v.get("type").getAsString()) && !ExpressionPattern.isExpressionOnly(v.get(VALUE))) {
                calVariables.put(k, v);
            } else {
                v.remove("type");
                literals.put(k, v);
            }
        }
    }

    private void resolveCalculations() {
        List<String> resolvedVariables = new ArrayList<>();
        while (!calVariables.isEmpty()) {
            resolvedVariables.clear();
            for (Entry<String, JsonObject> entry : calVariables.entrySet()) {
                JsonObject v = entry.getValue();
                String originalValue = v.get(VALUE).getAsString();
                String resolvedValue = resolve(originalValue);
                v.addProperty(VALUE, resolvedValue);

                if (!ExpressionPattern.containsExpression(resolvedValue)) {
                    v.remove("type");
                    v.addProperty(VALUE, convertToEval(resolvedValue));
                    literals.put(entry.getKey(), v);
                    resolvedVariables.add(entry.getKey());
                }
            }
            resolvedVariables.forEach(key -> calVariables.remove(key));
        }
    }

    private String convertToEval(String resolvedValue) {
        if (!resolvedValue.matches("(?s).*%%EVAL%%(.+)%%EVAL%%(?s).*")) {
            return "${=" + resolvedValue + "}";
        }

        Matcher m = Pattern.compile("%%EVAL%%(.+)%%EVAL%%").matcher(resolvedValue.replaceAll("'", "\\\\'"));
        StringBuffer sb = new StringBuffer("${=eval('");
        while (m.find()) {
            m.appendReplacement(sb, "' + " + m.group(1) + " + '");
        }
        m.appendTail(sb);
        return sb.append("')}").toString();
    }

    private String resolve(String value) {
        Matcher m = ExpressionPattern.getExtractPattern().matcher(value);
        StringBuffer sb = new StringBuffer();

        while (m.find()) {
            String key = m.group(1);
            if (!literals.containsKey(key) && !calVariables.containsKey(key)) {
                m.appendReplacement(sb, "%%EVAL%%" + key + "%%EVAL%%");
            } else if (literals.containsKey(key)) {
                m.appendReplacement(sb, "");
                sb.append(literals.get(key).get(VALUE).getAsString());
            }
        }
        m.appendTail(sb);
        return sb.toString();
    }
}
