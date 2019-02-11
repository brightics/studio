package com.samsung.sds.brightics.server.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.workflow.runner.JobRunnerBuilder;
import com.samsung.sds.brightics.common.workflow.runner.job.JobRunner;
import com.samsung.sds.brightics.common.workflow.runner.vo.JobParam;
import com.samsung.sds.brightics.common.workflow.runner.vo.JobStatusVO;
import com.samsung.sds.brightics.server.common.flowrunner.JobRunnerApi;
import com.samsung.sds.brightics.server.common.holder.BeanHolder;
import com.samsung.sds.brightics.server.common.thread.JobModelRunnable;
import com.samsung.sds.brightics.server.common.thread.concurrent.JobModelExecuteService;
import com.samsung.sds.brightics.server.common.util.LoggerUtil;
import com.samsung.sds.brightics.server.common.util.ResultMapUtil;
import com.samsung.sds.brightics.server.common.util.ValidationUtil;
import com.samsung.sds.brightics.server.model.vo.ExceptionInfoVO;
import com.samsung.sds.brightics.server.service.repository.JobRepository;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private AgentService agentService;

    @Autowired
    private AgentUserService agentUserService;

    @Autowired
    private JobStatusService jobStatusService;

    @Autowired
    private BeanHolder beanHolder;
    
    private JobRunnerApi jobRunnerApi;
    

    private static final Logger logger = LoggerFactory.getLogger(JobService.class);

    public Map<String, Object> executeJob(JobParam jobParam) {
        return executeJob(jobParam, JobRepository.JOB_BY_API);
    }

    public Map<String, Object> executeJob(JobParam jobParam, String jobBy) {
        String agentId = agentUserService.getAgentIdAsUserId(jobParam.getUser());
        return executeJob(jobParam, agentId, jobBy);
    }

    public Map<String, Object> executeJob(com.samsung.sds.brightics.common.workflow.runner.vo.JobParam jobParam, String agentId, String jobBy) {
        logger.info("Executing job ({})", jobParam.getJid());

        agentService.initAgent(agentId);

        LoggerUtil.pushMDC("jid", jobParam.getJid());

        logger.info("[EXECUTE JOB] {}", JsonUtil.toJson(jobParam));
        jobStatusService.createJobStatus(jobParam.getJid(), jobParam.getUser(), jobBy, agentId);
        
        try {
        	if(jobRunnerApi ==null) {
        		jobRunnerApi = new JobRunnerApi();
        	}
        	
        	JobRunner runner = JobRunnerBuilder.builder().setApiInterface(jobRunnerApi).create(jobParam);
            jobRepository.saveJobStatus(jobParam.getJid(), runner.getStatus());
            JobModelExecuteService.startJobModel(jobParam.getUser(), agentId, new JobModelRunnable(jobParam, runner.getStatus()) {
                @Override
                public void main() {
                    ThreadLocalContext.put("user", jobParam.getUser());
                    MDC.put("user", jobParam.getUser());

                    try {
                        runner.run();
                    } catch (Exception e) {
                        jobStatusService.updateJobStatus(jobParam,
                                generateFailedJobStatusVO(jobParam, new ExceptionInfoVO(ExceptionUtils.getMessage(e), ExceptionUtils.getStackTrace(e))));
                        throw e;
                    } finally {
                        jobRepository.insertJobStatusLog(runner.getStatus(), agentId);
                        jobRepository.finishJob(jobParam.getJid());
                        runner.clear();
                    }
                }
            });
            return ResultMapUtil.successAddMessage(jobParam.getJid(), "Launched job Successfully .");
        } catch (Exception e) {
            logger.error("[JOB] Errors while executing flow", e);
            jobStatusService.updateJobStatus(jobParam,
                    generateFailedJobStatusVO(jobParam, new ExceptionInfoVO(ExceptionUtils.getMessage(e), ExceptionUtils.getStackTrace(e))));
            throw new BrighticsCoreException("3651", e.getMessage());
        } finally {
            LoggerUtil.popMDC("jid");
        }
    }

    private JobStatusVO generateFailedJobStatusVO(JobParam jobParam, ExceptionInfoVO... errorInfo) {
        JobStatusVO result = new JobStatusVO();
        result.setJobId(jobParam.getJid());
        result.setUser(jobParam.getUser());
        result.setStatus(JobRepository.STATE_FAIL);
        result.setErrorFunctionName("job execute");
        result.setBegin(0);
        result.setEnd(0);
        result.setErrorInfo(Arrays.asList(errorInfo));
        result.setProcesses(new ArrayList<>());
        result.setType("");
        result.setErrorMessage("");
        result.setErrorDetailMessage("");
        result.setQueueName("");
        result.setQueuePosition(0);
        return result;
    }

    public Map<String, Object> terminateJob(String jobId) {
        if (jobRepository.dlJobIdAsTaskid.containsKey(jobId)) {
            List<String> dljobList = jobRepository.dlJobIdAsTaskid.get(jobId);
            for (String taskId : dljobList) {
                //TODO add DL stop
                beanHolder.taskService.stopTask(taskId, "DLPythonScript", "python");
            }
            jobRepository.dlJobIdAsTaskid.remove(jobId);
        } else {
            JobModelExecuteService.cancelJob(jobId);
        }
        return ResultMapUtil.success(String.format("Job ID [%s] will be terminated.", jobId));
    }

    public JobStatusVO getJobStatus(String jobId) {
        JobStatusVO jobStatusVO = jobRepository.getJobStatus(jobId);
        ValidationUtil.throwIfEmpty(jobStatusVO, "job Id");
        return jobStatusVO;
    }

    public List<JobStatusVO> listJobStatus() {
        List<JobStatusVO> status = jobRepository.getJobStatusList();
        status.sort(Comparator.comparingLong(JobStatusVO::getBegin));
        return status;
    }
}
