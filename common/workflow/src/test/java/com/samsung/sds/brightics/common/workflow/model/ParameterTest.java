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

package com.samsung.sds.brightics.common.workflow.model;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import java.util.HashMap;
import java.util.Map;
import org.junit.Assert;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ParameterTest {

    private static final Logger LOGGER = LoggerFactory.getLogger("ParameterTest");

    @Test
    public void test() {
        Map<String, JsonElement> parameterMap = new HashMap<>();
        byte b = 0;
        parameterMap.put("byte", new JsonPrimitive(b));
        parameterMap.put("int", new JsonPrimitive(1));
        parameterMap.put("float", new JsonPrimitive(1.5f));
        parameterMap.put("double", new JsonPrimitive(2.5d));

        JsonArray arr1d = new JsonArray();
        arr1d.add(1.5);
        arr1d.add(2.5);
        arr1d.add(3.5);
        JsonArray arr2d = new JsonArray();
        JsonArray arr2dRow1 = new JsonArray();
        arr2dRow1.add(1.5);
        arr2dRow1.add(2.5);
        arr2dRow1.add(3.5);
        arr2d.add(arr2dRow1);
        JsonArray arr2dRow2 = new JsonArray();
        arr2dRow2.add(4.5);
        arr2dRow2.add(5.5);
        arr2dRow2.add(6.5);
        arr2d.add(arr2dRow2);

        parameterMap.put("1darray", arr1d);
        parameterMap.put("2darray", arr2d);

        JsonObject m = new JsonObject();
        m.addProperty("a", 1);
        m.addProperty("b", "c");
        parameterMap.put("map", m);

        Parameters p = new Parameters(parameterMap);
        LOGGER.debug(p.toString());

        Assert.assertEquals(b, p.getNumber("byte"));
        Assert.assertEquals(1, p.getNumber("int"));
        Assert.assertEquals(1.5f, p.getNumber("float"));
        Assert.assertEquals(2.5d, p.getNumber("double"));

        Assert.assertArrayEquals(new Number[]{1.5, 2.5, 3.5}, p.getNumericArray("1darray"));
        Assert.assertArrayEquals(new Number[][]{{1.5, 2.5, 3.5}, {4.5, 5.5, 6.5}}, p.getNumeric2dArray("2darray"));
    }

}
