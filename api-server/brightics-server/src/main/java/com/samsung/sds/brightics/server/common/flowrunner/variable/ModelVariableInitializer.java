package com.samsung.sds.brightics.server.common.flowrunner.variable;

import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Queue;
import java.util.Set;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.variable.Variable;
import com.samsung.sds.brightics.common.variable.VariableInitializer;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.variable.resolver.IVariableResolver;
import com.samsung.sds.brightics.common.variable.resolver.impl.DefaultVariableResolver;

public class ModelVariableInitializer implements VariableInitializer {

    private final Queue<Variable> variables = new LinkedList<>();
    private final Map<String, Set<String>> resolveErrorTracker = new HashMap<>();

    public ModelVariableInitializer(JsonObject variables) {
        if (variables == null || variables.size() == 0) {
            return;
        }

        for (Entry<String, JsonElement> entry : variables.entrySet()) {
            Variable variable = new Variable(entry.getKey(), entry.getValue().getAsJsonObject().get("value"));
            this.variables.add(variable);
        }
    }

    @Override
    public void setVariablesTo(VariableContext variableContext) {
        Queue<Variable> unresolvedVariables = new LinkedList<>();
        IVariableResolver resolver = new DefaultVariableResolver(variableContext);

        while (!variables.isEmpty()) {
            Variable variable = variables.poll();
            assert variable != null;
            try {
                variable.setValue(resolver.resolve(variable.getValue()));
                variableContext.setVariable(variable);
            } catch (BrighticsCoreException e) {
                if ("3120".equals(e.code)) {
                    unresolvedVariables.add(variable);
                } else {
                    throw e;
                }
            }
        }

        resolveErrorTracker.clear();
        while (!unresolvedVariables.isEmpty()) {
            Variable variable = unresolvedVariables.poll();
            assert variable != null;
            try {
                variable.setValue(resolver.resolve(variable.getValue()));
                variableContext.setVariable(variable);
            } catch (BrighticsCoreException e) {
                handleResolveError(variable, e);
                unresolvedVariables.add(variable);
            }
        }
    }

    private void handleResolveError(Variable variable, BrighticsCoreException e) {
        if (!resolveErrorTracker.containsKey(variable.getName())) {
            resolveErrorTracker.put(variable.getName(), new HashSet<>());
        }

        if (resolveErrorTracker.get(variable.getName()).contains(e.getMessage())) {
            throw e;
        }

        resolveErrorTracker.get(variable.getName()).add(e.getMessage());
    }
}
