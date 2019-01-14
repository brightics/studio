package com.samsung.sds.brightics.agent.context.python;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.agent.context.ContextManager;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.exception.BrighticsFunctionException;
import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.data.DataStatus;
import com.samsung.sds.brightics.common.data.client.KVStoreClient;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.commons.text.StringEscapeUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.CommonConfigurationKeysPublic;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import py4j.GatewayServer;

import java.io.IOException;
import java.net.ServerSocket;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

public class PythonProcessManager {

    private final Logger logger = LoggerFactory.getLogger(this.getClass().getSimpleName());

    private static final String EXCEPTION_START_PROCESS_FAILED = "4327";
    private static final String EXCEPTION_PYTHON_DEAD = "4326";

    private static final String SCRIPT_PATH;
    private static final String PYTHON_PATH;

    public static final String DEFAULT_FS_PATH;

    private String id;

    private GatewayServer gatewayServer;
    private Process pythonProcess;
    private int pythonProcessPid = -1;

    static {
    	String FUNCTION_ROOT = SystemEnvUtil.getEnvOrPropOrElse("BRIGHTICS_FUNCTION_HOME", "brightics.function.home", "");

        Path PYTHON_SOURCE_REPO = Paths.get(FUNCTION_ROOT, "python", "brightics");

        SCRIPT_PATH = PYTHON_SOURCE_REPO.resolve("brightics_python_runner.py").toString();
        PYTHON_PATH = System.getenv("BRIGHTICS_PYTHON_PATH") == null ? "python" : System.getenv("BRIGHTICS_PYTHON_PATH");

        DEFAULT_FS_PATH = new Configuration()
                .get(CommonConfigurationKeysPublic.FS_DEFAULT_NAME_KEY, CommonConfigurationKeysPublic.FS_DEFAULT_NAME_DEFAULT);
     }

    PythonProcessManager(String id) {
        this.id = id;
    }

    void init() {
        startPy4JServer();
        startPythonProcess();

        initializeStates();
    }

    void shutdown() {
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

        pythonProcessPid = -1;
        gatewayServer.shutdown();
    }

    boolean interrupt() {
        if (pythonProcessPid == -1) {
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

    boolean isAlive() {
        return pythonProcessPid != -1 && (pythonProcess != null && pythonProcess.isAlive());
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
            builder.redirectErrorStream(true);
//            FIXME redirect logs to slf4j not file
//            builder.redirectOutput(ProcessBuilder.Redirect.appendTo(Paths.get(".", "logs", "python.log").toFile()));
            pythonProcess = builder.start();

            if (!pythonProcessLatch.await(30, TimeUnit.SECONDS)) {
                logger.error("Failed to start external python process");
                shutdown();
                throw new BrighticsCoreException(EXCEPTION_START_PROCESS_FAILED, "Failed to start external python process.");
            }
        } catch (IOException | InterruptedException e) {
            logger.error("Failed to start external python process", e);
            shutdown();
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
    private String[] exceptionMsg = ArrayUtils.EMPTY_STRING_ARRAY;
    private List<Map<String, String[]>> functionException = null;

    private void initializeStates() {
        isAvailable = true;
        isRunning = false;
    }

    String run(String script) throws Exception {
        return run(script, false);
    }

    synchronized String run(String script, boolean unescapeString) throws Exception {
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
        exceptionMsg = ArrayUtils.EMPTY_STRING_ARRAY;
        functionException = null;

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
            if (functionException != null) {
                throw new BrighticsFunctionException(functionException).addDetailMessage(this.result);
            } else if (StringUtils.isNotBlank(exceptionCode)) {
                throw new BrighticsCoreException(exceptionCode, exceptionMsg).addDetailMessage(this.result);
            }
            throw new Exception(exceptionMsg[0], new Throwable(this.result));
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
            this.exceptionMsg = new String[]{exceptionMsg};

            runningLock.notifyAll();
        }
    }

    public void notifyBrighticsCoreException(String result, String code, String message) {
        synchronized (runningLock) {
            this.isRunning = false;
            this.result = result.replaceAll("\\s+$", "");
            this.isException = true;
            this.exceptionCode = code;
            this.exceptionMsg = new String[]{message};

            runningLock.notifyAll();
        }
    }

    public void notifyBrighticsFunctionException(String result, String functionErrorJson) {
        synchronized (runningLock) {
            try {
                this.isRunning = false;
                this.isException = true;
                this.functionException = getFunctionException(functionErrorJson);
                this.result = result.replaceAll("\\s+$", "");
            } catch (Exception e) {
                logger.error("Cannot notify BrighticsFunctionException.", e);
                this.exceptionCode = "3102";
                String[] message = {"cannot notify function exception."};
                this.exceptionMsg = message;
                this.result = ExceptionUtils.getStackTrace(e);
            } finally {
                runningLock.notifyAll();
            }
        }
    }

    private List<Map<String, String[]>> getFunctionException(String functionErrorJson) {
        List<Map<String, String[]>> functionErrors = new ArrayList<>();
        JsonElement jsonErrorsEm = JsonUtil.jsonToElement(functionErrorJson);
        for (JsonElement errorEm : jsonErrorsEm.getAsJsonArray()) {
            JsonObject errorObj = errorEm.getAsJsonObject();
            Map<String, String[]> errorMap = new HashMap<>();
            for (String errorCode : errorObj.keySet()) {
                JsonArray paramsObj = errorObj.getAsJsonArray(errorCode);
                String[] params = new String[paramsObj.size()];
                for (int i = 0; i < params.length; i++) {
                    params[i] = paramsObj.get(i).getAsString();
                }
                errorMap.put(errorCode, params);
            }
            functionErrors.add(errorMap);
        }
        return functionErrors;
    }

    public void notifyPythonProcessShutdown() {
        this.pythonProcessPid = -1;
        this.isRunning = false;
        this.isException = false;
        this.exceptionMsg = ArrayUtils.EMPTY_STRING_ARRAY;
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
