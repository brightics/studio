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

package com.samsung.sds.brightics.agent.context.python;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.agent.context.ContextManager;
import com.samsung.sds.brightics.agent.service.task.TaskMessageWrapper;
import com.samsung.sds.brightics.agent.util.DataAttribute;
import com.samsung.sds.brightics.agent.util.DataKeyUtil;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.data.DataStatus;
import com.samsung.sds.brightics.common.network.proto.ContextType;
import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
import java.util.Collection;
import java.util.Map.Entry;
import java.util.StringJoiner;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class PythonScriptBuilder {

    private static final String SCRIPT_DELIM = "\n";

    private StringJoiner script = new StringJoiner(SCRIPT_DELIM);
    private TaskMessageWrapper message;

    public PythonScriptBuilder(TaskMessageWrapper message) {
        this.message = message;
    }

    public String script() {
        return script.toString();
    }

    PythonScriptBuilder addScript() {
        script.add(getScript((message.params.internalData)));
        return this;
    }

    private String getScript(JsonObject param) {
        if (!param.has("script")) {
            throw new BrighticsCoreException("3109", "'Script'");
        }

        JsonElement script = param.get("script");
        if (script.isJsonPrimitive()) {
            return script.getAsJsonPrimitive().getAsString();
        } else if (script.isJsonObject()) {
            return getScript(script.getAsJsonObject());
        }

        return StringUtils.EMPTY;
    }

    PythonScriptBuilder addInDataScript() {
        String[] inDatas = message.getInData();

        script.add(Arrays.stream(inDatas).
                map(this::makeDataLoadScript).
                collect(Collectors.joining(", ", "inputs = [", "]")));

        return this;
    }

    PythonScriptBuilder addInputsScript() {
        DataAttribute inputs = message.getInputs();

        for (Entry<String, Collection<String>> entry : inputs.entrySetAsIterableValue()) {
            script.add(entry.getValue().stream().
                    map(this::makeDataLoadScript).
                    collect(Collectors.joining(", ", String.format("%s = [", entry.getKey()), "]")));
        }

        return this;
    }

    PythonScriptBuilder addInputsUDFScript() {
        DataAttribute inputs = message.getInputs();

        for (Entry<String, Collection<String>> entry : inputs.entrySetAsIterableValue()) {
            script.add(entry.getValue().stream().
                    map(this::makeDataLoadScript).
                    collect(Collectors.joining(", ", String.format("%s = ", entry.getKey()), " ")));
        }

        return this;
    }

    PythonScriptBuilder addOutDataScript() {
        String[] outDatas = message.getOutData();

        script.add(Arrays.stream(outDatas).
                map(out -> String.format("'%s'", getDataKey(out))).
                collect(Collectors.joining(", ", "outputs = [", "]")));

        return this;
    }

    PythonScriptBuilder addFunctionScript(String functionName, String functionVariableName) {
        String[] names = functionName.split("\\$");
        if (names.length != 2 || StringUtils.isAnyBlank(names)) {
            throw new BrighticsCoreException("3102", "Invalid PyFunction name");
        }
        script.add(String.format("from %s import %s", names[0], names[1]));
        script.add(String.format("check_required_parameters(%s, params)", names[1]));
        script.add(String.format("%s = %s(**params)", functionVariableName, names[1]));
        return this;
    }

    PythonScriptBuilder addFunctionParamsScript() {
        script.add(makeInputsDictScript("inputs"));
        script.add(makePureParamsDictScript("params"));
        script.add("params.update(inputs)");

        return this;
    }

    private String makeInputsDictScript(String inputsVariableName) {
        DataAttribute inputs = message.getInputs();
        return inputs.entrySet().stream().
                map(e -> String.format("'%s': %s", e.getKey(), makeDataLoadScript(e.getValue()))).
                collect(Collectors.joining(", ", inputsVariableName + " = {", "}"));
    }

    private String makePureParamsDictScript(String paramsVariableName) {
        JsonObject pureParams = getPureParams();

        String dictScript = pureParams.entrySet().stream()
                .map(e -> String.format("r\"\"\"%s\"\"\": %s", e.getKey(), makeVariablePythonString(e.getValue())))
                .collect(Collectors.joining(", ", "{", "}"));

        return String.format("%s = %s", paramsVariableName, dictScript);
    }

    private String makeDataLoadScript(Object value) {
        if (value instanceof String[]) {
            return Stream.of((String[]) value).map(this::makeDataLoadScript).collect(Collectors.joining(", ", "[", "]"));
        } else {
            return makeDataLoadScript(value.toString());
        }
    }

    private String makeDataLoadScript(String tid) {
        DataStatus dataStatus = ContextManager.getDataStatusAsKey(DataKeyUtil.createDataKey(message.mid, tid));
        if (dataStatus == null) {
            throw new BrighticsCoreException("3002", "input data");
        }

        if (dataStatus.contextType == ContextType.KV_STORE) {
            return String.format("read_redis('%s')", dataStatus.key);
        } else if (dataStatus.contextType == ContextType.FILESYSTEM) {
            return String.format("read_parquet('%s')", dataStatus.path);
        } else {
            return String.format("get_data('%s')", dataStatus.key);
        }
    }

    PythonScriptBuilder addPutFunctionResultScript(String resultVariableName) {
        String label = message.attrs.getOrDefault("label", "Empty Label");
        for (Entry<String, Object> e : message.getOutputs().entrySet()) {
            if (e.getValue() instanceof String) {
                String dataKey = getDataKey((String) e.getValue());
                script.add(String.format("put_data('%s', %s['%s'], r\"\"\"%s\"\"\")", dataKey, resultVariableName, e.getKey(), label));
            } else if (e.getValue() instanceof String[]) {
                int idx = 0;
                for (String key : (String[]) e.getValue()) {
                    String dataKey = getDataKey(key);
                    script.add(String.format("put_data('%s', %s['%s'][%d], r\"\"\"%s\"\"\")", dataKey, resultVariableName, e.getKey(), idx++, label));
                }
            }
        }

        return this;
    }

    PythonScriptBuilder addWriteOutputsScript() {
        boolean persist = message.attrs.getOrDefault("persist", true);

        if (persist) {
            for (String key : message.getOutputs().flatValues()) {
                script.add(makeWriteDataScript(key));
            }
        }

        return this;
    }

    PythonScriptBuilder addPutOutTableAliasDataScript() {
        String[] outData = message.getOutData();
        String[] outDataAlias = message.getOutDataAlias();

        if (outDataAlias.length == 0) {
            throw new BrighticsCoreException("3109", "'Out Table Alias'");
        }
        if (outData.length != outDataAlias.length) {
            throw new BrighticsCoreException("4322");
        }

        String label = message.attrs.getOrDefault("label", "Script Label");
        for (int i = 0; i < outData.length; i++) {
            script.add(String.format("put_data('%s', %s, r\"\"\"%s\"\"\")", getDataKey(outData[i]), outDataAlias[i], label));
        }

        return this;
    }

    PythonScriptBuilder addPutScriptResultScript() {
        String label = message.attrs.getOrDefault("label", "Script Label");
        message.getOutputs().entrySetAsStringValue()
                .forEach(entry -> script.add(String.format("put_data('%s', %s, r\"\"\"%s\"\"\")", getDataKey(entry.getValue()), entry.getKey(), label)));
        return this;
    }

    PythonScriptBuilder addPutOutputsScript() {
        String label = message.attrs.getOrDefault("label", "Script Label");
        message.getOutputs().entrySetAsIterableValue()
                .forEach(entry -> {
                    for (String outData : entry.getValue()) {
                        script.add(String.format("put_data('%s', %s, r\"\"\"%s\"\"\")", getDataKey(outData), entry.getKey(), label));
                    }
                });

        return this;
    }

    PythonScriptBuilder addWriteOutDataScript() {
        boolean persist = message.attrs.getOrDefault("persist", true);

        if (persist) {
            String[] outData = message.getOutData();

            Arrays.stream(outData).forEach(out -> script.add(makeWriteDataScript(out)));
        }

        return this;
    }

    private String makeWriteDataScript(String key) {
        String dataKey = getDataKey(key);
        return makeWriteDataScript(dataKey, DataKeyUtil.getAbsolutePathByDataKey(dataKey));
    }

    public static String makeWriteDataScript(String key, String path) {
        return String.format("write_data('%s', '%s')", key, path);
    }

    private String getDataKey(String tid) {
        return ContextManager.getCurrentUserContextSession().getLink(DataKeyUtil.createDataKey(message.mid, tid));
    }

    PythonScriptBuilder addInputVariablesScript() {
        JsonArray inputVariables = message.params.getOrDefault("input-variables", new JsonArray());

        for (JsonElement elem : inputVariables) {
            JsonArray elemArray = elem.getAsJsonArray();
            String name = elemArray.get(0).getAsString();
            String type = elemArray.get(1).getAsString();
            String value = elemArray.get(2).getAsString();

            script.add(String.format("%s = %s", name, makeVariablePythonString(type, value)));
        }

        return this;
    }

    PythonScriptBuilder addParameters() {
        JsonObject pureParams = getPureParams();

        pureParams.entrySet()
                .forEach(e -> script.add(String.format("%s = %s", e.getKey(), makeVariablePythonString(e.getValue()))));

        return this;
    }

    private JsonObject getPureParams() {
        return message.params.newJsonObjectExcept("input-variables", "output-variables", "in-table-alias", "out-table-alias", "df-names", "script");
    }

    private String makeVariablePythonString(JsonElement value) {
        if (value.isJsonPrimitive()) {
            if (value.getAsJsonPrimitive().isNumber()) {
                return makeVariablePythonString("number", value.getAsString());
            } else if (value.getAsJsonPrimitive().isBoolean()) {
                return makeVariablePythonString("bool", value.getAsString());
            } else {
                return makeVariablePythonString("string", value.getAsString());
            }
        } else if (value.isJsonArray()) {
            StringBuffer arrScript = new StringBuffer();
            arrScript.append("[");
            for (JsonElement e : value.getAsJsonArray()) {
                arrScript.append(makeVariablePythonString(e));
                arrScript.append(", "); // python can take last redundant comma ex) arr = [1, 2, ] => arr = [1, 2]
            }
            arrScript.append("]");
            return arrScript.toString();
        } else if (value.isJsonObject()) {
            return value.getAsJsonObject().entrySet().stream()
                    .map(e -> String.format("r\"\"\"%s\"\"\": %s", e.getKey(), makeVariablePythonString(e.getValue())))
                    .collect(Collectors.joining(", ", "{", "}"));
        }

        return "None"; // JsonNull and etc.
    }

    private String makeVariablePythonString(String type, String value) {
        if (StringUtils.isBlank(value)) {
            return "None";
        }

        switch (type) {
            case "string":
                return String.format("r\"\"\"%s\"\"\"", value);
            case "bool":
                return StringUtils.equalsIgnoreCase("true", value) ? "True" : "False";
            default:
                return String.format("%s", StringUtils.trim(value));
        }
    }
}
