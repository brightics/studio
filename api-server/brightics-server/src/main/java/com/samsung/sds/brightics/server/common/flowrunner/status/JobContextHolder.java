package com.samsung.sds.brightics.server.common.flowrunner.status;

import com.samsung.sds.brightics.server.common.flowrunner.JobRunner;
import com.samsung.sds.brightics.server.common.holder.BeanHolder;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public final class JobContextHolder implements ApplicationContextAware {

    private static final ThreadLocal<JobStatusTracker> trackerHolder = new InheritableThreadLocal<>();
    private static final ThreadLocal<JobRunner> jobRunnerHolder = new InheritableThreadLocal<>();
    private static final ThreadLocal<BeanHolder> serviceBeanHolder = new InheritableThreadLocal<>();

    private JobContextHolder() {
    }

    public static JobStatusTracker getJobStatusTracker() {
        return trackerHolder.get();
    }

    private static void setJobStatusTracker(JobStatusTracker tracker) {
        Assert.notNull(tracker, "Only non-null JobStatusTracker instances are permitted");
        trackerHolder.set(tracker);
    }

    public static JobRunner getJobRunner() {
        return jobRunnerHolder.get();
    }

    private static void setJobRunner(JobRunner runner) {
        Assert.notNull(runner, "Only non-null JobRunner instances are permitted");
        jobRunnerHolder.set(runner);
    }

    public static BeanHolder getBeanHolder() {
        Assert.notNull(serviceBeanHolder.get(), "beanHolder has not been initialized");
        return serviceBeanHolder.get();
    }

    public static void clear() {
        trackerHolder.remove();
        jobRunnerHolder.remove();
    }

    public static void initialize(JobRunner runner) {
        setJobRunner(runner);
        setJobStatusTracker(new JobStatusTracker(runner.getStatus()));
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        serviceBeanHolder.set(applicationContext.getBean(BeanHolder.class));
    }
}
