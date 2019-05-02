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

package com.samsung.sds.brightics.server.common.flowrunner.model.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.util.IdGenerator;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.common.variable.Variable;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.variable.resolver.IVariableResolver;
import com.samsung.sds.brightics.common.variable.resolver.impl.DefaultVariableResolver;
import com.samsung.sds.brightics.common.workflow.context.WorkflowContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.model.impl.SequentialWorkflow;
import com.samsung.sds.brightics.common.workflow.model.impl.loop.LoopStatus;
import com.samsung.sds.brightics.server.common.flowrunner.status.JobContextHolder;
import com.samsung.sds.brightics.server.common.flowrunner.status.JobStatusTracker;
import com.samsung.sds.brightics.server.common.flowrunner.status.Status;
import com.samsung.sds.brightics.server.common.message.task.TaskMessageBuilder;
import com.samsung.sds.brightics.server.common.message.task.TaskMessageRepository;
import com.samsung.sds.brightics.server.common.util.JsonObjectUtil;
import com.samsung.sds.brightics.server.common.util.LoggerUtil;
import com.samsung.sds.brightics.server.common.util.opt.OptScriptUtil;

public abstract class OptWorkflow extends SequentialWorkflow {

	protected static final Logger LOGGER = LoggerFactory.getLogger(OptWorkflow.class);

	public static final String PARAMS_INDEX_VARIABLE = "index-variable";
	protected static Integer loopLimit = SystemEnvUtil.LOOP_LIMIT;
	private String label = "opt";
	private static final String SENSE_MAXIMIZE_PARAMETER = "MAXIMIZE";

	
	public OptWorkflow(String name, Parameters parameters) {
		super(name, parameters);
		setNewVariableScope(true);
	}

	void runBody(WorkflowContext context) {
		super.start(context);
	}
		
	
	@Override
	public void start(WorkflowContext context) {
		
		//complement opt parameters
		String optJobId = resolvedParameters.getString("mid") + IdGenerator.getSimpleId();
		String method = resolvedParameters.getString("method");
		String maxIterations = resolvedParameters.getString("maxIterations");
		String maxEvaluations = resolvedParameters.getString("maxEvaluations");
		JsonElement objective = resolvedParameters.getParam("objective");
		JsonElement constraints = resolvedParameters.getParam("constraints");
		Map<String, JsonElement> optVariables = resolvedParameters.getMap("optVariables");
		String objectiveSense = objective.getAsJsonObject().get("sense").getAsString().toUpperCase();
		boolean isObjectiveSenseMax =  StringUtils.equals(SENSE_MAXIMIZE_PARAMETER, objectiveSense);
		
		//init opt status
		Map<String, Object> optStatus = new HashMap<>();
		List<Object> parameterStatus = new ArrayList<>();
		Object[] bestParameterStatus = new Object[1];
		List<String> objectiveStatus = new ArrayList<>();
		optStatus.put("parameter", parameterStatus);
		optStatus.put("bestParameter", bestParameterStatus);
		optStatus.put("objective", objectiveStatus);

		//init loop status
		LoopStatus loopStatus = new LoopStatus(0, null);
		loopStatus.setCount(1);
		loopStatus.setIndexVariable(resolvedParameters.getString(PARAMS_INDEX_VARIABLE));

		int idx = 0;
		LoggerUtil.pushMDC("fid", this.name);
		JobContextHolder.getJobStatusTracker().startControlFunction(this.name, label, "Opt");
		LOGGER.info("[OPT START]");
		JobStatusTracker tracker = JobContextHolder.getJobStatusTracker();

		LOGGER.info(String.format("[INITIALIZE OPT JOB] optId: %s", optJobId ));
		String scriptOfCreateBroptJob = OptScriptUtil.createBroptJob(optJobId, optVariables, objectiveSense, constraints, method,
				maxIterations, maxEvaluations);
		runPythonScriptTask(scriptOfCreateBroptJob);
		
		boolean isComplete = false;
		while (!isComplete) {
			if (Thread.currentThread().isInterrupted()) {
				Thread.currentThread().interrupt();
				throw new BrighticsCoreException("3101");
			}
			if (idx + 1 > OptWorkflow.loopLimit) {
				throw new BrighticsCoreException("3102", "opt loop count exceeds " + OptWorkflow.loopLimit);
			}
			
			LoggerUtil.pushMDC("opt loop", String.valueOf(loopStatus.getCount()));
			LOGGER.info("[OPT LOOP " + loopStatus.getCount() + " START]");

			runBody(context); 

			//get objective value
			String objectiveValue =  getObjectiveValue(context.getVariableContext(), objective.getAsJsonObject());
			
			boolean isRefreshBestParameter = isRefreshBestParameter(isObjectiveSenseMax, objectiveValue);
			
			LOGGER.info(String.format("[UPDATE OPT JOB] optId: %s", optJobId ));
			String scriptOfUpdateJob = OptScriptUtil.updateBroptJob(optJobId, objectiveValue);
			Object updatedVriablesObject = runPythonScriptTask(scriptOfUpdateJob);
			JsonObject updatedVriables = JsonUtil
					.jsonToObject(updatedVriablesObject.toString().replaceAll("[']", ""));

			List<Map<String, String>> parameterRow = new ArrayList<>();
			List<Map<String, String>> bestParameterRow = new ArrayList<>();
			
			//set and resolve updated variable
			for (Entry<String, JsonElement> updatedVriable : updatedVriables.entrySet()) {
				String name = updatedVriable.getKey();
				String value = updatedVriable.getValue().getAsString();
				JsonObject optVariableInfo = optVariables.get(name).getAsJsonObject();
				String fid = optVariableInfo.getAsJsonPrimitive("fid").getAsString();
				String paramName = optVariableInfo.getAsJsonPrimitive("paramName").getAsString();
				
				//set parameter information.
				Map<String, String> parameterInfo = new HashMap<>();
				parameterInfo.put("fid", fid);
				parameterInfo.put("name", paramName);
				parameterInfo.put("value", value);
				parameterRow.add(parameterInfo);
				if(isRefreshBestParameter){
					bestParameterRow.add(parameterInfo);
				}
				
				LOGGER.info(String.format("[UPDATE OPT JOB] updated parameter info. fid : %s, paramName : %s, variableName : %s, value : %s",
						fid, paramName, name, value));
				context.getVariableContext().setVariable(new Variable(name, JsonUtil.jsonToElement(value)));
			}
			
			//set objective value and parameter status information.
			objectiveStatus.add(objectiveValue);
			parameterStatus.add(parameterRow);
			if(isRefreshBestParameter){
				bestParameterStatus[0] = bestParameterRow;
			}

			// send status message.
			JobContextHolder.getJobStatusTracker().updateFunctionMessage(this.name, loopStatus.getCount() + " times");
			JobContextHolder.getJobStatusTracker().updateOptimizationMessage(this.name, optStatus);
			LoggerUtil.popMDC("opt loop");
			
			// get is complete 
			String scriptOfIsComplete = OptScriptUtil.isCompleteBroptJob(optJobId);
			Object isCompleteObject = runPythonScriptTask(scriptOfIsComplete);
			isComplete = Boolean.parseBoolean(isCompleteObject.toString());

			loopStatus.setIndex(++idx);
			loopStatus.setCount(loopStatus.getIndex() + 1);
		}

		LOGGER.info("[OPT LOOP FINISHED, APPLYING BEST PARAMETERS] optId: "+ optJobId);

		//set and resolve best parameter variable
		String scriptOfGetBestParameter = OptScriptUtil.getBestParameterBroptJob(optJobId);
		Object bestParameterObject = runPythonScriptTask(scriptOfGetBestParameter);
		JsonObject bestParameters = JsonUtil.jsonToObject(bestParameterObject.toString());
		
		LOGGER.info("[OPT BEST PARAMETERS] optId: "+ optJobId+", {}", bestParameters);
		
		//add best parameters to main model variable scope
		for (Entry<String, JsonElement> bestParameter : bestParameters.entrySet()) {
			String paramName = bestParameter.getKey();
			context.getVariableContext().setVariable(tracker.getMainModelMid(),
					new Variable(paramName, bestParameter.getValue().getAsJsonPrimitive()));
		}

		LOGGER.info("[OPT END] optId: "+ optJobId);
		JobContextHolder.getJobStatusTracker().endControlFunctionWith(this.name, Status.SUCCESS);
		LoggerUtil.popMDC("fid");
	}


	//get Objective value.
	private String getObjectiveValue(VariableContext variableContext, JsonObject objective) {
		IVariableResolver resolver = new DefaultVariableResolver(variableContext);

		String inData = JsonObjectUtil.getAsString(objective, "tableName");
		String column = JsonObjectUtil.getAsString(objective, "column");
		int rowIndex = JsonObjectUtil.getAsInt(objective, "row");
		JsonElement resolvedValue = resolver.resolve(new Variable("objective",
				new JsonPrimitive(String.format("${=getCellValue('%s', '%s', %d)}", inData, column, rowIndex)))
						.getValue());
		return resolvedValue.toString();
	}
	
	
	private JsonObject buildAttributes() {
        JsonObject attributes = new JsonObject();
        attributes.addProperty("persist", false);
        attributes.addProperty("mid", resolvedParameters.getString("mid"));
        attributes.addProperty("label", "");
        return attributes;
    }

	private Object runPythonScriptTask(String script) {
		String taskId = IdGenerator.getSimpleId();
		JobContextHolder.getJobStatusTracker().getCurrentFunctionStatus().setTaskId(taskId);
        LoggerUtil.pushMDC("taskId", taskId);
		try {
			ParametersBuilder pb = new ParametersBuilder();
			pb.add("script", script);
			pb.add("persist", false);
			pb.add("mid", resolvedParameters.getString("mid"));

			LOGGER.info("[OPT TASK START]");
			Parameters params = pb.build();
			LOGGER.info("[OPT SCRIPT PROCESSING] [{}] parameters : {}", label, params);

			// executeTask
			JobContextHolder.getBeanHolder().taskService.executeTask(
					TaskMessageBuilder.newBuilder(taskId, "Python").setAttributes(buildAttributes().toString()).setParameters(params.toJsonString()).build());
			// Wait until the task is finished.
			while (!TaskMessageRepository.isExistFinishMessage(taskId)) {
				Thread.sleep(50L);
			}
			Object result = JobContextHolder.getBeanHolder().messageManager.taskManager().getAsyncTaskResult(taskId);
			LOGGER.info("[OPT TASK SUCCESS] {}", result);
			return result;
		} catch (InterruptedException e) {
			LOGGER.error("[OPT TASK INTERRUPTED]", e);
			JobContextHolder.getBeanHolder().taskService.stopTask(taskId, "Python", "python");
			throw new BrighticsCoreException("3101");
		} catch (AbsBrighticsException e) {
			LOGGER.error("[OPT TASK ERROR] {}", e.getMessage());
			throw e;
		} finally {
			LoggerUtil.popMDC("taskId");
		}
	}
	
	private String bestObjectiveValue;

	private boolean isRefreshBestParameter(boolean isMax, String objectiveValue) {
		if (StringUtils.isEmpty(bestObjectiveValue)) {
			bestObjectiveValue = objectiveValue;
			return true;
		}
		int compare = Double.compare(Double.parseDouble(objectiveValue), Double.parseDouble(bestObjectiveValue));
		if ((isMax && compare > 0) || (!isMax && compare < 0)) {
			bestObjectiveValue = objectiveValue;
			return true;
		}
		return false;
	}

}
