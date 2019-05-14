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

package com.samsung.sds.brightics.common.workflow.flowrunner.jslib;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.variable.context.JsLibrary;
import com.samsung.sds.brightics.common.variable.scope.VariableScope;

public class WorkflowJsLibrary implements JsLibrary {

    private static final String API_NAME = "WORKFLOW_API";
    private static final Logger LOGGER = LoggerFactory.getLogger(WorkflowJsLibrary.class);

    @Override
    public void loadLibrary(VariableScope variableScope) {
        Context.enter();
        try {
            Scriptable scope = variableScope.getScope();
            if (scope.has(API_NAME, scope)) {
                // 이미 로딩된 경우 다시 로드하지 않음
                return;
            }

            ScriptableObject.defineClass(scope, WorkflowJsAPI.class);
            Scriptable workflowAPI = Context.getCurrentContext().newObject(scope, "WorkflowJsAPI");
            scope.put(API_NAME, scope, workflowAPI);
            variableScope.evaluate("workflow.js", "this.cell = function(){return " + API_NAME + ".uploadDataAndGetCellValue.apply(WORKFLOW_API, arguments)}");
            variableScope.evaluate("workflow.js", "this.getCellValue = function(){return " + API_NAME + ".getCellValue.apply(WORKFLOW_API, arguments)}");
        } catch (Exception e) {
            LOGGER.error("failed to load workflow js api", e);
            variableScope.getScope().delete(API_NAME);
        } finally {
            Context.exit();
        }
    }
}
