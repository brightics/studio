package com.samsung.sds.brightics.common.variable.resolver;

import com.google.gson.JsonElement;

public interface IVariableResolver {
    public JsonElement resolve(JsonElement jsonElement);
}
