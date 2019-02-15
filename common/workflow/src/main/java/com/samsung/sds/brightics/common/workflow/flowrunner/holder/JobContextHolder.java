package com.samsung.sds.brightics.common.workflow.flowrunner.holder;

import com.samsung.sds.brightics.common.workflow.flowrunner.AbsJobRunnerApi;
import com.samsung.sds.brightics.common.workflow.flowrunner.JobRunnerConfig;
import com.samsung.sds.brightics.common.workflow.flowrunner.data.PreparedDataSet;
import com.samsung.sds.brightics.common.workflow.flowrunner.job.JobRunner;
import com.samsung.sds.brightics.common.workflow.flowrunner.status.JobStatusTracker;

public class JobContextHolder {

	private static final ThreadLocal<JobStatusTracker> trackerHolder = new InheritableThreadLocal<>();
	private static final ThreadLocal<JobRunner> jobRunnerHolder = new InheritableThreadLocal<>();
	private static final ThreadLocal<AbsJobRunnerApi> jobRunnerApiHolder = new InheritableThreadLocal<>();
	private static final ThreadLocal<JobRunnerConfig> jobRunnerConfigHolder = new InheritableThreadLocal<>();
	private static final ThreadLocal<PreparedDataSet> preparedDataSetHolder = new InheritableThreadLocal<>();

	private JobContextHolder() {
	}

	public static JobStatusTracker getJobStatusTracker() {
		return trackerHolder.get();
	}

	private static void setJobStatusTracker(JobStatusTracker tracker) {
		if (tracker == null) {
			throw new IllegalStateException("Only non-null JobStatusTracker instances are permitted");
		}
		trackerHolder.set(tracker);
	}

	public static JobRunner getJobRunner() {
		return jobRunnerHolder.get();
	}

	public static JobRunnerConfig getJobRunnerConfig() {
		return jobRunnerConfigHolder.get();
	}

	public static AbsJobRunnerApi getJobRunnerAPI() {
		if (jobRunnerApiHolder.get() == null) {
			throw new IllegalStateException("Flow runner API has not been initialized");
		}
		return jobRunnerApiHolder.get();
	}

	public static PreparedDataSet getPreparedDataSet() {
		return preparedDataSetHolder.get();
	}

	private static void setJobRunner(JobRunner runner) {
		if (runner == null) {
			throw new IllegalStateException("Only non-null JobRunner instances are permitted");
		}
		jobRunnerHolder.set(runner);
	}

	private static void setJobConfigHolderTracker(JobRunnerConfig jobRunnerConfig) {
		if (jobRunnerConfig == null) {
			throw new IllegalStateException("JobRunner config has not been initialized");
		}
		jobRunnerConfigHolder.set(jobRunnerConfig);
	}

	private static void setJobRunnerAPI(AbsJobRunnerApi iJobRunnerApi) {
		jobRunnerApiHolder.set(iJobRunnerApi);
	}

	public static void setPreparedDataSet(PreparedDataSet preparedDataSet) {
		preparedDataSetHolder.set(preparedDataSet);
	}


	public static void clear() {
		trackerHolder.remove();
		jobRunnerHolder.remove();
		jobRunnerConfigHolder.remove();
		preparedDataSetHolder.remove();
	}

	public static void initialize(JobRunner runner, AbsJobRunnerApi iJobRunnerApi, JobRunnerConfig jobRunnerConfig) {
		setJobRunner(runner);
		setJobStatusTracker(new JobStatusTracker(runner.getStatus()));
		setJobRunnerAPI(iJobRunnerApi);
		setJobConfigHolderTracker(jobRunnerConfig);
	}

}
