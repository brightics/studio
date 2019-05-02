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

package com.samsung.sds.brightics.server.common.flowrunner.model.context;

import java.util.Map.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.workflow.context.WorkflowContext;
import com.samsung.sds.brightics.common.workflow.context.parameter.ParametersBuilder;
import com.samsung.sds.brightics.common.workflow.model.Node;
import com.samsung.sds.brightics.common.workflow.model.impl.EmptyWork;
import com.samsung.sds.brightics.server.common.flowrunner.model.impl.OptWorkflow;
import com.samsung.sds.brightics.server.common.flowrunner.status.JobContextHolder;
import com.samsung.sds.brightics.server.common.flowrunner.status.Status;
import com.samsung.sds.brightics.server.common.flowrunner.variable.ModelVariableInitializer;
import com.samsung.sds.brightics.server.common.util.JsonObjectUtil;
import com.samsung.sds.brightics.server.common.util.ValidationUtil;

public class OptWorkflowBuilder {
	protected static final Logger LOGGER = LoggerFactory
			.getLogger(OptWorkflowBuilder.class);

	private final JsonObject optModel;
	private final JsonObject param;
	private final String fid;
	private final String mid;

	//opt function just have (opt model) mid
	OptWorkflowBuilder(JsonObject function, JsonObject optModels) {
		this.fid = JsonObjectUtil.getAsString(function, "fid"); // opt function id
		ValidationUtil.validateRequiredMember(function, "param");
		this.param = function.getAsJsonObject("param");
		this.mid = JsonObjectUtil.getAsString(param, "mid"); //opt model Id
		this.optModel = optModels.getAsJsonObject(mid);
	}

	public Node build() {
		ParametersBuilder paramBuilder = new ParametersBuilder();

		JsonObject props = optModel.getAsJsonObject("options");
		for (Entry<String, JsonElement> entry : props.entrySet()) {
			paramBuilder.add(entry.getKey(), entry.getValue());
		}
		paramBuilder.add("optVariables", optModel.getAsJsonObject("optVariables"));
		paramBuilder.add("mid", mid);

		OptWorkflow workflow = new OptWorkflow(fid, paramBuilder.build()) {
			@Override
			public void start(WorkflowContext context) {
				try {
					// resolve opt variable in opt model scope.
					VariableContext variableContext = context
							.getVariableContext();
					ModelVariableInitializer variableInitializer = new ModelVariableInitializer(
							optModel.getAsJsonObject("optVariables"));
					variableInitializer.setVariablesTo(variableContext);
					super.start(context);
				} catch (AbsBrighticsException e) {
					JobContextHolder.getJobStatusTracker()
							.endControlFunctionWith(this.name, Status.FAIL);
					throw e;
				}
			}
		};
		addLoopBody(workflow);
		return workflow;
	}

	private void addLoopBody(OptWorkflow workflow) {
		Node[] nodes = WorkflowBuildHelper.getNodes(optModel);
		if (nodes.length < 1) {
			nodes = new Node[] { new EmptyWork("EMPTY BODY") };
		}
		workflow.addNodes(nodes);
	}

}
