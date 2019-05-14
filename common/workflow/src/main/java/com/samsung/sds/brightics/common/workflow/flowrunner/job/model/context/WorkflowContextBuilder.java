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
