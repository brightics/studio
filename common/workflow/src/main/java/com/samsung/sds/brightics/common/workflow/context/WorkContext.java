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

import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.variable.resolver.impl.DefaultVariableResolver;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParameterValueHandler;
import com.samsung.sds.brightics.common.workflow.model.Work;

public class WorkContext extends AbstractContext {

    private final Work work;

    public WorkContext(WorkflowContext parent, Work work) {
        this.work = work;
        this.variableContext = parent.variableContext;
        this.parameterHandler = parent.parameterHandler;
    }

    @Override
    public void run() {
        if (variableContext == null) {
            // default variableContext
            variableContext = new VariableContext();
        }

        if (parameterHandler == null) {
            // default resolver
            parameterHandler = new ParameterValueHandler(new DefaultVariableResolver(variableContext));
        }

        work.resolveParameters(parameterHandler);
        beforeStart(work.name);
        work.start(this);
        afterStart(work.name);
    }


    @Override
    protected boolean isNewVariableScope() {
        return false;
    }
}
