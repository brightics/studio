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

