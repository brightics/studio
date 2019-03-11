package com.samsung.sds.brightics.common.workflow.flowrunner.job;

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
            case "deeplearning":
                return new DeeplearningflowModelRunner(model, pid);
            default:
                throw new BrighticsCoreException("3105");
        }
    }
}
