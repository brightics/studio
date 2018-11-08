package com.samsung.sds.brightics.common.workflow.context;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.variable.VariableInitializer;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParameterValueHandler;
import lombok.Getter;
import lombok.Setter;

public abstract class AbstractContext {

    @Getter
    @Setter
    ParameterValueHandler parameterHandler;
    @Getter
    @Setter
    VariableContext variableContext;
    @Setter
    private VariableInitializer variableInitializer;

    public abstract void run();

    void beforeStart(String scopeName) {
        if (isNewVariableScope()) {
            variableContext.createScope(scopeName);
        }

        if (variableInitializer != null) {
            variableInitializer.setVariablesTo(variableContext);
        }
    }

    void afterStart(String scopeName) {
        if (isNewVariableScope()) {
            variableContext.removeScope(scopeName);
        }
        if (Thread.currentThread().isInterrupted()) {
            Thread.currentThread().interrupt();
            throw new BrighticsCoreException("3101");
        }
    }

    protected abstract boolean isNewVariableScope();
}

