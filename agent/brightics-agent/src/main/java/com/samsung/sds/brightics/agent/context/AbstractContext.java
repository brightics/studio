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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.agent.service.task.TaskMessageWrapper;
import com.samsung.sds.brightics.common.data.DataStatus;
import com.samsung.sds.brightics.common.data.view.DataView;
import com.samsung.sds.brightics.common.data.view.Table;
import com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage;

/**
 * This class is abstract class of context runner. execute function, script or terminate task in context.
 */
public abstract class AbstractContext {

    protected String id;
    protected final Logger logger = LoggerFactory.getLogger(this.getClass().getSimpleName());

    public AbstractContext(String id) {
        this.id = id;
    }

    // init contextRunner
    abstract public void init(String contextType);

    // function task run.
    abstract public String runFunction(TaskMessageWrapper message) throws Exception;

    // script task run.
    abstract public String runScript(TaskMessageWrapper message) throws Exception;

    // terminate task.
    abstract public boolean stopTask(String targetTaskId) throws Exception;

    // close context runner
    abstract public void close();

    // remove memory variable in session
    abstract public void reset();

    // init data container
    abstract public void initDataMap();

    abstract public String viewData(String key, long min, long max, int[] columnIndex) throws Exception;

    abstract public String viewSchema(String key) throws Exception;

    abstract public String sqlData(ExecuteSqlMessage message) throws Exception;

    // send data status key and path (that contain root path)
    abstract public DataStatus writeData(String key, String path) throws Exception;

    abstract public boolean removeData(String key) throws Exception;
}
