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

package com.samsung.sds.brightics.common.core.test;

import org.junit.Assert;
import org.junit.Test;

import com.samsung.sds.brightics.common.core.legacy.util.LegacyFunctionUtil;

public class LegacyFunctionUtilTest {

    @Test
    public void testGetLegacyFuncParamToScalaString() {
        String param = "{\"a\":[1,2,3], \"b\":\"123\", \"c\":null, \"obj\":{}}";
        String attr = "{\"inData\":[\"t1\"], \"outData\":[]}";
        Assert.assertEquals(
                "Map(\"a\" -> Array(1, 2, 3), \"b\" -> \"123\", \"c\" -> null, \"obj\" -> Map(), \"in-table\" -> Array(\"t1\"), \"out-table\" -> Array())",
                LegacyFunctionUtil.getLegacyFuncParamToScalaString(param, attr));
    }
}
