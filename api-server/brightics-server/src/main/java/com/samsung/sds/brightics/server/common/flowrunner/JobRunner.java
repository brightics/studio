package com.samsung.sds.brightics.server.common.flowrunner;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.util.IdGenerator;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.server.common.flowrunner.status.JobContextHolder;
import com.samsung.sds.brightics.server.common.flowrunner.variable.LegacyVariableConverter;
import com.samsung.sds.brightics.server.common.holder.VariableContextHolder;
import com.samsung.sds.brightics.server.common.util.LoggerUtil;
import com.samsung.sds.brightics.server.model.param.JobParam;
import com.samsung.sds.brightics.server.model.vo.ExceptionInfoVO;
import com.samsung.sds.brightics.server.model.vo.JobStatusVO;
import com.samsung.sds.brightics.server.service.repository.JobRepository;

import lombok.Getter;

public class JobRunner implements IJobRunner {

	private static final Logger logger = LoggerFactory.getLogger(JobRunner.class);

	String main;
	JobParam jobParam;
	JobStatusVO status;
	@Getter
	JsonObject models;

	// for shortcut by fid
	private JsonObject modelFunctions = new JsonObject();

	private final Map<String, IModelRunner> runners = new HashMap<>();

	@Override
	public JobStatusVO getStatus() {
		return status;
	}

	public JobRunner(JobParam jobParam) {
		this.jobParam = jobParam;
		this.main = jobParam.getMain();

		if (jobParam.getModels() == null) {
			jobParam.setModels(new HashMap<>());
		}
		models = JsonUtil.toJsonObject(jobParam).getAsJsonObject("models");

		for (Entry<String, JsonElement> entry : models.entrySet()) {
			JsonObject model = entry.getValue().getAsJsonObject();
			complementModel(entry.getKey(), model, jobParam);
		}
		logger.info("[JOB PREPARE] Complemented models");

		// Create status and connect with processStatuses.
		status = new JobStatusVO();
		status.setJobId(jobParam.getJid());
		status.setUser(jobParam.getUser());
		status.setBegin(-1);
		status.setEnd(-1);
		status.setStatus(JobRepository.STATE_WAITING);
		status.setProcesses(new ArrayList<>());
	}

	
	public IModelRunner getOrCreateModelRunner(String pid, String mid) {
		if (!runners.containsKey(pid)) {
			if (!models.has(mid)) {
				throw new BrighticsCoreException("3102", mid + " is invalid model");
			}
			IModelRunner runner = ModelRunnerFactory.create(pid, models.get(mid).getAsJsonObject());
			runners.put(pid, runner);
		}
		return runners.get(pid);
	}

	public void run() {
		try {
			getOrCreateModelRunner(main, main);
			// Set User Scope Variables from JobParam
			VariableContextHolder.clearVariableContext(jobParam.getUser());
			VariableContext variableContext = VariableContextHolder.getUserVariableContext(jobParam.getUser());
			variableContext.execute("sys.jid = '" + jobParam.getJid() + "'");
			variableContext.execute("sys.date = '" + new DateTime().toString() + "'");

			run(variableContext);
		} catch (Exception e) {
			updateStatusBy(e);
		}
	}


	@Override
	public void run(VariableContext variableContext) {
        LoggerUtil.pushMDC("jid", jobParam.getJid());
        logger.info("[JOB START]");

        try {
            IModelRunner mainRunner = runners.get(main);

            // update status wait to process
            if (mainRunner instanceof AbsModelRunner) {
                status.setType(((AbsModelRunner) mainRunner).model.get("type").getAsString());
            }
            status.setStatus(JobRepository.STATE_PROCESSING);
            status.setBegin(System.currentTimeMillis());
            JobContextHolder.getBeanHolder().jobStatusService.updateJobStatus(jobParam, status);

            mainRunner.run(variableContext);
            logger.info("[JOB SUCCESS]");

            // update status process to success
            status.setStatus(JobRepository.STATE_SUCCESS);
            status.setEnd(System.currentTimeMillis());
            JobContextHolder.getBeanHolder().jobStatusService.updateJobStatus(jobParam, status);
        } catch (Exception e) {
            updateStatusBy(e);
        } finally {
            LoggerUtil.popMDC("jid");
        }
    }
	
    private void updateStatusBy(Exception e) {
        ExceptionInfoVO exceptionInfo = buildExceptionInfo(e);

        status.setErrorInfo(Arrays.asList(exceptionInfo));
        status.setStatus(JobRepository.STATE_FAIL);
        status.setEnd(System.currentTimeMillis());

        if (e instanceof AbsBrighticsException) {
            status.setErrorMessage(e.getMessage());
            status.setErrorDetailMessage(((AbsBrighticsException) e).detailedCause);
            logger.error("[JOB ERROR] {} {}", exceptionInfo.getMessage(), exceptionInfo.getDetailMessage());
        } else {
            status.setErrorMessage(ExceptionUtils.getMessage(e));
            status.setErrorDetailMessage(ExceptionUtils.getStackTrace(e));
            logger.error("[JOB ERROR]", e);
        }

        JobContextHolder.getBeanHolder().jobStatusService.updateJobStatus(jobParam, status);
    }

    private ExceptionInfoVO buildExceptionInfo(Exception e) {
        if (e instanceof AbsBrighticsException) {
            AbsBrighticsException be = (AbsBrighticsException) e;
            return new ExceptionInfoVO(be.getMessage(), be.detailedCause);
        }
        return new ExceptionInfoVO(new BrighticsCoreException("3001").getMessage(), ExceptionUtils.getStackTrace(e));
    }

	private void complementModel(String mid, JsonObject model, JobParam jobParam) {
		model.addProperty("mid", mid);

		if (model.has("innerModels")) {
			for (Entry<String, JsonElement> innerModel : model.getAsJsonObject("innerModels").entrySet()) {
				complementModel(innerModel.getKey(), innerModel.getValue().getAsJsonObject(), jobParam);
			}
		}

		if (!model.has("variables")) {
			model.add("variables", new JsonObject());
		}

		model.addProperty("user", jobParam.getUser());

		if (jobParam.isConverted()) {
			// complement calculated variables for legacy job json
			new LegacyVariableConverter().convertCalculationVariable(model);
		}

		// FIXME VA에서 변환 완료 확인 후 function.name 값 보정 로직 삭제

		if (model.has("functions")) {
			complementFunction(model.getAsJsonArray("functions"));
		}

		if (model.has("optModels")) {
			complementOptModels(model);
		}
	}

	private void complementFunction(JsonArray functions) {
		for (JsonElement function : functions) {
			JsonObject functionObject = function.getAsJsonObject();
			if (!functionObject.has("name")) {
				logger.error("[FIXME] name property is missing in function {}.", functionObject.get("operation"));
				functionObject.add("name", functionObject.get("operation"));
			}

			if (functionObject.has("param") && functionObject.getAsJsonObject("param").has("functions")) {
				complementFunction(functionObject.getAsJsonObject("param").getAsJsonArray("functions"));
			}
			// add all function in modelFunctions map.
			modelFunctions.add(functionObject.getAsJsonPrimitive("fid").getAsString(), functionObject);
		}
	}

	private void complementOptModels(JsonObject model) {
		for (Entry<String, JsonElement> optModel : model.getAsJsonObject("optModels").entrySet()) {
			JsonObject optModelObject = optModel.getValue().getAsJsonObject();

			// create opt variable. and bind variable to function.
			initOptVariablesAndBind(optModelObject);

			// create opt functions.
			copyModelFunctionsToOptFunctions(optModelObject);
		}
	}

	private void copyModelFunctionsToOptFunctions(JsonObject optModelObject) {
		JsonArray functionsArray = new JsonArray();
		if (optModelObject.has("functions")) {
			for (JsonElement function : optModelObject.getAsJsonArray("functions")) {
				JsonObject functionObject = function.getAsJsonObject();
				if (modelFunctions.has(functionObject.get("fid").getAsString())) {
					functionsArray
							.add(modelFunctions.getAsJsonObject(functionObject.get("fid").getAsString()).deepCopy());
				}
			}
		}
		optModelObject.add("functions", functionsArray);
	}

	private final String OPT_VARIABLE_PREFIX = "opt";

	private void initOptVariablesAndBind(JsonObject optModelObject) {
		JsonObject optVariables = new JsonObject();
		if (optModelObject.has("optSelected")) {
			for (Entry<String, JsonElement> optFunction : optModelObject.getAsJsonObject("optSelected").entrySet()) {
				String fid = optFunction.getKey();
				JsonObject optFunctionObject = optFunction.getValue().getAsJsonObject();
				if (modelFunctions.has(fid)) {
					JsonObject functionObject = modelFunctions.getAsJsonObject(fid);
					if (functionObject.has("param") && functionObject.get("fid").getAsString().equals(fid)
							&& optFunctionObject.has("optParam")) {
						for (Entry<String, JsonElement> optParamEm : optFunctionObject.getAsJsonObject("optParam")
								.entrySet()) {
							String paramName = optParamEm.getKey();
							String optVariable = OPT_VARIABLE_PREFIX + IdGenerator.getSimpleId();

							// if (functionObject.getAsJsonObject("param").has(paramName)) {
							functionObject.getAsJsonObject("param").addProperty(paramName,
									String.format("${=%s}", optVariable));
							JsonObject paramInfo = optParamEm.getValue().getAsJsonObject();
							paramInfo.addProperty("fid", fid);
							paramInfo.addProperty("paramName", paramName);
							optVariables.add(optVariable, paramInfo);
							// }
						}
					}
				}
			}
			optModelObject.remove("optSelected");
		}
		optModelObject.add("optVariables", optVariables);
	}
}
