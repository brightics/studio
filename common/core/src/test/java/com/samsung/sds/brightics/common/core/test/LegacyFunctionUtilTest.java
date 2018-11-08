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
