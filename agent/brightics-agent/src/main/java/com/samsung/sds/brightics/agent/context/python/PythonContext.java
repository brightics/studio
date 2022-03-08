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

package com.samsung.sds.brightics.agent.context.python;

import com.google.gson.Gson;
import com.samsung.sds.brightics.agent.context.AbstractContext;
import com.samsung.sds.brightics.agent.context.ScriptContext;
import com.samsung.sds.brightics.agent.service.task.TaskMessageWrapper;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.gson.BrighticsGsonBuilder;
import com.samsung.sds.brightics.common.data.DataStatus;
import com.samsung.sds.brightics.common.network.proto.ContextType;
import com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage;
import org.apache.commons.lang3.exception.ExceptionUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Arrays;
import java.util.stream.Collectors;

@ScriptContext(contextType = {ContextType.PYTHON, ContextType.DLPYTHON})
public class PythonContext extends AbstractContext {

    private static final String EXCEPTION_SCRIPT_ERROR = "4325";

    private static final Gson gson = BrighticsGsonBuilder.getGsonInstance();

    private PythonProcessManager processManager;
    private String contextType;

    public PythonContext(String id) {
        super(id);
    }

    @Override
    public void init(String contextType) {
        this.contextType = contextType;
        processManager = new PythonProcessManager(id);
        processManager.init(contextType);
    }

    @Override
    public String runFunction(TaskMessageWrapper message) {
        if (processManager == null || !processManager.isAlive()) {
            logger.info("Python process terminated. Try to init python process again.");
            processManager = new PythonProcessManager(id);
            processManager.init(this.contextType);
        }

        try {
            return processManager.run(PythonScriptType.Function.getSource(message));
        } catch (AbsBrighticsException be) {
            throw be;
        } catch (Exception e) {
            throw new BrighticsCoreException(EXCEPTION_SCRIPT_ERROR, e.getMessage()).addDetailMessage(ExceptionUtils.getStackTrace(e));
        }
    }

    @Override
    public String runScript(TaskMessageWrapper message) {
        PythonScriptType type = PythonScriptType.getType(message);

        if (processManager == null || !processManager.isAlive()) {
            logger.info("Python process terminated. Try to init python process again.");
            processManager = new PythonProcessManager(id);
            processManager.init(contextType);
        }

        try {
            return processManager.run(type.getSource(message));
        } catch (AbsBrighticsException be) {
            throw be;
        } catch (Exception e) {
            throw new BrighticsCoreException(EXCEPTION_SCRIPT_ERROR, e.getMessage()).initCause(e.getCause())
                    .addDetailMessage(ExceptionUtils.getStackTrace(e));
        }
    }

    @Override
    public boolean stopTask(String targetTaskId) {
        try {
            return processManager.interrupt();
        } catch (BrighticsCoreException bce) {
            close();
            throw bce;
        }
    }

    @Override
    public void close() {
        if (processManager != null) {
            processManager.shutdown();
            processManager = null;
        }
    }

    @Override
    public void initDataMap() {
        // DO NOTHING (DO ON PYTHON SIDE)
    }

    @Override
    public String viewData(String key, long min, long max, int[] columnIndex) {
        logger.info("View data {}, min {}, max{}", key, min, max);
        try {
            if (columnIndex != null && columnIndex.length > 0) {
                return processManager.run(String.format("view_data('%s', %d, %d, %s)", key, min, max
                        , Arrays.stream(columnIndex).mapToObj(i -> String.valueOf(i))
                                .collect(Collectors.joining(", ", "column_index = [", "]"))), true);
            } else {
                return processManager.run(String.format("view_data('%s', %d, %d)", key, min, max), true);
            }
        } catch (Exception e) {
            logger.error("Error occurred while view data {}", key);
            logger.error(e.getMessage());
            throw new BrighticsCoreException("4342", key);
        }
    }

    @Override
    public String viewSchema(String key) {
        logger.info("View schema {}", key);
        try {
            return processManager.run(String.format("view_schema('%s')", key), true);
        } catch (Exception e) {
            logger.error("Error occurred while view schema {}", key);
            logger.error(e.getMessage());
            throw new BrighticsCoreException("4342", key);
        }
    }

    @Override
    public DataStatus writeData(String key, String path) {
        logger.info("Write {} data to {}", key, path);
        try {
            String dataStatus = processManager.run(PythonScriptBuilder.makeWriteDataScript(key, path), true);
            return gson.fromJson(dataStatus, DataStatus.class);
        } catch (Exception e) {
            logger.error("Error occurred while write {} data to {}", key, path);
            logger.error(e.getMessage());
            return null;
        }
    }

    @Override
    public boolean removeData(String key) {
        logger.info("Remove data with key {}", key);
        try {
            String removeResult = processManager.run(String.format("delete_data(\"%s\");", key));
            return Boolean.parseBoolean(removeResult);
        } catch (Exception e) {
            logger.error("Error occurred while remove data with key {}", key);
            logger.error(e.getMessage());
            return false;
        }
    }

    @Override
    public String sqlData(ExecuteSqlMessage message) {
        // Not implement on python context
        return null;
    }

    @Override
    public void reset() {
        close();
        init(this.contextType);
    }
}
