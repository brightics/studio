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
