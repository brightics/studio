package com.samsung.sds.brightics.common.workflow.model;

import com.google.gson.JsonArray;
import com.google.gson.JsonPrimitive;
import com.samsung.sds.brightics.common.workflow.context.WorkContext;
import com.samsung.sds.brightics.common.workflow.context.WorkflowContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.model.impl.ConditionalWorkflow;
import com.samsung.sds.brightics.common.workflow.model.impl.LogPosition;
import org.junit.Assert;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ConditionalWorkflowTest {

    private static final Logger LOGGER = LoggerFactory.getLogger("ConditionalWorkflowTest");

    class Print extends Work {

        Print(String name) {
            super(name, new ParametersBuilder().build());
        }

        @Override
        public void start(WorkContext context) {
            LOGGER.info(name);
        }
    }

    @Test
    public void testConditionalWorkflow() {
        ParametersBuilder pb = new ParametersBuilder();

        JsonArray ifTrueCondition = new JsonArray();
        ifTrueCondition.add(new JsonPrimitive("${=10 > 5}"));
        ifTrueCondition.add(new JsonPrimitive("${=true}"));

        JsonArray elseTrueCondition = new JsonArray();
        elseTrueCondition.add(new JsonPrimitive("${=false}"));
        elseTrueCondition.add(new JsonPrimitive("${=true}"));

        Node ifBody = new Print("if body");
        Node elseBody = new Print("else body");

        Workflow workflow1 = new ConditionalWorkflow("condition", pb.clear().add("conditions", ifTrueCondition).build()) {
            @Override
            protected void log(LogPosition pos, int idx) {
                Assert.assertEquals(0, idx);
            }
        };
        workflow1.addNodes(ifBody, elseBody);
        new WorkflowContext(workflow1).run();

        Workflow workflow2 = new ConditionalWorkflow("condition", pb.clear().add("conditions", elseTrueCondition).build()) {
            @Override
            protected void log(LogPosition pos, int idx) {
                Assert.assertEquals(1, idx);
            }
        };
        workflow2.addNodes(ifBody, elseBody);
        new WorkflowContext(workflow2).run();
    }

    @Test
    public void testElseifConditionalWorkflow() {
        ParametersBuilder pb = new ParametersBuilder();

        JsonArray conditions = new JsonArray();
        conditions.add(new JsonPrimitive("${=10 <= 5}"));
        conditions.add(new JsonPrimitive("${=10 > 0}"));
        conditions.add(new JsonPrimitive("${=true}"));

        Node ifBody = new Print("if body");
        Node elseifBody = new Print("elseif body");
        Node elseBody = new Print("else body");

        Workflow workflow = new ConditionalWorkflow("condition", pb.clear().add("conditions", conditions).build()) {
            @Override
            protected void log(LogPosition pos, int idx) {
                Assert.assertEquals(1, idx);
            }
        };
        workflow.addNodes(ifBody, elseifBody, elseBody);
        new WorkflowContext(workflow).run();

    }

}
