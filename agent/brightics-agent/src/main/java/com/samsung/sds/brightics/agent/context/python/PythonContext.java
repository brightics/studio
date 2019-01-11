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

@ScriptContext(contextType = ContextType.PYTHON)
public class PythonContext extends AbstractContext {

    private static final String EXCEPTION_SCRIPT_ERROR = "4325";

    private static final Gson gson = BrighticsGsonBuilder.getGsonInstance();

    PythonProcessManager processManager;

    public PythonContext(String id) {
        super(id);
    }

    @Override
    public void init() {
        processManager = new PythonProcessManager(id);
        processManager.init();

        Runtime.getRuntime().addShutdownHook(new Thread("PythonContextShutdownHook") {
            @Override
            public void run() {
                PythonContext.this.close();
            }
        });
    }

    @Override
    public String runFunction(TaskMessageWrapper message) {
        if (processManager == null || !processManager.isAlive()) {
            logger.info("Python process terminated. Try to init python process again.");
            processManager = new PythonProcessManager(id);
            processManager.init();
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
        if (processManager == null || !processManager.isAlive()) {
            logger.info("Python process terminated. Try to init python process again.");
            processManager = new PythonProcessManager(id);
            processManager.init();
        }

        PythonScriptType type = PythonScriptType.getType(message);

        try {
            return processManager.run(type.getSource(message));
        } catch (AbsBrighticsException be) {
            if (type == PythonScriptType.DLPythonScript) {
                writeDLErrorFile(message, ExceptionUtils.getStackTrace(be.getCause()));
            }
            throw be;
        } catch (Exception e) {
            if (type == PythonScriptType.DLPythonScript) {
                writeDLErrorFile(message, ExceptionUtils.getStackTrace(e.getCause()));
            }
            throw new BrighticsCoreException(EXCEPTION_SCRIPT_ERROR, e.getMessage()).initCause(e.getCause());
        }
    }

    private void writeDLErrorFile(TaskMessageWrapper message, String errMessage) {
        String logPath = message.params.getOrException("logPath");
        String logName = message.params.getOrException("logName");

        Path path = Paths.get(logPath, logName + ".err");

        try {
            Files.write(path, errMessage.getBytes(), StandardOpenOption.CREATE_NEW);
        } catch (IOException e) {
            logger.error("Error occurred while write Deep Learning error message");
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
    public String viewData(String key, long min, long max) {
        logger.info("View data {}", key);
        // FIXME add support for min and max
        try {
            return processManager.run(String.format("view_data('%s')", key), true);
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
        init();
    }
}
