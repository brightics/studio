package com.samsung.sds.brightics.common.workflow.flowrunner.job;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.core.util.LoggerUtil;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.workflow.flowrunner.AbsJobRunnerApi;
import com.samsung.sds.brightics.common.workflow.flowrunner.JobRunnerConfig;
import com.samsung.sds.brightics.common.workflow.flowrunner.data.PreparedData;
import com.samsung.sds.brightics.common.workflow.flowrunner.data.PreparedDataSet;
import com.samsung.sds.brightics.common.workflow.flowrunner.holder.JobContextHolder;
import com.samsung.sds.brightics.common.workflow.flowrunner.holder.VariableContextHolder;
import com.samsung.sds.brightics.common.workflow.flowrunner.status.Status;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobErrorVO;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobParam;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobStatusVO;

import lombok.Getter;

public class JobRunner implements IJobRunner {

	private static final Logger logger = LoggerFactory.getLogger(JobRunner.class);

	private String main;
	private JobParam jobParam;
	private JobStatusVO status;
	private JobRunnerConfig config;
	private AbsJobRunnerApi jobRunnerApi;
	
	private final Map<String, IModelRunner> runners = new HashMap<>();

	@Getter
	private JsonObject models;

	@Override
	public JobStatusVO getStatus() {
		return status;
	}

	public JobRunner(JobParam jobParam, AbsJobRunnerApi jobRunnerApi, JobRunnerConfig jobRunnerConfig) {
		this.jobParam = jobParam;
		this.config = jobRunnerConfig;
		this.jobRunnerApi = jobRunnerApi;

		this.main = jobParam.getMain();
		if (jobParam.getModels() == null) {
			jobParam.setModels(new HashMap<>());
		}
		models = JsonUtil.toJsonObject(jobParam).getAsJsonObject("models");

		for (Entry<String, JsonElement> entry : models.entrySet()) {
			JsonObject model = entry.getValue().getAsJsonObject();
			ModelComplementer.complementModel(entry.getKey(), model, jobParam);
		}
		logger.info("[JOB PREPARE] Complemented models");

		// Create status and connect with processStatuses.
		status = new JobStatusVO();
		status.setJobId(jobParam.getJid());
		status.setUser(jobParam.getUser());
		status.setBegin(-1);
		status.setEnd(-1);
		status.setStatus(Status.WAITING.toString());
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
	
	/**
	 * run job model
	 */
	public void run() {
		JobContextHolder.initialize(this, jobRunnerApi, config);
		initializePreparedDataset();

		try {
			getOrCreateModelRunner(main, main);
			// Set User Scope Variables from JobParam
			VariableContextHolder variableContextHolder = new VariableContextHolder(config.getVariableRepositoryPath());
			VariableContext variableContext = variableContextHolder.getUserVariableContext(jobParam.getUser());
			variableContext.execute("sys.jid = '" + jobParam.getJid() + "'");
			variableContext.execute("sys.date = '" + new DateTime().toString() + "'");

			run(variableContext);
		} catch (Exception e) {
			updateStatusBy(e);
		}
	}

	private void initializePreparedDataset() {
		PreparedDataSet preparedDataSet = new PreparedDataSet();
		if(jobParam.getDatas() != null && !jobParam.getDatas().isEmpty()){
			for(PreparedData data : jobParam.getDatas()){
				preparedDataSet.addPreparedData(data);
			}
		}
		JobContextHolder.setPreparedDataSet(preparedDataSet);
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
            status.setStatus(Status.PROCESSING.toString());
            status.setBegin(System.currentTimeMillis());
            JobContextHolder.getJobRunnerAPI().updateJobStatus(jobParam, status);

            mainRunner.run(variableContext);
            logger.info("[JOB SUCCESS]");

            // update status process to success
            status.setStatus(Status.SUCCESS.toString());
            status.setEnd(System.currentTimeMillis());
            JobContextHolder.getJobRunnerAPI().updateJobStatus(jobParam, status);
        } catch (Exception e) {
            updateStatusBy(e);
        } finally {
            LoggerUtil.popMDC("jid");
        }
    }

	private void updateStatusBy(Exception e) {
		status.setErrorInfo(Arrays.asList(buildExceptionInfo(e)));
		status.setStatus(Status.FAIL.toString());
		status.setEnd(System.currentTimeMillis());

		if (e instanceof AbsBrighticsException) {
			status.setErrorMessage(e.getMessage());
			status.setErrorDetailMessage(((AbsBrighticsException) e).detailedCause);
			logger.error("[JOB ERROR] {} {}", e.getMessage(), ((AbsBrighticsException)e).detailedCause);
		} else {
			status.setErrorMessage(ExceptionUtils.getMessage(e));
			status.setErrorDetailMessage(ExceptionUtils.getStackTrace(e));
			logger.error("[JOB ERROR]", e);
		}

		JobContextHolder.getJobRunnerAPI().updateJobStatus(jobParam, status);
	}

    private JobErrorVO buildExceptionInfo(Exception e) {
        if (e instanceof AbsBrighticsException) {
            AbsBrighticsException be = (AbsBrighticsException) e;
            return new JobErrorVO(be.getMessage(), be.detailedCause);
        }
        return new JobErrorVO(new BrighticsCoreException("3001").getMessage(), ExceptionUtils.getStackTrace(e));
    }
    
	
	public void clear(){
		JobContextHolder.clear();
	}

}
