package com.samsung.sds.brightics.common.workflow.flowrunner.job.model.context;

import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.variable.resolver.impl.DefaultVariableResolver;
import com.samsung.sds.brightics.common.workflow.context.WorkflowContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParameterValueHandler;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.model.Workflow;
import com.samsung.sds.brightics.common.workflow.model.impl.SequentialWorkflow;
import com.samsung.sds.brightics.common.workflow.flowrunner.variable.MetadataVariableResolver;
import com.samsung.sds.brightics.common.workflow.flowrunner.variable.ModelVariableInitializer;

public class WorkflowContextBuilder {

    private String mid;
    private JsonObject model;
    private VariableContext variableContext;

    public WorkflowContextBuilder setModel(JsonObject model) {
        this.model = model;
        this.mid = model.get("mid").getAsString();
        return this;
    }

    public WorkflowContextBuilder setVariableContext(VariableContext variableContext) {
        this.variableContext = variableContext;
        return this;
    }

    public WorkflowContext build() {
        Workflow workflow = buildWorkflow(this.model);

        WorkflowContext workflowContext = new WorkflowContext(workflow);
        workflowContext.setVariableContext(variableContext);
        workflowContext.setVariableInitializer(new ModelVariableInitializer(model.getAsJsonObject("variables")));
        workflowContext.setParameterHandler(new ParameterValueHandler(new DefaultVariableResolver(variableContext), new MetadataVariableResolver()));

        return workflowContext;
    }

    private Workflow buildWorkflow(JsonObject model) {
        Workflow workflow = new SequentialWorkflow(this.mid, new ParametersBuilder().build()) {
            @Override
            public void start(WorkflowContext context) {
                context.getVariableContext().execute("user", "sys.mid = '" + mid + "'");
                super.start(context);
            }
        };
        workflow.addNodes(WorkflowBuildHelper.getNodes(model));
        workflow.setNewVariableScope(true);
        return workflow;
    }
}
