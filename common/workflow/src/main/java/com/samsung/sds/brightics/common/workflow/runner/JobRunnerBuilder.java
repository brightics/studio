package com.samsung.sds.brightics.common.workflow.runner;

import com.samsung.sds.brightics.common.workflow.runner.holder.JobContextHolder;
import com.samsung.sds.brightics.common.workflow.runner.job.JobRunner;
import com.samsung.sds.brightics.common.workflow.runner.vo.JobParam;

public class JobRunnerBuilder {

	private AbsJobRunnerApi jobRunnerApi;
	private JobRunnerConfig config;

	public static JobRunnerBuilder builder() {
		return new JobRunnerBuilder();
	}

	public JobRunnerBuilder setApiInterface(AbsJobRunnerApi jobRunnerApi) {
		this.jobRunnerApi = jobRunnerApi;
		return this;
	}
	
	public JobRunnerBuilder config(JobRunnerConfig config) {
		this.config = config;
		return this;
	}

	public JobRunner create(JobParam jobParam) {
		if (config == null) {
			config = new JobRunnerConfig();
		}
		
		if(jobRunnerApi == null) {
			throw new RuntimeException("job runner api interface is required.");
		}
		JobRunner jobRunner = new JobRunner(jobParam, config);
		JobContextHolder.initialize(jobRunner, jobRunnerApi);
		return jobRunner;
	}

}
