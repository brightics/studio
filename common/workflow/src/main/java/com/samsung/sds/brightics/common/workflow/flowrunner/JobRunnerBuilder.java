package com.samsung.sds.brightics.common.workflow.flowrunner;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.workflow.flowrunner.job.DefaultJobRunnerApi;
import com.samsung.sds.brightics.common.workflow.flowrunner.job.JobRunner;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobParam;

public class JobRunnerBuilder {

	private static final Logger LOGGER = LoggerFactory.getLogger(JobRunnerBuilder.class);
	
	private AbsJobRunnerApi jobRunnerApi;
	private JobRunnerConfig config;

	private JobRunnerBuilder() {
	}

	/**
	 * start to build JobRunner.
	 * @return
	 */
	public static JobRunnerBuilder builder() {
		return new JobRunnerBuilder();
	}

	/**
	 * Set job runner API implement. (required)
	 * @see AbsJobRunnerApi
	 * @return JobRunnerBuilder
	 */
	public JobRunnerBuilder jobRunnerApi(AbsJobRunnerApi jobRunnerApi) {
		this.jobRunnerApi = jobRunnerApi;
		return this;
	}

	/**
	 * Set job runner configuration. (optional)
	 * @see JobRunnerConfig
	 * @return JobRunnerBuilder
	 */
	public JobRunnerBuilder config(JobRunnerConfig config) {
		this.config = config;
		return this;
	}

	/**
	 * Create Job Runner using jobRunnerApi and configuration.
	 * @param String job JSON string (<b>should contain user, jobId, main model</b>) 
	 * @return
	 */
	public JobRunner create(String jobParamJsonString) throws Exception {
		JobParam jobParam = new ObjectMapper().readValue(jobParamJsonString, JobParam.class);
		return create(jobParam);
	}
	
	/**
	 * Create Job Runner using jobRunnerApi and configuration.
	 * @param jobParam JobParam object (<b>should contain user, jobId, main model</b>)
	 * @return
	 */
	public JobRunner create(JobParam jobParam) throws Exception {
		if (config == null) {
			config = new JobRunnerConfig();
		}

		if (jobRunnerApi == null) {
			LOGGER.warn("Set default job runner API. default API only generates logs.");
			jobRunnerApi = new DefaultJobRunnerApi();
		}
		
		validJobParam(jobParam);
		JobRunner jobRunner = new JobRunner(jobParam, jobRunnerApi, config);
		return jobRunner;
	}
	
	private void validJobParam(JobParam jobParam) {
		if (jobParam.getUser() == null || jobParam.getUser().isEmpty()) {
			throw new BrighticsCoreException("3002", "user");
		}
		if (jobParam.getJid() == null || jobParam.getJid().isEmpty()) {
			throw new BrighticsCoreException("3002", "job id");
		}
		if (jobParam.getMain() == null || jobParam.getJid().isEmpty()) {
			throw new BrighticsCoreException("3002", "main model");
		}
	}

}
