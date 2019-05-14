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

package com.samsung.sds.brightics.common.workflow.flowrunner.job.model.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.util.IdGenerator;
import com.samsung.sds.brightics.common.core.util.JsonObjectUtil;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.core.util.LoggerUtil;
import com.samsung.sds.brightics.common.workflow.context.WorkContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.flowrunner.holder.JobContextHolder;
import com.samsung.sds.brightics.common.workflow.flowrunner.status.JobStatusTracker;
import com.samsung.sds.brightics.common.workflow.flowrunner.status.Status;
import com.samsung.sds.brightics.common.workflow.model.Work;

/**
 * Just execute set data function
 * Set data function create table using prepared data. in model.
 * @author hk.im
 *
 */
public class SetDataFunction extends Work {

    private static final Logger LOGGER = LoggerFactory.getLogger(SetDataFunction.class);
    private final JsonObject functionInfo;
    private final String label;
    private final String functionName;


    public SetDataFunction(JsonObject functionInfo) {
        super(JsonObjectUtil.getAsString(functionInfo, "fid"), new ParametersBuilder().build());
        this.functionInfo = functionInfo;
        this.label = "SetDataFunction";
        this.functionName = "brightics.function.io$set_data";
    }

    @Override
    public void start(WorkContext context) {
        JobStatusTracker tracker = JobContextHolder.getJobStatusTracker();

        try {
            LoggerUtil.pushMDC("fid", name);
            LOGGER.info("[FUNCTION CHANGE TO SET DATA FUCNTION] [{}] to [{}]", JsonObjectUtil.getAsString(functionInfo, "name"), "SetDataFunction" );
            LOGGER.info("[FUNCTION START] [{}]", label);
            tracker.startFunction(this.name, label, functionName);

            runTask();

            tracker.endFunctionWith(Status.SUCCESS);
            LOGGER.info("[FUNCTION SUCCESS] [{}]", label);
        } catch (AbsBrighticsException e) {
            tracker.endFunctionWith(Status.FAIL);
            LOGGER.error("[FUNCTION ERROR] [{}]", label);
            throw e;
        } finally {
            LoggerUtil.popMDC("fid");
        }
    }

    private void runTask() {
        String taskId = IdGenerator.getSimpleId();
        JobContextHolder.getJobStatusTracker().getCurrentFunctionStatus().setTaskId(taskId);
        LoggerUtil.pushMDC("taskId", taskId);

		try {
			LOGGER.info("[TASK START]");
			ParametersBuilder pb = new ParametersBuilder(resolvedParameters);
			String mid = JobContextHolder.getJobStatusTracker().getCurrentModelMid();
			String fid = JsonObjectUtil.getAsString(functionInfo, "fid");

			JsonObject preDataObj = JobContextHolder.getPreparedDataSet().getFunctionPreparedDataSet(mid, fid);
			Map<String, String> setDataFunctionOutputs = getSetDataFunctionOutputs();
			Map<String, JsonObject> preDataMap = new HashMap<>();
			for(String outTid : setDataFunctionOutputs.keySet()) {
				if(preDataObj.has(outTid)) {
					//only set original function outputs.
					preDataMap.put(outTid, preDataObj.getAsJsonObject(outTid));
				}
			}
			
			//check validation.
			if (preDataMap.isEmpty()) {
				LOGGER.error("Cannot run set data function. "
						+ "There is no prepared data to be mapped to the outputs of the function.");
				throw new BrighticsCoreException("4421");
			} else if (setDataFunctionOutputs.size() > preDataMap.size()) {
				LOGGER.error("Cannot run set data function. "
						+ "The number of output of the original function is larger than the prepared data to be set.");
				throw new BrighticsCoreException("4422");
			}
			
			pb.add("data_set", JsonUtil.toJsonObject(preDataMap));
			Parameters params = pb.build();
			LOGGER.info("[FUNCTION PROCESSING] [{}] parameters : {}", label, params);

			JsonObject attributes = new JsonObject();
			attributes.addProperty("mid", JobContextHolder.getJobStatusTracker().getCurrentModelMid());
			attributes.addProperty("persist", getPersist());
			attributes.addProperty("label", label);
			attributes.addProperty("context", "python");
			attributes.addProperty("version", "3.6");
			attributes.add("outputs", JsonUtil.toJsonObject(setDataFunctionOutputs));
			
			// executeTask
			Object result = JobContextHolder.getJobRunnerAPI().executeTaskAndGetResult(taskId,
					JobContextHolder.getJobStatusTracker().getJobStatus().getUser(), functionName,
					params.toJsonString(), attributes.toString());
			LOGGER.info("[TASK SUCCESS] {}", result);
			
		} catch (InterruptedException e) {	
            LOGGER.error("[TASK INTERRUPTED]", e);
            String context = functionInfo.has("context") ? functionInfo.get("context").getAsString() : "";
            JobContextHolder.getJobRunnerAPI().stopTask(taskId, functionName, context);
            throw new BrighticsCoreException("3101");
        } catch (AbsBrighticsException e) {
            LOGGER.error("[TASK ERROR] {}", e.getMessage());
            throw e;
        } finally {
            LoggerUtil.popMDC("taskId");
        }
    }
    
	private Map<String, String> getSetDataFunctionOutputs() {
		Map<String, String> outputs = new HashMap<>();
		if (functionInfo.has("outputs")) {
			Set<Entry<String, JsonElement>> tidEnt = functionInfo.get("outputs").getAsJsonObject().entrySet();
			for (Entry<String, JsonElement> entry : tidEnt) {
				if (entry.getValue().isJsonPrimitive()) {
					String tid = entry.getValue().getAsString();
					outputs.put(tid, tid);
				} else {
					for (JsonElement je : entry.getValue().getAsJsonArray()) {
						String tid = je.getAsString();
						outputs.put(tid, tid);
					}
				}
			}

		} else if (functionInfo.has("outData")) {
			JsonArray asJsonArray = functionInfo.getAsJsonArray("outData");
			for (JsonElement tidElm : asJsonArray) {
				String tid = tidElm.getAsString();
				outputs.put(tid, tid);
			}
		}
		return outputs;
	}
    
    private boolean getPersist() {
		try {
			if (JobContextHolder.getJobRunnerConfig().getPersistForcedFalse()) {
				// forced persist false
				return false;
			}
			return functionInfo.has("persist") && functionInfo.get("persist").getAsBoolean();
		} catch (Exception e) {
			return false;
		}
	}

}
