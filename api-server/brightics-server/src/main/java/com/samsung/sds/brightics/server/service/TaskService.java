package com.samsung.sds.brightics.server.service;

import java.util.ArrayList;
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
import com.samsung.sds.brightics.common.core.util.IdGenerator;
import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage;
import com.samsung.sds.brightics.common.network.util.ParameterBuilder;
import com.samsung.sds.brightics.server.common.message.MessageManagerProvider;
import com.samsung.sds.brightics.server.common.message.task.TaskMessageRepository;
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil;
import com.samsung.sds.brightics.server.common.util.ResultMapUtil;
import com.samsung.sds.brightics.server.model.vo.ExceptionInfoVO;
import com.samsung.sds.brightics.server.model.vo.JobFunctionStatusVO;
import com.samsung.sds.brightics.server.model.vo.JobModelStatusVO;
import com.samsung.sds.brightics.server.service.repository.JobRepository;

@Service
public class TaskService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    public MessageManagerProvider messageManager;

    @SuppressWarnings("unused")
    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    public Object executeSyncScript(String name, String script) {
        String param = ParameterBuilder.newBuild().addProperty("script", script).addProperty("mid", "unused").build();
        return executeSyncTask(ExecuteTaskMessage.newBuilder().setUser(AuthenticationUtil.getRequestUserId())
                .setTaskId(IdGenerator.getSimpleId()).setName(name).setParameters(param).build());
    }

    public String executeTask(ExecuteTaskMessage message) {
        String taskId = message.getTaskId();
        if (StringUtils.isEmpty(taskId)) {
            throw new BrighticsCoreException("3002", "task Id");
        }
        try {
            messageManager.taskManager().sendAsyncTask(message);
        } catch (Exception e) {
            throw new BrighticsCoreException("3001").addDetailMessage(ExceptionUtils.getStackTrace(e));
        }
        return taskId;
    }

    public Object executeSyncTask(ExecuteTaskMessage message) {
        String taskId = message.getTaskId();
        if (StringUtils.isEmpty(taskId)) {
            throw new BrighticsCoreException("3002", "task Id");
        }
        try {
            return messageManager.taskManager().sendSyncTask(message);
        } catch (Exception e) {
            throw new BrighticsCoreException("3001").addDetailMessage(ExceptionUtils.getStackTrace(e));
        }
    }

    public Map<String, Object> stopTask(String stopTaskId, String functionName, String context) {
        try {
            messageManager.taskManager().sendStopTask(
                    StopTaskMessage.newBuilder().
                            setTargetTaskId(stopTaskId).
                            setUser(AuthenticationUtil.getRequestUserId()).
                            setName(functionName).
                            setContext(context).build());
            return ResultMapUtil.success("stop task");
        } catch (Exception e) {
            throw new BrighticsCoreException("3001").addDetailMessage(ExceptionUtils.getStackTrace(e));
        }
    }

    public Object getTaskResult(String taskId) {
        if (TaskMessageRepository.isExistRunningMessage(taskId)) {
            return taskResultFomatter(taskId, JobRepository.STATE_PROCESSING, null, 0.0);
        } else if (TaskMessageRepository.isExistFinishMessage(taskId)) {
            try {
                Object resultMessage = messageManager.taskManager().getAsyncTaskResult(taskId);
                double duration = 0.0;
                return taskResultFomatter(taskId, JobRepository.STATE_SUCCESS, resultMessage, duration);
            } catch (BrighticsCoreException e) {
                String errorMessage = e.getMessage();
                return taskErrorResultFomatter(taskId, JobRepository.STATE_FAIL, 0,
                        new ExceptionInfoVO(errorMessage, e.detailedCause));
            } catch (Exception e) {
                return taskErrorResultFomatter(taskId, JobRepository.STATE_FAIL, 0,
                        new ExceptionInfoVO(e.getMessage(), ExceptionUtils.getStackTrace(e)));
            }
        } else {
            throw new BrighticsCoreException("3701");
        }
    }

    public Object getTaskResult(String jid, String fid) {
        if (jobRepository.getJobStatus(jid) != null) {
            for (JobModelStatusVO jms : jobRepository.getJobStatus(jid).getProcesses()) {
                for (JobFunctionStatusVO jfs : jms.getFunctions()) {
                    if (fid.equals(jfs.getFid())) {
                        return getTaskResult(jfs.getTaskId());
                    }
                }
            }
            throw new BrighticsCoreException("3701");
        } else {
            throw new BrighticsCoreException("3701");
        }
    }

    private Object taskResultFomatter(String taskId, String status, Object result, double duration) {
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("taskId", taskId);
        resultMap.put("status", status);
        resultMap.put("message", result);
        resultMap.put("duration", duration);
        return resultMap;
    }

    private Object taskErrorResultFomatter(String taskId, String status, double duration,
            ExceptionInfoVO exceptionInfo) {
        List<ExceptionInfoVO> exceptionInfoList = new ArrayList<>();
        exceptionInfoList.add(exceptionInfo);
        return taskErrorResultFomatter(taskId, status, duration, exceptionInfoList);
    }

    private Object taskErrorResultFomatter(String taskId, String status, double duration,
            List<ExceptionInfoVO> exceptionInfoList) {
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("taskId", taskId);
        resultMap.put("status", status);
        resultMap.put("errorInfo", exceptionInfoList);
        resultMap.put("duration", duration);
        return resultMap;
    }
}
