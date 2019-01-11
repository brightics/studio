package com.samsung.sds.brightics.server.common.flowrunner.model.context;

import java.util.Map.Entry;

import org.apache.commons.lang3.StringUtils;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.legacy.provider.LegacyFunctionLabelProvider;
import com.samsung.sds.brightics.common.variable.resolver.ExpressionPattern;
import com.samsung.sds.brightics.common.workflow.context.WorkflowContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.model.Node;
import com.samsung.sds.brightics.common.workflow.model.impl.EmptyWork;
import com.samsung.sds.brightics.common.workflow.model.impl.ForLoopWorkflow;
import com.samsung.sds.brightics.common.workflow.model.impl.LogPosition;
import com.samsung.sds.brightics.common.workflow.model.impl.LoopWorkflow;
import com.samsung.sds.brightics.common.workflow.model.impl.WhileLoopWorkflow;
import com.samsung.sds.brightics.common.workflow.model.impl.loop.LoopStatus;
import com.samsung.sds.brightics.server.common.flowrunner.model.data.InOutDataLinker;
import com.samsung.sds.brightics.server.common.flowrunner.status.JobContextHolder;
import com.samsung.sds.brightics.server.common.flowrunner.status.Status;
import com.samsung.sds.brightics.server.common.util.JsonObjectUtil;
import com.samsung.sds.brightics.server.common.util.LoggerUtil;
import com.samsung.sds.brightics.server.common.util.ValidationUtil;

public class LoopWorkflowBuilder {

    private final JsonObject function;
    private final JsonObject model;
    private final JsonObject param;
    private final String fid;
    private final String label;
    private final String functionName;

    LoopWorkflowBuilder(JsonObject function, JsonObject innerModels) {
        this.function = function;
        this.fid = JsonObjectUtil.getAsString(function, "fid");
        this.label = JsonObjectUtil.getAsString(function, "label");
        this.functionName = JsonObjectUtil.getAsString(function, "name");
        ValidationUtil.validateRequiredMember(function, "param");
        this.param = function.getAsJsonObject("param");

        String mid = JsonObjectUtil.getAsString(param, "mid");
        ValidationUtil.throwWhen(!innerModels.has(mid), "3102", "inner model(" + mid + ") is missing");
        this.model = innerModels.getAsJsonObject(mid).deepCopy();
        JsonObject innerModelsCopy = innerModels.deepCopy();
        innerModelsCopy.remove(mid);
        this.model.add("innerModels", innerModelsCopy);
    }

    public Node build() {
        if ("ForLoop".equals(functionName)) {
            return buildForLoop();
        } else if ("WhileLoop".equals(functionName)) {
            return buildWhileLoop();
        }
        throw new BrighticsCoreException("3102", "Invalid loop type");
    }

    private Node buildForLoop() {
        String type = JsonObjectUtil.getAsString(param, "type");

        if ("count".equals(type)) {
            validateRequiredProps("start", "end");
        } else if ("collection".equals(type)) {
            validateRequiredProps("collection");
        } else {
            throw new BrighticsCoreException("3108");
        }

        ParametersBuilder paramBuilder = new ParametersBuilder();
        paramBuilder.add("type", type);
        JsonObject props = param.getAsJsonObject("prop");
        for (Entry<String, JsonElement> entry : props.entrySet()) {
            paramBuilder.add(entry.getKey(), entry.getValue());
        }

        InOutDataLinker dataLinker = new InOutDataLinker(function, model);
        ForLoopWorkflow workflow = new ForLoopWorkflow(fid, paramBuilder.build()) {
            @Override
            public void start(WorkflowContext context) {
                try {
                    super.start(context);
                } catch (AbsBrighticsException e) {
                    JobContextHolder.getJobStatusTracker().endControlFunctionWith(this.name, Status.FAIL);
                    throw e;
                }
            }

            @Override
            protected void logLoopStatus(LogPosition pos, LoopStatus status) {
                if (pos == LogPosition.BEFORE_BODY) {
                    LoggerUtil.pushMDC("loop", String.valueOf(status.getCount()));
                    LOGGER.info("[FOR LOOP " + status.getCount() + " START]");
                } else if (pos == LogPosition.AFTER_BODY) {
                    JobContextHolder.getJobStatusTracker().updateFunctionMessage(this.name, status.getCount() + "/" + status.getTotal());
                    LOGGER.info("[FOR LOOP " + status.getCount() + " END]");
                    LoggerUtil.popMDC("loop");
                }
            }

            @Override
            protected void log(LogPosition pos) {
                if (pos == LogPosition.BEFORE_BODY) {
                    LoggerUtil.pushMDC("fid", this.name);
                    JobContextHolder.getJobStatusTracker().startControlFunction(this.name, label, "ForLoop");
                    LOGGER.info("[FOR LOOP START]");
                    dataLinker.linkInData();
                } else if (pos == LogPosition.AFTER_BODY) {
                    dataLinker.linkOutData();
                    LOGGER.info("[FOR LOOP END]");
                    JobContextHolder.getJobStatusTracker().endControlFunctionWith(this.name, Status.SUCCESS);
                    LoggerUtil.popMDC("fid");
                }
            }
        };
        addLoopBody(workflow);
        return workflow;
    }

    private Node buildWhileLoop() {
        validateRequiredProps("expression");
        ParametersBuilder paramBuilder = new ParametersBuilder();
        JsonObject props = param.getAsJsonObject("prop");
        for (Entry<String, JsonElement> entry : props.entrySet()) {
            paramBuilder.add(entry.getKey(), entry.getValue());
        }

        InOutDataLinker dataLinker = new InOutDataLinker(function, model);
        WhileLoopWorkflow workflow = new WhileLoopWorkflow(fid, paramBuilder.build()) {
            @Override
            public void start(WorkflowContext context) {
                try {
                    super.start(context);
                } catch (AbsBrighticsException e) {
                    JobContextHolder.getJobStatusTracker().endControlFunctionWith(this.name, Status.FAIL);
                    throw e;
                }
            }

            @Override
            protected void logLoopStatus(LogPosition pos, LoopStatus status) {
                if (pos == LogPosition.BEFORE_BODY) {
                    LoggerUtil.pushMDC("loop", String.valueOf(status.getCount()));
                    LOGGER.info("[WHILE LOOP " + status.getCount() + " START]");
                } else if (pos == LogPosition.AFTER_BODY) {
                    JobContextHolder.getJobStatusTracker().updateFunctionMessage(this.name, "Loop" + status.getCount());
                    LOGGER.info("[WHILE LOOP " + status.getCount() + " END]");
                    LoggerUtil.popMDC("loop");
                }
            }

            @Override
            protected void log(LogPosition pos) {
                if (pos == LogPosition.BEFORE_BODY) {
                    LoggerUtil.pushMDC("fid", this.name);
                    JobContextHolder.getJobStatusTracker().startControlFunction(this.name, label, "WhileLoop");
                    LOGGER.info("[WHILE LOOP START]");
                    dataLinker.linkInData();
                } else if (pos == LogPosition.AFTER_BODY) {
                    dataLinker.linkOutData();
                    LOGGER.info("[WHILE LOOP END]");
                    JobContextHolder.getJobStatusTracker().endControlFunctionWith(this.name, Status.SUCCESS);
                    LoggerUtil.popMDC("fid");
                }
            }
        };
        addLoopBody(workflow);
        return workflow;
    }

    private void addLoopBody(LoopWorkflow workflow) {
        Node[] nodes = WorkflowBuildHelper.getNodes(model);
        if (nodes.length < 1) {
            nodes = new Node[]{new EmptyWork("EMPTY BODY")};
        }
        workflow.addNodes(nodes);
    }

    private void validateRequiredProps(String... names) {
        JsonObject props = param.getAsJsonObject("prop");
        for (String name : names) {
            boolean isEmptyProp =
                !props.has(name) || props.get(name).isJsonNull() || StringUtils.isBlank(ExpressionPattern.extractBody(props.get(name).getAsString()));
            if (isEmptyProp) {
                throw new BrighticsCoreException("3109", LegacyFunctionLabelProvider.getFunctionLabel(functionName, name));
            }
        }
    }
}
