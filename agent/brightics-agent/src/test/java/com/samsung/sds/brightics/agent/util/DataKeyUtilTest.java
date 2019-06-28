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

package com.samsung.sds.brightics.agent.util;

import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;
import org.apache.http.util.Asserts;
import org.junit.Assert;
import org.junit.Test;

public class DataKeyUtilTest {

    @Test
    public void testCreateDataKey() {
        ThreadLocalContext.put("user", "test");
        Assert.assertEquals("/test/mid/tid", DataKeyUtil.createDataKey("mid", "tid"));
        Assert.assertEquals("/test/mid2/tid", DataKeyUtil.createDataKey("mid2", "tid"));
        ThreadLocalContext.put("user", "test2");
        Assert.assertEquals("/test2/mid/tid", DataKeyUtil.createDataKey("mid", "tid"));
        Assert.assertEquals("/test2/mid2/tid", DataKeyUtil.createDataKey("mid2", "tid"));
    }

    @Test
    public void testIsSharedDataKey() {
        Assert.assertTrue(DataKeyUtil.isSharedDataKey("/shared/upload/test"));
        Assert.assertTrue(DataKeyUtil.isSharedDataKey("/shared/upload/iris"));
        Assert.assertFalse(DataKeyUtil.isSharedDataKey("/shared/test/iris"));
        Assert.assertFalse(DataKeyUtil.isSharedDataKey("/shared/iris"));
    }
}
