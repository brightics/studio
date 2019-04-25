package com.samsung.sds.brightics.common.workflow.flowrunner.job.model.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
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
import com.samsung.sds.brightics.common.core.util.JsonObjectUtil;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.core.util.LoggerUtil;
import com.samsung.sds.brightics.common.core.util.ValidationUtil;
import com.samsung.sds.brightics.common.workflow.context.WorkContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.flowrunner.holder.JobContextHolder;
import com.samsung.sds.brightics.common.workflow.flowrunner.status.Status;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.MetaConvertVO;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.MetaConvertVO.MetaConvertType;
import com.samsung.sds.brightics.common.workflow.model.Work;

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
            Parameters params = complementParameters();
            LOGGER.info("[FUNCTION PROCESSING] [{}] parameters : {}", label, params);

			Object result = JobContextHolder.getJobRunnerAPI().executeTaskAndGetResult(taskId,
					JobContextHolder.getJobRunner().getStatus().getUser(), functionName, params.toJsonString(),
					buildAttributes().toString());
            LOGGER.info("[TASK SUCCESS] {}", result);
        } catch (InterruptedException e) {
            LOGGER.error("[TASK INTERRUPTED]", e);
            String context = functionInfo.has("context") ? functionInfo.get("context").getAsString() : "";
            JobContextHolder.getJobRunnerAPI().stopTask(taskId, functionName, context);
            throw new BrighticsCoreException("3101");
        } catch (AbsBrighticsException e) {
            LOGGER.error("[TASK ERROR] {}", e.getMessage());
            throw e;
        } finally {
            LoggerUtil.popMDC("taskId");
        }
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
			if (JobContextHolder.getJobRunnerConfig().getPersistForcedFalse()) {
				// forced persist false
				return false;
			}
			return functionInfo.has("persist") && functionInfo.get("persist").getAsBoolean();
		} catch (Exception e) {
			return false;
		}
	}

    private Parameters complementParameters() {
        ParametersBuilder pb = new ParametersBuilder(resolvedParameters);

        complementDLPredictParam(pb);
        complementPyFunctionParam(pb);
        complementInOutDataParam(pb);
        complementPreparedDataParam(pb);

        return pb.build();
    }

    private void complementPreparedDataParam(ParametersBuilder pb) {
		if (functionInfo.has("external") && functionInfo.get("external").getAsBoolean()) {
			String mid = JobContextHolder.getJobStatusTracker().getCurrentModelMid();
			String fid = JsonObjectUtil.getAsString(functionInfo, "fid");
			if (JobContextHolder.getPreparedDataSet().hasPreparedData(mid, fid)) {
				JsonObject preDataObj = JobContextHolder.getPreparedDataSet().getFunctionPreparedDataObject(mid, fid);
				Set<Entry<String, JsonElement>> preDataSet = preDataObj.entrySet();
				for (Entry<String, JsonElement> preData : preDataSet) {
					pb.add(preData.getKey(), preData.getValue());
				}
			}
		}
	}

	private void complementPyFunctionParam(ParametersBuilder pb) {
		if (!"PyFunction".equals(functionName)) {
			return;
		}
		try {
			// get python function script.
			JsonObject paramObject = resolvedParameters.toJsonObject();

			pb.add("script", JobContextHolder.getJobRunnerAPI()
					.convert(new MetaConvertVO(MetaConvertType.PYFUNCTION, paramObject)).getAsString());
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
			JsonObject paramObject = resolvedParameters.toJsonObject();
			paramObject.addProperty("outDFAlias", resultDF);
			String script = JobContextHolder.getJobRunnerAPI()
					.convert(new MetaConvertVO(MetaConvertType.DLPREDICT, paramObject)).getAsString();
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
			if ("jdbc".equals(datasourceType) && params.contains(DATASOURCE_NAME)
					&& StringUtils.isNotEmpty(params.getString(DATASOURCE_NAME))) {
				String dataSourceName = params.getString(DATASOURCE_NAME);
				Map<String, String> metaMap = new HashMap<>();
				metaMap.put("datasourceName", dataSourceName);
				JsonElement datasourceElm = JobContextHolder.getJobRunnerAPI()
						.convert(new MetaConvertVO(MetaConvertType.DATASOURCE, JsonUtil.toJsonObject(metaMap)));
				JsonObject datasourceInfo = datasourceElm.getAsJsonObject();
				pb.add("ip", datasourceInfo.get("ip"));
				pb.add("port", datasourceInfo.get("port"));
				pb.add("username", datasourceInfo.get("username"));
				pb.add("password", datasourceInfo.get("password"));
				pb.add("db-name", datasourceInfo.get("dbName"));
				pb.add("db-type", datasourceInfo.get("dbType"));
				pb.remove(DATASOURCE_NAME);
			}

            if ("jdbc".equals(datasourceType) && !params.contains(DATASOURCE_NAME)) {
                ValidationUtil.throwIfEmpty(params.getParam("ip"), "datasource");
                pb.add("ip", params.getParam("ip"));
            }
        }
    }
}
