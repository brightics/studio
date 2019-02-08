package com.samsung.sds.brightics.server.common.flowrunner;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import com.samsung.sds.brightics.common.workflow.runner.IJobRunnerApi;
import com.samsung.sds.brightics.common.workflow.runner.vo.JobParam;
import com.samsung.sds.brightics.common.workflow.runner.vo.JobStatusVO;
import com.samsung.sds.brightics.server.common.holder.BeanHolder;
import com.samsung.sds.brightics.server.common.message.task.TaskMessageBuilder;
import com.samsung.sds.brightics.server.common.message.task.TaskMessageRepository;

public class JobRunnerApi implements IJobRunnerApi {
	
	@Override
	public String executeTask(String taskId, String name, String parameters, String attributes) {
		BeanHolder.getBeanHolder().taskService.executeSyncTask(TaskMessageBuilder.newBuilder(taskId, name).setAttributes(attributes).setParameters(parameters).build());
		return taskId;
	}

	@Override
	public boolean isFinishTask(String taskId) {
		return TaskMessageRepository.isExistFinishMessage(taskId);
	}

	@Override
	public Object getTaskResult(String taskId) {
		return BeanHolder.getBeanHolder().messageManager.taskManager().getAsyncTaskResult(taskId);
	}

	@Override
	public void stopTask(String stopTaskId, String functionName, String context) {
		BeanHolder.getBeanHolder().taskService.stopTask(stopTaskId, functionName, context);
	}

	@Override
	public Object getDatasourceInfo(String name) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getScriptWithParam(Parameters params) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean isMetadataRequest(JsonObject json) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public JsonElement convert(JsonObject json) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void updateJobStatus(JobParam jobParam, JobStatusVO jobStatusVO) {
		// TODO Auto-generated method stub

	}

	@Override
	public Object getData(String mid, String tid, long min, long max) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void addDataAlias(String source, String alias) {
		// TODO Auto-generated method stub
	}

}
