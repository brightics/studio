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
