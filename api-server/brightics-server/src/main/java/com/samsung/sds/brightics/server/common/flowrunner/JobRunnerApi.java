package com.samsung.sds.brightics.server.common.flowrunner;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.workflow.flowrunner.AbsJobRunnerApi;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobParam;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobStatusVO;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.MetaConvertVO;
import com.samsung.sds.brightics.server.common.holder.BeanHolder;
import com.samsung.sds.brightics.server.common.message.task.TaskMessageBuilder;
import com.samsung.sds.brightics.server.common.message.task.TaskMessageRepository;

public class JobRunnerApi extends AbsJobRunnerApi {

	@Override
	public void executeTask(String taskId, String userName, String name, String parameters, String attributes) {
		BeanHolder.getBeanHolder().taskService.executeTask(TaskMessageBuilder.newBuilder(taskId, name)
				.setAttributes(attributes).setParameters(parameters).build(userName));
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
	public JsonElement convert(MetaConvertVO metaConvertVO) {
		return BeanHolder.getBeanHolder().metadataConverterService.convert(metaConvertVO);
	}

	@Override
	public void updateJobStatus(JobParam jobParam, JobStatusVO jobStatusVO) {
		BeanHolder.getBeanHolder().jobStatusService.updateJobStatus(jobParam, jobStatusVO);
	}

	@Override
	public Object getData(String key, long min, long max) {
		return BeanHolder.getBeanHolder().dataService.getData(key, min, max);
	}

	@Override
	public void addDataAlias(String source, String alias) {
		BeanHolder.getBeanHolder().dataService.addDataAlias(source, alias);
	}

	@Override
	public void executeDLScript(JsonObject model, String jid) {
		//TODO do nothing
//		BeanHolder.getBeanHolder().deeplearningService.executeDLScript(model, jid);
	}

}
