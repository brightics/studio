package com.samsung.sds.brightics.server.common.thread.concurrent;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.exception.provider.ExceptionProvider;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobErrorVO;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobParam;
import com.samsung.sds.brightics.server.common.thread.JobModelRunnable;
import com.samsung.sds.brightics.server.common.util.ValidationUtil;
import com.samsung.sds.brightics.server.model.entity.BrighticsAgent;
import com.samsung.sds.brightics.server.model.entity.BrtcJobStatus;
import com.samsung.sds.brightics.server.model.entity.repository.BrighticsAgentRepository;
import com.samsung.sds.brightics.server.service.AgentService;
import com.samsung.sds.brightics.server.service.JobStatusService;
import com.samsung.sds.brightics.server.service.repository.JobRepository;

@Component
public class JobModelExecuteService implements ApplicationContextAware {

    private static final Logger LOGGER = LoggerFactory.getLogger(JobModelExecuteService.class);
    private static final Map<String, JobModelThreadPoolExecutor> AGENT_EXECUTORS = new ConcurrentHashMap<>();
    private static final Map<String, JobModelThreadPoolExecutor> USER_EXECUTORS = new ConcurrentHashMap<>();
    private static JobStatusService jobStatusService;
    private static BrighticsAgentRepository agentRepository;
    private static JobRepository jobRepository;
    private static Long MIN_JOB_EXECUTOR_INTERVAL;
    private static Integer MAX_FLOW_QUEUE;

    @Override
    public void setApplicationContext(ApplicationContext context) throws BeansException {
        jobStatusService = context.getBean(JobStatusService.class);
        agentRepository = context.getBean(BrighticsAgentRepository.class);
        jobRepository = context.getBean(JobRepository.class);
    }
    
    @Value("${brightics.concurrent.maxFlowQueue:100")
    public void setMaxFlowQueue(String maxFlowQueue){
        try {
            MAX_FLOW_QUEUE = Integer.valueOf(maxFlowQueue);
        } catch (NumberFormatException e) {
            MAX_FLOW_QUEUE = 100;
        }
    }

    @Value("${brightics.jobexecutor.mininterval:0}")
    public void setMinInterval(String minInterval) {
        try {
            MIN_JOB_EXECUTOR_INTERVAL = Long.valueOf(minInterval);
        } catch (NumberFormatException e) {
            MIN_JOB_EXECUTOR_INTERVAL = 0L;
        }
    }

    public static void startJobModel(String user, String agentId, JobModelRunnable runnable) {
        if (!AGENT_EXECUTORS.containsKey(agentId)) {
            throw new BrighticsCoreException("3102", String.format("Executor for agent[%s] has not been added.", agentId));
        }
        if (!USER_EXECUTORS.containsKey(user)) {
            USER_EXECUTORS.put(user, newUserJobExecutor());
        }
        if (USER_EXECUTORS.get(user).hasDuplication(runnable, MIN_JOB_EXECUTOR_INTERVAL)) {
            throw new BrighticsCoreException("3102", "Duplicate job execution request detected.");
        }

        USER_EXECUTORS.get(user).execute(new JobModelRunnable(runnable.getJobParam(), runnable.getStatus()) {
            @Override
            public void main() {
                try {
                    AGENT_EXECUTORS.get(agentId).execute(runnable);
                    // wait until job is deactivated.
                    // job is deactivated when it is finished, interrupted, or removed from queue.
                    while (runnable.isActive()) {
                        Thread.sleep(500L);
                    }
                } catch (InterruptedException e) {
                    LOGGER.warn("[JOB_QUEUE] job executor for user has been interrupted.");
                }
            }
        });
    }

    public static void addAgentExecutor(String agentId) {
        final int maxConcurrentJobs;
        BrighticsAgent agent = agentRepository.findOne(agentId);
        if(agent != null) {
            maxConcurrentJobs = agent.getMaxConcurrentJobs();
        } else {
            maxConcurrentJobs = 3;
        }

        if (maxConcurrentJobs < 0) {
            throw new BrighticsCoreException("3102", "maxConcurrentJobs should be greater than or equal to 0.");
        }

        JobModelThreadPoolExecutor agentExecutor = Optional
                .ofNullable(AGENT_EXECUTORS.get(agentId))
                .orElseGet(() -> {
                    JobModelThreadPoolExecutor newExecutor = newAgentJobExecutor(maxConcurrentJobs);
                    AGENT_EXECUTORS.put(agentId, newExecutor);
                    LOGGER.info("[JOB_QUEUE] ThreadPool has been instantiated for agent[{}]", agentId);
                    return newExecutor;
                });

        int newMaxPoolSize = getMaxPoolSizeBy(maxConcurrentJobs);
        if (newMaxPoolSize != agentExecutor.getMaximumPoolSize()) {
            AGENT_EXECUTORS.get(agentId).setMaximumPoolSize(newMaxPoolSize);
            LOGGER.info("[JOB_QUEUE] agent({})'s pool size has been updated to {}.", agentId, newMaxPoolSize);
        }
    }

    private static int getMaxPoolSizeBy(int maxConcurrentJobs) {
        int numAvailableCores = Runtime.getRuntime().availableProcessors();
        return maxConcurrentJobs == 0 ? numAvailableCores : Math.min(numAvailableCores,maxConcurrentJobs);
    }

    private static JobModelThreadPoolExecutor newUserJobExecutor() {
        JobModelThreadPoolExecutor userExecutor = new JobModelThreadPoolExecutor(1, 1,
                0L, TimeUnit.MILLISECONDS,
                MAX_FLOW_QUEUE);
        userExecutor.setName("user");
        return userExecutor;
    }

    private static JobModelThreadPoolExecutor newAgentJobExecutor(int maxConcurrentJobs) {
        JobModelThreadPoolExecutor agentExecutor = new JobModelThreadPoolExecutor(1, getMaxPoolSizeBy(maxConcurrentJobs),
                0L, TimeUnit.MILLISECONDS,
                MAX_FLOW_QUEUE);
        agentExecutor.setName("agent");
        return agentExecutor;
    }

    public static void removeAgentExecutor(String agentId) {
        Optional<JobModelThreadPoolExecutor> executor = Optional.ofNullable(AGENT_EXECUTORS.remove(agentId));
        if (!executor.isPresent()) return;

        List<Runnable> pendingJobs = executor
                .map(ThreadPoolExecutor::shutdownNow)
                .orElse(Collections.emptyList());

        // update status for pending jobs
        for (Runnable runnable : pendingJobs) {
            JobParam jobParam = ((JobModelRunnable) runnable).getJobParam();
            jobStatusService.updateJobStatusWithExceptionCode(jobParam.getJid(), "3203");
        }
    }

    public static void cancelJob(String jobId) {
        BrtcJobStatus jobStatus = jobStatusService.getJobStatus(jobId);
        ValidationUtil.throwIfEmpty(jobStatus, "job id");

        Optional.ofNullable(USER_EXECUTORS.get(jobStatus.getUser()))
                .ifPresent(executor -> executor.cancelWork(jobId));

        String agentId = Optional.ofNullable(jobStatus.getAgentId())
                .orElse(AgentService.DEFAULT_AGENT_ID);
        Boolean interrupted = Optional.ofNullable(AGENT_EXECUTORS.get(agentId))
                .map(executor -> executor.cancelWork(jobId))
                .orElse(false);

        if (!interrupted) {
            // updates job status only if job is not interrupted because JobRunner handles interruption case
            updateJobStatusToFail(jobStatus.getJobId());
        }
    }

    private static void updateJobStatusToFail(String jobId) {
        String message = ExceptionProvider.getExceptionMessage("CR-3101");	
        Optional.ofNullable(jobRepository.getJobStatus(jobId)).ifPresent(status -> {
            status.setErrorInfo(getSingleExceptionInfo(message));
            status.setStatus(JobRepository.STATE_FAIL);
            status.setEnd(System.currentTimeMillis());
            status.setErrorMessage(message);
        });
        jobStatusService.updateJobStatusWithExceptionCode(jobId, "3101");
    }

    private static List<JobErrorVO> getSingleExceptionInfo(String message) {
        return Collections.singletonList(new JobErrorVO(message));
    }
}
