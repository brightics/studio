package com.samsung.sds.brightics.server.common.flowrunner;

import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;

final class ModelRunnerFactory {

    private ModelRunnerFactory() {
        // nothing to do
    }

    public static IModelRunner create(String pid, JsonObject model) {
        switch (model.get("type").getAsString()) {
            case "data":
            case "etl":
            case "script":
                return new WorkflowModelRunner(model, pid);
            default:
                throw new BrighticsCoreException("3105");
        }
    }
}
