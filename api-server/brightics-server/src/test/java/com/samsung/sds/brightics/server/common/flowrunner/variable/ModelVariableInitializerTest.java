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

package com.samsung.sds.brightics.server.common.flowrunner.variable;

import org.junit.Assert;
import org.junit.Test;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.samsung.sds.brightics.common.variable.context.VariableContext;

public class ModelVariableInitializerTest {

    @Test
    public void testSetVariables() {
        JsonObject variables = new JsonObject();

        variables.add("var3", newVariable(new JsonPrimitive("${=var1 + var2}")));
        variables.add("var1", newVariable(new JsonPrimitive(1)));
        variables.add("var2", newVariable(new JsonPrimitive(2)));
        variables.add("var4", newVariable(new JsonPrimitive("${=var3 + var5}")));
        variables.add("var5", newVariable(new JsonPrimitive("test")));

        ModelVariableInitializer initializer = new ModelVariableInitializer(variables);
        VariableContext vc = new VariableContext();
        initializer.setVariablesTo(vc);

        Assert.assertEquals(1, vc.getValue("var1"));
        Assert.assertEquals(2, vc.getValue("var2"));
        Assert.assertEquals(3, vc.getValue("var3"));
        Assert.assertEquals("3test", vc.getValue("var4"));
    }

    private JsonObject newVariable(JsonElement value) {
        JsonObject valueObject = new JsonObject();
        valueObject.add("value", value);
        return valueObject;
    }
}
