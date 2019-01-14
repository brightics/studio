package com.samsung.sds.brightics.server.common.flowrunner.model.context;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.legacy.provider.LegacyFunctionLabelProvider;
import com.samsung.sds.brightics.common.variable.resolver.ExpressionPattern;
import com.samsung.sds.brightics.common.workflow.context.WorkflowContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.model.Node;
import com.samsung.sds.brightics.common.workflow.model.Workflow;
import com.samsung.sds.brightics.common.workflow.model.impl.ConditionalWorkflow;
import com.samsung.sds.brightics.common.workflow.model.impl.EmptyWork;
import com.samsung.sds.brightics.common.workflow.model.impl.LogPosition;
import com.samsung.sds.brightics.common.workflow.model.impl.SequentialWorkflow;
import com.samsung.sds.brightics.server.common.flowrunner.model.data.InOutDataLinker;
import com.samsung.sds.brightics.server.common.flowrunner.status.JobContextHolder;
import com.samsung.sds.brightics.server.common.flowrunner.status.Status;
import com.samsung.sds.brightics.server.common.util.JsonObjectUtil;
import com.samsung.sds.brightics.server.common.util.LoggerUtil;
import com.samsung.sds.brightics.server.common.util.ValidationUtil;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.lang3.StringUtils;

public class ConditionalWorkflowBuilder {

    private static final String PARAM_EXPRESSION = "expression";

    private final JsonObject param;
    private final JsonObject innerModels;
    private final JsonObject function;
    private final String fid;
    private final String label;
    private final JsonArray conditions = new JsonArray();
    private final List<Node> conditionBodies = new ArrayList<>();
    private final List<InOutDataLinker> dataLinkers = new ArrayList<>();

    ConditionalWorkflowBuilder(JsonObject function, JsonObject innerModels) {
        this.function = function;
        this.innerModels = innerModels;
        this.fid = JsonObjectUtil.getAsString(function, "fid");
        this.label = JsonObjectUtil.getAsString(function, "label");
        this.param = function.getAsJsonObject("param");

        ValidationUtil.throwIfEmpty(param.get("if"), "if");
        ValidationUtil.throwIfEmpty(param.get("else"), "else");
    }

    public Node build() {
        initConditions();

        ConditionalWorkflow workflow = new ConditionalWorkflow(fid, new ParametersBuilder().add(ConditionalWorkflow.PARAM_CONDITIONS, conditions).build()) {
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
            protected void log(LogPosition pos, int selectedIdx) {
                if (pos == LogPosition.BEFORE_BODY) {
                    LoggerUtil.pushMDC("fid", fid);
                    String selectedConditionMessage = getSelectedConditionMessage(selectedIdx);
                    LOGGER.info("[CONDITION START] selected condition : {}", selectedConditionMessage);
                    JobContextHolder.getJobStatusTracker().startControlFunction(this.name, label, "If");
                    JobContextHolder.getJobStatusTracker().updateFunctionMessage(this.name, selectedConditionMessage);
                    dataLinkers.get(selectedIdx).linkInData();
                } else if (pos == LogPosition.AFTER_BODY) {
                    dataLinkers.get(selectedIdx).linkOutData();
                    JobContextHolder.getJobStatusTracker().endControlFunctionWith(this.name, Status.SUCCESS);
                    LOGGER.info("[CONDITION END]");
                    LoggerUtil.popMDC("fid");
                }
            }

            private String getSelectedConditionMessage(int selectedIdx) {
                JsonElement selectedCondition = originalParameters.getParam(PARAM_CONDITIONS).getAsJsonArray().get(selectedIdx);
                if (selectedIdx == 0) {
                    return "[If] " + ExpressionPattern.extractBody(selectedCondition.getAsString());
                } else if (selectedIdx == conditions.size() - 1) {
                    return "[Else]";
                }
                return "[Else-If(" + (selectedIdx - 1) + ")] " + ExpressionPattern.extractBody(selectedCondition.getAsString());
            }
        };
        workflow.addNodes(conditionBodies.toArray(new Node[0]));
        return workflow;
    }

    private void initConditions() {
        addCondition(param.getAsJsonObject("if"));

        if (param.has("elseif")) {
            for (JsonElement elseif : param.getAsJsonArray("elseif")) {
                addCondition(elseif.getAsJsonObject());
            }
        }

        addElseCondition(param.getAsJsonObject("else"));
    }

    private void addCondition(JsonObject conditionParam) {
        validateExpressionPresence(conditionParam, conditions.size() < 1 ? "if" : "elseif");
        String expression = JsonObjectUtil.getAsString(conditionParam, PARAM_EXPRESSION);
        String mid = JsonObjectUtil.getAsString(conditionParam, "mid");

        if (!innerModels.has(mid)) {
            throw new BrighticsCoreException("3110");
        }

        conditions.add(new JsonPrimitive(expression));

        dataLinkers.add(new InOutDataLinker(function, innerModels.getAsJsonObject(mid)));

        JsonObject innerModelsCopy = innerModels.deepCopy();
        innerModelsCopy.remove(mid);

        JsonObject conditionModel = innerModels.getAsJsonObject(mid).deepCopy();
        conditionModel.add("innerModels", innerModelsCopy);

        Node[] nodes = WorkflowBuildHelper.getNodes(conditionModel);
        if (nodes.length > 0) {
            Workflow workflow = new SequentialWorkflow("body", new ParametersBuilder().build());
            workflow.addNodes(nodes);
            conditionBodies.add(workflow);
        } else {
            conditionBodies.add(new EmptyWork("EMPTY BODY"));
        }
    }

    private void addElseCondition(JsonObject conditionParam) {
        conditionParam.add(PARAM_EXPRESSION, new JsonPrimitive("${=/*else*/true}"));
        addCondition(conditionParam);
    }

    private void validateExpressionPresence(JsonObject condition, String name) {
        if (!condition.has(PARAM_EXPRESSION) || condition.get(PARAM_EXPRESSION).isJsonNull()) {
            throw new BrighticsCoreException("3109", LegacyFunctionLabelProvider.getFunctionLabel("If", name));
        }
        if (StringUtils.isBlank(ExpressionPattern.extractBody(condition.get(PARAM_EXPRESSION).getAsString()))) {
            throw new BrighticsCoreException("3109", LegacyFunctionLabelProvider.getFunctionLabel("If", name));
        }
    }
}
