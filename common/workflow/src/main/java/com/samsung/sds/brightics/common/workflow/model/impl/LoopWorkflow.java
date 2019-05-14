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

import com.google.gson.JsonElement;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.common.workflow.context.WorkflowContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import com.samsung.sds.brightics.common.workflow.model.impl.loop.LoopStatus;

public abstract class LoopWorkflow extends SequentialWorkflow {

    public static final String PARAMS_TYPE = "type";
    public static final String PARAMS_START = "start";
    public static final String PARAMS_END = "end";
    public static final String PARAMS_INDEX_VARIABLE = "index-variable";
    public static final String PARAMS_COLLECTION = "collection";
    public static final String PARAMS_ELEMENT_VARIABLE = "element-variable";
    public static final String PARAMS_EXPRESSION = "expression";
    protected static Integer loopLimit = SystemEnvUtil.LOOP_LIMIT;

    LoopWorkflow(String name, Parameters parameters) {
        super(name, parameters);
        setNewVariableScope(true);
    }

    void runBody(WorkflowContext context) {
        super.start(context);
    }

    String getVariableExpression(String name, JsonElement value) {
        return "var " + name + " = " + name + " || 0;" + name + " = " + value.toString();
    }

    protected abstract void logLoopStatus(LogPosition pos, LoopStatus status);

    /**
     * Override this method to log at the beginning and ending of loop
     *
     * @param pos logging position
     */
    protected void log(LogPosition pos) {
        // nothing to log
    }

    protected void validateRequiredParameter(String name) {
        if (!originalParameters.contains(name)) {
            throw new BrighticsCoreException("3102", "Required parameter '" + name + "' is missing in " + this.getClass().getSimpleName());
        }
    }

    public static void setLoopLimit(Integer loopLimit) {
        LoopWorkflow.loopLimit = loopLimit;
    }
}
