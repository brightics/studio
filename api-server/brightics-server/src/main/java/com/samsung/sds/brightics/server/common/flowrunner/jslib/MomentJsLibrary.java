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

package com.samsung.sds.brightics.server.common.flowrunner.jslib;

import com.samsung.sds.brightics.common.variable.context.JsLibrary;
import com.samsung.sds.brightics.common.variable.scope.VariableScope;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import org.mozilla.javascript.Context;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MomentJsLibrary implements JsLibrary {

    private static final Logger LOGGER = LoggerFactory.getLogger(MomentJsLibrary.class);

    @Override
    public void loadLibrary(VariableScope variableScope) {
        Context.enter();
        try (Reader reader = new InputStreamReader(getClass().getResourceAsStream("/rhino/template/moment.js"))) {
            Context.getCurrentContext().evaluateReader(variableScope.getScope(), reader, "moment.js", 1, null);
        } catch (IOException e) {
            LOGGER.error("Failed to load lib, so ignored.", e);
        }
        Context.exit();
    }
}
