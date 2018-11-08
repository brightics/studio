package com.samsung.sds.brightics.common.workflow.model;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.workflow.context.WorkContext;
import com.samsung.sds.brightics.common.workflow.context.WorkflowContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.model.impl.LogPosition;
import com.samsung.sds.brightics.common.workflow.model.impl.LoopWorkflow;
import static com.samsung.sds.brightics.common.workflow.model.impl.LoopWorkflow.PARAMS_EXPRESSION;
import com.samsung.sds.brightics.common.workflow.model.impl.WhileLoopWorkflow;
import static com.samsung.sds.brightics.common.workflow.model.impl.WhileLoopWorkflow.PARAMS_INDEX_VARIABLE;
import com.samsung.sds.brightics.common.workflow.model.impl.loop.LoopStatus;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WhileLoopWorkflowTest {

    private static final Logger LOGGER = LoggerFactory.getLogger("WhileLoopWorkflowTest");

    class Print extends Work {

        Print(String name, Parameters parameters) {
            super(name, parameters);
        }

        @Override
        public void start(WorkContext context) {
            String msg = resolvedParameters.getString("message");
            LOGGER.debug(context.getVariableContext().getValue("index") + " " + msg);
        }
    }

    class WhileLoopWorkflowImpl extends WhileLoopWorkflow {

        WhileLoopWorkflowImpl(String name, Parameters parameters) {
            super(name, parameters);
        }

        @Override
        protected void logLoopStatus(LogPosition pos, LoopStatus status) {
            if (pos == LogPosition.AFTER_BODY) {
                LOGGER.debug(this.name + " loop iteration end : count(" + status.getCount() + ")/index(" + status.getIndex() + ")");
            }
        }
    }

    @Test
    public void testWhileLoopWorkflow() {
        Node n0 = new Print("0", new ParametersBuilder().add("message", "node0").build());
        Node n1 = new Print("1", new ParametersBuilder().add("message", "node1").build());
        Node n2 = new Print("2", new ParametersBuilder().add("message", "node2").build());

        n0.connect(n1).connect(n2);

        Workflow flow = new WhileLoopWorkflowImpl("while",
            new ParametersBuilder().add(PARAMS_INDEX_VARIABLE, "index").add(PARAMS_EXPRESSION, "${=index < 5}").build());

        flow.addNodes(n0, n1, n2);

        WorkflowContext context = new WorkflowContext(flow);
        context.setVariableContext(new VariableContext());
        context.getVariableContext().execute("var index = 0");
        context.run();
    }

    @Test(expected = BrighticsCoreException.class)
    public void testInfiniteLoop() {
        LoopWorkflow.setLoopLimit(10);
        Node n0 = new Print("0", new ParametersBuilder().add("message", "node0").build());

        Workflow flow = new WhileLoopWorkflowImpl("while",
            new ParametersBuilder().add(PARAMS_INDEX_VARIABLE, "index").add(PARAMS_EXPRESSION, "${=true}").build());

        flow.addNodes(n0);

        new WorkflowContext(flow).run();
    }
}
