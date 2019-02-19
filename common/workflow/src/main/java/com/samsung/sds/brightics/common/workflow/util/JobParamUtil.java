package com.samsung.sds.brightics.common.workflow.util;

import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
//import com.samsung.sds.brightics.common.jsonconverter.JsonConverterContext;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobParam;

public class JobParamUtil {

    private static final String ACTIVE_VERSION = "3.6";

    public static boolean supports(JobParam jobParam) {
        return jobParam != null && ACTIVE_VERSION.equals(jobParam.getVersion());
    }
    
    public static JobParam convert(JobParam jobParam) {

    	//Remove studio version.
//        if (!supports(jobParam)) {
//            try {
//                JsonConverterContext context = new JsonConverterContext(JsonUtil.toJson(jobParam));
//                //If convert job param object. should use jackson json converter.
//                JobParam result = new ObjectMapper().readValue(context.getJsonString(), JobParam.class);
//                result.setConverted(true);
//                return result;
//            } catch (Exception e) {
//                throw new BrighticsCoreException("3102", "Failed to convert json.").initCause(e);
//            }
//        }
        return jobParam;
    }

    public static boolean isConverted(JobParam oldJobParam, JobParam newJobParam) {
        return !JobParamUtil.supports(oldJobParam) && newJobParam.isConverted();
    }

    public static void overrideVariables(JobParam jobParam, JsonObject variables) {
        if (variables == null || variables.size() < 1) {
            return;
        }

        Map<String, Object> main = jobParam.getModels().get(jobParam.getMain());
        if (!main.containsKey("variables")) {
            main.put("variables", new JsonObject());
        }

        JsonObject mainVariables = JsonUtil.toJsonObject(main.get("variables"));
        for (Entry<String, JsonElement> variable : variables.entrySet()) {
            String name = variable.getKey().replace("^\\${", "").replace("}$", "").replaceAll("[-]", "");
            if (mainVariables.has(name)) {
                mainVariables.getAsJsonObject(name).add("value", convertValue(variable.getValue()));
            }
        }
        main.put("variables", mainVariables);
    }

    private static JsonElement convertValue(JsonElement value) {
        if (value.isJsonPrimitive()) {
            return value.getAsJsonPrimitive().isString() ? new JsonPrimitive(convertValue(value.getAsString())) : value;
        } else if (value.isJsonArray()) {
            JsonArray result = new JsonArray();
            for (JsonElement element : value.getAsJsonArray()) {
                result.add(convertValue(element));
            }
            return result;
        } else if (value.isJsonObject()) {
            JsonObject result = new JsonObject();
            for (Entry<String, JsonElement> entry : value.getAsJsonObject().entrySet()) {
                result.add(entry.getKey(), convertValue(entry.getValue()));
            }
        } else if (value.isJsonNull()) {
            return JsonNull.INSTANCE;
        }
        throw new IllegalArgumentException("{} is not supported json type");
    }

    private static final Pattern OLD_EXPR = Pattern.compile("\\$\\{([^}]+)}");

    private static String convertValue(String value) {
        Matcher m = OLD_EXPR.matcher(value);
        StringBuffer sb = new StringBuffer();
        while (m.find()) {
            String target = m.group(1);
            sb.append("${=").append(target.replaceAll("[-]", "")).append("}");
        }
        m.appendTail(sb);
        return sb.toString();
    }
}
