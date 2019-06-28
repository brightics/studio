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

package com.samsung.sds.brightics.common.workflow.model.impl;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.variable.resolver.ExpressionPattern;
import com.samsung.sds.brightics.common.workflow.context.WorkContext;
import com.samsung.sds.brightics.common.workflow.context.WorkflowContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import com.samsung.sds.brightics.common.workflow.model.Node;
import com.samsung.sds.brightics.common.workflow.model.Work;
import com.samsung.sds.brightics.common.workflow.model.Workflow;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class ConditionalWorkflow extends Workflow {

    protected static final Logger LOGGER = LoggerFactory.getLogger(ConditionalWorkflow.class);
    public static final String PARAM_CONDITIONS = "conditions";

    protected ConditionalWorkflow(String name, Parameters parameters) {
        super(name, parameters);
        if (!parameters.contains(PARAM_CONDITIONS) || !parameters.getParam(PARAM_CONDITIONS).isJsonArray()) {
            throw new BrighticsCoreException("3102", "Invalid conditions parameter.");
        }

        for (JsonElement condition : parameters.getParam(PARAM_CONDITIONS).getAsJsonArray()) {
            if (!(condition.isJsonPrimitive() && ExpressionPattern.isExpressionOnly(condition))) {
                throw new BrighticsCoreException("3102", "Invalid conditions parameter(" + condition + ")");
            }
        }
    }

    @Override
    public void start(WorkflowContext context) {
        List<Boolean> conditions = getConditions(context.getVariableContext());
        if (conditions.size() != nodes.size()) {
            throw new BrighticsCoreException("3102", "size of conditions and nodes should be same.");
        }

        for (int idx = 0; idx < conditions.size(); idx++) {
            if (conditions.get(idx)) {
                log(LogPosition.BEFORE_BODY, idx);
                Node head = nodes.get(idx);
                if (head instanceof Work) {
                    new WorkContext(context, (Work) head).run();
                } else if (head instanceof Workflow) {
                    context.createChildWorkflowContext((Workflow) head).run();
                }
                log(LogPosition.AFTER_BODY, idx);
                break;
            }
        }
    }

    private List<Boolean> getConditions(VariableContext vc) {
        List<Boolean> result = new ArrayList<>();

        JsonArray conditions = resolvedParameters.getParam(PARAM_CONDITIONS).getAsJsonArray();
        for (JsonElement condition : conditions) {
            result.add(vc.evaluateConditionalExpression(condition.getAsString()));
        }
        return result;
    }

    /**
     * Override this method to log beginning and ending of conditional body
     *
     * @param pos logging position
     * @param selectedConditionIdx condition index evaluated true
     */
    protected void log(LogPosition pos, int selectedConditionIdx) {
        // nothing to log
    }
}
