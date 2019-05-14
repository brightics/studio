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

package com.samsung.sds.brightics.common.variable;

import com.samsung.sds.brightics.common.variable.context.JsLibrary;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.variable.scope.VariableScope;
import com.samsung.sds.brightics.common.variable.storage.impl.LocalFsStorage;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import org.junit.Assert;
import org.junit.Test;
import org.mozilla.javascript.Context;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class VariableContextTest {

    class MomentJsLib implements JsLibrary {

        Logger logger = LoggerFactory.getLogger("momentjs");

        @Override
        public void loadLibrary(VariableScope variableScope) {
            Context.enter();
            try (Reader reader = new InputStreamReader(VariableContextTest.class.getResourceAsStream("/lib/moment.min.js"))) {
                Context.getCurrentContext().evaluateReader(variableScope.getScope(), reader, "moment.js", 1, null);
            } catch (IOException e) {
                logger.error("Failed to load lib, so ignored.", e);
            }
            Context.exit();
        }
    }

    @Test
    public void testImportLib() {
        VariableContext vc = new VariableContext();
        vc.addJsLibrary(new MomentJsLib());

        vc.createScopeWithStorage("main", new LocalFsStorage("momentTest.v"));
        vc.execute("var test = moment().format('YYYY MM DD')");
        String result1 = (String) vc.getValue("test");

        VariableContext vc2 = new VariableContext();
        vc2.createScopeWithStorage("main2", new LocalFsStorage("momentTest.v"));
        Assert.assertEquals(result1, vc2.getValue("test"));
    }
}

