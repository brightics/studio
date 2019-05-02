package com.samsung.sds.brightics.server.common.flowrunner.model.impl;

import java.util.Map.Entry;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.util.IdGenerator;
import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage;
import com.samsung.sds.brightics.common.workflow.context.WorkContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.model.Work;
import com.samsung.sds.brightics.server.common.flowrunner.status.JobContextHolder;
import com.samsung.sds.brightics.server.common.flowrunner.status.Status;
import com.samsung.sds.brightics.server.common.message.task.TaskMessageBuilder;
import com.samsung.sds.brightics.server.common.message.task.TaskMessageRepository;
import com.samsung.sds.brightics.server.common.util.JsonObjectUtil;
import com.samsung.sds.brightics.server.common.util.LoggerUtil;
import com.samsung.sds.brightics.server.common.util.ValidationUtil;
import com.samsung.sds.brightics.server.common.util.keras.KerasScriptUtil;
import com.samsung.sds.brightics.server.model.entity.BrtcDatasources;

public class FunctionWork extends Work {

    private static final Logger LOGGER = LoggerFactory.getLogger(FunctionWork.class);
    private final JsonObject functionInfo;
    private final String functionName;
    private final String label;

    public FunctionWork(JsonObject functionInfo) {
        super(JsonObjectUtil.getAsString(functionInfo, "fid"), new ParametersBuilder().build());
        this.functionInfo = functionInfo;
        this.functionName = JsonObjectUtil.getAsString(functionInfo, "name");
        this.label = JsonObjectUtil.getAsString(functionInfo, "label");
        initParam();
    }

    private void initParam() {
        JsonElement params = functionInfo.get("param");
        ParametersBuilder pb = new ParametersBuilder();
        if (params != null) {
            for (Entry<String, JsonElement> param : params.getAsJsonObject().entrySet()) {
                pb.add(param.getKey(), param.getValue());
            }
        }
        originalParameters = pb.build();
    }

    @Override
    public void start(WorkContext context) {
        try {
            LoggerUtil.pushMDC("fid", name);

            LOGGER.info("[FUNCTION START] [{}] {}", label, functionInfo);
            JobContextHolder.getJobStatusTracker().startFunction(this.name, label, functionName);

            runTask();

            JobContextHolder.getJobStatusTracker().endFunctionWith(Status.SUCCESS);
            LOGGER.info("[FUNCTION SUCCESS] [{}]", label);
        } catch (AbsBrighticsException e) {
            JobContextHolder.getJobStatusTracker().endFunctionWith(Status.FAIL);
            LOGGER.error("[FUNCTION ERROR] [{}]", label);
            throw e;
        } finally {
            LoggerUtil.popMDC("fid");
        }
    }

    private void runTask() {
        String taskId = IdGenerator.getSimpleId();

        JobContextHolder.getJobStatusTracker().getCurrentFunctionStatus().setTaskId(taskId);
        LoggerUtil.pushMDC("taskId", taskId);

        try {
            LOGGER.info("[TASK START]");
            // executeTask
            JobContextHolder.getBeanHolder().taskService.executeTask(buildMessage(taskId));
            // Wait until the task is finished.
            while (!TaskMessageRepository.isExistFinishMessage(taskId)) {
                Thread.sleep(50L);
            }
            Object result = JobContextHolder.getBeanHolder().messageManager.taskManager().getAsyncTaskResult(taskId);
            LOGGER.info("[TASK FINISHED]", result);
            LOGGER.debug("[TASK RESULT] {}", result);
        } catch (InterruptedException e) {
            LOGGER.error("[TASK INTERRUPTED]", e);
            String context = functionInfo.has("context") ? functionInfo.get("context").getAsString() : "";
            JobContextHolder.getBeanHolder().taskService.stopTask(taskId, functionName, context);
            throw new BrighticsCoreException("3101");
        } catch (AbsBrighticsException e) {
            LOGGER.error("[TASK ERROR] {}", e.getMessage());
            throw e;
        } finally {
            LoggerUtil.popMDC("taskId");
        }
    }

    private ExecuteTaskMessage buildMessage(String taskId) {
        Parameters params = complementParameters();
        LOGGER.info("[FUNCTION PROCESSING] [{}] parameters : {}", label, params);

        return TaskMessageBuilder.newBuilder(taskId, functionName)
                .setParameters(params.toJsonString())
                .setAttributes(buildAttributes().toString())
                .build();
    }

    private JsonObject buildAttributes() {
        JsonObject attributes = new JsonObject();

        // add main model mid
        attributes.addProperty("mid", JobContextHolder.getJobStatusTracker().getCurrentModelMid());
        // add persist option
        attributes.addProperty("persist", getPersist());
        // add label option
        attributes.addProperty("label", label);

        Stream.of("inData", "outData", "inputs", "outputs", "version", "context")
                .filter(functionInfo::has)
                .forEach(key -> attributes.add(key, functionInfo.get(key)));

        return attributes;
    }

    private boolean getPersist() {
        try {
            return functionInfo.has("persist") && functionInfo.get("persist").getAsBoolean();
        } catch (Exception e) {
            return false;
        }
    }

    private Parameters complementParameters() {
        ParametersBuilder pb = new ParametersBuilder(resolvedParameters);

        // complementDistributedJdbcLoaderParam(pb); we don't need this line anymore.
        complementDLPredictParam(pb);
        complementPyFunctionParam(pb);
        complementInOutDataParam(pb);

        // TODO realtime 로직 추가
//        int duration = runner.getModel().get("duration").getAsInt();
//        // For StreamingDataflow
//        if (duration > 0) {
//            pb.add("duration", duration);
//        }

        return pb.build();
    }

    private void complementPyFunctionParam(ParametersBuilder pb) {
        if (!"PyFunction".equals(functionName)) {
            return;
        }
        try {
            // get python function script.
            pb.add("script", JobContextHolder.getBeanHolder().pyFunctionService.getScriptWithParam(resolvedParameters));
        } catch (Exception e) {
            throw new BrighticsCoreException("3137").initCause(e);
        }
    }

    private void complementDLPredictParam(ParametersBuilder pb) {
        if (!"DLPredict".equals(functionName)) {
            return;
        }

        // Deep Learning model need to combine parameters.
        String resultDF = "resultDF";

        JsonArray outTableAlias = new JsonArray();
        outTableAlias.add(resultDF);

        try {
            String script = KerasScriptUtil.getKerasPredictScript(resultDF, resolvedParameters.toJsonObject());
            pb.add("script", script);
            pb.add("out-table-alias", outTableAlias);
        } catch (Exception e) {
            throw new BrighticsCoreException("3133", e.getMessage()).initCause(e);
        }
    }


    private void complementInOutDataParam(ParametersBuilder pb) {
        Parameters params = resolvedParameters;
        final String COPY_FROM = "copy-from";
        final String COPY_TO = "copy-to";
        final String DATASOURCE_NAME = "datasource-name";

        // For importdata, exportdata in controlflow and DBReader in dataflow and avoid dataflow file upload (import data)
        if (params.contains(COPY_FROM) || params.contains(COPY_TO) || "InOutData".equals(functionName)) {
            String datasourceType;
            if (params.contains(COPY_FROM)) {
                datasourceType = params.getString(COPY_FROM);
            } else if (params.contains(COPY_TO)) {
                datasourceType = params.getString(COPY_TO);
            } else { // if inOutData rdb type
                datasourceType = StringUtils.equals(params.getString("fs-type"), "rdb") ? "jdbc" : "";
            }

            // data flow file upload does not have datasource-name
            if ("jdbc".equals(datasourceType) && params.contains(DATASOURCE_NAME) && StringUtils.isNotEmpty(params.getString(DATASOURCE_NAME))) {
                String dataSourceName = params.getString(DATASOURCE_NAME);

                BrtcDatasources datasourceInfo = JobContextHolder.getBeanHolder().dataSourceService.getDatasourceInfo(dataSourceName);
                LOGGER.debug("DataSourceDriver = "
                        + JobContextHolder.getBeanHolder().dataSourceService.getDriverAsBrtcDatasourceInfo(datasourceInfo));
                LOGGER.debug("DBType = " + datasourceInfo.getDbType());

                pb.add("ip", datasourceInfo.getIp());
                pb.add("port", datasourceInfo.getPort());
                pb.add("username", datasourceInfo.getUserName());
                pb.add("password", datasourceInfo.getPassword());
                pb.add("db-name", datasourceInfo.getDbName());
                pb.add("db-type", datasourceInfo.getDbType());
                pb.remove(DATASOURCE_NAME);
            }

            if ("jdbc".equals(datasourceType) && !params.contains(DATASOURCE_NAME)) {
                ValidationUtil.throwIfEmpty(params.getParam("ip"), "datasource");
                pb.add("ip", params.getParam("ip"));
            }
        }
    }
}
