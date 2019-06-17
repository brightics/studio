/*
    Copyright 2019 Samsung SDS
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

package com.samsung.sds.brightics.lightweight.job;

import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.protobuf.InvalidProtocolBufferException;
import com.samsung.sds.brightics.agent.service.MetaDataService;
import com.samsung.sds.brightics.agent.service.TaskService;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.exception.BrighticsUncodedException;
import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;
import com.samsung.sds.brightics.common.network.proto.FailResult;
import com.samsung.sds.brightics.common.network.proto.MessageStatus;
import com.samsung.sds.brightics.common.network.proto.SuccessResult;
import com.samsung.sds.brightics.common.network.proto.metadata.DataAliasByDataKeyMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage.DataActionType;
import com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage;
import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage.Builder;
import com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage;
import com.samsung.sds.brightics.common.network.util.ParameterBuilder;
import com.samsung.sds.brightics.common.workflow.flowrunner.AbsJobRunnerApi;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobParam;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobStatusVO;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.MetaConvertVO;

public class LightweightJobRunnerApi extends AbsJobRunnerApi {

    private static ConcurrentHashMap<String, ResultTaskMessage> taskResultMap = new ConcurrentHashMap<>();

    @Override
    public void executeTask(String taskId, String userName, String name, String parameters, String attributes) {

        Builder builder = ExecuteTaskMessage.newBuilder().setName(name).setTaskId(taskId)
                .setUser(ThreadLocalContext.get("user").toString());
        if (StringUtils.isNoneBlank(parameters)) {
            builder.setParameters(parameters);
        } else {
            builder.setParameters("{}");
        }

        if (StringUtils.isNoneBlank(attributes)) {
            builder.setAttributes(attributes);
        } else {
            builder.setAttributes("{}");
        }

        ResultTaskMessage taskResult = TaskService.getTaskResult(builder.build());
        taskResultMap.put(taskId, taskResult);
    }

    @Override
    public boolean isFinishTask(String taskId) {
        return true;
    }

    @Override
    public Object getTaskResult(String taskId) {
        ResultTaskMessage message = taskResultMap.get(taskId);
        MessageStatus status = message.getMessageStatus();
        taskResultMap.remove(taskId);
        try {
            if (MessageStatus.SUCCESS == status) {
                SuccessResult successResult = message.getResult().unpack(SuccessResult.class);
                return successResult.getResult();
            } else {
                FailResult failResult = message.getResult().unpack(FailResult.class);
                throw new BrighticsUncodedException(failResult.getMessage(), failResult.getDetailMessage());
            }
        } catch (InvalidProtocolBufferException e) {
            throw new BrighticsCoreException("3001").addDetailMessage(ExceptionUtils.getStackTrace(e));
        }
    }

    @Override
    public void stopTask(String taskId, String name, String context) {
        //Do nothing.
    }


    @Override
    public JsonElement convert(MetaConvertVO metaConvertVO) {
        //TODO convert script for UDF or data sources for read from DB.
        return null;
    }

    @Override
    public void updateJobStatus(JobParam jobParam, JobStatusVO jobStatusVO) {
        //Do nothing.
    }

    @Override
    public Object getData(String key, long min, long max) {
        String user = ThreadLocalContext.get("user").toString();
        String param = ParameterBuilder.newBuild().addProperty("min", min).addProperty("max", max).build();
        ResultDataMessage result = MetaDataService.manipulateData(ExecuteDataMessage.newBuilder().setUser(user)
                .setActionType(DataActionType.DATA).setKey(key).setParameters(param).build());
        return dataResultParser(result);
    }

    private Object dataResultParser(ResultDataMessage result) {
        try {
            if (result.getMessageStatus() == MessageStatus.SUCCESS) {
                return result.getResult().unpack(SuccessResult.class).getResult();
            } else {
                FailResult failResult = result.getResult().unpack(FailResult.class);
                throw new BrighticsUncodedException(failResult.getMessage(), failResult.getDetailMessage());
            }
        } catch (InvalidProtocolBufferException e) {
            throw new BrighticsCoreException("3001").addDetailMessage(ExceptionUtils.getStackTrace(e));
        }
    }

    @Override
    public void addDataAlias(String source, String alias) {
        String user = ThreadLocalContext.get("user").toString();
        if (source.equals(alias)) {
            return;
        }
        DataAliasByDataKeyMessage message = DataAliasByDataKeyMessage.newBuilder().setSourceDataKey(source)
                .setAliasDataKey(alias).setUser(user).build();
        MetaDataService.addDataAliasByDataKey(message);
    }

    @Override
    public void executeDLScript(JsonObject model, String jid) {
        //Do nothing.
    }

}
