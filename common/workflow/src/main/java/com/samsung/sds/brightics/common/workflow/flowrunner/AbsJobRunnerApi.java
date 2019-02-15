package com.samsung.sds.brightics.common.workflow.flowrunner;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobParam;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobStatusVO;

public abstract class AbsJobRunnerApi {
	
	//easy execute task.
	public Object executeTaskAndGetResult(String taskId, String name, String parameters, String attributes) throws InterruptedException {
		executeTask(taskId, name, parameters, attributes);
		while (!isFinishTask(taskId)) {
            Thread.sleep(50L);
        }
        return getTaskResult(taskId);
	}

	//API related to execute job.
	abstract public String executeTask(String taskId, String name, String parameters, String attributes);
	abstract public boolean isFinishTask(String taskId);
	abstract public Object getTaskResult(String taskId);
	abstract public void stopTask(String taskId, String name, String context);

	//API related to meta data.
	abstract public JsonObject getDatasourceInfo(String name); //for import data.
	abstract public String getScriptWithParam(Parameters params); //for ad python function.
	abstract public boolean isMetadataRequest(JsonObject json); 
	abstract public JsonElement convert(JsonObject json);
	abstract public void updateJobStatus(JobParam jobParam, JobStatusVO jobStatusVO);
	
	//API related to staging data.
	abstract public Object getData(String mid, String tid, long min, long max);
	abstract public void addDataAlias(String source, String alias);
	
	//API for execute deep learning flow 
	abstract public String getKerasPredictScript(String outDFAlias, JsonObject param);
	abstract public void executeDLScript(JsonObject model, String jid);
	
}
