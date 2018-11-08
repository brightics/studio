package com.samsung.sds.brightics.agent.service.task;

import java.util.Objects;

import org.apache.commons.lang3.ArrayUtils;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.agent.util.DataAttribute;
import com.samsung.sds.brightics.common.core.util.FunctionVersion;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.core.util.JsonUtil.JsonParam;
import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage;

public class TaskMessageWrapper {

    public final ExecuteTaskMessage taskMessage;
    public final JsonParam params;
    public final JsonParam attrs;
    public final String mid;
    public final boolean persist;
    public final FunctionVersion version;

    public TaskMessageWrapper(ExecuteTaskMessage taskMessage) {
        this.taskMessage = taskMessage;
        this.params = JsonUtil.jsonToParam(taskMessage.getParameters());
        this.attrs = JsonUtil.jsonToParam(taskMessage.getAttributes());
        this.mid = attrs.getOrException("mid");
        this.persist = attrs.getOrDefault("persist", true);
        this.version = FunctionVersion.getVersion(attrs.getOrDefault("version", "3"));
    }

    private static String[] toStringArray(JsonArray jsonArray) {
        String[] result = new String[jsonArray.size()];
        for (int i = 0; i < jsonArray.size(); i++) {
            result[i] = jsonArray.get(i).getAsString();
        }
        return result;
    }

    public String[] getInData() {
        try {
            JsonArray data = Objects.requireNonNull(attrs.internalData.get("inData")).getAsJsonArray();
            return toStringArray(data);
        } catch (Exception e) {
            return ArrayUtils.EMPTY_STRING_ARRAY;
        }
    }

    public String[] getOutData() {
        try {
            JsonArray data = Objects.requireNonNull(attrs.internalData.get("outData")).getAsJsonArray();
            return toStringArray(data);
        } catch (Exception e) {
            return ArrayUtils.EMPTY_STRING_ARRAY;
        }
    }

    public String[] getOutDataAlias() {
        return getParamValueAsArray("out-table-alias");
    }

    public String[] getParamValueAsArray(String param) {
        try {
            JsonArray data = Objects.requireNonNull(params.internalData.get(param)).getAsJsonArray();
            return toStringArray(data);
        } catch (Exception e) {
            return ArrayUtils.EMPTY_STRING_ARRAY;
        }
    }

    public DataAttribute getInputs() {
        return getJsonObjectAsMap("inputs");
    }

    public DataAttribute getOutputs() {
        return getJsonObjectAsMap("outputs");
    }

    private DataAttribute getJsonObjectAsMap(String objectKey) {
        try {
            JsonObject data = Objects.requireNonNull(attrs.internalData.get(objectKey)).getAsJsonObject();
            return new DataAttribute(data);
        } catch (Exception e) {
            //noinspection unchecked
            return DataAttribute.EMPTY_MAP;
        }
    }
}
