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

package com.samsung.sds.brightics.server.common.flowrunner.model.context;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.model.Node;
import com.samsung.sds.brightics.common.workflow.model.Workflow;
import com.samsung.sds.brightics.common.workflow.model.impl.SequentialWorkflow;
import com.samsung.sds.brightics.server.common.flowrunner.model.impl.FunctionWork;
import com.samsung.sds.brightics.server.common.flowrunner.model.impl.SetValueFunction;
import com.samsung.sds.brightics.server.common.util.JsonObjectUtil;
import java.util.LinkedList;

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
