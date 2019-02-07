package com.samsung.sds.brightics.common.core.util;

import com.google.gson.JsonObject;


public class JsonObjectUtil {
    /**
     * Returns <code>name</code> as string from <code>json</code>. BrighticsCoreException will be thrown when <name>name</name> is missing.
     * @param json JSON json
     * @param name member name
     */
    public static String getAsString(JsonObject json, String name) {
        ValidationUtil.validateRequiredMember(json, name);
        return json.get(name).getAsString();
    }

    /**
     * Returns <code>name</code> as integer from <code>json</code>. BrighticsCoreException will be thrown when <name>name</name> is missing.
     * @param json JSON json
     * @param name member name
     */
    public static Integer getAsInt(JsonObject json, String name) {
        ValidationUtil.validateRequiredMember(json, name);
        return json.get(name).getAsInt();
    }
}
