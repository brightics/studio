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

package com.samsung.sds.brightics.common.workflow.context.parameter;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.JsonElement;
import com.samsung.sds.brightics.common.variable.resolver.IVariableResolver;

public class ParameterValueHandler {

    private final List<IVariableResolver> variableResolverChain;

    public ParameterValueHandler() {
        variableResolverChain = new ArrayList<>();
    }

    public ParameterValueHandler(IVariableResolver... iVariableResolvers) {
        this();
        for (IVariableResolver resolver : iVariableResolvers) {
            variableResolverChain.add(resolver);
        }
    }

    public void addVariableResolver(IVariableResolver resolver) {
        variableResolverChain.add(resolver);
    }

    public Parameters handle(Parameters target) {
        if (target == null) {
            return null;
        }

        ParametersBuilder pb = new ParametersBuilder();
        for (String key : target.keys()) {
            pb.add(key, resolveChain(target.getParam(key)));
        }
        return pb.build();
    }

    private JsonElement resolveChain(JsonElement param) {
        JsonElement resultParam = param;
        for (IVariableResolver resolver : variableResolverChain) {
            resultParam = resolver.resolve(resultParam);
        }
        return resultParam;
    }
}
