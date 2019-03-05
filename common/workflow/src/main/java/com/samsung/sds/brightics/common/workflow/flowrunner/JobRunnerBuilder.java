package com.samsung.sds.brightics.common.workflow.flowrunner;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.workflow.flowrunner.job.DefaultJobRunnerApi;
import com.samsung.sds.brightics.common.workflow.flowrunner.job.JobRunner;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobParam;

public class JobRunnerBuilder {

	private static final Logger LOGGER = LoggerFactory.getLogger(JobRunnerBuilder.class);
	
	private AbsJobRunnerApi jobRunnerApi;
	private JobRunnerConfig config;

	private JobRunnerBuilder() {
	}

	public static JobRunnerBuilder builder() {
		return new JobRunnerBuilder();
	}

	/**
	 * Set job runner API implement. (required)
	 * 
	 * @return JobRunnerBuilder
	 */
	public JobRunnerBuilder jobRunnerApi(AbsJobRunnerApi jobRunnerApi) {
		this.jobRunnerApi = jobRunnerApi;
		return this;
	}

	/**
	 * Set job runner configuration. (optional)
	 * 
	 * @return JobRunnerBuilder
	 */
	public JobRunnerBuilder config(JobRunnerConfig config) {
		this.config = config;
		return this;
	}

	public JobRunner create(JobParam jobParam) {
		if (config == null) {
			config = new JobRunnerConfig();
		}

		if (jobRunnerApi == null) {
			LOGGER.warn("Set default job runner API. default API only generates logs.");
			jobRunnerApi = new DefaultJobRunnerApi();
		}
		JobRunner jobRunner = new JobRunner(jobParam, jobRunnerApi, config);
		return jobRunner;
	}

}
