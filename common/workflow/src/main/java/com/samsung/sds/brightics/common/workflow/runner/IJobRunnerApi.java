package com.samsung.sds.brightics.common.workflow.runner;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import com.samsung.sds.brightics.common.workflow.runner.vo.JobParam;
import com.samsung.sds.brightics.common.workflow.runner.vo.JobStatusVO;

public interface IJobRunnerApi {

	//Execute job APIs.
	//taskService.executeTask return taskId
	public String executeTask(String taskId, String name, String parameters, String attributes);
	//TaskMessageRepository.isExistFinishMessage
	public boolean isFinishTask(String taskId);
	//messageManager.taskManager().getAsyncTaskResult
	public Object getTaskResult(String taskId);
	//taskService.stopTask
	public void stopTask(String stopTaskId, String functionName, String context);
	
	//Update job status
	public void updateJobStatus(JobParam jobParam, JobStatusVO jobStatusVO);

	//Get meta data APIs.
	//dataSourceService.getDatasourceInfo
	public Object getDatasourceInfo(String datasourceName);
	//pyFunctionService.getScriptWithParam
	public String getScriptWithParam(Parameters params);
	//metadataConverterService.isMetadataRequest
	public boolean isMetadataRequest(JsonObject json);
	//metadataConverterService.convert
	public JsonElement convert(JsonObject json);
	
	//Get and modify staging data APIs.
	//dataService.getData
	public Object getData(String mid, String tid, long min, long max);
	//dataService.addDataAlias
	public void addDataAlias(String source, String alias);
}
