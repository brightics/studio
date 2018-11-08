package com.samsung.sds.brightics.agent.context.python;

import com.google.gson.Gson;
import com.samsung.sds.brightics.agent.context.AbstractContext;
import com.samsung.sds.brightics.agent.context.ContextManager;
import com.samsung.sds.brightics.agent.context.ScriptContext;
import com.samsung.sds.brightics.agent.service.task.TaskMessageWrapper;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.gson.BrighticsGsonBuilder;
import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.common.data.DataStatus;
import com.samsung.sds.brightics.common.data.client.KVStoreClient;
import com.samsung.sds.brightics.common.network.proto.ContextType;
import com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.commons.text.StringEscapeUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.CommonConfigurationKeysPublic;
import org.slf4j.Logger;
import py4j.GatewayServer;

import java.io.IOException;
import java.net.ServerSocket;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

@ScriptContext(contextType = ContextType.PYTHON)
public class PythonContext extends AbstractContext {

    private static final String EXCEPTION_SCRIPT_ERROR = "4325";
    private static final String EXCEPTION_PYTHON_DEAD = "4326";
    private static final String EXCEPTION_START_PROCESS_FAILED = "4327";

    private GatewayServer gatewayServer;

    private Process pythonProcess;
    private int pythonProcessPid = -1;

    private static final Gson gson = BrighticsGsonBuilder.getGsonInstance();

    private static final String SCRIPT_PATH;
    private static final String PYTHON_PATH;

    public static final String DEFAULT_FS_PATH;
    
    static {
        String FUNCTION_ROOT = SystemEnvUtil.getEnvOrPropOrElse("BRIGHTICS_FUNCTION_HOME", "brightics.function.home", "");

        Path PYTHON_SOURCE_REPO = Paths.get(FUNCTION_ROOT, "python", "brightics");

        SCRIPT_PATH = PYTHON_SOURCE_REPO.resolve("brightics_python_runner.py").toString();
        PYTHON_PATH = System.getenv("BRIGHTICS_PYTHON_PATH") == null ? "python" : System.getenv("BRIGHTICS_PYTHON_PATH");

        DEFAULT_FS_PATH = new Configuration()
                .get(CommonConfigurationKeysPublic.FS_DEFAULT_NAME_KEY, CommonConfigurationKeysPublic.FS_DEFAULT_NAME_DEFAULT);
        
    }

    public PythonContext(String id) {
        super(id);
    }

    @Override
    public void init() {
        startPy4JServer();
        startPythonProcess();

        initializeStates();

        Runtime.getRuntime().addShutdownHook(new Thread("PythonContextShutdownHook") {
            @Override
            public void run() {
                PythonContext.this.close();
            }
        });
    }

    @Override
    public String runFunction(TaskMessageWrapper message) {
        if (pythonProcess == null || !pythonProcess.isAlive()) {
            logger.info("Python process terminated. Try to init python process again.");
            init();
        }

        try {
            return run(PythonScriptType.Function.getSource(message));
        } catch (BrighticsCoreException bce) {
            throw bce;
        } catch (Exception e) {
            throw new BrighticsCoreException(EXCEPTION_SCRIPT_ERROR, e.getMessage())
                    .addDetailMessage(ExceptionUtils.getStackTrace(e));
        }
    }

    @Override
    public String runScript(TaskMessageWrapper message) {
        if (pythonProcess == null || !pythonProcess.isAlive()) {
            logger.info("Python process terminated. Try to init python process again.");
            init();
        }

        PythonScriptType type = PythonScriptType.getType(message);

        try {
            return run(type.getSource(message));
        } catch (BrighticsCoreException bce) {
            if (type == PythonScriptType.DLPythonScript) {
                writeDLErrorFile(message, ExceptionUtils.getStackTrace(bce.getCause()));
            }
            throw bce;
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
        if (pythonProcessPid == -1) {
            close();
            throw new BrighticsCoreException(EXCEPTION_PYTHON_DEAD);
        }

        try {
            Runtime.getRuntime().exec("kill -SIGINT " + pythonProcessPid);
            return true;
        } catch (IOException e) {
            logger.error("Failed to stop task " + e.getMessage());
        } finally {
            initializeStates();
        }

        return false;
    }

    @Override
    public void close() {
        try {
            if (pythonProcess != null && pythonProcess.isAlive()) {
                if (pythonProcessPid > 0) {
                    run("exit()");
                } else {
                    pythonProcess.destroyForcibly();
                }
            }
        } catch (BrighticsCoreException bce) {
            if (!EXCEPTION_PYTHON_DEAD.equals(bce.code)) {
                logger.info("Failed to close python process smoothly");
                pythonProcess.destroyForcibly();
            }
        } catch (Exception e) {
            logger.info("Failed to close python process smoothly");
            pythonProcess.destroyForcibly();
        }

        gatewayServer.shutdown();
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
            return run(String.format("view_data('%s')", key), true);
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
            return run(String.format("view_schema('%s')", key), true);
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
            String dataStatus = run(PythonScriptBuilder.makeWriteDataScript(key, path), true);
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
            String result = run(String.format("delete_data(\"%s\");", key));
            return Boolean.parseBoolean(result);
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

    private void startPy4JServer() {
        int port = availablePort();

        logger.info("Py4J Server start Java side port [" + String.valueOf(port) + "]");

        if (gatewayServer != null) {
            gatewayServer.shutdown();
        }

        gatewayServer = new GatewayServer(this, port, GatewayServer.DEFAULT_PYTHON_PORT, 0, 0, null);
        gatewayServer.start();

        logger.info("Py4J Server successfully started");
    }

    private static int availablePort() {
        try {
            ServerSocket socket = new ServerSocket(0);
            int ports = socket.getLocalPort();

            socket.close();

            return ports;
        } catch (IOException e) {
            throw new BrighticsCoreException(EXCEPTION_START_PROCESS_FAILED, "Cannot find available ports to start py4j gateway server")
                    .addDetailMessage(ExceptionUtils.getStackTrace(e));
        }
    }

    private CountDownLatch pythonProcessLatch;

    private void startPythonProcess() throws BrighticsCoreException {
        logger.info("Python process start");
        pythonProcessLatch = new CountDownLatch(1);

        if (gatewayServer == null) {
            startPy4JServer(); // throw new BrighticsException() ?
        }

        ProcessBuilder builder = new ProcessBuilder(
                PYTHON_PATH,
                SCRIPT_PATH,
                String.valueOf(SystemEnvUtil.IS_SPARK_USE),
                String.valueOf(gatewayServer.getPort()));

        logger.info(String.format("%s %s %s %s",
                PYTHON_PATH,
                SCRIPT_PATH,
                String.valueOf(SystemEnvUtil.IS_SPARK_USE),
                String.valueOf(gatewayServer.getPort())));

        try {
            pythonProcess = builder.start();

            if (!pythonProcessLatch.await(30, TimeUnit.SECONDS)) {
                logger.error("Failed to start external python process");
                close();
                throw new BrighticsCoreException(EXCEPTION_START_PROCESS_FAILED, "Failed to start external python process.");
            }
        } catch (IOException | InterruptedException e) {
            logger.error("Failed to start external python process", e);
            close();
            throw new BrighticsCoreException(EXCEPTION_START_PROCESS_FAILED, "Failed to start external python process.");
        }
    }

    private final Object availableLock = new Object();
    private boolean isAvailable = true;

    private final Object scriptLock = new Object();

    private final Object runningLock = new Object();
    private boolean isRunning = false;

    private String script = StringUtils.EMPTY;
    private String result = StringUtils.EMPTY;

    private boolean isException = false;
    private String exceptionCode = StringUtils.EMPTY;
    private String exceptionMsg = StringUtils.EMPTY;

    private void initializeStates() {
        isAvailable = true;
        isRunning = false;
    }

    private String run(String script) throws Exception {
        return run(script, false);
    }

    private synchronized String run(String script, boolean unescapeString) throws Exception {
        if (pythonProcessPid < 0) {
            throw new BrighticsCoreException(EXCEPTION_PYTHON_DEAD);
        }

        if (StringUtils.isBlank(script)) {
            return StringUtils.EMPTY;
        }

        synchronized (availableLock) {
            while (!isAvailable && pythonProcessPid > 0) {
                availableLock.wait(1000);
            }
            isAvailable = false;
        }

        isException = false;
        exceptionCode = StringUtils.EMPTY;
        exceptionMsg = StringUtils.EMPTY;
        setScript(script);

        synchronized (runningLock) {
            while ((StringUtils.isNoneBlank(this.script) || isRunning) && pythonProcessPid > 0) {
                runningLock.wait(1000);
            }
        }

        synchronized (availableLock) {
            this.isAvailable = true;
            availableLock.notifyAll();
        }

        if (isException) {
            if (StringUtils.isNotBlank(exceptionCode)) {
                throw new BrighticsCoreException(exceptionCode, exceptionMsg).addDetailMessage(this.result);
            }

            throw new Exception(exceptionMsg, new Throwable(this.result));
        }

        if (unescapeString) {
            // unescape result since result string is escaped twice  ex) \\" -> \"
            return StringEscapeUtils.unescapeJava(this.result.replaceAll("^'|'$", ""));
        } else {
            return this.result;
        }
    }

    private void setScript(String script) {
        synchronized (scriptLock) {
            logger.info("Set new script");

            this.script = script;

            scriptLock.notifyAll();
        }
    }

    public String getScript() {
        synchronized (scriptLock) {
            while (StringUtils.isEmpty(this.script)) {
                try {
                    scriptLock.wait(1000);
                } catch (InterruptedException e) {
                    logger.error("Failed to get script");
                }
            }
            this.isRunning = true;

            logger.info("Python process get script. Status is running");

            String s = this.script;
            this.script = StringUtils.EMPTY;
            return s;
        }
    }

    /*
     * All methods below this line used in python side, so just ignore never used warning
     */

    /**
     * Set current user id to ThreadLocalContext from python side thread
     */
    public void setUserToThreadLocalContext() {
        ThreadLocalContext.put("user", id);
    }

    public void setPid(int pythonProcessPid) {
        logger.info("Python process successfully started. Pid is " + String.valueOf(pythonProcessPid));

        this.pythonProcessPid = pythonProcessPid;
        pythonProcessLatch.countDown();
    }

    public Logger getLogger() {
        return logger;
    }

    public String getDefaultFsPath() {
        return DEFAULT_FS_PATH;
    }

    public String getDataRoot() {
        return SystemEnvUtil.BRIGHTICS_DATA_ROOT;
    }

    public void notifyPythonProcessFinished(String result, boolean isException, String exceptionMsg) {
        synchronized (runningLock) {
            this.isRunning = false;
            this.result = result.replaceAll("\\s+$", "");
            this.isException = isException;
            this.exceptionMsg = exceptionMsg;

            runningLock.notifyAll();
        }
    }

    public void notifyBrighticsCoreException(String result, String code, String message) {
        synchronized (runningLock) {
            this.isRunning = false;
            this.result = result.replaceAll("\\s+$", "");
            this.isException = true;
            this.exceptionCode = code;
            this.exceptionMsg = message;

            runningLock.notifyAll();
        }
    }

    public void notifyPythonProcessShutdown() {
        this.pythonProcessPid = -1;
        this.isRunning = false;
        this.isException = false;
        this.exceptionMsg = StringUtils.EMPTY;
    }

    public void notifyDataUpdated(String key, DataStatus status) {
        logger.info("Python runner data updated. Data key[" + key + "]");
        ContextManager.updateCurrentDataStatus(key, status);
    }

    public void notifyDataDeleted(String key) {
        logger.info("Python runner data deleted. Data key[" + key + "]");
        ContextManager.getCurrentUserContextSession().removeDataStatus(key);
    }

    public void putToKVStore(String key, String data) {
        KVStoreClient.getInstance().put(key, data);
    }

    public String getFromKVStore(String key) {
        return KVStoreClient.getInstance().get(key, String.class);
    }
}
