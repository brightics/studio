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
