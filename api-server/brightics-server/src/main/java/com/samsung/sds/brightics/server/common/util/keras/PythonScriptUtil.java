package com.samsung.sds.brightics.server.common.util.keras;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.server.common.util.keras.model.KerasParameterConstant;
import com.samsung.sds.brightics.server.common.util.keras.model.KerasParameters;
import org.apache.commons.collections.ListUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
import java.util.List;
import java.util.StringJoiner;

public class PythonScriptUtil {

    @SuppressWarnings("unchecked")
    public static String makePythonArgumentsString(List<KerasParameters> requiredParams, List<KerasParameters> optionalParams, JsonObject args) throws Exception {
        StringJoiner argsJoiner = new StringJoiner(", ");

        for (KerasParameters required : requiredParams) {
            JsonElement param = args.get(required.getName());
            if (isJsonElementBlank(param)) {
                throw new BrighticsCoreException("3109", paramNameCapitalize(required.getName()));
            }

            argsJoiner.add(makePythonAssignScript(required, param));
        }

        optionalParams = ListUtils.sum(optionalParams, Arrays.asList(KerasParameterConstant.INPUT_SHAPE, KerasParameterConstant.NAME)); // default optional parameters

        for (KerasParameters optional : optionalParams) {
            JsonElement param = args.get(optional.getName());
            if (isJsonElementBlank(param)) {
                continue;
            }

            argsJoiner.add(makePythonAssignScript(optional, param));
        }

        return argsJoiner.toString();
    }

    private static String makePythonAssignScript(KerasParameters parameter, JsonElement value) throws Exception {
        try {
            return parameter.getName() + "=" + parameter.getType().script(value);
        } catch (Exception e) {
            throw new Exception(String.format(e.getMessage(), paramNameCapitalize(parameter.getName())));
        }
    }

    public static boolean isJsonElementBlank(JsonElement value) {
        if (value == null) {
            return true;
        }

        if (value instanceof JsonArray) {
            JsonArray jsonArray = (JsonArray) value;

            if (jsonArray.size() == 0) {
                return true;
            }

            boolean isAllElementsBlank = true;
            for (JsonElement element : jsonArray) {
                isAllElementsBlank &= (element.isJsonNull() || isJsonElementBlank(element));
            }

            return isAllElementsBlank;
        } else if (value instanceof JsonObject) {
            return ((JsonObject) value).size() == 0;
        } else if (value instanceof JsonPrimitive) {
            return StringUtils.isBlank(value.getAsString());
        }

        return true; // JsonNull
    }

    public static String paramNameCapitalize(String paramName) {
        StringJoiner newParamName = new StringJoiner(" ");

        String[] paramNames = paramName.split("_");
        for (String name : paramNames) {
            newParamName.add(StringUtils.capitalize(name));
        }

        return newParamName.toString();
    }
}