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

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonPrimitive;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.workflow.context.WorkflowContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import com.samsung.sds.brightics.common.workflow.model.impl.loop.LoopStatus;

public abstract class WhileLoopWorkflow extends LoopWorkflow {

    protected static final Logger LOGGER = LoggerFactory.getLogger(WhileLoopWorkflow.class);

    public WhileLoopWorkflow(String name, Parameters parameters) {
        super(name, parameters);
        validateRequiredParameter(PARAMS_EXPRESSION);
    }

    @Override
    public void start(WorkflowContext context) {
        LoopStatus loopStatus = new LoopStatus(0, null);
        loopStatus.setCount(1);
        loopStatus.setIndexVariable(resolvedParameters.getString(PARAMS_INDEX_VARIABLE));

        int idx = 0;
        setIndexVariable(context.getVariableContext(), loopStatus);
        log(LogPosition.BEFORE_BODY);
        while (evaluateCondition(context)) {
            if (Thread.currentThread().isInterrupted()) {
                Thread.currentThread().interrupt();
                throw new BrighticsCoreException("3101");
            }
            if (idx + 1 > LoopWorkflow.loopLimit) {
                throw new BrighticsCoreException("3102", "Loop count exceeds " + LoopWorkflow.loopLimit);
            }
            logLoopStatus(LogPosition.BEFORE_BODY, loopStatus);
            runBody(context);
            logLoopStatus(LogPosition.AFTER_BODY, loopStatus);

            loopStatus.setIndex(++idx);
            loopStatus.setCount(loopStatus.getIndex() + 1);

            if (StringUtils.isNotEmpty(loopStatus.getIndexVariable())) {
                setIndexVariable(context.getVariableContext(), loopStatus);
            }
        }
        log(LogPosition.AFTER_BODY);
    }

    private void setIndexVariable(VariableContext vc, LoopStatus loopStatus) {
        if (StringUtils.isNotEmpty(loopStatus.getIndexVariable())) {
            vc.execute(getVariableExpression(loopStatus.getIndexVariable(), new JsonPrimitive(loopStatus.getIndex())));
        }
    }

    private boolean evaluateCondition(WorkflowContext context) {
        resolveParameters(context.getParameterHandler());
        return context.getVariableContext().evaluateConditionalExpression(resolvedParameters.getParam(PARAMS_EXPRESSION).toString());
    }
}
