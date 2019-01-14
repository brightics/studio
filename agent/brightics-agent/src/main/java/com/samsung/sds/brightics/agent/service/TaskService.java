package com.samsung.sds.brightics.agent.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map.Entry;
import java.util.Set;

import org.apache.commons.lang3.EnumUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonElement;
import com.google.protobuf.Any;
import com.samsung.sds.brightics.agent.BrighticsAgent;
import com.samsung.sds.brightics.agent.context.ContextManager;
import com.samsung.sds.brightics.agent.service.task.RunningTasks;
import com.samsung.sds.brightics.agent.service.task.TaskMessageWrapper;
import com.samsung.sds.brightics.agent.util.DataKeyUtil;
import com.samsung.sds.brightics.agent.util.StopWatch;
import com.samsung.sds.brightics.agent.util.ThreadUtil;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;
import com.samsung.sds.brightics.common.data.DataStatus;
import com.samsung.sds.brightics.common.data.util.SafeParser;
import com.samsung.sds.brightics.common.network.proto.ContextType;
import com.samsung.sds.brightics.common.network.proto.FailResult;
import com.samsung.sds.brightics.common.network.proto.FailResult.Builder;
import com.samsung.sds.brightics.common.network.proto.MessageStatus;
import com.samsung.sds.brightics.common.network.proto.SuccessResult;
import com.samsung.sds.brightics.common.network.proto.metadata.AliasMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage;
import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage;

public class TaskService {

    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    /**
     * This method used asynchronous task execution.
     */
    public static void receiveAsyncTask(ExecuteTaskMessage request) {
        String taskId = request.getTaskId();
        String userId = request.getUser();
        if (RunningTasks.contains(taskId)) {
            logger.error("TaskId is duplicate.");
            BrighticsAgent.network.getSender()
                    .sendTaskResult(getFailResult(taskId, new BrighticsCoreException("4114")));
        } else {
            ThreadGroup tg = new ThreadGroup(taskId);
            Thread runnable = new Thread(tg, taskId + "-main") {
                @Override
                public void run() {
                    try {
                        // add thread local context
                        ThreadLocalContext.put("user", request.getUser());
                        ThreadLocalContext.put("taskId", request.getTaskId());
                        ThreadLocalContext.put("taskName", request.getName());

                        long t0 = System.currentTimeMillis();
                        ResultTaskMessage resultMessage = getTaskResult(request);
                        RunningTasks.complete(taskId);
                        long timeTaken = System.currentTimeMillis() - t0;
                        StopWatch.durationFromMillisToHumanReadable(timeTaken);

                        BrighticsAgent.network.getSender().sendTaskResult(resultMessage);
                    } catch (Throwable e) {
                        RunningTasks.complete(taskId);
                        logger.error("Task(" + taskId + ") by " + userId + " is failed.", e);
                        BrighticsAgent.network.getSender().sendTaskResult(getFailResult(taskId,
                                new BrighticsCoreException("3001").addDetailMessage(ExceptionUtils.getStackTrace(e))));
                    } finally {
                        BrighticsAgent.listener.onCompleted(taskId);
                        logger.info("Task(" + taskId + ") by " + userId + " is finished.");
                    }
                }
            };
            runnable.start();
            RunningTasks.add(taskId, tg);
            logger.info("Task(" + taskId + ") by " + userId + " added.");
        }
    }

    /**
     * This method is getting request task result.
     */
    public static ResultTaskMessage getTaskResult(ExecuteTaskMessage request) {
        String taskId = request.getTaskId();
        String userId = request.getUser();
        long t0 = System.currentTimeMillis();
        try {
            logger.info("Task(" + taskId + ") by " + userId + " starting.");
            String result = executeTaskToContext(new TaskMessageWrapper(request));
            long timeTaken = System.currentTimeMillis() - t0;
            String elapsedTime = StopWatch.durationFromMillisToHumanReadable(timeTaken);
            logger.info("Task(" + taskId + ") by " + userId + " finished in " + elapsedTime);
            return getSuccessResult(taskId, elapsedTime, result);
        } catch (InterruptedException ie) {
            logger.info("Task(" + taskId + ") by " + userId + " terminated");
            try {
                return getFailResult(taskId,
                        new BrighticsCoreException("4409").addDetailMessage(ExceptionUtils.getStackTrace(ie)));
            } catch (Throwable e) {
                logger.error("Task(" + taskId + ") by " + userId + " terminate is failed.", e);
                return getFailResult(taskId,
                        new BrighticsCoreException("3001").addDetailMessage(ExceptionUtils.getStackTrace(e)));
            }
        } catch (AbsBrighticsException e) {
            String detailMessage = "";
            if (StringUtils.isNoneBlank(e.detailedCause)) {
                detailMessage = e.detailedCause;
            }
            logger.error("Task(" + taskId + ") by " + userId + " is failed. " + detailMessage, e);
            return getFailResult(taskId, e);
        } catch (Throwable e) {
            logger.error("Task(" + taskId + ") by " + userId + " is failed.", e);
            return getFailResult(taskId,
                    new BrighticsCoreException("3001").addDetailMessage(ExceptionUtils.getStackTrace(e)));
        }
    }

    /**
     * This method stop running task.
     */
    public static void stopTask(StopTaskMessage request) {
        try {
            String targetTaskId = request.getTargetTaskId();
            // FIXME needs better way to stop task than interrupt
            ContextManager.getRunnerAsContext(getContextType(request), request.getUser()).stopTask(targetTaskId);
            RunningTasks.interrupt(targetTaskId);
        } catch (Throwable e) {
            logger.error("Cannot terminate task.", e);
            throw new BrighticsCoreException("4405").addDetailMessage(ExceptionUtils.getStackTrace(e));
        }
    }

    private static String executeTaskToContext(TaskMessageWrapper request) throws Exception {
        String name = request.taskMessage.getName();

        if (EnumUtils.isValidEnum(ScriptType.class, name)) {
            return executeScript(request);
        } else {
            return executeFunction(request);
        }
    }

    private static String executeScript(TaskMessageWrapper request) throws Exception {
        String name = request.taskMessage.getName();

        ScriptType scriptType = EnumUtils.getEnum(ScriptType.class, name);
        ContextType contextType = scriptType.getContextType(request);

        if (ScriptType.SQL.equals(scriptType)) {
            Set<Entry<String, JsonElement>> aliasArray = request.params.getAsJsonObjectOrException("alias").entrySet();
            List<AliasMessage> aliasList = new ArrayList<>();
            for (Entry<String, JsonElement> entry : aliasArray) {
                aliasList.add(AliasMessage.newBuilder()
                        .setAlias(entry.getKey())
                        .setKey(entry.getValue().getAsString())
                        .build());
            }
            String sql = request.params.getOrException("script");
            String limit = request.params.getOrDefault("limit", "100");

            return ContextManager.getRunnerAsContext(contextType, request.taskMessage.getUser())
                    .sqlData(ExecuteSqlMessage.newBuilder().setSql(sql).addAllAlias(aliasList).setLimit(limit).build());
        } else {
            if (scriptType.hasInData) {
                // This script has In data
                writeExternalData(contextType, request);
            }
            // Scala, Python, ScalaScript, PythonScript, DLPythonScript, DLPredict, PyFunction, UDF
            return ContextManager.getRunnerAsContext(contextType, request.taskMessage.getUser()).runScript(request);
        }
    }

    private static String executeFunction(TaskMessageWrapper request) throws Exception {
        ContextType contextType = getContextType(request.attrs.getOrDefault("context", "SCALA"));
        writeExternalData(contextType, request);
        return ContextManager.getRunnerAsContext(contextType, request.taskMessage.getUser()).runFunction(request);
    }

    private static ContextType getContextType(StopTaskMessage stopTaskMessage) {
        String context = stopTaskMessage.getContext();
        if (StringUtils.isNotBlank(context)) {
            return getContextType(context);
        }

        String name = stopTaskMessage.getName();
        if (EnumUtils.isValidEnum(ScriptType.class, name)) {
            return EnumUtils.getEnum(ScriptType.class, name).defaultContext;
        }

        return ContextType.SCALA;
    }

    private static ContextType getContextType(String context) {
        if (StringUtils.isBlank(context)) {
            return ContextType.SCALA;
        }

        try {
            return ContextType.valueOf(context.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BrighticsCoreException("3008", context);
        }
    }

    // inData parameter validate
    // write data if the context of the input data is different.
    private static void writeExternalData(ContextType contextType, TaskMessageWrapper message)
            throws Exception {

        List<String> inDataList = new ArrayList<>();
        Collections.addAll(inDataList, message.getInData());
        Collections.addAll(inDataList, message.getInputs().flatValues());

        for (String inData : inDataList) {
            DataStatus dataStatus = ContextManager.getDataStatusAsKey(DataKeyUtil.createDataKey(message.mid, inData));
            if (dataStatus == null) {
                throw new BrighticsCoreException("3002", "input data");
            }
            String dataKey = dataStatus.key;
            ContextType dataContextType = dataStatus.contextType;
            if (contextType != dataContextType
                    && !(dataContextType == ContextType.FILESYSTEM || dataContextType == ContextType.KV_STORE)) {
                DataStatus status = ContextManager
                        .getRunnerAsContext(dataContextType, ThreadUtil.getCurrentUser())
                        .writeData(dataKey, DataKeyUtil.getAbsolutePathByDataKey(dataKey));
                ContextManager.updateCurrentDataStatus(dataKey, status);
            }
        }
    }

    private static ResultTaskMessage getSuccessResult(String taskId, String elapsedTime, String result) {
        return ResultTaskMessage.newBuilder().setTaskId(taskId).setMessageStatus(MessageStatus.SUCCESS)
                .setResult(Any.pack(getSuccessBuild(elapsedTime, result))).build();
    }

    private static ResultTaskMessage getFailResult(String taskId, AbsBrighticsException e) {
        return ResultTaskMessage.newBuilder().setTaskId(taskId).setMessageStatus(MessageStatus.FAIL)
                .setResult(Any.pack(getFailBuild(e))).build();
    }

    private static SuccessResult getSuccessBuild(String elapsedTime, String result) {
        return SuccessResult.newBuilder()
                .setResult(SafeParser.nullToString(result))
                .setElapsedTime(elapsedTime)
                .build();
    }

    private static FailResult getFailBuild(AbsBrighticsException e) {
        Builder failResult = FailResult.newBuilder().setMessage(SafeParser.nullToString(e.getMessage()));
        if (StringUtils.isNoneBlank(e.detailedCause)) {
            failResult.setDetailMessage(e.detailedCause);
        }
        return failResult.build();
    }
}

enum ScriptType {
    SQL(ContextType.SCALA, false),
    Scala(ContextType.SCALA, false),
    ScalaScript(ContextType.SCALA, true),
    Python(ContextType.PYTHON, false),
    PythonScript(ContextType.PYTHON, true),
    DLPythonScript(ContextType.PYTHON, false),
    DLPredict(ContextType.PYTHON, false),
    PyFunction(ContextType.PYTHON, true),
    UDF(ContextType.SCALA, true); // could be both context (python|scala)

    ContextType defaultContext;
    public boolean hasInData;

    ScriptType(ContextType defaultContext, boolean hasInData) {
        this.defaultContext = defaultContext;
        this.hasInData = hasInData;
    }

    public ContextType getContextType(TaskMessageWrapper request) {
        String context = request.attrs.getOrDefault("context", defaultContext.name()).toUpperCase();

        if (EnumUtils.isValidEnum(ContextType.class, context)) {
            return ContextType.valueOf(context);
        }

        return defaultContext;
    }

}
