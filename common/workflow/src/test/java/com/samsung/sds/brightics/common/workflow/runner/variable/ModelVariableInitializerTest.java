package com.samsung.sds.brightics.common.workflow.runner.variable;

import org.junit.Assert;
import org.junit.Test;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.workflow.flowrunner.variable.ModelVariableInitializer;

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
