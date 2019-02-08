package com.samsung.sds.brightics.server.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.workflow.runner.vo.JobParam;
import com.samsung.sds.brightics.common.workflow.runner.vo.JobStatusVO;
import com.samsung.sds.brightics.server.common.util.ValidationUtil;
import com.samsung.sds.brightics.server.model.entity.BrtcJobModel;
import com.samsung.sds.brightics.server.model.entity.BrtcJobStatus;
import com.samsung.sds.brightics.server.model.entity.BrtcJobStatusError;
import com.samsung.sds.brightics.server.model.entity.BrtcJobStatusHist;
import com.samsung.sds.brightics.server.model.entity.repository.BrtcJobLegacyRepository;
import com.samsung.sds.brightics.server.model.entity.repository.BrtcJobModelRepository;
import com.samsung.sds.brightics.server.model.entity.repository.BrtcJobStatusErrorRepository;
import com.samsung.sds.brightics.server.model.entity.repository.BrtcJobStatusHistRepository;
import com.samsung.sds.brightics.server.model.entity.repository.BrtcJobStatusRepository;
import com.samsung.sds.brightics.server.service.repository.JobRepository;

@Service
public class JobStatusService {

    private static final Logger logger = LoggerFactory.getLogger(JobStatusService.class);

    @Autowired
    BrtcJobStatusRepository brtcJobStatusRepository;
    @Autowired
    BrtcJobStatusHistRepository brtcJobStatusHistRepository;
    @Autowired
    BrtcJobStatusErrorRepository brtcJobStatusErrorRepository;
    @Autowired
    BrtcJobModelRepository brtcJobModelRepository;
    @Autowired
    BrtcJobLegacyRepository brtcJobLegacyRepository;
    @Autowired
    JobService jobService;
    @Autowired
    AgentUserService agentUserService;

    public Object getJobStatusList() {
        return brtcJobStatusRepository.findAll();
    }

    public Object getJobStatusHistList() {
        return brtcJobStatusHistRepository.findAll();
    }

    public Object getJobStatusHistInfo(String jobId) {
        return brtcJobStatusHistRepository.findByJobId(jobId);
    }

    public Object getJobModelList() {
        return brtcJobModelRepository.findAll();
    }

    public Object getJobModelInfo(String modelId) {
        return brtcJobModelRepository.findOne(modelId);
    }

    public Object getJobStatusErrorList() {
        return brtcJobStatusErrorRepository.findAll();
    }

    public BrtcJobStatusError getJobStatusErrorInfo(String jobId) {
        return brtcJobStatusErrorRepository.findOne(jobId);
    }

    public BrtcJobStatus getJobStatus(String jobId) {
        BrtcJobStatus brtcJobStatus = brtcJobStatusRepository.findOne(jobId);
        ValidationUtil.throwIfEmpty(brtcJobStatus, "job id");
        return brtcJobStatus;
    }

    public void createJobStatus(String jobId, String user, String jobBy, String agentId) {
        //insert job status
        insertJobStatus(jobId, jobBy, user, agentId);
        //insert job status history
        insertJobStatusHistory(jobId);
    }

    public void updateJobStatus(JobParam jobParam, JobStatusVO jobStatusVO) {
        String jobId = jobStatusVO.getJobId();
        String status = jobStatusVO.getStatus();
        if (JobRepository.STATE_PROCESSING.equals(status)) {
            changeJobStatusToProcess(jobId, jobStatusVO.getType(), jobParam);
        } else if (JobRepository.STATE_SUCCESS.equals(status)) {
            changeJobStatusToSuccess(jobId);
        } else if (JobRepository.STATE_FAIL.equals(status)) {
            changeJobStatusToFail(jobStatusVO);
        }
        //insert job status hist (modify time)
        insertJobStatusHistory(jobId);
    }

    public Map<String, Object> executeJobErrorModel(String jobId) {
        BrtcJobStatusError errorJob = brtcJobStatusErrorRepository.findOne(jobId);
        String modelId = errorJob.getModelId();
        BrtcJobModel errorModelInfo = brtcJobModelRepository.findOne(modelId);
        String jobJson = errorModelInfo.getContents();
        try {
            JobParam jobParam = JsonUtil.fromJson(jobJson, JobParam.class);
            jobParam.setJid(JobRepository.getRandomId("e"));
            jobParam.setUser(agentUserService.getAgentIdByCurrentUser());
            logger.info("Job error model execute. model info : {}", jobParam);
            return jobService.executeJob(jobParam, JobRepository.JOB_BY_ERROR_MODEL);
        } catch (Exception e) {
            logger.error("error in executeJobErrorModel", e);
            throw new BrighticsCoreException("3651", ExceptionUtils.getMessage(e));
        }
    }

    public List<Map<String, String>> getJobListByUserAndMain(String userId, String main) {
        List<Map<String, String>> result = new ArrayList<>();
        List<BrtcJobStatus> jobStatuses = brtcJobStatusRepository.findByUserOrderByStartTime(userId);
        List<BrtcJobModel> jobModels = brtcJobModelRepository.findByMain(main);
        Map<String, BrtcJobModel> jobModelMap = new HashMap<>();
        for (BrtcJobModel brtcJobModel : jobModels) {
            jobModelMap.put(brtcJobModel.getModelId(), brtcJobModel);
        }
        for (BrtcJobStatus jobStatus : jobStatuses) {
            if (StringUtils.isNotBlank(jobStatus.getModelId()) && jobModelMap.containsKey(jobStatus.getModelId())) {
                Map<String, String> job = new HashMap<>();
                job.put("jid", jobStatus.getJobId());
                job.put("status", jobStatus.getStatus());
                job.put("startTime", jobStatus.getStartTime());
                job.put("endTime", jobStatus.getEndTime());
                job.put("jobBy", jobStatus.getJobBy());
                job.put("modelType", jobModelMap.get(jobStatus.getModelId()).getModelType());
                result.add(job);
            }
        }
        return result;
    }

    private void changeJobStatusToProcess(String jobId, String modelType, JobParam jobParam) {
        String modelId = JobRepository.getRandomId("m");
        String eventTime = getCurrentTime();

        //insert job model and variable json
        insertJobModel(modelId, modelType, eventTime, jobParam);
        //update job status (start time, modelId)
        updateProcessJobStatus(jobId, modelId, eventTime);
    }

    private void changeJobStatusToSuccess(String jobId) {
        String eventTime = getCurrentTime();
        //update job status (end time)
        updateSuccessJobStatus(jobId, eventTime);
    }

    private void changeJobStatusToFail(JobStatusVO jobStatusVO) {
        String jobId = jobStatusVO.getJobId();
        String eventTime = getCurrentTime();
        //update job status (end time , error message)
        updateFailJobStatus(jobId, eventTime, jobStatusVO.getErrorMessage());
        //insert cause of error detail(jobid, point etc)
        insertErrorCause(jobId, jobStatusVO);
    }

    private void insertJobStatus(String jobId, String jobBy, String user, String agentId) {
        BrtcJobStatus brtcJobStatus = new BrtcJobStatus();
        brtcJobStatus.setJobId(jobId);
        brtcJobStatus.setJobBy(jobBy);
        brtcJobStatus.setUser(user);
        brtcJobStatus.setModifyTime(getCurrentTime());
        brtcJobStatus.setStatus(JobRepository.STATE_WAITING);
        brtcJobStatus.setAgentId(agentId);
        brtcJobStatusRepository.save(brtcJobStatus, "job status");
    }

    private void updateProcessJobStatus(String jobId, String modelId, String startTime) {
        BrtcJobStatus jobStatus = getJobStatus(jobId);
        jobStatus.setJobId(jobId);
        jobStatus.setModelId(modelId);
        jobStatus.setStartTime(startTime);
        jobStatus.setModifyTime(startTime);
        jobStatus.setStatus(JobRepository.STATE_PROCESSING);
        brtcJobStatusRepository.update(jobStatus, "job status");
    }

    private void updateSuccessJobStatus(String jobId, String endTime) {
        BrtcJobStatus jobStatus = getJobStatus(jobId);
        jobStatus.setJobId(jobId);
        jobStatus.setEndTime(endTime);
        jobStatus.setModifyTime(endTime);
        jobStatus.setStatus(JobRepository.STATE_SUCCESS);
        jobStatus.setMessage(JobRepository.STATE_SUCCESS);
        brtcJobStatusRepository.update(jobStatus, "job status");
    }

    private void updateFailJobStatus(String jobId, String endTime, String message) {
        BrtcJobStatus jobStatus = getJobStatus(jobId);
        jobStatus.setJobId(jobId);
        jobStatus.setEndTime(endTime);
        jobStatus.setModifyTime(endTime);
        jobStatus.setStatus(JobRepository.STATE_FAIL);
        jobStatus.setMessage(message);
        brtcJobStatusRepository.update(jobStatus, "job status");
    }

    private void insertJobStatusHistory(String jobId) {
        BrtcJobStatus jobStatus = getJobStatus(jobId);

        BrtcJobStatusHist brtcJobStatusHist = new BrtcJobStatusHist();
        brtcJobStatusHist.setJobId(jobId);
        brtcJobStatusHist.setJobBy(jobStatus.getJobBy());
        brtcJobStatusHist.setUser(jobStatus.getUser());
        brtcJobStatusHist.setModelId(jobStatus.getModelId());
        brtcJobStatusHist.setStartTime(jobStatus.getStartTime());
        brtcJobStatusHist.setEndTime(jobStatus.getEndTime());
        brtcJobStatusHist.setModifyTime(jobStatus.getModifyTime());
        brtcJobStatusHist.setStatus(jobStatus.getStatus());
        brtcJobStatusHist.setMessage(jobStatus.getMessage());
        brtcJobStatusHist.setAgentId(jobStatus.getAgentId());

        brtcJobStatusHistRepository.save(brtcJobStatusHist, "job status history");
    }

    private void insertErrorCause(String jobId, JobStatusVO jobStatusVO) {
        BrtcJobStatus jobStatus = getJobStatus(jobId);
        String jsonStatusContents = JsonUtil.toJson(jobStatusVO);
        BrtcJobStatusError brtcJobStatusError = new BrtcJobStatusError();
        brtcJobStatusError.setJobId(jobId);
        brtcJobStatusError.setContents(jsonStatusContents);
        brtcJobStatusError.setMessage(jobStatusVO.getErrorMessage());
        brtcJobStatusError.setFunctionName(jobStatusVO.getErrorFunctionName());
        brtcJobStatusError.setModelId(jobStatus.getModelId());
        brtcJobStatusErrorRepository.save(brtcJobStatusError, "job status error");
    }

    private void insertJobModel(String modelId, String modelType, String eventTime, JobParam jobParam) {
        String jsonModelContents = JsonUtil.toJson(jobParam);

        BrtcJobModel brtcJobModel = new BrtcJobModel();
        brtcJobModel.setModelId(modelId);
        brtcJobModel.setModelType(modelType);
        brtcJobModel.setContents(jsonModelContents);
        brtcJobModel.setModifyTime(eventTime);
        brtcJobModel.setMain(jobParam.getMain());

        brtcJobModelRepository.save(brtcJobModel, "job model");
    }

    private String getCurrentTime() {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSSSSS").format(new Date());
    }

    public void updateJobStatusWithExceptionCode(String jobId, String exceptionCode) {
        updateFailJobStatus(jobId, getCurrentTime(), new BrighticsCoreException(exceptionCode).getMessage());
        insertJobStatusHistory(jobId);
    }
}
