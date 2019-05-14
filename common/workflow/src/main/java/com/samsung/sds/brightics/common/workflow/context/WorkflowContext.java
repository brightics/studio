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

package com.samsung.sds.brightics.common.workflow.context;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.variable.resolver.impl.DefaultVariableResolver;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParameterValueHandler;
import com.samsung.sds.brightics.common.workflow.model.Work;
import com.samsung.sds.brightics.common.workflow.model.Workflow;
import com.samsung.sds.brightics.common.workflow.model.impl.ConditionalWorkflow;
import com.samsung.sds.brightics.common.workflow.util.WorkflowSorter;

public class WorkflowContext extends AbstractContext {

    private final Workflow workflow;

    public WorkflowContext(Workflow workflow) {
        this.workflow = workflow;
    }

    @Override
    public void run() {
        checkPrecondition();
        if (!(workflow instanceof ConditionalWorkflow)) {
            sortNodes();
        }

        if (variableContext == null) {
            // default variableContext
            variableContext = new VariableContext();
        }

        if (parameterHandler == null) {
            // default handler
            parameterHandler = new ParameterValueHandler(new DefaultVariableResolver(variableContext));
        }

        workflow.resolveParameters(parameterHandler);
        beforeStart(workflow.name);
        workflow.start(this);
        afterStart(workflow.name);
    }

    public void sortNodes() {
        workflow.setNodes(WorkflowSorter.topologicalSort(workflow.getNodes()));
    }

    private void checkPrecondition() {
        if (workflow.getNodes().isEmpty()) {
            throw new BrighticsCoreException("3102", "Empty nodes.");
        }

        // check if all nodes are works
        if (!workflow.getNodes().stream().allMatch(node -> node instanceof Work || node instanceof Workflow)) {
            throw new BrighticsCoreException("3102", "Some nodes are not child of Work or Workflow.");
        }
    }

    @Override
    protected boolean isNewVariableScope() {
        return workflow.getNewVariableScope();
    }

    public WorkflowContext createChildWorkflowContext(Workflow childWorkflow) {
        WorkflowContext childWorkflowContext = new WorkflowContext(childWorkflow);
        childWorkflowContext.setVariableContext(this.variableContext);
        childWorkflowContext.setParameterHandler(this.parameterHandler);
        return childWorkflowContext;
    }
}
