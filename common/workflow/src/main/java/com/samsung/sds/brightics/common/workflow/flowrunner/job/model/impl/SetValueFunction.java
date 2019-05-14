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

package com.samsung.sds.brightics.common.workflow.flowrunner.job.model.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.util.JsonObjectUtil;
import com.samsung.sds.brightics.common.core.util.LoggerUtil;
import com.samsung.sds.brightics.common.variable.Variable;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.variable.resolver.IVariableResolver;
import com.samsung.sds.brightics.common.variable.resolver.impl.DefaultVariableResolver;
import com.samsung.sds.brightics.common.workflow.context.WorkContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.model.Work;
import com.samsung.sds.brightics.common.workflow.flowrunner.holder.JobContextHolder;
import com.samsung.sds.brightics.common.workflow.flowrunner.status.JobStatusTracker;
import com.samsung.sds.brightics.common.workflow.flowrunner.status.Status;

public class SetValueFunction extends Work {

    private static final Logger LOGGER = LoggerFactory.getLogger(SetValueFunction.class);
    private final JsonObject functionInfo;
    private final String label;
    private final String functionName;
    private final JsonArray variables;


    public SetValueFunction(JsonObject functionInfo) {
        super(JsonObjectUtil.getAsString(functionInfo, "fid"), new ParametersBuilder().build());
        this.functionInfo = functionInfo;
        this.label = JsonObjectUtil.getAsString(functionInfo, "label");
        this.functionName = JsonObjectUtil.getAsString(functionInfo, "name");
        this.variables = functionInfo.getAsJsonObject("param").getAsJsonArray("variables");
    }

    @Override
    public void start(WorkContext context) {
        JobStatusTracker tracker = JobContextHolder.getJobStatusTracker();

        try {
            LoggerUtil.pushMDC("fid", name);

            LOGGER.info("[FUNCTION START] [{}] {}", label, functionInfo);
            tracker.startFunction(this.name, label, functionName);

            setValues(tracker.getCurrentModelMid(false), context.getVariableContext());

            tracker.endFunctionWith(Status.SUCCESS);
            LOGGER.info("[FUNCTION SUCCESS] [{}]", label);
        } catch (AbsBrighticsException e) {
            tracker.endFunctionWith(Status.FAIL);
            LOGGER.error("[FUNCTION ERROR] [{}]", label);
            throw e;
        } finally {
            LoggerUtil.popMDC("fid");
        }
    }

    private void setValues(String scope, VariableContext context) {
        IVariableResolver resolver = new DefaultVariableResolver(context);
        LOGGER.info("[SET VALUE] set values on scope[{}]", scope);
        for (JsonElement elem : variables) {
            Variable variable = getVariable(elem.getAsJsonObject());
            JsonElement resolvedValue = resolver.resolve(variable.getValue());
            variable.setValue(resolvedValue);

            context.setVariable(scope, variable);
            String name = JsonObjectUtil.getAsString(elem.getAsJsonObject(), "name");

            LOGGER.info("[SET VALUE] resolved value for \"{}\" is \"{}\"", name, context.getValue(name));
        }
    }

    private Variable getVariable(JsonObject variable) {
        String mode = JsonObjectUtil.getAsString(variable.getAsJsonObject(), "mode");
        if ("value".equals(mode)) {
            return getValueVariable(variable);
        } else if ("cell".equals(mode)) {
            return getCellVariable(variable);
        } else {
            throw new BrighticsCoreException("3102", "Unsupported SetValue mode : " + mode);
        }
    }

    private Variable getValueVariable(JsonObject variable) {
        return new Variable(JsonObjectUtil.getAsString(variable, "name"), variable.getAsJsonObject("param").get("value"));
    }

    private Variable getCellVariable(JsonObject variable) {
        JsonObject param = variable.getAsJsonObject("param");
        String inData = JsonObjectUtil.getAsString(param, "inData");
        String column = JsonObjectUtil.getAsString(param, "column");
        Integer rowIndex = JsonObjectUtil.getAsInt(param, "rowIndex");

        return new Variable(JsonObjectUtil.getAsString(variable,"name"), new JsonPrimitive(String.format("${=getCellValue('%s', '%s', %d)}", inData, column, rowIndex)));
    }
}
