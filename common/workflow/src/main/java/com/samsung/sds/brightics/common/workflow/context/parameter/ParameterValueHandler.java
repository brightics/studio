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
