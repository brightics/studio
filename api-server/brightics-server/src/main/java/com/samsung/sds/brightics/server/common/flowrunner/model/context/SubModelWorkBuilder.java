package com.samsung.sds.brightics.server.common.flowrunner.model.context;

import java.util.Map.Entry;

import org.apache.commons.lang3.StringUtils;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.legacy.provider.LegacyFunctionLabelProvider;
import com.samsung.sds.brightics.common.core.util.IdGenerator;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.variable.resolver.IVariableResolver;
import com.samsung.sds.brightics.common.variable.resolver.impl.DefaultVariableResolver;
import com.samsung.sds.brightics.common.workflow.context.WorkContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.model.Node;
import com.samsung.sds.brightics.common.workflow.model.Work;
import com.samsung.sds.brightics.server.common.flowrunner.IModelRunner;
import com.samsung.sds.brightics.server.common.flowrunner.WorkflowModelRunner;
import com.samsung.sds.brightics.server.common.flowrunner.model.data.InOutDataLinker;
import com.samsung.sds.brightics.server.common.flowrunner.status.JobContextHolder;
import com.samsung.sds.brightics.server.common.flowrunner.status.Status;
import com.samsung.sds.brightics.server.common.flowrunner.variable.ModelVariableInitializer;
import com.samsung.sds.brightics.server.common.util.JsonObjectUtil;
import com.samsung.sds.brightics.server.common.util.LoggerUtil;
import com.samsung.sds.brightics.server.common.util.ValidationUtil;

class SubModelWorkBuilder {

    private final JsonObject function;
    private final String fid;
    private final String label;
    private final JsonObject param;
    private static final String PROP_VARIABLES = "variables";

    SubModelWorkBuilder(JsonObject function) {
        this.function = function;
        this.fid = JsonObjectUtil.getAsString(function, "fid");
        this.label = JsonObjectUtil.getAsString(function, "label");
        ValidationUtil.validateRequiredMember(function, "param");
        this.param = function.getAsJsonObject("param");
    }

    Node build() {
        StringBuilder sb = new StringBuilder(getFlowParam("mid"));
        if (param.has("versionId")) {
            sb.append("_").append(getFlowParam("versionId"));
        }
        String mid = sb.toString();

        return new Work(fid, new ParametersBuilder().build()) {
            private InOutDataLinker dataLinker;

            @Override
            public void start(WorkContext context) {
                LoggerUtil.pushMDC("fid", name);
                try {
                    IModelRunner modelRunner = JobContextHolder.getJobRunner().getOrCreateModelRunner(mid, mid);
                    VariableContext variableContext = context.getVariableContext();
                    IVariableResolver variableResolver = new DefaultVariableResolver(variableContext);

                    if (modelRunner instanceof WorkflowModelRunner) {
                        init((WorkflowModelRunner) modelRunner, variableContext, variableResolver);
                    }

                    JobContextHolder.getJobStatusTracker().startSubFlow(this.name, label, "Flow");
                    if (dataLinker != null) {
                        dataLinker.linkInData();
                    }

                    modelRunner.run(variableContext);

                    if (dataLinker != null) {
                        dataLinker.linkOutData();
                    }
                    JobContextHolder.getJobStatusTracker().endSubFlow(this.name, Status.SUCCESS);
                } catch (Exception e) {
                    JobContextHolder.getJobStatusTracker().endSubFlow(this.name, Status.FAIL);
                    if (e instanceof AbsBrighticsException) {
                        throw e;
                    } else {
                        throw new BrighticsCoreException("3102", "Error in " + label).initCause(e);
                    }
                } finally {
                    LoggerUtil.popMDC("fid");
                }
            }

            private void init(WorkflowModelRunner modelRunner, VariableContext variableContext, IVariableResolver variableResolver) {
                if (param.has(PROP_VARIABLES)) {
                    // create temp scope
                    String scopeName = IdGenerator.getSimpleId();
                    variableContext.createScope(scopeName);

                    // resolve flow variables to temp scope
                    ModelVariableInitializer variableInitializer = new ModelVariableInitializer(param.getAsJsonObject(PROP_VARIABLES));
                    variableInitializer.setVariablesTo(variableContext);

                    // override sub-flow's variables
                    JsonObject model = modelRunner.getModel();
                    for (Entry<String, JsonElement> entry : param.getAsJsonObject(PROP_VARIABLES).entrySet()) {
                        JsonObject variable = new JsonObject();
                        variable.add("value", variableResolver.resolve(new JsonPrimitive(String.format("${=%s}", entry.getKey()))));
                        model.getAsJsonObject(PROP_VARIABLES).add(entry.getKey(), variable);
                    }

                    // clean up temp scope
                    variableContext.removeScope(scopeName);
                }
                dataLinker = new InOutDataLinker(function, modelRunner.getModel(), true);
            }
        };
    }

    private void validateVersionId() {
        if (!param.has("versionId")) {
            return;
        }
        getFlowParam("versionId");
    }

    private String getFlowParam(String name) {
        try {
            String result = JsonObjectUtil.getAsString(param, name);
            if (StringUtils.isEmpty(result)) {
                throw new BrighticsCoreException("3109", name);
            }
            return result;
        } catch (AbsBrighticsException e) {
            if ("3109".equals(e.code)) {
                throw new BrighticsCoreException("3109", LegacyFunctionLabelProvider.getFunctionLabel("Flow", name));
            }
            throw e;
        }
    }
}
