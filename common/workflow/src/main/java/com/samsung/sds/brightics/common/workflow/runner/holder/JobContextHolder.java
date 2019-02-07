package com.samsung.sds.brightics.common.workflow.runner.holder;

import com.samsung.sds.brightics.common.workflow.runner.IJobRunnerApi;
import com.samsung.sds.brightics.common.workflow.runner.job.JobRunner;
import com.samsung.sds.brightics.common.workflow.runner.status.JobStatusTracker;

public class JobContextHolder {

	private static final ThreadLocal<JobStatusTracker> trackerHolder = new InheritableThreadLocal<>();
	private static final ThreadLocal<JobRunner> jobRunnerHolder = new InheritableThreadLocal<>();
	private static final ThreadLocal<IJobRunnerApi> jobRunnerApiHolder = new InheritableThreadLocal<>();

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

	public static IJobRunnerApi getJobRunnerAPI() {
		if (jobRunnerApiHolder.get() == null) {
			throw new IllegalStateException("Flow runner API has not been initialized");
		}
		return jobRunnerApiHolder.get();
	}

	private static void setJobRunner(JobRunner runner) {
		if (runner == null) {
			throw new IllegalStateException("Only non-null JobRunner instances are permitted");
		}
		jobRunnerHolder.set(runner);
	}

	public static void setJobRunnerAPI(IJobRunnerApi iJobRunnerApi) {
		jobRunnerApiHolder.set(iJobRunnerApi);
	}

	public static void clear() {
		trackerHolder.remove();
		jobRunnerHolder.remove();
	}

	public static void initialize(JobRunner runner) {
		setJobRunner(runner);
		setJobStatusTracker(new JobStatusTracker(runner.getStatus()));
	}

}
