package com.samsung.sds.brightics.common.workflow.flowrunner;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.MetaConvertVO;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobParam;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobStatusVO;

/**
 * This class is an abstraction of the api used to execute the flow.  
 * @author hk.Im
 */
public abstract class AbsJobRunnerApi {
	
	//easy execute task. 
	public Object executeTaskAndGetResult(String taskId,  String userName, String name, String parameters, String attributes) throws InterruptedException {
		executeTask(taskId, userName, name, parameters, attributes);
		while (!isFinishTask(taskId)) {
            Thread.sleep(50L);
        }
        return getTaskResult(taskId);
	}

	/**
	 * <b>[API related to execute job]</b><br>
	 * Execute function or script in work node.<br>
	 * If the task complete normally. 
	 * The results of the task must be stored in a custom store (memory or database),
	 * for asynchronous communication.
	 * 
	 * @param task Id : task id for stop task.
	 * @param userName : execute user name
	 * @param name : function or script name.
	 * @param parameters : information for each function and script.
	 * @param attributes : contain mid, persist, label.
	 */
	abstract public void executeTask(String taskId, String userName, String name, String parameters, String attributes);
	
	/**
	 * <b>[API related to execute job]</b><br>
	 * Check whether task is completed from custom store.
	 * @param taskId
	 * @return (boolean) task status.
	 */
	abstract public boolean isFinishTask(String taskId);
	
	/**
	 * <b>[API related to execute job]</b><br>
	 * Get the task results from custom store.
	 * @param taskId
	 * @return (Object) task result 
	 */
	abstract public Object getTaskResult(String taskId);
	
	/**
	 * <b>[API related to execute job]</b><br>
	 * Stop the task 
	 * @param taskId : task id to stop
	 * @param name : function or script name
	 * @param context : run context environment ("scala" or "python")
	 */
	abstract public void stopTask(String taskId, String name, String context);

	/**
	 * <b>[API related to meta data]</b><br>
	 * It converts various metadata and returns the result.<br>
	 * Kinds : <b>sql, script, datasource, s3, pyfunction, deeplearning predict</b>.
	 * @param metaConvertVO : contain type and parameters
	 * @return (JsonElement) metadata search results.
	 */
	abstract public JsonElement convert(MetaConvertVO metaConvertVO);
	
	/**
	 * <b>[API related to meta data]</b><br>
	 * Store the status(<b>PROCESSING, SUCCESS, FAIL</b>) of an ongoing job outside.
	 * @param jobParam 
	 * @param jobStatusVO
	 */
	abstract public void updateJobStatus(JobParam jobParam, JobStatusVO jobStatusVO);
	
	/**
	 * <b>[API related to staging data]</b><br>
	 * Get staging data.
	 * @param key : data key. ("/user/mid/tid")
	 * @param min
	 * @param max
	 * @return (Object) staging data.
	 */
	abstract public Object getData(String key, long min, long max);
	
	/**
	 * <b>[API related to staging data]</b><br>
	 * Link staging data.
	 * @param source 
	 * @param alias
	 */
	abstract public void addDataAlias(String source, String alias);
	
	/**
	 * <b>[API for execute deep learning flow]</b><br>
	 * execute deep learning script.
	 * @param model : main model in deeplearning flow models.
	 * @param jid
	 */
	abstract public void executeDLScript(JsonObject model, String jid);
	
}
