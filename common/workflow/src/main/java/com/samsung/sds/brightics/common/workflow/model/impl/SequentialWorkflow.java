package com.samsung.sds.brightics.common.workflow.model.impl;

import com.samsung.sds.brightics.common.workflow.context.WorkContext;
import com.samsung.sds.brightics.common.workflow.context.WorkflowContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import com.samsung.sds.brightics.common.workflow.model.Node;
import com.samsung.sds.brightics.common.workflow.model.Work;
import com.samsung.sds.brightics.common.workflow.model.Workflow;

public class SequentialWorkflow extends Workflow {

    public SequentialWorkflow(String name, Parameters parameters) {
        super(name, parameters);
    }

    @Override
    public void start(WorkflowContext context) {
        for (Node node : nodes) {
            if (node instanceof Work) {
                new WorkContext(context, (Work) node).run();
            } else if (node instanceof Workflow) {
                context.createChildWorkflowContext((Workflow) node).run();
            }
        }
    }
}
