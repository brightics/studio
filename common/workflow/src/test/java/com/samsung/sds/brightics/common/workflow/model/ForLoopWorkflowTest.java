package com.samsung.sds.brightics.common.workflow.model;

import com.google.gson.JsonArray;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.workflow.context.WorkContext;
import com.samsung.sds.brightics.common.workflow.context.WorkflowContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.model.impl.ForLoopWorkflow;
import static com.samsung.sds.brightics.common.workflow.model.impl.ForLoopWorkflow.PARAMS_COLLECTION;
import static com.samsung.sds.brightics.common.workflow.model.impl.ForLoopWorkflow.PARAMS_ELEMENT_VARIABLE;
import static com.samsung.sds.brightics.common.workflow.model.impl.ForLoopWorkflow.PARAMS_END;
import static com.samsung.sds.brightics.common.workflow.model.impl.ForLoopWorkflow.PARAMS_INDEX_VARIABLE;
import static com.samsung.sds.brightics.common.workflow.model.impl.ForLoopWorkflow.PARAMS_START;
import static com.samsung.sds.brightics.common.workflow.model.impl.ForLoopWorkflow.PARAMS_TYPE;
import com.samsung.sds.brightics.common.workflow.model.impl.LogPosition;
import com.samsung.sds.brightics.common.workflow.model.impl.LoopWorkflow;
import com.samsung.sds.brightics.common.workflow.model.impl.loop.LoopStatus;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ForLoopWorkflowTest {

    private static final Logger LOGGER = LoggerFactory.getLogger("ForLoopWorkflowTest");

    class CounterPrint extends Work {

        CounterPrint(String name, Parameters parameters) {
            super(name, parameters);
        }

        @Override
        public void start(WorkContext context) {
            String msg = resolvedParameters.getString("message");
            LOGGER.debug(context.getVariableContext().getValue("index") + " " + msg);
        }
    }

    class CollectionPrint extends Work {

        CollectionPrint(String name, Parameters parameters) {
            super(name, parameters);
        }

        @Override
        public void start(WorkContext context) {
            String msg = resolvedParameters.getString("message");
            LOGGER.debug(context.getVariableContext().getValue("index") + " " + msg + " " + context.getVariableContext().getValue("elem"));
        }

    }

    class ForLoopWorkflowImpl extends ForLoopWorkflow {

        ForLoopWorkflowImpl(String name, Parameters parameters) {
            super(name, parameters);
        }

        @Override
        protected void logLoopStatus(LogPosition pos, LoopStatus status) {
            if (pos == LogPosition.AFTER_BODY) {
                LOGGER.debug(this.name + " loop iteration end : " + status.getCount() + "/" + status.getTotal());
            }
        }
    }

    @Test
    public void testCounterLoopWorkflow() {
        Node n0 = new CounterPrint("0", new ParametersBuilder().add("message", "node0").build());
        Node n1 = new CounterPrint("1", new ParametersBuilder().add("message", "node1").build());
        Node n2 = new CounterPrint("2", new ParametersBuilder().add("message", "node2").build());
        Node n3 = new CounterPrint("3", new ParametersBuilder().add("message", "node3").build());
        Node n4 = new CounterPrint("4", new ParametersBuilder().add("message", "node4").build());
        Node n5 = new CounterPrint("5", new ParametersBuilder().add("message", "node5").build());

        n0.connect(n1).connect(n2).connect(n3).connect(n4);
        n1.connect(n5).connect(n3);

        Workflow flow = new ForLoopWorkflowImpl("counter",
            new ParametersBuilder().add(PARAMS_TYPE, "count").add(PARAMS_START, 1).add(PARAMS_END, 3).add(PARAMS_INDEX_VARIABLE, "index").build());
        flow.addNodes(n0, n1, n5, n3, n4, n2);

        WorkflowContext context = new WorkflowContext(flow);
        context.setVariableContext(new VariableContext());
        context.run();
    }

    @Test
    public void testNestedLoopWorkflow() {
        Node n0 = new CounterPrint("0", new ParametersBuilder().add("message", "node0").build());
        Node n3 = new CounterPrint("3", new ParametersBuilder().add("message", "node3").build());

        Workflow inner = new ForLoopWorkflowImpl("inner counter",
            new ParametersBuilder().add(PARAMS_TYPE, "count").add(PARAMS_START, 1).add(PARAMS_END, 3).add(PARAMS_INDEX_VARIABLE, "index").build());
        Node n1 = new CounterPrint("1", new ParametersBuilder().add("message", "node1").build());
        Node n2 = new CounterPrint("2", new ParametersBuilder().add("message", "node2").build());
        n1.connect(n2);
        inner.addNodes(n1, n2);

        n0.connect(inner).connect(n3);
        Workflow loop = new ForLoopWorkflowImpl("loop",
            new ParametersBuilder().add(PARAMS_TYPE, "count").add(PARAMS_START, 1).add(PARAMS_END, 3).add(PARAMS_INDEX_VARIABLE, "index").build());
        loop.addNodes(n0, inner, n3);

        WorkflowContext context = new WorkflowContext(loop);
        context.setVariableContext(new VariableContext());
        context.run();
    }

    @Test
    public void testCollectionLoopWorkflow() {
        Node n0 = new CollectionPrint("0", new ParametersBuilder().add("message", "node0").build());
        Node n1 = new CollectionPrint("1", new ParametersBuilder().add("message", "node1").build());
        Node n2 = new CollectionPrint("2", new ParametersBuilder().add("message", "node2").build());
        Node n3 = new CollectionPrint("3", new ParametersBuilder().add("message", "node3").build());
        Node n4 = new CollectionPrint("4", new ParametersBuilder().add("message", "node4").build());
        Node n5 = new CollectionPrint("5", new ParametersBuilder().add("message", "node5").build());

        n0.connect(n1).connect(n2).connect(n3).connect(n4);
        n1.connect(n5).connect(n3);

        JsonArray collection = new JsonArray();
        collection.add("elem1");
        collection.add("elem2");
        collection.add("elem3");

        Workflow flow = new ForLoopWorkflowImpl("collection",
            new ParametersBuilder().add(PARAMS_TYPE, "collection").add(PARAMS_COLLECTION, collection).add(PARAMS_INDEX_VARIABLE, "index")
                .add(PARAMS_ELEMENT_VARIABLE, "elem").build());
        flow.addNodes(n0, n1, n5, n3, n4, n2);

        WorkflowContext context = new WorkflowContext(flow);
        context.setVariableContext(new VariableContext());
        context.run();
    }

    @Test(expected = BrighticsCoreException.class)
    public void testInfiniteLoop() {
        LoopWorkflow.setLoopLimit(10);
        Node n0 = new CounterPrint("0", new ParametersBuilder().add("message", "node0").build());

        Workflow flow = new ForLoopWorkflowImpl("counter for loop",
            new ParametersBuilder().add(PARAMS_TYPE, "count").add(PARAMS_START, 1).add(PARAMS_END, 100).add(PARAMS_INDEX_VARIABLE, "index").build());

        flow.addNodes(n0);

        new WorkflowContext(flow).run();
    }
}
