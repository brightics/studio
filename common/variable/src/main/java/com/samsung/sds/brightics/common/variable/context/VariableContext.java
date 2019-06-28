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

package com.samsung.sds.brightics.common.variable.context;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.variable.Variable;
import com.samsung.sds.brightics.common.variable.resolver.RhinoExceptionHandler;
import com.samsung.sds.brightics.common.variable.scope.VariableScope;
import com.samsung.sds.brightics.common.variable.storage.AbstractScriptableStorage;
import java.util.ArrayList;
import java.util.List;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.RhinoException;
import org.mozilla.javascript.Scriptable;

/**
 * The main class to control variable scopes.
 * This class can has one or more variable scopes.
 * Automatically sets the parent of last added child scope due to the order of looking up variables
 *
 * @author jb.jung
 */
public class VariableContext {

    private final List<VariableScope> scopes = new ArrayList<>();

    public VariableContext() {
        init();
    }

    public VariableContext(VariableScope... scopes) {
        init();
        for (VariableScope s : scopes) {
            addChildScope(s);
        }
    }

    private void init() {
        createScope("loader");
    }

    public void addJsLibrary(JsLibrary library) {
        library.loadLibrary(getScope("loader"));
    }

    /**
     * Newly create variablescope and add it as child of last scope of this context.
     */
    public void createScope(String scopeName) {
        try {
            Context cx = Context.enter();
            Scriptable scope = cx.initStandardObjects();
            addChildScope(new VariableScope(scopeName, scope));
        } finally {
            Context.exit();
        }
    }

    /**
     * Create VariableScope from storage object and add it as child of last scope of this context.
     */
    public void createScopeWithStorage(String scopeName, AbstractScriptableStorage storage) {
        VariableScope vs = new VariableScope(scopeName, storage);
        vs.backup();
        addChildScope(vs);
    }

    /**
     * Add one VariableScope as child of last scope of this context.
     */
    private void addChildScope(VariableScope scope) {
        try {
            Context.enter();
            if (!scopes.isEmpty()) {
                VariableScope parent = scopes.get(scopes.size() - 1);
                scope.getScope().setParentScope(parent.getScope());
            }
            scopes.add(scope);
        } finally {
            Context.exit();
        }
    }

    /**
     * Get the scope which has scopeName.
     */
    public VariableScope getScope(String scopeName) {
        if (scopes.isEmpty()) {
            throw new BrighticsCoreException("3102", "No scope in this context.");
        }
        if (scopeName == null) {
            // Get last child if scopeName is null
            return scopes.get(scopes.size() - 1);
        }
        for (VariableScope vs : scopes) {
            if (scopeName.equals(vs.getName())) {
                return vs;
            }
        }
        throw new BrighticsCoreException("3102", "Variable scope [" + scopeName + "] is not found.");
    }

    /**
     * Remove the scope which has scopeName.
     */
    public void removeScope(String scopeName) {
        int targetIndex = -1;
        for (int i = 0; i < scopes.size(); i++) {
            if (scopeName.equals(scopes.get(i).getName())) {
                targetIndex = i;
                break;
            }
        }
        if (targetIndex != -1) {
            scopes.remove(targetIndex);
        }
    }

    /**
     * Execute script on the last child scope.
     */
    public void execute(String script) {
        evaluate(null, script);
    }

    /**
     * Execute script on the scope which has scopeName.
     */
    public void execute(String scopeName, String script) {
        evaluate(scopeName, script);
    }

    /**
     * Get the value to which the variableName mapped from the last child scope.
     */
    public Object getValue(String variableName) {
        return evaluate(null, variableName);
    }

    /**
     * Get the value to which the variableName mapped from the scope which has scopeName.
     */
    public Object getValue(String scopeName, String variableName) {
        return evaluate(scopeName, variableName);
    }

    /**
     * Main point of evaluating scripts.
     * After the evaluation, it tries to backup the scope if storage is available to use.
     */
    private Object evaluate(String scopeName, String script) {
        VariableScope vs = getScope(scopeName);
        Object result = vs.evaluate(scopeName, script);
        if (result instanceof Double && ((Double) result) % 1 == 0) {
            return ((Double) result).intValue();
        }
        return result;
    }

    /**
     * Set variable on the last child scope.
     */
    public void setVariable(Variable variable) {
        setVariable(null, variable);
    }

    /**
     * Set variable on the scope which has scopeName.
     */
    public void setVariable(String scopeName, Variable variable) {
        VariableScope vs = getScope(scopeName);
        try {
            vs.evaluate(scopeName, variable.getExecutableScriptString());
        } catch (RhinoException e) {
            throw RhinoExceptionHandler.handle(e, variable.getValue().toString());
        }
    }

    public boolean evaluateConditionalExpression(String expression) {
        Boolean result;
        try {
            result = (Boolean) getScope(null).evaluate("conditional expression", "(" + expression + ")? true : false;");
        } catch (Exception e) {
            throw new BrighticsCoreException("3102", "invalid conditional expression(" + expression + ")");
        }
        return result;
    }
}
