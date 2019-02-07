package com.samsung.sds.brightics.common.workflow.runner.job.model.context;

import java.util.LinkedList;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.util.JsonObjectUtil;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.model.Node;
import com.samsung.sds.brightics.common.workflow.model.Workflow;
import com.samsung.sds.brightics.common.workflow.model.impl.SequentialWorkflow;
import com.samsung.sds.brightics.common.workflow.runner.job.model.impl.FunctionWork;
import com.samsung.sds.brightics.common.workflow.runner.job.model.impl.SetValueFunction;

class FunctionWorkBuilder {

    private final JsonObject functionInfo;
    private final LinkedList<FunctionWork> functionList = new LinkedList<>();

    FunctionWorkBuilder(JsonObject function) {
        this.functionInfo = function;
    }

    Node build() {
        if ("SetValue".equals(JsonObjectUtil.getAsString(functionInfo, "name"))) {
            return buildSetValueFunction();
        } else {
            return buildFunctionWork();
        }
    }

    private Node buildSetValueFunction() {
        return new SetValueFunction(functionInfo);
    }

    private Node buildFunctionWork() {
        processSubflow();
        Workflow result = new SequentialWorkflow(JsonObjectUtil.getAsString(functionInfo, "fid"),
            new ParametersBuilder().build());
        for (Node node : functionList) {
            result.addNode(node);
        }
        return result;
    }

    private void processSubflow() {
        if ("Subflow".equals(JsonObjectUtil.getAsString(functionInfo, "name"))) {
            JsonArray subFunctions = functionInfo.getAsJsonObject("param").getAsJsonArray("functions");
            subFunctions.forEach((JsonElement subFunction) -> {
                FunctionWork functionWork = new FunctionWork(subFunction.getAsJsonObject());
                if (!functionList.isEmpty()) {
                    functionList.peekLast().connect(functionWork);
                }
                functionList.add(functionWork);
            });
        } else {
            functionList.add(new FunctionWork(functionInfo));
        }
    }
}
