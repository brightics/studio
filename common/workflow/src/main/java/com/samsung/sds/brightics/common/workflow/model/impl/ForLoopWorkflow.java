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

import java.util.Iterator;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonArray;
import com.google.gson.JsonPrimitive;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.workflow.context.WorkflowContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import com.samsung.sds.brightics.common.workflow.model.impl.loop.LoopCondition;
import com.samsung.sds.brightics.common.workflow.model.impl.loop.LoopStatus;
import com.samsung.sds.brightics.common.workflow.model.impl.loop.LoopType;

public abstract class ForLoopWorkflow extends LoopWorkflow {

    protected static final Logger LOGGER = LoggerFactory.getLogger(ForLoopWorkflow.class);

    public ForLoopWorkflow(String name, Parameters parameters) {
        super(name, parameters);

        // validate required parameters
        validateRequiredParameter(PARAMS_TYPE);
        LoopType loopType = LoopType.getLoopType(parameters.getString(PARAMS_TYPE));
        if (loopType == LoopType.COUNT) {
            validateRequiredParameter(PARAMS_START);
            validateRequiredParameter(PARAMS_END);
        } else if (loopType == LoopType.COLLECTION) {
            validateRequiredParameter(PARAMS_COLLECTION);
        }
    }

    @Override
    public void start(WorkflowContext context) {
        Iterator<LoopStatus> iterator = getCondition().iterator();
        VariableContext variableContext = context.getVariableContext();
        log(LogPosition.BEFORE_BODY);
        while (iterator.hasNext()) {
            if (Thread.currentThread().isInterrupted()) {
                Thread.currentThread().interrupt();
                throw new BrighticsCoreException("3101");
            }

            LoopStatus status = iterator.next();
            if (StringUtils.isNotEmpty(status.getIndexVariable())) {
                variableContext.execute(getVariableExpression(status.getIndexVariable(), new JsonPrimitive(status.getIndex())));
            }
            if (StringUtils.isNotEmpty(status.getElementVariable())) {
                variableContext.execute(getVariableExpression(status.getElementVariable(), status.getElement()));
            }
            if (status.getCount() > LoopWorkflow.loopLimit) {
                throw new BrighticsCoreException("3102", "Loop count exceeds " + LoopWorkflow.loopLimit);
            }

            logLoopStatus(LogPosition.BEFORE_BODY, status);
            runBody(context);
            logLoopStatus(LogPosition.AFTER_BODY, status);
        }
        log(LogPosition.AFTER_BODY);
    }

    private LoopCondition getCondition() {
        // TODO number format exception 처리
        LoopType loopType = LoopType.getLoopType(resolvedParameters.getString(PARAMS_TYPE));
        if (loopType == LoopType.COUNT) {
            return LoopCondition.getCountLoopCondition(
                    getParameterAsInteger(PARAMS_START),
                    getParameterAsInteger(PARAMS_END),
                    resolvedParameters.getString(PARAMS_INDEX_VARIABLE));
        } else if (loopType == LoopType.COLLECTION) {
            // validate collection type
            return LoopCondition.getCollectionLoopCondition(
                    getParameterAsJsonArray(PARAMS_COLLECTION),
                    resolvedParameters.getString(PARAMS_INDEX_VARIABLE),
                    resolvedParameters.getString(PARAMS_ELEMENT_VARIABLE));
        }
        throw new BrighticsCoreException("3102", "Invalid loop type");
    }

    private Integer getParameterAsInteger(String name) {
        try {
            return resolvedParameters.getNumber(name).intValue();
        } catch (NumberFormatException e) {
            throw new BrighticsCoreException("3102", name + " is not valid integer.");
        }
    }

    private JsonArray getParameterAsJsonArray(String name) {
        JsonArray result = resolvedParameters.getParamAs(name, JsonArray.class);
        if (result == null) {
            throw new BrighticsCoreException("3102", name + " is not array.");
        }
        return result;
    }
}
