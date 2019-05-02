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

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.stream.JsonReader;
import com.samsung.sds.brightics.common.core.gson.BrighticsGsonBuilder;

import java.io.InputStreamReader;
import org.junit.Assert;
import org.junit.Test;

public class LegacyVariableConverterTest {

    private static final Gson gson = BrighticsGsonBuilder.getGsonInstance();

    private JsonObject getJson(String path) {
        JsonReader jsonReader = new JsonReader(
            new InputStreamReader(LegacyVariableConverterTest.class.getResourceAsStream(path)));
        return gson.fromJson(jsonReader, JsonObject.class);
    }

    @Test
    public void test() {
        JsonObject model = getJson("/data/legacyVariable/calculationVariableTest.json");

        LegacyVariableConverter corrector = new LegacyVariableConverter();

        corrector.convertCalculationVariable(model.getAsJsonObject("mid"));
        Assert.assertFalse(model.getAsJsonObject("mid").getAsJsonObject("variables").getAsJsonObject("calVar1").has("type"));
        Assert.assertEquals("${=[\"var1Value\", \"var2Value\"]}",
            model.getAsJsonObject("mid").getAsJsonObject("variables").getAsJsonObject("calVar1").get("value").getAsString());
        Assert.assertEquals("${=eval('[' + [\"var1Value\", \"var2Value\"] + ']')}",
            model.getAsJsonObject("mid").getAsJsonArray("functions").get(0).getAsJsonObject().getAsJsonObject("param").getAsJsonObject("variables")
                .getAsJsonObject("subCalVar").get("value").getAsString());
    }

    @Test
    public void test2() {
        JsonObject model = getJson("/data/legacyVariable/calculationVariableTest2.json");

        LegacyVariableConverter corrector = new LegacyVariableConverter();

        corrector.convertCalculationVariable(model.getAsJsonObject("mid"));
        Assert.assertFalse(model.getAsJsonObject("mid").getAsJsonObject("variables").getAsJsonObject("calVar1").has("type"));
        Assert.assertEquals("${=[1, 2]}",
            model.getAsJsonObject("mid").getAsJsonObject("variables").getAsJsonObject("calVar1").get("value").getAsString());
        Assert.assertEquals("${=indexVariable}",
            model.getAsJsonObject("mid").getAsJsonArray("functions").get(0).getAsJsonObject().getAsJsonObject("param").getAsJsonObject("variables")
                .getAsJsonObject("test").get("value").getAsString());
        Assert.assertEquals("${=eval('[1, ' + eval('\'' + indexVariable + '\'') + ']')}",
            model.getAsJsonObject("mid").getAsJsonArray("functions").get(0).getAsJsonObject().getAsJsonObject("param").getAsJsonObject("variables")
                .getAsJsonObject("test2").get("value").getAsString());
    }
}
