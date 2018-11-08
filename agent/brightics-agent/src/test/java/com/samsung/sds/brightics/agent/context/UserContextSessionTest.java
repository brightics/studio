package com.samsung.sds.brightics.agent.context;

import com.samsung.sds.brightics.common.core.acl.Permission;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;
import com.samsung.sds.brightics.common.data.DataStatus;
import com.samsung.sds.brightics.common.network.proto.ContextType;

import org.junit.Assert;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserContextSessionTest {
    private static final Logger LOGGER = LoggerFactory.getLogger("UserContextSessionTest");

    @Test
    public void removeDataStatusShouldRemoveAssociatedLinks() {
        UserContextSession session = new UserContextSession("test");

        session.addDataStatus("/test/temp/stat1", new DataStatus("test", ContextType.FILESYSTEM));
        session.addDataStatus("/test/temp/stat2", new DataStatus("test", ContextType.FILESYSTEM));
        session.addDataStatus("/test/temp/stat3", new DataStatus("test", ContextType.FILESYSTEM));

        session.addDataLink("/test/temp/alias1", "/test/temp/stat1");
        session.addDataLink("/test/temp/alias2", "/test/temp/stat2");

        session.removeDataStatus("/test/temp/stat1");

        Assert.assertEquals(1, session.getDataLinks().size());
        Assert.assertFalse(session.getDataLinks().containsKey("/test/temp/alias1"));
        Assert.assertTrue(session.getDataLinks().containsKey("/test/temp/alias2"));
    }

    @Test(expected = BrighticsCoreException.class)
    public void accessToOtherUsersPrivateDataShouldBeDenied() {
        ThreadLocalContext.put("user", "test");
        UserContextSession session = new UserContextSession("test");
        session.addDataStatus("/test/temp/stat1", new DataStatus("test", ContextType.FILESYSTEM));
        session.addDataStatus("/test/temp/stat2", new DataStatus("test", ContextType.FILESYSTEM));
        session.addDataStatus("/test/temp/stat3", new DataStatus("test", ContextType.FILESYSTEM));

        UserContextSession session2 = UserContextSessionLoader.loadUserContextSession("test2");
        session2.addDataStatus("/test2/temp/stat1", new DataStatus("test2", System.currentTimeMillis(), ContextType.FILESYSTEM, Permission.PRIVATE, null));
        session2.addDataStatus("/test2/temp/stat2", new DataStatus("test2", ContextType.FILESYSTEM));
        session2.addDataStatus("/test2/temp/stat3", new DataStatus("test2", ContextType.FILESYSTEM));

        Assert.assertEquals(Permission.PUBLIC, session2.getDataStatus("/test2/temp/stat3").acl);
        Assert.assertEquals("test2", session2.getDataStatus("/test2/temp/stat3").typeName);
        session2.getDataStatus("/test2/temp/stat1");
    }

    @Test
    public void testInfiniteLink() {
        ThreadLocalContext.put("user", "test");
        UserContextSession session = new UserContextSession("test");
        session.addDataLink("/test/temp/alias2", "/test/temp/alias5");
        session.addDataLink("/test/temp/alias3", "/test/temp/alias2");
        session.addDataLink("/test/temp/alias4", "/test/temp/alias3");
        session.addDataLink("/test/temp/alias5", "/test/temp/alias4");

        try {
            session.getLink("/test/temp/alias5");
        } catch (BrighticsCoreException e) {
            LOGGER.debug("cyclic data link test", e);
            Assert.assertEquals("5012", e.code);
        }

        // switch user to disable save session feature
        ThreadLocalContext.put("user", "test2");
        session.getDataLinks().clear();
        for (int i = 0; i <= 10001; i++) {
            session.addDataLink("/test/temp/alias" + (i + 1), "/test/temp/alias" + i);
        }
        try {
            session.getLink("/test/temp/alias10001");
        } catch (BrighticsCoreException e) {
            LOGGER.debug("Infinite loop test", e);
            Assert.assertEquals("5003", e.code);
        }
    }

    @Test
    public void shouldGetDataStatusFromOtherUserContextSession() {
        ThreadLocalContext.put("user", "test");
        UserContextSession session = new UserContextSession("test");
        session.addDataLink("/test/temp/alias", "/test2/temp/source");

        ThreadLocalContext.put("user", "test2");
        UserContextSession session2 = new UserContextSession("test2");
        session2.addDataStatus("/test2/temp/source", new DataStatus("typeNameInSession2", ContextType.FILESYSTEM));

        ThreadLocalContext.put("user", "test");
        Assert.assertNotNull(session.getDataStatus("/test/temp/alias"));
        Assert.assertEquals("typeNameInSession2", session.getDataStatus("/test/temp/alias").typeName);
    }
}
