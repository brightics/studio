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

package com.samsung.sds.brightics.common.workflow.model;

import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.workflow.context.WorkContext;
import com.samsung.sds.brightics.common.workflow.context.WorkflowContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.model.impl.SequentialWorkflow;
import com.samsung.sds.brightics.common.workflow.util.WorkflowSorter;
import java.util.ArrayList;
import java.util.List;
import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WorkflowTest {

    private static final Logger LOGGER = LoggerFactory.getLogger("ForLoopWorkflowTest");

    class Print extends Work {

        Print(String name, Parameters parameters) {
            super(name, parameters);
        }

        @Override
        public void start(WorkContext context) {
            String msg = resolvedParameters.getString("message");
            LOGGER.debug(msg);
        }

    }

    class Add extends Work {

        Add(String name, Parameters parameters) {
            super(name, parameters);
        }

        @Override
        public void start(WorkContext context) {
            int a = resolvedParameters.getNumber("a").intValue();
            int b = resolvedParameters.getNumber("b").intValue();
            LOGGER.debug("a + b : " + (a + b));
        }

    }

    class SetVar extends Work {

        SetVar(String name, Parameters parameters) {
            super(name, parameters);
        }

        @Override
        public void start(WorkContext context) {
            LOGGER.debug("set variable message to api-server");
        }

    }

    @Test
    public void testWorkflowSorter() {

        Node n0 = new Node("0");
        Node n1 = new Node("1");
        Node n2 = new Node("2");
        Node n3 = new Node("3");
        Node n4 = new Node("4");
        Node n5 = new Node("5");

        n5.connect(n0);
        n5.connect(n2);
        n2.connect(n3);
        n3.connect(n1);
        n4.connect(n0);
        n4.connect(n1);

        Workflow flow = new SequentialWorkflow("sequence", null);
        flow.addNodes(n0, n1, n2, n3, n4, n5);

        try {
            new WorkflowContext(flow).sortNodes();
            // Print topological order
            // CorreNode [name=4] Node [name=5] Node [name=0] Node [name=2] Node [name=3] Node [name=1]
            for (Node i : flow.nodes) {
                System.out.print(i + " ");
                assertArrayEquals(new Node[]{n4, n5, n0, n2, n3, n1}, flow.nodes.toArray(new Node[6]));
            }
        } catch (AbsBrighticsException e) {
            fail("cycle detected");
        }

    }

    @Test
    public void testFindHead() {

        Node n0 = new Node("0");
        Node n1 = new Node("1");
        Node n2 = new Node("2");
        Node n3 = new Node("3");
        Node n4 = new Node("4");
        Node n5 = new Node("5");

        n0.connect(n1).connect(n2);
        n3.connect(n4).connect(n2).connect(n5);

        List<Node> nodes = new ArrayList<>();
        nodes.add(n0);
        nodes.add(n1);
        nodes.add(n2);
        nodes.add(n3);
        nodes.add(n4);
        nodes.add(n5);

        List<Node> head = WorkflowSorter.findRootNode(nodes);
        for (Node n : head) {
            LOGGER.debug(n.toString());
        }
        assertTrue(head.contains(n0) && head.contains(n3));
    }

    @Test
    public void testWorkflow() {
        Node n0 = new SetVar("0", null);
        Node n1 = new Add("1", new ParametersBuilder().add("a", 2).add("b", 2).build());
        Node n2 = new Add("2", new ParametersBuilder().add("a", 4).add("b", 4).build());
        Node n3 = new Print("3", new ParametersBuilder().add("message", "my msg1").build());
        Node n4 = new Print("4", new ParametersBuilder().add("message", "my msg2").build());
        Node n5 = new Print("5", new ParametersBuilder().add("message", "my msg3").build());

        n0.connect(n1).connect(n2).connect(n3).connect(n4);
        n1.connect(n5).connect(n3);

        Workflow flow = new SequentialWorkflow("sequence", null);
        flow.addNodes(n0, n1, n5, n3, n4, n2);
        new WorkflowContext(flow).run();
    }

}
