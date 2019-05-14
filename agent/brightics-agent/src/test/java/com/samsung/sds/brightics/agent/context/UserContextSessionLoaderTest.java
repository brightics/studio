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

package com.samsung.sds.brightics.agent.context;

import static com.samsung.sds.brightics.agent.context.UserContextSessionLoader.buildPath;

import java.io.File;

import org.apache.commons.lang3.StringUtils;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.common.data.DataStatus;
import com.samsung.sds.brightics.common.network.proto.ContextType;

public class UserContextSessionLoaderTest {

    private Logger logger = LoggerFactory.getLogger(UserContextSessionLoaderTest.class);
    private static final String user = "admin";

    @Before
    public void setup() {
        File dir = new File(buildPath(user));
        mkdirs(dir);

        File table1 = new File(buildPath(user, "model1", "table1"));
        mkdirs(table1);

        File table2 = new File(buildPath(user, "model2", "table2"));
        mkdirs(table2);

        File shareTable = new File(buildPath("shared", "upload", "shareTable"));
        mkdirs(shareTable);

        File shareTable2 = new File(buildPath("shared", "upload", "shareTable2"));
        if (!shareTable2.delete()) {
            logger.debug("failed to delete sharedTable2");
        }

        ThreadLocalContext.put("user", user);

        UserContextSession session = new UserContextSession(user);
        session.addDataLink("/admin/temp/alias1", "/admin/temp/source1");
        session.addDataLink("/admin/temp/alias2", "/admin/temp/source1");
        session.addDataStatus("/admin/temp/source1", new DataStatus("test", ContextType.FILESYSTEM));
    }

    private void mkdirs(File dir) {
        if (!dir.mkdirs()) {
            logger.debug("{} already exists", dir.getPath());
        }
    }

    @Test
    public void testLoadSessionFromData() {
        ThreadLocalContext.put("user", user);
        UserContextSession contextSession = UserContextSessionLoader.loadUserContextSession(user);
        Assert.assertEquals("/admin/temp/source1", contextSession.getLink("/admin/temp/alias1"));
        Assert.assertEquals("/admin/temp/source1", contextSession.getLink("/admin/temp/alias2"));
        Assert.assertEquals("test", contextSession.getDataStatus("/admin/temp/source1").typeName);
        Assert.assertEquals(ContextType.FILESYSTEM, contextSession.getDataStatus("/admin/temp/source1").contextType);

        Assert.assertEquals(ContextType.FILESYSTEM, contextSession.getDataStatus(getDataKeyFrom(buildPath(user, "model1", "table1"))).contextType);
        Assert.assertEquals(ContextType.FILESYSTEM, contextSession.getDataStatus(getDataKeyFrom(buildPath(user, "model2", "table2"))).contextType);
        Assert.assertEquals(ContextType.FILESYSTEM, contextSession.getDataStatus(getDataKeyFrom(buildPath("shared", "upload", "shareTable"))).contextType);

        File shareTable2 = new File(buildPath("shared", "upload", "shareTable2"));
        mkdirs(shareTable2);
        Assert.assertEquals(ContextType.FILESYSTEM, contextSession.getDataStatus(getDataKeyFrom(buildPath("shared", "upload", "shareTable2"))).contextType);
        File uploadTable = new File(buildPath(user, "upload", "uploadTable"));
        mkdirs(uploadTable);
        Assert.assertEquals(ContextType.FILESYSTEM, contextSession.getDataStatus(getDataKeyFrom(buildPath(user, "upload", "uploadTable"))).contextType);

        logger.info("dataLinks : {}", contextSession.getDataLinks());
        logger.info("dataStatuses : {}", contextSession.getDataStatuses());
    }

    private String getDataKeyFrom(String path) {
    	if(StringUtils.isEmpty(SystemEnvUtil.BRIGHTICS_DATA_ROOT)){
    		return path;
    	}
        return path.replaceAll("^/" + SystemEnvUtil.BRIGHTICS_DATA_ROOT + "/", "/");
    }
}
